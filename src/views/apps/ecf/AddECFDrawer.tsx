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
  Link,
} from '@mui/material'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import {
  addECFConfiguration,
  updateECFConfiguration,
  toggleECFAddUpdate,
  testECFConnection,
} from 'src/store/apps/ecf'
import { ECFType } from 'src/types/apps/ecfType'

interface AddECFDrawerType {
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
  ambiente: yup
    .string()
    .oneOf(['TesteCF', 'CerteCF', 'eCF'], 'Debe seleccionar un ambiente válido')
    .required('El ambiente es requerido'),

  urlBase: yup
    .string()
    .url('Debe ser una URL válida')
    .required('La URL base es requerida'),

  usuario: yup
    .string()
    .max(50, 'El usuario no debe exceder 50 caracteres')
    .required('El usuario es requerido'),

  clave: yup
    .string()
    .max(100, 'La clave no debe exceder 100 caracteres')
    .required('La clave es requerida'),

  claveApi: yup
    .string()
    .max(200, 'La clave API no debe exceder 200 caracteres')
    .required('La clave API es requerida'),

  habilitado: yup.boolean(),
})

const defaultValues: Partial<ECFType> = {
  ambiente: 'TesteCF',
  urlBase: 'https://ecf.api.mseller.app',
  usuario: '',
  clave: '',
  claveApi: '',
  habilitado: true,
}

const AddECFDrawer = (props: AddECFDrawerType) => {
  // ** Props
  const { open } = props

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  const store = useSelector((state: RootState) => state.ecf)
  const toggle = () => dispatch(toggleECFAddUpdate(null))

  useEffect(() => {
    if (store.editData) {
      reset(store.editData)
    } else {
      reset(defaultValues)
    }
  }, [store.editData])

  const { reset, control, handleSubmit, watch, getValues } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: Partial<ECFType>) => {
    const ecfData: ECFType = {
      id: store.editData?.id || '',
      ambiente: data.ambiente || '',
      urlBase: data.urlBase || '',
      usuario: data.usuario || '',
      clave: data.clave || '',
      claveApi: data.claveApi || '',
      habilitado: data.habilitado ?? true,
      fechaCreacion: store.editData?.fechaCreacion || new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    }

    if (store.editData) {
      dispatch(updateECFConfiguration(ecfData))
    } else {
      dispatch(addECFConfiguration(ecfData))
    }
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  const handleTestConnection = () => {
    const formValues = getValues()

    const testConnectionData = {
      ambiente: formValues.ambiente || '',
      urlBase: formValues.urlBase || '',
      usuario: formValues.usuario || '',
      clave: formValues.clave || '',
      claveApi: formValues.claveApi || '',
    }

    dispatch(testECFConnection(testConnectionData))
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
          {store.editData ? 'Editar' : 'Crear'} Integración ECF
        </Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ borderRadius: 1, color: 'text.primary' }}
        >
          <Icon icon="tabler:x" fontSize="1.125rem" />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Controller
                name="ambiente"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error}>
                    <InputLabel>Ambiente</InputLabel>
                    <Select {...field} label="Ambiente">
                      <MenuItem value="TesteCF">TesteCF</MenuItem>
                      <MenuItem value="CerteCF">CerteCF</MenuItem>
                      <MenuItem value="eCF">eCF</MenuItem>
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
                name="urlBase"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="URL Base"
                    placeholder="https://api.example.com"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="usuario"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Usuario"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="clave"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label="Clave"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="claveApi"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label="Clave API"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  ¿No tienes cuenta?
                </Typography>
                <Link
                  href="https://ecf.mseller.app/register?utm_source=cloud_mseller"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                  }}
                >
                  <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                    <Icon icon="tabler:external-link" fontSize={16} />
                  </Box>
                  Crea una cuenta aquí
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="habilitado"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                      />
                    }
                    label="Habilitado"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button
                  size="large"
                  variant="outlined"
                  color="info"
                  onClick={handleTestConnection}
                  disabled={store.isTestingConnection}
                  startIcon={<Icon icon="tabler:wifi" />}
                  sx={{ mr: 3 }}
                >
                  {store.isTestingConnection
                    ? 'Probando...'
                    : 'Probar Conexión'}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{ mr: 3 }}
                  disabled={store.isLoading}
                >
                  {store.isLoading ? 'Guardando...' : 'Guardar'}
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

export default AddECFDrawer
