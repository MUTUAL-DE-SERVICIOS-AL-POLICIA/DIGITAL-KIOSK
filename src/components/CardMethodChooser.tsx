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
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
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
        />
      </CardActionArea>
    </Card>
  );
});

export default CardMethodChooser;
