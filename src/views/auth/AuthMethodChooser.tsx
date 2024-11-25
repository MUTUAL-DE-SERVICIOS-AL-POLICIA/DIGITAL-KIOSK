import { useCredentialStore } from '@/hooks';
import { Grid } from '@mui/material';
// @ts-expect-error no proceded
import Face from '@/assets/images/face.png'
// @ts-expect-error no proceded
import Fingerprint from '@/assets/images/fingerprint.jpg'
import CardMethodChooser from '@/components/CardMethodChooser';
import { useEffect } from 'react';
import { useBiometricStore } from '@/hooks/useBiometric';
import { usePersonStore } from '@/hooks/usePersonStore';


const METHODS_AUTH = [
  {
    title: 'Reconocimiento Facial',
    image: Face,
    action: 'instructionCard'
  },
  {
    title: 'Reconocimiento Dactilar',
    image: Fingerprint,
    action: 'biometricRecognition'
  }
]

export const AuthMethodChooser = () => {

  const { changeStep, identityCard } = useCredentialStore()
  const { fingerprints, getFingerprints } = useBiometricStore()
  const { getPerson } = usePersonStore()

  const handleAction = (step: string) => {
    changeStep(step)
  }

  const totalData = async () => {
    const personId = await getPerson(identityCard)
    if(personId !== undefined) {
      await getFingerprints(personId)
    }
  }

  useEffect(() => {
    totalData()
  }, [])

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '70vh'}}
    >
      { METHODS_AUTH.map((method) => {
        if(fingerprints.length !== 0) {
          return (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              sm={6}
              item
              direction="column"
              key={method.title}
            >
              <CardMethodChooser
                title={method.title}
                image={method.image}
                action={() => handleAction(method.action)}
              />
            </Grid>
          )
        } else if(method.title == 'Reconocimiento Facial') {
          return (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              sm={6}
              item
              direction="column"
              key={method.title}
            >
              <CardMethodChooser
                title={method.title}
                image={method.image}
                action={() => handleAction(method.action)}
              />
            </Grid>
          )
        }
      }
      )}
    </Grid>
  )
}