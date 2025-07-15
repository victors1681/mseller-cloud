import React from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Grid,
  Alert,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { ProductType } from 'src/types/apps/productTypes'
import ProductSearchDialog from 'src/views/ui/productsSearchDialog'
import { useProductSearchDialog } from 'src/views/ui/productsSearchDialog/useProductSearchDialog'

interface OrderFormData {
  customerName: string
  productCode: string
  productName: string
  quantity: number
  unitPrice: number
}

const ProductSearchWithFormExample = () => {
  const { control, handleSubmit, setValue, watch, reset } =
    useForm<OrderFormData>({
      defaultValues: {
        customerName: '',
        productCode: '',
        productName: '',
        quantity: 1,
        unitPrice: 0,
      },
    })

  const productDialog = useProductSearchDialog({
    onProductSelect: (product: ProductType) => {
      // Auto-fill form fields when product is selected
      setValue('productCode', product.codigo)
      setValue('productName', product.nombre)
      setValue('unitPrice', product.precio1 || 0)
    },
  })

  const onSubmit = (data: OrderFormData) => {
    console.log('Form submitted:', data)
    alert(`Pedido creado:\n${JSON.stringify(data, null, 2)}`)
  }

  const watchedProductCode = watch('productCode')
  const watchedProductName = watch('productName')

  const handleClearProduct = () => {
    setValue('productCode', '')
    setValue('productName', '')
    setValue('unitPrice', 0)
    productDialog.clearSelection()
  }

  return (
    <Box>
      <Card>
        <CardHeader title="Ejemplo: Integración con Formulario" />
        <CardContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Este ejemplo muestra cómo integrar el ProductSearchDialog con
            react-hook-form para auto-completar campos del formulario cuando se
            selecciona un producto.
          </Alert>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="customerName"
                  control={control}
                  rules={{ required: 'El nombre del cliente es requerido' }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Nombre del Cliente"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="productCode"
                  control={control}
                  rules={{ required: 'El código del producto es requerido' }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Código del Producto"
                      error={!!error}
                      helperText={error?.message}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <Box display="flex" gap={1}>
                            <Button
                              size="small"
                              onClick={productDialog.openDialog}
                              variant="outlined"
                            >
                              Buscar
                            </Button>
                            {watchedProductCode && (
                              <Button
                                size="small"
                                onClick={handleClearProduct}
                                color="error"
                              >
                                Limpiar
                              </Button>
                            )}
                          </Box>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="productName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Nombre del Producto"
                      InputProps={{ readOnly: true }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="quantity"
                  control={control}
                  rules={{
                    required: 'La cantidad es requerida',
                    min: {
                      value: 1,
                      message: 'La cantidad debe ser mayor a 0',
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Cantidad"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="unitPrice"
                  control={control}
                  rules={{
                    required: 'El precio es requerido',
                    min: {
                      value: 0,
                      message: 'El precio debe ser mayor o igual a 0',
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Precio Unitario"
                      error={!!error}
                      helperText={error?.message}
                      InputProps={{
                        startAdornment: <span>$</span>,
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!watchedProductCode || !watchedProductName}
                  >
                    Crear Pedido
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => {
                      reset()
                      productDialog.clearSelection()
                    }}
                  >
                    Limpiar Formulario
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>

          {productDialog.selectedProduct && (
            <Alert severity="success" sx={{ mt: 3 }}>
              <strong>Producto seleccionado:</strong>{' '}
              {productDialog.selectedProduct.nombre}(
              {productDialog.selectedProduct.codigo})
            </Alert>
          )}
        </CardContent>
      </Card>

      <ProductSearchDialog
        open={productDialog.dialogOpen}
        onClose={productDialog.closeDialog}
        onSelectProduct={productDialog.handleSelectProduct}
        title="Seleccionar Producto para el Pedido"
      />
    </Box>
  )
}

export default ProductSearchWithFormExample
