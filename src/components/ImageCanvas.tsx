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
    <>
      <img
        ref={imageRef}
        src={src}
        style={{
          borderRadius: '30px',
          backgroundColor: '#fff',
          padding: '10px',
        }}
      />
      <canvas
        ref={canvasImageRef}
        style={{
          position: "absolute",
        }}
      />
    </>
  )
}
