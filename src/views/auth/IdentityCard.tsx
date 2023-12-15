import { AlphaNumeric, ComponentButton, ComponentInput, KeyboardSimple } from '@/components';
import { useCredentialStore, useForm } from '@/hooks';
import { useState } from 'react';

const loginFormFields = {
  identityCard: '',
};

const formValidations = {
  identityCard: [(value: string) => value.length >= 1, 'Debe ingresar su cuenta'],
};


export const IdentityCard = () => {

  const [keyboardComplete, setkeyboardComplete] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { identityCard, onInputChange, isFormValid, onValueChange, identityCardValid } = useForm(
    loginFormFields,
    formValidations
  );
  const { changeIdentityCard } = useCredentialStore();

  const loginSubmit = () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    changeIdentityCard(identityCard);
  };

  return (
    <form style={{
      paddingLeft: innerWidth > innerHeight ? '30vw' : '10vw',
      paddingRight: innerWidth > innerHeight ? '30vw' : '10vw',
      paddingTop: 80
    }} >
      <KeyboardSimple
        onChange={(value: string) => onValueChange('identityCard', value)}
        keyboardComplete={keyboardComplete}
      >
        <ComponentInput
          type="text"
          label="Número de Carnet"
          name="identityCard"
          value={identityCard}
          onChange={onInputChange}
          error={!!identityCardValid && formSubmitted}
          helperText={formSubmitted ? identityCardValid : ''}
          endAdornment={
            <AlphaNumeric
              handleKeyboardComplete={setkeyboardComplete}
            />
          }
          customSx={{
            display: 'flex',
            '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
              transform: 'translate(10px, -70px)',
            },
            '& label': {
              fontSize: innerWidth > innerHeight ? '3.5vw' : '5.5vw',
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
          }}
        />
      </KeyboardSimple>
      <ComponentButton onClick={() => loginSubmit()} text="INGRESAR" sx={{ fontSize: innerWidth > innerHeight ? '3.5vw' : '5.5vw', width: '100%' }} />
    </form>
  )
}
