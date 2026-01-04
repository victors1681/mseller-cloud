import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from 'src/hooks/useAuth'
import { AppDispatch, RootState } from 'src/store'
import {
  fetchDocumentDetails,
  toggleEditDocument,
} from 'src/store/apps/documents'
import { CustomerType } from 'src/types/apps/customerType'
import { DocumentType, DocumentTypeDetail } from 'src/types/apps/documentTypes'
import { ProductType } from 'src/types/apps/productTypes'
import { useCustomerSearchDialog } from 'src/views/ui/customerSearchDialog/useCustomerSearchDialog'
import { useProductSearchDialog } from 'src/views/ui/productsSearchDialog/useProductSearchDialog'
import { defaultDetailFormValues } from '../defaults'
import { DocumentService } from '../services/documentService'
import { NewDetailForm, SelectedCustomerData } from '../types'
import { useDetailManagement } from './useDetailManagement'
import { useDocumentForm } from './useDocumentForm'
import { useOrderCalculations } from './useOrderCalculations'

export const useEditDocument = (open: boolean) => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.documents)
  const auth = useAuth()
  const router = useRouter()

  // Local state
  const [detailsData, setDetailsData] = useState<DocumentTypeDetail[]>([])
  const [newDetailForm, setNewDetailForm] = useState<NewDetailForm>(
    defaultDetailFormValues,
  )
  const [selectedCustomerData, setSelectedCustomerData] =
    useState<SelectedCustomerData | null>(null)
  const [hasBeenReset, setHasBeenReset] = useState(false)
  const [hasBeenSaved, setHasBeenSaved] = useState(false)
  const [savedDetailsCount, setSavedDetailsCount] = useState(0)

  // Get document type from query parameter
  const createDocumentType = router.query.createDocumentType as string

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
    createDocumentType,
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
      mainForm.setValue(
        'condicionPago',
        customer.condicionPago?.condicionPago || customer.condicion || '',
      )

      setSelectedCustomerData({
        nombreCliente: customer.nombre,
        condicionPago: customer.condicionPago
          ? {
              condicionPago: customer.condicion || '',
              id: customer.condicionPago.id,
              dias: 0,
              tipo_condicion: '',
              descripcion: '',
            }
          : {
              id: 0,
              condicionPago: '',
              dias: 0,
              tipo_condicion: '',
              descripcion: '',
            },
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

  // Reset the hasBeenReset and hasBeenSaved flags when user starts making changes
  useEffect(() => {
    // Only reset flags if forms are actually dirty or details have changed from saved state
    const detailsHaveChanged = hasBeenSaved
      ? detailsData.length !== savedDetailsCount
      : detailsData.length > 0

    if (
      (hasBeenReset || hasBeenSaved) &&
      (mainForm.formState.isDirty ||
        detailForm.formState.isDirty ||
        detailsHaveChanged)
    ) {
      setHasBeenReset(false)
      setHasBeenSaved(false)
    }
  }, [
    hasBeenReset,
    hasBeenSaved,
    mainForm.formState.isDirty,
    detailForm.formState.isDirty,
    detailsData.length,
    savedDetailsCount,
  ])

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
  const resetFormState = useCallback(() => {
    // Clear all local state FIRST
    setDetailsData([])
    setNewDetailForm(defaultDetailFormValues)
    setSelectedCustomerData(null)
    setHasBeenReset(true) // Mark that we've reset the form

    // Clear edit state and dialogs
    detailManagement.isEditingDetail && detailManagement.handleCancelEdit()
    productSearchDialog.clearSelection()
    customerSearchDialog.clearSelection()

    // Reset both forms completely - this should clear isDirty
    mainForm.reset()
    detailForm.reset()

    console.log('Forms reset complete')
  }, [
    mainForm,
    detailForm,
    detailManagement,
    productSearchDialog,
    customerSearchDialog,
  ])

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

      // Mark forms as pristine after successful save
      if (result.success) {
        setHasBeenSaved(true)
        setSavedDetailsCount(detailsData.length)
        // Reset forms with current values to mark as not dirty
        mainForm.reset(mainForm.getValues())
        detailForm.reset(detailForm.getValues())
      }
    } else {
      result = await documentService.updateDocument({
        formData: data,
        documentEditData: store.documentEditData!,
        detailsData,
        orderCalculations,
      })

      // Mark forms as pristine after successful update
      if (result.success) {
        setHasBeenSaved(true)
        setSavedDetailsCount(detailsData.length)
        mainForm.reset(mainForm.getValues())
        detailForm.reset(detailForm.getValues())
      }
    }

    return result
  }

  const handleClose = useCallback(
    (skipDirtyCheck: boolean = false) => {
      // Check if form has unsaved changes using computed isDirty property
      if (!skipDirtyCheck) {
        const currentIsDirty =
          hasBeenReset || hasBeenSaved
            ? false
            : mainForm.formState.isDirty ||
              detailsData.length > 0 ||
              detailForm.formState.isDirty

        if (currentIsDirty) {
          const confirmClose = window.confirm(
            '¿Estás seguro de que quieres cerrar? Los cambios no guardados se perderán.',
          )

          if (!confirmClose) {
            return // Don't close if user cancels
          }
        }
      }

      // Reset forms FIRST to clear isDirty immediately
      resetFormState()

      // Clear query parameter when closing
      if (createDocumentType) {
        const { createDocumentType: _, ...queryWithoutDocType } = router.query
        router.push({
          pathname: router.pathname,
          query: queryWithoutDocType,
        })
      }

      // Proceed with closing
      dispatch(toggleEditDocument(null))
    },
    [
      dispatch,
      resetFormState,
      detailsData.length,
      createDocumentType,
      router,
      mainForm.formState.isDirty,
      detailForm.formState.isDirty,
      hasBeenReset,
      hasBeenSaved,
    ],
  )

  return {
    // Store state
    store,

    // Local state
    detailsData,
    newDetailForm,
    selectedCustomerData,

    // Form state - if we just reset or saved, don't consider it dirty until user makes changes
    isDirty:
      hasBeenReset || hasBeenSaved
        ? false
        : mainForm.formState.isDirty ||
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
