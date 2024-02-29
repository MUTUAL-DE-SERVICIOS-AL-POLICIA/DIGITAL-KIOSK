import { Box, Grid } from "@mui/material"
import { CardComponent } from "@/components"
// @ts-expect-error no proceded
import logo from '@/assets/images/contribution.png'
import { useEffect } from "react"
import { useContributionStore } from "@/hooks/useContributionStore"
import { useAuthStore } from "@/hooks/useAuthStore"
import Swal from "sweetalert2"

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
   }

   return (
      <Box>
         <Grid container>
            <Grid item>
               { hasContributionActive &&
                  <CardComponent
                     title="Certificación de Activo"
                     onPressed={() => handlePrintContributionActive()}
                     logo={logo}
                  />
               }
            </Grid>
            <Grid item>
               { hasContributionPassive &&
                  <CardComponent
                     title="Certificación de Pasivo"
                     onPressed={() => handlePrintContributionPassive()}
                     logo={logo}
                  />
               }
            </Grid>
         </Grid>
      </Box>
   )
}