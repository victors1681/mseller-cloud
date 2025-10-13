// ** React Imports
import type { ReactElement } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Views
import CxcClientView from 'src/views/apps/cxc/CxcClientView'

const CxcClientPage = () => {
  const router = useRouter()
  const { codigoCliente } = router.query

  return <CxcClientView codigoCliente={codigoCliente as string} />
}

export default CxcClientPage
