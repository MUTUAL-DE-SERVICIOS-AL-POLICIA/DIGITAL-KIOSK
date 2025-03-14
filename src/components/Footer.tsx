import { AppBar, Grid } from "@mui/material";
import { ComponentButton } from ".";
import { useCredentialStore } from "@/hooks";
import { useState, useEffect, memo } from "react";

interface Props {
  action: () => void;
  onRemoveCam: () => void;
  text?: string;
  color?: string;
  size?: string;
}


const Footer = memo(({ action, text, color, size }: Props) => {
  const [fontSize, setFontSize] = useState("6.5vw");
  useEffect(() => {
    const updateFontSize = () => {
      const newSize = window.innerWidth > window.innerHeight ? "5.5vw" : "8vw";
      setFontSize(newSize);
    };

    updateFontSize(); // Calcular al inicio
    window.addEventListener("resize", updateFontSize);
    
    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  const { loading } = useCredentialStore();

  return (
    <AppBar position="static">
      <Grid container justifyContent="center" spacing={3}>
        <Grid item>
          <ComponentButton
            onClick={action}
            text={text ?? "continuar"}
            sx={{ fontSize: size ?? fontSize, color}}
            loading={loading}
            color={color}
          />
        </Grid>
      </Grid>
    </AppBar>
  );
});

export default Footer;
