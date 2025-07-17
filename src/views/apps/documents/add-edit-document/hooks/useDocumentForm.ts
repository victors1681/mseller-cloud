import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { documentFormSchema } from '../validation'
import { defaultDocumentValues, defaultDetailControlValues } from '../defaults'
import { DocumentType } from 'src/types/apps/documentTypes'

interface UseDocumentFormProps {
  documentEditData: any
  isCreateMode: boolean
  isLoadingDetails: boolean
  setDetailsData: (details: any[]) => void
  setSelectedCustomerData: (data: any) => void
}

export const useDocumentForm = ({
  documentEditData,
  isCreateMode,
  isLoadingDetails,
  setDetailsData,
  setSelectedCustomerData,
}: UseDocumentFormProps) => {
  const mainForm = useForm({
    defaultValues: defaultDocumentValues,
    mode: 'onChange',
    resolver: yupResolver(documentFormSchema),
  })

  const detailForm = useForm({
    defaultValues: defaultDetailControlValues,
  })

  // Effect to handle form data updates
  useEffect(() => {
    if (isCreateMode) {
      // Reset to default values for create mode
      mainForm.reset(defaultDocumentValues)
      setDetailsData([])
      setSelectedCustomerData(null)
    } else if (documentEditData && !isLoadingDetails) {
      const editData = { ...documentEditData }

      // Format date for DatePicker
      if (editData.fecha) {
        const dateValue = new Date(editData.fecha).toISOString().split('T')[0]
        editData.fecha = dateValue
      }

      // Ensure localidadId is set from localidad object if available
      if (editData.localidad && !editData.localidadId) {
        editData.localidadId = editData.localidad.id || 0
      }

      // Sync details data
      setDetailsData(editData.detalle || [])

      // Clear any selected customer data when document data is loaded
      setSelectedCustomerData(null)

      mainForm.reset(editData)
    } else if (!isCreateMode) {
      mainForm.reset(defaultDocumentValues)
      setDetailsData([])
      setSelectedCustomerData(null)
    }
  }, [
    documentEditData,
    isLoadingDetails,
    isCreateMode,
    mainForm.reset,
    setDetailsData,
    setSelectedCustomerData,
  ])

  return {
    mainForm,
    detailForm,
  }
}
