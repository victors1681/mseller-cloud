// ** React Imports
import { useCallback, useEffect, useState } from 'react'

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

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  clearCalculations,
  clearProcessingResult,
  processItemReturn,
  resetProcessingState,
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

  // ** Effects
  // Reset processCompleted when calculations change (allows retry after error)
  useEffect(() => {
    if (calculations && processCompleted) {
      setProcessCompleted(false)
    }
  }, [calculations, processCompleted])

  // ** Handlers
  const handleProcessReturn = useCallback(async () => {
    if (!selectedDocument || !calculations) return

    // Clear any previous errors before starting
    dispatch(clearProcessingResult())

    const request: ProcesarDevolucionRequest = {
      numeroDocumento: selectedDocument.numeroDocumento,
      productos: calculations.productos.map((producto) => ({
        codigoProducto: producto.codigoProducto,
        cantidad: producto.cantidad,
        motivoDevolucion: producto.motivoDevolucion,
      })),
    }

    try {
      console.log('Processing return with request:', request)
      const result = await dispatch(processItemReturn(request)).unwrap()

      // Success handling
      setProcessCompleted(true)
      setConfirmDialogOpen(false)
      toast.success('Devolución procesada exitosamente')
      onProcessComplete?.(selectedDocument.numeroDocumento)

      // Clear calculated return after successful processing
      setTimeout(() => {
        dispatch(clearCalculations())
      }, 2000)
    } catch (error) {
      console.error('Error processing return:', error)
      setConfirmDialogOpen(false)
      setProcessCompleted(false) // Reset completed state to allow retry

      // Show error toast
      const errorMessage =
        typeof error === 'string' ? error : 'Error al procesar la devolución'
      toast.error(errorMessage)

      // Fallback: ensure processing state is reset after a short delay
      setTimeout(() => {
        dispatch(resetProcessingState())
      }, 100)
    }
  }, [selectedDocument, calculations, dispatch, onProcessComplete])

  const handleOpenConfirmDialog = useCallback(() => {
    // Clear any previous errors when user tries to process again
    dispatch(clearProcessingResult())
    setProcessCompleted(false)
    setConfirmDialogOpen(true)
  }, [dispatch])

  const handleCloseConfirmDialog = useCallback(() => {
    setConfirmDialogOpen(false)
  }, [])

  const canProcess = selectedDocument && calculations && !isProcessing

  // Show process section if we have the requirements
  const showProcessSection = selectedDocument && calculations

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
        {!showProcessSection ? (
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
                  onClose={() => dispatch(clearProcessingResult())}
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    '& .MuiAlert-message': {
                      width: '100%',
                    },
                  }}
                >
                  <Typography variant="inherit" component="div">
                    <strong>Error al procesar la devolución:</strong>
                  </Typography>
                  <Typography
                    variant="inherit"
                    component="div"
                    sx={{ mt: 0.5 }}
                  >
                    {processError}
                  </Typography>
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
                  disabled={isProcessing || (processCompleted && !processError)}
                  startIcon={
                    isProcessing ? (
                      <CircularProgress size={16} />
                    ) : processCompleted && !processError ? (
                      <Icon icon="mdi:check" />
                    ) : processError ? (
                      <Icon icon="mdi:refresh" />
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
                    : processCompleted && !processError
                    ? 'Procesada'
                    : processError
                    ? 'Reintentar'
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
