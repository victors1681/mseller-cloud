import { useState } from 'react'
import { LegacyOfferDetailType } from '@/types/apps/offerType'
import toast from 'react-hot-toast'
import { UseFormSetValue } from 'react-hook-form'

export const useLegacyOfferDetailModal = () => {
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [editingDetailIndex, setEditingDetailIndex] = useState<number | null>(
    null,
  )
  const [detailInitialData, setDetailInitialData] = useState<
    LegacyOfferDetailType | undefined
  >(undefined)

  const openDetailModal = (currentDetails: LegacyOfferDetailType[]) => {
    const isFirstDetail = currentDetails.length === 0
    const detailValues: LegacyOfferDetailType = {
      id: undefined,
      idOferta: 0,
      codigoProducto: '',
      precio: 0,
      rangoInicial: 0,
      rangoFinal: 0,
      cantidadPromocion: 0,
      principal: isFirstDetail, // Set principal to true if it's the first detail
    }
    setDetailInitialData(detailValues)
    setEditingDetailIndex(null)
    setDetailModalOpen(true)
  }

  const editDetail = (
    index: number,
    currentDetails: LegacyOfferDetailType[],
  ) => {
    const detail = currentDetails[index]
    setDetailInitialData(detail)
    setEditingDetailIndex(index)
    setDetailModalOpen(true)
  }

  const deleteDetail = (
    index: number,
    currentDetails: LegacyOfferDetailType[],
    setValue: UseFormSetValue<any>,
  ) => {
    const detailToDelete = currentDetails[index]
    const remainingDetails = currentDetails.filter((_, i) => i !== index)

    // Check if we're trying to delete the only principal detail
    if (
      detailToDelete.principal &&
      remainingDetails.filter((d) => d.principal).length === 0
    ) {
      if (remainingDetails.length > 0) {
        toast.error(
          'No puede eliminar el único detalle principal. Debe haber al menos un detalle principal.',
        )
        return
      }
    }

    // Check if we're trying to delete a non-principal detail when there's only one left
    if (
      !detailToDelete.principal &&
      remainingDetails.filter((d) => !d.principal).length === 0
    ) {
      if (remainingDetails.filter((d) => d.principal).length > 0) {
        toast.error(
          'Debe mantener al menos un detalle no principal junto con el principal.',
        )
        return
      }
    }

    setValue('detalle', remainingDetails)
  }

  const closeDetailModal = () => {
    setDetailModalOpen(false)
    setEditingDetailIndex(null)
    setDetailInitialData(undefined)
  }

  const submitDetail = (
    data: LegacyOfferDetailType,
    currentDetails: LegacyOfferDetailType[],
    setValue: UseFormSetValue<any>,
    getOfferIdValue: () => string,
  ) => {
    const updatedDetails = [...currentDetails]

    if (editingDetailIndex !== null) {
      // Editing existing detail
      updatedDetails[editingDetailIndex] = {
        ...data,
        id: currentDetails[editingDetailIndex].id,
        idOferta: getOfferIdValue(),
      }
    } else {
      // Adding new detail
      const newDetail: LegacyOfferDetailType = {
        ...data,
        idOferta: undefined,
        // Set as principal if it's the first item, otherwise use the provided value
        principal: currentDetails.length === 0 ? true : data.principal,
      }
      updatedDetails.push(newDetail)
    }

    setValue('detalle', updatedDetails)
  }

  return {
    detailModalOpen,
    editingDetailIndex,
    detailInitialData,
    openDetailModal,
    editDetail,
    deleteDetail,
    closeDetailModal,
    submitDetail,
  }
}
