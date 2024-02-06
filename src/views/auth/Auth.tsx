import { AppBar, Toolbar, Typography } from '@mui/material';

import { IdentityCard } from './IdentityCard';
import { useEffect, useRef } from 'react';
import { useCredentialStore } from '@/hooks';
import { InstructionCard } from './InstructionCard';

//@ts-ignore
import imageLogoBlanco from '@/assets/images/muserpol-logo-blanco.png';
import { HomeScreen } from './HomeScreen';
import { RecognitionView } from './recognition';
import Footer from '@/components/Footer';

interface ChildRefType {
  action: (prop?: boolean) => void;
  onRemoveCam?: () => void;
}

type reconigtionViewRef = {
  onRemoveCam: () => void;
};

export const AuthView = () => {

  const childRef = useRef<ChildRefType>()
  const reconigtionViewRef = useRef<reconigtionViewRef | null>(null);
  const {
    step, identityCard,
    timer = 0, changeTimer,
    changeStep, changeIdentifyUser,
    changeIdentityCard, changeStateInstruction
  } = useCredentialStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step != 'home' && timer > 0) {
      interval = setInterval(() => {
        changeTimer(timer - 1);
        if (timer == 1) {
          reconigtionViewRef.current?.onRemoveCam();
          changeIdentityCard('')
          changeIdentifyUser(false)
          changeStateInstruction(true)
          changeTimer(20)
          changeStep('home')
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleClick = () => {
    if(childRef) if(childRef.current) childRef.current.action(true)
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
      { step != 'home' &&
        <AppBar position="static" style={{ background: '#008698', flex: '0 0 7%' }}>
          <Toolbar>
            <img src={imageLogoBlanco} alt="Imagen tipo logo" style={{ width: '10vw' }} />
            <Typography variant='h4' color='white'>{timer}</Typography>
          </Toolbar>
        </AppBar>
      }{/* barra superior */}
        <div style={{ flex: '1 1 auto', overflowX: 'auto'}}>
          { step == 'home' && <HomeScreen /> }{/* Pantall casita */}
          { step == 'identityCard' && <IdentityCard onChange={() => changeTimer(20)} ref={childRef} /> }{/* pantalla input carnet */}
          { step == 'instructionCard' && identityCard != '' && <InstructionCard onChange={() => changeTimer(20)} ref={childRef} /> }{/* pantalla instruccion */}
          { step == 'recognitionCard' && <RecognitionView ref={childRef}  /> }{/* pantalla reconocimiento facial */}
        </div>
      { step != 'home' && <Footer action={handleClick} />}
    </div>
  );
};
