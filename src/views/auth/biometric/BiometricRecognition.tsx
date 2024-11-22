import { Card, Grid, Typography } from "@mui/material"
// @ts-expect-error
import Hands from '@/assets/images/hands.png'
import Fingerprint from "./Fingerprint"
import { forwardRef, useEffect, useImperativeHandle } from "react"
import { useLoading } from "@/hooks/useLoading"
import { useBiometricStore } from "@/hooks/useBiometric"
// import { useAuthStore } from "@/hooks/useAuthStore"

export const BiometricRecognition = forwardRef((_, ref) => {

  useImperativeHandle(ref, () => ({
    onRemoveCam: () => {},
    onPlaying: () => {},
    action: () => handleBiometric()
  }))

  const { isLoading, setLoading } = useLoading()
  const { getFingerprints } = useBiometricStore()
  // const { user } = useAuthStore()

  const handleBiometric = () => {
    try {
      setLoading(true)
      // llamar a la api que realiza la comparación de las huellas
    } catch (e: any) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // (1) Obtener el id de la persona (API)
    // (2) Obtener las huellas
    getFingerprints(1)
  }, [])

  return (
    <Grid container alignItems="center" sx={{my: 5 }}>
      <Grid item container sm={7} direction="column" justifyContent="space-between">
        <Card sx={{mx: 10, borderRadius: '30px', p: 2}} variant="outlined">
          <Typography sx={{ p: 2}} align="center" style={{fontSize: '2.5vw', fontWeight: 500}}>
            Por favor, coloque uno de los <b>dedos indicados</b> en la imagen para realizar el <b>reconocimiento biométrico</b> de la huella.
          </Typography>
        </Card>
      </Grid>
      <Grid item container sm={5} direction="column">
        <Card sx={{mx: 10, borderRadius: '30px', p: 2}} variant="outlined">
          <Fingerprint />
        </Card>
      </Grid>
      { isLoading &&
        <div className="overlay">
          <div >Comparando huellas...</div>
        </div>
      }
    </Grid>
  )
})