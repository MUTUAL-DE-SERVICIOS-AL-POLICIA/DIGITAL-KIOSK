import { useAuthStore } from "@/hooks/useAuthStore";
import { useLoanStore } from "@/hooks/useLoanStore";
import { Alert, Box, Grid, Stack, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { CardComponent } from "@/components";
// @ts-expect-error no proceded
import logo from "@/assets/images/PlanDePagos.png";
import { TimerContext } from "@/context/TimerContext";
import { useLoading } from "@/hooks/useLoading";

export const LoanView = () => {
  const { user } = useAuthStore();
  const { loans, getLoans } = useLoanStore();
  const { printKardexLoan } = useLoanStore();
  const { setLoading } = useLoading();

  const { resetTimer } = useContext(TimerContext);

  useEffect(() => {
    getLoans(user.nup);
  }, []);

  const handlePaperClick = async (loanId: number) => {
    setLoading(true);
    const response: any = await printKardexLoan(loanId);
    switch (response) {
      case 200:
        Swal.fire({
          title: "Impresión exitosa",
          text: "Recoja su hoja impresa",
          icon: "success",
          confirmButtonText: "Aceptar",
          timer: 1500,
        });
        break;
      case 400:
        Swal.fire({
          title: "No hay impresora conectada",
          text: "Contactese con soporte",
          icon: "warning",
          confirmButtonText: "Aceptar",
          timer: 1500,
        });
        break;
      case 501:
        break;
      default:
        Swal.fire({
          title: "Hubo un error",
          text: "El servicio de impresión no se encuentra disponible",
          icon: "error",
          confirmButtonText: "Aceptar",
          timer: 1500,
        });
        break;
    }
    setLoading(false);
    resetTimer();
  };

  return (
    <Box sx={{ padding: 5 }}>
      {loans && (
        <Grid container justifyContent="center" alignItems="center">
          <Typography variant="h3">Extracto de Préstamos</Typography>
          <Alert
            severity="info"
            sx={{
              fontSize: "20px",
              marginTop: 0,
              paddingTop: 0,
              color: "black",
            }}
          >
            <b>Trámites registrados a partir del mes de junio del 2021</b>
          </Alert>
          {loans && loans.current.length == 0 && (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              style={{ minHeight: "calc(50vh)" }}
            >
              <Grid item>
                <Typography variant="h3">Sin préstamos</Typography>
              </Grid>
            </Grid>
          )}
          <Stack
            direction="column"
            spacing={3}
            sx={{ overflowX: "auto", maxHeight: "60vh" }}
          >
            {loans.current.map((loan: any) => {
              return (
                <Grid item key={loan.id}>
                  <CardComponent
                    procedureTitle={loan.procedure_modality}
                    onPressed={() => handlePaperClick(loan.id)}
                    logo={logo}
                  />
                </Grid>
              );
            })}
          </Stack>
        </Grid>
      )}
    </Box>
  );
};
