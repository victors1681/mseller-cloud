import {
  UploadImagesResponseType,
  UploadImagesType,
} from '@/types/apps/imageTypes'
import {
  BulkDeleteRequest,
  BulkDeleteResponse,
  MediaFilters,
  PaginatedMediaResponse,
  UpdateMediaMetadataRequest,
  UsageReference,
} from '@/types/apps/mediaTypes'
import * as firebase from 'firebase/app'
import {
  browserLocalPersistence,
  browserSessionPersistence,
  connectAuthEmulator,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions'
import { axiosSetClientUrl } from 'src/configs/restClient'
import { SetupOption } from 'src/types/apps/onboardingTypes'
import {
  CustomerPaymentsHistoryResponseType,
  PaymentMethodsResponseType,
  RemoveCustomerCardType,
  StripeProductType,
  UpdateCardRequestType,
  UpdateCardResponseType,
} from 'src/types/apps/stripeTypes'
import { UserTypes } from 'src/types/apps/userTypes'
import firebaseConfig from './firebaseConfig'
const LOCAL_HOST = '127.0.0.1'

let app
if (!firebase.getApps().length) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.getApps()[0]
}

// Initialize Firebase

const auth = getAuth(app)
const db = getFirestore(app)
const functions = getFunctions(app, 'us-east1')

// Check both environment variables and explicit flag
const isEmulator =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_EMULATOR_ENABLED === 'true'

if (isEmulator) {
  try {
    console.log('🚀 Initializing Firebase Emulators...')

    // Initialize emulators before any Firebase operations
    connectAuthEmulator(auth, `http://${LOCAL_HOST}:9099`)
    connectFunctionsEmulator(functions, LOCAL_HOST, 9999)
    connectFirestoreEmulator(db, LOCAL_HOST, 8081)
    // connectFirestoreEmulator(storage, LOCAL_HOST, 9199)

    console.log('✅ Firebase Emulators Connected:', {
      auth: '9099',
      functions: '9999',
      firestore: '8081',
      // storage: '9199',
    })
  } catch (error) {
    console.error('❌ Firebase Emulator Error:', error)
    throw new Error('Failed to connect to Firebase emulators')
  }
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

    throw new Error(error.message)
  }
}

