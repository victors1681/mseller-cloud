import React from 'react'
import { Box, Button, TextField, Typography, Paper } from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomerSearchDialog from './index'
import { useCustomerSearchDialog } from './useCustomerSearchDialog'
import { CustomerType } from 'src/types/apps/customerType'

const CustomerSearchDialogExample: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<CustomerType | null>(null)

  const customerSearchDialog = useCustomerSearchDialog({
    onCustomerSelect: (customer: CustomerType) => {
      setSelectedCustomer(customer)
      console.log('Selected customer:', customer)
    },
    autoClose: true,
  })

  const handleClearSelection = () => {
    setSelectedCustomer(null)
    customerSearchDialog.clearSelection()
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Customer Search Dialog Example
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Basic Usage
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Icon icon="mdi:magnify" />}
            onClick={customerSearchDialog.openDialog}
          >
            Search Customer
          </Button>

          {selectedCustomer && (
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Icon icon="mdi:close" />}
              onClick={handleClearSelection}
            >
              Clear Selection
            </Button>
          )}
        </Box>

        {selectedCustomer ? (
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: 'success.light',
              borderRadius: 1,
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Selected Customer:
            </Typography>
            <Typography variant="body2">
              <strong>Code:</strong> {selectedCustomer.codigo}
            </Typography>
            <Typography variant="body2">
              <strong>Name:</strong> {selectedCustomer.nombre}
            </Typography>
            <Typography variant="body2">
              <strong>Phone:</strong> {selectedCustomer.telefono1 || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>City:</strong> {selectedCustomer.ciudad || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Status:</strong> {selectedCustomer.status || 'N/A'}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}
          >
            <Typography variant="body2" color="textSecondary">
              No customer selected. Click "Search Customer" to select one.
            </Typography>
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Integrated with TextField
        </Typography>

        <TextField
          fullWidth
          size="small"
          label="Customer Code"
          value={selectedCustomer?.codigo || ''}
          placeholder="Select a customer"
          InputProps={{
            readOnly: true,
            endAdornment: (
              <Button
                size="small"
                onClick={customerSearchDialog.openDialog}
                sx={{ minWidth: 'auto', p: 0.5 }}
              >
                <Icon icon="mdi:magnify" fontSize="1.25rem" />
              </Button>
            ),
          }}
        />

        {selectedCustomer && (
          <TextField
            fullWidth
            size="small"
            label="Customer Name"
            value={selectedCustomer.nombre}
            InputProps={{ readOnly: true }}
            sx={{ mt: 2 }}
          />
        )}
      </Paper>

      {/* Customer Search Dialog */}
      <CustomerSearchDialog
        open={customerSearchDialog.dialogOpen}
        onClose={customerSearchDialog.closeDialog}
        onSelectCustomer={customerSearchDialog.handleSelectCustomer}
        title="Search and Select Customer"
        maxWidth="lg"
      />
    </Box>
  )
}

export default CustomerSearchDialogExample
