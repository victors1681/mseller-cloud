// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import LinearProgress from '@mui/material/LinearProgress'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'

// ** Types

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils
import { format, subMonths } from 'date-fns'

const InventoryAnalytics = () => {
  // ** State
  const [selectedLocalidad, setSelectedLocalidad] = useState<number | ''>('')
  const [fechaInicio, setFechaInicio] = useState<Date>(subMonths(new Date(), 1))
  const [fechaFin, setFechaFin] = useState<Date>(new Date())

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.inventory)

  // ** Mock data for demonstration
  const analytics = {
    totalConteos: 15,
    conteosCompletados: 12,
    conteosEnProgreso: 2,
    conteosPlanificados: 1,
    totalReconciliaciones: 8,
    reconciliacionesPendientes: 3,
    reconciliacionesAprobadas: 5,
    promedioDiscrepancias: 2.5,
    valorTotalDiscrepancias: 1250.75,
    eficienciaPromedio: 92.3,
  }

  const estadisticasConteos = [
    {
      title: 'Total Conteos',
      value: analytics.totalConteos,
      icon: 'mdi:counter',
      color: 'primary' as const,
    },
    {
      title: 'Completados',
      value: analytics.conteosCompletados,
      icon: 'mdi:check-circle-outline',
      color: 'success' as const,
    },
    {
      title: 'En Progreso',
      value: analytics.conteosEnProgreso,
      icon: 'mdi:clock-outline',
      color: 'warning' as const,
    },
    {
      title: 'Planificados',
      value: analytics.conteosPlanificados,
      icon: 'mdi:calendar-outline',
      color: 'info' as const,
    },
  ]

  const estadisticasReconciliaciones = [
    {
      title: 'Total Reconciliaciones',
      value: analytics.totalReconciliaciones,
      icon: 'mdi:compare-horizontal',
      color: 'primary' as const,
    },
    {
      title: 'Pendientes',
      value: analytics.reconciliacionesPendientes,
      icon: 'mdi:clock-alert-outline',
      color: 'warning' as const,
    },
    {
      title: 'Aprobadas',
      value: analytics.reconciliacionesAprobadas,
      icon: 'mdi:check-all',
      color: 'success' as const,
    },
  ]

  return (
    <Grid container spacing={6}>
      {/* Filters */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Filtros de Análisis" />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Localidad</InputLabel>
                  <Select
                    value={selectedLocalidad}
                    label="Localidad"
                    onChange={(e) =>
                      setSelectedLocalidad(e.target.value as number)
                    }
                  >
                    <MenuItem value="">Todas las localidades</MenuItem>
                    <MenuItem value={1}>Localidad Principal</MenuItem>
                    <MenuItem value={2}>Localidad Secundaria</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Desde: {format(fechaInicio, 'dd/MM/yyyy')}
                </Typography>
                <Typography variant="body2">
                  Hasta: {format(fechaFin, 'dd/MM/yyyy')}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Estadísticas de Conteos */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Estadísticas de Conteos" />
          <CardContent>
            <Grid container spacing={4}>
              {estadisticasConteos.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                    <CustomAvatar
                      skin="light"
                      color={stat.color}
                      sx={{ mb: 2, width: 56, height: 56 }}
                    >
                      <Icon icon={stat.icon} fontSize="2rem" />
                    </CustomAvatar>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Estadísticas de Reconciliaciones */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Estadísticas de Reconciliaciones" />
          <CardContent>
            <Grid container spacing={4}>
              {estadisticasReconciliaciones.map((stat, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                    <CustomAvatar
                      skin="light"
                      color={stat.color}
                      sx={{ mb: 2, width: 56, height: 56 }}
                    >
                      <Icon icon={stat.icon} fontSize="2rem" />
                    </CustomAvatar>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Métricas de Calidad */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Métricas de Calidad" />
          <CardContent>
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant="body2">Eficiencia Promedio</Typography>
                <Typography variant="body2">
                  {analytics.eficienciaPromedio}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={analytics.eficienciaPromedio}
                color={
                  analytics.eficienciaPromedio > 90 ? 'success' : 'warning'
                }
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="body2">Promedio de Discrepancias</Typography>
              <Chip
                label={`${analytics.promedioDiscrepancias} items`}
                color={
                  analytics.promedioDiscrepancias < 3 ? 'success' : 'warning'
                }
                size="small"
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2">Valor Total Discrepancias</Typography>
              <Typography variant="h6" color="error.main">
                ${analytics.valorTotalDiscrepancias.toFixed(2)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Distribución por Estado */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Distribución de Estados" />
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Conteos Completados</Typography>
                  <Typography variant="body2">
                    {analytics.totalConteos > 0
                      ? Math.round(
                          (analytics.conteosCompletados /
                            analytics.totalConteos) *
                            100,
                        )
                      : 0}
                    %
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    analytics.totalConteos > 0
                      ? (analytics.conteosCompletados /
                          analytics.totalConteos) *
                        100
                      : 0
                  }
                  color="success"
                />
              </Box>

              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    Reconciliaciones Aprobadas
                  </Typography>
                  <Typography variant="body2">
                    {analytics.totalReconciliaciones > 0
                      ? Math.round(
                          (analytics.reconciliacionesAprobadas /
                            analytics.totalReconciliaciones) *
                            100,
                        )
                      : 0}
                    %
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    analytics.totalReconciliaciones > 0
                      ? (analytics.reconciliacionesAprobadas /
                          analytics.totalReconciliaciones) *
                        100
                      : 0
                  }
                  color="info"
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default InventoryAnalytics
