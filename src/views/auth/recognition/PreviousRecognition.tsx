import { useCredentialStore } from "@/hooks";
import { Box, Card, Grid, Typography } from "@mui/material";
import { forwardRef, useImperativeHandle, memo } from "react";
//@ts-expect-error do not proceed
import imageLogo from "@/assets/images/carnet.png";

export const PreviousRecognition = memo(
  forwardRef((_, ref) => {
    const { changeStep } = useCredentialStore();

    useImperativeHandle(ref, () => ({
      action: () => {
        changeStep("faceRecognition");
      },
      onRemoveCam: () => {},
    }));

    return (
      <Grid container justifyContent="center" alignItems="center" style={{ height: "65vh" }}>
        <Grid item container sm={6} direction="column">
          <Card sx={{ ml: 10, borderRadius: "30px", p: 2 }} variant="outlined">
            <Typography sx={{ pl: 5 }} style={{ fontSize: "2.5vw" }} align="center">
              Por favor recoja su <b>carnet de identidad</b> de la bandeja y presione en <b>continuar.</b>
            </Typography>
          </Card>
        </Grid>
        <Grid item container sm={6} direction="column">
          <Box display="flex" justifyContent="center">
            <img src={imageLogo} alt="Imagen carnet" style={{ width: "30vw" }} />
          </Box>
        </Grid>
      </Grid>
    );
  })
);
