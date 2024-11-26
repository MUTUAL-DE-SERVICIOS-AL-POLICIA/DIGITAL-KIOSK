import { Box, Card, CardActionArea, CardContent, CardHeader, Collapse, Divider, Grid, Typography } from '@mui/material';
import { useState } from 'react';


export const EconomicComplementView = () => {

  const [expandedHolder, setExpandedHolder] = useState(false)
  const [expandedWidowhood, setExpandedWidowhood] = useState(false)

  const createProcedureHolder = () => {
    setExpandedHolder(true)
  }
  const createProcedureWidowhood = () => {
    setExpandedWidowhood(true)
  }

  const InfoProcedure = () => {
    return (
      <>
        <Typography variant="h6" sx={{fontWeight: 900, pb: 1}}>SEGUNDO SEMESTRE 2024</Typography>
        <Divider variant="fullWidth" sx={{backgroundColor: '#008698', height: '2px', mb: 1}}/>
        <Typography sx={{fontWeight: 900, fontSize: '15px', mb: 1}}>FECHA DE RECEPCIÓN: <span style={{fontWeight: 400}}>15/03/2024</span></Typography>
        <Typography sx={{fontWeight: 900, fontSize: '15px', mb: 1}}>TIPO DE PRESTACIÓN: <span style={{fontWeight: 400}}>VEJEZ</span></Typography>
        <Typography sx={{fontWeight: 900, fontSize: '15px'}}>TIPO DE TRÁMITE: <span style={{fontWeight: 400}}>VIUDEDAD</span></Typography>
      </>
    )
  }

  return (
    <Box sx={{ padding: 5 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 700, mb: 3 }}>
        Trámite de Complemento Económico
      </Typography>
      <Grid container spacing={3} sx={{mt: 15}} justifyContent="center">
        <Grid item xs={6}>
          <Card sx={{width: '100%'}}>
            <CardActionArea onClick={createProcedureHolder}>
              <CardHeader
                titleTypographyProps={{
                  sx: {
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'white',
                  },
                }}
                sx={{ backgroundColor: '#008698', textAlign: 'center', borderRadius: '7px' }}
                title="CREAR TRÁMITE TITULAR"
              />
            </CardActionArea>
            <Collapse in={expandedHolder} timeout="auto" unmountOnExit>
              <CardContent sx={{ backgroundColor: '#e2e2e2', px: 3, pb: 3 }}>
                <InfoProcedure/>
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{width: '100%'}}>
            <CardActionArea onClick={createProcedureWidowhood}>
              <CardHeader
                titleTypographyProps={{
                  sx: {
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'white',
                  },
                }}
                sx={{ backgroundColor: '#008698', textAlign: 'center', borderRadius: '7px'}}
                title="CREAR TRÁMITE VIUDEDAD"
              />
            </CardActionArea>
            <Collapse in={expandedWidowhood} timeout="auto" unmountOnExit>
              <CardContent sx={{ backgroundColor: '#e2e2e2', px: 3, pb: 3 }}>
                <InfoProcedure/>
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}