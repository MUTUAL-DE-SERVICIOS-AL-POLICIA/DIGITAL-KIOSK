import { ImageCanvas, ImageCapture } from '@/components';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { RefObject, forwardRef, useImperativeHandle, useRef, useState } from 'react';

type ImageViewRef = {
  onCapture: () => void;
};

export const OcrView = forwardRef((_, ref) => {

  // OCR
  const imageCaptureRef = useRef<ImageViewRef | null>(null);
  useImperativeHandle(ref, () => ({
    onCapture: () => imageCaptureRef.current!.onCapture(),
  }));
  // IMAGE CANVAS
  const [imageCapture, setImageCapture] = useState<string | null>(null);
  const imageRef: RefObject<HTMLImageElement> = useRef(null);
  const canvasImageRef: RefObject<HTMLCanvasElement> = useRef(null);

  return (
    <Stack spacing={2}  >
      <Typography style={{ fontSize: 40 }} >
        Nro.
      </Typography>
      <Typography style={{ fontSize: 40 }} >
        Coloque su Cédula de identidad
      </Typography>
      {
        imageCapture == null ?
          <ImageCapture
            onChange={(file: string) => setImageCapture(file)}
            ref={imageCaptureRef}
          /> :
          <ImageCanvas
            imageRef={imageRef}
            canvasImageRef={canvasImageRef}
            src={imageCapture}
          />
      }
    </Stack>
  )
})
