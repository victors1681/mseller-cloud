// ** React Imports
import { ReactElement, ReactNode, useEffect } from 'react'

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

    // Only redirect if user is authenticated and loading is complete
    if (auth.user && !auth.loading) {
      const returnUrl = router.query.returnUrl as string
      const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
      router.replace(redirectURL)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, auth.user, auth.loading])

  // Show fallback spinner while authentication is being determined
  if (auth.loading || !router.isReady) {
    return fallback
  }

  // If user is authenticated and we're done loading, show fallback while redirecting
  if (auth.user) {
    return fallback
  }

  // User is not authenticated, show the guest page (login, register, etc.)
  return <>{children}</>
}

export default GuestGuard
