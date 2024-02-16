
import { Grid } from "@mui/material";
import { RefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FaceRecognition, OcrView } from ".";
import Webcam from "react-webcam";
import { useCredentialStore } from "@/hooks";
import { setIdentityCard } from "@/store";

type OcrViewRef = {
   onCapture: () => void;
   onPlaying: () => void;
};

type reconigtionViewRef = {
   onScanImage: () => void;
   onRemoveCam: () => void;
   onPlaying:   () => void;
};

export const RecognitionView = forwardRef((_, ref) => {

   useImperativeHandle(ref, () => ({
      onRemoveCam:  () => reconigtionViewRef.current!.onRemoveCam(),
      action: async () => {
         setStatePerson(null)
         setIdentityCard(null)
         await ocrViewRef.current!.onCapture()
      }
   }));

   const ocrViewRef                                    = useRef<OcrViewRef | null>(null);
   const imageRef: RefObject<HTMLImageElement>         = useRef(null);
   const canvasImageRef: RefObject<HTMLCanvasElement>  = useRef(null);
   const reconigtionViewRef                            = useRef<reconigtionViewRef | null>(null);
   const webcamRef: RefObject<Webcam>                  = useRef(null);
   const canvasWebcamRef: RefObject<HTMLCanvasElement> = useRef(null);

   const [imageCapture, setImageCapture]           = useState<string  | null>(null);
   const [stateIdentityCard, setStateIdentityCard] = useState<boolean | null>(null);
   const [statePerson, setStatePerson]             = useState<boolean | null>(null);
   const [stateLastName, setStateLastName]         = useState<boolean | null>(null);

   const { changeIdentifyUser, changeTimer, changeStep } = useCredentialStore();

   const setImage = async (image: string | null) => {
      setImageCapture(image);
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (reconigtionViewRef.current) {
         await reconigtionViewRef.current!.onScanImage();
      }
   };

   // Si el reconocimiento fue todo bien
   useEffect(() => {
      // console.log("stateIdentityCard", stateIdentityCard)
      // console.log("statePerson", statePerson)
      // if (stateIdentityCard || statePerson) {
      //   setTimeout(() => changeStep('home'), 5000)
      //   reconigtionViewRef.current!.onRemoveCam()
      //   changeIdentifyUser(true);
      //   changeTimer(40)
      // } else {
      //   setImage(null)
      //   ocrViewRef.current!.onPlaying()
      // }

      // if(stateIdentityCard && statePerson ) {
      //   console.log("RECONOCIDO POR SU CARNET")
      //   setTimeout(() =>  changeStep('home'), 5000)
      //   reconigtionViewRef.current!.onRemoveCam()
      //   changeIdentifyUser(true)
      //   changeTimer(40)
      // } else if(stateLastName && statePerson) {
      //   console.log("RECONOCIDO POR SU NOMBRE")
      //   setTimeout(() =>  changeStep('home'), 5000)
      //   reconigtionViewRef.current!.onRemoveCam()
      //   changeIdentifyUser(true)
      //   changeTimer(40)
      // } else {
      //   console.log("NO RECONOCIDO")
      //   setImage(null)
      //   ocrViewRef.current!.onPlaying()
      // }

      if (stateIdentityCard && statePerson) {
         // console.log("Reconocido por su carnet de identidad y la fotografia")
         setTimeout(() => changeStep('home'), 5000)
         reconigtionViewRef.current!.onRemoveCam()
         changeIdentifyUser(true)
         changeTimer(40)
      } else if (stateIdentityCard && stateLastName) {
         // console.log("Reconocido por su carnet de identidad y su nombre")
         setTimeout(() => changeStep('home'), 5000)
         reconigtionViewRef.current!.onRemoveCam()
         changeIdentifyUser(true)
         changeTimer(40)
      } else {
         // console.log("No reconocido")
         setImage(null)
         ocrViewRef.current!.onPlaying()
      }
   }, [stateIdentityCard, statePerson])

   return (
      <Grid container alignItems="end" sx={{ marginTop: '50px' }}>
         <Grid sx={{ p: .5 }} container item sm={6} justifyContent="center" height="100%">
            <OcrView
               ref={ocrViewRef}
               imageRef={imageRef}
               canvasImageRef={canvasImageRef}
               image={imageCapture}
               setImage={setImage}
               webcamRef={webcamRef}
               canvasWebcamRef={canvasWebcamRef}
               isIdentityCard={(state: boolean) => {
                  setStateIdentityCard(state)
                  if (!state) {
                     ocrViewRef.current!.onPlaying()
                  }
               }}
               isLastName={(state: boolean) => {
                  setStateLastName(state)
                  if (!state) {
                     ocrViewRef.current!.onPlaying()
                  }
               }}
            />
         </Grid>
         <Grid item xs={12} sm={6} height="100%">
            <FaceRecognition
               ref={reconigtionViewRef}
               imageRef={imageRef}
               canvasImageRef={canvasImageRef}
               image={imageCapture}
               webcamRef={webcamRef}
               canvasWebcamRef={canvasWebcamRef}
               isPerson={(state: boolean) => {
                  setStatePerson(state)
                  // ocrViewRef.current!.onPlaying()
               }}
            />
         </Grid>
      </Grid>
   );
});
