import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, memo } from "react"
import * as faceapi from "face-api.js"
import { Box, Stack, Typography } from "@mui/material";
import { useCredentialStore, useStastisticsStore } from "@/hooks";
import Swal from "sweetalert2";
import { useAuthStore } from "@/hooks/useAuthStore";

const TINY_OPTIONS = {
   inputSize: 320,
   scoreThreshold: 0.5
}

let faceMatcher: any = null;

interface GroupedDescriptors {
   [key: string]: any[];
}

export const FaceRecognition = memo(forwardRef((_, ref) => {

   const { image, changeRecognizedByFacialRecognition, ocr, changeIdentifyUser, changeStep, changeLoadingGlobal, identityCard } = useCredentialStore()
   const { ocrState, leftText, middleText, rightText } = useStastisticsStore()
   const { authMethodRegistration } = useAuthStore()

   const videoRef: any       = useRef();
   const canvasVideoRef: any = useRef();

   let intervalVideo:  NodeJS.Timeout;
   let img: any;

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
                  const label = faceMatcher.findBestMatch(descriptor).toString();
                  const boxStyle = {
                     label,
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
               const ctx = canvasVideoRef.current.getContext('2d');
               ctx.clearRect(0, 0, canvasVideoRef.current.width, canvasVideoRef.current.height);
            }
         }
      }, 60);
   };

   const scanPhoto = async () => { // imagen
      changeLoadingGlobal(true)
      try {
         if (!image || !isFaceDetectionModelLoad()) return;
         const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 608, scoreThreshold: 0.6 });
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
            Swal.fire({
               position: "center",
               icon: "warning",
               title: "Intente de nuevo",
               showConfirmButton: false,
               timer: 2000
            });
            return;
         }

         if (!canvas && !img) {
            changeLoadingGlobal(false)
            console.error("No existe el canvas o imagen")
            // Swal.fire({
            //    position: "center",
            //    icon: "warning",
            //    title: "Intente de nuevo",
            //    showConfirmButton: false,
            //    timer: 2000
            // });
            return;
         }

         faceapi.matchDimensions(canvas, img);
         const resizeResults = faceapi.resizeResults(detections, img);

         if (resizeResults.length === 0) {
            changeLoadingGlobal(false)
            console.error("No existe resizeResults")
            // Swal.fire({
            //    position: "center",
            //    icon: "warning",
            //    title: "Intente de nuevo",
            //    showConfirmButton: false,
            //    timer: 2000
            // });
            return;
         }

         resizeResults.some(({ detection, descriptor }) => {
            if(faceMatcher) {
               let label = faceMatcher.findBestMatch(descriptor).toString();
               let options = null;
               if (!label.includes('unknown')) {
                  label = `Persona encontrada`;
                  options = { label, boxColor: 'green' };
                  changeRecognizedByFacialRecognition(true)
                  changeStep('home')
                  changeIdentifyUser(true)
                  console.log("================================")
                  console.log("RECONOCE EL ROSTRO")
                  console.log("================================")
                  cleanup()
                  // changeFaceRecognitionS(true)
                  sendStatistics(true)
                  return true
               } else {
                  label = `Persona no encontrada`;
                  options = { label };
                  console.log("================================")
                  console.log("NO RECONOCE EL ROSTRO")
                  console.log("================================")
                  // changeFaceRecognitionS(false)
                  if(ocr) {
                     changeStep('home')
                     changeIdentifyUser(true)
                     cleanup()
                  }
                  sendStatistics(false)
               }
               new faceapi.draw.DrawBox(detection.box, options).draw(canvas);
            }
         });
         faceapi.draw.drawFaceLandmarks(canvas, resizeResults);
         changeLoadingGlobal(false)
      } catch (error:any) {
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
         facial_recognition: faceState
      }
      authMethodRegistration(body)
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
