import { useState, useRef } from 'react'
import { UseFormSetValue, UseFormReset } from 'react-hook-form'
import toast from 'react-hot-toast'
import { DocumentTypeDetail } from 'src/types/apps/documentTypes'
import { NewDetailForm } from '../types'
import {
  defaultDetailFormValues,
  defaultDetailControlValues,
} from '../defaults'

interface UseDetailManagementProps {
  detailsData: DocumentTypeDetail[]
  setDetailsData: (details: DocumentTypeDetail[]) => void
  newDetailForm: NewDetailForm
  setNewDetailForm: (
    form: NewDetailForm | ((prev: NewDetailForm) => NewDetailForm),
  ) => void
  setDetailValue: UseFormSetValue<any>
  resetDetailForm: UseFormReset<any>
  documentEditData: any
  clearProductSelection: () => void
}

export const useDetailManagement = ({
  detailsData,
  setDetailsData,
  newDetailForm,
  setNewDetailForm,
  setDetailValue,
  resetDetailForm,
  documentEditData,
  clearProductSelection,
}: UseDetailManagementProps) => {
  const [isEditingDetail, setIsEditingDetail] = useState<number | null>(null)
  const cantidadInputRef = useRef<HTMLInputElement>(null)

  const handleEditDetail = (detail: DocumentTypeDetail, index: number) => {
    setNewDetailForm({
      codigoProducto: detail.codigoProducto,
      cantidad: detail.cantidad,
      precio: detail.precio,
      descripcion: detail.descripcion,
      unidad: detail.unidad,
    })

    // Set the detail form values
    setDetailValue('codigoProducto', detail.codigoProducto)
    setDetailValue('cantidad', detail.cantidad)
    setDetailValue('precio', detail.precio)
    setIsEditingDetail(index)

    // Scroll to the detail form section and focus cantidad field
    setTimeout(() => {
      const detailFormSection = document.querySelector(
        '[data-section="detail-form"]',
      )
      if (detailFormSection) {
        detailFormSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }

      setTimeout(() => {
        if (cantidadInputRef.current) {
          cantidadInputRef.current.focus()
          cantidadInputRef.current.select()
        }
      }, 300)
    }, 100)
  }

  const handleDeleteDetail = (index: number) => {
    const updatedDetails = detailsData.filter((_, i) => i !== index)
    setDetailsData(updatedDetails)

    // If we're editing this detail, clear the form
    if (isEditingDetail === index) {
      setNewDetailForm(defaultDetailFormValues)
      resetDetailForm(defaultDetailControlValues)
      setIsEditingDetail(null)
    } else if (isEditingDetail !== null && isEditingDetail > index) {
      // Adjust editing index if needed
      setIsEditingDetail(isEditingDetail - 1)
    }

    toast.success('Línea de detalle eliminada')
  }

  const handleSaveDetail = () => {
    if (!newDetailForm.codigoProducto.trim()) {
      toast.error('El código del producto es requerido')
      return
    }

    if (newDetailForm.cantidad <= 0) {
      toast.error('La cantidad debe ser mayor a 0')
      return
    }

    if (newDetailForm.precio < 0) {
      toast.error('El precio no puede ser negativo')
      return
    }

    // Use original ID when editing, generate new ID when adding
    const detailId =
      isEditingDetail !== null
        ? detailsData[isEditingDetail]?.id || Date.now().toString()
        : undefined

    const newDetail: DocumentTypeDetail = {
      id: detailId,
      noPedidoStr: documentEditData?.noPedidoStr || '',
      noPedido: documentEditData?.noPedido || 0,
      codigoVendedor: documentEditData?.codigoVendedor || '',
      codigoProducto: newDetailForm.codigoProducto,
      cantidad: newDetailForm.cantidad,
      descripcion:
        newDetailForm.descripcion || `Producto ${newDetailForm.codigoProducto}`,
      precio: newDetailForm.precio,
      impuesto: 0,
      porcientoImpuesto: 0,
      descuento: 0,
      porcientoDescuento: 0,
      factor: 1,
      factorOriginal: 1,
      isc: 0,
      adv: 0,
      subTotal: newDetailForm.cantidad * newDetailForm.precio,
      editar: 1,
      productoRef: '',
      idArea: 0,
      grupoId: '',
      area: '',
      unidad: newDetailForm.unidad,
      tipoImpuesto: '',
      cantidadOriginal: newDetailForm.cantidad,
      promocion: false,
    }

    let updatedDetails: DocumentTypeDetail[]

    if (isEditingDetail !== null) {
      // Update existing detail
      updatedDetails = detailsData.map((detail, index) =>
        index === isEditingDetail ? newDetail : detail,
      )
      toast.success('Línea de detalle actualizada')
      setIsEditingDetail(null)
    } else {
      // Add new detail
      updatedDetails = [...detailsData, newDetail]
      toast.success('Línea de detalle agregada')
    }

    setDetailsData(updatedDetails)

    // Clear form
    setNewDetailForm(defaultDetailFormValues)
    resetDetailForm(defaultDetailControlValues)
    clearProductSelection()
  }

  const handleCancelEdit = () => {
    setNewDetailForm(defaultDetailFormValues)
    resetDetailForm(defaultDetailControlValues)
    setIsEditingDetail(null)
    clearProductSelection()
  }

  return {
    isEditingDetail,
    cantidadInputRef,
    handleEditDetail,
    handleDeleteDetail,
    handleSaveDetail,
    handleCancelEdit,
  }
}
