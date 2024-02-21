import { ImageCanvas, ImageCapture } from "@/components";
import { Box, Stack, Typography } from "@mui/material";
import { RefObject, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useCredentialStore } from "@/hooks";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js"
import { TimerContext } from "@/context/TimerContext";
import Swal from "sweetalert2";
import './styles.css'

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
      },
      onRemoveCam: () => cleanup()

   }))

   const { resetTimer } = useContext(TimerContext)

   let intervalWebCam: NodeJS.Timeout

   const [image, setImage] = useState<string | null>(null)

   const imageCaptureRef: RefObject<ImageViewRef> = useRef(null)
   const webcamRef: RefObject<Webcam> = useRef(null)
   const canvasWebcamRef: RefObject<HTMLCanvasElement> = useRef(null)
   const imageRef: RefObject<HTMLImageElement> = useRef(null)
   const canvasImageRef: RefObject<HTMLCanvasElement> = useRef(null)

   const { identityCard, changeStep, changeImage, changeRecognizedByOcr, changeLoadingGlobal } = useCredentialStore()

   const cleanup = useCallback(() => {
      intervalWebCam && clearInterval(intervalWebCam);
      // @ts-ignore
      if (webcamRef.current) webcamRef.current.srcObject.getTracks().forEach((track: MediaStreamTrack) => track.stop());

   }, [webcamRef]);

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

   const handleImageCapture = (image: string, text: string) => {
      setImage(image)
      if (isWithinErrorRange(identityCard, text)) {
         setTimeout(() => changeStep('previousFaceRecognition'), 1000)
         changeRecognizedByOcr(true)
         changeImage(image)
         resetTimer()
         cleanup()
      } else {
         setImage(null)
         getLocalUserVideo()
         Swal.fire({
            position: "center",
            icon: "warning",
            title: "Intente de nuevo",
            showConfirmButton: false,
            timer: 2000
         });
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