import { Card, Paper, Stack, Typography } from "@mui/material"
// @ts-ignore
import logo from '@/assets/images/PlanDePagos.png';
import './styles.css';

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
      className="dynamic"
    >
      <Stack sx={{margin: 'auto', alignItems: 'center'}}>
        <img src={logo} alt="Descripción de la imagen" style={{ width: '10vw'}} />
      </Stack>
      <Card sx={{ px: 3, py: 2, my: 2, backgroundColor: '#1E635A', borderRadius: '10px' }}>
        <Typography variant="h4" sx={{ color: 'white', textAlign: 'center' }}>
          {title}
        </Typography>
      </Card>
      <Typography variant="h5" align="center">
        {title}
      </Typography>
    </Paper>
  )
}
