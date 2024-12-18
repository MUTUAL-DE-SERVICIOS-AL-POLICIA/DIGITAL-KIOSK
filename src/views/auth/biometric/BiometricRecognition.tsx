import { Card, Grid, styled } from "@mui/material";
// @ts-expect-error
import Hands from "@/assets/images/hands.png";
import Fingerprint from "./Fingerprint";
import { forwardRef, memo, useImperativeHandle } from "react";
import { useLoading } from "@/hooks/useLoading";
import { useBiometricStore } from "@/hooks/useBiometric";
import { useCredentialStore } from "@/hooks";
import { usePersonStore } from "@/hooks/usePersonStore";
import { CardInfo } from "@/components/CardInfo";
import { useSweetAlert } from "@/hooks/useSweetAlert";
// @ts-expect-error
import FingerprintGif from "@/assets/images/fingerprint.gif";

const text = (
  <>
    Por favor, presione en <b>continuar</b> y a continuación coloque uno de los{" "}
    <b>dedo indicados</b> en la imagen para realizar el{" "}
    <b>reconocimiento biométrico.</b>
  </>
);

const StyledGridContainer = styled(Grid)(({ theme }) => ({
  marginBlock: theme.spacing(5),
  alignItems: "center",
}));

const StyledFingerprintCard = styled(Card)(({ theme }) => ({
  marginInline: theme.spacing(10),
  borderRadius: "30px",
  padding: theme.spacing(2),
}));

const StyledOverlay = styled("div")(() => ({
  display: "flex",
  fontSize: "84px",
  color: "#E0E0E0",
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.85)",
  zIndex: 1000,
}));

export const BiometricRecognition = memo(
  forwardRef((_, ref) => {
    useImperativeHandle(ref, () => ({
      onRemoveCam: () => {},
      onPlaying: () => {},
      action: () => handleBiometric(),
    }));

    const { isLoading, setLoading } = useLoading();
    const { compareFingerprints, getFingerprints, fingerprints } =
      useBiometricStore();
    const { changeStep, changeIdentifyUser } = useCredentialStore();
    const { person } = usePersonStore();
    const { showAlert } = useSweetAlert();

    const assembleAnswer = (fingers: any[]) => {
      if (fingers !== undefined) {
        return fingers.map((fingerprint: any) => {
          const wsq = fingerprint.wsqBase64;
          const quality = fingerprint.quality;
          const fingerprintTypeId = fingerprint.fingerprintType.id;
          return { wsq, quality, fingerprintTypeId };
        });
      }
    };

    const handleBiometric = async () => {
      try {
        setLoading(true);
        const fingers = await getFingerprints(person.id);
        const body = assembleAnswer(fingers);
        const { isValid }: any = await compareFingerprints(body);
        if (isValid) {
          // TODO Registrar la huella con mejor calidad
          // TODO Registrar la forma de autenticación
          changeStep("home");
          changeIdentifyUser(true);
        } else {
          showAlert({
            title: "Vuelve a intentarlo",
            message: "Por favor, intente con otro dedo registrado",
            icon: "warning",
          });
        }
      } catch (e: any) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    return (
      <StyledGridContainer container>
        <Grid
          item
          container
          sm={7}
          direction="column"
          justifyContent="space-between"
        >
          <CardInfo text={text} />
        </Grid>
        <Grid item container sm={5} direction="column">
          <StyledFingerprintCard variant="outlined">
            <Fingerprint fingerprints={fingerprints} />
          </StyledFingerprintCard>
        </Grid>
        {isLoading && (
          <StyledOverlay>
            <div>
              <span>Comparando huellas</span>
              <br />
              <img src={FingerprintGif} alt="Cargando ... " />
              {/* <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span> */}
            </div>
          </StyledOverlay>
        )}
      </StyledGridContainer>
    );
  })
);
