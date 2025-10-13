// ** Core CXC Types for Accounts Receivable Module

// ============================================
// Enums
// ============================================

export enum EstadoCxc {
  Pendiente = 'Pendiente',
  PagoParcial = 'PagoParcial',
  Pagado = 'Pagado',
  Vencido = 'Vencido',
  Anulado = 'Anulado',
}

export enum TipoMovimientoCxc {
  Pago = 'Pago',
  NotaCredito = 'NotaCredito',
  Devolucion = 'Devolucion',
  AjustePositivo = 'AjustePositivo',
  AjusteNegativo = 'AjusteNegativo',
}

export enum TipoDocumento {
  Invoice = 'invoice',
  CreditNote = 'creditNote',
  DebitNote = 'debitNote',
}

// ============================================
// Main CXC Entity
// ============================================

export interface CuentaCxc {
  id: number
  numeroCxc: string
  numeroDocumento: string
  secuenciaDocumento: string | null
  tipoDocumento: TipoDocumento
  codigoCliente: string
  fechaEmision: string // ISO 8601 date string
  fechaVencimiento: string // ISO 8601 date string
  montoTotal: number
  montoAbonado: number
  saldoPendiente: number
  estado: EstadoCxc
  condicionPago: string | null
  diasCredito: number
  localidadId: number
  businessId: string | null
  fechaCreacion: string // ISO 8601 date string
  creadoPor: string | null

  // Navigation properties (may be null if not included)
  cliente?: Cliente
  localidad?: Localidad
  condicion?: CondicionPago
  movimientos?: MovimientoCxc[]

  // Calculated properties
  estaVencido: boolean
  diasVencimiento: number
  porcentajePagado: number
}

export interface MovimientoCxc {
  id: number
  cuentasPorCobrarId: number
  tipoMovimiento: TipoMovimientoCxc
  numeroMovimiento: string
  fechaMovimiento: string // ISO 8601 date string
  monto: number
  numeroReferencia: string | null
  observaciones: string | null
  businessId: string | null
  usuarioCreacion: string
  fechaCreacion: string // ISO 8601 date string

  // Navigation properties
  cuentasPorCobrar?: CuentaCxc

  // Calculated properties
  tipoMovimientoDescripcion: string
}

// ============================================
// Related Entities
// ============================================

export interface Cliente {
  codigo: string
  nombre: string
  email?: string
  telefono?: string
  direccion?: string
}

export interface Localidad {
  id: number
  nombre: string
  codigo?: string
  activa: boolean
}

export interface CondicionPago {
  condicionPago: string
  descripcion: string
  dias: number
  activa: boolean
}

// ============================================
// Pagination & Filtering
// ============================================

export interface PaginatedResponse<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface CxcListParams {
  pageNumber?: number // Default: 1
  pageSize?: number // Default: 20, Max: 100
  query?: string // General search query
  filters?: CxcFilters
}

// Extended parameters that match API exactly
export interface CxcApiParams {
  pageNumber?: number
  pageSize?: number
  codigoCliente?: string
  nombreCliente?: string
  codigoVendedor?: string
  numeroDocumento?: string
  secuenciaDocumento?: string
  estado?: EstadoCxc
  localidadId?: number
  condicionPago?: string
  fechaDesde?: string
  fechaHasta?: string
  fechaVencimientoDesde?: string
  fechaVencimientoHasta?: string
  montoMinimo?: number
  montoMaximo?: number
  saldoPendienteMinimo?: number
  saldoPendienteMaximo?: number
  soloVencidas?: boolean
  diasVencidosMinimo?: number
  diasVencidosMaximo?: number
}

export interface CxcFilters {
  // Client filters
  codigoCliente?: string
  nombreCliente?: string

  // Vendor filter
  codigoVendedor?: string

  // Document filters
  numeroDocumento?: string
  secuenciaDocumento?: string
  tipoDocumento?: TipoDocumento[]

  // Status and state
  estado?: EstadoCxc | EstadoCxc[] // Single or multiple states

  // Location filter
  localidadId?: number

  // Payment condition
  condicionPago?: string

  // Date filters
  fechaDesde?: string // Emission date from
  fechaHasta?: string // Emission date to
  fechaVencimientoDesde?: string // Due date from
  fechaVencimientoHasta?: string // Due date to

  // Amount filters
  montoMinimo?: number
  montoMaximo?: number
  saldoPendienteMinimo?: number
  saldoPendienteMaximo?: number

  // Overdue filters
  soloVencidas?: boolean
  diasVencidosMinimo?: number
  diasVencidosMaximo?: number

  // Legacy support - keeping for backwards compatibility
  fechaEmisionDesde?: string
  fechaEmisionHasta?: string
  vendedores?: string[]
  localidades?: number[]
}

// ============================================
// Reports
// ============================================

export interface ReporteCxc {
  fechaInicio: string // ISO 8601 date string
  fechaFin: string // ISO 8601 date string
  totalDocumentos: number
  montoTotalFacturado: number
  montoTotalCobrado: number
  saldoPendienteTotal: number
  documentosVencidos: number
  montoVencido: number
  cxcPorCliente: CxcPorCliente[]
  cxcPorEstado: CxcPorEstado[]
  cxcVencidas: CxcVencida[]
}

export interface CxcPorCliente {
  codigoCliente: string
  nombreCliente: string
  cantidadDocumentos: number
  montoTotal: number
  saldoPendiente: number
  diasPromedioVencimiento: number
}

export interface CxcPorEstado {
  estado: string
  cantidad: number
  montoTotal: number
  porcentaje: number
}

