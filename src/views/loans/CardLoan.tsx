import { Card, Paper, Stack, Typography } from "@mui/material"
import logo from '@/assets/images/coin.png';

interface Props {
  title: string;
  onPressed: () => void;
}
export const CardLoan = (props: Props) => {
  const {
    title,
    onPressed,
  } = props;

  return (
    <Paper
      sx={{ p: 8, m: 8, backgroundColor: '#9BC5B8', borderRadius: '30px' }}
      onClick={() => onPressed()}
    >
      <Stack>
        <img src={logo} alt="Descripción de la imagen" style={{ width: '10vw' }} />
        <img src={logo} alt="Descripción de la imagen" style={{ paddingLeft: '30px', width: '10vw', position: "absolute", }} />
        <img src={logo} alt="Descripción de la imagen" style={{ paddingLeft: '60px', width: '10vw', position: "absolute", }} />
        <img src={logo} alt="Descripción de la imagen" style={{ paddingLeft: '90px', width: '10vw', position: "absolute", }} />
      </Stack>
      <Card sx={{ px: 4, py: 2, backgroundColor: '#1E635A', borderRadius: '10px' }}>
        <Typography sx={{ color: 'white' }}>
          {title}
        </Typography>
      </Card>
      <Typography >
        {title}
      </Typography>
    </Paper>
  )
}
