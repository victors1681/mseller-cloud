export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
  returnSecureToken?: boolean
}

// export type UserDataType = {
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
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  loadingForm: boolean
}

export interface UserDataType {
  lastName: string
  firstTimeLogin: boolean
  role: string
  businessId: string
  onlyProductsSelected: boolean
  type: string
  defaultClientByRoute: boolean
  photoURL: string
  sellerCode: string
  userLevel: string
  priceCondition: boolean
  disabled: boolean
  restoreIpad: boolean
  email: string
  createClient: boolean
  resetIpad: boolean
  business: Business
  sqlcommand: string
  warehouse: string
  userId: string
  filterClients: boolean
  editPrice: boolean
  onlyMyClients: boolean
  firstName: string
  phone: string
  initialConfig: boolean
  testMode: boolean
  sqlResult: string
  forceUpdatePassword: boolean
  notifications: number
}

export interface Business {
  phone: string
  contact: string
  sellerLicenses: number
  contactPhone: string
  startingDate: StartingDate
  status: boolean
  email: string
  sellingPackaging: boolean
  website: string
  fax: string
  address: Address
  defaultPaymentType: string
  rnc: string
  name: string
  logoUrl: string
  footerReceipt: string
  footerMessage: string
  config: Config
}

export interface StartingDate {
  _seconds: number
  _nanoseconds: number
}

export interface Address {
  country: string
  city: string
  street: string
}

export interface Config {
  promocion: boolean
  metadata: Metadaum[]
  allowLoadLastOrders: boolean
  sandboxUrl: string
  proximaOrden: boolean
  serverPort: number
  displayPriceWithTax: boolean
  allowPriceBelowMinimum: boolean
  allowQuote: boolean
  sandboxPort: number
  serverUrl: string
  testMode: boolean
  integrations: Integration[]
  trackingLocation: boolean
  v4: boolean
  orderEmailTemplateID: number
  portalSandboxPort: string
  portalSandboxUrl: string
  portalServerPort: string
  portalServerUrl: string
}

export interface Metadaum {
  value: string
  key: string
}

export interface Integration {
  provider: string
  devPhoneNumberId: string
  enabled: boolean
  devToken: string
  isDevelopment: boolean
}
