import { useAuthStore } from "@/hooks/useAuthStore";
import { useLoanStore } from "@/hooks/useLoanStore";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useContext, useEffect } from 'react';
import Swal from 'sweetalert2'
import { CardComponent } from "@/components";
// @ts-expect-error no proceded
import logo from '@/assets/images/PlanDePagos.png';
import { TimerContext } from "@/context/TimerContext";

interface Props {
  setLoading: (flag: boolean) => void
}

export const LoanView = (props: Props) => {
  const { user } = useAuthStore();
  const { loans, getLoans } = useLoanStore();
  const { printKardexLoan } = useLoanStore();

  const { resetTimer } = useContext(TimerContext)

  const { setLoading } = props


  useEffect(() => {
    getLoans(user.nup);
  }, [])


  const handlePaperClick = async (loanId: number) => {
    setLoading(true)
    const response:any = await printKardexLoan(loanId)
    switch(response) {
      case 200:
        Swal.fire({
          title: 'Impresión exitosa',
          text: 'Recoja su hoja impresa',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 1500
        });
        break;
      case 400:
        Swal.fire({
          title: 'No hay impresora conectada',
          text: 'Contactese con soporte',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          timer: 1500
        });
        break;
      case 501:break;
      default:
        Swal.fire({
          title: 'Hubo un error',
          text: 'El servicio de impresión no se encuentra disponible',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          timer: 1500
        })
        break;
    }
    setLoading(false)
    resetTimer()
  };

  return (
    <Box sx={{padding: 5}}>
      {
        loans && <Grid container justifyContent="center" alignItems="center">
          <Typography variant="h3" sx={{textAlign: 'center', fontWeight: 700, mb: 1}}>PRÉSTAMOS - EXTRACTO</Typography>
          { loans && loans.current.length == 0 && <Grid container justifyContent="center" alignItems="center" style={{ minHeight: 'calc(50vh)' }}>
            <Grid item>
              <Typography variant="h3">
                Sin préstamos
              </Typography>
            </Grid>
            </Grid>
          }
          <Stack direction="column" spacing={3} sx={{overflowX: 'auto', maxHeight: '60vh'}}>
            {
              loans.current.map((loan: any) => {
                return (
                  <Grid item key={loan.id} >
                    <CardComponent
                      procedureTitle={loan.procedure_modality}
                      onPressed={() => handlePaperClick(loan.id)}
                      logo={logo}
                    />
                  </Grid>
                )
              })
            }
          </Stack>
        </Grid>
      }
    </Box>
  )
}
