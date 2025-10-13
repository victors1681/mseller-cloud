import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { useCodeGenerator } from 'src/hooks/useCodeGenerator'
import { AppDispatch, RootState } from 'src/store'
import { addOrUpdateCustomer, fetchCustomer } from 'src/store/apps/clients'
import { fetchLocations } from 'src/store/apps/location'
import { fetchPaymentType } from 'src/store/apps/paymentType'
import { fetchSellers } from 'src/store/apps/seller'
import { CustomerType } from 'src/types/apps/customerType'
import CustomAutocomplete from 'src/views/ui/customAutocomplete'
import { CustomerTypeAutocomplete } from 'src/views/ui/customerTypeAutocomplete'
import InputLabelTooltip from 'src/views/ui/inputLabelTooltip'
import * as yup from 'yup'

// Simplified validation schema for quick add
const quickAddSchema = yup.object().shape({
  codigo: yup
    .string()
    .required('El código es requerido')
    .max(20, 'El código no debe exceder 20 caracteres'),
  nombre: yup
    .string()
    .required('El nombre es requerido')
    .max(100, 'El nombre no debe exceder 100 caracteres'),
  rnc: yup.string().nullable().max(50, 'El RNC no debe exceder 50 caracteres'),
  telefono1: yup.string().nullable(),
  email: yup
    .string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .test('email-validation', 'Correo electrónico inválido', (value) => {
      if (!value) return true // Allow empty values
      return yup.string().email().isValidSync(value)
    }),
  direccion: yup.string().nullable().max(200),
  ciudad: yup.string().nullable(),
  tipoCliente: yup.string().required('El tipo de cliente es requerido'),
  codigoVendedor: yup.string().required('El código del vendedor es requerido'),
  localidadId: yup
    .number()
    .required('La localidad es requerida')
    .integer('Debe ser un número entero')
    .min(1, 'Seleccione una localidad válida'),
  condicion: yup.string().required('La condición de pago es requerida'),
})

interface AddClientModalProps {
  open: boolean
  onClose: () => void
  onClientCreated: (client: CustomerType) => void
}

