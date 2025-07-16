import React from 'react'
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
} from '@mui/material'
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
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title="Resumen del Pedido" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {orderCalculations.cantidadItems}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Items
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" fontWeight="medium">
                  {formatCurrency(orderCalculations.subtotal)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Subtotal
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography
                  variant="h6"
                  fontWeight="medium"
                  color="success.main"
                >
                  {formatCurrency(orderCalculations.impuestoTotal)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Impuestos
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {formatCurrency(orderCalculations.total)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
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
