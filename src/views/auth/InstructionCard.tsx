import { ComponentButton } from "@/components";
import { Grid, Stack, Typography } from "@mui/material";


interface Props {
  onPressed: (state: boolean) => void;
}
export const InstructionCard = (props: Props) => {
  const { onPressed } = props;

  return (
    <Grid container alignItems="center" style={{ marginTop: '20vh' }}>
      <Grid item container sm={9} direction="column" justifyContent="center">
        <Typography sx={{ p: 2 }} align="center" style={{ fontSize: '3vw', fontWeight: 500 }}>
          Por favor ingrese su carnet de identidad
        </Typography>
      </Grid>
      <Grid item container sm={3} direction="column" justifyContent="center">
        <Stack spacing={2} sx={{ p: 2 }}>
          <ComponentButton
            color="warning"
            onClick={() => onPressed(false)}
            text="ATRÁS"
            sx={{ fontSize: innerWidth > innerHeight ? '3.5vw' : '5.5vw', width: '100%' }}
          />
          <ComponentButton
            onClick={() => onPressed(true)}
            text="CONTINUAR"
            sx={{ fontSize: innerWidth > innerHeight ? '3.5vw' : '5.5vw', width: '100%' }}
          />
        </Stack>
      </Grid>
    </Grid>
  )
}
