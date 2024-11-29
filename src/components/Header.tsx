import { AppBar, Grid, Toolbar, Typography } from "@mui/material";
import { memo } from "react";
import { ComponentButton } from "./Button";
// @ts-expect-error
import imageLogoBlanco from "@/assets/images/muserpol-logo-blanco.png";

interface Props {
  name: string;
  identityCard: string;
  seconds: number;
  resetStep?: () => void;
}

const fontSize = innerWidth > innerHeight ? "2vw" : "3.5vw";

const Header = memo((props: Props) => {
  const { name, identityCard, seconds, resetStep } = props;
  return (
    <AppBar position="static" style={{ background: "#008698", flex: "0 0 7%" }}>
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <img
              src={imageLogoBlanco}
              alt="Imagen tipo logo"
              style={{ width: "12vw" }}
            />
          </Grid>
          <Grid item>
            {identityCard && (
              <Typography variant="h4" color="white">
                {name}
                <b> &nbsp; CI: {identityCard} </b>
              </Typography>
            )}
          </Grid>
          <Grid item>
            {resetStep ? (
              <ComponentButton
                onClick={() => resetStep()}
                text={`salir ${seconds}`}
                sx={{ fontSize }}
                color="warning"
              />
            ) : (
              <Typography
                style={{ color: "white", fontSize: "2vw", fontWeight: 700 }}
              >
                {seconds}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
});

export default Header;
