// ** React Imports
import React, { useState } from 'react'

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
import { createDebitNote, fetchCxcDetail } from 'src/store/apps/cxc'

// ** Types
import {
  CuentaCxc,
  NotaDebitoRequest,
  TipoDocumento,
} from 'src/types/apps/cxcTypes'

// ** Utils
import { extractResourceErrorMessage } from 'src/utils/errorUtils'
import formatCurrency from 'src/utils/formatCurrency'

interface DebitNoteModalProps {
  open: boolean
  onClose: () => void
  cxc: CuentaCxc | null
}

const DebitNoteModal: React.FC<DebitNoteModalProps> = ({
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

  // ** Check if document is an invoice (debit notes can only be applied to invoices)
  const isInvoice = cxc?.tipoDocumento === TipoDocumento.Invoice

  // ** Debit note form validation schema
  const debitNoteSchema = yup.object().shape({
    monto: yup
      .number()
      .required('El monto es requerido')
      .positive('El monto debe ser mayor a 0'),
    motivo: yup.string().required('El motivo es requerido'),
    observaciones: yup.string().optional(),
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<NotaDebitoRequest>({
    resolver: yupResolver(debitNoteSchema),
    defaultValues: {
      monto: 0,
      motivo: '',
      observaciones: '',
    },
  })

  // ** Watch form values
  const watchedAmount = watch('monto')
  const newBalance = (cxc?.saldoPendiente || 0) + (watchedAmount || 0)

  // ** Handlers
  const handleClose = () => {
    onClose()
    reset()
  }

  const onSubmitDebitNote = async (data: NotaDebitoRequest) => {
    if (!cxc) return

    console.log('Processing debit note:', {
      cxcId: cxc.id,
      cxcNumero: cxc.numeroCxc,
      debitNoteData: data,
    })

    setIsProcessing(true)
    try {
      // Create debit note using Redux action
      const result = await dispatch(
        createDebitNote({
          cxcId: cxc.id,
          request: data,
        }),
      ).unwrap()

      toast.success(
        `Nota de débito de ${formatCurrency(
          data.monto,
        )} procesada exitosamente`,
      )
      handleClose()

      // Refresh CXC data to show updated balance
      dispatch(fetchCxcDetail(cxc.numeroCxc))
    } catch (error: any) {
      console.error('Debit note processing error:', error)
      const errorMessage = extractResourceErrorMessage(
        error,
        'la nota de débito',
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
            icon="mdi:note-plus-outline"
            fontSize="1.5rem"
            style={{ color: theme.palette.warning.main }}
          />
          <Box>
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={600}>
              Crear Nota de Débito
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

      <form onSubmit={handleSubmit(onSubmitDebitNote)}>
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
                    ? 'rgba(255, 152, 0, 0.08)'
                    : 'rgba(255, 152, 0, 0.04)',
                borderRadius: 2,
                border: `1px solid`,
                borderColor: 'warning.main',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <Typography
                variant="caption"
                color="warning.main"
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
                  <Typography variant="body2">Saldo Actual:</Typography>
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
                      color="error.main"
                    >
                      {formatCurrency(newBalance)}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>

            {/* Debit Note Amount */}
            <Controller
              name="monto"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Monto de la Nota de Débito"
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

            {/* Debit Note Reason */}
            <Controller
              name="motivo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Motivo"
                  fullWidth
                  error={!!errors.motivo}
                  helperText={errors.motivo?.message}
                  placeholder="Ej: Cargos adicionales, Intereses por mora, Ajuste de precio"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon icon="mdi:file-document-edit" fontSize="1.2rem" />
                      </InputAdornment>
                    ),
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
                  placeholder="Comentarios adicionales sobre la nota de débito..."
                />
              )}
            />

            {/* Document Type Validation Warning */}
            {!isInvoice && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Error:</strong> Las notas de débito solo pueden
                  aplicarse a facturas (invoices). Este documento es de tipo:{' '}
                  <strong>{cxc?.tipoDocumento}</strong>
                </Typography>
              </Alert>
            )}

            {/* Warning for Debit Notes */}
            {isInvoice && (
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Importante:</strong> La nota de débito aumentará
                  automáticamente el saldo pendiente de esta cuenta por cobrar y
                  no podrá ser revertida una vez procesada.
                </Typography>
              </Alert>
            )}
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
            variant="outlined"
            onClick={handleClose}
            disabled={isProcessing}
            fullWidth={isMobile}
            sx={{
              height: isMobile ? 44 : 'auto',
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isProcessing || !isInvoice}
            fullWidth={isMobile}
            color="warning"
            startIcon={
              isProcessing ? null : <Icon icon="mdi:note-plus-outline" />
            }
            sx={{
              height: isMobile ? 44 : 'auto',
            }}
          >
            {isProcessing ? 'Procesando...' : 'Crear Nota de Débito'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default DebitNoteModal
