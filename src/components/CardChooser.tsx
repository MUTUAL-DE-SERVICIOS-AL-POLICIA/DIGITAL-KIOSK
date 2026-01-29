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

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "white",
  "&:hover": {
    transform: "scale(0.95)",
    transition: "transform 0.2s ease",
  },
  borderRadius: "20px",
  boxShadow: theme.shadows[1],
}));

const DisabledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#D5DAD0",
  color: "#616161",
  borderRadius: "20px",
  boxShadow: theme.shadows[1],
}));

interface CardChooserProps {
  title: string;
  subTitle: string;
  message: string;
  canCreate: boolean;
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
  const { title, subTitle, message, canCreate, icon, code, onAction } = props;
  const CardComponent = canCreate ? StyledCard : DisabledCard;
  return (
    <Grid item xs={12}>
      <CardComponent variant="outlined">
        <CardActionArea onClick={() => canCreate && onAction(code)} disabled={!canCreate}>
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
              <Typography variant="h6" sx={{ fontSize: 25 }}>
                {message}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </CardComponent>
    </Grid>
  );
});

export default CardChooser;
