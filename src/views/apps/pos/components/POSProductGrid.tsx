import React from 'react'
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Skeleton,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import { ProductType } from 'src/types/apps/productTypes'
import formatCurrency from 'src/utils/formatCurrency'

const StyledProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
}))

const StyledProductImage = styled(CardMedia)(({ theme }) => ({
  height: 120,
  position: 'relative',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  [theme.breakpoints.down('sm')]: {
    height: 100,
  },
}))

const StyledProductInfo = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(1.5),
  '&:last-child': {
    paddingBottom: theme.spacing(1.5),
  },
}))

const StyledPriceBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(1),
}))

const StyledStockChip = styled(Box)<{ inStock: boolean }>(
  ({ theme, inStock }) => ({
    position: 'absolute',
    top: 8,
    right: 8,
    padding: '2px 8px',
    borderRadius: 12,
    fontSize: '0.75rem',
    fontWeight: 500,
    backgroundColor: inStock
      ? theme.palette.success.main
      : theme.palette.error.main,
    color: theme.palette.common.white,
  }),
)

interface POSProductGridProps {
  products: ProductType[]
  onProductSelect: (product: ProductType) => void
  isLoading: boolean
  isMobile: boolean
}

const POSProductGrid: React.FC<POSProductGridProps> = ({
  products,
  onProductSelect,
  isLoading,
  isMobile,
}) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const getProductImage = (product: ProductType): string => {
    if (product.imagenes && product.imagenes.length > 0) {
      const defaultImage = product.imagenes.find(
        (img) => img.esImagenPredeterminada,
      )
      return defaultImage?.rutaPublica || product.imagenes[0]?.rutaPublica || ''
    }
    return ''
  }

  const getTotalStock = (product: ProductType): number => {
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

  const isInStock = (product: ProductType): boolean => {
    return getTotalStock(product) > 0
  }

  const getGridColumns = () => {
    if (isSmallScreen) return 2
    if (isMobile) return 3
    return 4
  }

  // Sort products by name
  const sortedProducts = [...products].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, undefined, { sensitivity: 'base' }),
  )

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Grid item xs={6} sm={4} md={3} lg={3} key={index}>
            <Card>
              <Skeleton variant="rectangular" height={120} />
              <CardContent>
                <Skeleton variant="text" height={20} />
                <Skeleton variant="text" height={16} width="60%" />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 1,
                  }}
                >
                  <Skeleton variant="text" height={20} width="40%" />
                  <Skeleton variant="rectangular" width={30} height={30} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }

  if (products.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50vh',
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        <Icon icon="mdi:package-variant" fontSize={48} />
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          No se encontraron productos
        </Typography>
        <Typography variant="body2">
          Intenta cambiar los filtros o la búsqueda
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={2}>
      {sortedProducts.map((product) => {
        const productImage = getProductImage(product)
        const totalStock = getTotalStock(product)
        const inStock = isInStock(product)

        return (
          <Grid item xs={6} sm={4} md={3} lg={3} key={product.codigo}>
            <StyledProductCard onClick={() => onProductSelect(product)}>
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
                    fontSize={40}
                    color={theme.palette.grey[400]}
                  />
                )}

                <StyledStockChip inStock={inStock}>
                  {totalStock}
                </StyledStockChip>
              </StyledProductImage>

              <StyledProductInfo>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    minHeight: '2.6em',
                  }}
                >
                  {product.nombre}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.5 }}
                >
                  {product.codigo}
                </Typography>

                <StyledPriceBox>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {formatCurrency(product.precio1)}
                  </Typography>

                  <IconButton
                    size="small"
                    color="primary"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    <Icon icon="mdi:plus" fontSize={16} />
                  </IconButton>
                </StyledPriceBox>
              </StyledProductInfo>
            </StyledProductCard>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default POSProductGrid
