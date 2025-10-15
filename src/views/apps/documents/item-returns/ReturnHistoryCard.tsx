// ** React Imports
import { useCallback, useState } from 'react'

// ** MUI Imports
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Redux Imports
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

// ** Utils
import { formatCurrency } from 'src/utils/formatCurrency'
import { formatDate } from 'src/utils/formatDate'

// ** Types

interface ReturnHistoryCardProps {
  maxHeight?: number
}

const ReturnHistoryCard = ({ maxHeight = 400 }: ReturnHistoryCardProps) => {
  // ** State
  const [page, setPage] = useState(1)
  const [rowsPerPage] = useState(10)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')

  // ** Redux
  const { returnHistory, isLoadingHistory, historyError } = useSelector(
    (state: RootState) => state.itemReturns,
  )

  // ** Handlers
  const handlePageChange = useCallback((_: unknown, newPage: number) => {
    setPage(newPage)
  }, [])

  const handleToggleExpand = useCallback((index: number) => {
    setExpandedRow((prev) => (prev === index ? null : index))
  }, [])

  // ** Calculate pagination
  const totalPages = Math.ceil(returnHistory.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const displayedReturns = returnHistory.slice(startIndex, endIndex)

  return (
    <Card>
      <CardHeader
        title={
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
          >
            Historial de Devoluciones
          </Typography>
        }
        subheader={
          <Typography
            variant="body2"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Consulta las devoluciones procesadas recientemente
          </Typography>
        }
        action={
          <TextField
            select
            size="small"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">Todas</MenuItem>
            <MenuItem value="recent">Recientes</MenuItem>
            <MenuItem value="today">Hoy</MenuItem>
          </TextField>
        }
      />

      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {returnHistory.length === 0 ? (
          <Alert
            severity="info"
            sx={{
              textAlign: 'center',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Icon icon="mdi:history" fontSize="2rem" />
              <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
                No hay devoluciones procesadas aún
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
              >
                Las devoluciones aparecerán aquí una vez procesadas
              </Typography>
            </Box>
          </Alert>
        ) : (
          <>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                maxHeight,
                mb: 2,
                '& .MuiTableCell-root': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                },
              }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Documento</TableCell>
                    <TableCell align="center">Fecha</TableCell>
                    <TableCell align="center">Productos</TableCell>
                    <TableCell align="right">Monto</TableCell>
                    <TableCell align="center">CXC</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedReturns.map((returnItem, index) => (
                    <>
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'bold',
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            }}
                          >
                            {returnItem.numeroDocumento}
                          </Typography>
                        </TableCell>

                        <TableCell align="center">
                          <Typography
                            variant="caption"
                            sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                          >
                            {formatDate(new Date().toISOString())}
                          </Typography>
                        </TableCell>

                        <TableCell align="center">
                          <Chip
                            label={`${returnItem.productos.length} item(s)`}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'bold',
                              color: 'success.main',
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            }}
                          >
                            {formatCurrency(returnItem.montoDevolucion)}
                          </Typography>
                        </TableCell>

                        <TableCell align="center">
                          <Chip
                            label={returnItem.movimientoCxc ? 'Sí' : 'N/A'}
                            size="small"
                            color={
                              returnItem.movimientoCxc ? 'success' : 'default'
                            }
                            variant="filled"
                            sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                          />
                        </TableCell>

                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleToggleExpand(index)}
                          >
                            <Icon
                              icon={
                                expandedRow === index
                                  ? 'mdi:chevron-up'
                                  : 'mdi:chevron-down'
                              }
                              fontSize="1rem"
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Row Details */}
                      <TableRow>
                        <TableCell colSpan={6} sx={{ p: 0 }}>
                          <Collapse
                            in={expandedRow === index}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ p: 2, bgcolor: 'action.hover' }}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  mb: 1,
                                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                }}
                              >
                                Detalle de Productos:
                              </Typography>

                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell
                                      sx={{
                                        fontSize: {
                                          xs: '0.625rem',
                                          sm: '0.75rem',
                                        },
                                      }}
                                    >
                                      Producto
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      sx={{
                                        fontSize: {
                                          xs: '0.625rem',
                                          sm: '0.75rem',
                                        },
                                      }}
                                    >
                                      Cantidad
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      sx={{
                                        fontSize: {
                                          xs: '0.625rem',
                                          sm: '0.75rem',
                                        },
                                      }}
                                    >
                                      Motivo
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      sx={{
                                        fontSize: {
                                          xs: '0.625rem',
                                          sm: '0.75rem',
                                        },
                                      }}
                                    >
                                      Subtotal
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {returnItem.productos.map(
                                    (producto, prodIndex) => (
                                      <TableRow key={prodIndex}>
                                        <TableCell
                                          sx={{
                                            fontSize: {
                                              xs: '0.625rem',
                                              sm: '0.75rem',
                                            },
                                          }}
                                        >
                                          {producto.codigoProducto}
                                        </TableCell>
                                        <TableCell
                                          align="center"
                                          sx={{
                                            fontSize: {
                                              xs: '0.625rem',
                                              sm: '0.75rem',
                                            },
                                          }}
                                        >
                                          {producto.cantidad}
                                        </TableCell>
                                        <TableCell align="center">
                                          <Chip
                                            label={
                                              producto.motivoDevolucion ||
                                              'Sin motivo'
                                            }
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                              fontSize: {
                                                xs: '0.5rem',
                                                sm: '0.625rem',
                                              },
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell
                                          align="right"
                                          sx={{
                                            fontSize: {
                                              xs: '0.625rem',
                                              sm: '0.75rem',
                                            },
                                          }}
                                        >
                                          {formatCurrency(
                                            producto.montoDevolucion,
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ),
                                  )}
                                </TableBody>
                              </Table>

                              {/* Fiscal Summary */}
                              <Box
                                sx={{
                                  mt: 2,
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 2,
                                }}
                              >
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Base Gravable:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontSize: {
                                        xs: '0.625rem',
                                        sm: '0.75rem',
                                      },
                                    }}
                                  >
                                    {formatCurrency(
                                      returnItem.resumenFiscal
                                        .totalBaseGravable,
                                    )}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Descuentos:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontSize: {
                                        xs: '0.625rem',
                                        sm: '0.75rem',
                                      },
                                    }}
                                  >
                                    {formatCurrency(
                                      returnItem.resumenFiscal.totalDescuentos,
                                    )}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Impuestos:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontSize: {
                                        xs: '0.625rem',
                                        sm: '0.75rem',
                                      },
                                    }}
                                  >
                                    {formatCurrency(
                                      returnItem.resumenFiscal.totalImpuestos,
                                    )}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                />
              </Box>
            )}

            {/* Summary Stats */}
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'action.hover',
                borderRadius: 1,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: 'space-around',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Total Devoluciones:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}
                >
                  {returnHistory.length}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Monto Total:
                </Typography>
                <Typography
                  variant="h6"
                  color="success.main"
                  sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}
                >
                  {formatCurrency(
                    returnHistory.reduce(
                      (sum, item) => sum + item.montoDevolucion,
                      0,
                    ),
                  )}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Con CXC:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}
                >
                  {returnHistory.filter((item) => item.movimientoCxc).length}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default ReturnHistoryCard
