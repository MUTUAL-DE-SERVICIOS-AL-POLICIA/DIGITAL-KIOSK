import { forwardRef, useImperativeHandle, RefObject } from 'react';
import Webcam from "react-webcam";
import Tesseract, { createScheduler, createWorker } from 'tesseract.js';
import Stack from '@mui/material/Stack';
import { useCredentialStore, useStastisticsStore } from '@/hooks';

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
  // const { changeLeftText, changeMiddleText, changeRightText } = useStastisticsStore()

  useImperativeHandle(ref, () => ({
    onCapture: () => capture(),
  }));

  const capture = async () => {
    changeLoadingGlobal(true)
    if (webcamRef.current !== null) { // la webcam esta esta montado en el DOM
      let imageSrc = webcamRef.current.getScreenshot(); // realiza una captura de una imagen
      const img = new Image(); // Crea una nueva imagen
      img.onload = async () => {
        const canvas = document.createElement('canvas'); // Referenciando al elemento canvas
        const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D; // Creando el contexto

        canvas.width = CAPTURED_IMAGE_WIDTH; // Redimensionando el ancho del canvas con el ancho de la imagen
        canvas.height = CAPTURED_IMAGE_HEIGHT; // Redimensionando el alto del canvas con el alto de la imagen
        ctx?.drawImage(img, 0, 0, CAPTURED_IMAGE_WIDTH, CAPTURED_IMAGE_HEIGHT); // Dibujando la imagen en el canvas

        const rectangles = [
          { left: 150, top: 600, width: 650, height: 130 },
          { left: 1350, top: 50, width: 500, height: 150 },
        ]

        ctx.strokeStyle = 'red' // color del pincel
        ctx.lineWidth = 5 // grosor del trazo
        rectangles.forEach(({left, top, width, height }) => {
          ctx.strokeRect(left, top, width, height) // Dibujando el rectangulo
        })

        const canvasURL = canvas.toDataURL('image/jpeg') // Obteniendo la URL de la imagen
          // @ts-expect-error
        document.getElementById('imgi')!.src = canvasURL // Montando la imagen en html

        const scheduler = createScheduler()
        const worker1 = await createWorker()
        const worker2 = await createWorker()

        scheduler.addWorker(worker1)
        scheduler.addWorker(worker2)

        const options = {
          rotateAuto: true,
          tessedit_char_whitelist: '0123456789',
        };

        const options2 = {
          imageColor: true,
          imageGrey: true,
          imageBinary: true
        }

        const results = await Promise.all(
          rectangles.map((rectangle) => {
            scheduler.addJob('recognize', canvas.toDataURL('image/jpeg'), { rectangle, ...options }, { ...options2 })
          })
        )
        console.log(results.map((r:any) => r.data.text))
        await scheduler.terminate()

        // const worker = await Tesseract.createWorker()
        // await worker.load()
        // // @ts-expect-error
        // document.getElementById('imgi')!.src = canvas.toDataURL('image/jpeg')

        // const results1 = [];
        // for (let rect of rectangles) {
        //   const d = await worker.recognize(canvas.toDataURL('image/jpeg'), { rectangle: rect, ...options }, { ...options2 });
        //   results1.push(d);
        // }
        // @ts-expect-error
        document.getElementById('imgi')!.src = results[1].data.imageBinary
        // console.log("Results", results1[1].data)

        // console.log("primer cuadro :", results1[0].data.text)
        // console.log("segundo cuadro: ", results1[1].data.text)
        changeLoadingGlobal(false)
        // onChange(canvasURL, concatenatedText)
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
          padding: '10px',
          width: '30vw'
        }}
      />
      <div>
        <img id="imgi" src="" alt="aqui debería etar" width="400vw"  />
      </div>
    </Stack>
  );
});
