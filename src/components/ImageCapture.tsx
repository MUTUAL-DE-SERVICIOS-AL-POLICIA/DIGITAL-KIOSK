import { forwardRef, useImperativeHandle, useRef } from 'react';
import Webcam from "react-webcam";
import { Image } from "image-js";
import { createWorker } from 'tesseract.js';

interface captureProps {
  onChange: (image: any) => void;
}

export const ImageCapture = forwardRef((props: captureProps, ref) => {
  const {
    onChange,
  } = props;
  const webcamRef = useRef<any>(null);

  // Pasa la referencia al componente padre
  useImperativeHandle(ref, () => ({
    onCapture: () => capture(),
  }));

  const capture = async () => {
    console.log("capturando una foto")
    const worker = await createWorker('eng');
    const imageSrc = webcamRef.current.getScreenshot();
    const image = await Image.load(imageSrc);
    const greyImage = image.grey();

    const ret = await worker.recognize(greyImage.toDataURL());
    console.log(ret.data.text);
    await worker.terminate();

    onChange(imageSrc);
  };


  return (
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
  );
});
