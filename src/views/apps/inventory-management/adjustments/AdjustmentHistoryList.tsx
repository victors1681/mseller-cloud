// ** React Imports

// ** MUI Imports
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import { LocationAutocomplete } from 'src/views/ui/locationAutoComplete'

// ** Types
import { TipoMovimientoInventario } from 'src/types/apps/inventoryMovementsTypes'

// ** Utils
import { formatCurrency } from 'src/utils/formatCurrency'
import { formatDate } from 'src/utils/formatDate'

interface AdjustmentHistoryListProps {
  onLocationChange: (locationId: number | null) => void
  selectedLocationId: number | null
}

const AdjustmentHistoryList = ({
  onLocationChange,
  selectedLocationId,
}: AdjustmentHistoryListProps) => {
  // ** Redux
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector(
    (state: RootState) => state.inventoryMovements,
  )

  // Get adjustments from movements (filter by adjustment type)
  const movements = useSelector(
    (state: RootState) => state.inventoryMovements.movements.items,
  )
  const adjustments = movements.filter(
    (movement) => movement.tipoMovimiento === TipoMovimientoInventario.Ajuste,
  )

  // ** Handlers
  const handleLocationChange = (locationId: string) => {
    const numericLocationId = locationId ? parseInt(locationId) : null
    onLocationChange(numericLocationId)
  }

  return (
    <Card>
      <CardHeader
        title="Historial de Ajustes"
        subheader="Ajustes recientes por localidad"
      />
      <CardContent>
        {/* Location Filter */}
        <Box sx={{ mb: 4 }}>
          <LocationAutocomplete
            selectedLocation={selectedLocationId?.toString()}
            callBack={handleLocationChange}
            size="medium"
          />
        </Box>

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : !selectedLocationId ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 6,
              gap: 2,
            }}
          >
            <Icon
              icon="mdi:map-marker-outline"
              fontSize="3rem"
              color="text.secondary"
            />
            <Typography variant="h6" color="text.secondary">
              Selecciona una localidad
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Elige una localidad para ver el historial de ajustes de inventario
            </Typography>
          </Box>
        ) : adjustments.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 6,
              gap: 2,
            }}
          >
            <Icon
              icon="mdi:playlist-edit"
              fontSize="3rem"
              color="text.secondary"
            />
            <Typography variant="h6" color="text.secondary">
              No hay ajustes registrados
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              No se encontraron ajustes de inventario para esta localidad
            </Typography>
          </Box>
        ) : (
          /* Adjustments Table */
          <TableContainer component={Paper} elevation={0} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Producto</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Razón</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adjustments.slice(0, 10).map((adjustment) => (
                  <TableRow key={adjustment.id}>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(adjustment.fechaMovimiento)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'monospace' }}
                      >
                        {adjustment.numeroDocumento}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {adjustment.producto?.codigo ||
                            adjustment.codigoProducto}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {adjustment.producto?.descripcion ||
                            'Sin descripción'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${
                          adjustment.cantidad > 0 ? '+' : ''
                        }${adjustment.cantidad.toFixed(2)}`}
                        color={adjustment.cantidad >= 0 ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color:
                            adjustment.valorTotal >= 0
                              ? 'success.main'
                              : 'error.main',
                        }}
                      >
                        {formatCurrency(Math.abs(adjustment.valorTotal))}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {adjustment.usuarioCreacion}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={adjustment.observaciones || 'Sin observaciones'}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 120,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {adjustment.observaciones || 'Sin observaciones'}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Summary */}
        {adjustments.length > 0 && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: 'background.default',
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Mostrando {Math.min(adjustments.length, 10)} de{' '}
              {adjustments.length} ajustes
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default AdjustmentHistoryList
