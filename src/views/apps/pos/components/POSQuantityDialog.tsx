import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import { ProductType } from 'src/types/apps/productTypes'
import formatCurrency from 'src/utils/formatCurrency'

const StyledProductImage = styled(Box)(({ theme }) => ({
  width: 120,
  height: 120,
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    width: 100,
    height: 100,
  },
}))

const StyledQuantityControl = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  justifyContent: 'center',
  marginTop: theme.spacing(2),
}))

const StyledPriceDisplay = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
}))

interface POSQuantityDialogProps {
  open: boolean
  product: ProductType | null
  onClose: () => void
  onAddToCart: (product: ProductType, quantity: number, price: number) => void
}

const POSQuantityDialog: React.FC<POSQuantityDialogProps> = ({
  open,
  product,
  onClose,
  onAddToCart,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [quantity, setQuantity] = useState(1)
  const [selectedPrice, setSelectedPrice] = useState(0)

  useEffect(() => {
    if (product) {
      setQuantity(1)
      setSelectedPrice(product.precio1)
    }
  }, [product])

  if (!product) return null

  const getProductImage = (): string => {
    if (product.imagenes && product.imagenes.length > 0) {
      const defaultImage = product.imagenes.find(
        (img) => img.esImagenPredeterminada,
      )
      return defaultImage?.rutaPublica || product.imagenes[0]?.rutaPublica || ''
    }
    return ''
  }

  const getTotalStock = (): number => {
    return (
      product.existenciaAlmacen1 +
      product.existenciaAlmacen2 +
      product.existenciaAlmacen3 +
      product.existenciaAlmacen4 +
      product.existenciaAlmacen5 +
      product.existenciaAlmacen6 +
      product.existenciaAlmacen7
    )
  }

  const handleQuantityChange = (newQuantity: number) => {
    const totalStock = getTotalStock()
    // For services, allow any quantity >= 1. For products, limit by stock
    if (product.esServicio) {
      if (newQuantity >= 1) {
        setQuantity(newQuantity)
      }
    } else {
      if (newQuantity >= 1 && newQuantity <= totalStock) {
        setQuantity(newQuantity)
      }
    }
  }

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedPrice)
  }

  const productImage = getProductImage()
  const totalStock = getTotalStock()
  const subtotal = quantity * selectedPrice

  // Available prices (only Precio 1)
  const availablePrices = [{ label: 'Precio 1', value: product.precio1 }]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6">Agregar al Carrito</Typography>
          <IconButton onClick={onClose}>
            <Icon icon="mdi:close" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Product Image */}
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <StyledProductImage>
              {productImage ? (
                <img
                  src={productImage}
                  alt={product.nombre}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <Icon
                  icon="mdi:package-variant"
                  fontSize={48}
                  color={theme.palette.grey[400]}
                />
              )}
            </StyledProductImage>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} sm={8}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {product.nombre}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Código: {product.codigo}
            </Typography>

            {product.descripcion && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {product.descripcion}
              </Typography>
            )}

            {/* Only show stock for non-service products */}
            {product.esServicio && (
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
              >
                <Typography variant="body2">
                  Stock disponible:
                  <Typography
                    component="span"
                    color={totalStock > 0 ? 'success.main' : 'error.main'}
                    sx={{ fontWeight: 600, ml: 1 }}
                  >
                    {totalStock} {product.unidad}
                  </Typography>
                </Typography>
              </Box>
            )}

            {/* Price Selection - editable for non-service products */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Precio:
              </Typography>
              {product.esServicio ? (
                <TextField
                  type="number"
                  value={selectedPrice}
                  onChange={(e) => {
                    const newPrice = parseFloat(e.target.value) || 0
                    if (newPrice >= 0) {
                      setSelectedPrice(newPrice)
                    }
                  }}
                  fullWidth
                  inputProps={{
                    min: 0,
                    step: 0.01,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="body2">RD$</Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& input': {
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    },
                  }}
                />
              ) : (
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                >
                  {formatCurrency(product.precio1)}
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Quantity Control */}
          <Grid item xs={12}>
            <Typography
              variant="body2"
              sx={{ mb: 1, fontWeight: 600, textAlign: 'center' }}
            >
              Cantidad:
            </Typography>

            <StyledQuantityControl>
              <IconButton
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                size="large"
              >
                <Icon icon="mdi:minus" />
              </IconButton>

              <TextField
                value={quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value) || 1
                  handleQuantityChange(newQuantity)
                }}
                inputProps={{
                  style: {
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                  },
                  min: 1,
                  ...(product.esServicio ? {} : { max: totalStock }),
                }}
                sx={{ width: 100 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="caption" color="text.secondary">
                        {product.unidad}
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />

              <IconButton
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={!product.esServicio && quantity >= totalStock}
                size="large"
              >
                <Icon icon="mdi:plus" />
              </IconButton>
            </StyledQuantityControl>
          </Grid>

          {/* Price Summary */}
          <Grid item xs={12}>
            <StyledPriceDisplay>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Precio unitario: {formatCurrency(selectedPrice)}
              </Typography>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
                Total: {formatCurrency(subtotal)}
              </Typography>
            </StyledPriceDisplay>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} size="large">
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleAddToCart}
          disabled={!product.esServicio && totalStock === 0}
          size="large"
          startIcon={<Icon icon="mdi:cart-plus" />}
        >
          Agregar al Carrito
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default POSQuantityDialog
