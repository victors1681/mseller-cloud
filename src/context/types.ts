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
  CancelSubscriptionType,
  CompleteOnboardingRequest,
  CompleteOnboardingResponse,
  CreateSubscriptionProps,
  CreateSubscriptionType,
  IUpdateUserProfileProps,
  IUpdateUserProfileResponse,
  SignUpRequest,
  SignUpType,
  TriggerForgotPasswordProps,
  TriggerForgotPasswordType,
  UpdatePasswordRequest,
  UpdatePasswordType,
} from 'src/firebase'
import {
  CustomerPaymentsHistoryResponseType,
  PaymentMethodsResponseType,
  RemoveCustomerCardType,
  StripeProductType,
  UpdateCardRequestType,
  UpdateCardResponseType,
} from 'src/types/apps/stripeTypes'
import { ICloudModules, UserTypes } from 'src/types/apps/userTypes'

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
  returnSecureToken?: boolean
}

// export type UserTypes = {
//   id: number
//   role: string
//   email: string
//   fullName: string
//   username: string
//   password: string
//   avatar?: string | null
// }

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserTypes | null
  setLoading: (value: boolean) => void
  setUser: (value: UserTypes | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  signInByToken: () => Promise<void>
  loadingForm: boolean
  accessControl?: ICloudModules
  signUp: (
    value: SignUpRequest,
  ) => Promise<SignUpType | { error: string } | undefined>
  updatePassword: (
    value: UpdatePasswordRequest,
  ) => Promise<UpdatePasswordType | { error: string } | undefined>
  triggerForgotPassword: (
    value: TriggerForgotPasswordProps,
  ) => Promise<TriggerForgotPasswordType | { error: string } | undefined>

  createSubscription: (
    value: CreateSubscriptionProps,
  ) => Promise<CreateSubscriptionType | { error: string } | undefined>
  cancelSubscription: () => Promise<
    CancelSubscriptionType | { error: string } | undefined
  >
  fetchStripeProducts: () => Promise<
    StripeProductType[] | { error: string } | undefined
  >
}

export type FirebaseValuesType = {
  loading: boolean
  createSubscription: (
    value: CreateSubscriptionProps,
  ) => Promise<CreateSubscriptionType | { error: string } | undefined>
  cancelSubscription: () => Promise<
    CancelSubscriptionType | { error: string } | undefined
  >
  fetchStripeProducts: () => Promise<
    StripeProductType[] | { error: string } | undefined
  >
  getCustomerPaymentsHistory: () => Promise<
    CustomerPaymentsHistoryResponseType | { error: string } | undefined
  >
  getCustomerPaymentMethods: () => Promise<
    PaymentMethodsResponseType | { error: string } | undefined
  >
  updateCustomerCard: (
    data: UpdateCardRequestType,
  ) => Promise<UpdateCardResponseType | { error: string } | undefined>

  removeCustomerCard: (
    cardId: string,
  ) => Promise<RemoveCustomerCardType | { error: string } | undefined>

  uploadImages: (
    data: UploadImagesType,
  ) => Promise<UploadImagesResponseType | { error: string } | undefined>
  updateUserProfile: (
    data: IUpdateUserProfileProps,
  ) => Promise<IUpdateUserProfileResponse | { error: string } | undefined>
  completeOnboarding: (
    data: CompleteOnboardingRequest,
  ) => Promise<CompleteOnboardingResponse | { error: string } | undefined>

  // Media Library Functions
  listMedia: (
    filters: MediaFilters,
  ) => Promise<PaginatedMediaResponse | { error: string } | undefined>
  updateMediaMetadata: (
    data: UpdateMediaMetadataRequest,
  ) => Promise<{ success: boolean } | { error: string } | undefined>
  deleteMedia: (
    mediaId: string,
  ) => Promise<{ success: boolean } | { error: string } | undefined>
  bulkDeleteMedia: (
    data: BulkDeleteRequest,
  ) => Promise<BulkDeleteResponse | { error: string } | undefined>
  addUsageReference: (
    data: UsageReference,
  ) => Promise<{ success: boolean } | { error: string } | undefined>
  removeUsageReference: (
    data: UsageReference,
  ) => Promise<{ success: boolean } | { error: string } | undefined>
}
