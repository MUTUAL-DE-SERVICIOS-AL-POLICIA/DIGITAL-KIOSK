import { ComponentButton } from "@/components"
import { TimerContext } from "@/context/TimerContext";
import { useCredentialStore } from "@/hooks";
import { useAuthStore } from "@/hooks/useAuthStore";
import { AppBar, CircularProgress, Grid, Paper, Toolbar, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react";
import { LoanView } from "./loans/LoanView";
import { ContributionView } from "./contributions/ContributionView";
//@ts-expect-error do not proceed
import imageLogoBlanco from '@/assets/images/muserpol-logo-blanco.png';

export const MainView = () => {

   const { changeIdentityCard, changeIdentifyUser, changeStep, name, identityCard } = useCredentialStore();
   const { startLogout } = useAuthStore();
   const { seconds, resetTimer } = useContext(TimerContext)
   const [loading, setLoading] = useState(false)

   const handleExit = () => {
      startLogout()
      changeStep('home')
      changeIdentifyUser(false)
      changeIdentityCard('')
   }

   useEffect(() => {
      if (seconds == 1) {
         changeIdentityCard('');
         changeIdentifyUser(false)
         startLogout();
         resetTimer()
      }
   }, [seconds]);

   return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
         <AppBar position="static" style={{ background: '#008698', flex: '0 0 7%' }}>
            <Toolbar>
               <img src={imageLogoBlanco} alt="Imagen tipo logo" style={{ width: '10vw' }} />
               {identityCard && <Typography variant='h4' color='white'>{name}<b> &nbsp; CI: {identityCard} </b></Typography>}
               <Typography style={{ color: 'white', fontSize: '2vw', fontWeight: 700 }}>{seconds}</Typography>
            </Toolbar>
         </AppBar>
         <Grid container spacing={2} style={{ display: 'flex', height: '100vh', marginTop: 5 }}>
            <Grid item xs={12}>
               <Grid container spacing={10}>
                  <Grid xs={6} item style={{ display: 'flex', flexDirection: 'column' }}>
                     <Paper elevation={0} sx={{ height: '73vh', borderRadius: '20px', ml: 10 }}>
                        <ContributionView setLoading={setLoading} />
                     </Paper>
                  </Grid>
                  <Grid xs={6} item>
                     <Paper elevation={0} sx={{ height: '73vh', borderRadius: '20px', mr: 10 }}>
                        <LoanView setLoading={setLoading} />
                     </Paper>
                  </Grid>
               </Grid>
            </Grid>
         </Grid>
         <AppBar position="static" sx={{ backgroundColor: '#EEEEEE' }} style={{ flex: '0 0 17%' }}>
            <Grid container justifyContent="center" alignContent="center">
               <Grid item >
                  <ComponentButton
                     onClick={() => handleExit()}
                     text={`SALIR`}
                     color="warning"
                     sx={{ fontSize: innerWidth > innerHeight ? '3.5vw' : '4.5vw', width: '100%', padding: "0px 30px" }}
                  />
               </Grid>
            </Grid>
         </AppBar>
         {loading &&
            <div className="overlay">
               <CircularProgress
                  size={120}
                  sx={{
                     color: '#42c9b7',
                     position: 'absolute',
                     top: '50%',
                     left: '50%',
                  }}
               />
            </div>
         }
      </div>
   )
}