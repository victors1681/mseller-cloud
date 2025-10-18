// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'
import { useGoBack } from 'src/hooks/useGoBack'
import { AppDispatch } from 'src/store'
import { changeDocumentStatus } from 'src/store/apps/documents'
import {
  DocumentStatus,
  DocumentType,
  TipoDocumentoEnum,
} from 'src/types/apps/documentTypes'

// ** PDF Generation Imports
import { EnhancedPDFGenerator } from 'src/services/pdf/client'
interface Props {
  data: DocumentType
}

const PreviewActions = ({ data }: Props) => {
  const navigation = useGoBack('/apps/documents/list', true)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const userData = useAuth()
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleGenerateAndSharePDF = async () => {
    setIsGeneratingPDF(true)
    try {
      await EnhancedPDFGenerator.downloadPDF(data, undefined, { userData })
      toast.success('PDF generado exitosamente')
    } catch (error) {
      console.error('PDF generation failed:', error)
      toast.error('Error al generar el PDF. Por favor intente de nuevo.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleApproval = async (
    noPedidoStr: string,
    status: DocumentStatus,
  ) => {
    const label =
      status === DocumentStatus.ReadyForIntegration
        ? 'Seguro que deseas aprobar este pedido?'
        : 'Seguro que deseas retener este pedido?'

    const result = window.confirm(label)

    // Check the user's choice
    if (result) {
      const payload = {
        noPedidoStr,
        status,
      }
      let response = await dispatch(changeDocumentStatus([payload]))
      if (response.meta.requestStatus === 'fulfilled') {
        navigation.goBack()
      } else {
        toast.error('Ha ocurrido un error por favor intentelo de nuevo.')
      }
    }
  }

  const handleCreateItemReturn = () => {
    // Navigate to item returns creation page with document number as URL parameter
    router.push(
      `/apps/documents/item-returns?documentNumber=${encodeURIComponent(
        data.noPedidoStr,
      )}`,
    )
  }

  return (
    <Card>
      <CardContent>
        <Button
          fullWidth
          sx={{ mb: 3.5 }}
          color="secondary"
          variant="outlined"
          onClick={navigation.goBack}
        >
          Cerrar
        </Button>
        <Button
          fullWidth
          target="_blank"
          sx={{ mb: 3.5 }}
          component={Link}
          color="secondary"
          variant="outlined"
          href={`/apps/documents/print/${data.noPedidoStr}`}
        >
          Imprimir
        </Button>
        <Button
          fullWidth
          sx={{ mb: 3.5 }}
          color="primary"
          variant="contained"
          onClick={handleGenerateAndSharePDF}
          disabled={isGeneratingPDF}
          startIcon={
            <Icon icon={isGeneratingPDF ? 'mdi:loading' : 'mdi:file-pdf-box'} />
          }
        >
          {isGeneratingPDF ? 'Generando PDF...' : 'Descargar / Compartir PDF'}
        </Button>
        <Button
          fullWidth
          sx={{ mb: 3.5 }}
          component={Link}
          color="secondary"
          variant="outlined"
          href={`#`}
          disabled={true}
        >
          Editar
        </Button>

        {/* Show Create Item Return button only for invoices */}
        {data.tipoDocumento === TipoDocumentoEnum.INVOICE && (
          <Button
            fullWidth
            sx={{ mb: 3.5 }}
            color="info"
            variant="contained"
            onClick={handleCreateItemReturn}
            startIcon={<Icon icon="mdi:package-variant-remove" />}
          >
            Crear Devolución
          </Button>
        )}

        <Button
          fullWidth
          color="success"
          variant="contained"
          sx={{ mb: 3.5 }}
          onClick={() =>
            handleApproval(data.noPedidoStr, DocumentStatus.ReadyForIntegration)
          }
          disabled={
            data.procesado === DocumentStatus.ReadyForIntegration ||
            data.procesado === DocumentStatus.Processed
          }
          startIcon={<Icon icon="material-symbols:order-approve-rounded" />}
        >
          Aprobar
        </Button>
        <Button
          fullWidth
          color="warning"
          sx={{ mb: 3.5 }}
          variant="contained"
          onClick={() =>
            handleApproval(data.noPedidoStr, DocumentStatus.Retained)
          }
          disabled={
            data.procesado === DocumentStatus.ReadyForIntegration ||
            data.procesado === DocumentStatus.Processed ||
            data.procesado === DocumentStatus.Retained
          }
          startIcon={<Icon icon="ph:x-fill" />}
        >
          Retener
        </Button>
      </CardContent>
    </Card>
  )
}

export default PreviewActions
