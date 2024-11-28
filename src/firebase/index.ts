import * as firebase from 'firebase/app'
import firebaseConfig from './firebaseConfig'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from 'firebase/functions'
import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { axiosSetClientUrl } from 'src/configs/restClient'
import { UserTypes } from 'src/types/apps/userTypes'
import { StripeProductType } from 'src/types/apps/stripeTypes'
const LOCAL_HOST = '127.0.0.1'

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig)
const auth = getAuth(app)

const db = getFirestore(app)
const functions = getFunctions(app, 'us-east1')
connectFunctionsEmulator(functions, LOCAL_HOST, 9999)

if (
  process.env.NODE_ENV === 'development' &&
  process.env.EMULATOR_ENABLED == 'true'
) {
  console.log('EMULATOR RUNNING 🚀🚀 🚀 🚀  ')

  connectFirestoreEmulator(db, LOCAL_HOST, 8081)

  //Usar emmulador
  // connectFunctionsEmulator(functions, LOCAL_HOST, 9199)

  console.error(
    'FIREBASE MODE: ',
    process.env.NODE_ENV,
    ` Functions: ${LOCAL_HOST}:9999`,
  )
}

export const getUserByAccessToken = async (
  accessToken: string,
): Promise<UserTypes | undefined> => {
  try {
    const fn = httpsCallable(functions, 'getUserByAccessToken')
    const response = await fn({ accessToken })
    return response.data as UserTypes
  } catch (err) {
    console.error(err)
    throw err
  }
}
export const refreshAccessToken = async (): Promise<string | undefined> => {
  const token = await auth.currentUser?.getIdToken(true)
  return token
}

export const getAllCurrentProfile = async (): Promise<
  UserTypes | undefined
> => {
  const fn = httpsCallable(functions, 'getUserProfileV2')
  const profileDataResponse = await fn()
  const userData = profileDataResponse.data as UserTypes
  axiosSetClientUrl(userData.business.config, userData.testMode)
  return userData
}

export const signInByEmail = async (
  email: string,
  password: string,
  remember?: boolean,
) => {
  try {
    await setPersistence(
      auth,
      remember ? browserLocalPersistence : browserSessionPersistence,
    )

    const response = await signInWithEmailAndPassword(auth, email, password)

    return await getAllCurrentProfile()
  } catch (error: any) {
    console.log('Authentication error', error)
    debugger
    throw new Error(error.message)
  }
}

export const handleSignOut = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

export interface SignUpType {
  result: {
    result: string // Describes the operation result, e.g., "Business and user created"
    userId: string // The ID of the created user
    businessId: string // The ID of the created business
  }
}

export type SignUpRequest = {
  business_name: string // Name of the business
  user_email: string // Email of the user
  user_password: string // Password for the user
  user_first_name: string // First name of the user
  user_last_name: string // Last name of the user
  phone: string // Phone number of the user
  address: string // Address of the user or business
  country: string // Country where the business is located
  reCaptchaToken: string
  terms: boolean
}

export const signUpFirebase = async (
  data: SignUpRequest,
): Promise<SignUpType | { error: string } | undefined> => {
  try {
    const fn = httpsCallable<SignUpRequest, SignUpType>(
      functions,
      'addPortalBusiness',
    )
    const response = await fn(data)
    return response.data
  } catch (err: any) {
    console.error(err)

    const error = err?.message || 'Ha ocurrido un error inesperado'

    return { error }
  }
}

export type UpdatePasswordRequest = {
  userId: string
  password: string
}

export interface UpdatePasswordType {
  result: string
}

export const updatePasswordFirebase = async (
  data: UpdatePasswordRequest,
): Promise<UpdatePasswordType | { error: string } | undefined> => {
  try {
    const fn = httpsCallable<UpdatePasswordRequest, UpdatePasswordType>(
      functions,
      'updatePasswordV2',
    )
    const response = await fn(data)
    return response.data
  } catch (err: any) {
    return firebaseError(err)
  }
}

export type TriggerForgotPasswordProps = {
  email: string
}

export interface TriggerForgotPasswordType {
  result: string
}

export const triggerForgotPasswordFirebase = async (
  data: TriggerForgotPasswordProps,
): Promise<TriggerForgotPasswordType | { error: string } | undefined> => {
  try {
    const fn = httpsCallable<
      TriggerForgotPasswordProps,
      TriggerForgotPasswordType
    >(functions, 'triggerForgotPassword')
    const response = await fn(data)
    return response.data
  } catch (err: any) {
    return firebaseError(err)
  }
}

export type CreateSubscriptionProps = {
  price: string
  quantity: number
  tier: string
  token: string
}

export interface CreateSubscriptionType {
  subscriptionId: string
  success: boolean
}

export const createSubscriptionFirebase = async (
  data: CreateSubscriptionProps,
): Promise<CreateSubscriptionType | { error: string } | undefined> => {
  try {
    const fn = httpsCallable<CreateSubscriptionProps, CreateSubscriptionType>(
      functions,
      'createSubscription',
    )
    const response = await fn(data)
    return response.data
  } catch (err: any) {
    return firebaseError(err)
  }
}

export interface CancelSubscriptionType {
  result: string
}
export const cancelSubscriptionFirebase = async (): Promise<
  CancelSubscriptionType | { error: string } | undefined
> => {
  try {
    const fn = httpsCallable<any, CancelSubscriptionType>(
      functions,
      'cancelSubscription',
    )
    const response = await fn()
    return response.data
  } catch (err: any) {
    return firebaseError(err)
  }
}

interface StripeResponse {
  success: boolean
  data: StripeProductType[]
}
export const fetchStripeProductsFirebase = async (): Promise<
  StripeProductType | { error: string } | undefined
> => {
  try {
    const fn = httpsCallable<any, StripeResponse>(
      functions,
      'fetchStripeProducts',
    )
    const response = await fn()
    return response.data?.data
  } catch (err: any) {
    return firebaseError(err)
  }
}

export const firebaseError = (err: any) => {
  if (err?.code) {
    switch (err.code) {
      case 'functions/permission-denied':
        throw new Error('No tienes permisos para realizar esta operación')

      case 'functions/not-found':
        throw new Error('Correo electronico no encontrado')

      case 'functions/internal':
        return {
          error: 'An internal server error occurred. Please try again later.',
        }
      default:
        return { error: `An unknown error occurred: ${err.code}` }
    }
  }
}

export { db, firebase, functions, auth }
