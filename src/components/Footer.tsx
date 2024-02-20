import { AppBar, Grid, Toolbar } from '@mui/material';
import { ComponentButton } from '.';

interface Props {
  action: () => void
}

const Footer = (props: Props) => {

  const { action } = props

  return (
    <AppBar position="static" sx={{pb: 0, mb: 0, backgroundColor: '#EEEEEE'}} style={{flex: '0 0 20%'}}>
      <Toolbar>
        <Grid container
          justifyContent="center"
        >
          <Grid item>
            <ComponentButton
              onClick={action}
              text="CONTINUAR"
              sx={{ fontSize: innerWidth > innerHeight ? '3.5vw' : '5.5vw', width: '100%', padding: "0px 25px" }}
            />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;