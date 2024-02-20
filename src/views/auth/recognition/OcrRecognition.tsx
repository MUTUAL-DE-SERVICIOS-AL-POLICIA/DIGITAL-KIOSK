import { ImageCanvas, ImageCapture } from "@/components";
import { Box, Stack, Typography } from "@mui/material";
import { RefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useCredentialStore } from "@/hooks";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js"

const TINY_OPTIONS = {
   inputSize: 320,
   scoreThreshold: 0.5
}

type ImageViewRef = {
   onCapture: () => void
}

export const OcrView = forwardRef((_, ref) => {

   useImperativeHandle(ref, () => ({
      action: async () => {
         await imageCaptureRef.current!.onCapture()
      }
   }))

   let intervalWebCam: NodeJS.Timeout

   const [image, setImage] = useState<string | null>(null)

   const imageCaptureRef: RefObject<ImageViewRef> = useRef(null)
   const webcamRef: RefObject<Webcam> = useRef(null)
   const canvasWebcamRef: RefObject<HTMLCanvasElement> = useRef(null)
   const imageRef: RefObject<HTMLImageElement> = useRef(null)
   const canvasImageRef: RefObject<HTMLCanvasElement> = useRef(null)


   const { identityCard, changeStep, changeTimer, changeImage } = useCredentialStore()

   const getLocalUserVideo = async () => {
      try {
         const environmentStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "environment" } })
         // @ts-ignore
         webcamRef?.current && (webcamRef.current.srcObject = environmentStream)
      } catch (error) {
         console.error("Error:", error)
      }
   }

   const isWithinErrorRange = (text1: string, str2: string): boolean => {
      const text2 = str2.replace(/[^a-zA-Z0-9-]/g, '')
      console.log("text1", text1)
      console.log("text2", text2)
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

   const handleImageCapture = (image: string, text: string) => {
      setImage(image)
      if (isWithinErrorRange(identityCard, text)) {
         // guardamos en el contexto
         // necesito apagar la camara
         setTimeout(() => changeStep('previousFaceRecognition'), 1000)
         // changeIdentifyUser(true)
         changeImage(image)
         changeTimer(40)
      } else {
         // No reconoció la imagen
         setImage(null)
         getLocalUserVideo()
      }
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
               faceapi.draw.drawDetections(canvasWebcamRef.current, resizedDetections)
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
      loadModels().then(async () => {
         await scanWebcam()
         await getLocalUserVideo()
      }).catch(() => console.error("No se cargaron los modelos"))
   }, [])

   return (
      <Box sx={{
         display: 'flex',
         justifyContent: 'center',
         alignItems: 'center',
         height: '100vh'
      }}>
         <Stack spacing={2} style={{ width: '45vh' }} sx={{ paddingLeft: 5 }}>
            <Typography style={{ fontSize: '1.5vw' }}>
               Coloque su Cédula de identidad
            </Typography>
            {
               image == null ?
                  <ImageCapture
                     onChange={handleImageCapture}
                     ref={imageCaptureRef}
                     webcamRef={webcamRef}
                     canvasWebcamRef={canvasWebcamRef}
                  />
                  :
                  <ImageCanvas
                     imageRef={imageRef}
                     canvasImageRef={canvasImageRef}
                     src={image}
                  />
            }
         </Stack>
      </Box>
   )

})