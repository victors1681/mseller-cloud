import { useState, useCallback } from 'react'
import { CustomerType } from 'src/types/apps/customerType'

interface UseCustomerSearchDialogProps {
  onCustomerSelect?: (customer: CustomerType) => void
  autoClose?: boolean
}

interface UseCustomerSearchDialogReturn {
  dialogOpen: boolean
  openDialog: () => void
  closeDialog: () => void
  handleSelectCustomer: (customer: CustomerType) => void
  clearSelection: () => void
}

export const useCustomerSearchDialog = ({
  onCustomerSelect,
  autoClose = true,
}: UseCustomerSearchDialogProps = {}): UseCustomerSearchDialogReturn => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const openDialog = useCallback(() => {
    setDialogOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setDialogOpen(false)
  }, [])

  const handleSelectCustomer = useCallback(
    (customer: CustomerType) => {
      if (onCustomerSelect) {
        onCustomerSelect(customer)
      }

      if (autoClose) {
        setDialogOpen(false)
      }
    },
    [onCustomerSelect, autoClose],
  )

  const clearSelection = useCallback(() => {
    // This can be used to clear any selected state if needed
    // For now, it's just a placeholder for consistency with the product search dialog
  }, [])

  return {
    dialogOpen,
    openDialog,
    closeDialog,
    handleSelectCustomer,
    clearSelection,
  }
}
