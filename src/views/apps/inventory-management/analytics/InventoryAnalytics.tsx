// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { fetchAnalyticsConteo } from 'src/store/apps/inventory'

// ** Types

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils
import formatCurrency from 'src/utils/formatCurrency'

// ** Toast
import toast from 'react-hot-toast'

interface InventoryAnalyticsProps {
  countId?: string
}

const InventoryAnalytics = ({ countId }: InventoryAnalyticsProps) => {
  // ** State
  const [loading, setLoading] = useState(false)

  // ** Hooks
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.inventory)

  // Use prop countId if available, otherwise fallback to router query
  const { id: routerConteoId } = router.query
  const conteoId = countId || routerConteoId

  // ** Effects
  useEffect(() => {
    if (conteoId && typeof conteoId === 'string') {
      const id = parseInt(conteoId)
      handleFetchAnalytics(id)
    }
  }, [conteoId])

  // ** Handlers
  const handleFetchAnalytics = async (id: number) => {
    setLoading(true)
    try {
      await dispatch(fetchAnalyticsConteo(id)).unwrap()
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar analytics')
    } finally {
      setLoading(false)
    }
  }

  const analytics = store.analytics

  if (loading) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 10 }}>
              <Typography variant="h6">Cargando analytics...</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }

  if (!analytics) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 10 }}>
              <Typography variant="h6">
                No se encontraron datos de analytics
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }
  const estadisticasGenerales = [
    {
      title: 'Total Productos',
      value: analytics.TotalProductos,
      icon: 'mdi:package-variant',
      color: 'primary' as const,
    },
    {
      title: 'Con Discrepancia',
      value: analytics.ProductosConDiscrepancia,
      icon: 'mdi:alert-circle-outline',
      color: 'warning' as const,
    },
    {
      title: 'Ajustes Positivos',
      value: analytics.AjustesPositivos,
      icon: 'mdi:trending-up',
      color: 'success' as const,
    },
    {
      title: 'Ajustes Negativos',
      value: analytics.AjustesNegativos,
      icon: 'mdi:trending-down',
      color: 'error' as const,
    },
  ]

  return (
    <Grid container spacing={6}>
      {/* Estadísticas Generales */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Estadísticas del Conteo" />
          <CardContent>
            <Grid container spacing={4}>
              {estadisticasGenerales.map((stat, index) => (
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

      {/* Métricas de Rendimiento */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Métricas de Rendimiento" />
          <CardContent>
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant="body2">Porcentaje de Exactitud</Typography>
                <Typography variant="body2">
                  {analytics.PorcentajeExactitud}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={analytics.PorcentajeExactitud}
                color={
                  analytics.PorcentajeExactitud > 90 ? 'success' : 'warning'
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
              <Typography variant="body2">Productos por Hora</Typography>
              <Chip
                label={`${analytics.ProductosPorHora.toFixed(2)}/h`}
                color="info"
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
              <Typography variant="body2">Tiempo Transcurrido</Typography>
              <Typography variant="h6" color="primary.main">
                {analytics.TiempoTranscurrido.toFixed(1)}h
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Métricas de Ajustes */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Ajustes de Inventario" />
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2">Valor Total de Ajustes</Typography>
                <Typography
                  variant="h6"
                  color={
                    analytics.ValorTotalAjustes < 0
                      ? 'error.main'
                      : 'success.main'
                  }
                >
                  {formatCurrency(analytics.ValorTotalAjustes)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2">
                  Mayor Discrepancia Positiva
                </Typography>
                <Typography variant="body2" color="success.main">
                  {formatCurrency(analytics.MayorDiscrepanciaPositiva)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2">
                  Mayor Discrepancia Negativa
                </Typography>
                <Typography variant="body2" color="error.main">
                  {formatCurrency(analytics.MayorDiscrepanciaNegativa)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Discrepancias */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Principales Discrepancias" />
          <CardContent>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Diferencia</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.TopDiscrepancias.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {item.codigoProducto}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {item.nombre}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={formatCurrency(item.diferencia)}
                          color={item.diferencia < 0 ? 'error' : 'success'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {analytics.TopDiscrepancias.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No hay discrepancias registradas
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Productividad por Usuario */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Productividad por Usuario" />
          <CardContent>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Usuario</TableCell>
                    <TableCell align="center">Cantidad</TableCell>
                    <TableCell align="center">Discrepancias</TableCell>
                    <TableCell align="center">Exactitud</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.ProductividadPorUsuario.map((user, index) => {
                    const exactitud =
                      user.cantidad > 0
                        ? Math.round(
                            ((user.cantidad - user.discrepancias) /
                              user.cantidad) *
                              100,
                          )
                        : 0

                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {user.usuario}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {user.cantidad}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {user.discrepancias}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${exactitud}%`}
                            color={
                              exactitud > 90
                                ? 'success'
                                : exactitud > 70
                                ? 'warning'
                                : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {analytics.ProductividadPorUsuario.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No hay datos de productividad disponibles
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default InventoryAnalytics
