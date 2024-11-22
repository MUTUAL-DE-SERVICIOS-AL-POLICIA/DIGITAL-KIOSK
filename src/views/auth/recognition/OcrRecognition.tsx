import { ImageCapture } from "@/components";
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

   const setManualFocus = async (stream: MediaStream, focusDistance: number) => {
      const track = stream.getVideoTracks()[0];
      const capabilities: any = track.getCapabilities();
      // Configura el enfoque si está disponible
      if (
         capabilities.focusMode &&
         capabilities.focusMode.includes("manual")
      ) {
         const constraints: any = {
            focusMode: "manual",
            focusDistance: focusDistance,
         };
         await track.applyConstraints(constraints);
         console.log("Enfoque manual aplicado:", track.getSettings());
      } else {
         console.log(
            "El enfoque manual no es compatible con este dispositivo."
         );
      }
   }

   const getLocalUserVideo = async () => {
      try {
         const environmentStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "environment" } })
         setManualFocus(environmentStream, 160);
         // @ts-expect-error type is not known
         webcamRef?.current && (webcamRef.current.srcObject = environmentStream)
      } catch (error) {
         console.error("Error:", error)
      }
   }

   const findSimilarSubstring = (needle: string, haystack: string) => {
      // ? falsos positivos: cuando el número de carnet digitado y el carnet introducido
      // ? solo varian por dos digitos al inicio y final. Ej. (inicio) 8900123, 1100123
      // ? Ej. (final) 8900123, 8900178
      const MARGIN_OF_ERROR = 2
      const NEEDLE_MIN_LENGTH = 4
      const HAYSTACK_MIN_LENGTH = NEEDLE_MIN_LENGTH - MARGIN_OF_ERROR
      // Longitudes minimas permitidas
      if(needle.length < NEEDLE_MIN_LENGTH && haystack.length < HAYSTACK_MIN_LENGTH)
         return { found: false }
      // Primero intentamos buscar la cadena completa (needle) en haystack
      let foundIndex = haystack.indexOf(needle)
      // Si encontramos una coincidencia exacta, la devolvemos
      if (foundIndex !== -1) return { found: true, index: foundIndex }
      // Si no la encontramos, probamos con cadenas más pequeñas
      for (let i = 1; i <= MARGIN_OF_ERROR; i++) {
         const subNeedle1 = needle.slice(0, needle.length - i) // Eliminando desde el final
         const subNeedle2 = needle.slice(i) // Eliminado desde el inicio
         // Buscamos en las cadenas recortadas en el pajar
         if (haystack.includes(subNeedle1))
            return { found: true, index: haystack.indexOf(subNeedle1), modified: subNeedle1 }
         if (haystack.includes(subNeedle2))
            return { found: true, index: haystack.indexOf(subNeedle2), modified: subNeedle2 }
      }
      // Si no encontramos ninguna coincidencia
      return { found: false }
   }

   const isWithinErrorRange = (previouslyEnteredText: string, previouslyRecognizedText: string): boolean => {
      const enteredText = previouslyEnteredText.replace(/[^\d]/g, '')
      const recognizedText = previouslyRecognizedText.replace(/[\s]/g, '')
      console.log("***************************************************")
      console.log("TEXTO INGRESADO: \n-->\t", enteredText)
      console.log("***************************************************")
      console.log("TEXTO RECONOCIDO: \n-->\t", recognizedText)
      console.log("***************************************************")
      const result = findSimilarSubstring(enteredText, recognizedText)
      if (result.found) {
         console.log(`Cadena encontrada en el indice ${result.index} con la variante: ${result.modified || enteredText}`)
         return true;
      }
      console.log("No se encontró ninguna coincidencia")
      return false
   }

   const handleImageCapture = useCallback((image: string, text: string) => {
      setImage(image)
      if (isWithinErrorRange(identityCard, text)) {
         changeStep('faceRecognition')
         changeRecognizedByOcr(true)
         changeImage(image)
         cleanup()
         changeOcrState(true)
         savePhoto({ affiliateId: user.nup, photo_ci: base64toBlob(image) })
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
               detections.forEach(({ detection }) => {
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
            <Card sx={{ mx: 10, borderRadius: '30px', p: 2 }} variant="outlined">
               <Typography sx={{ p: 2 }} align="center" style={{ fontSize: '2.5vw', fontWeight: 500 }}>
                  Deposite su <b>carnet de identidad</b> en el <b>soporte inferior</b> y presione en <b>continuar</b>.<br />
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