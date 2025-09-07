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
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
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
  fetchReporteDiscrepancias,
  iniciarConteo,
} from 'src/store/apps/inventory'
import { fetchProgresoZonas } from 'src/store/apps/inventoryZones'

// ** Types
import { EstadoInventario, TipoConteo } from 'src/types/apps/inventoryTypes'

// ** Utils
import { format } from 'date-fns'
import formatCurrency from 'src/utils/formatCurrency'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Toast
import toast from 'react-hot-toast'

// ** Helper Functions
const mapEstadoFromApi = (estadoNumerico: number): EstadoInventario => {
  const estadoMap = {
    0: EstadoInventario.Planificado,
    1: EstadoInventario.EnProgreso,
    2: EstadoInventario.Completado,
    3: EstadoInventario.Cancelado,
  } as const

  return (
    estadoMap[estadoNumerico as keyof typeof estadoMap] ||
    EstadoInventario.Planificado
  )
}

const mapTipoConteoFromApi = (tipoNumerico: number): TipoConteo => {
  const tipoMap = {
    0: TipoConteo.Completo, // ConteoCompleto
    1: TipoConteo.Ciclico, // ConteoCiclico
    2: TipoConteo.Ajuste, // ConteoAjuste
  } as const

  return tipoMap[tipoNumerico as keyof typeof tipoMap] || TipoConteo.Completo
}

const getEstadoLabel = (estado: EstadoInventario): string => {
  const labelMap = {
    [EstadoInventario.Planificado]: 'Planificado',
    [EstadoInventario.EnProgreso]: 'En Progreso',
    [EstadoInventario.Completado]: 'Completado',
    [EstadoInventario.Reconciliado]: 'Reconciliado',
    [EstadoInventario.Cancelado]: 'Cancelado',
  }

  return labelMap[estado]
}

const getTipoConteoLabel = (tipoConteo: TipoConteo): string => {
  const labelMap = {
    [TipoConteo.Completo]: 'Conteo Completo',
    [TipoConteo.Ciclico]: 'Conteo Cíclico',
    [TipoConteo.Ajuste]: 'Conteo de Ajuste',
  }

  return labelMap[tipoConteo]
}

