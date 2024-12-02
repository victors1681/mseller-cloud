type StripePriceType = {
  id: string
  unit_amount: number
  currency: string
  recurring?: {
    interval: string
  }
}

export type StripeProductType = {
  id: string
  name: string
  description: string
  images: string[]
  prices: StripePriceType[]
}

interface InvoiceData {
  id: string
  number: string | null
  paid: boolean
  total: number
}

interface PaymentMethodDetails {
  brand?: string
  last4?: string
}

export interface FormattedCharge {
  id: string
  amount: number
  amount_formatted: string
  currency: string
  status: string
  created: number
  description: string
  receipt_url?: string | null
  invoice: InvoiceData | null
  payment_method: PaymentMethodDetails
}

export interface CustomerPaymentsHistoryResponseType {
  success: boolean
  charges: FormattedCharge[]
  total_charges: number
}

interface BillingDetails {
  name?: string | null
  email?: string | null
  phone?: string | null
}

// Card Wallet Details Interface
interface CardWallet {
  type?: string
  // Add additional wallet-specific fields as needed
}

// Formatted Payment Method Interface
export interface FormattedPaymentMethod {
  id: string
  type: string
  brand?: string | null
  last4?: string | null
  exp_month?: number | null
  exp_year?: number | null
  funding?: string | null
  country?: string | null
  wallet?: CardWallet | null
  created: number
  billing_details: BillingDetails
  is_default: boolean
}

// Payment Methods Response Interface
export interface PaymentMethodsResponseType {
  success: boolean
  payment_methods: FormattedPaymentMethod[]
  total_methods: number
}

export interface UpdateCardRequestType {
  cardNumber: string
  name: string
  expirationDate: string // Format MM/YY
  status: string // e.g., "active" or "inactive"
  cvc: string
  isDefault: boolean
}

export interface UpdateCardResponseType {
  success: boolean
  message: string
}

export interface RemoveCustomerCardType {
  success: boolean
  message: string
}
