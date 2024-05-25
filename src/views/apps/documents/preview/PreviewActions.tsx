// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useGoBack } from 'src/hooks/useGoBack'
import { DocumentStatus, StatusParam } from 'src/types/apps/documentTypes'
import { changeDocumentStatus } from 'src/store/apps/documents'
import { AsyncThunkAction, Dispatch, AnyAction } from '@reduxjs/toolkit'
import { DocumentType } from 'src/types/apps/documentTypes'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import toast from 'react-hot-toast'
interface Props {
  data: DocumentType
}

const PreviewActions = ({ data }: Props) => {
  const navigation = useGoBack('/apps/documents/list', true)
  const dispatch = useDispatch<AppDispatch>()

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
          component={Link}
          color="secondary"
          variant="outlined"
          href={`#`}
          disabled={true}
        >
          Editar
        </Button>
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
