import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from 'src/store'
import {
  toggleEditDocument,
  fetchDocumentDetails,
} from 'src/store/apps/documents'
import { useAuth } from 'src/hooks/useAuth'
import { useOrderCalculations } from './useOrderCalculations'
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
import { toast } from 'react-hot-toast'

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
        porcientoDescuento?: number
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
        porcientoDescuento: product.porcientoDescuento || 0,
        porcientoImpuesto: product.impuesto || 0, // porcentaje from the product object
        factor: product.factor || 1,
        tipoImpuesto: product.tipoImpuesto || '',
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
      porcientoDescuento: watchedDetailValues.porcientoDescuento || 0,
    }

    if (
      currentFormValues.codigoProducto !== newDetailForm.codigoProducto ||
      currentFormValues.cantidad !== newDetailForm.cantidad ||
      currentFormValues.precio !== newDetailForm.precio ||
      currentFormValues.porcientoDescuento !== newDetailForm.porcientoDescuento
    ) {
      setNewDetailForm((prev) => ({
        ...prev,
        codigoProducto: currentFormValues.codigoProducto,
        cantidad: currentFormValues.cantidad,
        precio: currentFormValues.precio,
        porcientoDescuento: currentFormValues.porcientoDescuento || 0,
      }))
    }
  }, [
    watchedDetailValues.codigoProducto,
    watchedDetailValues.cantidad,
    watchedDetailValues.precio,
    watchedDetailValues.porcientoDescuento,
    newDetailForm.codigoProducto,
    newDetailForm.cantidad,
    newDetailForm.precio,
    newDetailForm.porcientoDescuento,
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
        detailsCount: detailsData.length,
      })
    }
  }, [orderCalculations, detailsData.length])

  // Reset form and state function
  const resetFormState = () => {
    mainForm.reset(undefined, {
      keepValues: false,
      keepDirty: false,
      keepDefaultValues: true,
    })
    setDetailsData([])
    setNewDetailForm(defaultDetailFormValues)
    detailForm.reset(undefined, {
      keepValues: false,
      keepDirty: false,
      keepDefaultValues: true,
    })

    detailManagement.isEditingDetail && detailManagement.handleCancelEdit()
    setSelectedCustomerData(null)
    productSearchDialog.clearSelection()
    customerSearchDialog.clearSelection()
  }

  const handleSubmit = async (data: Partial<DocumentType>) => {
    if (!store.isCreateMode && !store.documentEditData) {
      return { success: false, error: 'No hay datos de documento para editar' }
    }

    let result
    if (store.isCreateMode) {
      result = await documentService.createDocument({
        formData: data,
        detailsData,
        orderCalculations,
        selectedCustomerData,
        userPhotoURL: auth.user?.photoURL,
      })
    } else {
      result = await documentService.updateDocument({
        formData: data,
        documentEditData: store.documentEditData!,
        detailsData,
        orderCalculations,
      })
    }

    // Reset form state after successful operation
    if (result?.success) {
      toast.success('Documento guardado exitosamente')
      resetFormState()
    }

    return result
  }

  const handleClose = useCallback(() => {
    // Check if form is dirty (has unsaved changes)
    const isMainFormDirty = mainForm.formState.isDirty
    const isDetailFormDirty = detailForm.formState.isDirty
    const hasUnsavedChanges = isMainFormDirty || isDetailFormDirty

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
    resetFormState()
  }, [dispatch, resetFormState, detailsData])

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
