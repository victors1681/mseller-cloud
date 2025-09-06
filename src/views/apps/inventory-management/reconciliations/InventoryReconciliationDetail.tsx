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
      await dispatch(
        aprobarReconciliacion({
          reconciliacionId: inventoryStore.selectedReconciliacion.id,
          usuario: 'current-user',
          observaciones: observaciones || undefined,
        }),
      ).unwrap()
      toast.success('Reconciliación aprobada exitosamente')
      setOpenAprobarDialog(false)
      setObservaciones('')
      // Refresh the data
      dispatch(
        fetchReconciliacionResumen(inventoryStore.selectedReconciliacion.id),
      )
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
                {(!reconciliacion.estado ||
                  reconciliacion.estado === EstadoReconciliacion.Pendiente) && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Icon icon="mdi:check" />}
                    onClick={() => setOpenAprobarDialog(true)}
                    disabled={loading}
                  >
                    Aprobar Reconciliación
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
                      Conteo ID
                    </Typography>
                    <Typography variant="h6">
                      #{reconciliacion.conteoId}
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
                      {reconciliacion.totalAjustesPositivos || 0}
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
                      {Math.abs(reconciliacion.totalAjustesNegativos || 0)}
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
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Details Information */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader title="Información Detallada" />
          <CardContent>
            <List>
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
