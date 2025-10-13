// MUI Imports
import { useMediaQuery, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid'

// Component Imports
import DropzoneWrapper from '@/@core/styles/libs/react-dropzone'
import ImageGallery from '@/views/apps/products/add/ImageGallery'
import ProductAddHeader from 'src/views/apps/products/add/ProductAddHeader'
import ProductImage from 'src/views/apps/products/add/ProductImage'
import ProductInformation from 'src/views/apps/products/add/ProductInformation'
import ProductInventory from 'src/views/apps/products/add/ProductInventory'
import ProductOrganize from 'src/views/apps/products/add/ProductOrganize'
import ProductPricing from 'src/views/apps/products/add/ProductPricing'

import { AppDispatch, RootState } from '@/store'
import { ProductType } from '@/types/apps/productTypes'
import { FormProvider, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

import {
  addProducts,
  fetchProductDetail,
  updateProduct,
} from '@/store/apps/products'
import ProductSettings from '@/views/apps/products/add/ProductSettings'
import LoadingWrapper from '@/views/ui/LoadingWrapper'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// Import statements
import { useCodeGenerator } from '@/hooks/useCodeGenerator'
import { useFormNavWarning } from '@/hooks/useFormNavWarning'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// Validation schema
const productSchema = yup.object().shape({
  // Basic Information
  codigo: yup.string().required('Código es requerido'),
  codigoBarra: yup.string().when('esServicio', {
    is: false,
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.optional(),
  }),
  nombre: yup.string().required('Nombre es requerido'),
  descripcion: yup.string().optional().nullable(),
  esServicio: yup.boolean(),

  // Organization - conditional based on esServicio
  area: yup.string().when('esServicio', {
    is: false,
    then: (schema) => schema,
    otherwise: (schema) => schema.optional(),
  }),
  iDArea: yup.number().nullable(),
  departamento: yup.string().when('esServicio', {
    is: false,
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.optional(),
  }),

  // Pricing
  precio1: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? 0 : value
    })
    .required('El precio es requerido')
    .min(0, 'Precio debe ser mayor o igual a 0'),
  precio2: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? 0 : value
    })
    .min(0, 'Precio debe ser mayor o igual a 0')
    .default(0),
  precio3: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? 0 : value
    })
    .min(0, 'Precio debe ser mayor o igual a 0')
    .default(0),
  precio4: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? 0 : value
    })
    .min(0, 'Precio debe ser mayor o igual a 0')
    .default(0),
  precio5: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? 0 : value
    })
    .min(0, 'Precio debe ser mayor o igual a 0')
    .default(0),
  costo: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? 0 : value
    })
    .min(0, 'Costo debe ser mayor o igual a 0')
    .default(0),

  // Inventory - conditional based on esServicio
  existenciaAlmacen1: yup
    .number()
    .min(0)
    .when('esServicio', {
      is: false,
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.optional(),
    }),
  existenciaAlmacen2: yup.number().min(0).optional(),
  existenciaAlmacen3: yup.number().min(0).optional(),
  existenciaAlmacen4: yup.number().min(0).optional(),
  existenciaAlmacen5: yup.number().min(0).optional(),
  existenciaAlmacen6: yup.number().min(0).optional(),
  existenciaAlmacen7: yup.number().min(0).optional(),

  // Product Details
  unidad: yup.string().required('Unidad es requerida'),
  empaque: yup.string().when('esServicio', {
    is: false,
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.optional(),
  }),
  impuesto: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? 0 : value
    })
    .required('El impuesto es requerido')
    .min(0, 'El impuesto debe ser mayor o igual a 0')
    .max(100, 'El impuesto no puede ser mayor a 100'),
  tipoImpuesto: yup.string().required('El tipo de impuesto es requerido'),
  factor: yup.number().min(1, 'Factor debe ser mayor o igual a 1').required(),
  iSC: yup.number().min(0).optional(),
  aDV: yup.number().min(0).optional(),
  descuento: yup.number().min(0).optional(),

  apartado: yup.number().min(0),
  status: yup.string().oneOf(['A', 'I']).required(),
  promocion: yup.boolean().when('esServicio', {
    is: false,
    then: (schema) => schema,
    otherwise: (schema) => schema.optional(),
  }),
  visibleTienda: yup.boolean(),

  // Images
  imagenes: yup.array().optional(),
})

interface AddProductProps {
  id: string
}

