import { AppBar, Grid, Toolbar } from '@mui/material';
import { ComponentButton } from '.';
import { useCredentialStore } from '@/hooks';

interface Props {
  action: () => void;
  onRemoveCam: () => void;
}

const Footer = (props: Props) => {

  const { action, onRemoveCam } = props

  const { loading, step, changeStep, changeIdentityCard } = useCredentialStore()

  const resetStep = () => {
    changeStep('identityCard')
    changeIdentityCard('')
    onRemoveCam()
  }

  return (
    <AppBar position="static" sx={{pb: 0, mb: 0, backgroundColor: '#EEEEEE'}} style={{flex: '0 0 20%'}}>
      <Toolbar>
        <Grid container
          justifyContent="center"
          spacing={3}
        >
          { step != 'identityCard' && <Grid item>
            <ComponentButton
              onClick={() => resetStep()}
              text="VOLVER"
              sx={{ fontSize: innerWidth > innerHeight ? '3.5vw' : '5.5vw', width: '100%', padding: "0px 25px" }}
              color="warning"
            />
          </Grid> }
          <Grid item>
            <ComponentButton
              onClick={action}
              text="CONTINUAR"
              sx={{ fontSize: innerWidth > innerHeight ? '3.5vw' : '5.5vw', width: '100%', padding: "0px 25px" }}
              loading={loading}
            />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;