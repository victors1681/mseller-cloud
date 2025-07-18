// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchBusinessData, updateBusinessData } from 'src/store/apps/business'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { BusinessType } from 'src/types/apps/businessType'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

interface FormData {
  razonSocial: string
  nombreComercial: string
  rnc: string
  direccion: string
  codigoProvincia: string
  codigoMunicipio: string
  telefono: string
  email: string
  sitioWeb: string
  logo: string
  indicadorEnvioDiferido: boolean
  indicadorMontoGravado: boolean
  tipoIngresos: string
}

const BusinessForm = () => {
  // ** State
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.business)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      razonSocial: '',
      nombreComercial: '',
      rnc: '',
      direccion: '',
      codigoProvincia: '',
      codigoMunicipio: '',
      telefono: '',
      email: '',
      sitioWeb: '',
      logo: '',
      indicadorEnvioDiferido: false,
      indicadorMontoGravado: false,
      tipoIngresos: '',
    },
  })

  // ** Effects
  useEffect(() => {
    dispatch(fetchBusinessData())
  }, [dispatch])

  useEffect(() => {
    if (store.singleData) {
      const businessData = store.singleData
      reset({
        razonSocial: businessData.razonSocial || '',
        nombreComercial: businessData.nombreComercial || '',
        rnc: businessData.rnc || '',
        direccion: businessData.direccion || '',
        codigoProvincia: businessData.codigoProvincia || '',
        codigoMunicipio: businessData.codigoMunicipio || '',
        telefono: businessData.telefono || '',
        email: businessData.email || '',
        sitioWeb: businessData.sitioWeb || '',
        logo: businessData.logo || '',
        indicadorEnvioDiferido: businessData.indicadorEnvioDiferido || false,
        indicadorMontoGravado: businessData.indicadorMontoGravado || false,
        tipoIngresos: businessData.tipoIngresos || '',
      })
    }
  }, [store.singleData, reset])

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const businessData: BusinessType = {
        id: store.singleData?.id || '',
        ...data,
        fechaCreacion:
          store.singleData?.fechaCreacion || new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        businessId: store.singleData?.businessId || '',
      }

      await dispatch(updateBusinessData(businessData)).unwrap()
      toast.success('Datos de empresa actualizados exitosamente')
    } catch (error) {
      toast.error('Error actualizando los datos de empresa')
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (store.isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Configuración de Empresa" />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={6}>
                {/* Información Básica */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 4 }}>
                    Información Básica
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="razonSocial"
                    control={control}
                    rules={{ required: 'La razón social es requerida' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Razón Social"
                        placeholder="Ingrese la razón social"
                        error={Boolean(errors.razonSocial)}
                        helperText={errors.razonSocial?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="nombreComercial"
                    control={control}
                    rules={{ required: 'El nombre comercial es requerido' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Nombre Comercial"
                        placeholder="Ingrese el nombre comercial"
                        error={Boolean(errors.nombreComercial)}
                        helperText={errors.nombreComercial?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="rnc"
                    control={control}
                    rules={{ required: 'El RNC es requerido' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="RNC"
                        placeholder="Ingrese el RNC"
                        error={Boolean(errors.rnc)}
                        helperText={errors.rnc?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="tipoIngresos"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Tipo de Ingresos"
                        placeholder="Ingrese el tipo de ingresos"
                      />
                    )}
                  />
                </Grid>

                {/* Información de Contacto */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 4, mb: 4 }}>
                    Información de Contacto
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="direccion"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={3}
                        label="Dirección"
                        placeholder="Ingrese la dirección completa"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="codigoProvincia"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Código de Provincia"
                        placeholder="Ingrese el código de provincia"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="codigoMunicipio"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Código de Municipio"
                        placeholder="Ingrese el código de municipio"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="telefono"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Teléfono"
                        placeholder="Ingrese el teléfono"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Formato de email inválido',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="email"
                        label="Email"
                        placeholder="Ingrese el email"
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="sitioWeb"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Sitio Web"
                        placeholder="Ingrese la URL del sitio web"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="logo"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Logo (URL)"
                        placeholder="Ingrese la URL del logo"
                      />
                    )}
                  />
                </Grid>

                {/* Configuración */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 4, mb: 4 }}>
                    Configuración
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="indicadorEnvioDiferido"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Indicador Envío Diferido"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="indicadorMontoGravado"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Indicador Monto Gravado"
                      />
                    )}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      startIcon={
                        isSubmitting ? <CircularProgress size={20} /> : null
                      }
                    >
                      {isSubmitting ? 'Actualizando...' : 'Actualizar Empresa'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default BusinessForm
