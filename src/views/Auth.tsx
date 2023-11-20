import { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { ComponentButton, ComponentInput } from '@/components';
import { useForm } from '@/hooks';
import { useNavigate } from 'react-router-dom';

const loginFormFields = {
  identityCard: '',
};

const formValidations = {
  identityCard: [(value: string) => value.length >= 1, 'Debe ingresar su cuenta'],
};

export const AuthView = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { identityCard, onInputChange, isFormValid, identityCardValid } = useForm(
    loginFormFields,
    formValidations
  );
  const navigate = useNavigate();
  const loginSubmit = () => {
    setFormSubmitted(true);
    if (!isFormValid) return;
    // Agregar lógica de inicio de sesión aquí
    navigate('/recognition');
  };

  const handleDelete = () => {
    onInputChange({ target: { name: 'identityCard', value: identityCard.slice(0, -1) } });
  };

  return (
    <div style={{ height: '98vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography style={{ fontSize: 80 }}>Bienvenido al Kiosco Digital</Typography>
      <Grid container style={{ flexGrow: 1 }}>
        <Grid item xs={12} sm={6}>
          {/* Puedes agregar contenido aquí si es necesario */}
        </Grid>
        <Grid item xs={12} sm={6} container justifyContent="center" alignItems="center">
          <form >
            <ComponentInput
              type="text"
              label="Carnet"
              name="identityCard"
              value={identityCard}
              onChange={onInputChange}
              error={!!identityCardValid && formSubmitted}
              helperText={formSubmitted ? identityCardValid : ''}
              customSx={{
                m: 2,
                display: 'flex',
                '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                  transform: 'translate(0px, -60px)',
                },
                '& label': {
                  fontSize: '60px',
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: '60px',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '30px',
                  height: 'fit-content',
                  '& fieldset': { borderColor: '#2F3746' },
                  '&:hover fieldset': { borderColor: '#0B815A' },
                },
              }}
            />
            <Grid container spacing={1}>
              {[1, 2, 3, 'Borrar', 4, 5, 6, 7, 8, 9, 0].map((text, index) => (
                <Grid item key={index} xs={12} sm={3}>
                  <ComponentButton
                    text={text.toString()}
                    sx={{ width: '100%', px: 1, py: 0, fontSize: 40 }}
                    onClick={
                      text === 'Borrar'
                        ? handleDelete
                        : () => onInputChange({ target: { name: 'identityCard', value: identityCard + text } })
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </form>
        </Grid>
      </Grid>
      <ComponentButton onClick={() => loginSubmit()} text="INGRESAR" sx={{ fontSize: 70 }} />
    </div>
  );
};
