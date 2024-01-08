import { ComponentButton } from "@/components";
import { Box, Grid, Typography } from "@mui/material";
import imageLogo from '@/assets/images/muserpol.png';


interface Props {
  onPressed: (state: boolean) => void;
}
export const InstructionCard = (props: Props) => {
  const { onPressed } = props;

  return (
    <Grid container alignItems="center" style={{ marginTop: '10vh' }}>
      <Grid item container sm={6} direction="column" justifyContent="spacebetween">
        <Typography sx={{ p: 2 }} align="center" style={{ fontSize: '3vw', fontWeight: 500 }}>
          Introduzca su carnet de identidad en la ranura de abajo.<br/>
          Quitese los anteojos, sombrero y barbijo para realizar el proceso correctamente.
        </Typography>
      </Grid>
      <Grid item container sm={6} direction="column">
        <Box display="flex" justifyContent="center">
          <img src={imageLogo} alt="Descripción de la imagen" style={{ width: '40vw' }} />
        </Box>
      </Grid>
      <Grid container justifyContent="center" sx={{marginTop: '10vh'}}>
        <Grid item>
          <ComponentButton
            onClick={() => onPressed(true)}
            text="CONTINUAR"
            sx={{ fontSize: innerWidth > innerHeight ? '3.5vw' : '5.5vw', width: '100%' }}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}
