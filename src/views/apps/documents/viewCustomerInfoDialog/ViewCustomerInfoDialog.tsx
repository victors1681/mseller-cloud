import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import React from 'react'
import Icon from 'src/@core/components/icon'
import {
  CustomerGeneralInfo,
  FinancialSummary,
  InvoicesList,
  useCustomerInfo,
} from './index'

interface ViewCustomerInfoDialogProps {
  open: boolean
  onClose: () => void
  codigoCliente: string
}

const ViewCustomerInfoDialog: React.FC<ViewCustomerInfoDialogProps> = ({
  open,
  onClose,
  codigoCliente,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))

  const {
    customer,
    clientStore,
    invoiceStore,
    totalAmountDue,
    totalAmountDueToday,
    overdue,
  } = useCustomerInfo({ open, codigoCliente })

  const handleClose = () => {
    onClose()
  }

  if (!open) return null

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={isMobile ? 'sm' : 'xl'}
      fullWidth
      fullScreen={isSmall}
      PaperProps={{
        sx: {
          minHeight: isSmall ? '100vh' : '70vh',
          maxHeight: isSmall ? '100vh' : '90vh',
          margin: isSmall ? 0 : 2,
        },
      }}
    >
      <DialogTitle sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'background.paper' }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={{ xs: 1, sm: 0 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon
              icon="mdi:account-circle"
              fontSize="2rem"
              color="primary.main"
            />
            <Typography
              variant={isSmall ? 'h6' : 'h6'}
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                textAlign: { xs: 'center', sm: 'left' },
                wordBreak: 'break-word',
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              Información del Cliente
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                fontWeight: 500,
              }}
            >
              {customer?.nombre || codigoCliente}
            </Typography>
            <IconButton
              onClick={handleClose}
              size={isSmall ? 'medium' : 'small'}
              sx={{
                minWidth: 44,
                minHeight: 44,
                bgcolor: 'action.hover',
                '&:hover': {
                  bgcolor: 'action.selected',
                },
              }}
            >
              <Icon icon="mdi:close" />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: { xs: 1, sm: 2, md: 3 },
          overflow: 'auto',
        }}
      >
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Customer Information */}
          <Grid item xs={12} lg={6}>
            <CustomerGeneralInfo
              customer={customer}
              isLoading={clientStore.isLoading}
            />
          </Grid>

          {/* Financial Summary */}
          <Grid item xs={12} lg={6}>
            <FinancialSummary
              totalAmountDue={totalAmountDue}
              totalAmountDueToday={totalAmountDueToday}
              overdue={overdue}
            />
          </Grid>

          {/* Invoices List */}
          <Grid item xs={12}>
            <InvoicesList
              invoices={invoiceStore.data || []}
              isLoading={invoiceStore.isLoading}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default ViewCustomerInfoDialog
