// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material'

// ** Third Party Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { AppDispatch, RootState } from 'src/store'
import { generateCxcReport } from 'src/store/apps/cxc'

// ** Types
import { EstadoCxc } from 'src/types/apps/cxcTypes'

const CxcReportsView = () => {
  // ** Hooks
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.cxc)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // ** State
  const [reportFilters, setReportFilters] = useState({
    fechaInicio: '',
    fechaFin: '',
    estados: [] as EstadoCxc[],
  })

  // ** Handlers
  const handleGenerateReport = () => {
    if (reportFilters.fechaInicio && reportFilters.fechaFin) {
      dispatch(
        generateCxcReport({
          fechaInicio: reportFilters.fechaInicio,
          fechaFin: reportFilters.fechaFin,
          filters: {
            estado:
              reportFilters.estados.length > 0
                ? reportFilters.estados
                : undefined,
          },
        }),
      )
    }
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        component="h1"
        sx={{ fontWeight: 700, mb: 3 }}
      >
        Reportes de CXC
      </Typography>

      {/* Report Filters */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Configuración de Reporte" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Inicio"
                value={reportFilters.fechaInicio}
                onChange={(e) =>
                  setReportFilters((prev) => ({
                    ...prev,
                    fechaInicio: e.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Fin"
                value={reportFilters.fechaFin}
                onChange={(e) =>
                  setReportFilters((prev) => ({
                    ...prev,
                    fechaFin: e.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Estados</InputLabel>
                <Select
                  multiple
                  value={reportFilters.estados}
                  onChange={(e) =>
                    setReportFilters((prev) => ({
                      ...prev,
                      estados: e.target.value as EstadoCxc[],
                    }))
                  }
                >
                  {Object.values(EstadoCxc).map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {estado}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleGenerateReport}
                disabled={
                  !reportFilters.fechaInicio ||
                  !reportFilters.fechaFin ||
                  store.isLoading
                }
                startIcon={<Icon icon="mdi:file-chart-outline" />}
                sx={{ height: 56 }}
              >
                Generar Reporte
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Report Results */}
      {store.reportData && (
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: 'primary.main' }}
                  >
                    {store.reportData.totalDocumentos}
                  </Typography>
                  <Typography variant="caption">Total Documentos</Typography>
                </Paper>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: 'success.main',
                      fontSize: isMobile ? '0.9rem' : '1.25rem',
                    }}
                  >
                    ${store.reportData.montoTotalFacturado.toLocaleString()}
                  </Typography>
                  <Typography variant="caption">Total Facturado</Typography>
                </Paper>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: 'warning.main',
                      fontSize: isMobile ? '0.9rem' : '1.25rem',
                    }}
                  >
                    ${store.reportData.saldoPendienteTotal.toLocaleString()}
                  </Typography>
                  <Typography variant="caption">Saldo Pendiente</Typography>
                </Paper>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: 'error.main' }}
                  >
                    {store.reportData.documentosVencidos}
                  </Typography>
                  <Typography variant="caption">Documentos Vencidos</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* CXC by Client */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="CXC por Cliente" />
              <CardContent>
                <Stack spacing={2}>
                  {store.reportData.cxcPorCliente
                    .slice(0, 10)
                    .map((cliente) => (
                      <Box key={cliente.codigoCliente}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {cliente.nombreCliente}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Documentos: {cliente.cantidadDocumentos} | Pendiente:
                          ${cliente.saldoPendiente.toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* CXC by Status */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="CXC por Estado" />
              <CardContent>
                <Stack spacing={2}>
                  {store.reportData.cxcPorEstado.map((estado) => (
                    <Box key={estado.estado}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {estado.estado}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cantidad: {estado.cantidad} | Monto: $
                        {estado.montoTotal.toLocaleString()} (
                        {estado.porcentaje.toFixed(1)}%)
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default CxcReportsView
