// ** React Imports
import { createContext, ReactNode, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Types
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
import {
  addUsageReferenceFirebase,
  bulkDeleteMediaFirebase,
  cancelSubscriptionFirebase,
  CancelSubscriptionType,
  completeOnboardingFirebase,
  CompleteOnboardingRequest,
  CompleteOnboardingResponse,
  createSubscriptionFirebase,
  CreateSubscriptionProps,
  CreateSubscriptionType,
  deleteMediaFirebase,
  fetchStripeProductsFirebase,
  getCustomerPaymentMethodsFirebase,
  getCustomerPaymentsHistoryFirebase,
  IUpdateUserProfileProps,
  IUpdateUserProfileResponse,
  listMediaFirebase,
  removeCustomerCardFirebase,
  removeUsageReferenceFirebase,
  updateCustomerCardFirebase,
  updateMediaMetadataFirebase,
  updateUserProfileFirebase,
  uploadImagesFirebase,
} from 'src/firebase'
import {
  CustomerPaymentsHistoryResponseType,
  PaymentMethodsResponseType,
  RemoveCustomerCardType,
  StripeProductType,
  UpdateCardRequestType,
  UpdateCardResponseType,
} from 'src/types/apps/stripeTypes'
import { FirebaseValuesType } from './types'

// ** Defaults
const defaultProvider: FirebaseValuesType = {
  loading: true,
  createSubscription: () => Promise.resolve(undefined),
  cancelSubscription: () => Promise.resolve(undefined),
  fetchStripeProducts: () => Promise.resolve(undefined),
  getCustomerPaymentsHistory: () => Promise.resolve(undefined),
  getCustomerPaymentMethods: () => Promise.resolve(undefined),
  updateCustomerCard: () => Promise.resolve(undefined),
  removeCustomerCard: () => Promise.resolve(undefined),
  uploadImages: () => Promise.resolve(undefined),
  updateUserProfile: () => Promise.resolve(undefined),
  completeOnboarding: () => Promise.resolve(undefined),
  listMedia: () => Promise.resolve(undefined),
  updateMediaMetadata: () => Promise.resolve(undefined),
  deleteMedia: () => Promise.resolve(undefined),
  bulkDeleteMedia: () => Promise.resolve(undefined),
  addUsageReference: () => Promise.resolve(undefined),
  removeUsageReference: () => Promise.resolve(undefined),
}

const FirebaseContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const FirebaseProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

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

  const getCustomerPaymentsHistory = async (): Promise<
    CustomerPaymentsHistoryResponseType | { error: string } | undefined
  > => {
    return getCustomerPaymentsHistoryFirebase()
  }

  const getCustomerPaymentMethods = async (): Promise<
    PaymentMethodsResponseType | { error: string } | undefined
  > => {
    return getCustomerPaymentMethodsFirebase()
  }
  const updateCustomerCard = async (
    data: UpdateCardRequestType,
  ): Promise<UpdateCardResponseType | { error: string } | undefined> => {
    return updateCustomerCardFirebase(data)
  }

  const removeCustomerCard = async (
    cardId: string,
  ): Promise<RemoveCustomerCardType | { error: string } | undefined> => {
    return removeCustomerCardFirebase(cardId)
  }
  const uploadImages = async (
    data: UploadImagesType,
  ): Promise<UploadImagesResponseType | { error: string } | undefined> => {
    return uploadImagesFirebase(data)
  }

  const updateUserProfile = async (
    data: IUpdateUserProfileProps,
  ): Promise<IUpdateUserProfileResponse | { error: string } | undefined> => {
    return updateUserProfileFirebase(data)
  }

  const completeOnboarding = async (
    data: CompleteOnboardingRequest,
  ): Promise<CompleteOnboardingResponse | { error: string } | undefined> => {
    return completeOnboardingFirebase(data)
  }

  const listMedia = async (
    filters: MediaFilters,
  ): Promise<PaginatedMediaResponse | { error: string } | undefined> => {
    return listMediaFirebase(filters)
  }

  const updateMediaMetadata = async (
    data: UpdateMediaMetadataRequest,
  ): Promise<{ success: boolean } | { error: string } | undefined> => {
    return updateMediaMetadataFirebase(data)
  }

  const deleteMedia = async (
    mediaId: string,
  ): Promise<{ success: boolean } | { error: string } | undefined> => {
    return deleteMediaFirebase(mediaId)
  }

  const bulkDeleteMedia = async (
    data: BulkDeleteRequest,
  ): Promise<BulkDeleteResponse | { error: string } | undefined> => {
    return bulkDeleteMediaFirebase(data)
  }

  const addUsageReference = async (
    data: UsageReference,
  ): Promise<{ success: boolean } | { error: string } | undefined> => {
    return addUsageReferenceFirebase(data)
  }

  const removeUsageReference = async (
    data: UsageReference,
  ): Promise<{ success: boolean } | { error: string } | undefined> => {
    return removeUsageReferenceFirebase(data)
  }

  const values = {
    loading,
    createSubscription,
    cancelSubscription,
    fetchStripeProducts,
    getCustomerPaymentsHistory,
    getCustomerPaymentMethods,
    updateCustomerCard,
    removeCustomerCard,
    uploadImages,
    updateUserProfile,
    completeOnboarding,
    listMedia,
    updateMediaMetadata,
    deleteMedia,
    bulkDeleteMedia,
    addUsageReference,
    removeUsageReference,
  }

  return (
    <FirebaseContext.Provider value={values}>
      {children}
    </FirebaseContext.Provider>
  )
}

export { FirebaseContext, FirebaseProvider }
