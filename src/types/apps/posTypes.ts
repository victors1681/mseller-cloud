import { CustomerType } from './customerType'
import { EstadoPago } from './documentTypes'
import { CondicionPagoType } from './paymentTypeTypes'
import { ProductType } from './productTypes'

export interface POSPaymentData {
  customer: POSCustomer | null
  cart: POSCartItem[]
  totals: {
    subtotal: number
    descuentoTotal: number
    impuestoTotal: number
    total: number
  }
  paymentType: CondicionPagoType | undefined
  paymentTypes: CondicionPagoType[] | undefined
  amountReceived: number
  change: number
  notes: string
  paymentReference: string
  timestamp: string
  tipoPago: number
  estadoPago: EstadoPago
  montoRecibido: number
  montoDevuelto: number
  nombreClienteMostrador: string
}

export interface POSCartItem {
  id: string
  producto: ProductType
  cantidad: number
  precio: number
  subtotal: number
  descuento: number
  impuesto: number
  porcientoDescuento?: number
  porcientoImpuesto?: number
  factor?: number
  factorOriginal?: number
  area?: string
  unidad?: string
  tipoImpuesto?: string
  cantidadOriginal?: number
  promocion?: boolean
  // ...other fields as needed
}

export interface NewCustomerFormData {
  nombre: string
  telefono: string
  email: string
  direccion: string
  rnc: string
  tipoCliente: string
}
export interface POSCustomer {
  customer?: CustomerType
  isNew?: boolean
  tempData?: NewCustomerFormData
}

export interface POSPaymentMethod {
  id: string
  tipo: string
  descripcion: string
  enabled: boolean
}

export interface POSInvoiceData {
  customer: POSCustomer
  items: POSCartItem[]
  subtotal: number
  descuentoTotal: number
  impuestoTotal: number
  total: number
  paymentMethod: POSPaymentMethod
  notas?: string
}

export interface POSAreaFilter {
  area: string
  iDArea: number
  count: number
}

export interface POSProductQuantityDialogData {
  producto: ProductType
  cantidad: number
  precio: number
  open: boolean
}

export interface POSState {
  cart: POSCartItem[]
  customer: POSCustomer | null
  selectedArea: string | null
  searchQuery: string
  paymentMethod: POSPaymentMethod | null
  isProcessing: boolean
}
