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
  onAction: (step: string, disabled: boolean, title: string) => void;
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
        // pointerEvents: disabled ? "none" : "auto",
        transition: "background-color 0.3s ease",
        boxShadow: disabled ? "none" : "0px 4px 20px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          backgroundColor: disabled ? "#bbc1c3" : "#bbc1c3",
          boxShadow: disabled ? "none" : "0px 8px 30px rgba(0, 0, 0, 0.2)",
        },
      }}
      variant="elevation"
    >
      <CardActionArea onClick={() => onAction(step, disabled, title)}>
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
