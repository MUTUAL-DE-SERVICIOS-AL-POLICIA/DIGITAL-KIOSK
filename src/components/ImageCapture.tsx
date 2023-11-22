import { forwardRef, useImperativeHandle, RefObject } from 'react';
import Webcam from "react-webcam";
import { Image } from "image-js";
import { createWorker } from 'tesseract.js';
import Stack from '@mui/material/Stack';

interface captureProps {
  onChange: (image: any) => void;
  webcamRef: RefObject<Webcam>
  canvasWebcamRef: RefObject<HTMLCanvasElement>;
  // webcamRef: any;
  // canvasWebcamRef: any;
}

export const ImageCapture = forwardRef((props: captureProps, ref) => {
  const {
    onChange,
    webcamRef,
    canvasWebcamRef
  } = props;

  // Pasa la referencia al componente padre
  useImperativeHandle(ref, () => ({
    onCapture: () => capture(),
  }));

  const capture = async () => {
    console.log("capturando una foto")
    const worker = await createWorker('eng');
    if(webcamRef.current !== null) {
      const imageSrc = webcamRef.current.getScreenshot();
      if(imageSrc !== null) {
        const image = await Image.load(imageSrc);
        const greyImage = image.grey();
        const ret = await worker.recognize(greyImage.toDataURL());
        console.log(ret.data.text);
        await worker.terminate();
        onChange(imageSrc);
      }
    }
  };


  return (
    <Stack>
      <Webcam
        audio={false}
        mirrored={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: 'enviroment'
        }}
        style={{
          transform: "scaleX(1)",
          borderRadius: '30px',
          backgroundColor: '#fff',
          padding: '10px',
        }}
      />
      <canvas
        ref={canvasWebcamRef}
        style={{
          position: "absolute",
          pointerEvents:"none",
          padding: '10px'
        }}
      />
    </Stack>
  );
});
