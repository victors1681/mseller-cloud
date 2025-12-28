// ** React Imports
import { ReactElement, ReactNode, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

interface OnboardingGuardProps {
  children: ReactNode
  fallback: ReactElement | null
  authGuard?: boolean
}

const OnboardingGuard = (props: OnboardingGuardProps) => {
  const { children, fallback, authGuard = true } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    // Skip onboarding checks for public pages or print pages
    if (!authGuard || /print/.test(router.pathname)) {
      return
    }

    // If user is not authenticated, let AuthGuard handle it
    if (auth.loading) {
      return
    }

    // Check if user has completed onboarding
    if (auth.user && !auth.user.business?.hasCompletedOnboarding) {
      // If user is already on onboarding page, don't redirect
      if (router.pathname === '/onboarding') {
        return
      }

      // If user hasn't completed onboarding and is trying to access protected pages
      // Redirect to onboarding
      router.replace('/onboarding')
    } else if (auth.user && auth.user.business?.hasCompletedOnboarding) {
      // If user has completed onboarding but is on onboarding page
      // Redirect to home
      if (router.pathname === '/onboarding') {
        router.replace('/')
      }
    }
  }, [router.isReady, router.pathname, auth.user, auth.loading])

  // Skip checks for public pages or print pages
  if (!authGuard || /print/.test(router.pathname)) {
    return <>{children}</>
  }

  // Show fallback while checking authentication
  if (auth.loading) {
    return fallback
  }

  // If user hasn't completed onboarding and not on onboarding page, show fallback
  if (
    auth.user &&
    !auth.user.business?.hasCompletedOnboarding &&
    router.pathname !== '/onboarding'
  ) {
    return fallback
  }

  return <>{children}</>
}

export default OnboardingGuard
