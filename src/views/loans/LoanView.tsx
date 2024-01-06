import { useAuthStore } from "@/hooks/useAuthStore";
import { useLoanStore } from "@/hooks/useLoanStore";
import { AppBar, Grid, Toolbar, Typography } from "@mui/material";
import { useEffect } from 'react';
import { CardLoan } from "./CardLoan";
import { useCredentialStore } from "@/hooks";

export const LoanView = () => {
  const { user } = useAuthStore();
  const { loans, getLoans } = useLoanStore();
  const { startLogout } = useAuthStore();
  const { timer, changeIdentityCard, changeIdentifyUser, changeTimer } = useCredentialStore();
  const { printKardexLoan } = useLoanStore();

  useEffect(() => {
    getLoans(user.nup);
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer > 0) {
      interval = setInterval(() => {
        changeTimer(timer - 1);
        if (timer == 1) {
          changeIdentityCard('');
          changeIdentifyUser(false)
          startLogout();
          changeTimer(20);
        }
      }, 1000);
    }
    return () => clearInterval(interval);

  }, [timer]);

  const handlePaperClick = (loanId: number) => {
    changeTimer(20);
    printKardexLoan(loanId)
  };

  return (
    <>
      <AppBar position="static" style={{ background: '#f2f2f2' }}>
        <Toolbar>
          <Typography style={{ fontSize: '4vw', fontWeight: 700 }}>MIS PRESTAMOS</Typography>
        </Toolbar>
      </AppBar>
      {
        loans && <Grid container>
          {
            loans.current.map((loan: any) => {
              return (
                <Grid item key={loan.id} xs={12} sm={4}>
                  <CardLoan
                    title={loan.procedure_modality}
                    onPressed={() => handlePaperClick(loan.id)}
                  />
                </Grid>
              )
            })
          }
          {
            loans.liquited.map((loan: any) => {
              return (
                <Grid item key={loan.id} xs={12} sm={4}>
                  <CardLoan
                    title={loan.procedure_modality}
                    onPressed={() => handlePaperClick(loan.id)}
                  />
                </Grid>
              )
            })
          }
        </Grid>
      }
    </>
  )
}
