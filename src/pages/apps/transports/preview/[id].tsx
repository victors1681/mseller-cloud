// ** Next Import
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next/types'

// ** Third Party Imports
import axios from 'axios'

// ** Types
import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import Preview from 'src/views/apps/transports/preview/Preview'

const InvoicePreview = ({
  id,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <Preview noTransporte={id} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  //const res = await axios.get('/api/transport/transports')
  const data = [] //: InvoiceType[] = await res.data.allData

  const paths = data.map((item: InvoiceType) => ({
    params: { id: `${item.id}` },
  }))

  return {
    paths,
    fallback: false,
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

export default InvoicePreview
