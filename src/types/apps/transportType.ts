import { TransportStatusEnum } from 'src/utils/transportMappings'
import { ClienteType } from './clientTypes'
import { LocalidadType } from './locationType'
import { VendedorType } from './sellerType'
import { DistribuidorType } from './driverType'

export interface TransportResponse {
  transportes: TransporteType[]
  total: number
  pageNumber: number
  pageSize: number
}

export enum PaymentTypeEnum {
  TRANSFER = 0,
  CREDIT = 1,
  CASH = 2,
  CHECK = 3,
}

export interface TransporteListType {
  distribuidor: DistribuidorType
  procesado: boolean
  status: number
  localidad: LocalidadType
  noTransporte: string
  localidadId: number
  codigoDistribuidor: string
  fecha: string
  observacion: string
  totalEntregas: number
}

export interface TransporteType {
  distribuidor: DistribuidorType
  procesado: boolean
  status: number
  localidad: LocalidadType
  noTransporte: string
  localidadId: number
  codigoDistribuidor: string
  fecha: string
  observacion: string
  documentosEntrega: DocumentoEntregaType[]
}

export enum TypoPagoEnum {
  Cash = 'efectivo',
  Check = 'cheque',
  Transfer = 'transferencia',
  Credit = 'credito',
}

export interface DocumentoEntregaResponseAxios {
  data: DocumentoEntregaResponse
}
export interface DocumentoEntregaResponse {
  noTransporte: string
  localidadId: number
  codigoDistribuidor: string
  fecha: string
  documentos: DocumentoEntregaType[]
  distribuidor: DistribuidorType
  procesado: boolean
  status: number
  entregadas: number
  noEntregadas: number
  entregarDespues: number

  efectivo: number
  cheque: number
  transferencia: number
  credito: number
  neto: number
}

export interface DocumentoEntregaType {
  bruto_E: number
  descuento: number
  descuento_E: number
  impuestos_E: number
  neto_E: number
  fechaRecibido: string
  procesado: boolean
  fechaProcesado: any
  status: TransportStatusEnum
  firmaUrl: string
  montoRecibido: number
  devuelta: number
  tipoPago: TypoPagoEnum | string
  entregaLongitud: number
  entregaLatitud: number
  impresion: number
  referencia: string
  fechaEntrega: string
  modificada: boolean
  recibida: boolean
  vendedor: VendedorType
  noDocEntrega: string
  codigoCliente: string
  fecha: string
  noPedido: string
  codigoVendedor: string
  tipoDocumento: string
  ncf: string
  confirmado: boolean
  bruto: number
  impuestos: number
  neto: number
  condicionPago: string
  fechaVencimiento: string
  noOrden: string
  observacion: string
  permitirEditar: boolean
  secuenciaEntrega: number
  detalle: DocumentoEntregaDetalleType[]
  cliente: ClienteType
  codigoMotivoRechazo: string
  motivoRechazo: MotivoRechazo
  NcfAutoActualizado: boolean
  NcfFechaAutoActualizado: string
}

export interface DocumentoEntregaDetalleType {
  producto: Producto
  cantidad_E: number
  porcientoDescuento_E: number
  totalDescuento_E: number
  porcientoImpuesto_E: number
  totalImpuesto_E: number
  subtotal_E: number
  lote_E: string
  posicionPartida: string
  noDocEntrega: string
  codigoProducto: string
  cantidad: number
  precioUnitario: number
  unidad: string
  factor: number
  porcientoDescuento: number
  totalDescuento: number
  porcientoImpuesto: number
  totalImpuesto: number
  subtotal: number
  tipoImpuesto: string
  esPromocion: boolean
  lote: string
}

export interface MotivoRechazo {
  codigo: string
  motivo: string
  activa: boolean
}

export interface Producto {
  codigo: string
  codigoBarra: string
  nombre: string
  area: string
  iDArea: number
  grupoId: string
  departamento: string
  unidad: string
  empaque: string
  impuesto: number
  factor: number
  iSC: number
  aDV: number
  descuento: number
  tipoImpuesto: string
  apartado: number
}

interface EntregaProducto {
  descripcion: string
  unidad: string
}

interface DetalleEntrega {
  codigoProducto: string
  devolver: number
  recibidas: number
  vendidas: number
  promocion: number
  productoDetalle: EntregaProducto
}

export interface ReporteEntrega {
  fecha: string
  noTransporte: string
  distribuidorNombre: string
  distribuidorCodigo: string
  detalle: DetalleEntrega[]
}

interface ClienteReport {
  codigo: string
  nombre: string
}

interface ProductoDetalle {
  descripcion: string
  unidad: string
}

interface Detalle {
  codigoProducto: string
  cantidad: number
  precio: number
  bruto: number
  porcientoDescuento: number
  descuento: number
  impuesto: number
  subTotal: number
  promocion: number
  productoDetalle: ProductoDetalle
}

export interface ReporteEntregaMonto {
  fecha: string
  noTransporte: string
  distribuidor: DistribuidorType
  totalDocumentos: number
  vendedores: VendedorType[]
  clientes: ClienteReport[]
  efectivo: number
  cheque: number
  transferencia: number
  credito: number
  neto: number
  detalle: Detalle[]
}
