
import { ComponentButton } from "@/components";
import { Grid, Stack, Typography } from "@mui/material";
import { RefObject, useRef, useState } from "react";
import { FaceRecognition, OcrView } from ".";

type OcrViewRef = {
  onCapture: () => void;
};

type reconigtionViewRef = {
  onScanImage: () => void;
};

export const RecognitionView = () => {

  const ocrViewRef = useRef<OcrViewRef | null>(null);
  const reconigtionViewRef = useRef<reconigtionViewRef | null>(null);

  const imageRef: RefObject<HTMLImageElement> = useRef(null);
  const canvasImageRef: RefObject<HTMLCanvasElement> = useRef(null);
  const [imageCapture, setImageCapture] = useState<string | null>(null);


  const setImage = async (image:string) => {
    setImageCapture(image);
    await new Promise((resolve) => setTimeout(resolve, 0)); // Pequeña pausa para asegurar que setImageCapture se complete
    reconigtionViewRef.current!.onScanImage();
  };
  
  const captureImage = async () => {
    await ocrViewRef.current!.onCapture();
  };
  return (
    <Stack style={{ alignItems: 'center' }}>
      <Typography style={{ fontSize: 80 }}>Reconocimiento</Typography>
      <Grid container style={{}}>
        <Grid item xs={12} sm={6} container justifyContent="center" alignItems="center">
          {/* OCR */}
          <OcrView
          ref={ocrViewRef}
          imageRef={imageRef}
          canvasImageRef={canvasImageRef}
          image={imageCapture}
          setImage={setImage}
          />
        </Grid>
        <Grid item xs={12} sm={6} container justifyContent="center" alignItems="center">
          {/* FACE RECONIGTION */}
          <FaceRecognition
          ref={reconigtionViewRef}
          imageRef={imageRef}
          canvasImageRef={canvasImageRef}
          image={imageCapture}
           />
        </Grid>
      </Grid>
      <ComponentButton onClick={() => captureImage()} text="CAPTURAR" sx={{ fontSize: 70 }} />
    </Stack>
  );
};
