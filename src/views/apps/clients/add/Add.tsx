// MUI Imports
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// Component Imports
import ClientHeader from '@/views/apps/clients/add/ClientAddHeader'
import ClientConfig from '@/views/apps/clients/add/ClientConfig'
import ClientInformation from '@/views/apps/clients/add/ClientInformation'
import ClientRoute from '@/views/apps/clients/add/ClientRoute'

import { AppDispatch, RootState } from '@/store'
import { FormProvider, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

import { addOrUpdateCustomer, fetchCustomer } from '@/store/apps/clients'
import ClientSettings from '@/views/apps/clients/add/ClientSettings'
import LoadingWrapper from '@/views/ui/LoadingWrapper'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// Import statements
import { useFormNavWarning } from '@/hooks/useFormNavWarning'
import { CustomerType } from '@/types/apps/customerType'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// Validation schema
const clientSchema = yup.object().shape({
  // Required fields with specific validations
  codigo: yup
    .string()
    .required('El código es requerido')
    .max(20, 'El código no debe exceder 20 caracteres'),

  nombre: yup
    .string()
    .required('El nombre es requerido')
    .max(100, 'El nombre no debe exceder 100 caracteres'),

  // Optional string fields with length validation
  direccion: yup.string().nullable().max(200),
  telefono1: yup.string().nullable(),
  ciudad: yup.string().nullable(),

  // Number fields with min/max validations
  balance: yup
    .number()
    .typeError('El balance debe ser un número')
    .min(0, 'El balance no puede ser negativo'),

  limiteFacturas: yup
    .number()
    .typeError('El límite de facturas debe ser un número')
    .integer('Debe ser un número entero')
    .min(0, 'El límite no puede ser negativo')
    .optional(),

  limiteCredito: yup
    .number()
    .typeError('El límite de crédito debe ser un número')
    .min(0, 'El límite no puede ser negativo')
    .optional(),

  // Optional fields with specific validations
  status: yup.string().nullable().oneOf(['A', 'I'], 'Estado inválido'),
  rnc: yup.string().nullable(),

  // Boolean fields
  confirmado: yup.boolean(),
  actualizar: yup.boolean().default(false),
  impuesto: yup.boolean(),
  bloqueoPorVencimiento: yup.boolean().default(false),

  // Email validation
  email: yup.string().nullable().email('Correo electrónico inválido'),

  condicion: yup.string().required('La condición de precio es requerida'),
  // Numbers with specific ranges
  condicionPrecio: yup
    .number()
    .integer('Debe ser un número entero')
    .min(1, 'Mínimo 1')
    .max(5, 'Máximo 5'),

  rutaVenta: yup
    .number()
    .typeError('La ruta de venta debe ser un número')
    .min(0, 'La ruta no puede ser negativa')
    .optional(),

  // Geolocation
  latitud: yup.number().nullable().optional(),
  longitud: yup.number().nullable().optional(),

  // Discount validations
  descuentoProntoPago: yup
    .number()
    .min(0, 'El descuento no puede ser negativo')
    .max(100, 'El descuento no puede exceder 100%'),

  codigoVendedor: yup.string().required('El código del vendedor es requerido'),
  descuento: yup
    .number()
    .min(0, 'El descuento no puede ser negativo')
    .max(100, 'El descuento no puede exceder 100%'),

  // Schedule validations
  dia: yup
    .number()
    .integer('Debe ser un número entero')
    .min(0, 'Mínimo día 1')
    .max(31, 'Máximo día 31')
    .optional(),

  frecuencia: yup
    .number()
    .integer('Debe ser un número entero')
    .min(0, 'Mínimo 1')
    .optional(),

  secuencia: yup
    .number()
    .integer('Debe ser un número entero')
    .min(0, 'Mínimo 1')
    .optional(),

  localidadId: yup
    .number()
    .required('La localidad es requerida')
    .integer('Debe ser un número entero')
    .min(1, 'Seleccione una localidad válida')
    .required('La localidad es requerida'),

  // Optional new fields
  estado: yup.string().nullable(),
  codigoPostal: yup.string().nullable(),
  contactoWhatsApp: yup.string().nullable().optional(),
  preferenciasDeContacto: yup.string().nullable(),
  idiomaPreferido: yup.string().nullable(),
  notas: yup.string().nullable(),
  pais: yup.string().nullable(),
})

interface AddCustomerProps {
  id: string
}

const AddCustomer = ({ id }: AddCustomerProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Initialize form
  const methods = useForm<CustomerType>({
    defaultValues: {
      // Basic Information
      codigo: '',
      nombre: '',
      direccion: '',
      telefono1: '',
      ciudad: '',
      email: '',
      contacto: '',
      rnc: '',

      // Financial Information
      balance: 0,
      limiteFacturas: 0,
      limiteCredito: 0,
      descuento: 0,
      descuentoProntoPago: 0,

      // Sales Information
      codigoVendedor: '',
      rutaVenta: 0,
      clasificacion: '',
      condicionPrecio: 0,

      // Status and Controls
      status: 'A',
      confirmado: false,
      actualizar: false,
      impuesto: false,
      bloqueoPorVencimiento: false,

      // Scheduling
      condicion: '',
      dia: 0,
      frecuencia: 0,
      secuencia: 0,

      // Other Details
      tipoCliente: '',
      localidadId: 0,

      estado: '',
      codigoPostal: '',
      contactoWhatsApp: '',
      preferenciasDeContacto: '',
      idiomaPreferido: '',
      notas: '',
      pais: '',
    },
    resolver: yupResolver(clientSchema),
    mode: 'onChange',
  })
  const [isSubmitting, setIsformSubmitted] = useState(false)

  const router = useRouter()

  useFormNavWarning({
    form: methods,
    isSubmitting,
    warningText:
      '¿Seguro que deseas salir? Los cambios no guardados se perderán',
  })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.clients)

  useEffect(() => {
    if (id) {
      dispatch(fetchCustomer(id))
    }
  }, [id, dispatch])

  useEffect(() => {
    if (store.customerDetail) {
      methods.reset(store.customerDetail.client)
    }
  }, [methods, store.customerDetail])

  // Handle form submission
  const onSubmit = async (data: CustomerType) => {
    try {
      setIsformSubmitted(true)
      const response = await dispatch(addOrUpdateCustomer(data)).unwrap()

      if (response.success) {
        router.push('/apps/clients/list') // Redirect to clients list
      } else {
        toast.error(response.message || 'Error actualizando producto')
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Error inesperado al actualizar producto')
      setIsformSubmitted(false)
    }
  }

  return (
    <LoadingWrapper isLoading={store.isLoading}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Grid
            container
            spacing={{ xs: 3, sm: 4, md: 6 }}
            sx={{
              px: { xs: 1, sm: 2 },
              maxWidth: '100%',
              margin: 0,
              width: '100%',
            }}
          >
            <Grid item xs={12}>
              <ClientHeader id={id} />
            </Grid>

            {/* Main Content - Stack on mobile, side-by-side on desktop */}
            <Grid item xs={12} lg={8}>
              <Grid container spacing={{ xs: 3, sm: 4, md: 6 }}>
                <Grid item xs={12}>
                  <ClientInformation id={id} />
                </Grid>

                {/* Route and Settings - Stack on mobile */}
                <Grid item xs={12} sm={6}>
                  <ClientRoute />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ClientSettings />
                </Grid>
              </Grid>
            </Grid>

            {/* Config Section - Full width on mobile, sidebar on desktop */}
            <Grid item xs={12} lg={4}>
              <Grid container spacing={{ xs: 3, sm: 4, md: 6 }}>
                <Grid item xs={12}>
                  <ClientConfig />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </LoadingWrapper>
  )
}

export default AddCustomer
