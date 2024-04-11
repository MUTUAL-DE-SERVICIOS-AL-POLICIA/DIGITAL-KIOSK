import { Box, Grid, Stack, Typography } from "@mui/material"
import { CardComponent } from "@/components"
// @ts-expect-error no proceded
import logo from '@/assets/images/aportes.png'
import { useContext, useEffect } from "react"
import { useContributionStore } from "@/hooks/useContributionStore"
import { useAuthStore } from "@/hooks/useAuthStore"
import Swal from "sweetalert2"
import { TimerContext } from "@/context/TimerContext"

interface Props {
   setLoading: (flag: boolean) => void
}

export const ContributionView = (props: Props) => {

   const {
      setLoading
   } = props

   const {
      getAllContributions,
      hasContributionActive,
      hasContributionPassive,
      printContributionActive,
      printContributionPassive
   } = useContributionStore()

   const { user } = useAuthStore()

   const { resetTimer } = useContext(TimerContext)

   useEffect(() => {
      getAllContributions(user.nup)
   }, [])

   const handlePrintContributionActive = async () => {
      setLoading(true)
      const response: any = await printContributionActive(user.nup)
      switch(response) {
         case 200:
         Swal.fire({
            title: 'Impresión exitosa',
            text: 'Recoja su hoja impresa',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            timer: 3000
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
   }

   const handlePrintContributionPassive = async () => {
      const response: any = await printContributionPassive(user.nup)
      switch(response) {
         case 200:
         Swal.fire({
            title: 'Impresión exitosa',
            text: 'Recoja su hoja impresa',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            timer: 3000
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
      resetTimer()
   }

   return (
      <Box sx={{padding: 5}}>
         <Grid container justifyContent="center" alignItems="center">
            <Typography variant="h3" sx={{textAlign: 'center', fontWeight: 700, mb: 1}}>APORTES</Typography>
            <Stack direction="column" spacing={3}>
               <Grid item>
                  { hasContributionActive &&
                     <CardComponent
                        procedureTitle="Certificación de Activo"
                        onPressed={() => handlePrintContributionActive()}
                        logo={logo}
                     />
                  }
               </Grid>
               <Grid item>
                  { hasContributionPassive &&
                     <CardComponent
                        procedureTitle="Certificación de Pasivo"
                        onPressed={() => handlePrintContributionPassive()}
                        logo={logo}
                     />
                  }
               </Grid>
            </Stack>
         </Grid>
      </Box>
   )
}