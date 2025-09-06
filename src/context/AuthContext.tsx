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
    const returnUrl = router.query.returnUrl
    const initAuthentication = async () => {
      onAuthStateChanged(auth, async (user) => {
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

            const redirectURL =
              returnUrl && returnUrl !== '/' ? returnUrl : router.asPath
            await router.replace(redirectURL as string)
          } else {
            await handleLogout()
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
          await handleLogout()
        } finally {
          setLoading(false)
        }
      })
    }

    initAuthentication()
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

  const handleLogout = async () => {
    await handleSignOut()
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)

    // Only redirect to login if not already on a guest page
    const guestPages = ['/login', '/register', '/forgot-password']
    const isOnGuestPage = guestPages.some((page) =>
      router.asPath.startsWith(page),
    )

    if (!isOnGuestPage) {
      router.push('/login')
    }
    setLoadingForm(false)
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
