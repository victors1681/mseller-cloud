// ** React Imports
import { useCallback, useState } from 'react'

// ** MUI Imports
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
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
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  clearCalculations,
  processItemReturn,
} from 'src/store/apps/itemReturns'

// ** Utils
import { formatCurrency } from 'src/utils/formatCurrency'

// ** Types
import { ProcesarDevolucionRequest } from 'src/types/apps/itemReturnsTypes'

interface ReturnProcessingCardProps {
  onProcessComplete?: (numeroDocumento: string) => void
}

const ReturnProcessingCard = ({
  onProcessComplete,
}: ReturnProcessingCardProps) => {
  // ** State
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [processCompleted, setProcessCompleted] = useState(false)

  // ** Redux
  const dispatch = useDispatch<AppDispatch>()
  const {
    selectedDocument,
    calculations,
    isProcessing,
    processError,
    processingResult,
  } = useSelector((state: RootState) => state.itemReturns)

  // ** Handlers
  const handleProcessReturn = useCallback(async () => {
    if (!selectedDocument || !calculations) return

    const request: ProcesarDevolucionRequest = {
      numeroDocumento: selectedDocument.numeroDocumento,
      productos: calculations.productos.map((producto) => ({
        codigoProducto: producto.codigoProducto,
        cantidad: producto.cantidad,
        motivoDevolucion: producto.motivoDevolucion,
      })),
    }

    try {
      await dispatch(processItemReturn(request)).unwrap()
      setProcessCompleted(true)
      setConfirmDialogOpen(false)
      onProcessComplete?.(selectedDocument.numeroDocumento)

      // Clear calculated return after successful processing
      setTimeout(() => {
        dispatch(clearCalculations())
      }, 2000)
    } catch (error) {
      // Error is handled by Redux
      setConfirmDialogOpen(false)
    }
  }, [selectedDocument, calculations, dispatch, onProcessComplete])

  const handleOpenConfirmDialog = useCallback(() => {
    setConfirmDialogOpen(true)
  }, [])

  const handleCloseConfirmDialog = useCallback(() => {
    setConfirmDialogOpen(false)
  }, [])

  const canProcess = selectedDocument && calculations && !isProcessing

  return (
    <Card>
      <CardHeader
        title={
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
          >
            Procesar Devolución
          </Typography>
        }
        subheader={
          <Typography
            variant="body2"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Confirma y procesa la devolución calculada
          </Typography>
        }
      />

      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {!canProcess ? (
          <Alert
            severity="info"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon icon="mdi:information" />
              <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
                Primero calcula la devolución para poder procesarla
              </Typography>
            </Box>
          </Alert>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Processing Status */}
            {processCompleted && (
              <Grid item xs={12}>
                <Alert
                  severity="success"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon icon="mdi:check-circle" />
                    <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
                      <strong>¡Devolución procesada exitosamente!</strong>
                    </Typography>
                  </Box>
                </Alert>
              </Grid>
            )}

            {/* Error Display */}
            {processError && (
              <Grid item xs={12}>
                <Alert
                  severity="error"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  {processError}
                </Alert>
              </Grid>
            )}

            {/* Return Summary */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  Resumen de la Devolución
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Documento:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                    >
                      {calculations.numeroDocumento}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Monto Total:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        color: 'success.main',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}
                    >
                      {formatCurrency(calculations.montoDevolucion)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Productos:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      {calculations.productos.length} artículo(s)
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Base Gravable:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      {formatCurrency(
                        calculations.resumenFiscal.totalBaseGravable,
                      )}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Products Table */}
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  Productos a Devolver:
                </Typography>

                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{ mb: 2 }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                        >
                          Producto
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                        >
                          Cantidad
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                        >
                          Motivo
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                        >
                          Monto
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {calculations.productos.map((producto, index) => (
                        <TableRow key={index}>
                          <TableCell
                            sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                          >
                            {producto.codigoProducto}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                          >
                            {producto.cantidad}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={producto.motivoDevolucion || 'Sin motivo'}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: { xs: '0.5rem', sm: '0.625rem' },
                              }}
                            />
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                          >
                            {formatCurrency(producto.montoDevolucion)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* CXC Movement Info */}
                {calculations.movimientoCxc && (
                  <Alert
                    severity="info"
                    sx={{
                      mt: 1,
                      fontSize: { xs: '0.625rem', sm: '0.75rem' },
                    }}
                  >
                    <Typography variant="caption" sx={{ fontSize: 'inherit' }}>
                      <strong>Información CXC:</strong> Se generará un
                      movimiento en la cuenta por cobrar del cliente.
                    </Typography>
                  </Alert>
                )}
              </Box>
            </Grid>

            {/* Process Button */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', sm: 'flex-end' },
                  gap: { xs: 1, sm: 2 },
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenConfirmDialog}
                  disabled={isProcessing || processCompleted}
                  startIcon={
                    isProcessing ? (
                      <CircularProgress size={16} />
                    ) : processCompleted ? (
                      <Icon icon="mdi:check" />
                    ) : (
                      <Icon icon="mdi:send" />
                    )
                  }
                  size="small"
                  sx={{
                    minWidth: { xs: '100%', sm: 'auto' },
                  }}
                >
                  {isProcessing
                    ? 'Procesando...'
                    : processCompleted
                    ? 'Procesada'
                    : 'Procesar Devolución'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={handleCloseConfirmDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon icon="mdi:alert-circle" color="warning.main" />
              <Typography variant="h6">Confirmar Procesamiento</Typography>
            </Box>
          </DialogTitle>

          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>¡Atención!</strong> Esta acción no se puede deshacer.
              </Typography>
            </Alert>

            <Typography variant="body2" paragraph>
              ¿Está seguro que desea procesar la devolución del documento{' '}
              <strong>{selectedDocument?.numeroDocumento}</strong> por un monto
              de{' '}
              <strong>
                {calculations && formatCurrency(calculations.montoDevolucion)}
              </strong>
              ?
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Una vez procesada:
            </Typography>
            <Box component="ul" sx={{ mt: 1, pl: 2 }}>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Se actualizará el inventario con los productos devueltos
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Se generará un movimiento en CXC si aplica
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Se registrará el historial de la devolución
                </Typography>
              </li>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} disabled={isProcessing}>
              Cancelar
            </Button>
            <Button
              onClick={handleProcessReturn}
              variant="contained"
              color="primary"
              disabled={isProcessing}
              startIcon={
                isProcessing ? (
                  <CircularProgress size={16} />
                ) : (
                  <Icon icon="mdi:check" />
                )
              }
            >
              {isProcessing ? 'Procesando...' : 'Confirmar'}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default ReturnProcessingCard
