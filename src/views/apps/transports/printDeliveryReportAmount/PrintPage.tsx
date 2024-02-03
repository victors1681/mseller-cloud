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
import PreviewCard from 'src/views/apps/transports/preview/PreviewCardAmount'
import {
  deliveryReportAmount,
  fetchTransportDocsData,
} from 'src/store/apps/transports'
import { AsyncThunkAction, Dispatch, AnyAction } from '@reduxjs/toolkit'
import {
  DocumentoEntregaResponse,
  ReporteEntrega,
  ReporteEntregaMonto,
} from 'src/types/apps/transportType'
import { RootState } from 'src/store'
import { useSelector } from 'react-redux'

interface DocumentPreviewProps {
  id: string
}

const InvoicePreview = ({ id }: DocumentPreviewProps) => {
  // ** State
  const [error, setError] = useState<boolean>(false)
  const [data, setData] = useState<null | ReporteEntregaMonto>(null)
  const [addPaymentOpen, setAddPaymentOpen] = useState<boolean>(false)
  const [sendInvoiceOpen, setSendInvoiceOpen] = useState<boolean>(false)

  const initRequest = async () => {
    try {
      let responseInfo = await deliveryReportAmount(id)
      setData(responseInfo)
      setTimeout(() => {
        window.print()
      }, 500)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    initRequest()
  }, [id])

  const toggleSendInvoiceDrawer = () => setSendInvoiceOpen(!sendInvoiceOpen)
  const toggleAddPaymentDrawer = () => setAddPaymentOpen(!addPaymentOpen)

  if (data) {
    return (
      <>
        <PreviewCard data={data} />
      </>
    )
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="error">
            Transporte: {id} no existe. Por favor diríjase al listado de
            transportes: <Link href="/apps/transports/list">Transportes</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default InvoicePreview
