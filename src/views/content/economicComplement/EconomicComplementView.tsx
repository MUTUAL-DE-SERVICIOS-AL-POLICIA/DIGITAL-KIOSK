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
  const [hiddenButton, setHiddenButton] = useState(false);
  const [checkSemesters, setCheckSemesters] = useState<any>();
  const {
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
      setHiddenButton(true);
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
    const fetchCreatedEcoComs = async () => {
      setProceduresCreated([]);
      const data = await checkSemesterEnabled(identityCard);
      setCheckSemesters(data);
      const res = data.data;
      const proceduresAlreadyCreated = res.filter(
        (procedure: any) => procedure.eco_com_id !== null
      );
      const exitingIds = proceduresAlreadyCreated.map(
        (proc: any) => proc.eco_com_id
      );
      const details = await fetchProcedureDetails(exitingIds);
      setProceduresCreated(details);
    };
    fetchCreatedEcoComs();
  }, []);

  return (
    <Box sx={{ padding: 1 }}>
      
      <Grid container spacing={3} justifyContent="center">
        {/* <Typography
          variant="h3"
          sx={{ textAlign: "center", fontWeight: 800, mb: 0.5 }}
        >
          COMPLEMENTO ECONÓMICO
        </Typography> */}
        {checkSemesters &&
          !checkSemesters.error &&
          checkSemesters.canCreate && 
          procesduresCreated.length == 0 &&
          !hiddenButton && (
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card sx={{ width: "40%" }}>
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
                        fontSize: "3rem",
                        fontWeight: 800,
                        color: "white",
                      },
                    }}
                    sx={{
                      backgroundColor: checkSemesters.error
                        ? "#B0BEC5"
                        : "#37c563",
                      textAlign: "center",
                      borderRadius: "15px",
                    }}
                    title="CREAR TRÁMITE"
                  />
                </CardActionArea>
              </Card>
            </Grid>
          )}
        {procesduresCreated.length > 0 &&
          procesduresCreated.map((procedure, index) => (
            <Grid item xs={4} sm={4} md={10} key={index}>
              <Card>
                <CardHeader
                  title="TRÁMITE DE COMPLEMENTO ECONÓMICO CREADO"
                  subheader={procedure.title}
                  sx={{
                    backgroundColor: "#008698",
                    textAlign: "center",
                  }}
                  titleTypographyProps={{
                    sx: {
                      color: "white",
                      fontSize: "40px",
                      fontWeight: 700,
                    },
                  }}
                  subheaderTypographyProps={{
                    sx: {
                      color: "white",
                      fontSize: "30px",
                      fontWeight: 600,
                    },
                  }}
                />
                <CardContent>
                  <Grid container spacing={1} rowSpacing={0}>
                    {procedure.display.map((info, idx) => (
                      <React.Fragment key={idx}>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold", fontSize: "35px", display: "flex", justifyContent: "space-between" }}
                          >
                            {info.key} <span>:</span>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "semibold",
                              fontSize: "34px",
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
              position: "absolute",
              top: "50%",
              left: "50%",
            }}
          />
        </div>
      )}
    </Box>
  );
};
