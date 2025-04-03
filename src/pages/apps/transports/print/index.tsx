// ** React Imports
import { ReactNode } from 'react'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Components Imports
import PrintPage from 'src/views/apps/transports/print/PrintPage'
import { useRouter } from 'next/router'

const InvoicePrint = () => {
  const router = useRouter()
  const {
    noTransporte,
    codigoVendedor,
    localidades,
    distribuidores,
    fechaRango,
    promocionesOnly,
  } = router.query

  return (
    <PrintPage
      noTransporte={
        Array.isArray(noTransporte) ? noTransporte[0] : noTransporte
      }
      codigoVendedor={
        Array.isArray(codigoVendedor) ? codigoVendedor[0] : codigoVendedor
      }
      localidades={Array.isArray(localidades) ? localidades[0] : localidades}
      distribuidores={
        Array.isArray(distribuidores) ? distribuidores[0] : distribuidores
      }
      fechaRango={Array.isArray(fechaRango) ? fechaRango[0] : fechaRango}
      promocionesOnly={promocionesOnly === 'true'}
    />
  )
}

InvoicePrint.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

InvoicePrint.setConfig = () => {
  return {
    mode: 'light',
  }
}

export default InvoicePrint