export const signInByToken = async (): Promise<UserTypes | undefined> => {
  try {
    if (!auth.currentUser) {
      throw new Error('No authenticated user')
    }

    // Refresh token to get updated claims
    await auth.currentUser.getIdToken(true)

    // Fetch updated user profile
    return await getAllCurrentProfile()
  } catch (error: any) {
    console.error('Error refreshing user data:', error)
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
  userId?: string // Firebase UID for social login (Google, Apple)
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
  StripeProductType[] | { error: string } | undefined
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

export const getCustomerPaymentsHistoryFirebase = async (): Promise<
  CustomerPaymentsHistoryResponseType | { error: string } | undefined
> => {
  try {
    const fn = httpsCallable<any, CustomerPaymentsHistoryResponseType>(
      functions,
      'getCustomerPaymentsHistory',
    )
    const response = await fn()
    return response.data
  } catch (err: any) {
    return firebaseError(err)
  }
}

export const getCustomerPaymentMethodsFirebase = async (): Promise<
  PaymentMethodsResponseType | { error: string } | undefined
> => {
  try {
    const fn = httpsCallable<any, PaymentMethodsResponseType>(
      functions,
      'getCustomerPaymentMethods',
    )
    const response = await fn()
    return response.data
  } catch (err: any) {
    return firebaseError(err)
  }
}

export const updateCustomerCardFirebase = async (
  data: UpdateCardRequestType,
): Promise<UpdateCardResponseType | { error: string } | undefined> => {
  try {
    const fn = httpsCallable<UpdateCardRequestType, UpdateCardResponseType>(
      functions,
      'updateCustomerCard',
    )
    const response = await fn(data)
    return response.data
  } catch (err: any) {
    return firebaseError(err)
  }
}
export const removeCustomerCardFirebase = async (
  cardId: string,
): Promise<RemoveCustomerCardType | { error: string } | undefined> => {
  try {
    const fn = httpsCallable<{ cardId: string }, UpdateCardResponseType>(
      functions,
      'removeCustomerCard',
    )
    const response = await fn({ cardId })
    return response.data
  } catch (err: any) {
    return firebaseError(err)
  }
}

export const uploadImagesFirebase = async (
  data: UploadImagesType,
): Promise<UploadImagesResponseType | { error: string } | undefined> => {
  try {
    const fn = httpsCallable<UploadImagesType, UploadImagesResponseType>(
      functions,
      'uploadImages',
    )
    const response = await fn(data)
    return response.data
  } catch (err: any) {
    return firebaseError(err)
  }
}

// Update User Profile Types
export interface IUpdateUserAddress {
  city?: string
  country?: string
  street?: string
  zipCode?: string
}

export type IUpdateUserProfileProps = {
  userId: string
  hasSeenWelcome?: boolean
} & Partial<Pick<UserTypes, 'firstName' | 'lastName' | 'photoURL'>> & {
    business?: {
      name?: string
      rnc?: string
      website?: string
      phone?: string
      address?: IUpdateUserAddress
    }
  }

export interface IUpdateUserProfileResponse {
  success: boolean
  message: string
}

export const updateUserProfileFirebase = async (
  data: IUpdateUserProfileProps,
): Promise<IUpdateUserProfileResponse | { error: string } | undefined> => {
  try {
    const fn = httpsCallable<
      IUpdateUserProfileProps,
      IUpdateUserProfileResponse
    >(functions, 'updateUserProfile')
    const response = await fn(data)
    return response.data
  } catch (err: any) {
    return firebaseError(err)
  }
}

export interface CompleteOnboardingRequest {
  userId: string
  onboardingData: {
    businessName: string
    phone: string
    street: string
    city: string
    country: string
    rnc?: string
    businessType: string
    industry: string
    setupOption: SetupOption | null
  }
  hasCompletedOnboarding: boolean
}

export interface CompleteOnboardingResponse {
  success: boolean
  message: string
}

export const completeOnboardingFirebase = async (
  data: CompleteOnboardingRequest,
): Promise<CompleteOnboardingResponse | { error: string } | undefined> => {
  try {
    const fn = httpsCallable<
      CompleteOnboardingRequest,
      CompleteOnboardingResponse
    >(functions, 'completeOnboarding')
    const response = await fn(data)
    return response.data
  } catch (err: any) {
    return firebaseError(err)
  }
}

// ============================================
// Media Library Functions
// ============================================

export const listMediaFirebase = async (
  filters: MediaFilters,
): Promise<PaginatedMediaResponse | { error: string } | undefined> => {
  try {
    const fn = httpsCallable<MediaFilters, PaginatedMediaResponse>(
      functions,
      'listMedia',
    )
    const response = await fn(filters)
    return response.data
  } catch (err: any) {
    return firebaseError(err)
  }
}

export const updateMediaMetadataFirebase = async (
  data: UpdateMediaMetadataRequest,
): Promise<{ success: boolean } | { error: string } | undefined> => {
  try {
    const fn = httpsCallable<UpdateMediaMetadataRequest, { success: boolean }>(
      functions,
      'updateMediaMetadata',
    )
    const response = await fn(data)
    return response.data
  } catch (err: any) {
    return firebaseError(err)
  }
}

export const deleteMediaFirebase = async (
  mediaId: string,
): Promise<{ success: boolean } | { error: string } | undefined> => {
  try {
    const fn = httpsCallable<{ mediaId: string }, { success: boolean }>(
      functions,
      'deleteMedia',
    )
    const response = await fn({ mediaId })
    return response.data
  } catch (err: any) {
    return firebaseError(err)
  }
}

export const bulkDeleteMediaFirebase = async (
  data: BulkDeleteRequest,
): Promise<BulkDeleteResponse | { error: string } | undefined> => {
  try {
    const fn = httpsCallable<BulkDeleteRequest, BulkDeleteResponse>(
      functions,
      'bulkDeleteMedia',
    )
    const response = await fn(data)
    return response.data
  } catch (err: any) {
    return firebaseError(err)
  }
}

export const addUsageReferenceFirebase = async (
  data: UsageReference,
): Promise<{ success: boolean } | { error: string } | undefined> => {
  try {
    const fn = httpsCallable<UsageReference, { success: boolean }>(
      functions,
      'addUsageReference',
    )
    const response = await fn(data)
    return response.data
  } catch (err: any) {
    return firebaseError(err)
  }
}

export const removeUsageReferenceFirebase = async (
  data: UsageReference,
): Promise<{ success: boolean } | { error: string } | undefined> => {
  try {
    const fn = httpsCallable<UsageReference, { success: boolean }>(
      functions,
      'removeUsageReference',
    )
    const response = await fn(data)
    return response.data
  } catch (err: any) {
    return firebaseError(err)
  }
}

type ErrorResponse = { error: string }

export const isValidResponse = <T>(
  response: T | ErrorResponse | undefined,
): response is T => {
  return response !== undefined && !(response as ErrorResponse).error
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

export { auth, db, firebase, functions }
