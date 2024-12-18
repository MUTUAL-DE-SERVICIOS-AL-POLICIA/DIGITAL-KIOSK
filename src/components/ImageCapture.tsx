import { forwardRef, useImperativeHandle, RefObject } from "react";
import Webcam from "react-webcam";
import { createScheduler, createWorker } from "tesseract.js";
import Stack from "@mui/material/Stack";
import { useCredentialStore, useStastisticsStore } from "@/hooks";

const CAPTURED_IMAGE_WIDTH = 1920; // Ancho predefinido para la imagen capturada
const CAPTURED_IMAGE_HEIGHT = 1080; // Alto predefinido para la imagen capturada

const RECTANGLES = [
  { left: 100, top: 740, width: 650, height: 130 },
  { left: 1400, top: 100, width: 500, height: 150 },
];
interface captureProps {
  onChange: (image: string, text: string[]) => void;
  webcamRef: RefObject<Webcam>;
  canvasWebcamRef: RefObject<HTMLCanvasElement>;
  uploadImage: string | null;
}

export const ImageCapture = forwardRef((props: captureProps, ref) => {
  const { onChange, webcamRef, canvasWebcamRef, uploadImage } = props;

  const { changeLoadingGlobal } = useCredentialStore();
  const { changeLeftText, changeMiddleText, changeRightText } =
    useStastisticsStore();

  useImperativeHandle(ref, () => ({
    onCapture: () => capture(),
  }));

  const capture = async () => {
    changeLoadingGlobal(true);
    let imageSrc;
    if (webcamRef.current !== null) {
      // la webcam esta montado en el DOM
      imageSrc = webcamRef.current.getScreenshot(); // realiza una captura de una imagen
    } else {
      if (uploadImage != null) {
        imageSrc = uploadImage;
      }
    }
      const img = new Image(); // Crea una nueva imagen
      img.onload = async () => {
        const canvas = document.createElement("canvas"); // Referenciando al elemento canvas
        const ctx = canvas.getContext("2d", {
          willReadFrequently: true,
        }) as CanvasRenderingContext2D; // Creando el contexto

        canvas.width = CAPTURED_IMAGE_WIDTH; // Redimensionando el ancho del canvas con el ancho de la imagen
        canvas.height = CAPTURED_IMAGE_HEIGHT; // Redimensionando el alto del canvas con el alto de la imagen
        ctx?.drawImage(img, 0, 0, CAPTURED_IMAGE_WIDTH, CAPTURED_IMAGE_HEIGHT); // Dibujando la imagen en el canvas

        ctx.strokeStyle = "red"; // color del pincel
        ctx.lineWidth = 5; // grosor del trazo
        RECTANGLES.forEach(({ left, top, width, height }) => {
          ctx.strokeRect(left, top, width, height); // Dibujando el rectangulo
        });

        let canvasURL = canvas.toDataURL("image/jpeg", 1.0); // Obteniendo la URL de la imagen
        (document.getElementById("imgi") as HTMLImageElement).src =
          canvasURL || ""; // Montando la imagen en html

        const scheduler = createScheduler(); // Creando programador de tareas
        const worker1 = await createWorker(); // Creando trabajador 1
        const worker2 = await createWorker(); // Creando trabajador 2

        scheduler.addWorker(worker1); // Adicionando trabajos al programador de tareas (XD)
        scheduler.addWorker(worker2);

        const options = {
          rotateAuto: true, // Auto rotación del texto si no esta alineado
          tessedit_char_whitelist: "0123456789", // reconocimiento de solo números
          tessedit_pageseg_mode: 7,
        };

        const outputs = {
          imageColor: true,
          imageGrey: true,
          imageBinary: true,
        };

        const results = await Promise.all(
          RECTANGLES.map((rectangle) => {
            return scheduler.addJob(
              "recognize",
              canvas.toDataURL("image/jpeg"),
              { rectangle, ...options },
              { ...outputs }
            );
          })
        );
        await scheduler.terminate();

        changeLeftText(results[0].data.text);
        changeMiddleText(""); // ya no se envia nada :)
        changeRightText(results[1].data.text);

        const recognized = results.map(
          (result) => result.data.text
        ) as string[];

        // (document.getElementById("imgi") as HTMLImageElement).src =
        //   results[1].data.imageBinary || "";

        // Limpiando los dibujos de la imagen
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(img, 0, 0, CAPTURED_IMAGE_WIDTH, CAPTURED_IMAGE_HEIGHT);
        canvasURL = canvas.toDataURL("image/jpeg", 1.0);
        changeLoadingGlobal(false);
        onChange(canvasURL, recognized);
      };
      if (imageSrc != null) {
        img.src = imageSrc;
    }
  };

  return (
    <Stack>
      {uploadImage == null && (
      <Webcam
        audio={false}
        mirrored={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        }}
        style={{
          transform: "scaleX(1)",
          borderRadius: "30px",
          backgroundColor: "#fff",
          padding: "10px",
          width: "30vw",
          height: "auto",
        }}
      />
      )}
      {uploadImage && (
        <img
          src={uploadImage}
          alt="Preview"
          style={{
            transform: "scaleX(1)",
            borderRadius: "30px",
            backgroundColor: "#fff",
            padding: "10px",
            width: "30vw",
          }}
        />
      )}
      <canvas
        ref={canvasWebcamRef}
        style={{
          position: "absolute",
          pointerEvents: "none",
          padding: "10px",
          width: "30vw",
        }}
      />
      <div>
        <img id="imgi" src="" alt="" width="400vw" />
      </div>
    </Stack>
  );
});
