import { ImageCanvas, ImageCapture } from '@/components';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { RefObject, forwardRef, useImperativeHandle, useRef} from 'react';
import Webcam from 'react-webcam';

type ImageViewRef = {
  onCapture: () => void;
};
interface imageProps {
  imageRef: RefObject<HTMLImageElement>;
  canvasImageRef: RefObject<HTMLCanvasElement>;
  image:string|null;
  setImage:(image:string)=>void;
  webcamRef: RefObject<Webcam>;
  canvasWebcamRef: RefObject<HTMLCanvasElement>;
}

export const OcrView = forwardRef((props:imageProps, ref) => {

  const { imageRef, canvasImageRef,image,setImage, webcamRef, canvasWebcamRef } = props
  // OCR
  const imageCaptureRef = useRef<ImageViewRef | null>(null);
  useImperativeHandle(ref, () => ({
    onCapture: () => imageCaptureRef.current!.onCapture(),
  }));

  return (
    <Stack spacing={2}>
      <Typography style={{ fontSize: 40 }} >
        Nro.
      </Typography>
      <Typography style={{ fontSize: 40 }} >
        Coloque su Cédula de identidad
      </Typography>
      {
        image == null ?
          <ImageCapture
            onChange={(file: string) => setImage(file)}
            ref={imageCaptureRef}
            webcamRef={webcamRef}
            canvasWebcamRef={canvasWebcamRef}
          /> :
          <ImageCanvas
            imageRef={imageRef}
            canvasImageRef={canvasImageRef}
            src={image}
          />
      }
    </Stack>
  )
})
