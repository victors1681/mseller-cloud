// ** Next Import
import { GetServerSidePropsContext } from 'next/types'

// ** Component Import
import PrintAuditReport from 'src/views/apps/ecf/audit/print/PrintAuditReport'

const EcfAuditPrintPage = () => {
  return <PrintAuditReport />
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {},
  }
}

export default EcfAuditPrintPage
