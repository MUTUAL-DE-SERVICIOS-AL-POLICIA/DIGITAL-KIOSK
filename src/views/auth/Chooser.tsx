import CardChooser from "@/components/CardChooser";
import { useCredentialStore } from "@/hooks";
import { useChooserStore } from "@/hooks/useChooserStore";
import { Box, Container, Grid } from "@mui/material";
import SERVICES from "@/views/content/menu";
import { useCallback } from "react";

export const Chooser = () => {
  const { changeStep } = useCredentialStore();
  const { saveSelection } = useChooserStore();

  const action = useCallback(
    (code: string) => {
      saveSelection(code);
      changeStep("instructionCard");
    },
    [saveSelection, changeStep]
  );

  return (
    <Box sx={{ flexGrow: 1, minHeight: "80vh" }} alignContent="center">
      <Container maxWidth="md" sx={{ p: 8 }}>
        <Grid container spacing={5} alignContent="center">
          {SERVICES.map((service) => (
            <CardChooser
              key={service.code}
              title={service.title}
              subTitle={service.subTitle}
              icon={service.icon}
              code={service.code}
              onAction={action}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
