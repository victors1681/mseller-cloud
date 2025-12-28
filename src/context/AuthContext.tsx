// ** React Imports
import { createContext, ReactNode, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { FirebaseError } from 'firebase/app'
import { onAuthStateChanged } from 'firebase/auth'
import {
  auth,
  cancelSubscriptionFirebase,
  CancelSubscriptionType,
  createSubscriptionFirebase,
  CreateSubscriptionProps,
  CreateSubscriptionType,
  fetchStripeProductsFirebase,
  getAllCurrentProfile,
  handleSignOut,
  signInByEmail,
  signInByToken,
  signUpFirebase,
  SignUpRequest,
  SignUpType,
  triggerForgotPasswordFirebase,
  TriggerForgotPasswordProps,
  TriggerForgotPasswordType,
  updatePasswordFirebase,
  UpdatePasswordRequest,
  UpdatePasswordType,
} from 'src/firebase'
import { StripeProductType } from 'src/types/apps/stripeTypes'
import { UserTypes } from 'src/types/apps/userTypes'
import { AuthValuesType, ErrCallbackType, LoginParams } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  signInByToken: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  loadingForm: false,
  signUp: () => Promise.resolve(undefined),
  updatePassword: () => Promise.resolve(undefined),
  triggerForgotPassword: () => Promise.resolve(undefined),
  createSubscription: () => Promise.resolve(undefined),
  cancelSubscription: () => Promise.resolve(undefined),
  fetchStripeProducts: () => Promise.resolve(undefined),
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserTypes | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [loadingForm, setLoadingForm] = useState<boolean>(false)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuthentication = () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setLoading(true)
        try {
          if (user) {
            const uid = user.uid

            const userData = await getAllCurrentProfile()
            if (!userData) {
              throw new Error('User profile not found')
            }
            //userData.role = 'admin' //TODO: Temporary forcing user role
            setUser(userData)

            const updateAccessToken = await user.getIdToken()
            if (!updateAccessToken) {
              throw new Error('Failed to get access token')
            }
            window.localStorage.setItem(
              authConfig.storageTokenKeyName,
              updateAccessToken,
            )

            // Check if user needs to complete onboarding
            const needsOnboarding = !userData.business?.hasCompletedOnboarding
            const onOnboardingPage = router.pathname === '/onboarding'

            // If user needs onboarding and not on onboarding page, redirect
            if (needsOnboarding && !onOnboardingPage) {
              await router.replace('/onboarding')
              setLoading(false)
              return
            }

            // If user completed onboarding but is on onboarding page, redirect to home
            if (!needsOnboarding && onOnboardingPage) {
              await router.replace('/')
              setLoading(false)
              return
            }

            // Only redirect if on a guest page or if there's a returnUrl
            const guestPages = ['/login', '/register', '/forgot-password']
            const isOnGuestPage = guestPages.some((page) =>
              router.pathname.startsWith(page),
            )
            const returnUrl = router.query.returnUrl as string

            // Redirect only if:
            // 1. User is on a guest page (login/register/forgot-password), OR
            // 2. There's a returnUrl in the query params
            // AND user has completed onboarding
            if ((isOnGuestPage || returnUrl) && !needsOnboarding) {
              const redirectURL =
                returnUrl && returnUrl !== '/' ? returnUrl : '/'
              await router.replace(redirectURL)
            }
            // Otherwise, stay on the current page
          } else {
            // User is not authenticated
            setUser(null)

            // Check if we're already handling this in restClient interceptor
            // by checking if localStorage is already cleared
            const hasToken = window.localStorage.getItem(
              authConfig.storageTokenKeyName,
            )

            // Only clear and redirect if not already cleared (prevents race condition with restClient)
            if (hasToken) {
              window.localStorage.removeItem('userData')
              window.localStorage.removeItem(authConfig.storageTokenKeyName)

              // Only redirect to login if not already on a guest page
              const guestPages = ['/login', '/register', '/forgot-password']
              const isOnGuestPage = guestPages.some((page) =>
                router.pathname.startsWith(page),
              )

              if (!isOnGuestPage) {
                await router.replace({
                  pathname: '/login',
                  query:
                    router.pathname !== '/'
                      ? { returnUrl: router.asPath }
                      : undefined,
                })
              }
            }
          }
        } catch (error) {
          console.error('Auth Error:', error)
          if (error instanceof FirebaseError) {
            switch (error.code) {
              case 'auth/network-request-failed':
                console.error('Network error during authentication')
                break
              case 'auth/user-token-expired':
                console.error('User token expired')
                break
              default:
                console.error(`Firebase error: ${error.code}`)
            }
          }

          // Clear auth state on error
          setUser(null)

          // Check if we're already handling this in restClient interceptor
          const hasToken = window.localStorage.getItem(
            authConfig.storageTokenKeyName,
          )

          // Only clear and redirect if not already cleared
          if (hasToken) {
            window.localStorage.removeItem('userData')
            window.localStorage.removeItem(authConfig.storageTokenKeyName)

            // Only redirect to login if not already on a guest page
            const guestPages = ['/login', '/register', '/forgot-password']
            const isOnGuestPage = guestPages.some((page) =>
              router.pathname.startsWith(page),
            )

            if (!isOnGuestPage) {
              await router.replace('/login')
            }
          }
        } finally {
          setLoading(false)
        }
      })

      return unsubscribe
    }

    const unsubscribe = initAuthentication()

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (
    params: LoginParams,
    errorCallback?: ErrCallbackType,
  ) => {
    setLoadingForm(true)
    params.returnSecureToken = true

    try {
      const userData = await signInByEmail(
        params.email,
        params.password,
        params.rememberMe,
      )
      if (userData) {
        setUser(userData)
        const redirectURL = (router.query.returnUrl as string) || '/'
        router.replace(redirectURL)
      }
    } catch (err: any) {
      if (errorCallback) errorCallback(err)
      setLoadingForm(false)
    }
  }

  const handleSignInByToken = async () => {
    try {
      const userData = await signInByToken()
      if (userData) {
        setUser(userData)
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
      throw error
    }
  }

  const handleLogout = async () => {
    setLoadingForm(true)
    try {
      await handleSignOut()
      setUser(null)
      window.localStorage.removeItem('userData')
      window.localStorage.removeItem(authConfig.storageTokenKeyName)

      // Only redirect to login if not already on a guest page
      const guestPages = ['/login', '/register', '/forgot-password']
      const isOnGuestPage = guestPages.some((page) =>
        router.pathname.startsWith(page),
      )

      if (!isOnGuestPage) {
        await router.push('/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoadingForm(false)
    }
  }

  const handleSignUp = async (
    data: SignUpRequest,
  ): Promise<SignUpType | { error: string } | undefined> => {
    return signUpFirebase(data)
  }

  const updatePassword = async (
    data: UpdatePasswordRequest,
  ): Promise<UpdatePasswordType | { error: string } | undefined> => {
    return updatePasswordFirebase(data)
  }

  const triggerForgotPassword = async (
    data: TriggerForgotPasswordProps,
  ): Promise<TriggerForgotPasswordType | { error: string } | undefined> => {
    return triggerForgotPasswordFirebase(data)
  }

  const createSubscription = async (
    data: CreateSubscriptionProps,
  ): Promise<CreateSubscriptionType | { error: string } | undefined> => {
    return createSubscriptionFirebase(data)
  }

  const cancelSubscription = async (): Promise<
    CancelSubscriptionType | { error: string } | undefined
  > => {
    return cancelSubscriptionFirebase()
  }

  const fetchStripeProducts = async (): Promise<
    StripeProductType[] | { error: string } | undefined
  > => {
    return fetchStripeProductsFirebase()
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    signInByToken: handleSignInByToken,
    logout: handleLogout,
    loadingForm,
    accessControl: user?.cloudAccess,
    signUp: handleSignUp,
    updatePassword,
    triggerForgotPassword,
    createSubscription,
    cancelSubscription,
    fetchStripeProducts,
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
