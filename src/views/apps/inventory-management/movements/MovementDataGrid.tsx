// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import {
  MovimientoInventarioResponse,
  PagedResult,
  TipoMovimientoInventario,
} from 'src/types/apps/inventoryMovementsTypes'

// ** Utils
import { formatCurrency } from 'src/utils/formatCurrency'
import { formatDate } from 'src/utils/formatDate'

interface MovementDataGridProps {
  movements: PagedResult<MovimientoInventarioResponse>
  loading: boolean
  onViewDetails: (movement: MovimientoInventarioResponse) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const MovementDataGrid = ({
  movements,
  loading,
  onViewDetails,
  onPageChange,
  onPageSizeChange,
}: MovementDataGridProps) => {
  // ** State
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(movements.pageSize)

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

  // ** Handle pagination change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    onPageChange(newPage + 1) // Convert to 1-based page
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage)
    setPage(0)
    onPageSizeChange(newRowsPerPage)
  }

  return (
    <Card>
      <CardHeader
        title="Historial de Movimientos"
        subheader={
          movements.totalCount > 0
            ? `${movements.totalCount} movimientos encontrados`
            : 'No hay movimientos para mostrar'
        }
      />
      <CardContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress />
          </Box>
        ) : movements.items.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 400,
              gap: 2,
            }}
          >
            <Icon
              icon="mdi:database-outline"
              fontSize="3rem"
              color="text.secondary"
            />
            <Typography variant="h6" color="text.secondary">
              No hay movimientos disponibles
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Selecciona un producto para ver su historial de movimientos
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Documento</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell>Localidad</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Costo Unit.</TableCell>
                    <TableCell align="right">Valor Total</TableCell>
                    <TableCell>Usuario</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {movements.items.map((movement) => (
                    <TableRow
                      key={movement.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(movement.fechaMovimiento)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: 'monospace' }}
                        >
                          {movement.numeroDocumento}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={movement.tipoMovimientoDescripcion}
                          color={
                            getMovementTypeColor(movement.tipoMovimiento) as any
                          }
                          size="small"
                          icon={
                            <Icon
                              icon={getMovementIcon(movement.tipoMovimiento)}
                            />
                          }
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {movement.producto?.codigo ||
                              movement.codigoProducto}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {movement.producto?.descripcion ||
                              'Sin descripción'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {movement.localidad?.nombre ||
                            `ID: ${movement.localidadId}`}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color:
                              movement.cantidad >= 0
                                ? 'success.main'
                                : 'error.main',
                          }}
                        >
                          {movement.cantidad > 0 ? '+' : ''}
                          {movement.cantidad.toFixed(2)}
                          {movement.producto?.unidad && (
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{ ml: 0.5 }}
                            >
                              {movement.producto.unidad}
                            </Typography>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {formatCurrency(movement.costoUnitario)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color:
                              movement.valorTotal >= 0
                                ? 'success.main'
                                : 'error.main',
                          }}
                        >
                          {formatCurrency(Math.abs(movement.valorTotal))}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {movement.usuarioCreacion}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => onViewDetails(movement)}
                          >
                            <Icon icon="mdi:eye-outline" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 20, 50, 100]}
              component="div"
              count={movements.totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
              }
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default MovementDataGrid
