// ** React Imports
import { ReactElement, ReactNode, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(
    () => {
      if (!router.isReady) {
        return
      }

      // Only redirect if user is null and loading is complete
      if (auth.user === null && !auth.loading) {
        if (router.asPath !== '/' && router.asPath !== '/login') {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath },
          })
        } else {
          router.replace('/login')
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady, auth.user, auth.loading],
  )

  // Show fallback while loading or if user is not authenticated
  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
