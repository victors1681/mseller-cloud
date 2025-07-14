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
import {
  FormControlLabel,
  Grid,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import toast from 'react-hot-toast'
import { use, useEffect, useMemo } from 'react'
import {
  addUpdateLegacyOffer,
  toggleAddUpdateLegacyOffer,
} from '@/store/apps/offers'
import { LegacyOfferType } from '@/types/apps/offerType'

interface AddLegacyOfferDrawerType {
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
  idOferta: yup.number().min(0, 'ID debe ser mayor o igual a 0'),

  nombre: yup
    .string()
    .max(100, 'El nombre no debe exceder 100 caracteres')
    .required('Nombre es requerido'),

  descripcion: yup
    .string()
    .max(500, 'La descripción no debe exceder 500 caracteres')
    .required('Descripción es requerida'),

  tipoOferta: yup
    .string()
    .oneOf(['0', '1', '3'], 'Debe seleccionar un tipo de oferta válido')
    .required('Tipo de oferta es requerido'),

  condicionPago: yup.string().nullable(),

  fechaInicio: yup.string().required('Fecha de inicio es requerida'),

  fechaFin: yup.string().required('Fecha de fin es requerida'),

  clasificacion: yup
    .string()
    .max(50, 'La clasificación no debe exceder 50 caracteres')
    .required('Clasificación es requerida'),

  status: yup.boolean().required('Status es requerido'),
})

const defaultValues: LegacyOfferType = {
  idOferta: 0,
  nombre: '',
  descripcion: '',
  tipoOferta: '0',
  condicionPago: null,
  fechaInicio: '',
  fechaFin: '',
  clasificacion: '',
  status: true,
  detalle: [],
}

const AddLegacyOfferDrawer = (props: AddLegacyOfferDrawerType) => {
  // ** Props
  const { open } = props

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  const store = useSelector((state: RootState) => state.offers)
  const toggle = () => dispatch(toggleAddUpdateLegacyOffer(null))

  useEffect(() => {
    if (store.legacyOfferEditData) {
      reset(store.legacyOfferEditData)
    } else {
      reset(defaultValues)
    }
  }, [store.legacyOfferEditData])

  const { reset, control, handleSubmit } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  })
  const onSubmit = async (data: LegacyOfferType) => {
    try {
      const response = await dispatch(addUpdateLegacyOffer(data)).unwrap()

      if (response.success) {
        toggle()
        reset()
      } else {
        toast.error(response.message || 'Error actualizando la oferta')
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Error inesperado al actualizar la oferta')
    }
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
        <Typography variant="h6">Agregar Oferta</Typography>
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
                name="idOferta"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="ID Oferta"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="nombre"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nombre"
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
                    multiline
                    rows={3}
                    label="Descripción"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="tipoOferta"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error}>
                    <InputLabel id="tipo-oferta-label">
                      Tipo de Oferta
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="tipo-oferta-label"
                      label="Tipo de Oferta"
                    >
                      <MenuItem value="0">0 - Escala</MenuItem>
                      <MenuItem value="1">1 - Promoción</MenuItem>
                      <MenuItem value="3">3 - Mixta</MenuItem>
                    </Select>
                    {error && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ ml: 2, mt: 0.5 }}
                      >
                        {error.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="condicionPago"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Condición de Pago"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="fechaInicio"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Fecha de Inicio"
                    InputLabelProps={{ shrink: true }}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="fechaFin"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Fecha de Fin"
                    InputLabelProps={{ shrink: true }}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="clasificacion"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Clasificación"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="status"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={(e) => {
                          onChange(e.target.checked)
                        }}
                      />
                    }
                    label="Status (Activo/Inactivo)"
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

export default AddLegacyOfferDrawer
