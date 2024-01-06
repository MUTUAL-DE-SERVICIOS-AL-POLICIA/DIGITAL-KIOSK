import { AlphaNumeric, ComponentButton, ComponentInput, KeyboardSimple } from '@/components';
import { useForm } from '@/hooks';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Grid, Stack, Typography } from '@mui/material';
import { useRef, useState } from 'react';

const loginFormFields = {
  identityCard: '',
};

const formValidations = {
  identityCard: [(value: string) => value.length >= 1, 'Debe ingresar su número de carnet de identidad'],
};

type KeyboardRef = {
  onClearInput: () => void;
};

export const IdentityCard = () => {

  const [keyboardComplete, setkeyboardComplete] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { startLogin } = useAuthStore();


  const keyboardRef = useRef<KeyboardRef | null>(null);

  const { identityCard, onInputChange, isFormValid, onValueChange, identityCardValid, onResetForm } = useForm(
    loginFormFields,
    formValidations
  );


  const loginSubmit = () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    startLogin(identityCard);
  };

  return (
    <form style={{ paddingTop: 80 }}>
      <Grid container>
        <Grid item container sm={6}
          direction="column"
          justifyContent="center"
          alignItems="center">
          <ComponentInput
            type="text"
            name="identityCard"
            value={identityCard}
            onChange={onInputChange}
            error={!!identityCardValid && formSubmitted}
            helperText={formSubmitted ? identityCardValid : ''}
            endAdornment={<AlphaNumeric handleKeyboardComplete={setkeyboardComplete} />}
            customSx={{
              px: 10,
              display: 'flex',
              '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                transform: 'translate(10px, -70px)',
              },
              '& .MuiOutlinedInput-input': {
                fontSize: innerWidth > innerHeight ? '3.5vw' : '5.5vw',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                background: 'white',
                height: 'fit-content',
                '& fieldset': { borderColor: '#2F3746' },
                '&:hover fieldset': { borderColor: '#0B815A' },
              },
              '& .MuiFormHelperText-root': {
                fontSize: '1.5vw',
              },
            }}
          />
          <Typography sx={{ px: 5 }} align="center" style={{ fontSize: '3vw', fontWeight: 700 }}>Por favor ingrese su número de carnet de identidad</Typography>
        </Grid>
        <Grid item container sm={6} justifyContent="center" alignItems="center">
          <KeyboardSimple
            ref={keyboardRef}
            onChange={(value: string) => onValueChange('identityCard', value)}
            keyboardComplete={keyboardComplete}
          />
        </Grid>
        {/* <Grid item container sm={3}
          direction="column"
          justifyContent="center"
        >
          <Stack spacing={2} sx={{ p: 2 }}>
            <ComponentButton
              color="warning"
              onClick={async () => {
                if (identityCard != '') {
                  onResetForm();
                  await keyboardRef.current!.onClearInput();
                }
              }}
              text="LIMPIAR"
              sx={{ fontSize: innerWidth > innerHeight ? '3.5vw' : '5.5vw', width: '100%' }}
            />
            <ComponentButton
              onClick={() => loginSubmit()}
              text="INGRESAR"
              sx={{ fontSize: innerWidth > innerHeight ? '3.5vw' : '5.5vw', width: '100%' }}
            />
          </Stack>
        </Grid> */}
      </Grid>
    </form>
  )
}
