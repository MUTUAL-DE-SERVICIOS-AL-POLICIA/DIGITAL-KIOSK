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
}

const CardMethodChooser = memo((props: CardMethodChooserProp) => {
  const { title, image, step, onAction } = props;

  return (
    <Card sx={{ minWidth: 450, borderRadius: "40px" }} variant="elevation">
      <CardActionArea onClick={() => onAction(step)}>
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
