import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Typography,
} from '@mui/material'
import React from 'react'
import Icon from 'src/@core/components/icon'
import { InvoiceType } from 'src/types/apps/invoicesTypes'
import formatCurrency from 'src/utils/formatCurrency'

interface FinancialSummaryProps {
  totalAmountDue: number
  totalAmountDueToday: number
  overdue: InvoiceType[]
}

// Helper component for financial metrics
const FinancialMetric: React.FC<{
  icon: string
  title: string
  amount: string
  subtitle?: string
  color: 'primary' | 'warning' | 'error' | 'success'
}> = ({ icon, title, amount, subtitle, color }) => (
  <Paper
    elevation={1}
    sx={{
      p: { xs: 2, sm: 3 },
      borderRadius: 1,
      background: `linear-gradient(135deg, ${color}.light, ${color}.main)`,
      color: `${color}.contrastText`,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: 40,
        height: 40,
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '0 0 0 40px',
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      <Avatar
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.2)',
          color: 'inherit',
          width: { xs: 40, sm: 48 },
          height: { xs: 40, sm: 48 },
        }}
      >
        <Icon icon={icon} fontSize="1.5rem" />
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            fontWeight: 500,
            mb: 0.5,
            opacity: 0.9,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            fontWeight: 700,
            lineHeight: 1.2,
            wordBreak: 'break-word',
          }}
        >
          {amount}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              opacity: 0.8,
              mt: 0.5,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  </Paper>
)

const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  totalAmountDue,
  totalAmountDueToday,
  overdue,
}) => {
  const overdueAmount = overdue.reduce(
    (sum, inv) => sum + inv.saldo_restante,
    0,
  )

  return (
    <Card sx={{ height: '100%', borderRadius: 1, boxShadow: 0 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'success.main', width: 40, height: 40 }}>
            <Icon icon="mdi:chart-line" />
          </Avatar>
        }
        title="Resumen Financiero"
        titleTypographyProps={{
          variant: 'h6',
          sx: {
            fontSize: { xs: '1rem', sm: '1.25rem' },
            fontWeight: 600,
          },
        }}
        sx={{
          pb: { xs: 1, sm: 2 },
          bgcolor: 'background.paper',
        }}
      />
      <CardContent sx={{ pt: { xs: 1, sm: 2 } }}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12}>
            <FinancialMetric
              icon="mdi:cash-multiple"
              title="Total a Cobrar"
              amount={formatCurrency(totalAmountDue)}
              color="primary"
            />
          </Grid>
          <Grid item xs={12}>
            <FinancialMetric
              icon="mdi:clock-alert"
              title="Vence Hoy"
              amount={formatCurrency(totalAmountDueToday)}
              color="warning"
            />
          </Grid>
          <Grid item xs={12}>
            <FinancialMetric
              icon="mdi:alert-circle"
              title="Facturas Vencidas"
              amount={formatCurrency(overdueAmount)}
              subtitle={`${overdue.length} facturas vencidas`}
              color="error"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FinancialSummary
