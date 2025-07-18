// ** React Imports
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const ECFIndex = () => {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the ECF list page
    router.replace('/apps/ecf/integration/list')
  }, [router])

  return null
}

export default ECFIndex
