
import { ComponentButton } from "@/components";
import { Grid, Stack, Typography } from "@mui/material";
import { RefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FaceRecognition, OcrView } from ".";
import Webcam from "react-webcam";
import { useCredentialStore } from "@/hooks";
import { useAuthStore } from "@/hooks/useAuthStore";

type OcrViewRef = {
  onCapture: () => void;
};

type reconigtionViewRef = {
  onScanImage: () => void;
  onRemoveCam: () => void;
};

export const RecognitionView = forwardRef((_, ref) => {

  useImperativeHandle(ref, () => ({
    onRemoveCam: () => reconigtionViewRef.current!.onRemoveCam()
  }));

  const ocrViewRef = useRef<OcrViewRef | null>(null);
  const reconigtionViewRef = useRef<reconigtionViewRef | null>(null);

  const imageRef: RefObject<HTMLImageElement> = useRef(null);
  const canvasImageRef: RefObject<HTMLCanvasElement> = useRef(null);
  const [imageCapture, setImageCapture] = useState<string | null>(null);


  const webcamRef: RefObject<Webcam> = useRef(null);
  const canvasWebcamRef: RefObject<HTMLCanvasElement> = useRef(null);
  const [stateIdentityCard, setStateIdentityCard] = useState(false);
  const [statePerson, setStatePerson] = useState(false);
  const { changeIdentityCard, changeIdentifyUser, changeTimer, changeStateInstruction } = useCredentialStore();
  const { user } = useAuthStore();



  const setImage = async (image: string) => {
    setImageCapture(image);
    await new Promise((resolve) => setTimeout(resolve, 0));
    reconigtionViewRef.current!.onScanImage();
  };

  const captureImage = async () => {
    await ocrViewRef.current!.onCapture();

  };


  useEffect(() => {
    console.log('OCR ', stateIdentityCard)
    console.log('RECONOCIMIENTO', statePerson)
    if (stateIdentityCard && statePerson) {
      reconigtionViewRef.current!.onRemoveCam()
      changeIdentifyUser(true);
      changeTimer(20);
    }
  }, [stateIdentityCard, statePerson])

  return (
    <Stack >
      <Typography style={{ fontSize: '1.5vw' }} >
        Hola {user.degree} {user.fullName}
      </Typography>

      <Grid container >
        <Grid sx={{ p: .5 }} item container sm={3} direction="column" justifyContent="center">
          {/* OCR */}
          <OcrView
            ref={ocrViewRef}
            imageRef={imageRef}
            canvasImageRef={canvasImageRef}
            image={imageCapture}
            setImage={setImage}
            webcamRef={webcamRef}
            canvasWebcamRef={canvasWebcamRef}
            isIdentityCard={(state: boolean) => {
              setStateIdentityCard(state);
              if (!state) {
                changeIdentityCard('')
                reconigtionViewRef.current!.onRemoveCam();
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {/* FACE RECONIGTION */}
          <FaceRecognition
            ref={reconigtionViewRef}
            imageRef={imageRef}
            canvasImageRef={canvasImageRef}
            image={imageCapture}
            webcamRef={webcamRef}
            canvasWebcamRef={canvasWebcamRef}
            isPerson={(state: boolean) => setStatePerson(state)}
          />
        </Grid>
        <Grid item container sm={3} direction="column" justifyContent="center">
          <Stack spacing={2} sx={{ p: 2 }}>
            <ComponentButton
              color="warning"
              onClick={() => {
                changeIdentityCard('');
                changeIdentifyUser(false);
                changeTimer(20);
                reconigtionViewRef.current!.onRemoveCam();
                changeStateInstruction(true)
              }}
              text="CANCELAR"
              sx={{ fontSize: innerWidth > innerHeight ? '3.5vw' : '5.5vw', width: '100%' }}
            />
            <ComponentButton
              onClick={() => captureImage()}
              text="RECONOCER"
              sx={{ fontSize: innerWidth > innerHeight ? '3.5vw' : '5.5vw', width: '100%' }}
            />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
});
