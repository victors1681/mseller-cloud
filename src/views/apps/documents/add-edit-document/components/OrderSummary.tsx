import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import React from 'react'
import formatCurrency from 'src/utils/formatCurrency'

interface OrderSummaryProps {
  orderCalculations: {
    cantidadItems: number
    subtotal: number
    descuentoTotal: number
    impuestoTotal: number
    total: number
    iscTotal?: number
    advTotal?: number
  }
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderCalculations,
}) => {
  // ** Responsive
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title="Resumen del Pedido"
          sx={{
            pb: isMobile ? 1 : 2,
            '& .MuiCardHeader-title': {
              fontSize: isMobile ? '1.125rem' : '1.25rem',
            },
          }}
        />
        <CardContent sx={{ pt: 0, px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
          <Grid container spacing={isMobile ? 2 : 3}>
            {/* Items Count */}
            <Grid item xs={6} sm={4} md={2.4}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: isMobile ? 1 : 2,
                  borderRadius: 1,
                  bgcolor: isMobile ? 'action.hover' : 'transparent',
                }}
              >
                <Typography
                  variant={isMobile ? 'h5' : 'h4'}
                  color="primary"
                  fontWeight="bold"
                  sx={{ fontSize: isMobile ? '1.5rem' : '2.125rem' }}
                >
                  {orderCalculations.cantidadItems}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                >
                  Items
                </Typography>
              </Box>
            </Grid>

            {/* Subtotal */}
            <Grid item xs={6} sm={4} md={2.4}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: isMobile ? 1 : 2,
                  borderRadius: 1,
                  bgcolor: isMobile ? 'action.hover' : 'transparent',
                }}
              >
                <Typography
                  variant={isMobile ? 'body1' : 'h6'}
                  fontWeight="medium"
                  sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}
                >
                  {formatCurrency(orderCalculations.subtotal)}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                >
                  Subtotal
                </Typography>
              </Box>
            </Grid>

            {/* Discount */}
            <Grid item xs={6} sm={4} md={2.4}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: isMobile ? 1 : 2,
                  borderRadius: 1,
                  bgcolor: isMobile ? 'action.hover' : 'transparent',
                }}
              >
                <Typography
                  variant={isMobile ? 'body1' : 'h6'}
                  fontWeight="medium"
                  color="success.main"
                  sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}
                >
                  {formatCurrency(orderCalculations.descuentoTotal)}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                >
                  Descuento
                </Typography>
              </Box>
            </Grid>

            {/* Taxes */}
            <Grid item xs={6} sm={4} md={2.4}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: isMobile ? 1 : 2,
                  borderRadius: 1,
                  bgcolor: isMobile ? 'action.hover' : 'transparent',
                }}
              >
                <Typography
                  variant={isMobile ? 'body1' : 'h6'}
                  fontWeight="medium"
                  color="warning.main"
                  sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}
                >
                  {formatCurrency(orderCalculations.impuestoTotal)}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                >
                  Impuestos
                </Typography>
              </Box>
            </Grid>

            {/* Total */}
            <Grid item xs={12} sm={8} md={2.4}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: isMobile ? 2 : 2,
                  borderRadius: 1,
                  bgcolor: isMobile ? 'primary.light' : 'transparent',
                  border: isMobile
                    ? `1px solid ${theme.palette.primary.main}`
                    : 'none',
                  mt: isMobile ? 1 : 0,
                }}
              >
                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  fontWeight="bold"
                  color="primary"
                  sx={{ fontSize: isMobile ? '1.25rem' : '1.5rem' }}
                >
                  {formatCurrency(orderCalculations.total)}
                </Typography>
                <Typography
                  variant="body2"
                  color={isMobile ? 'primary.dark' : 'textSecondary'}
                  sx={{
                    fontSize: isMobile ? '0.875rem' : '0.875rem',
                    fontWeight: isMobile ? 'medium' : 'normal',
                  }}
                >
                  Total
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}
