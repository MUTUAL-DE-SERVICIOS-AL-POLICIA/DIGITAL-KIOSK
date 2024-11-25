import { Card, Grid, Typography } from "@mui/material"
// @ts-expect-error
import Hands from '@/assets/images/hands.png'
import Fingerprint from "./Fingerprint"
import { forwardRef, useImperativeHandle } from "react"
import { useLoading } from "@/hooks/useLoading"
import { useBiometricStore } from "@/hooks/useBiometric"
import { useCredentialStore } from "@/hooks"
import Swal from "sweetalert2"

export const BiometricRecognition = forwardRef((_, ref) => {

  useImperativeHandle(ref, () => ({
    onRemoveCam: () => {},
    onPlaying: () => {},
    action: () => handleBiometric()
  }))

  const { isLoading, setLoading } = useLoading()
  const { fingerprints, compareFingerprints } = useBiometricStore()
  const { changeStep, changeIdentifyUser } = useCredentialStore()

  const assembleAnswer = (fingerprints: any[]) => {
    if(fingerprints !== undefined) {
      return fingerprints.map((fingerprint: any) => {
        const wsq = fingerprint.wsqBase64
        const quality = fingerprint.quality
        const fingerprintTypeId = fingerprint.fingerprintType.id
        return { wsq, quality, fingerprintTypeId }
      })
    }
  }

  const handleBiometric = async () => {
    try {
      setLoading(true)
      const body = assembleAnswer(fingerprints)
      const response = await compareFingerprints(body)
      if(response) {
        changeStep('home')
        changeIdentifyUser(true)
      }
      else {
        Swal.fire({
          title: "Hubo un error",
          text: "No se pudo realizar la comparación",
          icon: "error",
        })
      }
    } catch (e: any) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

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
          <div style={{ fontSize: '84px', color: '#E0E0E0'}}>Comparando huellas
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
          </div>
        </div>
      }
    </Grid>
  )
})