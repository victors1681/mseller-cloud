// MUI Imports
import Grid from '@mui/material/Grid'

import { useForm, FormProvider } from 'react-hook-form'
import { ProductType } from '@/types/apps/productTypes'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'

import { useEffect, useState } from 'react'
import { updateProduct } from '@/store/apps/products'
import { useRouter } from 'next/router'
import LoadingWrapper from '@/views/ui/LoadingWrapper'
import toast from 'react-hot-toast'

import { Box, Container } from '@mui/material'
import ProductGrid from './ProductGrid'
import CategoriesNav from './CategotiesNav'
import Cart from './Cart'

const AddProduct = () => {
  // Initialize form
  const methods = useForm<ProductType>({
    defaultValues: {},
    //resolver: yupResolver(productSchema),
    mode: 'onChange',
  })
  const [isSubmitting, setIsformSubmitted] = useState(false)

  const router = useRouter()

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.products)

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
    <LoadingWrapper isLoading={false}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={8}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <Box>
                    <CategoriesNav />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <ProductGrid />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Cart />
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </LoadingWrapper>
  )
}

export default AddProduct
