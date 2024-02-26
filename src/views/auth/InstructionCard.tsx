import { Box, Card, Grid, Typography } from "@mui/material";
// @ts-expect-error do not proceed
import imageLogo from '@/assets/images/carnet.png';
import { useCredentialStore } from "@/hooks";
import { forwardRef, useContext, useImperativeHandle } from "react";
import { TimerContext } from "@/context/TimerContext";

export const InstructionCard = forwardRef((_, ref) => {

  const { changeIdentityCard, changeIdentifyUser, changeStateInstruction, changeStep } = useCredentialStore();
  const { resetTimer } = useContext(TimerContext)

  useImperativeHandle(ref, () => ({
    action: (state: boolean) => {
      resetTimer()
      if(state) {
        changeStateInstruction(false)
        changeStep('recognitionCard')
      } else {
        changeIdentityCard('')
        changeIdentifyUser(false)
        changeStateInstruction(true)
      }
    },
    onRemoveCam: () => {}
  }))

  return (
    <Grid container alignItems="center" style={{ marginTop: '15vh' }}>
      <Grid item container sm={6} direction="column" justifyContent="spacebetween">
        <Card sx={{ ml: 10, borderRadius: '30px', p: 2}} variant="outlined">
          <Typography sx={{ p: 2 }} align="center" style={{ fontSize: '2.5vw', fontWeight: 500 }}>
            Introduzca su carnet de identidad en la ranura de abajo.<br/>
            Quitese los anteojos, sombrero y barbijo para realizar el proceso correctamente.
          </Typography>
        </Card>
      </Grid>
      <Grid item container sm={6} direction="column">
        <Box display="flex" justifyContent="center">
          <img src={imageLogo} alt="Descripción de la imagen" style={{ width: '30vw' }} />
        </Box>
      </Grid>
    </Grid>
  )
})
