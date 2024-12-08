// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { CondicionPagoType } from 'src/types/apps/paymentTypeTypes'
import {
  addUpdatePaymentType,
  togglePaymentTypeAddUpdate,
} from '@/store/apps/paymentType'
import { Grid } from '@mui/material'
import toast from 'react-hot-toast'
import { use, useEffect } from 'react'

interface AddPaymentTypeDrawerType {
  open: boolean
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default,
}))

const schema = yup.object().shape({
  condicionPago: yup
    .string()
    .max(50, 'La condición no debe exceder 50 caracteres')
    .required('El Código requerida'),

  dias: yup
    .number()
    .typeError('Los días deben ser un número')
    .required('Los días son requeridos')
    .min(0, 'Los días no pueden ser negativos')
    .integer('Debe ser un número entero'),

  tipo_condicion: yup.string().required('El tipo de condición es requerido'),

  descripcion: yup
    .string()
    .required('La descripción es requerida')
    .max(200, 'La descripción no debe exceder 200 caracteres'),
})

const defaultValues = {
  id: 0,
  condicionPago: '',
  dias: 0,
  tipo_condicion: '',
  descripcion: '',
}

const AddPaymentTypeDrawer = (props: AddPaymentTypeDrawerType) => {
  // ** Props
  const { open } = props

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  const store = useSelector((state: RootState) => state.paymentTypes)
  const toggle = () => dispatch(togglePaymentTypeAddUpdate(null))

  useEffect(() => {
    if (store.editData) {
      reset(store.editData)
    } else {
      reset(defaultValues)
    }
  }, [store.editData])

  const { reset, control, handleSubmit } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  })
  const onSubmit = async (data: CondicionPagoType) => {
    try {
      const response = await dispatch(addUpdatePaymentType(data)).unwrap()

      if (response.success) {
        toggle()
      } else {
        toast.error(response.message || 'Error actualizando la condición')
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Error inesperado al actualizar la condición')
    }

    reset()
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } },
      }}
    >
      <Header>
        <Typography variant="h6">Agregar Condición de Pago</Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ color: 'text.primary' }}
        >
          <Icon icon="mdi:close" fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Controller
                name="condicionPago"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Código"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="tipo_condicion"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Tipo Condición"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="descripcion"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Descripción"
                    placeholder="Crédigo 15 Días"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="dias"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Días de crédito"
                    placeholder='Si es de contado, escriba "0"'
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{ mr: 3 }}
                >
                  Grabar
                </Button>
                <Button
                  size="large"
                  variant="outlined"
                  color="secondary"
                  onClick={handleClose}
                >
                  Cancelar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Drawer>
  )
}

export default AddPaymentTypeDrawer
