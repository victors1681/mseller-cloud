// ** React Imports

// ** MUI Imports
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import {
  MovimientoInventarioResponse,
  TipoMovimientoInventario,
} from 'src/types/apps/inventoryMovementsTypes'

// ** Utils
import { formatCurrency } from 'src/utils/formatCurrency'
import { formatDate } from 'src/utils/formatDate'

interface MovementDetailModalProps {
  open: boolean
  movement: MovimientoInventarioResponse | null
  onClose: () => void
}

const MovementDetailModal = ({
  open,
  movement,
  onClose,
}: MovementDetailModalProps) => {
  if (!movement) return null

  // ** Get movement type color
  const getMovementTypeColor = (tipo: TipoMovimientoInventario) => {
    switch (tipo) {
      case TipoMovimientoInventario.Entrada:
        return 'success'
      case TipoMovimientoInventario.Salida:
        return 'error'
      case TipoMovimientoInventario.Devolucion:
        return 'warning'
      case TipoMovimientoInventario.Ajuste:
        return 'info'
      default:
        return 'default'
    }
  }

  // ** Get movement icon
  const getMovementIcon = (tipo: TipoMovimientoInventario) => {
    switch (tipo) {
      case TipoMovimientoInventario.Entrada:
        return 'mdi:arrow-down'
      case TipoMovimientoInventario.Salida:
        return 'mdi:arrow-up'
      case TipoMovimientoInventario.Devolucion:
        return 'mdi:keyboard-return'
      case TipoMovimientoInventario.Ajuste:
        return 'mdi:playlist-edit'
      default:
        return 'mdi:swap-horizontal'
    }
  }

  const detailRows = [
    { label: 'ID del Movimiento', value: movement.id },
    { label: 'Número de Documento', value: movement.numeroDocumento },
    {
      label: 'Fecha del Movimiento',
      value: formatDate(movement.fechaMovimiento),
    },
    { label: 'Usuario de Creación', value: movement.usuarioCreacion },
    {
      label: 'Código del Producto',
      value: movement.codigoProducto,
    },
    {
      label: 'Descripción del Producto',
      value: movement.producto?.descripcion || 'Sin descripción',
    },
    {
      label: 'Unidad',
      value: movement.producto?.unidad || 'N/A',
    },
    {
      label: 'Localidad',
      value: movement.localidad?.nombre || `ID: ${movement.localidadId}`,
    },
    {
      label: 'Cantidad',
      value: `${movement.cantidad > 0 ? '+' : ''}${movement.cantidad.toFixed(
        2,
      )} ${movement.producto?.unidad || ''}`,
      highlight: true,
    },
    {
      label: 'Costo Unitario',
      value: formatCurrency(movement.costoUnitario),
    },
    {
      label: 'Valor Total',
      value: formatCurrency(Math.abs(movement.valorTotal)),
      highlight: true,
    },
  ]

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Icon
            icon={getMovementIcon(movement.tipoMovimiento)}
            fontSize="1.5rem"
          />
          <Typography variant="h6" component="span">
            Detalle del Movimiento de Inventario
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={4}>
          {/* Movement Type Card */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                textAlign: 'center',
              }}
            >
              <Chip
                label={movement.tipoMovimientoDescripcion}
                color={getMovementTypeColor(movement.tipoMovimiento) as any}
                size="medium"
                icon={<Icon icon={getMovementIcon(movement.tipoMovimiento)} />}
                sx={{ fontSize: '1rem', p: 2, height: 'auto' }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Tipo de Movimiento
              </Typography>
            </Box>
          </Grid>

          {/* Details Table */}
          <Grid item xs={12}>
            <TableContainer component={Paper} elevation={0} variant="outlined">
              <Table>
                <TableBody>
                  {detailRows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          fontWeight: 500,
                          minWidth: '180px',
                          backgroundColor: 'background.default',
                        }}
                      >
                        {row.label}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: row.highlight ? 600 : 400,
                            color: row.highlight
                              ? movement.cantidad >= 0 ||
                                movement.valorTotal >= 0
                                ? 'success.main'
                                : 'error.main'
                              : 'text.primary',
                          }}
                        >
                          {row.value}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Observations */}
          {movement.observaciones && (
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: 'background.default',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Observaciones:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {movement.observaciones}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Summary */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Movimiento ID: {movement.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fecha: {formatDate(movement.fechaMovimiento)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MovementDetailModal
