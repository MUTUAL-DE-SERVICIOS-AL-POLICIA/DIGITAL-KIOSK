import { useEconomicComplementStore } from "@/hooks/useEconomicComplementStore";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCredentialStore } from "@/hooks";
import { useSweetAlert } from "@/hooks/useSweetAlert";
import { useLoading } from "@/hooks/useLoading";

interface InfoObject {
  id: number;
  title: string;
  subtitle: string;
  printable: boolean;
  display: { key: string; value: string }[];
}

export const EconomicComplementView = () => {
  const [procesduresCreated, setProceduresCreated] = useState<InfoObject[]>([]);

  const {
    checkSemesters,
    checkSemesterEnabled,
    createEconomicComplementProcess,
    getInformationEconomicComplement,
  } = useEconomicComplementStore();
  const { identityCard } = useCredentialStore();
  const { showAlert } = useSweetAlert();
  const { isLoading, setLoading } = useLoading();

  const createProcedures = async () => {
    try {
      setLoading(true);
      const availableProcedures = checkSemesters.available_procedures;
      const affiliateId = checkSemesters.affiliate_id;
      const createdProcedures: InfoObject[] = [];

      for (const procedure of availableProcedures) {
        const response = await createEconomicComplementProcess({
          eco_com_procedure_id: procedure,
          affiliate_id: affiliateId,
        });
        if (
          response?.status === 201 &&
          response.data &&
          response.data.eco_com_id
        ) {
          const informationProcedures = response.data.eco_com_id;
          for (const information of informationProcedures) {
            const info = await getInformationEconomicComplement(information);
            if (info && !info.error) {
              createdProcedures.push(info.data);
            }
          }
        }
      }
      setProceduresCreated(createdProcedures);

      showAlert({
        title: `${createdProcedures.length} Trámite${createdProcedures.length > 1 ? "s" : ""} creado${createdProcedures.length > 1 ? "s" : ""} exitosamente`,
        message: "",
        icon: "success",
      });
    } catch (e: any) {
      console.error("Error en la creación del trámite");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSemesterEnabled(identityCard);
  }, []);

  return (
    <Box sx={{ padding: 1 }}>
      <Typography
        variant="h5"
        sx={{ textAlign: "center", fontWeight: 800, mb: 1 }}
        textTransform="uppercase"
      >
        Complemento Económico
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {!procesduresCreated.length ? (
          <Grid item xs={6}>
            <Card sx={{ width: "100%" }}>
              <CardActionArea
                onClick={() => {
                  if (
                    checkSemesters &&
                    !checkSemesters.error &&
                    checkSemesters.canCreate
                  ) {
                    createProcedures();
                  }
                }}
                sx={{
                  pointerEvents:
                    checkSemesters &&
                    !checkSemesters.error &&
                    !checkSemesters.canCreate
                      ? "none"
                      : "auto",
                  opacity:
                    checkSemesters &&
                    !checkSemesters.error &&
                    !checkSemesters.canCreate
                      ? 0.4
                      : 1,
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
                      checkSemesters && checkSemesters.error
                        ? "#B0BEC5"
                        : "#008698",
                    textAlign: "center",
                    borderRadius: "7px",
                  }}
                  title="CREAR TRÁMITE"
                />
              </CardActionArea>
            </Card>
          </Grid>
        ) : (
          procesduresCreated.map((procedure, index) => (
            <Grid item xs={4} sm={4} md={4} key={index}>
              <Card>
                <CardHeader
                  title="Trámite Creado"
                  subheader={procedure.title}
                  sx={{
                    backgroundColor: "#008698",
                    textAlign: "center",
                  }}
                  titleTypographyProps={{
                    sx: {
                      color: "white",
                      fontWeight: 800,
                    },
                  }}
                  subheaderTypographyProps={{
                    sx: {
                      color: "white",
                      fontSize: "20px",
                      fontWeight: 600,
                    },
                  }}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    {procedure.display.map((info, idx) => (
                      <>
                        <Grid item xs={12} sm={6} key={idx}>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold", fontSize: "20px" }}
                            align="right"
                          >
                            {info.key}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "semibold",
                              fontSize: "20px",
                            }}
                            style={{
                              overflowWrap: "break-word",
                            }}
                          >
                            {info.value}
                          </Typography>
                        </Grid>
                      </>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      {isLoading && (
        <div>
          <CircularProgress
            size={50}
            sx={{
              color: "#42c9b7",
              positio: "absolute",
              top: "50%",
              left: "50%",
            }}
          />
        </div>
      )}
    </Box>
  );
};
