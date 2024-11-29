import { Card, Typography } from "@mui/material";
import { memo } from "react";

interface CardInfoProps {
  text: React.ReactNode;
}

export const CardInfo = memo((props: CardInfoProps) => {
  const { text } = props;
  return (
    <Card sx={{ mx: 10, borderRadius: "30px", p: 2 }} variant="outlined">
      <Typography
        sx={{ p: 2 }}
        align="center"
        style={{ fontSize: "2.5vw", fontWeight: 500 }}
      >
        {text}
      </Typography>
    </Card>
  );
});
