// ** React Imports
import { createContext, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Types
import { FirebaseValuesType } from './types'
import {
  cancelSubscriptionFirebase,
  CancelSubscriptionType,
  createSubscriptionFirebase,
  CreateSubscriptionProps,
  CreateSubscriptionType,
  fetchStripeProductsFirebase,
  getCustomerPaymentMethodsFirebase,
  getCustomerPaymentsHistoryFirebase,
  removeCustomerCardFirebase,
  updateCustomerCardFirebase,
} from 'src/firebase'
import {
  CustomerPaymentsHistoryResponseType,
  PaymentMethodsResponseType,
  RemoveCustomerCardType,
  StripeProductType,
  UpdateCardRequestType,
  UpdateCardResponseType,
} from 'src/types/apps/stripeTypes'

// ** Defaults
const defaultProvider: FirebaseValuesType = {
  loading: true,
  createSubscription: () => Promise.resolve(undefined),
  cancelSubscription: () => Promise.resolve(undefined),
  fetchStripeProducts: () => Promise.resolve(undefined),
  getCustomerPaymentsHistory: () => Promise.resolve(undefined),
  getCustomerPaymentMethods: () => Promise.resolve(undefined),
  updateCustomerCard: () => Promise.resolve(undefined),
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

  const values = {
    loading,
    createSubscription,
    cancelSubscription,
    fetchStripeProducts,
    getCustomerPaymentsHistory,
    getCustomerPaymentMethods,
    updateCustomerCard,
    removeCustomerCard,
  }

  return (
    <FirebaseContext.Provider value={values}>
      {children}
    </FirebaseContext.Provider>
  )
}

export { FirebaseContext, FirebaseProvider }
