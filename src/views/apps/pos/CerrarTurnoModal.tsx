// ** React Imports
import { useEffect } from 'react'

// ** MUI Imports
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  IconButton,
  Typography,
  Alert,
} from '@mui/material'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from 'src/store'

// ** Types & Actions
import { CerrarTurnoRequest } from 'src/types/apps/posType'
import { cerrarTurno, toggleCerrarTurnoModal } from 'src/store/apps/pos'

// ** Utils
import toast from 'react-hot-toast'

const schema = yup.object().shape({
  idTurno: yup.string().required('ID de turno es requerido'),
  efectivoCierre: yup
    .number()
    .min(0, 'El efectivo de cierre debe ser mayor o igual a 0')
    .required('Efectivo de cierre es requerido'),
})

const CerrarTurnoModal = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const posStore = useSelector((state: RootState) => state.pos)

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
    watch,
  } = useForm({
    defaultValues: {
      idTurno: '',
      efectivoCierre: 0,
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  // ** Reset form when modal opens and set turno data
  useEffect(() => {
    if (posStore.isCerrarTurnoModalOpen && posStore.turnoActual) {
      reset({
        idTurno: posStore.turnoActual.id,
        efectivoCierre: 0, // User needs to enter the closing amount
      })
    }
  }, [posStore.isCerrarTurnoModalOpen, posStore.turnoActual])

  // ** Handlers
  const onSubmit = async (data: CerrarTurnoRequest) => {
    try {
      const response = await dispatch(cerrarTurno(data)).unwrap()

      if (response.success) {
        toast.success('Turno cerrado exitosamente')
        handleClose()
        reset()
      } else {
        toast.error(response.message || 'Error cerrando turno')
      }
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.data?.message ||
        'Error inesperado al cerrar turno'
      toast.error(errorMessage)
    }
  }

  const onError = (errors: any) => {
    // Show validation errors to user
    const errorMessages = Object.values(errors)
      .map((error: any) => error.message)
      .join(', ')
    toast.error(`Error de validación: ${errorMessages}`)
  }

  const handleClose = () => {
    dispatch(toggleCerrarTurnoModal(null))
    reset()
  }

  const selectedTurno = posStore.turnoActual // Use current turno instead of selected

  return (
    <Dialog
      open={posStore.isCerrarTurnoModalOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Cerrar Turno
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{ color: 'text.primary' }}
          >
            <Icon icon="mdi:close" fontSize={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <DialogContent>
          {selectedTurno && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Turno ID:</strong> {selectedTurno.id}
              </Typography>
              <Typography variant="body2">
                <strong>Vendedor:</strong> {selectedTurno.codigoVendedor}
              </Typography>
              <Typography variant="body2">
                <strong>Efectivo de Apertura:</strong> $
                {selectedTurno.efectivoApertura}
              </Typography>
              <Typography variant="body2">
                <strong>Fecha de Apertura:</strong>{' '}
                {new Date(selectedTurno.fechaApertura).toLocaleString()}
              </Typography>
            </Alert>
          )}

          <Grid container spacing={4}>
            {/* Hidden field for idTurno */}
            <Controller
              name="idTurno"
              control={control}
              render={({ field }) => <input type="hidden" {...field} />}
            />

            <Grid item xs={12}>
              <Controller
                name="efectivoCierre"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Efectivo de Cierre"
                    placeholder="0"
                    error={!!error}
                    helperText={
                      error?.message ||
                      'Ingrese el monto de efectivo al momento del cierre'
                    }
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    InputProps={{
                      startAdornment: '$',
                    }}
                    autoFocus
                  />
                )}
              />
            </Grid>

            {selectedTurno && (
              <Grid item xs={12}>
                <Box
                  sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}
                >
                  <Typography variant="body2" color="textSecondary">
                    <strong>Diferencia:</strong> $
                    {(control._formValues.efectivoCierre || 0) -
                      selectedTurno.efectivoApertura}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <Icon icon="mdi:loading" className="animate-spin" />
              ) : (
                <Icon icon="mdi:close-circle" />
              )
            }
          >
            {isSubmitting ? 'Cerrando...' : 'Cerrar Turno'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CerrarTurnoModal
