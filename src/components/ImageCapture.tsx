import { forwardRef, useImperativeHandle, RefObject } from 'react';
import Webcam from "react-webcam";
import /*Tesseract,*/ { createScheduler, createWorker } from 'tesseract.js';
import Stack from '@mui/material/Stack';
import { useCredentialStore, useStastisticsStore } from '@/hooks';
import { HouseSidingSharp } from '@mui/icons-material';

const CAPTURED_IMAGE_WIDTH = 1920; // Ancho predefinido para la imagen capturada
const CAPTURED_IMAGE_HEIGHT = 1080; // Alto predefinido para la imagen capturada

const RECTANGLES = [
  { left: 150, top: 600, width: 650, height: 130 },
  { left: 1350, top: 50, width: 500, height: 150 },
]
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
  const { changeLeftText, changeMiddleText, changeRightText } = useStastisticsStore()

  useImperativeHandle(ref, () => ({
    onCapture: () => capture(),
  }));

  // Función para convertir una imagen a una URL
  // const convertImageToDataURL = (canvas: HTMLCanvasElement, segment: ImageData | undefined, segmentWidth: number): string  => {
  //   canvas.width = segmentWidth;
  //   canvas.height = CAPTURED_IMAGE_HEIGHT;
  //   const ctx = canvas.getContext('2d');
  //   segment && ctx?.putImageData(segment, 0, 0);
  //   return canvas.toDataURL('image/jpeg');
  // }

  // const capture = async () => {
  //   changeLoadingGlobal(true)
  //   if (webcamRef.current !== null) {
  //     const imageSrc = webcamRef.current.getScreenshot();
  //     const img = new Image();
  //     img.onload = async () => {
  //       const canvas = document.createElement('canvas');
  //       const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;

  //       // Ajustar la imagen capturada al tamaño predefinido
  //       canvas.width = CAPTURED_IMAGE_WIDTH;
  //       canvas.height = CAPTURED_IMAGE_HEIGHT;
  //       ctx?.drawImage(img, 0, 0, CAPTURED_IMAGE_WIDTH, CAPTURED_IMAGE_HEIGHT);
  //       const canvasURL = canvas.toDataURL('image/jpeg');

  //       // Dividir la imagen en tres partes horizontales
  //       const segmentWidth = CAPTURED_IMAGE_WIDTH / 3;
  //       const segment1: ImageData | undefined = ctx?.getImageData(0, 0, segmentWidth, CAPTURED_IMAGE_HEIGHT);
  //       const segment2: ImageData | undefined = ctx?.getImageData(segmentWidth, 0, segmentWidth, CAPTURED_IMAGE_HEIGHT);
  //       const segment3: ImageData | undefined = ctx?.getImageData(2 * segmentWidth, 0, segmentWidth, CAPTURED_IMAGE_HEIGHT);

  //       // Obtener la URL de las imágenes segmentadas
  //       const promises = [
  //         new Promise<string>((resolve, _) => {
  //             resolve(convertImageToDataURL(document.createElement('canvas'), segment1!, segmentWidth));
  //         }),
  //         new Promise<string>((resolve, _) => {
  //             resolve(convertImageToDataURL(document.createElement('canvas'), segment2!, segmentWidth));
  //         }),
  //         new Promise<string>((resolve, _) => {
  //             resolve(convertImageToDataURL(document.createElement('canvas'), segment3!, segmentWidth));
  //         })
  //       ];

  //       const [segment1DataURL, segment2DataURL, segment3DataURL] = await Promise.all(promises);

  //       // Realizar el reconocimiento de texto en las imágenes segmentadas
  //       const scheduler =  Tesseract.createScheduler()
  //       const worker1 = await Tesseract.createWorker()
  //       const worker2 = await Tesseract.createWorker()
  //       const worker3 = await Tesseract.createWorker()

  //       scheduler.addWorker(worker1)
  //       scheduler.addWorker(worker2)
  //       scheduler.addWorker(worker3)

  //       const results = await Promise.all(
  //         [segment1DataURL, segment2DataURL, segment3DataURL].map((segment) => (
  //           scheduler.addJob('recognize', segment)
  //         ))
  //       )
  //       await scheduler.terminate()

  //       changeLeftText(results[0].data.text)
  //       changeMiddleText(results[1].data.text)
  //       changeRightText(results[2].data.text)

  //       const initialValue = ''
  //       const concatenatedText = results.reduce(
  //         (accumulator, currentValue) => accumulator + currentValue.data.text,
  //         initialValue
  //       )

  //       // Llamar a la función onChange con la imagen original y el texto concatenado
  //       changeLoadingGlobal(false)
  //       onChange(canvasURL, concatenatedText)
  //     };
  //     if (imageSrc != null) { img.src = imageSrc; }
  //   }
  // };

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

        ctx.strokeStyle = 'red' // color del pincel
        ctx.lineWidth = 5 // grosor del trazo
        RECTANGLES.forEach(({left, top, width, height }) => {
          ctx.strokeRect(left, top, width, height) // Dibujando el rectangulo
        })

        const canvasURL = canvas.toDataURL('image/jpeg'); // Obteniendo la URL de la imagen

        (document.getElementById('imgi') as HTMLImageElement).src = canvasURL  || ""// Montando la imagen en html

        const scheduler = createScheduler()  // Creando programador de tareas
        const worker1 = await createWorker() // Creando trabajador 1
        const worker2 = await createWorker() // Creando trabajador 2

        scheduler.addWorker(worker1) // Adicionando trabajos al programador de tareas (XD)
        scheduler.addWorker(worker2)

        const options = {
          rotateAuto: true, // Auto rotación del texto si no esta alineado
          tessedit_char_whitelist: '0123456789', // reconocimiento de solo números
        }

        const outputs = {
          imageColor: true,
          imageGrey: true,
          imageBinary: true
        }

        const results = await Promise.all(
          RECTANGLES.map((rectangle) => {
            return scheduler.addJob('recognize', canvas.toDataURL('image/jpeg'), { rectangle, ...options }, { ...outputs })
          })
        )
        // console.log(results.map((r:any, index:number) => `Cuadro N° ${index}, Texto reconocido: ${r.data.text == '' ? '(vacío)' : r.data.text}`))
        await scheduler.terminate()

        changeLeftText(results[0].data.text)
        changeMiddleText("") // ya no se envia nada :)
        changeRightText(results[1].data.text)

        const initialValue = ''
        const concatenatedText = results.reduce(
          (accumulator, currentValue) => accumulator + currentValue.data.text,
          initialValue
        );

        (document.getElementById('imgi') as HTMLImageElement).src = results[1].data.imageBinary || ""

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
          padding: '10px',
          width: '30vw'
        }}
      />
      <div>
        <img id="imgi" src="" alt="" width="400vw"  />
      </div>
    </Stack>
  );
});
