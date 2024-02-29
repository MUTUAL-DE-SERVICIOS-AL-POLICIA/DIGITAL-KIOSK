import { useAuthStore } from "@/hooks/useAuthStore";
import { useLoanStore } from "@/hooks/useLoanStore";
import { Box, Grid } from "@mui/material";
import { useEffect } from 'react';
import Swal from 'sweetalert2'
import { CardComponent } from "@/components";
// @ts-expect-error no proceded
import logo from '@/assets/images/PlanDePagos.png';

interface Props {
  setLoading: (flag: boolean) => void
}

export const LoanView = (props: Props) => {
  const { user } = useAuthStore();
  const { loans, getLoans } = useLoanStore();
  const { printKardexLoan } = useLoanStore();

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
        });
        break;
      case 400:
        Swal.fire({
          title: 'No hay impresora conectada',
          text: 'Contactese con soporte',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
        });
        break;
      case 501:break;
      default:
        Swal.fire({
          title: 'Hubo un error',
          text: 'El servicio de impresión no se encuentra disponible',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        })
        break;
    }
    setLoading(false)
  };

  return (
    <Box>
      {
        loans && <Grid container>
          {
            loans.current.map((loan: any) => {
              return (
                <Grid item key={loan.id} xs={12} sm={4}>
                  <CardComponent
                    title={loan.procedure_modality}
                    onPressed={() => handlePaperClick(loan.id)}
                    logo={logo}
                  />
                </Grid>
              )
            })
          }
          {
            loans.liquited.map((loan: any) => {
              return (
                <Grid item key={loan.id} xs={12} sm={4} justifyContent="center" alignContent="center">
                  <CardComponent
                    title={loan.procedure_modality}
                    onPressed={() => handlePaperClick(loan.id)}
                    logo={logo}
                  />
                </Grid>
              )
            })
          }
        </Grid>
      }
    </Box>
  )
}
