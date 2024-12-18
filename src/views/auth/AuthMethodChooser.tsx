import { useCredentialStore } from "@/hooks";
import { Grid, styled } from "@mui/material";
// @ts-expect-error no proceded
import Face from "@/assets/images/face.png";
// @ts-expect-error no proceded
import Fingerprint from "@/assets/images/fingerprint.jpg";
import CardMethodChooser from "@/components/CardMethodChooser";
import { useCallback, useEffect } from "react";
import { usePersonStore } from "@/hooks/usePersonStore";
import { useBiometricStore } from "@/hooks/useBiometric";

const METHODS_AUTH = [
  {
    title: "Reconocimiento Facial",
    image: Face,
    action: "faceRecognition",
  },
  {
    title: "Reconocimiento Dactilar",
    image: Fingerprint,
    action: "biometricRecognition",
  },
];

const Container = styled(Grid)({
  minHeight: "70vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const MethodGrid = styled(Grid)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
});

export const AuthMethodChooser = () => {
  const { changeStep, identityCard } = useCredentialStore();
  const { getPerson } = usePersonStore();
  const { fingerprints, getFingerprints } = useBiometricStore();

  const handleAction = useCallback(
    (step: string) => {
      changeStep(step);
    },
    [changeStep]
  );

  const totalData = async () => {
    const personId = await getPerson(identityCard);
    if (personId !== undefined) {
      await getFingerprints(personId);
    }
  };

  useEffect(() => {
    totalData();
  }, []);

  return (
    <Container container>
      {METHODS_AUTH.map((method) => (
        <MethodGrid item key={method.title} sm={6}>
          <CardMethodChooser
            title={method.title}
            image={method.image}
            step={method.action}
            onAction={handleAction}
            disabled={
              method.title == "Reconocimiento Dactilar" &&
              fingerprints.length === 0
                ? true
                : false
            }
          />
        </MethodGrid>
      ))}
    </Container>
  );
};
