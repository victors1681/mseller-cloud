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
import { useGoBack } from 'src/hooks/useGoBack'
import { AppDispatch } from 'src/store'
import { changeDocumentStatus } from 'src/store/apps/documents'
import {
  DocumentStatus,
  DocumentType,
  TipoDocumentoEnum,
} from 'src/types/apps/documentTypes'

// ** Document Renderer Component
import { DocumentRendererModal } from 'src/views/ui/documentRenderer'

interface Props {
  data: DocumentType
}

const PreviewActions = ({ data }: Props) => {
  const navigation = useGoBack('/apps/documents/list', true)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [showPrintModal, setShowPrintModal] = useState(false)

  const handlePrint = () => {
    setShowPrintModal(true)
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
          sx={{ mb: 3.5 }}
          color="secondary"
          variant="outlined"
          onClick={handlePrint}
          startIcon={<Icon icon="mdi:printer" />}
        >
          Imprimir
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

      {/* Document Print Modal */}
      <DocumentRendererModal
        open={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        documentNo={data.noPedidoStr}
        tipoDocumento={data.tipoDocumento as any}
        autoPrint={true}
        showPreview={false}
      />
    </Card>
  )
}

export default PreviewActions
