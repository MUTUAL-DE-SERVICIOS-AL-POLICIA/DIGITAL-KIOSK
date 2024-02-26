import { AppBar, Toolbar, Typography } from '@mui/material';

import { IdentityCard } from './IdentityCard';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { useCredentialStore } from '@/hooks';
import { InstructionCard } from './InstructionCard';

//@ts-expect-error do not proceed
import imageLogoBlanco from '@/assets/images/muserpol-logo-blanco.png';
import { HomeScreen } from './HomeScreen';
import { FaceRecognition, OcrView } from './recognition';
import Footer from '@/components/Footer';
import { PreviousRecognition } from './recognition/PreviousRecognition';

import { TimerContext } from '@/context/TimerContext';

interface ChildRefType {
  action: (prop?: boolean) => void;
  onRemoveCam: () => void;
}

export const AuthView = () => {

  const childRef = useRef<ChildRefType>()
  const {
    step, identityCard,
    changeStep, changeIdentifyUser,
    changeIdentityCard, changeStateInstruction
  } = useCredentialStore();

  const { seconds, resetTimer } = useContext(TimerContext)

  useEffect(() => {
    if (step != 'name' && seconds > 0 ) {
      if(seconds == 1) {
        childRef.current?.onRemoveCam()
        changeStep('home')
        changeIdentityCard('')
        changeIdentifyUser(false)
        changeStateInstruction(true)
        resetTimer()
      }
    }
  }, [step, seconds]);

  const handleClick = useCallback(() => {
    if(childRef) if(childRef.current) childRef.current.action(true)
    resetTimer()
  }, [childRef])

  const handleClean = useCallback(() => {
    if(childRef) if(childRef.current) childRef.current.onRemoveCam()
  },[childRef])

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
      { step != 'home' &&
        <AppBar position="static" style={{ background: '#008698', flex: '0 0 7%' }}>
          <Toolbar>
            <img src={imageLogoBlanco} alt="Imagen tipo logo" style={{ width: '10vw' }} />
            { identityCard && <Typography variant='h4' color='white'><b>CI ingresado: </b> {identityCard}</Typography> }
            <Typography variant='h4' color='white'> {seconds}</Typography>
          </Toolbar>
        </AppBar>
      }{/* barra superior */}
        <div style={{ flex: '1 1 auto', overflowX: 'auto'}}>
          { step == 'home' && <HomeScreen /> }{/* Pantall casita */}
          { step == 'identityCard' && <IdentityCard ref={childRef} /> }{/* pantalla input carnet */}
          { step == 'instructionCard' && identityCard != '' && <InstructionCard ref={childRef} /> }{/* pantalla instruccion */}
          { step == 'recognitionCard' && <OcrView ref={childRef} /> } {/* pantalla reconocimiento ocr */}
          { step == 'previousFaceRecognition' && <PreviousRecognition ref={childRef} />}
          { step == 'faceRecognition' && <FaceRecognition ref={childRef} />}
         </div>
      { step != 'home' && <Footer action={handleClick} onRemoveCam={handleClean}/>}
    </div>
  );
};
