// ** React Imports
import { ReactNode } from 'react'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Components Imports
import PrintPage from 'src/views/apps/transports/printDeliveryReportAmountV2/PrintPage'

const InvoicePrint = () => {
  return <PrintPage />
}

InvoicePrint.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

InvoicePrint.setConfig = () => {
  return {
    mode: 'light',
  }
}

export default InvoicePrint
