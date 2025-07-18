import { CustomerType } from './customerType'
import { ProductType } from './productTypes'
import { CondicionPagoType } from './paymentTypeTypes'

export interface POSCartItem {
  id: string
  producto: ProductType
  cantidad: number
  precio: number
  subtotal: number
  descuento: number
  impuesto: number
}

export interface POSCustomer {
  customer?: CustomerType
  isNew?: boolean
  tempData?: {
    nombre: string
    telefono?: string
    email?: string
    direccion?: string
    rnc?: string
  }
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
