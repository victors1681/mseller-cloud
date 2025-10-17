// ** React Imports

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'

// ** Third Party Imports

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Imports
import { ProductType } from 'src/types/apps/productTypes'

// ** Component Imports
import PriceDisplay from 'src/views/apps/products/list/PriceDisplay'

interface ProductCardProps {
  product: ProductType
  onViewDetails: (product: ProductType) => void
}

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-2px)',
  },
  cursor: 'pointer',
}))

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  minWidth: 24,
  height: 24,
  fontSize: '0.75rem',
  '& .MuiChip-label': {
    padding: '0 6px',
  },
  backgroundColor:
    status === 'A' ? theme.palette.success.main : theme.palette.error.main,
  color: theme.palette.common.white,
}))

const ActionButton = styled(IconButton)(({ theme }) => ({
  width: 40,
  height: 40,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    boxShadow: theme.shadows[4],
  },
}))

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const theme = useTheme()

  const handleCardClick = () => {
    onViewDetails(product)
  }

  return (
    <StyledCard onClick={handleCardClick}>
      <Box sx={{ position: 'relative' }}>
        <StatusChip
          status={product.status}
          label={product.status === 'A' ? '✓' : '✗'}
          size="small"
        />

        <CardContent sx={{ pb: 1 }}>
          {/* Product Code and Name */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'primary.main',
                mb: 0.5,
              }}
            >
              {product.codigo}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'text.primary',
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {product.nombre}
            </Typography>
          </Box>

          {/* Category and Area */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block' }}
            >
              {product.area} - ID: {product.iDArea}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Product Details Grid */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Unidad
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {product.unidad}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Empaque
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {product.empaque}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Factor
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {product.factor}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Impuesto
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {product.impuesto}%
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          {/* Prices */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: 'block' }}
            >
              Precios
            </Typography>
            <PriceDisplay
              defaultPrice={product.precio1}
              prices={[
                product.precio2,
                product.precio3,
                product.precio4,
                product.precio5,
              ]}
            />
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              pt: 1,
            }}
          >
            <Tooltip title="Ver Detalle">
              <ActionButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewDetails(product)
                }}
              >
                <Icon icon="mdi:eye-outline" fontSize="1.25rem" />
              </ActionButton>
            </Tooltip>

            <Tooltip title="Editar Producto">
              <Link href={`/apps/products/add/${product.codigo}`} passHref>
                <ActionButton size="small" onClick={(e) => e.stopPropagation()}>
                  <Icon icon="tabler:edit" fontSize="1.25rem" />
                </ActionButton>
              </Link>
            </Tooltip>
          </Box>
        </CardContent>
      </Box>
    </StyledCard>
  )
}

export default ProductCard
