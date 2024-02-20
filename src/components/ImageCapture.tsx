import { forwardRef, useImperativeHandle, RefObject } from 'react';
import Webcam from "react-webcam";
import Tesseract from 'tesseract.js';
import Stack from '@mui/material/Stack';

const CAPTURED_IMAGE_WIDTH = 1920; // Ancho predefinido para la imagen capturada
const CAPTURED_IMAGE_HEIGHT = 1080; // Alto predefinido para la imagen capturada
interface captureProps {
  onChange: (image: string, text: string) => void;
  webcamRef: RefObject<Webcam>;
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

  const capture = async () => {
    if (webcamRef.current !== null) {
      const imageSrc = webcamRef.current.getScreenshot();
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Ajustar la imagen capturada al tamaño predefinido
        canvas.width = CAPTURED_IMAGE_WIDTH;
        canvas.height = CAPTURED_IMAGE_HEIGHT;
        ctx?.drawImage(img, 0, 0, CAPTURED_IMAGE_WIDTH, CAPTURED_IMAGE_HEIGHT);
        const canvasURL = canvas.toDataURL('image/jpeg');

        // Dividir la imagen en tres partes horizontales
        const segmentWidth = CAPTURED_IMAGE_WIDTH / 3;
        const segment1 = ctx?.getImageData(0, 0, segmentWidth, CAPTURED_IMAGE_HEIGHT);
        const segment2 = ctx?.getImageData(segmentWidth, 0, segmentWidth, CAPTURED_IMAGE_HEIGHT);
        const segment3 = ctx?.getImageData(2 * segmentWidth, 0, segmentWidth, CAPTURED_IMAGE_HEIGHT);

        // Obtener la URL de las imágenes segmentadas
        const canvas1 = document.createElement('canvas');
        canvas1.width = segmentWidth;
        canvas1.height = CAPTURED_IMAGE_HEIGHT;
        const ctx1 = canvas1.getContext('2d');
        ctx1?.putImageData(segment1!, 0, 0);
        const segment1DataURL = canvas1.toDataURL('image/jpeg');

        const canvas2 = document.createElement('canvas');
        canvas2.width = segmentWidth;
        canvas2.height = CAPTURED_IMAGE_HEIGHT;
        const ctx2 = canvas2.getContext('2d');
        ctx2?.putImageData(segment2!, 0, 0);
        const segment2DataURL = canvas2.toDataURL('image/jpeg');

        const canvas3 = document.createElement('canvas');
        canvas3.width = segmentWidth;
        canvas3.height = CAPTURED_IMAGE_HEIGHT;
        const ctx3 = canvas3.getContext('2d');
        ctx3?.putImageData(segment3!, 0, 0);
        const segment3DataURL = canvas3.toDataURL('image/jpeg');

        // Realizar el reconocimiento de texto en las imágenes segmentadas
        const worker = await Tesseract.createWorker();
        const { data: { text: text1 } } = await worker.recognize(segment1DataURL);
        const { data: { text: text2 } } = await worker.recognize(segment2DataURL);
        const { data: { text: text3 } } = await worker.recognize(segment3DataURL);
        await worker.terminate();


        console.log("texto derecha",text1)
        console.log("texto medio",text2)
        console.log("texto izquierda",text3)
        // Concatenar los textos reconocidos
        const concatenatedText = text1 + ' ' + text2 + ' ' + text3;

        // Llamar a la función onChange con la imagen original y el texto concatenado
        onChange(canvasURL, concatenatedText);
      };
      if (imageSrc != null) { img.src = imageSrc; }
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
          facingMode: 'environment',
          width: CAPTURED_IMAGE_WIDTH,
          height: CAPTURED_IMAGE_HEIGHT
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
