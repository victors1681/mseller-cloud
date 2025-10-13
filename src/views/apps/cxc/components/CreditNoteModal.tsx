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
import { createCreditNote, fetchCxcDetail } from 'src/store/apps/cxc'

// ** Types
import { CuentaCxc, NotaCreditoRequest } from 'src/types/apps/cxcTypes'

// ** Utils
import { extractResourceErrorMessage } from 'src/utils/errorUtils'
import formatCurrency from 'src/utils/formatCurrency'

interface CreditNoteModalProps {
  open: boolean
  onClose: () => void
  cxc: CuentaCxc | null
}

const CreditNoteModal: React.FC<CreditNoteModalProps> = ({
  open,
  onClose,
  cxc,
}) => {
  // ** Hooks
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // ** State
  const [isProcessing, setIsProcessing] = useState(false)

  // ** Credit note form validation schema
  const creditNoteSchema = yup.object().shape({
    monto: yup
      .number()
      .required('El monto es requerido')
      .positive('El monto debe ser mayor a 0')
      .max(
        cxc?.saldoPendiente || 0,
        `El monto no puede exceder ${formatCurrency(cxc?.saldoPendiente || 0)}`,
      ),
    motivo: yup.string().optional(),
    observaciones: yup.string().optional(),
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<NotaCreditoRequest>({
    resolver: yupResolver(creditNoteSchema),
    defaultValues: {
      monto: 0,
      motivo: '',
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

  const onSubmitCreditNote = async (data: NotaCreditoRequest) => {
    if (!cxc) return

    console.log('Processing credit note:', {
      cxcId: cxc.id,
      cxcNumero: cxc.numeroCxc,
      creditNoteData: data,
    })

    setIsProcessing(true)
    try {
      // Create credit note using Redux action
      const result = await dispatch(
        createCreditNote({
          cxcId: cxc.id,
          request: data,
        }),
      ).unwrap()

      toast.success(
        `Nota de crédito de ${formatCurrency(
          data.monto,
        )} procesada exitosamente`,
      )
      handleClose()

      // Refresh CXC data to show updated balance
      dispatch(fetchCxcDetail(cxc.numeroCxc))
    } catch (error: any) {
      console.error('Credit note processing error:', error)
      const errorMessage = extractResourceErrorMessage(
        error,
        'la nota de crédito',
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
          <Icon
            icon="mdi:note-edit-outline"
            fontSize="1.5rem"
            color="info.main"
          />
          <Box>
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={600}>
              Crear Nota de Crédito
            </Typography>
            <Typography variant="body2" color="text.secondary">
              CXC: {cxc?.numeroCxc}
            </Typography>
          </Box>
          {isMobile && (
            <IconButton onClick={handleClose} sx={{ ml: 'auto' }} size="small">
              <Icon icon="mdi:close" />
            </IconButton>
          )}
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmitCreditNote)}>
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
                p: 2,
                bgcolor: 'info.light',
                borderRadius: 2,
                border: `1px solid`,
                borderColor: 'info.main',
              }}
            >
              <Typography variant="caption" color="info.main" fontWeight={600}>
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
                    <Typography variant="body2">Nuevo Saldo:</Typography>
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

            {/* Credit Note Amount */}
            <Controller
              name="monto"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Monto de la Nota de Crédito"
                  type="number"
                  fullWidth
                  error={!!errors.monto}
                  helperText={errors.monto?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">RD$</InputAdornment>
                    ),
                    sx: { fontSize: isMobile ? '1.1rem' : '1rem' },
                  }}
                  InputLabelProps={{
                    sx: { fontSize: isMobile ? '0.9rem' : '1rem' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            />

            {/* Credit Note Reason */}
            <Controller
              name="motivo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Motivo (Opcional)"
                  fullWidth
                  placeholder="Ej: Error de facturación, Descuento por cliente frecuente"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon icon="mdi:file-document-edit" fontSize="1.2rem" />
                      </InputAdornment>
                    ),
                    sx: { fontSize: isMobile ? '1rem' : '0.9rem' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            />

            {/* Additional Observations */}
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
                  placeholder="Comentarios adicionales sobre la nota de crédito..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            />

            {/* Warning for Credit Notes */}
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Importante:</strong> La nota de crédito reducirá
                automáticamente el saldo pendiente de esta cuenta por cobrar y
                no podrá ser revertida una vez procesada.
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            p: isMobile ? 2 : 3,
            pt: isMobile ? 1 : 2,
            gap: 1,
          }}
        >
          {!isMobile && (
            <Button
              onClick={handleClose}
              variant="outlined"
              size="large"
              sx={{ minWidth: 120 }}
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            color="info"
            disabled={isProcessing}
            startIcon={
              isProcessing ? (
                <Icon icon="mdi:loading" className="spin" />
              ) : (
                <Icon icon="mdi:note-edit-outline" />
              )
            }
            size="large"
            fullWidth={isMobile}
            sx={{
              minHeight: isMobile ? 48 : 44,
              minWidth: isMobile ? 'auto' : 160,
            }}
          >
            {isProcessing ? 'Procesando...' : 'Crear Nota de Crédito'}
          </Button>
          {isMobile && (
            <Button
              onClick={handleClose}
              variant="outlined"
              fullWidth
              size="large"
              sx={{ minHeight: 48 }}
            >
              Cancelar
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreditNoteModal
