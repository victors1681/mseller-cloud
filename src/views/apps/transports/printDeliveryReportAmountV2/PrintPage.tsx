// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Demo Components Imports
import PrintReportAmountV2 from './PrintReportAmountV2'
import { deliveryReportAmountV2 } from 'src/store/apps/transports'
import { ReporteEntregaMontoV2 } from 'src/types/apps/transportType'
import { useRouter } from 'next/router'

const PrintDeliveryReportAmount = () => {
  // ** State
  const [error, setError] = useState<boolean>(false)
  const [data, setData] = useState<null | ReporteEntregaMontoV2>(null)

  const router = useRouter()
  const noTransporte = router?.query?.noTransporte as string
  const paymentType = router?.query?.paymentType as string
  const sellerCode = router?.query?.sellerCode as string
  const customerType = router?.query?.customerType as string
  const localidades = router?.query?.localidades as string
  const distribuidores = router?.query?.distribuidores as string
  const fechaRango = router?.query?.fechaRango as string

  const initRequest = async () => {
    try {
      let responseInfo = await deliveryReportAmountV2(
        noTransporte,
        paymentType,
        sellerCode,
        customerType,
        localidades,
        distribuidores,
        fechaRango,
      )
      setData(responseInfo)
      setTimeout(() => {
        window.print()
      }, 500)
    } catch (err) {
      console.error(err)
      setError(true)
    }
  }

  useEffect(() => {
    initRequest()
  }, [
    noTransporte,
    paymentType,
    sellerCode,
    customerType,
    localidades,
    distribuidores,
    fechaRango,
  ])

  if (data) {
    return (
      <>
        <PrintReportAmountV2 data={data} />
      </>
    )
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="error">
            Transporte: {noTransporte} no existe. Por favor diríjase al listado
            de transportes:{' '}
            <Link href="/apps/transports/list">Transportes</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default PrintDeliveryReportAmount
