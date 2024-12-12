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

  const [enabledServices, setEnabledServices] = useState<any>();

  const action = useCallback(
    (code: string) => {
      saveSelection(code);
      changeStep("instructionCard");
    },
    [saveSelection, changeStep]
  );

  useEffect(() => {
    if (identityCard) getValidProcedures(identityCard);
  }, [identityCard]);

  useEffect(() => {
    if (procedures !== undefined) {
      const filteredServices = SERVICES.filter(
        (service) => service.code in procedures && procedures[service.code]
      );
      setEnabledServices(filteredServices);
    }
  }, [procedures]);

  return (
    <StyledBox>
      {JSON.stringify(procedures)}
      <StyledContainer maxWidth="md">
        <StyledGrid container>
          {SERVICES.map((service: any) => (
            <CardChooser
              key={service.code}
              title={service.title}
              subTitle={service.subTitle}
              icon={service.icon}
              code={service.code}
              onAction={action}
            />
          ))}
        </StyledGrid>
      </StyledContainer>
    </StyledBox>
  );
};
