import { Box } from "@mui/material";
// @ts-expect-error
import Hands from "@/assets/images/hands.png";
import { memo, useEffect } from "react";

interface Area {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const AREAS: Area[] = [
  { id: 1, name: "Pulgar Derecho", x: 350, y: 260, width: 40, height: 40 },
  { id: 2, name: "Índice Derecho", x: 440, y: 95, width: 40, height: 40 },
  { id: 3, name: "Pulgar Izquierdo", x: 210, y: 260, width: 40, height: 40 },
  { id: 4, name: "Índice Izquierdo", x: 125, y: 95, width: 40, height: 40 },
];

const colors = {
  UNREGISTERED: "rgba(255, 50, 0, 0.5)",
};

export const Fingerprint = memo(() => {
  const drawAndPaintFingers = (
    area: Area,
    ctx: CanvasRenderingContext2D,
    color: string
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(
      area.x + area.width / 2,
      area.y + area.height / 2,
      (area.width / 2) * 1.2, // Radio horizontal
      (area.height / 2) * 1.2, // Radio vertical
      0,
      0,
      2 * Math.PI // ángulo final en radianes
    );
    ctx.fill();
  };

  const draw = (areas: any, ctx: CanvasRenderingContext2D, color: string) => {
    areas.forEach((area: Area) => {
      drawAndPaintFingers(area, ctx, color);
    });
  };

  useEffect(() => {
    const img = document.getElementById(
      "imageHands"
    ) as HTMLImageElement | null;
    const canvas = document.getElementById(
      "canvas"
    ) as HTMLCanvasElement | null;
    const ctx = canvas!.getContext("2d") as CanvasRenderingContext2D | null;

    const initializeCanvas = () => {
      if (canvas && img && ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        draw(AREAS, ctx, colors["UNREGISTERED"]);
      }
    };
    if (img) {
      if (img.complete) initializeCanvas();
      else img.onload = () => initializeCanvas();
    }
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "auto",
      }}
    >
      <img
        src={Hands}
        alt="image de manos"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
        }}
        id="imageHands"
      />
      <Box
        component="canvas"
        id="canvas"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
});

export default Fingerprint;
