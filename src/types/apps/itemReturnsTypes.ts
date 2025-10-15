// ** Item Returns Types
// Based on API documentation: ui-integration-inventory-devolution-apis.md

// ** Import existing document types
import { DocumentType } from './documentTypes'

// ** Document Item Types for auto-loading
export interface DocumentoDetalle {
  codigoProducto: string
  descripcionProducto: string
  cantidad: number
  cantidadDisponible: number // Available quantity for return
  precioUnitario: number
  descuentoUnitario: number
  porcentajeDescuento: number
  impuestoUnitario: number
  porcentajeImpuesto: number
  tipoImpuesto: string
  subTotal: number
  unidad?: string
  categoria?: string
}

// ** Use existing DocumentType from the API
export type DocumentoResponse = DocumentType

export interface ProcesarDevolucionRequest {
  numeroDocumento: string // Required: Invoice number (NoPedidoStr or SecuenciaDocumento)
  productos: DevolucionDetalle[] // Required: Products to return
}

export interface CalcularDevolucionRequest {
  numeroDocumento: string // Required: Invoice number
  productos: DevolucionDetalle[] // Required: Products to calculate
}

export interface DevolucionDetalle {
  codigoProducto: string // Required: Product code
  cantidad: number // Required: Quantity to return
  motivoDevolucion?: string // Optional: Return reason

  // These are calculated automatically from original document
  // Include only if you want to override
  precioUnitario?: number
  descuentoUnitario?: number
  porcentajeDescuento?: number
  impuestoUnitario?: number
  porcentajeImpuesto?: number
  tipoImpuesto?: string
}

export interface DevolucionDetalleResponse extends DevolucionDetalle {
  subTotalSinDescuento: number
  totalDescuento: number
  baseImponible: number
  totalImpuesto: number
  montoDevolucion: number
  detalleCalculo: DevolucionCalculo
}

export interface DevolucionCalculo {
  codigoProducto: string
  cantidad: number
  precioUnitario: number
  subTotalBruto: number
  descuentoTotal: number
  baseGravable: number
  impuestoTotal: number
  montoFinal: number
}

export interface ResumenFiscalDevolucion {
  montoTotal: number
  totalBaseGravable: number
  totalDescuentos: number
  totalImpuestos: number
}

export interface MovimientoCxc {
  id: number
  numeroCxc: string
  tipoMovimiento: number
  tipoMovimientoDescripcion: string
  monto: number
  fechaMovimiento: string
  usuarioCreacion: string
}

export interface DevolucionResponse {
  numeroDocumento: string
  montoDevolucion: number
  productos: DevolucionDetalleResponse[]
  movimientoCxc?: MovimientoCxc // null if cash sale
  resumenFiscal: ResumenFiscalDevolucion
}

// ** UI Helper Types
export interface SelectedDocument {
  numeroDocumento: string
  fechaDocumento: string
  nombreCliente: string
  tipoDocumento: string
  montoTotal: number
}

export interface ReturnItem {
  codigoProducto: string
  descripcionProducto: string
  cantidad: number
  cantidadMaxima: number
  precioUnitario: number
  motivoDevolucion?: string
}

export interface ProductItem {
  codigoProducto: string
  descripcionProducto: string
  cantidad: number
  precioUnitario: number
  subTotal: number
  motivoDevolucion?: string
}

export interface ReturnCalculation {
  items: ReturnItem[]
  montoTotal: number
  resumenFiscal: ResumenFiscalDevolucion
}

export interface ProcessingResult {
  success: boolean
  numeroDocumento: string
  montoDevolucion: number
  movimientoCxc?: MovimientoCxc
}

export interface ProcessedReturn {
  id: string
  numeroDocumento: string
  fechaProceso: string
  montoDevolucion: number
  productos: DevolucionDetalleResponse[]
  usuario: string
  estado: string
  movimientoCxc?: MovimientoCxc
  resumenFiscal: ResumenFiscalDevolucion
}

// Type aliases for API responses
export type CalculationResponse = DevolucionResponse

// ** State interface for Redux store
export interface ItemReturnsState {
  selectedDocument: SelectedDocument | null
  documentItems: DocumentoDetalle[] // Added for auto-loaded items
  isLoadingDocumentItems: boolean
  documentItemsError: string | null
  returnItems: ReturnItem[]
  selectedProducts: ProductItem[]
  returnCalculation: ReturnCalculation | null
  calculations: CalculationResponse | null
  isCalculating: boolean
  calculationError: string | null
  isProcessing: boolean
  processError: string | null
  processingResult: ProcessingResult | null
  returnHistory: ProcessedReturn[]
  isLoadingHistory: boolean
  historyError: string | null
  filters: {
    dateFrom?: string
    dateTo?: string
    status?: string
    documentNumber?: string
  }
}

// ** Initial state
export const initialItemReturnsState: ItemReturnsState = {
  selectedDocument: null,
  documentItems: [],
  isLoadingDocumentItems: false,
  documentItemsError: null,
  returnItems: [],
  selectedProducts: [],
  returnCalculation: null,
  calculations: null,
  isCalculating: false,
  calculationError: null,
  isProcessing: false,
  processError: null,
  processingResult: null,
  returnHistory: [],
  isLoadingHistory: false,
  historyError: null,
  filters: {},
}

// ** Common return reasons
export const motivosDevolucion = [
  'Producto defectuoso',
  'Error en pedido',
  'Cliente no satisfecho',
  'Producto dañado en transporte',
  'Producto vencido',
  'Error de precio',
  'Duplicado',
  'Otro',
] as const

export type MotivoDevolucion = (typeof motivosDevolucion)[number]
