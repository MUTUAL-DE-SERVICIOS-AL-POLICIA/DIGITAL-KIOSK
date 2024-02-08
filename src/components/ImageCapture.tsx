import { forwardRef, useImperativeHandle, RefObject } from 'react';
import Webcam from "react-webcam";
import { Image } from "image-js";
import { createWorker } from 'tesseract.js';
import Stack from '@mui/material/Stack';

interface captureProps {
  onChange: (image: string, text: string) => void;
  webcamRef: RefObject<Webcam>
  canvasWebcamRef: RefObject<HTMLCanvasElement>;
}

export const ImageCapture = forwardRef((props: captureProps, ref) => {
  const {
    onChange,
    webcamRef,
    canvasWebcamRef,
  } = props;

  useImperativeHandle(ref, () => ({
    onCapture: () => capture(),
  }));

  /* Cuando se hace click en el botón INGRESAR se ejecuta esta función */
  const capture = async () => {
    const worker = await createWorker('eng'); // Crea el proceso secundario
    if (webcamRef.current !== null) {
      const imageSrc = webcamRef.current.getScreenshot(); // Realizar captura
      if (imageSrc !== null) {
        const image = await Image.load(imageSrc); // Obtiene la imagen
        const greyImage = image.grey(); // Convierte la imagen a escala de grises
        const ret = await worker.recognize(greyImage.toDataURL()); // reconocimiento de texto
        await worker.terminate(); // termina el proceso secundario
        onChange(imageSrc, ret.data.text);
      }
    }
  };


  return (
    <Stack >
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
          width: '20vw'
        }}
      />
      <canvas
        ref={canvasWebcamRef}
        style={{
          position: "absolute",
          pointerEvents: "none",
          width: '20vw'
        }}
      />
    </Stack>
  );
});
