import { CustomerType } from './customerType'
import { VendedorType } from './sellerType'

export enum CollectionEnum {
  pendiente = 0,
  procesado = 1,
  errorIntegracion = 8,
  listoIntegrar = 9,
  enviadoErp = 10,
}

export enum PaymentTypeEnum {
  Cheque = 'CK',
  Efectivo = 'E',
  Transferencia = 'T',
}
export interface CollectionType {
  vendedor: VendedorType
  banco?: BankType
  totalRecibos: number
  noDepositoStr: string
  noDeposito: number
  totalGeneral: number
  totalCobrado: number
  cantidadRecibos: number
  tipoTransaccion: string
  fecha: string
  noReferencia: string
  nombreBanco: string
  codigoVendedor: string
  notaDeposito: string
  linkComprobante: string
  segundoLinkComprobante: any
  firebaseUserid: string
  idBanco?: any
  avatarUrl: string
  procesado: CollectionEnum
  fechaSincronizado: string
  recibos: ReceiptType[]
}

export interface BankType {
  id: number
  nombre: string
  noCuenta: string
  disponibleDeposito: boolean
}

export interface ReceiptType {
  aplicado: boolean
  fechaAplicado: string
  paramAplicado: boolean
  noCaja: any
  noDepositoStr: string
  noReciboStr: string
  noRecibo: number
  noDeposito: number
  codigoCliente: string
  nombreCliente: string
  codigoVendedor: string
  cantidadDocumento: number
  totalCobro: number
  tipoPago: string
  nombreBanco: string
  idBanco: any
  nota: string
  fecha: string
  ckFuturista: boolean
  fechaFuturista: string
  email: string
  noReferencia: string
  linkImagenDocumento: string
  condicionPago: any
  impresion: number
  impAnulado: number
  anulado: number
  fechaAnulado: string
  procesado: CollectionEnum
  fechaSincronizado: string
  recibosDetalles: ReceiptDetailType[]
  vendedor: VendedorType
  cliente: CustomerType
  banco: BankType
}

export interface ReceiptDetailType {
  noReciboStr: string
  noRecibo: number
  codigoVendedor: string
  noDocumento: string
  subTotalDocumento: number
  itbisDocumento: number
  totalCobroDocumento: number
  notaDocumento: string
  fechaDocumento: string
  fecha: string
  confirmada: boolean
  descuento: number
  totalDocumento: number
  tipoDocumento: string
  campoLibre1: string
  campoLibre2: string
  numReg: number
  descuentoMonto: number
}
