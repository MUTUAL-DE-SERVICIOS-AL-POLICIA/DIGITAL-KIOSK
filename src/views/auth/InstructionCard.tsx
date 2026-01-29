import { Box, Grid, styled } from "@mui/material";
// @ts-expect-error do not proceed
import imageLogo from "@/assets/images/carnet.png";
import { useCredentialStore } from "@/hooks";
import { forwardRef, useImperativeHandle, memo } from "react";
import { CardInfo } from "@/components/CardInfo";

const text = (
  <>
    Introduzca su <b>carnet de identidad</b> en la bandeja inferior y
    presione <b>CONTINUAR</b><br/>
  </>
);

const GridContainer = styled(Grid)({
  alignItems: "center",
  marginTop: "15vh",
});

const GridImageContainer = styled(Grid)({
  display: "flex",
  flexDirection: "column",
});

const ImageContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
});

const StyledImage = styled("img")({
  width: "30vw",
});

const GridTextContainer = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

export const InstructionCard = memo(
  forwardRef((_, ref) => {
    const {
      changeIdentityCard,
      changeIdentifyUser,
      changeStateInstruction,
      changeStep,
    } = useCredentialStore();

    useImperativeHandle(ref, () => ({
      action: (state: boolean) => {
        if (state) {
          changeStateInstruction(false);
          changeStep("recognitionCard");
        } else {
          changeIdentityCard("");
          changeIdentifyUser(false);
          changeStateInstruction(true);
        }
      },
      onRemoveCam: () => {},
    }));

    return (
      <GridContainer container>
        <GridTextContainer item container sm={6}>
          <CardInfo text={text} />
        </GridTextContainer>
        <GridImageContainer item container sm={6}>
          <ImageContainer>
            <StyledImage src={imageLogo} alt="Descripción de la imagen" />
          </ImageContainer>
        </GridImageContainer>
      </GridContainer>
    );
  })
);
