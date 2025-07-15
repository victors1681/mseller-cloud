import React from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Alert,
  Grid,
  Chip,
} from '@mui/material'
import { ProductType } from 'src/types/apps/productTypes'
import ProductSearchDialog from 'src/views/ui/productsSearchDialog'
import { useProductSearchDialog } from 'src/views/ui/productsSearchDialog/useProductSearchDialog'

const ProductSearchDialogHookExample = () => {
  // Example 1: Basic usage with auto-close
  const basicDialog = useProductSearchDialog({
    onProductSelect: (product) => {
      console.log('Basic dialog - Selected product:', product)
    },
  })

  // Example 2: Advanced usage with manual close control
  const advancedDialog = useProductSearchDialog({
    autoClose: false,
    onProductSelect: (product) => {
      console.log('Advanced dialog - Selected product:', product)
      // You could perform validation here before closing
      setTimeout(() => {
        advancedDialog.closeDialog()
      }, 1000) // Close after 1 second
    },
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
    }).format(amount)
  }

  const ProductCard = ({
    product,
    title,
    onClear,
  }: {
    product: ProductType | null
    title: string
    onClear: () => void
  }) => (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={title}
        action={
          product && (
            <Button size="small" onClick={onClear}>
              Limpiar
            </Button>
          )
        }
      />
      <CardContent>
        {product ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              {product.nombre}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Código:</strong> {product.codigo}
            </Typography>
            {product.precio1 > 0 && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Precio:</strong> {formatCurrency(product.precio1)}
              </Typography>
            )}
            <Box mt={1}>
              <Chip
                label={product.status === 'A' ? 'Activo' : 'Inactivo'}
                color={product.status === 'A' ? 'success' : 'error'}
                size="small"
              />
            </Box>
            {product.descripcion && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {product.descripcion.replace(/<[^>]*>/g, '')}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography color="text.secondary">
            No hay producto seleccionado
          </Typography>
        )}
      </CardContent>
    </Card>
  )

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Ejemplos de Uso del Hook useProductSearchDialog" />
        <CardContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Este ejemplo demuestra cómo usar el hook `useProductSearchDialog`
            para gestionar el estado del diálogo de búsqueda de productos de
            manera más eficiente.
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box mb={2}>
                <Button
                  variant="contained"
                  onClick={basicDialog.openDialog}
                  startIcon={<i className="ri-search-line" />}
                  fullWidth
                >
                  Búsqueda Básica (Auto-cierre)
                </Button>
              </Box>
              <ProductCard
                product={basicDialog.selectedProduct}
                title="Producto Seleccionado - Básico"
                onClear={basicDialog.clearSelection}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box mb={2}>
                <Button
                  variant="outlined"
                  onClick={advancedDialog.openDialog}
                  startIcon={<i className="ri-search-2-line" />}
                  fullWidth
                >
                  Búsqueda Avanzada (Control Manual)
                </Button>
              </Box>
              <ProductCard
                product={advancedDialog.selectedProduct}
                title="Producto Seleccionado - Avanzado"
                onClear={advancedDialog.clearSelection}
              />
            </Grid>
          </Grid>

          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Características del Hook:
            </Typography>
            <ul>
              <li>
                <strong>Gestión de Estado:</strong> Maneja automáticamente el
                estado del diálogo y producto seleccionado
              </li>
              <li>
                <strong>Auto-cierre:</strong> Opción para cerrar automáticamente
                tras selección
              </li>
              <li>
                <strong>Callbacks:</strong> Ejecuta funciones personalizadas al
                seleccionar productos
              </li>
              <li>
                <strong>Control Manual:</strong> Permite control total sobre
                cuándo abrir/cerrar el diálogo
              </li>
              <li>
                <strong>Limpiar Selección:</strong> Función para limpiar el
                producto seleccionado
              </li>
            </ul>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog instances */}
      <ProductSearchDialog
        open={basicDialog.dialogOpen}
        onClose={basicDialog.closeDialog}
        onSelectProduct={basicDialog.handleSelectProduct}
        title="Búsqueda Básica de Productos"
      />

      <ProductSearchDialog
        open={advancedDialog.dialogOpen}
        onClose={advancedDialog.closeDialog}
        onSelectProduct={advancedDialog.handleSelectProduct}
        title="Búsqueda Avanzada de Productos"
        maxWidth="xl"
      />
    </Box>
  )
}

export default ProductSearchDialogHookExample
