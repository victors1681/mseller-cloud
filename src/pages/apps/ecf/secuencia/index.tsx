// ** React Imports
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const SecuenciaECFIndex = () => {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the Secuencia ECF list page
    router.replace('/apps/ecf/secuencia/list')
  }, [router])

  return null
}

export default SecuenciaECFIndex
