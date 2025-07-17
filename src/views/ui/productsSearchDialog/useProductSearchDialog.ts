import { useState, useCallback } from 'react'
import { ProductType } from 'src/types/apps/productTypes'

type ExtendedProductType = ProductType & {
  selectedPrice?: number
  selectedPriceLabel?: string
}

interface UseProductSearchDialogReturn {
  dialogOpen: boolean
  selectedProduct: ExtendedProductType | null
  openDialog: () => void
  closeDialog: () => void
  handleSelectProduct: (product: ExtendedProductType) => void
  clearSelection: () => void
}

interface UseProductSearchDialogOptions {
  onProductSelect?: (product: ExtendedProductType) => void
  autoClose?: boolean
}

/**
 * Custom hook for managing ProductSearchDialog state and interactions
 *
 * @param options Configuration options for the dialog behavior
 * @returns Object with dialog state and control functions
 */
export const useProductSearchDialog = (
  options: UseProductSearchDialogOptions = {},
): UseProductSearchDialogReturn => {
  const { onProductSelect, autoClose = true } = options

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] =
    useState<ExtendedProductType | null>(null)

  const openDialog = useCallback(() => {
    setDialogOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setDialogOpen(false)
  }, [])

  const handleSelectProduct = useCallback(
    (product: ExtendedProductType) => {
      setSelectedProduct(product)

      // Call the optional callback
      if (onProductSelect) {
        onProductSelect(product)
      }

      // Auto-close dialog if enabled
      if (autoClose) {
        setDialogOpen(false)
      }
    },
    [onProductSelect, autoClose],
  )

  const clearSelection = useCallback(() => {
    setSelectedProduct(null)
  }, [])

  return {
    dialogOpen,
    selectedProduct,
    openDialog,
    closeDialog,
    handleSelectProduct,
    clearSelection,
  }
}

export default useProductSearchDialog