const AddClientModal: React.FC<AddClientModalProps> = ({
  open,
  onClose,
  onClientCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { generateCustomer } = useCodeGenerator()

  // ** Redux store selectors
  const store = useSelector((state: RootState) => state.clients)
  const sellerStore = useSelector((state: RootState) => state.sellers)
  const locationStore = useSelector((state: RootState) => state.locations)
  const paymentTypeStore = useSelector((state: RootState) => state.paymentTypes)

  // ** Fetch data on component mount
  useEffect(() => {
    // Fetch customer data to get cities options
    dispatch(fetchCustomer('new'))

    if (sellerStore.data.length === 0) {
      dispatch(fetchSellers())
    }
    if (locationStore.data.length === 0) {
      dispatch(fetchLocations())
    }
    if (paymentTypeStore.data.length === 0) {
      dispatch(fetchPaymentType())
    }
  }, [
    dispatch,
    sellerStore.data.length,
    locationStore.data.length,
    paymentTypeStore.data.length,
  ])

  // ** Seller options (following ClientConfig pattern)
  const sellersOptions = useMemo(() => {
    return sellerStore.data.map((unit) => ({
      label: unit.nombre,
      value: unit.codigo,
    }))
  }, [sellerStore.data])

  // ** City options (following ClientInformation pattern)
  const cityOpts = useMemo(() => {
    return (
      store.customerDetail?.cities?.map((unit) => ({
        label: unit,
        value: unit,
      })) || []
    )
  }, [store.customerDetail?.cities])

  // ** Location options (following ClientConfig pattern)
  const locationOptions = useMemo(() => {
    return locationStore.data.map((unit) => ({
      label: unit.descripcion,
      value: unit.id || 0,
    }))
  }, [locationStore.data])

  // ** Payment types options (following ClientConfig pattern)
  const paymentTypesOptions = useMemo(() => {
    return paymentTypeStore.data.map((unit) => ({
      label: unit.descripcion,
      value: unit.condicionPago,
    }))
  }, [paymentTypeStore.data])

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CustomerType>({
    defaultValues: {
      codigo: '',
      nombre: '',
      rnc: '',
      telefono1: '',
      email: '',
      direccion: '',
      ciudad: '',
      tipoCliente: '',
      codigoVendedor: '',
      localidadId: 1,
      condicion: '',
      status: 'A',
      confirmado: false,
      actualizar: false,
      impuesto: true,
      bloqueoPorVencimiento: false,
      balance: 0,
      limiteFacturas: 0,
      limiteCredito: 0,
      descuento: 0,
      descuentoProntoPago: 0,
      rutaVenta: 0,
      condicionPrecio: 1,
      dia: 0,
      frecuencia: 0,
      secuencia: 0,
    },
    resolver: yupResolver(quickAddSchema),
  })

  const onSubmit = async (data: CustomerType) => {
    setIsSubmitting(true)
    try {
      const response = await dispatch(addOrUpdateCustomer(data)).unwrap()

      if (response.success) {
        onClientCreated(response.data || data)
        reset()
      }
    } catch (error) {
      console.error('Create client error:', error)
      //toast.error('Error inesperado al crear cliente')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleGoToFullForm = () => {
    router.push('/apps/clients/add/new')
    handleClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          minHeight: { xs: '100vh', sm: '60vh' },
          maxHeight: { xs: '100vh', sm: '90vh' },
          m: { xs: 0, sm: 2 },
          borderRadius: { xs: 0, sm: 1 },
          maxWidth: { xs: '100vw', sm: '600px' },
        },
      }}
    >
      <DialogTitle>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 5 }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
          >
            Agregar Nuevo Cliente
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Icon icon="mdi:close" />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          dividers
          sx={{
            p: { xs: 2, sm: 3 },
            '& .MuiTextField-root': {
              '& .MuiInputBase-input': {
                fontSize: { xs: '1rem', sm: '0.875rem' },
              },
            },
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Información Básica
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Controller
                  name="codigo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Código *"
                      error={!!errors.codigo}
                      helperText={errors.codigo?.message}
                      size="small"
                    />
                  )}
                />
                <IconButton
                  onClick={() => {
                    const customerName = watch('nombre')
                    const generatedCode = generateCustomer(customerName, {
                      prefix: 'CLI',
                      length: 6,
                      includeDate: true,
                      includeSequence: true,
                      separator: '-',
                    })
                    setValue('codigo', generatedCode)
                  }}
                  size="small"
                  color="primary"
                  sx={{
                    mt: 0.5,
                    minWidth: 40,
                    minHeight: 40,
                  }}
                  title="Generar código automáticamente"
                >
                  <Icon icon="mdi:refresh" />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nombre *"
                    error={!!errors.nombre}
                    helperText={errors.nombre?.message}
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="rnc"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="RNC"
                    error={!!errors.rnc}
                    helperText={errors.rnc?.message}
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="telefono1"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Teléfono"
                    error={!!errors.telefono1}
                    helperText={errors.telefono1?.message}
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="tipoCliente"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Box>
                    <CustomerTypeAutocomplete
                      selectedCustomerType={field.value}
                      callBack={(value) => field.onChange(value)}
                      size="small"
                      multiple={false}
                      sx={{ width: '100%' }}
                    />
                    {error && (
                      <Box
                        sx={{
                          color: 'error.main',
                          fontSize: '0.75rem',
                          mt: 0.5,
                          mx: 1.75,
                        }}
                      >
                        {error.message}
                      </Box>
                    )}
                  </Box>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="direccion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Dirección"
                    error={!!errors.direccion}
                    helperText={errors.direccion?.message}
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomAutocomplete
                name="ciudad"
                control={control}
                options={cityOpts}
                label="Ciudad"
                size="small"
                freeSolo
              />
            </Grid>

            {/* Sales Information */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                gutterBottom
                fontWeight="bold"
                sx={{ mt: 2 }}
              >
                Información de Ventas
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomAutocomplete
                name="codigoVendedor"
                control={control}
                options={sellersOptions}
                label="Vendedor *"
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
              <CustomAutocomplete
                name="localidadId"
                control={control}
                options={locationOptions}
                label="Localidad del cliente *"
                placeholder="Almacen 1 - Localidad 1"
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomAutocomplete
                name="condicion"
                control={control}
                options={paymentTypesOptions}
                label={
                  <InputLabelTooltip
                    title="Condicion de Pago *"
                    description="Si está activado, el sistema bloqueará automáticamente las ventas o toma de pedidos al cliente cuando tenga facturas vencidas"
                  />
                }
                placeholder="Seleccione condición de pago"
                size="small"
              />
            </Grid>

            {/* Status and Options */}
            <Grid item xs={12}>
              <Divider sx={{ mt: 2, mb: 1 }}>Configuración</Divider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="impuesto"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Aplicar Impuesto"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="confirmado"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Cliente Confirmado"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 },
            '& .MuiButton-root': {
              minHeight: { xs: 48, sm: 36 }, // Larger touch targets on mobile
              fontSize: { xs: '0.875rem', sm: '0.875rem' },
            },
          }}
        >
          <Button
            onClick={handleGoToFullForm}
            color="info"
            variant="outlined"
            sx={{
              order: { xs: 1, sm: 1 },
              width: { xs: '100%', sm: 'auto' },
              mb: { xs: 0, sm: 0 },
            }}
            startIcon={<Icon icon="mdi:form-textbox" />}
          >
            <Box
              component="span"
              sx={{ display: { xs: 'none', sm: 'inline' } }}
            >
              Formulario Completo
            </Box>
            <Box
              component="span"
              sx={{ display: { xs: 'inline', sm: 'none' } }}
            >
              Formulario
            </Box>
          </Button>

          <Box
            sx={{
              flex: { xs: 'none', sm: 1 },
              order: { xs: 4, sm: 2 },
            }}
          />

          <Button
            onClick={handleClose}
            color="secondary"
            sx={{
              order: { xs: 2, sm: 3 },
              width: { xs: '100%', sm: 'auto' },
              mb: { xs: 0, sm: 0 },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{
              order: { xs: 3, sm: 4 },
              width: { xs: '100%', sm: 'auto' },
              mb: { xs: 0, sm: 0 },
            }}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={16} />
              ) : (
                <Icon icon="mdi:content-save" />
              )
            }
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cliente'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddClientModal
