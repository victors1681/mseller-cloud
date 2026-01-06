// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Autocomplete from '@mui/material/Autocomplete'
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import {
  addSecuenciaECF,
  toggleSecuenciaECFAddUpdate,
  updateSecuenciaECF,
} from 'src/store/apps/ecf'

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'
import { tipoClienteOptions } from 'src/utils/tipoClienteOptions'

interface SidebarAddSecuenciaType {
  open: boolean
}

interface SecuenciaFormData {
  tipoCliente: string
  descripcion: string
  encabezado: string
  secuenciaIni: number
  secuenciaFin: number
  secuencia: number
  vencimiento: string
  habilitado: boolean
  entorno: string
  esElectronico: boolean
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between',
}))

const schema = yup.object().shape({
  tipoCliente: yup.string().required('Tipo de cliente es requerido'),
  descripcion: yup.string().required('Descripción es requerida'),
  encabezado: yup.string().required('Encabezado es requerido'),
  secuenciaIni: yup
    .number()
    .required('Secuencia inicial es requerida')
    .min(1, 'Debe ser mayor a 0'),
  secuenciaFin: yup
    .number()
    .required('Secuencia final es requerida')
    .min(1, 'Debe ser mayor a 0'),
  secuencia: yup
    .number()
    .required('Secuencia actual es requerida')
    .min(1, 'Debe ser mayor a 0'),
  vencimiento: yup.string(),
  entorno: yup.string().required('Entorno es requerido'),
})

const defaultValues: SecuenciaFormData = {
  tipoCliente: '',
  descripcion: '',
  encabezado: '',
  secuenciaIni: 0,
  secuenciaFin: 0,
  secuencia: 0,
  vencimiento: '',
  habilitado: true,
  entorno: '',
  esElectronico: true,
}

const AddSecuenciaECFDrawer = (props: SidebarAddSecuenciaType) => {
  // ** Props
  const { open } = props

  // ** State
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.ecf)

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (store.secuenciaEditData) {
      const editData = store.secuenciaEditData
      setValue('tipoCliente', editData.tipoCliente)
      setValue('descripcion', editData.descripcion)
      setValue('encabezado', editData.encabezado)
      setValue('secuenciaIni', editData.secuenciaIni)
      setValue('secuenciaFin', editData.secuenciaFin)
      setValue('secuencia', editData.secuencia)
      setValue(
        'vencimiento',
        editData.vencimiento ? editData.vencimiento.split('T')[0] : '',
      ) // Format for date input
      setValue('habilitado', editData.habilitado)
      setValue('entorno', editData.entorno || '')
      setValue('esElectronico', editData.esElectronico)
    } else {
      reset(defaultValues)
    }
  }, [store.secuenciaEditData, setValue, reset])

  const onSubmit = async (data: SecuenciaFormData) => {
    setIsSubmitting(true)

    const formattedData = {
      ...data,
      vencimiento: data.vencimiento
        ? new Date(data.vencimiento).toISOString()
        : undefined,
      businessId: store.secuenciaEditData?.businessId || '',
      vendedor: store.secuenciaEditData?.vendedor || 'MSELLER', // Default vendedor value
    }

    if (store.secuenciaEditData) {
      // Update existing
      await dispatch(
        updateSecuenciaECF({
          ...formattedData,
          id: store.secuenciaEditData.id,
          businessId: store.secuenciaEditData.businessId,
          vendedor: store.secuenciaEditData.vendedor,
        }),
      )
    } else {
      // Create new
      await dispatch(addSecuenciaECF(formattedData))
    }

    setIsSubmitting(false)
  }

  const handleClose = () => {
    reset(defaultValues)
    dispatch(toggleSecuenciaECFAddUpdate(null))
  }

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant="h6">
          {store.secuenciaEditData ? 'Editar' : 'Crear'} Secuencia eCF
        </Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ borderRadius: 1, color: 'text.primary' }}
        >
          <Icon icon="tabler:x" fontSize="1.125rem" />
        </IconButton>
      </Header>
      <Box sx={{ p: 6 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="tipoCliente"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  freeSolo
                  options={tipoClienteOptions}
                  getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option.label
                  }
                  value={
                    tipoClienteOptions.find((opt) => opt.value === value) ||
                    value
                  }
                  onChange={(_, newValue) => {
                    if (typeof newValue === 'string') {
                      onChange(newValue)
                    } else if (newValue && typeof newValue === 'object') {
                      onChange(newValue.value)
                    } else {
                      onChange('')
                    }
                  }}
                  onInputChange={(_, newInputValue) => {
                    // Only update the value when freeSolo mode is used (typing custom values)
                    if (
                      !tipoClienteOptions.find(
                        (opt) => opt.label === newInputValue,
                      )
                    ) {
                      onChange(newInputValue)
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tipo Cliente"
                      error={Boolean(errors.tipoCliente)}
                      helperText={errors.tipoCliente?.message}
                    />
                  )}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="descripcion"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Descripción"
                  onChange={onChange}
                  placeholder="Descripción del tipo de documento"
                  error={Boolean(errors.descripcion)}
                />
              )}
            />
            {errors.descripcion && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.descripcion.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="encabezado"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Encabezado"
                  onChange={onChange}
                  placeholder="Ej: B02"
                  error={Boolean(errors.encabezado)}
                />
              )}
            />
            {errors.encabezado && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.encabezado.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="secuenciaIni"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type="number"
                  value={value}
                  label="Secuencia Inicial"
                  onChange={onChange}
                  error={Boolean(errors.secuenciaIni)}
                />
              )}
            />
            {errors.secuenciaIni && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.secuenciaIni.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="secuenciaFin"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type="number"
                  value={value}
                  label="Secuencia Final"
                  onChange={onChange}
                  error={Boolean(errors.secuenciaFin)}
                />
              )}
            />
            {errors.secuenciaFin && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.secuenciaFin.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="secuencia"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type="number"
                  value={value}
                  label="Secuencia Actual"
                  onChange={onChange}
                  error={Boolean(errors.secuencia)}
                />
              )}
            />
            {errors.secuencia && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.secuencia.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="vencimiento"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type="date"
                  value={value}
                  label="Fecha de Vencimiento"
                  onChange={onChange}
                  error={Boolean(errors.vencimiento)}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
            {errors.vencimiento && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.vencimiento.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel error={Boolean(errors.entorno)}>Entorno</InputLabel>
            <Controller
              name="entorno"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.entorno)}
                  label="Entorno"
                >
                  <MenuItem value="eCF">Producción</MenuItem>
                  <MenuItem value="CerteCF">Certificación</MenuItem>
                  <MenuItem value="TesteCF">Prueba</MenuItem>
                </Select>
              )}
            />
            {errors.entorno && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.entorno.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="esElectronico"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={<Switch checked={value} onChange={onChange} />}
                  label="Es Electrónico"
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="habilitado"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={<Switch checked={value} onChange={onChange} />}
                  label="Habilitado"
                />
              )}
            />
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              size="large"
              type="submit"
              variant="contained"
              sx={{ mr: 3 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
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
        </form>
      </Box>
    </Drawer>
  )
}

export default AddSecuenciaECFDrawer
