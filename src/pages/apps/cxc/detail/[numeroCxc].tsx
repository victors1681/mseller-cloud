// ** React Imports
import type { ReactElement } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'


// ** Views
import CxcDetailView from 'src/views/apps/cxc/CxcDetailView'

const CxcDetailPage = () => {
  const router = useRouter()
  const { numeroCxc } = router.query

  return <CxcDetailView numeroCxc={numeroCxc as string} />
}

export default CxcDetailPage
