import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { AppDispatch, RootState } from 'src/store'
import { fetchPaymentType } from 'src/store/apps/paymentType'
import { EstadoPago, TipoPago } from 'src/types/apps/documentTypes'
import { POSCartItem, POSCustomer } from 'src/types/apps/posTypes'
import formatCurrency from 'src/utils/formatCurrency'

const StyledPaymentCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  border: `2px solid transparent`,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)',
  },
  '&.selected': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light + '10',
  },
}))

const StyledSummarySection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}))

interface POSPaymentDialogProps {
  open: boolean
  customer: POSCustomer | null
  cart: POSCartItem[]
  totals: {
    subtotal: number
    descuentoTotal: number
    impuestoTotal: number
    total: number
  }
  onClose: () => void
  onProcessPayment: (paymentData: any) => void
  isProcessing: boolean
}

const POSPaymentDialog: React.FC<POSPaymentDialogProps> = ({
  open,
  customer,
  cart,
  totals,
  onClose,
  onProcessPayment,
  isProcessing,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useDispatch<AppDispatch>()

  // Get payment types from Redux store
  const paymentTypesFromStore = useSelector(
    (state: RootState) => state.paymentTypes.data,
  )
  const isLoadingFromStore = useSelector(
    (state: RootState) => state.paymentTypes.isLoading,
  )

  const [selectedPaymentType, setSelectedPaymentType] = useState<string>('')
  const [amountReceived, setAmountReceived] = useState<string>(
    totals.total.toString(),
  )
  const [notes, setNotes] = useState('')
  const [paymentReference, setPaymentReference] = useState('')

  useEffect(() => {
    if (open) {
      // Load payment types if not already loaded
      if (!paymentTypesFromStore || paymentTypesFromStore.length === 0) {
        dispatch(fetchPaymentType({ query: '', pageNumber: 1 }))
      }
      setAmountReceived(totals.total.toString())
    }
  }, [open, totals.total, paymentTypesFromStore, dispatch])

  // Auto-select first payment type when data loads
  useEffect(() => {
    if (
      paymentTypesFromStore &&
      paymentTypesFromStore.length > 0 &&
      !selectedPaymentType
    ) {
      setSelectedPaymentType(paymentTypesFromStore[0].condicionPago)
    }
  }, [paymentTypesFromStore, selectedPaymentType])

  const getPaymentIcon = (paymentType: string): string => {
    switch (paymentType) {
      case 'EFECTIVO':
        return 'mdi:cash'
      case 'TRANSFERENCIA':
        return 'mdi:bank-transfer'
      case 'TARJETA':
        return 'mdi:credit-card'
      case 'CHEQUE':
        return 'mdi:checkbook'
      default:
        return 'mdi:credit-card-outline'
    }
  }

  const calculateChange = (): number => {
    const received = parseFloat(amountReceived) || 0
    return Math.max(0, received - totals.total)
  }

  // Map condicionPago to TipoPago enum
  const mapCondicionPagoToTipoPago = (condicionPago: string): number => {
    const upperCondicion = condicionPago.toUpperCase()
    if (
      upperCondicion.includes('EFECTIVO') ||
      upperCondicion.includes('CASH')
    ) {
      return TipoPago.Efectivo
    }
    if (
      upperCondicion.includes('TARJETA') ||
      upperCondicion.includes('CREDITO')
    ) {
      return TipoPago.Credito
    }
    if (upperCondicion.includes('DEBITO')) {
      return TipoPago.Debito
    }
    if (
      upperCondicion.includes('TRANSFERENCIA') ||
      upperCondicion.includes('TRANSFER')
    ) {
      return TipoPago.Transferencia
    }
    if (upperCondicion.includes('CHEQUE') || upperCondicion.includes('CHECK')) {
      return TipoPago.Cheque
    }
    // Default to efectivo
    return TipoPago.Efectivo
  }

  const isValidPayment = (): boolean => {
    if (!selectedPaymentType) return false
    //if (!customer) return false // use customer MOST

    const received = parseFloat(amountReceived) || 0
    const selectedType = paymentTypesFromStore?.find(
      (pt) => pt.condicionPago === selectedPaymentType,
    )

    // For cash payments, received amount must be >= total
    if (
      selectedType?.tipo_condicion === 'CONTADO' &&
      selectedPaymentType === 'EFECTIVO'
    ) {
      return received >= totals.total
    }

    // For other payment types, any positive amount is valid
    return received > 0
  }

  const handleProcessPayment = () => {
    if (!isValidPayment()) return

    const selectedType = paymentTypesFromStore?.find(
      (pt) => pt.condicionPago === selectedPaymentType,
    )
    const amountReceivedNum = parseFloat(amountReceived)
    const changeAmount = calculateChange()

    const paymentData = {
      customer,
      cart,
      totals,
      paymentType: selectedType,
      paymentTypes: paymentTypesFromStore,
      amountReceived: amountReceivedNum,
      change: changeAmount,
      notes,
      paymentReference,
      timestamp: new Date().toISOString(),
      // POS specific fields
      tipoPago: mapCondicionPagoToTipoPago(selectedPaymentType),
      estadoPago: EstadoPago.Paid,
      montoRecibido: amountReceivedNum,
      montoDevuelto: changeAmount,
    }

    onProcessPayment(paymentData)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon icon="mdi:cash-register" />
            <Typography variant="h6">Procesar Pago</Typography>
          </Box>
          <IconButton onClick={onClose} disabled={isProcessing}>
            <Icon icon="mdi:close" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Customer Info */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent sx={{ py: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Cliente:
                </Typography>
                <Typography variant="body2">
                  {customer?.isNew
                    ? customer.tempData?.nombre
                    : customer?.customer?.nombre || 'Cliente Mostrador'}
                </Typography>
                {customer?.customer?.codigo && (
                  <Typography variant="caption" color="text.secondary">
                    Código: {customer.customer.codigo}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={6}>
            <StyledSummarySection>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Resumen del Pedido
              </Typography>

              <List dense sx={{ mb: 2 }}>
                {cart.slice(0, 3).map((item) => (
                  <ListItem key={item.id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          {item.cantidad}x {item.producto.nombre}
                        </Typography>
                      }
                      secondary={item.producto.codigo}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(item.subtotal)}
                    </Typography>
                  </ListItem>
                ))}
                {cart.length > 3 && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: 'italic' }}
                        >
                          Y {cart.length - 3} productos más...
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              </List>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2">
                  {formatCurrency(totals.subtotal)}
                </Typography>
              </Box>

              {totals.descuentoTotal > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="error">
                    Descuento:
                  </Typography>
                  <Typography variant="body2" color="error">
                    -{formatCurrency(totals.descuentoTotal)}
                  </Typography>
                </Box>
              )}

              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant="body2">ITBIS:</Typography>
                <Typography variant="body2">
                  {formatCurrency(totals.impuestoTotal)}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Total:
                </Typography>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  {formatCurrency(totals.total)}
                </Typography>
              </Box>
            </StyledSummarySection>
          </Grid>

          {/* Payment Method Selection */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Método de Pago
            </Typography>

            {isLoadingFromStore ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  py: 4,
                }}
              >
                <CircularProgress size={32} />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {paymentTypesFromStore?.map((paymentType) => (
                  <Grid item xs={6} sm={4} md={6} key={paymentType.id}>
                    <StyledPaymentCard
                      className={
                        selectedPaymentType === paymentType.condicionPago
                          ? 'selected'
                          : ''
                      }
                      onClick={() =>
                        !isProcessing &&
                        setSelectedPaymentType(paymentType.condicionPago)
                      }
                      sx={{
                        pointerEvents: isProcessing ? 'none' : 'auto',
                        opacity: isProcessing ? 0.6 : 1,
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Icon
                          icon={getPaymentIcon(paymentType.condicionPago)}
                          fontSize={32}
                          color={
                            selectedPaymentType === paymentType.condicionPago
                              ? theme.palette.primary.main
                              : theme.palette.text.secondary
                          }
                        />
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ mt: 1 }}
                        >
                          {paymentType.descripcion}
                        </Typography>
                      </CardContent>
                    </StyledPaymentCard>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Payment Details */}
            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Monto Recibido"
                type="number"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                sx={{ mb: 2 }}
                inputProps={{ min: 0, step: 0.01 }}
                disabled={isProcessing}
              />

              {selectedPaymentType === 'EFECTIVO' && (
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: theme.palette.success.light + '10',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Cambio: {formatCurrency(calculateChange())}
                  </Typography>
                </Card>
              )}

              {(selectedPaymentType === 'TRANSFERENCIA' ||
                selectedPaymentType === 'CHEQUE') && (
                <TextField
                  fullWidth
                  label="Referencia/Número"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  sx={{ mb: 2 }}
                  disabled={isProcessing}
                />
              )}

              <TextField
                fullWidth
                label="Notas (opcional)"
                multiline
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isProcessing}
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          disabled={isProcessing}
          size="large"
          variant="outlined"
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleProcessPayment}
          disabled={!isValidPayment() || isProcessing}
          size="large"
          sx={{
            minWidth: 180,
            position: 'relative',
          }}
        >
          {isProcessing ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              <span>Procesando...</span>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon icon="mdi:cash-check" />
              <span>Confirmar Pago</span>
            </Box>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default POSPaymentDialog
