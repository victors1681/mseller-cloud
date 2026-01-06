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
  encabezado: yup
    .string()
    .required('Encabezado es requerido')
    .test(
      'match-tipo-cliente',
      'El encabezado debe coincidir con el tipo de cliente seleccionado',
      function (value) {
        const { tipoCliente } = this.parent
        if (!value || !tipoCliente) return true

        // Find the selected option
        const selectedOption = tipoClienteOptions.find(
          (opt) => opt.value === tipoCliente,
        )
        if (!selectedOption) return true // Skip validation if custom value

        // Determine expected prefix based on tipoCliente value
        const isElectronic = parseInt(tipoCliente) >= 31 // 31-47 are electronic (E)
        const expectedPrefix = isElectronic ? 'E' : 'B'
        const expectedCode = tipoCliente

        // Validate format: prefix + code (e.g., E31, B02)
        const encabezadoUpper = value.toUpperCase()
        const expectedEncabezado = `${expectedPrefix}${expectedCode}`

        return (
          encabezadoUpper === expectedEncabezado ||
          encabezadoUpper.startsWith(expectedEncabezado)
        )
      },
    ),
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
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  // ** Watch fields for validation
  const encabezadoValue = watch('encabezado')
  const esElectronicoValue = watch('esElectronico')

  // ** Only enable esElectronico if encabezado starts with E
  const canBeElectronic = encabezadoValue?.charAt(0)?.toUpperCase() === 'E'

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

  // ** Clear entorno when esElectronico is disabled
  useEffect(() => {
    if (!esElectronicoValue) {
      setValue('entorno', '')
    }
  }, [esElectronicoValue, setValue])

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
                    null
                  }
                  onChange={(_, newValue) => {
                    let selectedValue = ''
                    if (typeof newValue === 'string') {
                      selectedValue = newValue
                      onChange(newValue)
                    } else if (newValue && typeof newValue === 'object') {
                      selectedValue = newValue.value
                      onChange(newValue.value)
                    } else {
                      onChange('')
                      return
                    }

                    // Auto-populate encabezado based on tipoCliente
                    if (selectedValue) {
                      const isElectronic = parseInt(selectedValue) >= 31
                      const prefix = isElectronic ? 'E' : 'B'
                      const encabezado = `${prefix}${selectedValue}`
                      setValue('encabezado', encabezado)

                      // Auto-set esElectronico based on prefix
                      setValue('esElectronico', isElectronic)
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
                  onChange={(e) => {
                    const newValue = e.target.value
                    onChange(newValue)
                    // Only allow esElectronico if starts with E
                    const firstChar = newValue?.charAt(0)?.toUpperCase()
                    if (firstChar === 'E') {
                      setValue('esElectronico', true)
                    } else {
                      setValue('esElectronico', false)
                    }
                  }}
                  placeholder="Ej: E31, B02"
                  error={Boolean(errors.encabezado)}
                  helperText={
                    errors.encabezado?.message ||
                    'Solo encabezados con "E" permiten facturación electrónica'
                  }
                />
              )}
            />
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
            <InputLabel
              error={Boolean(errors.entorno)}
              disabled={!esElectronicoValue}
            >
              Entorno
            </InputLabel>
            <Controller
              name="entorno"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.entorno)}
                  label="Entorno"
                  disabled={!esElectronicoValue}
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
            {!esElectronicoValue && (
              <FormHelperText>
                Solo disponible para secuencias electrónicas
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="esElectronico"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value && canBeElectronic}
                        onChange={(e) => {
                          if (canBeElectronic) {
                            onChange(e.target.checked)
                          }
                        }}
                        disabled={!canBeElectronic}
                      />
                    }
                    label="Es Electrónico"
                  />
                  <FormHelperText>
                    {!canBeElectronic
                      ? 'Solo disponible para encabezados que inician con "E"'
                      : 'Facturación electrónica habilitada'}
                  </FormHelperText>
                </Box>
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
