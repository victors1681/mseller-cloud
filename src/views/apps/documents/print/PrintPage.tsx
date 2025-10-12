// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'

// ** Third Party Components

// ** Types
import { DocumentType } from 'src/types/apps/documentTypes'

// ** Demo Components Imports
import restClient from 'src/configs/restClient'
import PreviewCard from 'src/views/apps/documents/preview/PreviewCard'

interface DocumentPreviewProps {
  id: string
}

const InvoicePreview = ({ id }: DocumentPreviewProps) => {
  // ** State
  const [error, setError] = useState<boolean>(false)
  const [data, setData] = useState<null | DocumentType>(null)
  const [addPaymentOpen, setAddPaymentOpen] = useState<boolean>(false)
  const [sendInvoiceOpen, setSendInvoiceOpen] = useState<boolean>(false)

  useEffect(() => {
    restClient
      .get('/api/portal/Pedido/detalle', { params: { noPedidoStr: id } })
      .then((res) => {
        setData(res.data)
        setError(false)
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
        setData(null)
        setError(true)
      })
  }, [id])

  useEffect(() => {
    setTimeout(() => {
      window.print()
    }, 500)
  }, [])

  if (data) {
    return (
      <>
        <PreviewCard data={data} />

        {/* <SendInvoiceDrawer
          open={sendInvoiceOpen}
          toggle={toggleSendInvoiceDrawer}
        /> */}
        {/* <AddPaymentDrawer
          open={addPaymentOpen}
          toggle={toggleAddPaymentDrawer}
        /> */}
      </>
    )
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="error">
            Documento: {id} no existe. Por favor diríjase al listado de
            documentos: <Link href="/apps/documents/list">Documentos</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default InvoicePreview
