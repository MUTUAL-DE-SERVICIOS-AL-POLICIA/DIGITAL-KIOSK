import { /*ImageCanvas,*/ ImageCapture } from "@/components";
import { Box, Card, Grid, Stack, Typography } from "@mui/material";
import { RefObject, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, memo } from "react";
import { useCredentialStore, useStastisticsStore } from "@/hooks";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js"
import Swal from "sweetalert2";
import './styles.css'
import { useAuthStore } from "@/hooks/useAuthStore";
import { base64toBlob } from "@/helpers";

const TINY_OPTIONS = {
   inputSize: 320,
   scoreThreshold: 0.5
}

type ImageViewRef = {
   onCapture: () => void
}

export const OcrView = memo(forwardRef((_, ref) => {

   useImperativeHandle(ref, () => ({
      action: async () => {
         await imageCaptureRef.current!.onCapture()
      },
      onRemoveCam: () => cleanup()

   }))

   let intervalWebCam: NodeJS.Timeout

   const [image, setImage] = useState<string | null>(null)

   const imageCaptureRef: RefObject<ImageViewRef> = useRef(null)
   const webcamRef: RefObject<Webcam> = useRef(null)
   const canvasWebcamRef: any = useRef(null)

   const { identityCard, changeStep, changeImage, changeRecognizedByOcr, changeLoadingGlobal, savePhoto } = useCredentialStore()
   const { changeOcrState } = useStastisticsStore()
   const { authMethodRegistration, user } = useAuthStore()
   const { leftText, middleText, rightText } = useStastisticsStore()

   const cleanup = useCallback(() => {
      intervalWebCam && clearInterval(intervalWebCam);
      // @ts-expect-error type is not known
      if (webcamRef.current) webcamRef.current.srcObject.getTracks().forEach((track: MediaStreamTrack) => track.stop());

   }, [webcamRef]);

   const getLocalUserVideo = async () => {
      try {
         const environmentStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "environment" } })
         // @ts-expect-error type is not known
         webcamRef?.current && (webcamRef.current.srcObject = environmentStream)
      } catch (error) {
         console.error("Error:", error)
      }
   }

   const findSimilarSubstring = (needle:string, haystack:string) => {
      const MARGIN_OF_ERROR = 2
      // Primero intentamos buscar la cadena completa (needle) en haystack
      let foundIndex = haystack.indexOf(needle)

      // Si encontramos una coincidencia exacta, la devolvemos
      if(foundIndex !== -1) {
         return { found: true, index: foundIndex }
      } else {
         foundIndex = needle.indexOf(haystack)
         if(foundIndex !== -1) {
            return { found: true, index: foundIndex }
         }
      }

      // Si no la encontramos, probamos con cadenas más pequeñas
      for(let i = 0; i < needle.length; i++) {
         if( i > MARGIN_OF_ERROR ) break;
         const subNeedle1 = needle.slice(0, needle.length - i) // Eliminando desde el final
         const subNeedle2 = needle.slice(i) // Eliminado desde el inicio

         // Buscamos en la cadena más grande (haystack)
         if(haystack.includes(subNeedle1)) {
            return { found: true, index: haystack.indexOf(subNeedle1), modified: subNeedle1}
         }
         if(haystack.includes(subNeedle2)) {
            return { found: true, index: haystack.indexOf(subNeedle2), modified: subNeedle2}
         }
      }
      // Si no encontramos ninguna coincidencia
      return { found: false }

   }


   const isWithinErrorRange = (enteredText: string, previouslyRecognizedText: string): boolean => {
      const recognizedText = previouslyRecognizedText.replace(/[^a-zA-Z0-9-]/g, '')
      console.log("***************************************************")
      console.log("TEXTO RECONOCIDO: \n-->\t\t", recognizedText)
      console.log("***************************************************")
      console.log("TEXTO INGRESADO: \n-->\t\t", enteredText)
      console.log("***************************************************")
      // const needle = "1213332"
      // const needle = "9948"
      // const haystack = "018994084"
      // console.log("needle: ",needle)
      // console.log("haystack: ",haystack)
      // const result = findSimilarSubstring(needle, haystack)
      const result = findSimilarSubstring(enteredText, recognizedText)
      if(result.found) {
         console.log(`Cadena encontrada en el indice ${result.index} con la variante: ${result.modified || enteredText}`)
      } else {
         console.log("No se encontró ninguna coincidencia")
      }
      return false
      // if (recognizedText.includes(enteredText)) return true
      // let coincidence = 0
      // for (let i = 0; i < recognizedText.length; i++) {
      //    for (let j = 0; j < enteredText.length; j++) {
      //       if (recognizedText[i] === enteredText[j] && recognizedText[i + 1] === enteredText[j + 1]) {
      //          coincidence++
      //       }
      //    }
      // }
      // if (coincidence < enteredText.length - 3) {
      //    return false
      // }
      // else if (coincidence == 0) return false
      // return true
   }

   const handleImageCapture = useCallback((image: string, text: string) => {
      setImage(image)
      if (isWithinErrorRange(identityCard, text)) {
         // changeStep('previousFaceRecognition')
         changeStep('faceRecognition')
         changeRecognizedByOcr(true)
         changeImage(image)
         cleanup()
         changeOcrState(true)
         savePhoto({affiliateId: user.nup, photo_ci: base64toBlob(image)})
      } else {
         setImage(null)
         getLocalUserVideo()
         changeOcrState(false)
         sendStatistics()
         Swal.fire({
            position: "center",
            icon: "warning",
            title: "Intente de nuevo",
            showConfirmButton: false,
            timer: 2000
         });
      }
   }, [image, changeImage])

   const sendStatistics = () => {
      const body = {
         identity_card: identityCard,
         left_text: leftText,
         middle_text: middleText,
         right_text: rightText,
         ocr_state: false,
         facial_recognition: false,
         affiliate_id: user.nup
      }
      authMethodRegistration(body)
   }

   const isFaceDetectionModelLoad = () => !!faceapi.nets.tinyFaceDetector.params;

   const scanWebcam = async () => {
      if (!isFaceDetectionModelLoad) return;
      const options = new faceapi.TinyFaceDetectorOptions(TINY_OPTIONS)
      intervalWebCam = setInterval(async () => {
         if (!webcamRef.current) clearInterval(intervalWebCam)
         else {
            const imageSrc = webcamRef.current.getScreenshot()
            if (!imageSrc) return
            const img = await faceapi.fetchImage(imageSrc)
            const detections = await faceapi.detectAllFaces(img, options)
               .withFaceLandmarks()
               .withFaceDescriptors()
            if (canvasWebcamRef.current && img) {
               const dims = faceapi.matchDimensions(canvasWebcamRef.current, img, true)
               const resizedDetections = faceapi.resizeResults(detections, dims)
               detections.forEach(({ detection }) =>{
                  const boxStyle = {
                     label: 'Persona',
                     lineWidth: 3,
                     boxColor: "green",
                     drawLabel: true,
                  }
                  new faceapi.draw.DrawBox(detection.box, boxStyle).draw(canvasWebcamRef.current)
               })
               faceapi.draw.drawFaceLandmarks(canvasWebcamRef.current, resizedDetections)
            }
         }
      }, 60)
   }

   const loadModels = async () => {
      const uri = "/models"
      await Promise.all([
         faceapi.nets.tinyFaceDetector.loadFromUri(uri),
         faceapi.nets.ssdMobilenetv1.loadFromUri(uri),
         faceapi.nets.faceLandmark68Net.loadFromUri(uri),
         faceapi.nets.faceRecognitionNet.loadFromUri(uri)
      ])
   }

   useEffect(() => {
      changeLoadingGlobal(true)
      loadModels().then(async () => {
         await scanWebcam()
         await getLocalUserVideo()
         changeLoadingGlobal(false)
      }).catch(() => console.error("No se cargaron los modelos"))
   }, [])

   return (
      <Grid container alignItems="center" >
         <Grid item container sm={6} direction="column" justifyContent="space-between">
            <Card sx={{ mx: 10, borderRadius: '30px', p: 2}} variant="outlined">
               <Typography sx={{ p: 2 }} align="center" style={{ fontSize: '2.5vw', fontWeight: 500 }}>
                  Deposite su <b>carnet de identidad</b> en el <b>soporte inferior</b> y presione en <b>continuar</b>.<br/>
               </Typography>
            </Card>
         </Grid>
         <Grid item container sm={6} direction="column">
            <Box sx={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               height: '70vh'
            }}>
               <Stack>
                  {
                     image == null && (
                        <ImageCapture
                           onChange={handleImageCapture}
                           ref={imageCaptureRef}
                           webcamRef={webcamRef}
                           canvasWebcamRef={canvasWebcamRef}
                        />
                     )
                  }
               </Stack>
            </Box>
         </Grid>
      </Grid>
   )
}))