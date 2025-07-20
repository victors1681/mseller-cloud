// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    // Only redirect if user is actually authenticated and not loading
    if (auth.user && !auth.loading && window.localStorage.getItem('userData')) {
      router.replace('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route, auth.user, auth.loading])

  // Show fallback spinner while authentication is being determined
  if (auth.loading) {
    return fallback
  }

  // If user is authenticated, redirect them away from guest pages
  if (auth.user && !auth.loading) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
