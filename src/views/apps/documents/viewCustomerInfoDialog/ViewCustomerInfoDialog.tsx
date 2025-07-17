import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
} from '@mui/material'
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
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh', maxHeight: '90vh' },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            Información del Cliente - {customer?.nombre || codigoCliente}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Icon icon="mdi:close" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Customer Information */}
          <Grid item xs={12} md={6}>
            <CustomerGeneralInfo
              customer={customer}
              isLoading={clientStore.isLoading}
            />
          </Grid>

          {/* Financial Summary */}
          <Grid item xs={12} md={6}>
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