const InventoryCountDetail = () => {
  // ** State
  const [loading, setLoading] = useState(false)
  const [openCancelDialog, setOpenCancelDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [openDiscrepancyDialog, setOpenDiscrepancyDialog] = useState(false)

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
      toast.success('Conteo iniciado exitosamente')
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
      toast.success('Conteo completado exitosamente')
    } catch (error: any) {
      toast.error(error.message || 'Error al completar conteo')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(true)
  }

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false)
    setCancelReason('')
  }

  const handleConfirmCancelConteo = async () => {
    if (!inventoryStore.selectedConteo || !cancelReason.trim()) return

    setLoading(true)
    try {
      await dispatch(
        cancelarConteo({
          conteoId: inventoryStore.selectedConteo.id,
          usuario: 'current-user',
          motivo: cancelReason,
        }),
      ).unwrap()
      toast.success('Conteo cancelado exitosamente')
      handleCloseCancelDialog()
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
            observaciones: 'Reconciliación creada desde portal web',
          },
        }),
      ).unwrap()
      toast.success('Reconciliación creada exitosamente')
    } catch (error: any) {
      toast.error(error.message || 'Error al crear reconciliación')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDiscrepancyReport = async () => {
    if (!inventoryStore.selectedConteo) return

    setLoading(true)
    try {
      await dispatch(
        fetchReporteDiscrepancias(inventoryStore.selectedConteo.id),
      ).unwrap()
      setOpenDiscrepancyDialog(true)
      toast.success('Reporte de discrepancias generado')
    } catch (error: any) {
      toast.error(error.message || 'Error al generar reporte de discrepancias')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseDiscrepancyDialog = () => {
    setOpenDiscrepancyDialog(false)
  }

  // ** Helper function to get current estado as enum
  const getCurrentEstado = (
    estadoValue: EstadoInventario | number,
  ): EstadoInventario => {
    return typeof estadoValue === 'number'
      ? mapEstadoFromApi(estadoValue)
      : estadoValue
  }

  // ** Helper function to get current tipo conteo as enum
  const getCurrentTipoConteo = (tipoValue: TipoConteo | number): TipoConteo => {
    return typeof tipoValue === 'number'
      ? mapTipoConteoFromApi(tipoValue)
      : tipoValue
  }

  // ** Render estado chip
  const renderEstadoChip = (estadoValue: EstadoInventario | number) => {
    // Handle both numeric and string enum values
    const estado =
      typeof estadoValue === 'number'
        ? mapEstadoFromApi(estadoValue)
        : estadoValue

    const colorMap = {
      [EstadoInventario.Planificado]: 'info',
      [EstadoInventario.EnProgreso]: 'warning',
      [EstadoInventario.Completado]: 'primary',
      [EstadoInventario.Reconciliado]: 'success',
      [EstadoInventario.Cancelado]: 'error',
    } as const

    return (
      <Chip
        label={getEstadoLabel(estado)}
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
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {getCurrentEstado(conteo.estado) ===
                  EstadoInventario.Planificado && (
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

                {getCurrentEstado(conteo.estado) ===
                  EstadoInventario.EnProgreso && (
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

                {getCurrentEstado(conteo.estado) ===
                  EstadoInventario.Completado && (
                  <>
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<Icon icon="mdi:compare-horizontal" />}
                      onClick={handleCrearReconciliacion}
                      disabled={loading}
                    >
                      Crear Reconciliación
                    </Button>
                    <Button
                      variant="outlined"
                      color="info"
                      startIcon={<Icon icon="mdi:file-document-outline" />}
                      onClick={handleOpenDiscrepancyReport}
                      disabled={loading}
                    >
                      Reporte de Discrepancias
                    </Button>
                  </>
                )}

                {(getCurrentEstado(conteo.estado) ===
                  EstadoInventario.Planificado ||
                  getCurrentEstado(conteo.estado) ===
                    EstadoInventario.EnProgreso) && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Icon icon="mdi:close" />}
                    onClick={handleOpenCancelDialog}
                    disabled={loading}
                  >
                    Cancelar Conteo
                  </Button>
                )}
              </Box>
            }
          />
        </Card>
      </Grid>

      {/* Summary Information Card */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CustomAvatar skin="light" color="primary">
                    <Icon icon="mdi:format-list-bulleted-type" />
                  </CustomAvatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tipo de Conteo
                    </Typography>
                    <Typography variant="h6">
                      {getTipoConteoLabel(
                        getCurrentTipoConteo(conteo.tipoConteo),
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CustomAvatar skin="light" color="info">
                    <Icon icon="mdi:map-marker" />
                  </CustomAvatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Localidad ID
                    </Typography>
                    <Typography variant="h6">{conteo.localidadId}</Typography>
                  </Box>
                </Box>
              </Grid>

              {conteo.snapshotId && (
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CustomAvatar skin="light" color="warning">
                      <Icon icon="mdi:camera" />
                    </CustomAvatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Snapshot
                      </Typography>
                      <Typography variant="h6">#{conteo.snapshotId}</Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {conteo.businessId && (
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CustomAvatar skin="light" color="secondary">
                      <Icon icon="mdi:domain" />
                    </CustomAvatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Business ID
                      </Typography>
                      <Typography variant="h6" sx={{ fontSize: '0.875rem' }}>
                        {conteo.businessId.substring(0, 8)}...
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
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
              {formatCurrency(conteo.valorTotalAjustes ?? 0)}
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
                Valor total de ajustes:{' '}
                {formatCurrency(conteo.valorTotalAjustes ?? 0)}
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
                  <Icon icon="mdi:format-list-bulleted-type" />
                </ListItemIcon>
                <ListItemText
                  primary="Tipo de Conteo"
                  secondary={getTipoConteoLabel(
                    getCurrentTipoConteo(conteo.tipoConteo),
                  )}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Icon icon="mdi:calendar" />
                </ListItemIcon>
                <ListItemText
                  primary="Fecha de Planificación"
                  secondary={format(
                    new Date(conteo.fechaInicio),
                    'dd/MM/yyyy HH:mm',
                  )}
                />
              </ListItem>

              {conteo.creadoPor && (
                <ListItem>
                  <ListItemIcon>
                    <Icon icon="mdi:account-plus" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Creado Por"
                    secondary={conteo.creadoPor}
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

              {conteo.finalizadoPor && (
                <ListItem>
                  <ListItemIcon>
                    <Icon icon="mdi:account-check" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Finalizado Por"
                    secondary={conteo.finalizadoPor}
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

              {conteo.snapshotId && (
                <ListItem>
                  <ListItemIcon>
                    <Icon icon="mdi:camera" />
                  </ListItemIcon>
                  <ListItemText
                    primary="ID de Snapshot"
                    secondary={`Snapshot #${conteo.snapshotId}`}
                  />
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={handleCloseCancelDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancelar Conteo</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ¿Está seguro que desea cancelar el conteo{' '}
            <strong>{conteo.codigoConteo}</strong>?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Motivo de cancelación"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            required
            helperText="Este campo es requerido"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmCancelConteo}
            disabled={loading || !cancelReason.trim()}
          >
            Confirmar Cancelación
          </Button>
        </DialogActions>
      </Dialog>

      {/* Discrepancy Report Dialog */}
      <Dialog
        open={openDiscrepancyDialog}
        onClose={handleCloseDiscrepancyDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon icon="mdi:file-document-outline" />
            Reporte de Discrepancias - {conteo.codigoConteo}
          </Box>
        </DialogTitle>
        <DialogContent>
          {inventoryStore.discrepancias.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Icon
                icon="mdi:check-circle-outline"
                fontSize="3rem"
                color="success.main"
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                No se encontraron discrepancias
              </Typography>
              <Typography variant="body2" color="text.secondary">
                El conteo coincide perfectamente con el inventario esperado
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Código Producto</TableCell>
                    <TableCell>Nombre Producto</TableCell>
                    <TableCell align="right">Cant. Esperada</TableCell>
                    <TableCell align="right">Cant. Contada</TableCell>
                    <TableCell align="right">Diferencia</TableCell>
                    <TableCell align="right">Valor Unit.</TableCell>
                    <TableCell align="right">Valor Total</TableCell>
                    <TableCell>Zona</TableCell>
                    <TableCell>Usuario</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventoryStore.discrepancias.map((discrepancia, index) => (
                    <TableRow key={index}>
                      <TableCell>{discrepancia.codigoProducto}</TableCell>
                      <TableCell>{discrepancia.nombreProducto}</TableCell>
                      <TableCell align="right">
                        {discrepancia.cantidadEsperada}
                      </TableCell>
                      <TableCell align="right">
                        {discrepancia.cantidadContada}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color:
                            discrepancia.diferencia > 0
                              ? 'success.main'
                              : 'error.main',
                          fontWeight: 'bold',
                        }}
                      >
                        {discrepancia.diferencia > 0 ? '+' : ''}
                        {discrepancia.diferencia}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(discrepancia.valorUnitario ?? 0)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color:
                            discrepancia.valorTotalDiscrepancia > 0
                              ? 'success.main'
                              : 'error.main',
                          fontWeight: 'bold',
                        }}
                      >
                        {formatCurrency(
                          discrepancia.valorTotalDiscrepancia ?? 0,
                        )}
                      </TableCell>
                      <TableCell>{discrepancia.zona || 'N/A'}</TableCell>
                      <TableCell>{discrepancia.usuario || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDiscrepancyDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default InventoryCountDetail
