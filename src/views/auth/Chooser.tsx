import CardChooser from "@/components/CardChooser";
import { useCredentialStore } from "@/hooks";
import { useChooserStore } from "@/hooks/useChooserStore";
import { Container, Grid, styled } from "@mui/material";
import SERVICES from "@/views/content/menu";
import { useCallback, useEffect, useState } from "react";

const StyledBox = styled("div")({
  flexGrow: 1,
  minHeight: "80vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8),
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  gap: theme.spacing(5),
}));

export const Chooser = () => {
  const { changeStep, identityCard } = useCredentialStore();
  const { saveSelection, getValidProcedures, procedures } = useChooserStore();

  const [enabledServices, setEnabledServices] = useState<any[]>([]);

  const action = useCallback(
    (code: string) => {
      saveSelection(code);
      changeStep("instructionCard");
    },
    [saveSelection, changeStep]
  );

  const matchServices = async () => {
    if (identityCard) {
      const proc = await getValidProcedures(identityCard);
      if (proc) {
        const filteredServices = SERVICES.filter(
          (service) => service.code in proc && proc[service.code]
        );
        console.log(filteredServices);
        setEnabledServices(filteredServices);
      } else {
        console.log("Proc no tiene formato esperado");
      }
    }
  };

  useEffect(() => {
    matchServices();
  }, [identityCard]);

  return (
    <StyledBox>
      {JSON.stringify(procedures)}
      <StyledContainer maxWidth="md">
        <StyledGrid container>
          {enabledServices ? (
            enabledServices.map((service: any) => (
              <CardChooser
                key={service.code}
                title={service.title}
                subTitle={service.subTitle}
                icon={service.icon}
                code={service.code}
                onAction={action}
              />
            ))
          ) : (
            <>Sin servicios</>
          )}
        </StyledGrid>
      </StyledContainer>
    </StyledBox>
  );
};
