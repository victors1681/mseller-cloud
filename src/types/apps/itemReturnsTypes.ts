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

// ** Initial state for combined state (including list view)
export const initialCombinedItemReturnsState: CombinedItemReturnsState = {
  ...initialItemReturnsState,
  listView: {
    listData: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    isLoadingList: false,
    listError: null,
    selectedListItem: null,
    listFilters: {
      pageNumber: 1,
      pageSize: 20,
    },
  },
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

// ============================================
// List View Types (for /portal/Devolucion GET endpoint)
// ============================================

export interface ItemReturnListItem {
  id: number
  numeroDocumento: string
  codigoProducto: string
  nombreProducto: string
  cantidad: number
  costoUnitario: number
  valorTotal: number
  nombreLocalidad: string
  fechaMovimiento: string // ISO 8601 date string
  usuarioCreacion: string
  observaciones: string
  codigoCliente: string
  nombreCliente: string
}

export interface ItemReturnsListFilters {
  pageNumber?: number
  pageSize?: number
  numeroDocumento?: string
  codigoProducto?: string
  codigoCliente?: string
  localidadId?: number
  fechaDesde?: string // ISO 8601 date string
  fechaHasta?: string // ISO 8601 date string
  usuario?: string
}

export interface PaginatedItemReturnsListResponse {
  items: ItemReturnListItem[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

// ============================================
// Enhanced Redux State for List View
// ============================================

export interface ItemReturnsListState {
  // List data
  listData: ItemReturnListItem[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean

  // Loading and error states for list
  isLoadingList: boolean
  listError: string | null

  // Selected item for details
  selectedListItem: ItemReturnListItem | null

  // List filters
  listFilters: ItemReturnsListFilters
}

// ============================================
// Combined State Interface
// ============================================

export interface CombinedItemReturnsState extends ItemReturnsState {
  listView: ItemReturnsListState
}

// ============================================
// UI Component Props for List View
// ============================================

export interface ItemReturnListCardProps {
  itemReturn: ItemReturnListItem
  onSelect?: (itemReturn: ItemReturnListItem) => void
  onView?: (itemReturn: ItemReturnListItem) => void
}

export interface ItemReturnsListFilterProps {
  filters: ItemReturnsListFilters
  onFiltersChange: (filters: ItemReturnsListFilters) => void
  onClearFilters: () => void
  loading?: boolean
}

export interface ItemReturnsListPaginationProps {
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}
