import { Box, Grid /*Typography*/ } from "@mui/material";
//@ts-expect-error do not proceed
import logo from "@/assets/images/muserpol.jpg";
//@ts-expect-error do not proceed
import imageLogo from "@/assets/images/muserpol.png";
import { useEffect, useState, memo } from "react";
import { useCredentialStore } from "@/hooks";
import VideoComponent from "../../components/Video";

export const HomeScreen = memo(() => {
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const { changeStep } = useCredentialStore();
  const [, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const handleFullScreenChange = () => {
    setIsFullScreen(!!document.fullscreenElement);
  };

  const handleClick = () => {
    changeStep("identityCard");
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    }
  };

  return (
    <div onClick={handleClick} style={{ height: `${screenHeight}px` }}>
      <Grid container>
        <Grid item sm={5}>
          <Box
            component="img"
            sx={{
              height: `${screenHeight}px`,
              width: "100%",
              objectFit: "cover",
              display: "flex",
              filter: "brightness(0.7)",
            }}
            alt="The house from the offer."
            src={logo}
          />
        </Grid>
        <Grid item container sm={7} direction="column" justifyContent="center">
          <Grid>
            <Box display="flex" justifyContent="center" sx={{ mb: 15 }}>
              <img
                src={imageLogo}
                alt="Descripción de la imagen"
                style={{ width: "30vw" }}
              />
            </Box>
          </Grid>
          {/* <Grid sx={{ marginBottom: 7 }}>
            <Typography
              sx={{ p: 2, paddingLeft: 10 }}
              align="left"
              style={{ fontSize: "2.5vw", fontWeight: 500 }}
            >
              - Certificación de Aportes
            </Typography>
            <Typography
              sx={{ p: 2, paddingLeft: 10 }}
              align="left"
              style={{ fontSize: "2.5vw", fontWeight: 500 }}
            >
              - Extracto de Préstamos
            </Typography>
          </Grid> */}
          {/* <Grid sx={{ marginBottom: 7 }}>
            <Box
              sx={{
                backgroundColor: "#D0D3D4",
                mt: 5,
                mx: 10,
                borderRadius: 5,
              }}
            >
              <Typography
                sx={{ p: 2 }}
                align="center"
                style={{ fontSize: "3vw", fontWeight: 500 }}
              >
                Presione para ingresar
              </Typography>
            </Box>
          </Grid> */}
          <VideoComponent />
        </Grid>
      </Grid>
    </div>
  );
});
