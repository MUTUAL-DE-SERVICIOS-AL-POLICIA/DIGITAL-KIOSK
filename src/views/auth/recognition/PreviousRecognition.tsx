import { TimerContext } from "@/context/TimerContext"
import { useCredentialStore } from "@/hooks"
import { Grid, Typography } from "@mui/material"
import { forwardRef, useContext, useImperativeHandle } from "react"

export const PreviousRecognition = forwardRef((_, ref) => {

   const { changeStep } = useCredentialStore()

   const { resetTimer } = useContext(TimerContext)

   useImperativeHandle(ref, () => ({
      action: () => {
         changeStep('faceRecognition')
         resetTimer()
      }
   }))

   return (
      <Grid
         container
         justifyContent="center"
         alignItems="center"
         style={{ height: '65vh' }}
      >
         <Grid item container sm={6} direction="column">
            <Typography style={{ fontSize: '3.5vw' }} align="center">
               Por favor recoja su carnet de identidad de la bandeja
            </Typography>
         </Grid>
      </Grid>
   )
})

