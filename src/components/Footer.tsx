import { AppBar, Grid } from "@mui/material";
import { ComponentButton } from ".";
import { useCredentialStore } from "@/hooks";
import { memo } from "react";

interface Props {
  action: () => void;
  onRemoveCam: () => void;
  text?: string;
  color?: string;
}

const fontSize = innerWidth > innerHeight ? "3.5vw" : "5.5vw";

const Footer = memo((props: Props) => {
  const { action, text, color } = props;

  const { loading } = useCredentialStore();

  return (
    <AppBar position="static">
      <Grid container justifyContent="center" spacing={3}>
        <Grid item>
          <ComponentButton
            onClick={action}
            text={text ?? "continuar"}
            sx={{ fontSize }}
            loading={loading}
            color={color}
          />
        </Grid>
      </Grid>
    </AppBar>
  );
});

export default Footer;
