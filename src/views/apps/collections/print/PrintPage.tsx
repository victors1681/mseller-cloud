// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Demo Components Imports
import PreviewCard from 'src/views/apps/collections/preview/PreviewCard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSingleCollectionData } from 'src/store/apps/collections'

import { ReporteEntrega } from 'src/types/apps/transportType'
import { AppDispatch, RootState } from 'src/store'

interface DocumentPreviewProps {
  id: string
}

const InvoicePreview = ({ id }: DocumentPreviewProps) => {
  // ** State
  const [error, setError] = useState<boolean>(false)
  //const [data, setData] = useState<null | ReporteEntrega>(null)

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.collections)
  const data = store.collectionData
  const initRequest = async () => {
    try {
      dispatch(fetchSingleCollectionData(id))

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

  if (data) {
    return (
      <>
        <PreviewCard collection={data} />
      </>
    )
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="error">
            Depósito: {id} no existe. Por favor diríjase al listado de
            depósitos: <Link href="/apps/collections/list">Depósitos</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default InvoicePreview
