import { AlphaNumeric, ComponentInput } from '@/components';
import KeyboardAlphanumeric from '@/components/keyboardAlphanumeric';
import KeyboardNumeric from '@/components/keyboardNumeric';
import { useCredentialStore, useForm } from '@/hooks';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Card, Grid, Typography } from '@mui/material';
import { forwardRef, useEffect, useImperativeHandle, useState, memo } from 'react';

const loginFormFields = {
  identityCard: '',
};

const formValidations = {
  identityCard: [
    (value: string) => value.length >= 4 && value.length <= 12, 'El carnet de identidad debe tener de 4 dígitos a 12 dígitos',
  ],
};

export const IdentityCard = memo(forwardRef((_, ref) => {

  const [ keyboardComplete, setkeyboardComplete ] = useState(false);
  const [ formSubmitted, setFormSubmitted ]       = useState(false);

  const { startLogin } = useAuthStore();
  const { identityCard, onInputChange, isFormValid, onValueChange, identityCardValid } = useForm(
    loginFormFields,
    formValidations
  );

  const { changeIdentityCard } = useCredentialStore()

  useImperativeHandle(ref, () => ({
    action: (_?: boolean) => {
      changeIdentityCard(identityCard)
      setFormSubmitted(true);
      if (!isFormValid) return;
      startLogin(identityCard);
    },
    onRemoveCam: () => {}
  }))

  useEffect(() => {
  }, [identityCard])


  const handleClickKeyboard = (number: any) =>  {
    let aux: string = ''
    if(typeof number === 'object' && number !== null) {
      aux = identityCard.substring(0, identityCard.length - 1)
    } else {
      aux = identityCard + number
    }
    onValueChange('identityCard', aux)
  }

  return (
    <form style={{ paddingTop: 80 }}>
      <Grid container>
        <Grid item container sm={6}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
            <Card sx={{ml: 10, mb: 7, borderRadius: '30px', py:3}} variant="outlined">
              <Typography align="center" style={{ fontSize: '2.5vw', fontWeight: 200 }}>Por favor ingrese su <b>número de carnet de identidad</b> y luego presione en <b>continuar</b></Typography>
            </Card>
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
                ml: 7,
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
        </Grid>
        <Grid item container sm={6} justifyContent="center" alignItems="center">
          <div style={{ width: '100%', height: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            { !keyboardComplete ?
            <KeyboardNumeric onClick={handleClickKeyboard}/>
            : <KeyboardAlphanumeric onClick={handleClickKeyboard}/>
            }
          </div>
        </Grid>
      </Grid>
    </form>
  )
}))