const AddProduct = ({ id }: AddProductProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  // Initialize form
  const methods = useForm<ProductType>({
    defaultValues: {
      // Basic Information
      codigo: '',
      codigoBarra: '',
      nombre: '',
      descripcion: '',
      esServicio: false,

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
      impuesto: 18,
      factor: 1,
      iSC: 0,
      aDV: 0,
      descuento: 0,
      tipoImpuesto: 'ITBIS',
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
  const { generateProduct } = useCodeGenerator()

  useFormNavWarning({
    form: methods,
    isSubmitting,
    warningText:
      '¿Seguro que deseas salir? Los cambios no guardados se perderán',
  })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.products)

  // Determine if this is create or update mode
  const isCreateMode = id === 'new'

  useEffect(() => {
    if (id && !isCreateMode) {
      dispatch(fetchProductDetail(id))
    } else if (isCreateMode) {
      // For create mode, fetch product detail to get options (areas, departments, taxes, etc.)
      dispatch(fetchProductDetail('new'))
    }
  }, [id, dispatch, isCreateMode])

  useEffect(() => {
    if (store.productDetail && !isCreateMode) {
      methods.reset(store.productDetail)
    }
  }, [methods, store.productDetail, isCreateMode])

  // Watch precio1 and update other prices automatically (same logic as AddProductModal)
  const precio1Value = methods.watch('precio1')

  useEffect(() => {
    if (precio1Value !== undefined && isCreateMode && isMobile) {
      // Convert to number to ensure consistent data types
      const numericPrice =
        typeof precio1Value === 'string'
          ? parseFloat(precio1Value) || 0
          : precio1Value
      methods.setValue('precio2', numericPrice)
      methods.setValue('precio3', numericPrice)
      methods.setValue('precio4', numericPrice)
      methods.setValue('precio5', numericPrice)
    }
  }, [precio1Value, methods, isCreateMode])

  // Helper functions for create mode
  const handleGenerateCode = () => {
    if (isCreateMode) {
      const productName = methods.watch('nombre')
      const generatedCode = generateProduct(productName)
      methods.setValue('codigo', generatedCode)
    }
  }

  // Handle form submission
  const onSubmit = async (data: ProductType) => {
    try {
      setIsformSubmitted(true)

      if (isCreateMode) {
        // Create new product - Transform data to ensure proper types (reusing AddProductModal logic)
        const transformedData: ProductType = {
          ...data,
          imagenes:
            data.imagenes?.map((imagen) => ({
              ...imagen,
              codigoProducto: data.codigo,
              idObjeto: data.codigo,
            })) || [],
        }

        console.log(
          'Creating product with data:',
          JSON.stringify(transformedData, null, 2),
        )

        const response = await dispatch(addProducts([transformedData])).unwrap()

        if (response && response.success !== false) {
          toast.success('Producto creado exitosamente')
          router.push('/apps/products/list') // Redirect to products list
        } else {
          toast.error(response?.message || 'Error al crear el producto')
          setIsformSubmitted(false)
        }
      } else {
        // Update existing product
        const response = await dispatch(updateProduct(data)).unwrap()

        if (response.success) {
          router.push('/apps/products/list') // Redirect to products list
        } else {
          toast.error(response.message || 'Error actualizando producto')
          setIsformSubmitted(false)
        }
      }
    } catch (error: any) {
      console.error(isCreateMode ? 'Create error:' : 'Update error:', error)

      // Handle different types of errors (reusing AddProductModal logic)
      let errorMessage = isCreateMode
        ? 'Error inesperado al crear producto'
        : 'Error inesperado al actualizar producto'

      if (error?.message) {
        errorMessage = error.message
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }

      toast.error(errorMessage)
      setIsformSubmitted(false)
    }
  }

  return (
    <LoadingWrapper isLoading={store.isLoading}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Grid container spacing={isMobile ? 3 : isTablet ? 4 : 6}>
            <Grid item xs={12}>
              <ProductAddHeader id={id} />
            </Grid>

            {/* Main content - responsive layout */}
            <Grid item xs={12} md={8} lg={8}>
              <Grid container spacing={isMobile ? 3 : isTablet ? 4 : 6}>
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

            {/* Sidebar - responsive layout */}
            <Grid item xs={12} md={4} lg={4}>
              <Grid container spacing={isMobile ? 3 : isTablet ? 4 : 6}>
                <Grid item xs={12} sm={isMobile ? 12 : 6} md={12}>
                  <ProductPricing />
                </Grid>
                <Grid item xs={12} sm={isMobile ? 12 : 6} md={12}>
                  <ProductOrganize />
                </Grid>
                <Grid item xs={12} sm={isMobile ? 12 : 6} md={12}>
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
