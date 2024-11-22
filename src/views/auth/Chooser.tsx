import CardChooser from "@/components/CardChooser"
import { useCredentialStore } from "@/hooks"
import { useChooserStore } from "@/hooks/useChooserStore"
import { AttachMoney, ExtensionOutlined } from "@mui/icons-material"
import { Box, Container, Grid } from "@mui/material"


const SERVICES = [
  {
    code: "CE",
    title: "COMPLEMENTO ECONÓMICO",
    subTitle: "Creación de trámites de Complemento Económico.",
    icon: <ExtensionOutlined />
  },
  {
    code: "LOAN",
    title: "PRÉSTAMOS",
    subTitle: "Creación de trámites de Préstamos.",
    icon: <AttachMoney />
  }
]

export const Chooser = () => {

  const { changeStep } = useCredentialStore()
  const { saveSelection } = useChooserStore()


  const action =  (code: string) => {
    saveSelection(code)
    changeStep('identityCard')
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '80vh' }} alignContent="center">
      <Container maxWidth="md" sx={{ p: 8 }}>
        <Grid container spacing={5} alignContent="center">
          {
            SERVICES.map((service) => (
              <CardChooser
                key={service.code}
                title={service.title}
                subTitle={service.subTitle}
                icon={service.icon}
                action={() => action(service.code)}
              />
            ))
          }
        </Grid>
      </Container>
    </Box>
  )
}