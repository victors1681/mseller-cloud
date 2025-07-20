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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import {
  addUpdateDocTypeSecType,
  toggleDocTypeSecAddUpdate,
} from '@/store/apps/docTypeSec'
import { DocTypeSecType } from '@/types/apps/docTypeSecType'
import {
  TipoDocumentoEnum,
  getTipoDocumentoSpanishName,
} from 'src/types/apps/documentTypes'

interface AddDocTypeSecDrawerType {
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
  id: yup.number(),

  prefijo: yup.string().max(20, 'El prefijo no debe exceder 20 caracteres'),

  tipoDocumento: yup
    .string()
    .oneOf(
      Object.values(TipoDocumentoEnum),
      'Debe seleccionar un tipo de documento válido',
    )
    .required('Tipo de documento es requerido'),

  secuencia: yup
    .number()
    .min(0, 'La secuencia debe ser mayor o igual a 0')
    .required('Secuencia es requerida'),

  secuenciaContado: yup
    .number()
    .min(0, 'La secuencia contado debe ser mayor o igual a 0')
    .required('Secuencia contado es requerida'),

  localidad: yup.number().required('Localidad es requerida'),
})

const defaultValues = {
  id: 0,
  prefijo: '',
  tipoDocumento: TipoDocumentoEnum.ORDER,
  secuencia: 0,
  secuenciaContado: 0,
  localidad: 0,
}

const AddDocTypeSecDrawer = (props: AddDocTypeSecDrawerType) => {
  // ** Props
  const { open } = props

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  const store = useSelector((state: RootState) => state.docTypeSec)
  const toggle = () => dispatch(toggleDocTypeSecAddUpdate(null))

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

  const onSubmit = async (data: DocTypeSecType) => {
    try {
      const response = await dispatch(addUpdateDocTypeSecType(data)).unwrap()

      if (response.success) {
        toggle()
        reset()
      } else {
        toast.error(
          response.message || 'Error actualizando el tipo de documento',
        )
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Error inesperado al actualizar el tipo de documento')
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
        <Typography variant="h6">
          {store.editData
            ? 'Editar Secuencia de Documento'
            : 'Agregar Secuencia de Documento'}
        </Typography>
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
                name="prefijo"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Prefijo"
                    placeholder="B01"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="tipoDocumento"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error}>
                    <InputLabel>Tipo de Documento</InputLabel>
                    <Select {...field} label="Tipo de Documento">
                      {Object.values(TipoDocumentoEnum).map((tipo) => (
                        <MenuItem key={tipo} value={tipo}>
                          {getTipoDocumentoSpanishName(tipo)}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 1, ml: 2 }}
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
                name="secuencia"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Secuencia"
                    placeholder="1"
                    error={!!error}
                    helperText={error?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="secuenciaContado"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Secuencia Contado"
                    placeholder="1"
                    error={!!error}
                    helperText={error?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="localidad"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Localidad"
                    placeholder="1"
                    error={!!error}
                    helperText={error?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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

export default AddDocTypeSecDrawer
