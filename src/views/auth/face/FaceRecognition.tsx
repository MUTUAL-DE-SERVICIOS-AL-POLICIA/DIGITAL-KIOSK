import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  memo,
  useState,
} from "react";
import * as faceapi from "face-api.js";
import { Box, Grid, Stack } from "@mui/material";
import { useCredentialStore, useStastisticsStore } from "@/hooks";
import { useAuthStore } from "@/hooks/useAuthStore";
import { base64toBlob, getEnvVariables } from "@/helpers";
import { usePersonStore } from "@/hooks/usePersonStore";
import { CardInfo } from "@/components/CardInfo";

const TINY_OPTIONS = {
  inputSize: 320,
  scoreThreshold: 0.5,
};

const TINY_OPTIONS_PHOTO = {
  inputSize: 608,
  scoreThreshold: 0.6,
};

const DEV_MODE = getEnvVariables().DEV_MODE === "true";

let faceMatcher: any = null;

interface GroupedDescriptors {
  [key: string]: any[];
}

const text = (
  <>
    Por favor, retire su <b>carnet de identidad</b> del soporte.
    <br />
    Quítese el sombrero, lentes y barbijo para el reconocimiento facial y
    presione en <b>continuar.</b>
  </>
);

export const FaceRecognition = memo(
  forwardRef((_, ref) => {
    const {
      image,
      changeRecognizedByFacialRecognition,
      ocr,
      changeIdentifyUser,
      changeStep,
      changeLoadingGlobal,
      identityCard,
      savePhoto,
    } = useCredentialStore();
    const { ocrState, leftText, middleText, rightText } = useStastisticsStore();
    const { authMethodRegistration, user } = useAuthStore();
    const { person } = usePersonStore();

    const videoRef: any = useRef();
    const canvasVideoRef: any = useRef();

    let intervalVideo: NodeJS.Timeout;
    let img: any;
    const [imageSrc, setImageSrc] = useState("");
    const imageRef: any = useRef();

    useImperativeHandle(ref, () => ({
      onRemoveCam: () => cleanup(),
      onPlaying: () => getLocalUserVideo(),
      action: () => scanPhoto(),
    }));

    const cleanup = useCallback(() => {
      intervalVideo && clearInterval(intervalVideo);

      if (videoRef.current)
        videoRef.current.srcObject
          .getTracks()
          .forEach((track: MediaStreamTrack) => track.stop());
    }, [videoRef]);

    useEffect(() => {
      changeLoadingGlobal(true);
      loadModels()
        .then(async () => {
          await scanFace();
          await getLocalUserVideo();
          changeLoadingGlobal(false);
        })
        .catch(() => console.error("No se cargaron los modelos"));
    }, []);

    const loadModels = async () => {
      const uri = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(uri),
        faceapi.nets.ssdMobilenetv1.loadFromUri(uri),
        faceapi.nets.faceLandmark68Net.loadFromUri(uri),
        faceapi.nets.faceRecognitionNet.loadFromUri(uri),
      ]);
    };

    const uploadImage = async (e: any) => {
      cleanup();
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (typeof event.target?.result === "string") {
            setImageSrc(event.target?.result);
          }
        };
        reader.readAsDataURL(file); // Leer el archivo como una URL base64
      }
    };

    const setAutomaticFocus = async (stream: MediaStream) => {
      const track = stream.getVideoTracks()[0];
      const capabilities: any = track.getCapabilities();
      if (
        capabilities.focusMode &&
        capabilities.focusMode.includes("continuous")
      ) {
        const constraints: any = {
          focusMode: "continuous",
        };
        await track.applyConstraints(constraints);
      } else {
        console.log(
          "El enfoque automatico no es compatible con este dispositivo."
        );
      }
    };

    const getLocalUserVideo = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: "user" },
        });
        setAutomaticFocus(userStream);
        videoRef?.current && (videoRef.current.srcObject = userStream);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const isFaceDetectionModelLoad = () =>
      !!faceapi.nets.tinyFaceDetector.params;

    const groupDescriptorsByName = (faceDescriptors: any) =>
      faceDescriptors.reduce(
        (
          groupedDescriptors: GroupedDescriptors,
          { descriptor }: { descriptor: any },
          index: number
        ) => {
          const name = `persona ${index}`;
          groupedDescriptors[name] = [
            ...(groupedDescriptors[name] || []),
            descriptor,
          ];
          return groupedDescriptors;
        },
        {}
      );

    const scanVideo = async () => {
      const options = new faceapi.TinyFaceDetectorOptions(TINY_OPTIONS);
      if (imageRef.current) {
        if (faceapi.isMediaElement(imageRef.current)) {
          console.log("El input es un elemento HTML válido.");
        } else {
          console.log("El input no es un elemento válido para face-api.js.");
        }
      }
      const detections = await faceapi
        .detectAllFaces(imageRef.current ?? videoRef.current, options)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const groupedDescriptors = groupDescriptorsByName(detections);
      const labeledDescriptors = Object.keys(groupedDescriptors).map(
        (name) =>
          new faceapi.LabeledFaceDescriptors(name, groupedDescriptors[name])
      );

      if (labeledDescriptors.length > 0) {
        faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
        if (videoRef.current != null) {
          const dims = faceapi.matchDimensions(
            canvasVideoRef.current,
            videoRef.current,
            true
          );
          const resizedDetections = faceapi.resizeResults(detections, dims);
          resizedDetections.forEach(({ detection, descriptor }) => {
            let label = faceMatcher.findBestMatch(descriptor).toString();
            label = label.substring(0, 9);
            const boxStyle = {
              label: `${label}`,
              lineWidth: 2,
              boxColor: "green",
              drawLabel: true,
            };
            new faceapi.draw.DrawBox(detection.box, boxStyle).draw(
              canvasVideoRef.current
            );
          });
          faceapi.draw.drawFaceLandmarks(
            canvasVideoRef.current,
            resizedDetections
          );
        }
      } else {
        if (canvasVideoRef.current != null) {
          const ctx = canvasVideoRef.current.getContext("2d", {
            willReadFrequently: true,
          });
          ctx.clearRect(
            0,
            0,
            canvasVideoRef.current.width,
            canvasVideoRef.current.height
          );
        }
      }
    };

    const scanFace = async () => {
      // video
      if (!isFaceDetectionModelLoad()) return;

      intervalVideo = setInterval(async () => {
        scanVideo();
      }, 60);
    };

    const scanPhoto = async () => {
      // imagen
      changeLoadingGlobal(true);
      try {
        if (!image || !isFaceDetectionModelLoad()) {
          console.error("No se cargaron los modelos o no existe la imágen");
          return;
        }
        const options = new faceapi.TinyFaceDetectorOptions(TINY_OPTIONS_PHOTO);
        img = await faceapi.fetchImage(image);

        const canvas = document.createElement("canvas");

        img.onload = () => {
          const width = img.width;
          const height = img.height;
          canvas.width = width;
          canvas.height = height;
        };

        const detections = await faceapi
          .detectAllFaces(img, options)
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length === 0) {
          changeLoadingGlobal(false);
          sendStatistics(false);
          if (ocr) operative({ step: "home", identifyUser: true });
          console.error("No existe detecciones");
        }

        if (!canvas && !img) {
          changeLoadingGlobal(false);
          sendStatistics(false);
          if (ocr) operative({ step: "home", identifyUser: true });
          console.error("No existe el canvas o imagen");
        }

        faceapi.matchDimensions(canvas, img);
        const resizeResults = faceapi.resizeResults(detections, img);

        if (resizeResults.length === 0) {
          changeLoadingGlobal(false);
          sendStatistics(false);
          console.error("No existe resizeResults");
          if (ocr) operative({ step: "home", identifyUser: true });
          return;
        }

        resizeResults.some(async ({ detection, descriptor }) => {
          if (faceMatcher) {
            let label = faceMatcher.findBestMatch(descriptor).toString();
            let options = null;
            if (!label.includes("unknown")) {
              if (videoRef.current !== null) {
                const video = videoRef.current;
                if (!video.paused && video.readyState === 4) {
                  const cvs = document.createElement("canvas");
                  cvs.width = video.videoWidth;
                  cvs.height = video.videoHeight;
                  const ctx = cvs.getContext("2d");
                  ctx?.drawImage(video, 0, 0, cvs.width, cvs.height);
                  const imageDataURL = cvs.toDataURL("image/jpeg");
                  savePhoto({
                    affiliateId: user.nup,
                    photo_face: base64toBlob(imageDataURL),
                  });
                }
              }
              label = `Persona encontrada`;
              options = { label, boxColor: "green" };
              changeRecognizedByFacialRecognition(true);
              console.log("================================");
              console.log("RECONOCE EL ROSTRO");
              console.log("================================");
              sendStatistics(true);
              operative({ step: "home", identifyUser: true });
              return true;
            } else {
              label = `Persona no encontrada`;
              options = { label };
              console.log("================================");
              console.log("NO RECONOCE EL ROSTRO");
              console.log("================================");
              if (ocr) operative({ step: "home", identifyUser: true });
              sendStatistics(false);
            }
            new faceapi.draw.DrawBox(detection.box, options).draw(canvas);
          }
        });
        faceapi.draw.drawFaceLandmarks(canvas, resizeResults);
        changeLoadingGlobal(false);
      } catch (error: any) {
        changeLoadingGlobal(false);
        console.error("Error con la cámara del rostro: ", error);
      }
    };

    const sendStatistics = async (faceState: boolean) => {
      const body = {
        identity_card: identityCard,
        left_text: leftText,
        middle_text: middleText,
        right_text: rightText,
        ocr_state: ocrState,
        facial_recognition: faceState,
        // affiliate_id: user.nup,
        person_id: person.id,
      };
      authMethodRegistration(body);
    };

    const operative = ({
      step,
      identifyUser,
    }: {
      step: string;
      identifyUser: boolean;
    }) => {
      changeStep(step);
      changeIdentifyUser(identifyUser);
      cleanup();
    };

    return (
      <Grid container alignItems="center">
        <Grid
          item
          container
          sm={6}
          direction="column"
          justifyContent="space-between"
        >
          <CardInfo text={text} />
        </Grid>
        <Grid item container sm={6} direction="column">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70vh",
            }}
          >
            <Stack spacing={2}>
              {DEV_MODE && (
                <div>
                  <input type="file" accept="image/*" onChange={uploadImage} />
                  <button onClick={scanVideo}>Escanear</button>
                </div>
              )}
              <Stack>
                {!imageSrc && (
                  <video
                    muted
                    autoPlay
                    ref={videoRef}
                    style={{
                      objectFit: "fill",
                      borderRadius: "30px",
                      backgroundColor: "#fff",
                      padding: "10px",
                      width: "40vw",
                      height: "30vw",
                    }}
                  />
                )}
                {imageSrc && (
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="Seleccionada"
                    crossOrigin="anonymous"
                    style={{
                      objectFit: "fill",
                      borderRadius: "30px",
                      backgroundColor: "#fff",
                      padding: "10px",
                      width: "40vw",
                      height: "30vw",
                    }}
                  />
                )}
                <canvas
                  ref={canvasVideoRef}
                  style={{
                    position: "absolute",
                    pointerEvents: "none",
                    padding: "10px",
                    width: "40vw",
                    height: "30vw",
                    zIndex: "10",
                  }}
                />
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    );
  })
);
