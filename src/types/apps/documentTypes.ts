import { ClienteType } from './clientTypes'
import { LocalidadType } from './locationType'

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
  QUOTE = 'quote',
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
  codigoVendedor: string
  tipoDocumento: TipoDocumentoEnum
  confirmado: boolean
  tipoPedido: string
  localidad: LocalidadType
  codigoCliente: string
  nombreCliente: string
  nuevoCliente: boolean
  fecha: string
  nota: string
  cliente: ClienteType
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
  vendedor: Vendedor
  clienteNuevo: any
  detalle: DocumentTypeDetail[]
}

export interface DocumentTypeDetail {
  id: string
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
