import { AppBar, Toolbar, Typography } from '@mui/material';

import { IdentityCard } from './IdentityCard';
import { RecognitionView } from './recognition';
import { useEffect, useState } from 'react';
import logo from '@/assets/images/muserpol.png';
import { useCredentialStore } from '@/hooks';

export const AuthView = () => {

  const [timer, setTimer] = useState(10);
  const { identityCard, changeIdentityCard } = useCredentialStore();

  useEffect(() => {
    // if (identityCard != '') setStateInit(false)
    let interval: NodeJS.Timeout;

    // Si identityCard está presente y el temporizador es mayor que 0, inicia el temporizador
    if (identityCard != '' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
        if (timer == 1) {
          changeIdentityCard('')
          setTimer(10)
        }
      }, 1000);
    }

    // Limpia el temporizador cuando el componente se desmonta o cuando el temporizador llega a 0
    return () => clearInterval(interval);

  }, [identityCard, timer]);


  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <img src={logo} alt="Descripción de la imagen" style={{ width: '30vw' }} />
          <Typography style={{ fontSize: '4vw', fontWeight: 700 }}>Bienvenidos al Kiosco Digital {timer}</Typography>
        </Toolbar>
      </AppBar>
      {
        identityCard == '' ?
          <IdentityCard /> :
          <RecognitionView />
      }
    </>
  );
};
