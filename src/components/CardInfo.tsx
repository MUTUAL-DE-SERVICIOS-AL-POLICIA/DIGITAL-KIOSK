import { Card, styled, Typography } from "@mui/material";
import { memo } from "react";

interface CardInfoProps {
  text: React.ReactNode;
}

const StyledCard = styled(Card)(({ theme }) => ({
  marginInline: theme.spacing(10),
  borderRadius: "30px",
  padding: theme.spacing(2),
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  fontSize: "2.5vw",
  fontWeight: 500,
}));

export const CardInfo = memo((props: CardInfoProps) => {
  const { text } = props;
  return (
    <StyledCard variant="outlined">
      <StyledTypography>{text}</StyledTypography>
    </StyledCard>
  );
});
