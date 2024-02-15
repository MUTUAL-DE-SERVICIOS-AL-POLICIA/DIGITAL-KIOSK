import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react"
import * as faceapi from "face-api.js"
import { Stack, Typography } from "@mui/material";

const TINY_OPTIONS = {
  inputSize: 320,
  scoreThreshold: 0.5
}

let faceMatcher: any = null;

interface GroupedDescriptors {
  [key: string]: any[];
}

interface VideoProps {
  imageRef: any;
  canvasImageRef: any;
  image: string | null;
  webcamRef: any;
  canvasWebcamRef: any;
  isPerson: (state: boolean) => void;
  ocrRef: any;
}

export const FaceRecognition = forwardRef((props: VideoProps, ref) => {

  const { imageRef, canvasImageRef, image, webcamRef, canvasWebcamRef, isPerson, ocrRef } = props;
  const videoRef: any = useRef();
  const canvasVideoRef: any = useRef();
  let intervalVideo: NodeJS.Timeout;
  let intervalWebCam: NodeJS.Timeout;

  useImperativeHandle(ref, () => ({
    onScanImage: () => scanPhoto(),
    onRemoveCam: () => cleanup(),
    onPlaying: () => getLocalUserVideo()
  }));

  const cleanup = useCallback(() => {
    intervalVideo && clearInterval(intervalVideo);
    intervalWebCam && clearInterval(intervalWebCam);

    if (videoRef.current) videoRef.current.srcObject.getTracks().forEach((track: MediaStreamTrack) => track.stop());

    if (webcamRef.current) webcamRef.current.srcObject.getTracks().forEach((track: MediaStreamTrack) => track.stop());

  }, [videoRef, webcamRef]);


  /* Carga de modelos */
  useEffect(() => {
    loadModels().then(async () => {
      await scanFace();
      await getLocalUserVideo();
      await scanWebcam();
    })
  }, [])

  const loadModels = async () => {
    const uri = "/models";
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(uri),
      faceapi.nets.ssdMobilenetv1.loadFromUri(uri),
      faceapi.nets.faceLandmark68Net.loadFromUri(uri),
      faceapi.nets.faceRecognitionNet.loadFromUri(uri),
    ]);
  }

  const getLocalUserVideo = async () => {
    try {
      const environmentStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "environment" } });
      webcamRef?.current && (webcamRef.current.srcObject = environmentStream);
      const userStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "user" } });
      videoRef?.current && (videoRef.current.srcObject = userStream);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const isFaceDetectionModelLoad = () => !!faceapi.nets.tinyFaceDetector.params;

  const groupDescriptorsByName = (faceDescriptors: any) =>
    faceDescriptors.reduce((groupedDescriptors: GroupedDescriptors, { descriptor }: { descriptor: any }, index: number) => {
      const name = `persona ${index}`;
      groupedDescriptors[name] = [...(groupedDescriptors[name] || []), descriptor];
      return groupedDescriptors;
    }, {});

  const scanFace = async () => { // video
    if (!isFaceDetectionModelLoad()) return;

    const options = new faceapi.TinyFaceDetectorOptions(TINY_OPTIONS);

    intervalVideo = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(videoRef.current, options)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const groupedDescriptors = groupDescriptorsByName(detections);
      const labeledDescriptors = Object.keys(groupedDescriptors).map(
        (name) => new faceapi.LabeledFaceDescriptors(name, groupedDescriptors[name])
      );

      if (labeledDescriptors.length > 0) {
        faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
        if(videoRef.current != null) {
          const dims = faceapi.matchDimensions(canvasVideoRef.current, videoRef.current, true);
          const resizedDetections = faceapi.resizeResults(detections, dims);

          resizedDetections.forEach(({ detection, descriptor }) => {
            const label = faceMatcher.findBestMatch(descriptor).toString();
            const boxStyle = {
              label,
              lineWidth: 2,
              boxColor: "green",
              drawLabel: true,
            };
            new faceapi.draw.DrawBox(detection.box, boxStyle).draw(canvasVideoRef.current);
          });
          faceapi.draw.drawFaceLandmarks(canvasVideoRef.current, resizedDetections);
        }
      } else {
        if(canvasVideoRef.current != null) {
          const ctx = canvasVideoRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasVideoRef.current.width, canvasVideoRef.current.height);
        }
      }
    }, 60);
  };

  const scanWebcam = async () => { // webcam
    if (!isFaceDetectionModelLoad()) return;
    const options = new faceapi.TinyFaceDetectorOptions(TINY_OPTIONS);
    intervalWebCam = setInterval(async () => {
      if (!webcamRef.current) clearInterval(intervalWebCam);
      if(webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;
        const img = await faceapi.fetchImage(imageSrc);
        const detections = await faceapi.detectAllFaces(img, options)
          .withFaceLandmarks()
          .withFaceDescriptors();
        if (canvasWebcamRef.current && img) {
          const dims = faceapi.matchDimensions(canvasWebcamRef.current, img, true);
          const resizedDetections = faceapi.resizeResults(detections, dims);
          faceapi.draw.drawDetections(canvasWebcamRef.current, resizedDetections);
        }
      }
    }, 60);
  }

  const scanPhoto = async () => { // imagen
    if (!image || !isFaceDetectionModelLoad()) return;
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 608, scoreThreshold: 0.6 });
    /* Obtenemos la referencia a la imagen */
    const img = await faceapi.fetchImage(image);
    /* detectamos todos los rostros en la imagen */
    const detections = await faceapi.detectAllFaces(img, options)
      .withFaceLandmarks()
      .withFaceDescriptors();
    if (detections.length != 0) {
      /* Comparación con la imagen capturada */
      const canvas = canvasImageRef.current;
      faceapi.matchDimensions(canvas, imageRef.current);
      const resizeResults = faceapi.resizeResults(detections, imageRef.current);

      if (resizeResults.length !== 0) {
        resizeResults.forEach(({ detection, descriptor }) => {
          let label = faceMatcher.findBestMatch(descriptor).toString();
          let options = null;

          if (!label.includes('unknown')) {
            label = `Persona encontrada`;
            options = { label, boxColor: 'green' };
            isPerson(true)
          } else {
            label = `Persona no encontrada`;
            options = { label };
            isPerson(false)
          }
          new faceapi.draw.DrawBox(detection.box, options).draw(canvas);
        });

        faceapi.draw.drawFaceLandmarks(canvasImageRef.current, resizeResults);
      }
    } else {
      isPerson(false)
      console.log("sin detecciones")
      // ocrRef.current!.onPlaying()
    }
  }

  return (
    <Stack spacing={2} >
      <Typography style={{ fontSize: '1.5vw' }}>
        Reconocimiento Facial
      </Typography>
      <Stack >
        <video
          muted
          autoPlay
          ref={videoRef}
          style={{
            objectFit: "fill",
            borderRadius: '30px',
            backgroundColor: '#fff',
            padding: '10px',
            width: '40vw',
            height: '30vw'
          }}
        />
        <canvas
          ref={canvasVideoRef}
          style={{
            position: "absolute",
            pointerEvents: "none",
            padding: '10px',
            // border: '2px solid orange',
            width: '40vw',
            height: '30vw'
          }}
        />
      </Stack>
    </Stack>
  );
});
