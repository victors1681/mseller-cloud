// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import ProductAddHeader from 'src/views/apps/products/add/ProductAddHeader'
import ProductInformation from 'src/views/apps/products/add/ProductInformation'
import ProductImage from 'src/views/apps/products/add/ProductImage'
import ProductVariants from 'src/views/apps/products/add/ProductVariants'
import ProductInventory from 'src/views/apps/products/add/ProductInventory'
import ProductPricing from 'src/views/apps/products/add/ProductPricing'
import ProductOrganize from 'src/views/apps/products/add/ProductOrganize'
import DropzoneWrapper from '@/@core/styles/libs/react-dropzone'
import ImageGallery from '@/views/apps/products/add/ImageGallery'

const eCommerceProductsAdd = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ProductAddHeader />
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
          {/* <Grid item xs={12}>
            <ProductVariants />
          </Grid> */}
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
        </Grid>
      </Grid>
    </Grid>
  )
}

export default eCommerceProductsAdd
