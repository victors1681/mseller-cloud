import React from 'react'
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
} from '@mui/material'
import { InvoiceType } from 'src/types/apps/invoicesTypes'
import formatCurrency from 'src/utils/formatCurrency'

interface FinancialSummaryProps {
  totalAmountDue: number
  totalAmountDueToday: number
  overdue: InvoiceType[]
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  totalAmountDue,
  totalAmountDueToday,
  overdue,
}) => {
  return (
    <Card>
      <CardHeader
        title="Resumen Financiero"
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
              <Typography variant="body2" color="primary.contrastText">
                Total a Cobrar:
              </Typography>
              <Typography
                variant="h6"
                color="primary.contrastText"
                fontWeight="bold"
              >
                {formatCurrency(totalAmountDue)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="body2" color="warning.contrastText">
                Vence Hoy:
              </Typography>
              <Typography
                variant="h6"
                color="warning.contrastText"
                fontWeight="bold"
              >
                {formatCurrency(totalAmountDueToday)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
              <Typography variant="body2" color="error.contrastText">
                Facturas Vencidas:
              </Typography>
              <Typography
                variant="h6"
                color="error.contrastText"
                fontWeight="bold"
              >
                {overdue.length} facturas
              </Typography>
              <Typography variant="body2" color="error.contrastText">
                {formatCurrency(
                  overdue.reduce((sum, inv) => sum + inv.saldo_restante, 0),
                )}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FinancialSummary
