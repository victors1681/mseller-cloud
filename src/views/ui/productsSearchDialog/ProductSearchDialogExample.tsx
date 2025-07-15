import React, { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Alert,
} from '@mui/material'
import { ProductType } from 'src/types/apps/productTypes'
import ProductSearchDialog from 'src/views/ui/productsSearchDialog'

type ExtendedProductType = ProductType & {
  selectedPrice?: number
  selectedPriceLabel?: string
}

const ProductSearchDialogExample = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] =
    useState<ExtendedProductType | null>(null)

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleSelectProduct = (product: ExtendedProductType) => {
    setSelectedProduct(product)
    // Here you can do whatever you need with the selected product
    // For example, add it to a form, cart, etc.
    console.log('Selected product:', product)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
    }).format(amount)
  }

  return (
    <Box>
      <Card>
        <CardHeader title="Búsqueda de Productos" />
        <CardContent>
          <Box mb={3}>
            <Button
              variant="contained"
              onClick={handleOpenDialog}
              startIcon={<i className="ri-search-line" />}
            >
              Buscar Producto
            </Button>
          </Box>

          {selectedProduct && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Producto Seleccionado:
              </Typography>
              <Typography variant="body2">
                <strong>Código:</strong> {selectedProduct.codigo}
              </Typography>
              <Typography variant="body2">
                <strong>Nombre:</strong> {selectedProduct.nombre}
              </Typography>
              {selectedProduct.selectedPrice ? (
                <Typography variant="body2">
                  <strong>Precio Seleccionado:</strong>{' '}
                  {formatCurrency(selectedProduct.selectedPrice)}(
                  {selectedProduct.selectedPriceLabel})
                </Typography>
              ) : selectedProduct.precio1 > 0 ? (
                <Typography variant="body2">
                  <strong>Precio:</strong>{' '}
                  {formatCurrency(selectedProduct.precio1)}
                </Typography>
              ) : null}
              <Typography variant="body2">
                <strong>Inventario:</strong>{' '}
                {selectedProduct.existenciaAlmacen1.toLocaleString()} unidades
              </Typography>
              <Typography variant="body2">
                <strong>Estado:</strong>{' '}
                {selectedProduct.status === 'A' ? 'Activo' : 'Inactivo'}
              </Typography>
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary">
            Funcionalidades del diálogo:
          </Typography>
          <ul>
            <li>Búsqueda por código, nombre o descripción</li>
            <li>Búsqueda directa por código usando el formato: código#</li>
            <li>
              Tabla con información de productos (código, nombre, precio,
              inventario, estado)
            </li>
            <li>
              Selección de precios múltiples (precio1-precio5) mediante dropdown
            </li>
            <li>Visualización de inventario disponible (existenciaAlmacen1)</li>
            <li>Paginación para navegar entre resultados</li>
            <li>Selección de producto mediante click en fila o botón</li>
            <li>Indicador de carga durante las búsquedas</li>
          </ul>
        </CardContent>
      </Card>

      <ProductSearchDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSelectProduct={handleSelectProduct}
        title="Buscar y Seleccionar Producto"
      />
    </Box>
  )
}

export default ProductSearchDialogExample
