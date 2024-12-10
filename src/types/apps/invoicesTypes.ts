import { CustomerType } from './customerType'
import { SellerType } from './sellerType'

export interface InvoiceListType {
  data: InvoiceType[]
  total: number
  pageNumber: number
  pageSize: number
  totalPages: number
  totalResults: number
}

export interface InvoiceType {
  no_factura: string
  codigo_cliente: string
  fecha: string
  fecha_vencimiento: string
  codigo_vendedor: string
  ncf: string
  tipo_documento: string
  cantidad_pagos: number
  confirmada: number
  condicion_pago: string
  devolucion_subtotal: number
  devolucion_impuesto: number
  impuesto: number
  subtotal: number
  descuento: number
  total: number
  saldo_restante: number
  cliente: CustomerType
  businessId: string
  vendedor: SellerType
}
