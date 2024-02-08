import { AlphaNumeric, ComponentInput } from '@/components';
import KeyboardAlphanumeric from '@/components/keyboardAlphanumeric';
import KeyboardNumeric from '@/components/keyboardNumeric';
import { useCredentialStore, useForm } from '@/hooks';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Grid, Typography } from '@mui/material';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

const loginFormFields = {
  identityCard: '',
};

const formValidations = {
  identityCard: [(value: string) => value.length >= 1, 'Debe ingresar su número de carnet de identidad'],
};

interface Props {
  onChange: () => void;
}

export const IdentityCard = forwardRef((props:Props, ref) => {

  const { onChange } = props;
  const [ keyboardComplete, setkeyboardComplete ] = useState(false);
  const [ formSubmitted, setFormSubmitted ]       = useState(false);
  // const keyboardRef = useRef<KeyboardRef | null>(null);

  const { startLogin } = useAuthStore();
  const { identityCard, onInputChange, isFormValid, onValueChange, identityCardValid } = useForm(
    loginFormFields,
    formValidations
  );

  const { changeIdentityCard } = useCredentialStore()

  useImperativeHandle(ref, () => ({
    //@ts-expect-error
    action: (state?: boolean) => {
      changeIdentityCard(identityCard)
      setFormSubmitted(true);
      if (!isFormValid) return;
      startLogin(identityCard);
      onChange();
    },
    onRemoveCam: () => {}
  }))

  useEffect(() => {
    onChange();
  }, [identityCard])


  const handleClickKeyboard = (number: any) =>  {
    let aux: string = ''
    if(typeof number === 'object' && number !== null) {
      // borrame
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
          <Typography sx={{ px: 5 }} align="center" style={{ fontSize: '2vw', fontWeight: 200 }}>Por favor ingrese su número de carnet de identidad</Typography>
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
})
