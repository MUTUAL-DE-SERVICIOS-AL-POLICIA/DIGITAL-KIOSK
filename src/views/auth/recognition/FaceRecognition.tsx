import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, memo } from "react"
import * as faceapi from "face-api.js"
import { Box, Stack, Typography } from "@mui/material";
import { useCredentialStore, useStastisticsStore } from "@/hooks";
import { useAuthStore } from "@/hooks/useAuthStore";
import { base64toBlob } from "@/helpers"

const TINY_OPTIONS = {
   inputSize: 320,
   scoreThreshold: 0.5
}

const TINY_OPTIONS_PHOTO = {
   inputSize: 608,
   scoreThreshold: 0.6
}

let faceMatcher: any = null

interface GroupedDescriptors {
   [key: string]: any[]
}

export const FaceRecognition = memo(forwardRef((_, ref) => {

   const { image, changeRecognizedByFacialRecognition, ocr, changeIdentifyUser, changeStep, changeLoadingGlobal, identityCard, savePhoto } = useCredentialStore()
   const { ocrState, leftText, middleText, rightText } = useStastisticsStore()
   const { authMethodRegistration, user } = useAuthStore()

   const videoRef: any       = useRef()
   const canvasVideoRef: any = useRef()

   let intervalVideo:  NodeJS.Timeout
   let img: any

   useImperativeHandle(ref, () => ({
      onRemoveCam: () => cleanup(),
      onPlaying:   () => getLocalUserVideo(),
      action:  () => scanPhoto()
   }));

   const cleanup = useCallback(() => {
      intervalVideo && clearInterval(intervalVideo);

      if (videoRef.current) videoRef.current.srcObject.getTracks().forEach((track: MediaStreamTrack) => track.stop());

   }, [videoRef]);


   /* Carga de modelos */
   useEffect(() => {
      changeLoadingGlobal(true)
      loadModels().then(async () => {
         await scanFace();
         await getLocalUserVideo();
         changeLoadingGlobal(false)
      }).catch(() => console.error("No se cargaron los modelos"))
   }, [])

   const loadModels = async () => {
      const uri = "/models";
      await Promise.all([
         faceapi.nets.tinyFaceDetector.loadFromUri(uri),
         faceapi.nets.ssdMobilenetv1.loadFromUri(uri),
         faceapi.nets.faceLandmark68Net.loadFromUri(uri),
         faceapi.nets.faceRecognitionNet.loadFromUri(uri),
      ]);
   }

   const getLocalUserVideo = async () => {
      try {
         const userStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "user" } });
         videoRef?.current && (videoRef.current.srcObject = userStream);

         // SOLO PARA DESARROLLO
         // const streams = await getAllCameras();
         // videoRef?.current && (videoRef.current.srcObject = streams[0])
      } catch (error) {
         console.error("Error:", error);
      }
   };

   // // @ts-expect-error used for development
   // const getAllCameras = async () => {
   //    try {
   //       const devices = await navigator.mediaDevices.enumerateDevices()
   //       const videoDevices = devices.filter(device => device.kind === 'videoinput')

   //       const streams = await Promise.all(videoDevices.map(async device => {
   //          try {
   //             return await navigator.mediaDevices.getUserMedia({
   //                audio: false,
   //                video: {
   //                   deviceId: { exact: device.deviceId }
   //                }
   //             })
   //          } catch (error) {
   //             console.error(`Error al acceder a la cámara ${device.label}`)
   //             return null
   //          }
   //       }))
   //       return streams.filter(stream => stream !== null)
   //    } catch (error) {
   //       console.error("Error al enumerar dispositivos", error)
   //       return []
   //    }
   // }

   const isFaceDetectionModelLoad = () => !!faceapi.nets.tinyFaceDetector.params;

   const groupDescriptorsByName = (faceDescriptors: any) =>
      faceDescriptors.reduce((groupedDescriptors: GroupedDescriptors, { descriptor }: { descriptor: any }, index: number) => {
         const name = `persona ${index}`;
         groupedDescriptors[name] = [...(groupedDescriptors[name] || []), descriptor];
         return groupedDescriptors;
      }, {});

   const scanFace = async () => { // video
      if (!isFaceDetectionModelLoad()) return;

      const options = new faceapi.TinyFaceDetectorOptions(TINY_OPTIONS);

      intervalVideo = setInterval(async () => {
         const detections = await faceapi.detectAllFaces(videoRef.current, options)
            .withFaceLandmarks()
            .withFaceDescriptors();

         const groupedDescriptors = groupDescriptorsByName(detections);
         const labeledDescriptors = Object.keys(groupedDescriptors).map(
            (name) => new faceapi.LabeledFaceDescriptors(name, groupedDescriptors[name])
         );

         if (labeledDescriptors.length > 0) {
            faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
            if (videoRef.current != null) {
               const dims = faceapi.matchDimensions(canvasVideoRef.current, videoRef.current, true);
               const resizedDetections = faceapi.resizeResults(detections, dims);
               resizedDetections.forEach(({ detection, descriptor }) => {
                  let label = faceMatcher.findBestMatch(descriptor).toString();
                  label = label.substring(0, 9)
                  const boxStyle = {
                     label: `${label}`,
                     lineWidth: 2,
                     boxColor: "green",
                     drawLabel: true,
                  };
                  new faceapi.draw.DrawBox(detection.box, boxStyle).draw(canvasVideoRef.current);
               });
               faceapi.draw.drawFaceLandmarks(canvasVideoRef.current, resizedDetections);
            }
         } else {
            if (canvasVideoRef.current != null) {
               const ctx = canvasVideoRef.current.getContext('2d', { willReadFrequently: true });
               ctx.clearRect(0, 0, canvasVideoRef.current.width, canvasVideoRef.current.height);
            }
         }
      }, 60);
   };

   const scanPhoto = async () => { // imagen
      changeLoadingGlobal(true)
      try {
         if (!image || !isFaceDetectionModelLoad()) {
            console.error("No se cargaron los modelos o no existe la imágen")
            return;
         }
         const options = new faceapi.TinyFaceDetectorOptions(TINY_OPTIONS_PHOTO);
         img = await faceapi.fetchImage(image);

         // creando el elemento
         const canvas = document.createElement('canvas')

         img.onload = () => {
            const width = img.width
            const height = img.height
            canvas.width = width
            canvas.height = height
         }

         const detections = await faceapi.detectAllFaces(img, options)
            .withFaceLandmarks()
            .withFaceDescriptors();

         if (detections.length === 0) {
            changeLoadingGlobal(false)
            sendStatistics(false)
            if(ocr) operative({ step: 'home', identifyUser: true})
            console.error("No existe detecciones")
         }

         if (!canvas && !img) {
            changeLoadingGlobal(false)
            sendStatistics(false)
            if(ocr) operative({ step: 'home', identifyUser: true})
            console.error("No existe el canvas o imagen")
         }

         faceapi.matchDimensions(canvas, img);
         const resizeResults = faceapi.resizeResults(detections, img);

         if (resizeResults.length === 0) {
            changeLoadingGlobal(false)
            sendStatistics(false)
            console.error("No existe resizeResults")
            if(ocr) operative({step: 'home', identifyUser: true})
            return;
         }

         resizeResults.some(async ({ detection, descriptor }) => {
            if(faceMatcher) {
               let label = faceMatcher.findBestMatch(descriptor).toString();
               let options = null;
               if (!label.includes('unknown')) {
                  if(videoRef.current !== null) {
                     const video = videoRef.current
                     if(!video.paused && video.readyState === 4) {
                        const cvs = document.createElement('canvas')
                        cvs.width = video.videoWidth
                        cvs.height = video.videoHeight
                        const ctx = cvs.getContext('2d')
                        ctx?.drawImage(video, 0, 0, cvs.width, cvs.height)
                        const imageDataURL = cvs.toDataURL('image/jpeg')
                        savePhoto({affiliateId: user.nup, photo_face: base64toBlob(imageDataURL)})
                     }
                  }
                  label = `Persona encontrada`;
                  options = { label, boxColor: 'green' };
                  changeRecognizedByFacialRecognition(true)
                  console.log("================================")
                  console.log("RECONOCE EL ROSTRO")
                  console.log("================================")
                  sendStatistics(true)
                  operative({step: 'home', identifyUser: true})
                  return true
               } else {
                  label = `Persona no encontrada`;
                  options = { label };
                  console.log("================================")
                  console.log("NO RECONOCE EL ROSTRO")
                  console.log("================================")
                  if(ocr) operative({step: 'home', identifyUser: true})
                  sendStatistics(false)
               }
               new faceapi.draw.DrawBox(detection.box, options).draw(canvas);
            }
         });
         faceapi.draw.drawFaceLandmarks(canvas, resizeResults);
         changeLoadingGlobal(false)
      } catch (error:any) {
         changeLoadingGlobal(false)
         console.error("Error con la cámara del rostro: ", error)
      }
   }

   const sendStatistics = async (faceState: boolean) => {
      const body = {
         identity_card: identityCard,
         left_text: leftText,
         middle_text: middleText,
         right_text: rightText,
         ocr_state: ocrState,
         facial_recognition: faceState,
         affiliate_id: user.nup
      }
      authMethodRegistration(body)
   }

   const operative = ({step, identifyUser} : {step: string, identifyUser: boolean}) => {
      changeStep(step)
      changeIdentifyUser(identifyUser)
      cleanup()
   }

   return (
      <Box sx={{
         display: 'flex',
         justifyContent: 'center',
         alignItems: 'center',
         height: '70vh'
      }}
      >
         <Stack spacing={2} >
            <Typography style={{ fontSize: '2vw' }} align="center">
               Reconocimiento Facial
            </Typography>
            <Stack >
               <video
                  muted
                  autoPlay
                  ref={videoRef}
                  style={{
                     objectFit: "fill",
                     borderRadius: '30px',
                     backgroundColor: '#fff',
                     padding: '10px',
                     width: '40vw',
                     height: '30vw'
                  }}
               />
               <canvas
                  ref={canvasVideoRef}
                  style={{
                     position: "absolute",
                     pointerEvents: "none",
                     padding: '10px',
                     width: '40vw',
                     height: '30vw'
                  }}
               />
            </Stack>
         </Stack>
      </Box>
   );
}));
