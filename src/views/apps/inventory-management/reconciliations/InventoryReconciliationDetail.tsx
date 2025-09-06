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
  aprobarReconciliacion,
  fetchReconciliacionResumen,
} from 'src/store/apps/inventory'

// ** Types
import { EstadoReconciliacion } from 'src/types/apps/inventoryTypes'

// ** Utils
import formatCurrency from 'src/utils/formatCurrency'
import formatDate from 'src/utils/formatDate'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Toast
import toast from 'react-hot-toast'

const InventoryReconciliationDetail = () => {
  // ** State
  const [loading, setLoading] = useState(false)
  const [openAprobarDialog, setOpenAprobarDialog] = useState(false)
  const [observaciones, setObservaciones] = useState('')

  // ** Hooks
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const inventoryStore = useSelector((state: RootState) => state.inventory)

  const { id: reconciliacionId } = router.query

  // ** Effects
  useEffect(() => {
    if (reconciliacionId && typeof reconciliacionId === 'string') {
      const id = parseInt(reconciliacionId)
      dispatch(fetchReconciliacionResumen(id))
    }
  }, [dispatch, reconciliacionId])

  // ** Handlers
  const handleAprobarReconciliacion = async () => {
    if (!inventoryStore.selectedReconciliacion) return

    setLoading(true)
    try {
      const reconciliacionId = inventoryStore.selectedReconciliacion.id
      debugger
      if (!reconciliacionId) {
        throw new Error(
          'No se puede identificar la reconciliación para aprobar',
        )
      }

      await dispatch(
        aprobarReconciliacion({
          reconciliacionId,
          observaciones: observaciones || undefined,
        }),
      ).unwrap()
      toast.success('Reconciliación aprobada exitosamente')
      setOpenAprobarDialog(false)
      setObservaciones('')
      // Refresh the data
      dispatch(fetchReconciliacionResumen(reconciliacionId))
    } catch (error: any) {
      toast.error(error.message || 'Error al aprobar reconciliación')
    } finally {
      setLoading(false)
    }
  }

  // ** Helper functions
  const getStatusFromAjustes = (
    ajustesAplicados: boolean,
    fechaAplicacion?: string,
  ) => {
    if (ajustesAplicados && fechaAplicacion) return 'Aplicado'
    if (!ajustesAplicados && fechaAplicacion) return 'Pendiente'
    return 'Creado'
  }

  const getStatusColor = (
    ajustesAplicados: boolean,
    fechaAplicacion?: string,
  ) => {
    if (ajustesAplicados && fechaAplicacion) return 'success'
    if (!ajustesAplicados && fechaAplicacion) return 'warning'
    return 'info'
  }

  const reconciliacion = inventoryStore.selectedReconciliacion

  if (!reconciliacion) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 10 }}>
              <Typography variant="h6">Cargando reconciliación...</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }

  const status =
    reconciliacion.estado ||
    getStatusFromAjustes(
      reconciliacion.ajustesAplicados,
      reconciliacion.fechaAplicacion,
    )
  const statusColor = reconciliacion.estado
    ? reconciliacion.estado === EstadoReconciliacion.Aprobada
      ? 'success'
      : reconciliacion.estado === EstadoReconciliacion.Pendiente
      ? 'warning'
      : 'error'
    : getStatusColor(
        reconciliacion.ajustesAplicados,
        reconciliacion.fechaAplicacion,
      )

  return (
    <Grid container spacing={6}>
      {/* Header Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5">
                  Reconciliación {reconciliacion.codigoReconciliacion}
                </Typography>
                <Chip
                  variant="outlined"
                  label={status}
                  color={statusColor}
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>
            }
            action={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Icon icon="mdi:check" />}
                  onClick={() => setOpenAprobarDialog(true)}
                  disabled={
                    loading ||
                    reconciliacion.estado === EstadoReconciliacion.Aprobada
                  }
                >
                  Aprobar Reconciliación
                </Button>
              </Box>
            }
          />
        </Card>
      </Grid>

      {/* Summary Information Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Resumen de la Reconciliación" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CustomAvatar skin="light" color="primary">
                    <Icon icon="mdi:format-list-numbered" />
                  </CustomAvatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Ajustes
                    </Typography>
                    <Typography variant="h6">
                      {reconciliacion.totalAjustes || 0}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CustomAvatar skin="light" color="success">
                    <Icon icon="mdi:arrow-up" />
                  </CustomAvatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Ajustes Positivos
                    </Typography>
                    <Typography variant="h6">
                      {reconciliacion.ajustesPositivos ||
                        reconciliacion.totalAjustesPositivos ||
                        0}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CustomAvatar skin="light" color="error">
                    <Icon icon="mdi:arrow-down" />
                  </CustomAvatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Ajustes Negativos
                    </Typography>
                    <Typography variant="h6">
                      {Math.abs(
                        reconciliacion.ajustesNegativos ||
                          reconciliacion.totalAjustesNegativos ||
                          0,
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CustomAvatar skin="light" color="warning">
                    <Icon icon="mdi:currency-usd" />
                  </CustomAvatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Valor Total
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(reconciliacion.valorTotalAjustes ?? 0)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* New fields - Mayor Ajuste Positivo */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CustomAvatar skin="light" color="success">
                    <Icon icon="mdi:trending-up" />
                  </CustomAvatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Mayor Ajuste +
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(reconciliacion.mayorAjustePositivo ?? 0)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* New fields - Mayor Ajuste Negativo */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CustomAvatar skin="light" color="error">
                    <Icon icon="mdi:trending-down" />
                  </CustomAvatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Mayor Ajuste -
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(
                        Math.abs(reconciliacion.mayorAjusteNegativo ?? 0),
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Adjustment Details Table */}
      {reconciliacion.detallesAjustes &&
        reconciliacion.detallesAjustes.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Detalles de Ajustes"
                subheader={`${reconciliacion.detallesAjustes.length} productos con ajustes`}
              />
              <CardContent>
                <TableContainer component={Paper} variant="outlined">
                  <Table
                    sx={{ minWidth: 650 }}
                    aria-label="detalles de ajustes"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>Producto</TableCell>
                        <TableCell align="right">Cant. Anterior</TableCell>
                        <TableCell align="right">Cant. Contada</TableCell>
                        <TableCell align="right">Ajuste</TableCell>
                        <TableCell align="right">Valor Ajuste</TableCell>
                        <TableCell align="right">% Diferencia</TableCell>
                        <TableCell>Motivo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reconciliacion.detallesAjustes.map((detalle, index) => (
                        <TableRow
                          key={`${detalle.codigoProducto}-${index}`}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Typography variant="body2" fontWeight="medium">
                              {detalle.codigoProducto}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {detalle.nombreProducto}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            {detalle.cantidadAnterior.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            {detalle.cantidadContada.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                gap: 0.5,
                              }}
                            >
                              <Icon
                                icon={
                                  detalle.cantidadAjuste >= 0
                                    ? 'mdi:arrow-up'
                                    : 'mdi:arrow-down'
                                }
                                color={
                                  detalle.cantidadAjuste >= 0
                                    ? 'success'
                                    : 'error'
                                }
                                fontSize="small"
                              />
                              <Typography
                                variant="body2"
                                color={
                                  detalle.cantidadAjuste >= 0
                                    ? 'success.main'
                                    : 'error.main'
                                }
                                fontWeight="medium"
                              >
                                {Math.abs(detalle.cantidadAjuste).toFixed(2)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              color={
                                detalle.valorAjuste >= 0
                                  ? 'success.main'
                                  : 'error.main'
                              }
                              fontWeight="medium"
                            >
                              {formatCurrency(detalle.valorAjuste)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${detalle.porcentajeDiferencia.toFixed(
                                1,
                              )}%`}
                              size="small"
                              color={
                                Math.abs(detalle.porcentajeDiferencia) > 10
                                  ? 'error'
                                  : Math.abs(detalle.porcentajeDiferencia) > 5
                                  ? 'warning'
                                  : 'default'
                              }
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {detalle.motivoAjuste || '-'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

      {/* Details Information */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader title="Información Detallada" />
          <CardContent>
            <List>
              {reconciliacion.conteoId && (
                <ListItem>
                  <ListItemIcon>
                    <Icon icon="mdi:format-list-numbered" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Conteo ID"
                    secondary={`#${reconciliacion.conteoId}`}
                  />
                </ListItem>
              )}

              <ListItem>
                <ListItemIcon>
                  <Icon icon="mdi:calendar-plus" />
                </ListItemIcon>
                <ListItemText
                  primary="Fecha de Reconciliación"
                  secondary={formatDate(reconciliacion.fechaReconciliacion)}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Icon icon="mdi:account" />
                </ListItemIcon>
                <ListItemText
                  primary="Reconciliado Por"
                  secondary={reconciliacion.reconciliadoPor}
                />
              </ListItem>

              {reconciliacion.fechaAplicacion && (
                <ListItem>
                  <ListItemIcon>
                    <Icon icon="mdi:calendar-check" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Fecha de Aplicación"
                    secondary={formatDate(reconciliacion.fechaAplicacion)}
                  />
                </ListItem>
              )}

              {reconciliacion.aplicadoPor && (
                <ListItem>
                  <ListItemIcon>
                    <Icon icon="mdi:account-check" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Aplicado Por"
                    secondary={reconciliacion.aplicadoPor}
                  />
                </ListItem>
              )}

              {reconciliacion.observaciones && (
                <ListItem>
                  <ListItemIcon>
                    <Icon icon="mdi:note-text" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Observaciones"
                    secondary={reconciliacion.observaciones}
                  />
                </ListItem>
              )}

              <ListItem>
                <ListItemIcon>
                  <Icon icon="mdi:toggle-switch" />
                </ListItemIcon>
                <ListItemText
                  primary="Ajustes Aplicados"
                  secondary={reconciliacion.ajustesAplicados ? 'Sí' : 'No'}
                />
              </ListItem>

              {reconciliacion.businessId && (
                <ListItem>
                  <ListItemIcon>
                    <Icon icon="mdi:domain" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Business ID"
                    secondary={reconciliacion.businessId}
                  />
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Status Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Estado Actual" />
          <CardContent sx={{ textAlign: 'center' }}>
            <Box sx={{ mb: 3 }}>
              <CustomAvatar
                skin="light"
                color={statusColor}
                sx={{ width: 80, height: 80, mb: 2, mx: 'auto' }}
              >
                <Icon
                  icon={
                    reconciliacion.ajustesAplicados
                      ? 'mdi:check-circle'
                      : reconciliacion.fechaAplicacion
                      ? 'mdi:clock-outline'
                      : 'mdi:file-document-outline'
                  }
                  fontSize="2.5rem"
                />
              </CustomAvatar>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {status}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {reconciliacion.ajustesAplicados
                  ? 'Los ajustes han sido aplicados al inventario'
                  : reconciliacion.fechaAplicacion
                  ? 'Pendiente de aplicación de ajustes'
                  : 'Reconciliación creada y lista para revisión'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Aprobar Reconciliación Dialog */}
      <Dialog
        open={openAprobarDialog}
        onClose={() => setOpenAprobarDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon icon="mdi:check-circle" />
            Aprobar Reconciliación
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ¿Está seguro que desea aprobar la reconciliación{' '}
            <strong>{reconciliacion.codigoReconciliacion}</strong>?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Observaciones (opcional)"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Ingrese observaciones sobre la aprobación..."
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenAprobarDialog(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleAprobarReconciliacion}
            disabled={loading}
          >
            Confirmar Aprobación
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default InventoryReconciliationDetail
