import { TimerContext } from "@/context/TimerContext";
import { useCredentialStore } from "@/hooks";
import { useAuthStore } from "@/hooks/useAuthStore";
import { CircularProgress, Grid, Paper } from "@mui/material";
import { useContext, useEffect } from "react";
//@ts-expect-error do not proceed
import imageLogoBlanco from "@/assets/images/muserpol-logo-blanco.png";
import { useChooserStore } from "@/hooks/useChooserStore";
import SERVICES from "./menu";
import { useLoading } from "@/hooks/useLoading";
import Header from "@/components/Header";
import "src/views/content/loans/styles.css";
import Footer from "@/components/Footer";

export const MainView = () => {
  const {
    changeIdentityCard,
    changeIdentifyUser,
    changeStep,
    name,
    identityCard,
  } = useCredentialStore();
  const { startLogout } = useAuthStore();
  const { seconds, resetTimer } = useContext(TimerContext);
  const { selection } = useChooserStore();
  const { isLoading } = useLoading();

  const selectedService = SERVICES.find(
    (service: any) => service.code === selection
  );

  const handleExit = () => {
    startLogout();
    changeStep("home");
    changeIdentifyUser(false);
    changeIdentityCard("");
  };

  useEffect(() => {
    if (seconds == 1) {
      changeIdentityCard("");
      changeIdentifyUser(false);
      startLogout();
      resetTimer();
    }
  }, [seconds]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header name={name} identityCard={identityCard} seconds={seconds} />
      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="center"
        style={{ display: "flex", height: "100vh" }}
      >
        <Grid xs={10} item style={{ display: "flex", flexDirection: "column" }}>
          <Paper
            elevation={0}
            sx={{
              height: "73vh",
              borderRadius: "20px",
              overflow: "auto",
              padding: 2,
            }}
          >
            {selectedService?.view ? selectedService.view : <></>}
          </Paper>
        </Grid>
      </Grid>
      <Footer
        action={handleExit}
        onRemoveCam={() => {}}
        text="salir"
        color="warning"
      />
      {isLoading && (
        <div className="overlay">
          <CircularProgress
            size={50}
            sx={{
              color: "#42c9b7",
              position: "absolute",
              top: "50%",
              left: "50%",
            }}
          />
        </div>
      )}
    </div>
  );
};
