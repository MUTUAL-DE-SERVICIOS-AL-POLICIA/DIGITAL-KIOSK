import {
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { memo } from "react";

interface CardMethodChooserProp {
  title: string;
  image: any;
  step: string;
  onAction: (step: string) => void;
  disabled: boolean;
}

const CardMethodChooser = memo((props: CardMethodChooserProp) => {
  const { title, image, step, onAction, disabled } = props;

  return (
    <Card
      sx={{
        minWidth: 450,
        borderRadius: "40px",
        backgroundColor: disabled ? "#d6dadb " : "#c9cdcf",
        color: disabled ? "text.disabled" : "text.primary",
        opacity: disabled ? 0.7 : 1,
        pointerEvents: disabled ? "none" : "auto",
        transition: "background-color 0.3s ease",
        "&:hover": {
          backgroundColor: disabled ? "#bbc1c3" : "#bbc1c3", // Color en hover
        },
      }}
      variant="elevation"
    >
      <CardActionArea onClick={() => !disabled && onAction(step)}>
        <CardHeader
          title={
            <Typography
              align="center"
              style={{ fontSize: "1.6vw", fontWeight: 700 }}
            >
              {title}
            </Typography>
          }
        />
        <CardMedia
          component="img"
          height="400"
          image={image}
          alt="Imagen de rostro"
          sx={{
            filter: disabled ? "grayscale(100%)" : "none",
            opacity: disabled ? 0.8 : 1,
          }}
        />
      </CardActionArea>
    </Card>
  );
});

export default CardMethodChooser;
