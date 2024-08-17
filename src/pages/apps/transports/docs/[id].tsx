// ** Next Import
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next/types'

// ** Types

// ** Demo Components Imports
import Docs from './index'
import { useRouter } from 'next/router'

const InvoicePreview = ({ id }: InferGetStaticPropsType<any>) => {
  const router = useRouter()
  const query = router.query
  console.log(query)
  return <Docs noTransporte={(query.id as string) || ''} />
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   //const res = await axios.get('/api/transport/transports')
//   const data = [] as any //: InvoiceType[] = await res.data.allData

//   const paths = data.map((item: any) => ({
//     params: { id: `${item.id}` },
//   }))

//   return {
//     paths,
//     fallback: true,
//   }
// }

// export const getStaticProps: GetStaticProps = ({
//   params,
// }: GetStaticPropsContext) => {
//   return {
//     props: {
//       id: params?.id,
//     },
//   }
// }

export default InvoicePreview
