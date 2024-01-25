import { AppBar, Toolbar, Typography } from '@mui/material';

import { IdentityCard } from './IdentityCard';
// import { RecognitionView } from './recognition';
import { useEffect, useRef } from 'react';
import { useCredentialStore } from '@/hooks';
import { InstructionCard } from './InstructionCard';

import imageLogoBlanco from '@/assets/images/muserpol-logo-blanco.png';
import { HomeScreen } from './HomeScreen';
import { RecognitionView } from './recognition';
import { LoanView } from '../loans/LoanView';

type reconigtionViewRef = {
  onRemoveCam: () => void;
};

export const AuthView = () => {

  const reconigtionViewRef = useRef<reconigtionViewRef | null>(null);
  const { step, identityCard, timer = 0, changeIdentityCard, changeIdentifyUser, changeTimer, changeStateInstruction, changeStep } = useCredentialStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step != 'home' && timer > 0) {
      interval = setInterval(() => {
        changeTimer(timer - 1);
        if (timer == 1) {
          //reiniciando todo
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

  const handlePressedInstructionCard = (state: boolean) => {
    changeTimer(20)
    if (state) {
      changeStateInstruction(false);
      changeStep('recognitionCard')
    } else {
      changeIdentityCard('')
      changeIdentifyUser(false)
      changeStateInstruction(true)
    }
  }
  return (
    <>
      {/* barra superior */}
      {step != 'home' && <AppBar position="static" style={{ background: '#008698' }}>
        <Toolbar sx={{ py: .5 }}>
          <img src={imageLogoBlanco} alt="Descripción de la imagen" style={{ width: '10vw' }} />
          <Typography variant='h4' color='white'>{timer}</Typography>
        </Toolbar>
      </AppBar>}
      {/* pantalla casita */}
      {
        step == 'home' && <HomeScreen />
      }
      {/* pantalla input carnet */}
      {
        step == 'identityCard' && <IdentityCard
          onChange={() => changeTimer(20)}
        />
      }
      {/* pantalla instruccion */}
      {
        identityCard != '' && step == 'instructionCard' && <InstructionCard onPressed={handlePressedInstructionCard} />
      }
      {/* pantalla reconocimiento facial */}
      {
        step == 'recognitionCard' && <RecognitionView ref={reconigtionViewRef} />
      }
    </>
  );
};
