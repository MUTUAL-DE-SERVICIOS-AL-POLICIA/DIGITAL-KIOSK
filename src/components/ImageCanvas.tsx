import { Stack } from "@mui/material";
import { RefObject } from "react";

interface imageProps {
  imageRef: RefObject<HTMLImageElement>;
  canvasImageRef: RefObject<HTMLCanvasElement>;
  src: string;
}

export const ImageCanvas = (props: imageProps) => {
  const {
    imageRef,
    canvasImageRef,
    src
  } = props;

  return (
    <Stack>
      <img
        ref={imageRef}
        src={src}
        style={{
          objectFit: "fill",
          borderRadius: '30px',
          backgroundColor: '#fff',
          padding: '10px',
          // border: '2px solid orange',
        }}
      />
      <canvas
        ref={canvasImageRef}
        style={{
          position: "absolute",
          pointerEvents: "none",
          padding: '10px',
          // border: '2px solid red',
        }}
      />
    </Stack>
  )
}
