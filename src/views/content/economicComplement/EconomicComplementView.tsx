import { useEconomicComplementStore } from "@/hooks/useEconomicComplementStore";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCredentialStore } from "@/hooks";
// import Swal from "sweetalert2";
import { useSweetAlert } from "@/hooks/useSweetAlert";

interface Display {
  key: string;
  value: string;
}

interface InfoObject {
  id: number;
  title: string;
  subtitle: string;
  printable: boolean;
  display: Display[];
}

interface Info {
  error: boolean;
  message: string;
  data: InfoObject;
}

export const EconomicComplementView = () => {
  const [expandedHolder, setExpandedHolder] = useState(false);
  const [infoEcoCom, setInfoEcoCom] = useState<Info | undefined>(undefined);

  const {
    ecoCom,
    checkSemesterEnabled,
    createEconomicComplementProcess,
    getInformationEconomicComplement,
  } = useEconomicComplementStore();
  const { identityCard } = useCredentialStore();
  const { showAlert } = useSweetAlert();

  const createProcedureHolder = async () => {
    if (ecoCom && !ecoCom.error) {
      const eco_com_procedure_id =
        ecoCom.data[ecoCom.data.length - 1].procedure_id;
      const userAux: any = localStorage.getItem("user");
      const user = JSON.parse(userAux);
      if (user && user.nup) {
        const response = await createEconomicComplementProcess({
          eco_com_procedure_id,
          affiliate_id: user.nup,
        });
        if (response && response.status == 201) {
          if (response.data) {
            const res = response.data;
            const message = res.message;
            console.log("respuesta de creación", res);
            if (!res.error) {
              const eco_com_id = res.eco_com_id;
              const info: any =
                await getInformationEconomicComplement(eco_com_id);
              console.log("info:", info);
              setInfoEcoCom(info);
              setExpandedHolder(true);
              showAlert({
                title: "Trámite creado correctamente",
                message: message,
                icon: "success",
              });
              // Swal.fire({
              //   title: "Trámite creado correctamente",
              //   text: message,
              //   icon: "success",
              //   confirmButtonText: "Aceptar",
              // });
            } else {
              showAlert({
                title: "Trámite no creado",
                message: message,
                icon: "warning",
              });
              // Swal.fire({
              //   title: "Trámite no creado",
              //   text: message,
              //   icon: "warning",
              //   confirmButtonText: "Aceptar",
              // });
            }
          }
        }
      }
    }
  };

  const InfoProcedure = () => {
    console.log("infoEcoCom: ", infoEcoCom);
    if (infoEcoCom !== undefined && !infoEcoCom.error) {
      return (
        <>
          <Typography
            variant="h6"
            sx={{ fontWeight: 900, fontSize: "15px", pb: 1 }}
          >
            {infoEcoCom.data.title}
          </Typography>
          <Divider
            variant="fullWidth"
            sx={{ backgroundColor: "#008698", height: "2px", mb: 1 }}
          />
          {infoEcoCom.data &&
            infoEcoCom.data.display.map((info: any) => (
              <>
                <Typography sx={{ fontWeight: 900, fontSize: "15px", pb: 1 }}>
                  {info.key}
                </Typography>
                <span style={{ fontWeight: 400 }}>{info.value}</span>
              </>
            ))}
        </>
      );
    } else {
      console.log("sin datos");
    }
  };

  useEffect(() => {
    checkSemesterEnabled(identityCard);
  }, []);

  return (
    <Box sx={{ padding: 5 }}>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", fontWeight: 700, mb: 3 }}
      >
        Trámite de Complemento Económico
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }} justifyContent="center">
        <Grid item xs={6}>
          <Card sx={{ width: "100%" }}>
            <CardActionArea
              onClick={() => {
                if (ecoCom && !ecoCom.error) {
                  createProcedureHolder();
                }
              }}
              sx={{
                pointerEvents: ecoCom && ecoCom.error ? "none" : "auto",
                opacity: ecoCom && ecoCom.error ? 0.5 : 1,
              }}
            >
              <CardHeader
                titleTypographyProps={{
                  sx: {
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "white",
                  },
                }}
                sx={{
                  backgroundColor:
                    ecoCom && ecoCom.error ? "#B0BEC5" : "#008698",
                  textAlign: "center",
                  borderRadius: "7px",
                }}
                title="CREAR TRÁMITE"
              />
            </CardActionArea>
            <Collapse in={expandedHolder} timeout="auto" unmountOnExit>
              <CardContent sx={{ backgroundColor: "#e2e2e2", pb: 3 }}>
                {/* {infoEcoCom &&
                infoEcoCom.data.map(() => ( */}
                <InfoProcedure />
                {/* ))} */}
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
