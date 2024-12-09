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
import { FormControlLabel, Grid, Switch } from '@mui/material'
import toast from 'react-hot-toast'
import { use, useEffect, useMemo } from 'react'
import { addUpdateSellerType, toggleSellerAddUpdate } from '@/store/apps/seller'
import CustomAutocomplete from '@/views/ui/customAutocomplete'
import { fetchLocations } from '@/store/apps/location'
import { SellerType } from '@/types/apps/sellerType'

interface AddSellerDrawerType {
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
  codigo: yup
    .string()
    .max(50, 'La condición no debe exceder 50 caracteres')
    .required('El Código requerida'),

  nombre: yup
    .string()
    .max(50, 'La condición no debe exceder 50 caracteres')
    .required('Nombre es requerido'),

  email: yup.string().nullable().email('Correo electrónico inválido'),

  status: yup.string(),
})

const defaultValues = {
  codigo: '',
  nombre: '',
  email: '',
  status: 'A',
  localidad: 1,
}

const AddSellerDrawer = (props: AddSellerDrawerType) => {
  // ** Props
  const { open } = props

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  const store = useSelector((state: RootState) => state.sellers)
  const locationStore = useSelector((state: RootState) => state.locations)
  const toggle = () => dispatch(toggleSellerAddUpdate(null))

  const locationOptions = useMemo(() => {
    return locationStore.data.map((unit) => ({
      label: unit.descripcion,
      value: unit.id ?? '',
    }))
  }, [store])

  useEffect(() => {
    if (locationStore.data.length === 0) {
      dispatch(fetchLocations())
    }
  }, [])

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
  const onSubmit = async (data: SellerType) => {
    try {
      const response = await dispatch(addUpdateSellerType(data)).unwrap()

      if (response.success) {
        toggle()
        reset()
      } else {
        toast.error(response.message || 'Error actualizando la condición')
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Error inesperado al actualizar la condición')
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
        <Typography variant="h6">Agregar Vendedor</Typography>
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
                name="codigo"
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
                name="email"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    placeholder="vendedor@mail.com"
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
                defaultValue="A"
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value === 'A'}
                        onChange={(e) => {
                          onChange(e.target.checked ? 'A' : 'I')
                        }}
                      />
                    }
                    label="Status (Activo/Inactivo)"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomAutocomplete
                name="localidad"
                options={locationOptions}
                control={control}
                label="Localidad"
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

export default AddSellerDrawer
