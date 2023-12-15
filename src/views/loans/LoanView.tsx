import { useAuthStore } from "@/hooks/useAuthStore";
import { useLoanStore } from "@/hooks/useLoanStore";
import { AppBar, Grid, Toolbar, Typography } from "@mui/material";
import { useEffect } from 'react';
import { CardLoan } from "./CardLoan";

export const LoanView = () => {
  const { user } = useAuthStore();
  const { loans, getLoans } = useLoanStore();


  useEffect(() => {
    const affiliateId = JSON.parse(user)!.id;
    getLoans(affiliateId);
  }, [])

  return (
    <>
      <AppBar position="static">
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
                    loanId={loan.id}
                    title={loan.procedure_modality}
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
                    loanId={loan.id}
                    title={loan.procedure_modality}
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
