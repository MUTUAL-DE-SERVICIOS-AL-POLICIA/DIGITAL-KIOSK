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
import React from "react";

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
    proceduresAlreadyCreated,
    checkSemesterEnabled,
    createEconomicComplementProcess,
    getInformationEconomicComplement,
  } = useEconomicComplementStore();
  const { identityCard } = useCredentialStore();
  const { showAlert } = useSweetAlert();
  const { isLoading, setLoading } = useLoading();

  const fetchProcedureDetails = async (procedureIds: number[]) => {
    try {
      const details: InfoObject[] = [];
      for (const id of procedureIds) {
        const response = await getInformationEconomicComplement(id.toString());
        if (response && !response.error) {
          details.push(response.data);
        }
      }
      return details;
    } catch (error) {
      console.error("Error al obtener la información de los trámites", error);
      return [];
    }
  };

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
        if (response?.status === 201 && response.data?.eco_com_id) {
          const details = await fetchProcedureDetails(response.data.eco_com_id);
          createdProcedures.push(...details);
        }
      }
      setProceduresCreated((prev) => [
        ...new Set([...prev, ...createdProcedures]),
      ]);
      checkSemesterEnabled(identityCard);
      showAlert({
        title: `${createdProcedures.length} Trámite${createdProcedures.length > 1 ? "s" : ""} creado${createdProcedures.length > 1 ? "s" : ""} exitosamente`,
        message: "",
        icon: "success",
      });
    } catch (e: any) {
      console.error("Error en la creación del trámite", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (proceduresAlreadyCreated?.length) {
      const fetchExistingProcedures = async () => {
        const exitingIds = proceduresAlreadyCreated.map(
          (proc: any) => proc.eco_com_id
        );
        const details = await fetchProcedureDetails(exitingIds);
        setProceduresCreated(details);
      };
      fetchExistingProcedures();
    }
  }, [proceduresAlreadyCreated]);

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
        {checkSemesters &&
          !checkSemesters.error &&
          checkSemesters.canCreate && (
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card sx={{ width: "30%" }}>
                <CardActionArea
                  onClick={() => {
                    if (checkSemesters.canCreate) {
                      createProcedures();
                    }
                  }}
                  sx={{
                    pointerEvents: checkSemesters.canCreate ? "auto" : "none",
                    opacity: checkSemesters.canCreate ? 1 : 0.4,
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
                      backgroundColor: checkSemesters.error
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
          )}
        {procesduresCreated.length > 0 &&
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
                      <React.Fragment key={idx}>
                        <Grid item xs={12} sm={6}>
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
                      </React.Fragment>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
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
