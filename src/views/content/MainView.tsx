import { ComponentButton, TabComponent } from "@/components"
import { TimerContext } from "@/context/TimerContext";
import { useCredentialStore } from "@/hooks";
import { useAuthStore } from "@/hooks/useAuthStore";
import { AppBar, CircularProgress, Grid, Toolbar, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react";

export const MainView = () => {

  const { changeIdentityCard, changeIdentifyUser, changeStep } = useCredentialStore();
  const { startLogout } = useAuthStore();
  const { seconds, resetTimer } = useContext(TimerContext)
  const [ loading, setLoading ] = useState(false)

  const handleExit = () => {
    startLogout()
    changeStep('home')
    changeIdentifyUser(false)
    changeIdentityCard('')
  }

  useEffect(() => {
    if(seconds == 1) {
      changeIdentityCard('');
      changeIdentifyUser(false)
      startLogout();
      resetTimer()
    }
  }, [seconds]);

   return (
      <div style={{display: 'flex', flexDirection: 'column', height: '100vh' }}>
         <AppBar position="static" style={{ background: '#f2f2f2', flex: '0 0 7%' }}>
            <Toolbar>
               <Typography style={{ fontSize: '3vw', fontWeight: 700}}>MIS SERVICIOS</Typography>
               <Typography style={{ fontSize: '2vw', fontWeight: 700}}>{ seconds }</Typography>
            </Toolbar>
         </AppBar>
         <div style={{flex: '1 1 auto', overflowX: 'auto'}}>
            <TabComponent setLoading={setLoading} />
         </div>
         <AppBar position="static" sx={{backgroundColor: '#EEEEEE'}} style={{flex: '0 0 17%'}}>
            <Grid container justifyContent="center" alignContent="center">
               <Grid item >
                  <ComponentButton
                     onClick={() => handleExit()}
                     text={`SALIR`}
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