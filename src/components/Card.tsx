import { Card, Grid, Paper, Stack, Typography } from "@mui/material";
import "../views/content/loans/styles.css";
import { Print } from "@mui/icons-material";

interface Props {
  onPressed: () => void;
  logo: any;
  procedureTitle: string;
}
export const CardComponent = (props: Props) => {
  const { onPressed, logo, procedureTitle } = props;

  return (
    <>
      <Paper
        sx={{ p: 3, mx: 5, backgroundColor: "#9BC5B8", borderRadius: "20px" }}
        onClick={() => onPressed()}
        className="dynamic"
      >
        <Grid container alignContent="center" justifyContent="center">
          <Grid item xs={5} alignSelf="center">
            <img
              src={logo}
              alt="Descripción de la imagen"
              style={{ width: "10vw", height: "10vw" }}
            />
          </Grid>
          <Grid container item xs={6}>
            <Grid item xs={12} alignSelf="center">
              <Typography
                variant="h4"
                sx={{ color: "black", textAlign: "center", fontWeight: 700 }}
              >
                {procedureTitle}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Card
                sx={{
                  px: 1,
                  py: 2,
                  my: 1,
                  backgroundColor: "#1E635A",
                  borderRadius: "10px",
                }}
              >
                <Stack direction="row" justifyContent="center" spacing={3}>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "white",
                      textAlign: "center",
                      fontWeight: 700,
                    }}
                  >
                    IMPRIMIR
                  </Typography>
                  <Print fontSize="large" sx={{ color: "white" }} />
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
