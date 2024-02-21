import { forwardRef, useImperativeHandle, RefObject } from 'react';
import Webcam from "react-webcam";
import Tesseract from 'tesseract.js';
import Stack from '@mui/material/Stack';
import { useCredentialStore } from '@/hooks';

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

  const { changeLoadingGlobal } = useCredentialStore()

  useImperativeHandle(ref, () => ({
    onCapture: () => capture(),
  }));

  // Función para convertir una imagen a una URL
  const convertImageToDataURL = (canvas: HTMLCanvasElement, segment: any, segmentWidth: number): string  => {
    canvas.width = segmentWidth;
    canvas.height = CAPTURED_IMAGE_HEIGHT;
    const ctx = canvas.getContext('2d');
    ctx?.putImageData(segment, 0, 0);
    return canvas.toDataURL('image/jpeg');
  }

  const capture = async () => {
    changeLoadingGlobal(true)
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
        const promises = [
          new Promise<string>((resolve, _) => {
              resolve(convertImageToDataURL(document.createElement('canvas'), segment1!, segmentWidth));
          }),
          new Promise<string>((resolve, _) => {
              resolve(convertImageToDataURL(document.createElement('canvas'), segment2!, segmentWidth));
          }),
          new Promise<string>((resolve, _) => {
              resolve(convertImageToDataURL(document.createElement('canvas'), segment3!, segmentWidth));
          })
        ];

        const [segment1DataURL, segment2DataURL, segment3DataURL] = await Promise.all(promises);

        // Realizar el reconocimiento de texto en las imágenes segmentadas
        const scheduler =  Tesseract.createScheduler()
        const worker1 = await Tesseract.createWorker()
        const worker2 = await Tesseract.createWorker()
        const worker3 = await Tesseract.createWorker()

        scheduler.addWorker(worker1)
        scheduler.addWorker(worker2)
        scheduler.addWorker(worker3)

        const results = await Promise.all(
          [segment1DataURL, segment2DataURL, segment3DataURL].map((segment) => (
            scheduler.addJob('recognize', segment)
          ))
        )
        await scheduler.terminate()

        results.forEach(result => console.log(result.data.text))

        const initialValue = ''
        const concatenatedText = results.reduce(
          (accumulator, currentValue) => accumulator + currentValue.data.text,
          initialValue
        )

        // Llamar a la función onChange con la imagen original y el texto concatenado
        changeLoadingGlobal(false)
        onChange(canvasURL, concatenatedText)
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
          width: '30vw'
        }}
      />
      <canvas
        ref={canvasWebcamRef}
        style={{
          position: "absolute",
          pointerEvents: "none",
          width: '30vw'
        }}
      />
    </Stack>
  );
});
