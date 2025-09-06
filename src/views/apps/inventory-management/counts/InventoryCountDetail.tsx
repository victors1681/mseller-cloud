// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  cancelarConteo,
  completarConteo,
  crearReconciliacion,
  fetchConteo,
  iniciarConteo,
} from 'src/store/apps/inventory'
import { fetchProgresoZonas } from 'src/store/apps/inventoryZones'

// ** Types
import { EstadoInventario } from 'src/types/apps/inventoryTypes'

// ** Utils
import { format } from 'date-fns'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Toast
import toast from 'react-hot-toast'

const InventoryCountDetail = () => {
  // ** State
  const [loading, setLoading] = useState(false)

  // ** Hooks
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const inventoryStore = useSelector((state: RootState) => state.inventory)
  const zonesStore = useSelector((state: RootState) => state.inventoryZones)

  const { id: conteoId } = router.query

  // ** Effects
  useEffect(() => {
    if (conteoId && typeof conteoId === 'string') {
      const id = parseInt(conteoId)
      dispatch(fetchConteo(id))
      dispatch(fetchProgresoZonas(id))
    }
  }, [dispatch, conteoId])

  // ** Handlers
  const handleIniciarConteo = async () => {
    if (!inventoryStore.selectedConteo) return

    setLoading(true)
    try {
      await dispatch(
        iniciarConteo({
          conteoId: inventoryStore.selectedConteo.id,
          usuario: 'current-user',
        }),
      ).unwrap()
      toast.success('Conteo iniciado')
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar conteo')
    } finally {
      setLoading(false)
    }
  }

  const handleCompletarConteo = async () => {
    if (!inventoryStore.selectedConteo) return

    setLoading(true)
    try {
      await dispatch(
        completarConteo({
          conteoId: inventoryStore.selectedConteo.id,
          usuario: 'current-user',
        }),
      ).unwrap()
      toast.success('Conteo completado')
    } catch (error: any) {
      toast.error(error.message || 'Error al completar conteo')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelarConteo = async () => {
    if (!inventoryStore.selectedConteo) return

    setLoading(true)
    try {
      await dispatch(
        cancelarConteo({
          conteoId: inventoryStore.selectedConteo.id,
          usuario: 'current-user',
          motivo: 'Cancelado desde portal web',
        }),
      ).unwrap()
      toast.success('Conteo cancelado')
    } catch (error: any) {
      toast.error(error.message || 'Error al cancelar conteo')
    } finally {
      setLoading(false)
    }
  }

  const handleCrearReconciliacion = async () => {
    if (!inventoryStore.selectedConteo) return

    setLoading(true)
    try {
      await dispatch(
        crearReconciliacion({
          conteoId: inventoryStore.selectedConteo.id,
          request: {
            reconciliadoPor: 'current-user',
            observaciones: 'Reconciliación creada desde portal web',
          },
        }),
      ).unwrap()
      toast.success('Reconciliación creada')
    } catch (error: any) {
      toast.error(error.message || 'Error al crear reconciliación')
    } finally {
      setLoading(false)
    }
  }

  // ** Render estado chip
  const renderEstadoChip = (estado: EstadoInventario) => {
    const colorMap = {
      [EstadoInventario.Planificado]: 'info',
      [EstadoInventario.EnProgreso]: 'warning',
      [EstadoInventario.Completado]: 'success',
      [EstadoInventario.Cancelado]: 'error',
    } as const

    return (
      <Chip
        label={estado}
        color={colorMap[estado]}
        sx={{ textTransform: 'capitalize' }}
      />
    )
  }

  const conteo = inventoryStore.selectedConteo

  if (!conteo) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 10 }}>
              <Typography variant="h6">Cargando conteo...</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={6}>
      {/* Header Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5">
                  Conteo {conteo.codigoConteo}
                </Typography>
                {renderEstadoChip(conteo.estado)}
              </Box>
            }
            action={
              <Box sx={{ display: 'flex', gap: 2 }}>
                {conteo.estado === EstadoInventario.Planificado && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Icon icon="mdi:play" />}
                    onClick={handleIniciarConteo}
                    disabled={loading}
                  >
                    Iniciar Conteo
                  </Button>
                )}

                {conteo.estado === EstadoInventario.EnProgreso && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Icon icon="mdi:check" />}
                    onClick={handleCompletarConteo}
                    disabled={loading}
                  >
                    Completar Conteo
                  </Button>
                )}

                {conteo.estado === EstadoInventario.Completado && (
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<Icon icon="mdi:compare-horizontal" />}
                    onClick={handleCrearReconciliacion}
                    disabled={loading}
                  >
                    Crear Reconciliación
                  </Button>
                )}

                {(conteo.estado === EstadoInventario.Planificado ||
                  conteo.estado === EstadoInventario.EnProgreso) && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Icon icon="mdi:close" />}
                    onClick={handleCancelarConteo}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                )}
              </Box>
            }
          />
        </Card>
      </Grid>

      {/* Overview Cards */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <CustomAvatar
              skin="light"
              color="primary"
              sx={{ mb: 2, width: 56, height: 56 }}
            >
              <Icon icon="mdi:package-variant" fontSize="2rem" />
            </CustomAvatar>
            <Typography variant="h5">
              {conteo.totalProductosContados}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Productos Contados
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <CustomAvatar
              skin="light"
              color="success"
              sx={{ mb: 2, width: 56, height: 56 }}
            >
              <Icon icon="mdi:check-circle-outline" fontSize="2rem" />
            </CustomAvatar>
            <Typography variant="h5">{conteo.totalDiscrepancias}</Typography>
            <Typography variant="body2" color="text.secondary">
              Total Discrepancias
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <CustomAvatar
              skin="light"
              color="info"
              sx={{ mb: 2, width: 56, height: 56 }}
            >
              <Icon icon="mdi:currency-usd" fontSize="2rem" />
            </CustomAvatar>
            <Typography variant="h5">
              ${conteo.valorTotalAjustes.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Valor Total Ajustes
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <CustomAvatar
              skin="light"
              color="warning"
              sx={{ mb: 2, width: 56, height: 56 }}
            >
              <Icon icon="mdi:account-outline" fontSize="2rem" />
            </CustomAvatar>
            <Typography variant="h5">{conteo.creadoPor || 'N/A'}</Typography>
            <Typography variant="body2" color="text.secondary">
              Creado Por
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Progress Detail */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Progreso Detallado" />
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant="body2">
                  {conteo.totalProductosContados} productos contados
                </Typography>
                <Typography variant="body2">
                  {conteo.totalDiscrepancias} discrepancias
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Valor total de ajustes: ${conteo.valorTotalAjustes.toFixed(2)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Progreso por Zonas */}
      {zonesStore.progresoZonas.length > 0 && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Progreso por Zonas" />
            <CardContent>
              <Grid container spacing={3}>
                {zonesStore.progresoZonas.map((zona, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6">{zona.nombreZona}</Typography>
                        <Chip
                          label={zona.estado}
                          color={
                            zona.estado === 'Completado' ? 'success' : 'warning'
                          }
                          size="small"
                        />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <CustomAvatar
                          skin="light"
                          sx={{ width: 30, height: 30 }}
                        >
                          {zona.usuarioAsignado.charAt(0).toUpperCase()}
                        </CustomAvatar>
                        <Typography variant="body2">
                          {zona.usuarioAsignado}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2">
                            {zona.productosContados} / {zona.totalProductos}
                          </Typography>
                          <Typography variant="body2">
                            {zona.progreso.toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={zona.progreso}
                          color={zona.progreso === 100 ? 'success' : 'primary'}
                        />
                      </Box>

                      {zona.fechaInicio && (
                        <Typography variant="caption" color="text.secondary">
                          Iniciado:{' '}
                          {format(
                            new Date(zona.fechaInicio),
                            'dd/MM/yyyy HH:mm',
                          )}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Information Timeline */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Información del Conteo" />
          <CardContent>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Icon icon="mdi:calendar" />
                </ListItemIcon>
                <ListItemText
                  primary="Fecha de Inicio"
                  secondary={format(
                    new Date(conteo.fechaInicio),
                    'dd/MM/yyyy HH:mm',
                  )}
                />
              </ListItem>

              {conteo.fechaInicio && (
                <ListItem>
                  <ListItemIcon>
                    <Icon icon="mdi:play-circle" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Fecha de Inicio"
                    secondary={format(
                      new Date(conteo.fechaInicio),
                      'dd/MM/yyyy HH:mm',
                    )}
                  />
                </ListItem>
              )}

              {conteo.fechaFinalizacion && (
                <ListItem>
                  <ListItemIcon>
                    <Icon icon="mdi:check-circle" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Fecha de Finalización"
                    secondary={format(
                      new Date(conteo.fechaFinalizacion),
                      'dd/MM/yyyy HH:mm',
                    )}
                  />
                </ListItem>
              )}

              {conteo.observaciones && (
                <ListItem>
                  <ListItemIcon>
                    <Icon icon="mdi:note-text" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Observaciones"
                    secondary={conteo.observaciones}
                  />
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default InventoryCountDetail
