import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import React, { cloneElement, memo } from "react";

const StyledCard = styled(Card)(() => ({
  backgroundColor: "white",
  "&:hover": {
    transform: "scale(0.95)",
    transition: "transform 0.2s ease",
  },
  borderRadius: "20px",
}));

interface CardChooserProps {
  title: string;
  subTitle: string;
  icon: React.ReactElement;
  code: string;
  onAction: (code: string) => void;
}

const sxIcon = {
  fontSize: 128,
  color: "green",
  mr: 5,
  ml: 3,
  my: 2,
};

const CardChooser = memo((props: CardChooserProps) => {
  const { title, subTitle, icon, code, onAction } = props;
  return (
    <Grid item xs={12}>
      <StyledCard variant="outlined">
        <CardActionArea onClick={() => onAction(code)}>
          <CardContent sx={{ display: "flex", alignItems: "center" }}>
            {icon &&
              cloneElement(icon as React.ReactElement, {
                sx: sxIcon,
                variant: "outlined",
              })}
            <Box sx={{ mr: 2, my: 6 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 40 }} variant="h4">
                {title}
              </Typography>
              <Typography variant="h5" sx={{ fontSize: 40 }}>
                {subTitle}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </StyledCard>
    </Grid>
  );
});

export default CardChooser;
