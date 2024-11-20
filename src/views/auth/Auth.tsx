
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
import { AuthMethodChooser } from './AuthMethodChooser';
import { BiometricRecognition } from './biometric/BiometricRecognition';
import { Chooser } from './Chooser';
import Header from '@/components/Header';

interface ChildRefType {
  action: (prop?: boolean) => void;
  onRemoveCam: () => void;
}

export const AuthView = () => {

  const childRef = useRef<ChildRefType>()
  const {
    step, identityCard, name,
    changeStep, changeIdentifyUser,
    changeIdentityCard, changeStateInstruction
  } = useCredentialStore();

  const { seconds, resetTimer } = useContext(TimerContext)

  useEffect(() => {
    if(step == 'home') {
      resetTimer()
    } else if(seconds == 1) {
      childRef.current?.onRemoveCam()
      changeStep('home')
      changeIdentityCard('')
      changeIdentifyUser(false)
      changeStateInstruction(true)
      resetTimer()
    }
  }, [step, seconds]);

  const handleClick = useCallback(() => {
    if(childRef) if(childRef.current) childRef.current.action(true)
    resetTimer()
  }, [childRef])

  const handleClean = useCallback(() => {
    if(childRef) if(childRef.current) childRef.current.onRemoveCam()
  },[childRef])

  const resetStep = useCallback(() => {
    changeStep('home')
    changeIdentityCard('')
    handleClean()
  },[])

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
      { step != 'home' && <Header name={name} identityCard={identityCard} seconds={seconds} resetStep={resetStep}/> }
      <div style={{ flex: '1 1 auto', overflowX: 'auto'}}>
        { step == 'home' && <HomeScreen /> }{/* Pantalla casita */}
        { step == 'chooser' && <Chooser />} {/* Pantalla selección de servicio */}
        { step == 'identityCard' && <IdentityCard ref={childRef} /> }{/* Pantalla input carnet */}
        { step == 'authMethodChooser' && <AuthMethodChooser />} {/* Pantalla de selección de autenticación */}
        { step == 'instructionCard' && identityCard != '' && <InstructionCard ref={childRef} /> }{/* Pantalla instrucción */}
        { step == 'recognitionCard' && <OcrView ref={childRef} /> } {/* Pantalla reconocimiento ocr */}
        { step == 'previousFaceRecognition' && <PreviousRecognition ref={childRef} />} {/* Pantalla para retirar el carnet */}
        { step == 'faceRecognition' && <FaceRecognition ref={childRef} />} {/* Pantalla de reconocimiento facial */}
        { step == 'biometricRecognition' && <BiometricRecognition/>} {/* Pantalla reconocimiento de huellas */}
      </div>
      { step != 'home' && step != 'chooser' && step != 'authMethodChooser' && <Footer action={handleClick} onRemoveCam={handleClean}/>}
    </div>
  );
};