export interface CxcVencida {
  numeroCxc: string
  numeroDocumento: string
  codigoCliente: string
  nombreCliente: string
  fechaVencimiento: string // ISO 8601 date string
  diasVencimiento: number
  saldoPendiente: number
}

export interface CxcSummaryStats {
  totalCuentas: number
  montoTotalPendiente: number
  cuentasVencidas: number
  montoVencido: number
  promedioEdad: number
  tasaCobranza: number
}

// ============================================
// Request/Response Types
// ============================================

export interface PagoRequest {
  monto: number
  numeroReferencia?: string
  observaciones?: string
}

export interface NotaCreditoRequest {
  monto: number
  motivo?: string
  observaciones?: string
}

export interface DevolucionRequest {
  productos: DevolucionDetalle[]
  motivoGeneral?: string
}

export interface DevolucionDetalle {
  codigoProducto: string
  cantidad: number
  motivoDevolucion?: string

  // Optional - calculated automatically if not provided
  precioUnitario?: number
  descuentoUnitario?: number
  porcentajeDescuento?: number
  impuestoUnitario?: number
  porcentajeImpuesto?: number
  tipoImpuesto?: string
}

export interface CalcularDevolucionRequest {
  numeroDocumento: string
  productos: ProductoDevolucionSimple[]
}

export interface ProductoDevolucionSimple {
  codigoProducto: string
  cantidad: number
}

export interface DevolucionResponse {
  movimiento: MovimientoCxc
  detalleCalculos: DevolucionCalculoDetalle[]
  resumenFiscal: ResumenFiscal
}

export interface DevolucionCalculoDetalle {
  codigoProducto: string
  cantidad: number
  precioUnitario: number
  baseGravable: number
  totalDescuento: number
  totalImpuesto: number
  montoFinal: number
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

export interface ResumenFiscal {
  montoTotal: number
  totalBaseGravable: number
  totalDescuentos: number
  totalImpuestos: number
}

// ============================================
// UI State Management
// ============================================

export interface CxcState {
  // List data
  data: CuentaCxc[]
  total: number
  pageNumber: number
  pageSize: number
  totalPages: number
  totalResults: number

  // Single CXC detail
  selectedCxc: CuentaCxc | null

  // Overdue CXCs
  overdueData: CuentaCxc[]
  overdueTotal: number

  // Client CXCs
  clientCxcData: CuentaCxc[]
  clientCxcTotal: number

  // Reports
  reportData: ReporteCxc | null
  summaryStats: CxcSummaryStats | null

  // UI State
  isLoading: boolean
  isProcessing: boolean
  filters: CxcFilters
  error: string | null
  lastUpdated: string | null
}

// ============================================
// Form Validation Schemas
// ============================================

export interface CxcFormErrors {
  monto?: string
  numeroReferencia?: string
  motivo?: string
  productos?: string
  general?: string
}

export interface PaymentFormData {
  monto: number
  numeroReferencia: string
  observaciones: string
}

export interface CreditNoteFormData {
  monto: number
  motivo: string
  observaciones: string
}

export interface ReturnFormData {
  productos: {
    codigoProducto: string
    cantidad: number
    motivoDevolucion: string
  }[]
  motivoGeneral: string
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, any>
}

// ============================================
// Chart/Visualization Types
// ============================================

export interface CxcChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
    borderColor?: string[]
  }[]
}

export interface CxcMetrics {
  totalOutstanding: number
  overdueAmount: number
  collectionRate: number
  averageAge: number
  thisMonthCollected: number
  previousMonthCollected: number
}

// ============================================
// Export Types
// ============================================

export interface CxcExportOptions {
  format: 'excel' | 'pdf' | 'csv'
  dateRange?: {
    start: string
    end: string
  }
  filters?: CxcFilters
  includeMovements?: boolean
}

export type CxcActionType =
  | 'VIEW_DETAIL'
  | 'PROCESS_PAYMENT'
  | 'CREATE_CREDIT_NOTE'
  | 'PROCESS_RETURN'
  | 'EXPORT_DATA'
  | 'SEND_REMINDER'
  | 'VIEW_CLIENT'

// ============================================
// Mobile-specific Types
// ============================================

// ============================================
// Advanced Filter UI Types
// ============================================

export interface AmountRange {
  min?: number
  max?: number
}

export interface DateRange {
  from?: string
  to?: string
}

export interface VendorOption {
  codigo: string
  nombre: string
}

export interface LocalidadOption {
  id: number
  nombre: string
}

export interface FilterSection {
  id: string
  title: string
  expanded: boolean
  fields: string[]
}

export interface AdvancedFilters {
  client: {
    codigoCliente?: string
    nombreCliente?: string
  }
  vendor: {
    codigoVendedor?: string
  }
  document: {
    numeroDocumento?: string
    secuenciaDocumento?: string
  }
  dates: {
    emission: DateRange
    due: DateRange
  }
  amounts: {
    total: AmountRange
    pending: AmountRange
  }
  overdue: {
    onlyOverdue: boolean
    daysRange: AmountRange
  }
  location: {
    localidadId?: number
  }
  paymentCondition: {
    condicionPago?: string
  }
  status: {
    estados: EstadoCxc[]
  }
}

export interface MobileViewConfig {
  showFilters: boolean
  compactMode: boolean
  cardView: boolean
  selectedItems: number[]
}

export interface SwipeAction {
  id: string
  label: string
  icon: string
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  action: (item: CuentaCxc) => void
}
