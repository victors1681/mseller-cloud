import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from 'src/store'
import {
  toggleEditDocument,
  fetchDocumentDetails,
} from 'src/store/apps/documents'
import { useAuth } from 'src/hooks/useAuth'
import { useOrderCalculations } from 'src/hooks/useOrderCalculations'
import { useProductSearchDialog } from 'src/views/ui/productsSearchDialog/useProductSearchDialog'
import { useCustomerSearchDialog } from 'src/views/ui/customerSearchDialog/useCustomerSearchDialog'
import { DocumentTypeDetail, DocumentType } from 'src/types/apps/documentTypes'
import { ProductType } from 'src/types/apps/productTypes'
import { CustomerType } from 'src/types/apps/customerType'
import { NewDetailForm, SelectedCustomerData } from '../types'
import {
  defaultDetailFormValues,
  defaultDetailControlValues,
} from '../defaults'
import { useDetailManagement } from './useDetailManagement'
import { useDocumentForm } from './useDocumentForm'
import { DocumentService } from '../services/documentService'

export const useEditDocument = (open: boolean) => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.documents)
  const auth = useAuth()

  // Local state
  const [detailsData, setDetailsData] = useState<DocumentTypeDetail[]>([])
  const [newDetailForm, setNewDetailForm] = useState<NewDetailForm>(
    defaultDetailFormValues,
  )
  const [selectedCustomerData, setSelectedCustomerData] =
    useState<SelectedCustomerData | null>(null)

  // Document service
  const documentService = new DocumentService(dispatch)

  // Order calculations
  const orderCalculations = useOrderCalculations({ details: detailsData })

  // Forms management
  const { mainForm, detailForm } = useDocumentForm({
    documentEditData: store.documentEditData,
    isCreateMode: store.isCreateMode,
    isLoadingDetails: store.isLoadingDetails,
    setDetailsData,
    setSelectedCustomerData,
  })

  // Product search dialog
  const productSearchDialog = useProductSearchDialog({
    onProductSelect: (
      product: ProductType & {
        selectedPrice?: number
        selectedPriceLabel?: string
      },
    ) => {
      detailForm.setValue('codigoProducto', product.codigo)
      const selectedPrice = product.selectedPrice || product.precio1 || 0

      setNewDetailForm((prev) => ({
        ...prev,
        codigoProducto: product.codigo,
        descripcion: product.nombre || `Producto ${product.codigo}`,
        unidad: product.unidad || 'UND',
        precio: selectedPrice,
      }))

      detailForm.setValue('precio', selectedPrice)

      setTimeout(() => {
        if (detailManagement.cantidadInputRef.current) {
          detailManagement.cantidadInputRef.current.focus()
          detailManagement.cantidadInputRef.current.select()
        }
      }, 200)
    },
    autoClose: true,
  })

  // Customer search dialog
  const customerSearchDialog = useCustomerSearchDialog({
    onCustomerSelect: (customer: CustomerType) => {
      mainForm.setValue('codigoCliente', customer.codigo)
      mainForm.setValue('codigoVendedor', customer.codigoVendedor)

      setSelectedCustomerData({
        nombreCliente: customer.nombre,
        vendedor: customer.vendedor
          ? {
              codigo: customer.codigoVendedor,
              nombre: customer.vendedor.nombre || '',
              email: customer.vendedor.email || '',
              status: customer.vendedor.status || '',
              localidad: customer.vendedor.localidad || 0,
            }
          : {
              codigo: customer.codigoVendedor,
              nombre: '',
              email: '',
              status: '',
              localidad: 0,
            },
      })
    },
    autoClose: true,
  })

  // Detail management
  const detailManagement = useDetailManagement({
    detailsData,
    setDetailsData,
    newDetailForm,
    setNewDetailForm,
    setDetailValue: detailForm.setValue,
    resetDetailForm: detailForm.reset,
    documentEditData: store.documentEditData,
    clearProductSelection: productSearchDialog.clearSelection,
  })

  // Watch for changes in the detail form
  const watchedDetailValues = detailForm.watch()

  // Sync detail form with newDetailForm state
  useEffect(() => {
    const currentFormValues = {
      codigoProducto: watchedDetailValues.codigoProducto || '',
      cantidad: watchedDetailValues.cantidad || 1,
      precio: watchedDetailValues.precio || 0,
    }

    if (
      currentFormValues.codigoProducto !== newDetailForm.codigoProducto ||
      currentFormValues.cantidad !== newDetailForm.cantidad ||
      currentFormValues.precio !== newDetailForm.precio
    ) {
      setNewDetailForm((prev) => ({
        ...prev,
        codigoProducto: currentFormValues.codigoProducto,
        cantidad: currentFormValues.cantidad,
        precio: currentFormValues.precio,
      }))
    }
  }, [
    watchedDetailValues.codigoProducto,
    watchedDetailValues.cantidad,
    watchedDetailValues.precio,
    newDetailForm.codigoProducto,
    newDetailForm.cantidad,
    newDetailForm.precio,
  ])

  // Fetch document details when dialog opens
  useEffect(() => {
    if (
      open &&
      store.documentEditData &&
      store.documentEditData.noPedidoStr &&
      !store.isCreateMode
    ) {
      dispatch(fetchDocumentDetails(store.documentEditData.noPedidoStr))
    }
  }, [open, store.documentEditData?.noPedidoStr, store.isCreateMode, dispatch])

  // Effect to log calculation changes (for debugging)
  useEffect(() => {
    if (detailsData.length > 0) {
      console.log('Order calculations updated:', {
        items: orderCalculations.cantidadItems,
        subtotal: orderCalculations.subtotal,
        discount: orderCalculations.descuentoTotal,
        tax: orderCalculations.impuestoTotal,
        total: orderCalculations.total,
      })
    }
  }, [orderCalculations, detailsData.length])

  const handleSubmit = async (data: Partial<DocumentType>) => {
    if (!store.isCreateMode && !store.documentEditData) {
      return { success: false, error: 'No hay datos de documento para editar' }
    }

    if (store.isCreateMode) {
      return await documentService.createDocument({
        formData: data,
        detailsData,
        orderCalculations,
        selectedCustomerData,
        userPhotoURL: auth.user?.photoURL,
      })
    } else {
      return await documentService.updateDocument({
        formData: data,
        documentEditData: store.documentEditData!,
        detailsData,
        orderCalculations,
      })
    }
  }

  const handleClose = () => {
    // Check if form is dirty (has unsaved changes)
    const isMainFormDirty = mainForm.formState.isDirty
    const hasUnsavedDetails = detailsData.length > 0
    const isDetailFormDirty = detailForm.formState.isDirty

    const hasUnsavedChanges =
      isMainFormDirty || hasUnsavedDetails || isDetailFormDirty

    if (hasUnsavedChanges) {
      const confirmClose = window.confirm(
        '¿Estás seguro de que quieres cerrar? Los cambios no guardados se perderán.',
      )

      if (!confirmClose) {
        return // Don't close if user cancels
      }
    }

    // Proceed with closing
    dispatch(toggleEditDocument(null))
    mainForm.reset()
    setDetailsData([])
    setNewDetailForm(defaultDetailFormValues)
    detailForm.reset(defaultDetailControlValues)
    detailManagement.isEditingDetail && detailManagement.handleCancelEdit()
    setSelectedCustomerData(null)
    productSearchDialog.clearSelection()
    customerSearchDialog.clearSelection()
  }

  return {
    // Store state
    store,

    // Local state
    detailsData,
    newDetailForm,
    selectedCustomerData,

    // Form state
    isDirty:
      mainForm.formState.isDirty ||
      detailsData.length > 0 ||
      detailForm.formState.isDirty,

    // Calculations
    orderCalculations,

    // Forms
    mainForm,
    detailForm,

    // Detail management
    detailManagement,

    // Dialogs
    productSearchDialog,
    customerSearchDialog,

    // Handlers
    handleSubmit,
    handleClose,
  }
}
