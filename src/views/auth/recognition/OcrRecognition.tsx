import { /*ImageCanvas,*/ ImageCapture } from "@/components";
import { Box, Stack, Typography } from "@mui/material";
import { RefObject, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, memo } from "react";
import { useCredentialStore, useStastisticsStore } from "@/hooks";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js"
import Swal from "sweetalert2";
import './styles.css'
import { round } from "@/helpers"
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

   const isWithinErrorRange = (text1: string, str2: string): boolean => {
      const text2 = str2.replace(/[^a-zA-Z0-9-]/g, '')
      console.log("***************************************************")
      console.log("TEXTO RECONOCIDO: \n-->\t", text2)
      console.log("***************************************************")
      if (text2.includes(text1)) return true
      let coincidence = 0
      for (let i = 0; i < text2.length; i++) {
         for (let j = 0; j < text1.length; j++) {
            if (text2[i] === text1[j] && text2[i + 1] === text1[j + 1]) {
               coincidence++
            }
         }
      }
      if (coincidence < text1.length - 3) {
         return false
      }
      else if (coincidence == 0) return false
      return true
   }

   const handleImageCapture = useCallback((image: string, text: string) => {
      setImage(image)
      if (isWithinErrorRange(identityCard, text)) {
         changeStep('previousFaceRecognition')
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
         facial_recognition: false
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
                     label: round(detection.score).toString(),
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
      <Box sx={{
         display: 'flex',
         justifyContent: 'center',
         alignItems: 'center',
         height: '70vh'
      }}>
         <Stack>
            <Typography style={{ fontSize: '2vw', display: image ? 'none' : 'flex'}} align="center">
               Coloque su Cédula de identidad
            </Typography>
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
   )
}))