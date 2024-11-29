import { Card, Grid } from "@mui/material";
// @ts-expect-error
import Hands from "@/assets/images/hands.png";
import Fingerprint from "./Fingerprint";
import { forwardRef, memo, useImperativeHandle } from "react";
import { useLoading } from "@/hooks/useLoading";
import { useBiometricStore } from "@/hooks/useBiometric";
import { useCredentialStore } from "@/hooks";
import Swal from "sweetalert2";
import { usePersonStore } from "@/hooks/usePersonStore";
import { CardInfo } from "@/components/CardInfo";

const text = (
  <>
    Por favor, presione en <b>continuar</b> y a continuación coloque uno de los{" "}
    <b>dedo indicados</b> en la imagen para realizar el{" "}
    <b>reconocimiento biométrico.</b>
  </>
);

export const BiometricRecognition = memo(
  forwardRef((_, ref) => {
    useImperativeHandle(ref, () => ({
      onRemoveCam: () => {},
      onPlaying: () => {},
      action: () => handleBiometric(),
    }));

    const { isLoading, setLoading } = useLoading();
    const { compareFingerprints, getFingerprints } = useBiometricStore();
    const { changeStep, changeIdentifyUser } = useCredentialStore();
    const { person } = usePersonStore();

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
          Swal.fire({
            title: "Hubo un error",
            text: "No se pudo realizar la comparación",
            icon: "error",
          });
        }
      } catch (e: any) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Grid container alignItems="center" sx={{ my: 5 }}>
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
          <Card sx={{ mx: 10, borderRadius: "30px", p: 2 }} variant="outlined">
            <Fingerprint />
          </Card>
        </Grid>
        {isLoading && (
          <div className="overlay" style={{ display: "flex" }}>
            <div
              style={{
                fontSize: "84px",
                color: "#E0E0E0",
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              <span>
                Comparando huellas
                <br />
              </span>
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </div>
          </div>
        )}
      </Grid>
    );
  })
);
