// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import ClientHeader from '@/views/apps/clients/add/ClientAddHeader'
import ClientInformation from '@/views/apps/clients/add/ClientInformation'
import ClientConfig from '@/views/apps/clients/add/ClientConfig'
import ClientRoute from '@/views/apps/clients/add/ClientRoute'

import { useForm, FormProvider } from 'react-hook-form' 
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'

import { useEffect, useState } from 'react'
import { fetchCustomer, addOrUpdateCustomer } from '@/store/apps/clients'
import { useRouter } from 'next/router'
import LoadingWrapper from '@/views/ui/LoadingWrapper'
import ClientSettings from '@/views/apps/clients/add/ClientSettings'
import toast from 'react-hot-toast'

// Import statements
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useFormNavWarning } from '@/hooks/useFormNavWarning'
import { CustomerType } from '@/types/apps/customerType'

// Validation schema
const clientschema = yup.object().shape({
  // Basic Information
})

interface AddCustomerProps {
  id: string
}

const AddCustomer = ({ id }: AddCustomerProps) => {
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
    resolver: yupResolver(clientschema),
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
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <ClientHeader id={id} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <ClientInformation />
                </Grid>

                <Grid item xs={6}>
                  <ClientRoute />
                </Grid>
                <Grid item xs={6}>
                  <ClientSettings />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
              <Grid container spacing={6}>
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
