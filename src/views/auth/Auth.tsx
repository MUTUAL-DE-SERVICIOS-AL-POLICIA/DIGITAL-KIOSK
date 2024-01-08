import { AppBar, Toolbar } from '@mui/material';

import { IdentityCard } from './IdentityCard';
// import { RecognitionView } from './recognition';
import { useEffect, useRef } from 'react';
import { useCredentialStore } from '@/hooks';
import { InstructionCard } from './InstructionCard';

import imageLogoBlanco from '@/assets/images/muserpol-logo-blanco.png';
import { HomeScreen } from './HomeScreen';
import { RecognitionView } from './recognition';

type reconigtionViewRef = {
  onRemoveCam: () => void;
};

export const AuthView = () => {

  const reconigtionViewRef = useRef<reconigtionViewRef | null>(null);
  const { step, identityCard, timer = 0, changeIdentityCard, changeIdentifyUser, changeTimer, changeStateInstruction, changeStep } = useCredentialStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (identityCard != '' && timer > 0) {
      interval = setInterval(() => {
        changeTimer(timer - 1);
        if (timer == 1) {
          reconigtionViewRef.current?.onRemoveCam();
          changeIdentityCard('')
          changeIdentifyUser(false)
          changeStateInstruction(true)
          changeTimer(20)
        }
      }, 1000);
    }
    return () => clearInterval(interval);

  }, [identityCard, timer]);

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
      {step != 'home' && <AppBar position="static" style={{ background: '#008698' }}>
        <Toolbar sx={{ py: .5 }}>
          <img src={imageLogoBlanco} alt="Descripción de la imagen" style={{ width: '10vw' }} />
        </Toolbar>
      </AppBar>}
      {
        step == 'home' && <HomeScreen />
      }
      {
        step == 'identityCard' && <IdentityCard />
      }
      {
        step == 'instructionCard' && <InstructionCard onPressed={handlePressedInstructionCard} />
      }
      {
        step == 'recognitionCard' &&
        // identityCard != '' && (
          // InstructionState ?
            // <InstructionCard onPressed={handlePressedInstructionCard} /> :
            <RecognitionView ref={reconigtionViewRef} />
        // )
      }
    </>
  );
};
