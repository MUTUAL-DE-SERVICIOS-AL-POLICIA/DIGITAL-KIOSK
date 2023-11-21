import { ComponentButton } from "@/components";
import { Grid, Stack, Typography } from "@mui/material";
import { OcrView } from "./OcrView";
import { useRef } from "react";

type OcrViewRef = {
  onCapture: () => void;
};

export const Recognition = () => {

  const ocrViewRef = useRef<OcrViewRef | null>(null);

  const captureImage = () => {
    ocrViewRef.current!.onCapture();
  };
  return (
    <Stack style={{ alignItems: 'center' }}>
      <Typography style={{ fontSize: 80 }}>Reconocimiento</Typography>
      <Grid container style={{}}>
        <Grid item xs={12} sm={6} container justifyContent="center" alignItems="center">
          {/* OCR */}
          <OcrView ref={ocrViewRef} />
        </Grid>
        <Grid item xs={12} sm={6} container justifyContent="center" alignItems="center">
          {/* FACE RECONIGTION */}
        </Grid>
      </Grid>
      <ComponentButton onClick={() => captureImage()} text="CAPTURAR" sx={{ fontSize: 70 }} />
    </Stack>
  );
};
