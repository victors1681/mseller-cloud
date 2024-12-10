// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import ProductAddHeader from 'src/views/apps/products/add/ProductAddHeader'
import ProductInformation from 'src/views/apps/products/add/ProductInformation'
import ProductImage from 'src/views/apps/products/add/ProductImage'
import ProductInventory from 'src/views/apps/products/add/ProductInventory'
import ProductPricing from 'src/views/apps/products/add/ProductPricing'
import ProductOrganize from 'src/views/apps/products/add/ProductOrganize'
import DropzoneWrapper from '@/@core/styles/libs/react-dropzone'
import ImageGallery from '@/views/apps/products/add/ImageGallery'

import { useForm, FormProvider } from 'react-hook-form'
import { ProductType } from '@/types/apps/productTypes'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'

import { useEffect, useState } from 'react'
import { fetchProductDetail, updateProduct } from '@/store/apps/products'
import { useRouter } from 'next/router'
import LoadingWrapper from '@/views/ui/LoadingWrapper'
import ProductSettings from '@/views/apps/products/add/ProductSettings'
import toast from 'react-hot-toast'

// Import statements
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useFormNavWarning } from '@/hooks/useFormNavWarning'

// Validation schema
const productSchema = yup.object().shape({
  // Basic Information
  codigo: yup.string().required('Código es requerido'),
  codigoBarra: yup.string().optional(),
  nombre: yup.string().required('Nombre es requerido'),
  descripcion: yup.string().optional().nullable(),

  // Organization
  area: yup.string(),
  iDArea: yup.number().nullable(),
  // grupoId: yup.string().optional(),
  departamento: yup.string().optional(),

  // Pricing
  precio1: yup.number().min(0, 'Precio debe ser mayor o igual a 0'),
  precio2: yup.number().min(0, 'Precio debe ser mayor o igual a 0'),
  precio3: yup.number().min(0, 'Precio debe ser mayor o igual a 0'),
  precio4: yup.number().min(0, 'Precio debe ser mayor o igual a 0'),
  precio5: yup.number().min(0, 'Precio debe ser mayor o igual a 0'),
  costo: yup.number().min(0, 'Costo debe ser mayor o igual a 0'),

  // Inventory
  existenciaAlmacen1: yup.number().min(0).optional(),
  existenciaAlmacen2: yup.number().min(0).optional(),
  existenciaAlmacen3: yup.number().min(0).optional(),
  existenciaAlmacen4: yup.number().min(0).optional(),
  existenciaAlmacen5: yup.number().min(0).optional(),
  existenciaAlmacen6: yup.number().min(0).optional(),
  existenciaAlmacen7: yup.number().min(0).optional(),

  // Product Details
  unidad: yup.string().required('Unidad es requerida'),
  empaque: yup.string().optional(),
  impuesto: yup.number().min(0),
  factor: yup.number().min(1, 'Factor debe ser mayor o igual a 1').required(),
  iSC: yup.number().min(0).optional(),
  aDV: yup.number().min(0).optional(),
  descuento: yup.number().min(0).optional(),
  tipoImpuesto: yup.string().optional(),
  apartado: yup.number().min(0),
  status: yup.string().oneOf(['A', 'I']).required(),
  promocion: yup.boolean(),
  visibleTienda: yup.boolean(),

  // Images
  imagenes: yup.array().optional(),
})

interface AddProductProps {
  id: string
}

const AddProduct = ({ id }: AddProductProps) => {
  // Initialize form
  const methods = useForm<ProductType>({
    defaultValues: {
      // Basic Information
      codigo: '',
      codigoBarra: '',
      nombre: '',
      descripcion: '',

      // Organization
      area: '',
      iDArea: 0,
      grupoId: '',
      departamento: '',
      ultCompra: '',

      // Pricing
      precio1: 0,
      precio2: 0,
      precio3: 0,
      precio4: 0,
      precio5: 0,
      costo: 0,

      // Inventory
      existenciaAlmacen1: 0,
      existenciaAlmacen2: 0,
      existenciaAlmacen3: 0,
      existenciaAlmacen4: 0,
      existenciaAlmacen5: 0,
      existenciaAlmacen6: 0,
      existenciaAlmacen7: 0,

      // Product Details
      unidad: 'UN',
      empaque: 'UN',
      impuesto: 0,
      factor: 1,
      iSC: 0,
      aDV: 0,
      descuento: 0,
      tipoImpuesto: '',
      apartado: 0,
      status: 'A',
      promocion: false,
      visibleTienda: true,

      // Images
      imagenes: [],
    },
    resolver: yupResolver(productSchema),
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
  const store = useSelector((state: RootState) => state.products)

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetail(id))
    }
  }, [id, dispatch])

  useEffect(() => {
    if (store.productDetail) {
      methods.reset(store.productDetail)
    }
  }, [methods, store.productDetail])

  // Handle form submission
  const onSubmit = async (data: ProductType) => {
    try {
      setIsformSubmitted(true)
      const response = await dispatch(updateProduct(data)).unwrap()

      if (response.success) {
        router.push('/apps/products/list') // Redirect to products list
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
              <ProductAddHeader id={id} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <ProductInformation />
                </Grid>
                <Grid item xs={12}>
                  <ImageGallery />
                </Grid>
                <Grid item xs={12}>
                  <DropzoneWrapper>
                    <ProductImage />
                  </DropzoneWrapper>
                </Grid>
                <Grid item xs={12}>
                  <ProductInventory />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <ProductPricing />
                </Grid>

                <Grid item xs={12}>
                  <ProductOrganize />
                </Grid>
                <Grid item xs={12}>
                  <ProductSettings />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </LoadingWrapper>
  )
}

export default AddProduct
