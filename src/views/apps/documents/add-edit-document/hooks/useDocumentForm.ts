import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TipoDocumentoEnum } from 'src/types/apps/documentTypes'
import { toLocalDateTimeString } from 'src/utils/dateUtils'
import { defaultDetailControlValues, defaultDocumentValues } from '../defaults'
import { documentFormSchema } from '../validation'

interface UseDocumentFormProps {
  documentEditData: any
  isCreateMode: boolean
  isLoadingDetails: boolean
  setDetailsData: (details: any[]) => void
  setSelectedCustomerData: (data: any) => void
  createDocumentType?: string
}

export const useDocumentForm = ({
  documentEditData,
  isCreateMode,
  isLoadingDetails,
  setDetailsData,
  setSelectedCustomerData,
  createDocumentType,
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
      const createValues = {
        ...defaultDocumentValues,
        // Set document type from query parameter if available
        tipoDocumento:
          (createDocumentType as TipoDocumentoEnum) ||
          defaultDocumentValues.tipoDocumento,
      }
      mainForm.reset(createValues)
      setDetailsData([])
      setSelectedCustomerData(null)
    } else if (documentEditData && !isLoadingDetails) {
      const editData = { ...documentEditData }

      // Format date for datetime-local input (convert UTC to local time)
      if (editData.fecha) {
        editData.fecha = toLocalDateTimeString(editData.fecha)
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
    createDocumentType,
    mainForm.reset,
    setDetailsData,
    setSelectedCustomerData,
  ])

  return {
    mainForm,
    detailForm,
  }
}
