// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components
import axios from 'axios'

// ** Types
import { DocumentType } from 'src/types/apps/documentTypes'

// ** Demo Components Imports
import PreviewCard from 'src/views/apps/documents/preview/PreviewCard'
import restClient from 'src/configs/restClient'

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
            Pedido: {id} no existe. Por favor diríjase al listado de pedidos:{' '}
            <Link href="/apps/documents/list">Pedidos</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default InvoicePreview
