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
import { SingleInvoiceType, InvoiceLayoutProps } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import PreviewCard from 'src/views/apps/transports/preview/PreviewCard'
import PreviewActions from 'src/views/apps/transports/preview/PreviewActions'
import AddPaymentDrawer from 'src/views/apps/transports/shared-drawer/AddPaymentDrawer'
import SendtransportsDrawer from 'src/views/apps/transports/shared-drawer/SendInvoiceDrawer'
import { DocumentoEntregaType } from 'src/types/apps/transportType'

const InvoicePreview = ({ noTransporte }: InvoiceLayoutProps) => {
  // ** State
  const [error, setError] = useState<boolean>(false)
  const [data, setData] = useState<null | DocumentoEntregaType[]>(null)
  const [addPaymentOpen, setAddPaymentOpen] = useState<boolean>(false)
  const [sendInvoiceOpen, setSendInvoiceOpen] = useState<boolean>(false)

  useEffect(() => {
    axios
      .get('/api/transport/single-transport', { params: { noTransporte } })
      .then(res => {
        setData(res.data)
        setError(false)
      })
      .catch(() => {
        setData(null)
        setError(true)
      })
  }, [noTransporte])

  const toggleSendInvoiceDrawer = () => setSendInvoiceOpen(!sendInvoiceOpen)
  const toggleAddPaymentDrawer = () => setAddPaymentOpen(!addPaymentOpen)

  if (data) {
    return (
      <>
        <Grid container spacing={6}>
          <Grid item xl={9} md={8} xs={12}>
            <PreviewCard data={data[0]} />
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <PreviewActions
              id={noTransporte}
              toggleAddPaymentDrawer={toggleAddPaymentDrawer}
              toggleSendInvoiceDrawer={toggleSendInvoiceDrawer}
            />
          </Grid>
        </Grid>
        <SendtransportsDrawer open={sendInvoiceOpen} toggle={toggleSendInvoiceDrawer} />
        <AddPaymentDrawer open={addPaymentOpen} toggle={toggleAddPaymentDrawer} />
      </>
    )
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Invoice with the id: {noTransporte} does not exist. Please check the list of invoices:{' '}
            <Link href='/apps/invoice/list'>Invoice List</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default InvoicePreview
