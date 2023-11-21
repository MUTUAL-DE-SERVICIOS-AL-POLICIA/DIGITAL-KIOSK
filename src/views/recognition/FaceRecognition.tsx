import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import * as faceapi from "face-api.js"
import { Stack, Typography } from "@mui/material";

const TINY_OPTIONS = {
  inputSize: 320,
  scoreThreshold: 0.5
}
let faceMatcher: any = null

interface GroupedDescriptors {
  [key: string]: any[]; // O utiliza un tipo más específico en lugar de `any` si conoces la estructura exacta
}
interface videoProps {
  // imageRef: RefObject<HTMLImageElement>;
  imageRef: any;
  // canvasImageRef: RefObject<HTMLCanvasElement>;
  canvasImageRef: any;
  image: string | null;
}



export const FaceRecognition = forwardRef((props: videoProps,ref) => {

  useImperativeHandle(ref, () => ({
    onScanImage: () =>{
      // console.log('hi')
      scanPhoto()
    },
  }));

  const { imageRef, canvasImageRef, image } = props

  const videoRef: any = useRef()
  const canvasVideoRef: any = useRef()

  useEffect(() => {
    loadModels().then(async () => {
      await scanFace()
      getLocalUserVideo()
    })
  }, [])
  
  const loadModels = async () => {
    const uri = "/models"
    await faceapi.nets.tinyFaceDetector.loadFromUri(uri)
    await faceapi.nets.ssdMobilenetv1.loadFromUri(uri)
    await faceapi.nets.faceLandmark68Net.loadFromUri(uri)
    await faceapi.nets.faceRecognitionNet.loadFromUri(uri)
  }
  
  const getLocalUserVideo = async () => {
    navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "user" } })
      .then((stream) => {
        if (videoRef && videoRef.current != null) {
          videoRef.current.srcObject = stream
        }
      })
      .catch((err) => {
        console.error("error: ", err)
      })
  }


  const isFaceDetectionModelLoad = () => {
    return !!getCurrentFaceDetectionNet().params
  }

  const getCurrentFaceDetectionNet = () => {
    return faceapi.nets.tinyFaceDetector
  }

  const groupDescriptorsByName = (faceDescriptors: any) => {
    const groupedDescriptors: GroupedDescriptors = {}
    faceDescriptors.forEach(({ descriptor }: { descriptor: any }, index: number) => {
      let name = `persona ${index}`
      if (!groupedDescriptors[name]) {
        groupedDescriptors[name] = []
      }
      groupedDescriptors[name].push(descriptor)
    })
    return groupedDescriptors
  }

  const scanFace = async () => {

    let labeledDescriptors;
    if (isFaceDetectionModelLoad()) {
      const options = new faceapi.TinyFaceDetectorOptions(TINY_OPTIONS)
      setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, options)
          .withFaceLandmarks()
          .withFaceDescriptors()

        const groupedDescriptors = groupDescriptorsByName(detections)
        labeledDescriptors = Object.keys(groupedDescriptors).map(name => {
          return new faceapi.LabeledFaceDescriptors(name, groupedDescriptors[name])
        })
        if (labeledDescriptors.length > 0) {
          console.log("entra aca")
          faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)
          const dims = faceapi.matchDimensions(canvasVideoRef.current, videoRef.current, true)
          const resizedDetections = faceapi.resizeResults(detections, dims)

          resizedDetections.forEach(({ detection, descriptor }) => {
            const label = faceMatcher.findBestMatch(descriptor).toString()
            const boxStyle = {
              label,
              lineWidth: 2,
              boxColor: "green",
              drawLabel: true,
            };
            const drawBox = new faceapi.draw.DrawBox(detection.box, boxStyle)
            drawBox.draw(canvasVideoRef.current)
          })
          faceapi.draw.drawFaceLandmarks(canvasVideoRef.current, resizedDetections)

        } else {
          console.log("ahora entra aca")
          const ctx = canvasVideoRef.current.getContext('2d')
          ctx.clearRect(0, 0, canvasVideoRef.current.width, canvasVideoRef.current.height)
        }
      }, 60)
    } else console.log("No is models loaded")
  }

  const scanPhoto = async () => {
    console.log(`image ${image}`)
    if(image==null)return;
    if (isFaceDetectionModelLoad()) {
      const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 608, scoreThreshold: 0.6 })
      const img = await faceapi.fetchImage(image!)

      const detections = await faceapi
        .detectAllFaces(img, options)
        .withFaceLandmarks()
        .withFaceDescriptors()

      if (detections) {
        const canvas = canvasImageRef.current
        faceapi.matchDimensions(canvas, imageRef.current)
        const resizeResults = faceapi.resizeResults(detections, imageRef.current)

        resizeResults.forEach(({ detection, descriptor }) => {
          const label = faceMatcher.findBestMatch(descriptor).toString()
          let options = null
          if (!label.includes('unknown')) {
            options = { label, boxColor: 'green' }
          } else {
            options = { label }
          }
          const drawBox = new faceapi.draw.DrawBox(detection.box, options)
          drawBox.draw(canvas)
        })
        faceapi.draw.drawFaceLandmarks(canvasImageRef.current, resizeResults)
      }
    }
  }

  return (
    <Stack spacing={3}>
      <Typography style={{ fontSize: 40 }} >
       Reconocimiento Facial
      </Typography>
      <Stack>
        <video
          muted
          autoPlay
          ref={videoRef}
          style={{
            objectFit: "fill",
            borderRadius: '30px',
            backgroundColor: '#fff',
            padding: '10px',
          }}
        />
        <canvas
          ref={canvasVideoRef}
          style={{
            position: "absolute",
            pointerEvents: "none",
            padding: '10px',
          }}
        />
      </Stack>
    </Stack>
  )
});
