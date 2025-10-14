// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import * as yup from 'yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { AppDispatch } from 'src/store'
import { fetchCxcDetail, processPayment } from 'src/store/apps/cxc'

// ** Types
import { CuentaCxc, PagoRequest } from 'src/types/apps/cxcTypes'

// ** Utils
import { extractResourceErrorMessage } from 'src/utils/errorUtils'
import formatCurrency from 'src/utils/formatCurrency'

interface PaymentModalProps {
  open: boolean
  onClose: () => void
  cxc: CuentaCxc | null
}

const PaymentModal: React.FC<PaymentModalProps> = ({ open, onClose, cxc }) => {
  // ** Hooks
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // ** State
  const [isProcessing, setIsProcessing] = useState(false)

  // ** Payment form validation schema
  const paymentSchema = yup.object().shape({
    monto: yup
      .number()
      .required('El monto es requerido')
      .positive('El monto debe ser mayor a 0')
      .max(
        cxc?.saldoPendiente || 0,
        `El monto no puede exceder ${formatCurrency(cxc?.saldoPendiente || 0)}`,
      ),
    numeroReferencia: yup.string().optional(),
    observaciones: yup.string().optional(),
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<PagoRequest>({
    resolver: yupResolver(paymentSchema),
    defaultValues: {
      monto: 0,
      numeroReferencia: '',
      observaciones: '',
    },
  })

  // ** Watch form values
  const watchedAmount = watch('monto')
  const remainingBalance = (cxc?.saldoPendiente || 0) - (watchedAmount || 0)

  // ** Handlers
  const handleClose = () => {
    onClose()
    reset()
  }

  const onSubmitPayment = async (data: PagoRequest) => {
    if (!cxc) return

    console.log('Processing payment:', {
      cxcId: cxc.id,
      cxcNumero: cxc.numeroCxc,
      paymentData: data,
    })

    setIsProcessing(true)
    try {
      // Process payment using Redux action
      const result = await dispatch(
        processPayment({
          cxcId: cxc.id,
          request: data,
        }),
      ).unwrap()
      toast.success(
        `Pago de ${formatCurrency(data?.monto)} procesado exitosamente`,
      )
      handleClose()

      // Refresh CXC data to show updated balance
      dispatch(fetchCxcDetail(cxc.numeroCxc))
    } catch (error: any) {
      console.error('Payment processing error:', error)
      const errorMessage = extractResourceErrorMessage(
        error,
        'el pago',
        'create',
      )
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          margin: isMobile ? 0 : 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          p: isMobile ? 2 : 3,
          pb: isMobile ? 1 : 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Icon icon="mdi:cash" fontSize="1.5rem" color="success.main" />
          <Box>
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={600}>
              Registrar Pago
            </Typography>
            <Typography variant="body2" color="text.secondary">
              CXC: {cxc?.numeroCxc}
            </Typography>
          </Box>
          {isMobile && (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton onClick={handleClose} sx={{ ml: 1 }} size="small">
                <Icon icon="mdi:close" />
              </IconButton>
            </>
          )}
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmitPayment)}>
        <DialogContent
          sx={{
            p: isMobile ? 2 : 3,
            pt: isMobile ? 1 : 2,
          }}
        >
          <Stack spacing={3}>
            {/* Balance Information */}
            <Box
              sx={{
                p: 2.5,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(145, 85, 253, 0.08)'
                    : 'rgba(145, 85, 253, 0.04)',
                borderRadius: 2,
                border: `1px solid`,
                borderColor: 'primary.main',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <Typography
                variant="caption"
                color="primary.main"
                fontWeight={600}
                sx={{
                  letterSpacing: '0.5px',
                  fontSize: isMobile ? '0.7rem' : '0.75rem',
                }}
              >
                INFORMACIÓN DE SALDO
              </Typography>
              <Stack spacing={1} mt={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Saldo Pendiente:</Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="error.main"
                  >
                    {formatCurrency(cxc?.saldoPendiente || 0)}
                  </Typography>
                </Stack>
                {watchedAmount > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Saldo Restante:</Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color={
                        remainingBalance <= 0 ? 'success.main' : 'warning.main'
                      }
                    >
                      {formatCurrency(remainingBalance)}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>

            {/* Payment Amount */}
            <Controller
              name="monto"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Monto del Pago"
                  type="number"
                  fullWidth
                  error={!!errors.monto}
                  helperText={errors.monto?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">RD$</InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Reference Number */}
            <Controller
              name="numeroReferencia"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Número de Referencia (Opcional)"
                  fullWidth
                  placeholder="Ej: REF-12345, CHEQUE-001"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon icon="mdi:receipt" fontSize="1.2rem" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Observations */}
            <Controller
              name="observaciones"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Observaciones (Opcional)"
                  multiline
                  rows={isMobile ? 2 : 3}
                  fullWidth
                  placeholder="Comentarios adicionales sobre el pago..."
                />
              )}
            />

            {/* Payment Information Alert */}
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Información:</strong> El pago será registrado
                inmediatamente y actualizará el saldo pendiente de esta cuenta
                por cobrar.
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            p: isMobile ? 2 : 3,
            pt: isMobile ? 1 : 2,
            gap: 1,
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={isProcessing}
            startIcon={
              isProcessing ? (
                <Icon icon="mdi:loading" className="spin" />
              ) : (
                <Icon icon="mdi:cash" />
              )
            }
            size="large"
            fullWidth={isMobile}
          >
            {isProcessing ? 'Procesando...' : 'Procesar Pago'}
          </Button>
          <Button
            onClick={handleClose}
            variant="outlined"
            size="large"
            fullWidth={isMobile}
            sx={isMobile ? { mr: 2, mt: 1 } : undefined}
          >
            Cancelar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default PaymentModal
