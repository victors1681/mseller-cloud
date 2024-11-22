// ** React Imports
import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType } from './types'
import {
  auth,
  getAllCurrentProfile,
  handleSignOut,
  signInByEmail,
  signUpFirebase,
  SignUpRequest,
  SignUpType,
} from 'src/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { UserTypes } from 'src/types/apps/userTypes'

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
        if (user) {
          const uid = user.uid

          const userData = await getAllCurrentProfile()
          if (userData) {
            //userData.role = 'admin' //TODO: Temporary forcing user role
            setUser(userData)
          } else {
            handleLogout()
          }

          const updateAccessToken = await user.getIdToken()

          window.localStorage.setItem(
            authConfig.storageTokenKeyName,
            updateAccessToken,
          )
          const redirectURL =
            returnUrl && returnUrl !== '/' ? returnUrl : router.asPath
          router.replace(redirectURL as string)
        } else {
          handleLogout()
        }
        setLoading(false)
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
    router.push('/login')
    setLoadingForm(false)
  }

  const handleSignUp = async (
    data: SignUpRequest,
  ): Promise<SignUpType | { error: string } | undefined> => {
    return signUpFirebase(data)
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
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
