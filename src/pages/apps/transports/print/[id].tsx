// ** Next Import
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next/types'

// ** Third Party Imports
import axios from 'axios'

// ** Demo Components Imports
import Print from 'src/views/apps/transports/print/PrintPage'

const InvoicePrint = ({
  id,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <Print id={id} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const res = await axios.get('/apps/invoice/invoices')
  // const data: InvoiceType[] = await res.data.allData
  const data = [] as any
  const paths = data.map((item: any) => ({
    params: { id: `${item.id}` },
  }))

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = ({
  params,
}: GetStaticPropsContext) => {
  return {
    props: {
      id: params?.id,
    },
  }
}

export default InvoicePrint
