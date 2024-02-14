import { Box, Grid, Typography } from "@mui/material";
// @ts-ignore
import imageLogo from '@/assets/images/carnet.png';
import { useCredentialStore } from "@/hooks";
import { forwardRef, useImperativeHandle } from "react";

interface Props {
  onChange: () => void;
}
export const InstructionCard = forwardRef((props: Props, ref) => {

  const { onChange } = props;
  const { changeIdentityCard, changeIdentifyUser, changeStateInstruction, changeStep } = useCredentialStore();

  useImperativeHandle(ref, () => ({
    action: (state: boolean) => {
      onChange()
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
        <Typography sx={{ p: 2 }} align="center" style={{ fontSize: '2.5vw', fontWeight: 500 }}>
          Introduzca su carnet de identidad en la ranura de abajo.<br/>
          Quitese los anteojos, sombrero y barbijo para realizar el proceso correctamente.
        </Typography>
      </Grid>
      <Grid item container sm={6} direction="column">
        <Box display="flex" justifyContent="center">
          <img src={imageLogo} alt="Descripción de la imagen" style={{ width: '30vw' }} />
        </Box>
      </Grid>
    </Grid>
  )
})
