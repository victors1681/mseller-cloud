import { CustomerType } from './customerType'
import { LocationType } from './locationType'

export type InvoiceStatus = 'Paid' | string

export type InvoiceLayoutProps = {
  noTransporte: string | undefined
}

export type InvoiceClientType = {
  name: string
  address: string
  company: string
  country: string
  contact: string
  companyEmail: string
}

export enum TipoDocumentoEnum {
  ORDER = 'order',
  INVOICE = 'invoice',
  QUOTE = 'quote',
  BUY = 'buy',
  RECEIPT = 'receipt',
  CREDIT_NOTE = 'credit_note',
  DEBIT_NOTE = 'debit_note',
  RETURN_ORDER = 'return_order',
  DELIVERY_NOTE = 'delivery_note',
}

export const tipoDocumentoSpanishNames: Record<TipoDocumentoEnum, string> = {
  [TipoDocumentoEnum.ORDER]: 'Pedido',
  [TipoDocumentoEnum.INVOICE]: 'Factura',
  [TipoDocumentoEnum.QUOTE]: 'Cotización',
  [TipoDocumentoEnum.BUY]: 'Compra',
  [TipoDocumentoEnum.RECEIPT]: 'Recibo',
  [TipoDocumentoEnum.CREDIT_NOTE]: 'Nota de Crédito',
  [TipoDocumentoEnum.DEBIT_NOTE]: 'Nota de Débito',
  [TipoDocumentoEnum.RETURN_ORDER]: 'Devolución',
  [TipoDocumentoEnum.DELIVERY_NOTE]: 'Nota de Entrega',
}

export function getTipoDocumentoSpanishName(tipo: string): string {
  const key = tipo as TipoDocumentoEnum
  return tipoDocumentoSpanishNames[key] ?? tipo
}

export interface StatusParam {
  noPedidoStr: string
  status: DocumentStatus
}

export enum DocumentStatus {
  Pending = 0,
  Processed = 1,
  Retained = 3,
  PendingPrint = 5,
  CreditCondition = 6,
  Backorder = 7,
  IntegrationError = 8,
  ReadyForIntegration = 9,
  SentToERP = 10,
}
export interface DocumentType {
  num_reg: string
  noPedidoStr: string
  noPedido: number
  secuenciaDocumento: string
  codigoVendedor: string
  tipoDocumento: TipoDocumentoEnum
  confirmado: boolean
  tipoPedido: string
  localidad: LocationType
  codigoCliente: string
  nombreCliente: string
  nuevoCliente: boolean
  fecha: string
  nota: string
  cliente?: CustomerType
  emailVendedor: string
  condicionPago: string
  noContacto: string
  descuento: number
  porcientoDescuento: number
  impuesto: number
  subTotal: number
  isc: number
  adv: number
  total: number
  firebaseUserId: string
  fechaVencimiento: string
  localidadId: number
  ncf: string
  ncfDescripcion: string
  noFactura: string
  noOrden: string
  avatarUrl: string
  procesado: DocumentStatus | number
  fechaProcesado: any
  impedimento: boolean
  notaImpedimento: string
  noPedidoServer: string
  fechaPedidoServer: string
  noFacturaServer: string
  fechaFacturaServer: any
  anulado: boolean
  fechaAnulado: any
  paramPedido: boolean
  paramFactura: boolean
  paramImpedimento: boolean
  usuarioProcesado: string
  usuarioModificado: string
  status: string
  mensajesError: string
  reintentar: number
  condicion: Condicion
  vendedor?: Vendedor
  clienteNuevo: any
  detalle: DocumentTypeDetail[]
  qrUrl: string
  internalTrackId?: string
  securityCode?: string
  signedDate?: string
  statusEcf?: string //Estado del documento en la ECF (Electronic Commerce Framework)
  ncfVencimiento?: any
}

export interface DocumentTypeDetail {
  id?: string
  noPedidoStr: string
  noPedido: number
  codigoVendedor: string
  codigoProducto: string
  cantidad: number
  descripcion: string
  precio: number
  impuesto: number
  porcientoImpuesto: number
  descuento: number
  porcientoDescuento: number
  factor: number
  factorOriginal: number
  isc: number
  adv: number
  subTotal: number
  editar: number
  productoRef: string
  idArea: number
  grupoId: string
  area: string
  unidad: string
  tipoImpuesto: string
  cantidadOriginal: number
  promocion: boolean
}

// New types for document updates and creation
export interface DocumentUpdateDetail {
  id: number | undefined
  codigoProducto: string
  cantidad: number
  descripcion: string
  precio: number
  impuesto: number
  porcientoImpuesto: number
  descuento: number
  porcientoDescuento: number
  factor: number
  factorOriginal: number
  isc: number
  adv: number
  subTotal: number
  productoRef: string
  grupoId: string
  area: string
  unidad: string
  tipoImpuesto: string
  cantidadOriginal: number
  existencia: number
  apartado: number
  promocion: boolean
}

export interface DocumentUpdateType {
  noPedidoStr: string
  nota: string
  condicionPago: string
  fecha: string // ISO date string
  descuento: number
  porcientoDescuento: number
  subTotal: number
  impuesto: number
  total: number
  fechaVencimiento?: string
  detalle: DocumentUpdateDetail[]
  tipoPedido?: string
  nuevoCliente?: boolean
  // New required fields
  tipoDocumento: string
  codigoCliente: string
  nombreCliente?: string
  firebaseUserId?: string
  localidadId: number
  noOrden?: string
  avatarUrl?: string
  confirmado: boolean
  codigoVendedor?: string
  clienteNuevo?: CustomerType // if defined indicates a new customer to be created
  // Added fields from C# model
  terminal?: string
  secuenciaDocumento?: string
  estadoPago?: EstadoPago
  tipoPago?: TipoPago
  moneda?: string
  dispositivo?: string
  impresion?: number
  fechaImpresion?: string
  turnoId?: string
  cancelada?: boolean
  razonCancelacion?: string
  reembolsada?: boolean
  fechaReembolso?: string
  montoRecibido?: number
  montoDevuelto?: number
  esVentaPOS?: boolean
}

// TODO: Replace these with actual definitions as needed
export enum EstadoPago {
  Paid = 'Paid',
  Pending = 'Pending',
  Refunded = 'Refunded',
  Cancelled = 'Cancelled',
}

export enum TipoPago {
  Cash = 'Cash',
  CreditCard = 'CreditCard',
  DebitCard = 'DebitCard',
  BankTransfer = 'BankTransfer',
  MobilePayment = 'MobilePayment',
  Check = 'Check',
  Voucher = 'Voucher',
  Split = 'Split',
}

export interface Condicion {
  id: number
  condicionPago: string
  dias: number
  tipo_condicion: string
  descripcion: string
}

export interface Vendedor {
  codigo: string
  nombre: string
  email: string
  status: string
  localidad: number
}

export type InvoicePaymentType = {
  iban: string
  totalDue: string
  bankName: string
  country: string
  swiftCode: string
}

export type SingleInvoiceType = {
  invoice: any
  paymentDetails: InvoicePaymentType
}
