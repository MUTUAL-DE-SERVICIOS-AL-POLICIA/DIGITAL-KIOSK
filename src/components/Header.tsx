import { AppBar, Toolbar, Typography } from "@mui/material";
import { memo } from "react";
import { ComponentButton } from "./Button";
// @ts-expect-error
import imageLogoBlanco from "@/assets/images/muserpol-logo-blanco.png";

interface Props {
  name: string;
  identityCard: string;
  seconds: number;
  resetStep: () => void;
}

const Header = memo((props: Props) => {
  const { name, identityCard, seconds, resetStep } = props;
  return (
    <AppBar position="static" style={{ background: "#008698", flex: "0 0 7%" }}>
      <Toolbar>
        <img
          src={imageLogoBlanco}
          alt="Imagen tipo logo"
          style={{ width: "10vw" }}
        />
        {identityCard && (
          <Typography variant="h4" color="white">
            {name}
            <b> &nbsp; CI: {identityCard} </b>
          </Typography>
        )}
        <ComponentButton
          onClick={() => resetStep()}
          text={`SALIR ${seconds}`}
          sx={{
            fontSize: innerWidth > innerHeight ? "2vw" : "3.5vw",
            width: "12%",
            padding: "0px 15px",
          }}
          color="warning"
        />
      </Toolbar>
    </AppBar>
  );
});

export default Header;
