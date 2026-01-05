// ** Core Reports Management Types

// Import document types
import { TipoDocumentoEnum, tipoDocumentoSpanishNames } from './documentTypes'

// ============================================
// Enums
// ============================================

// Backend uses numeric values for TipoDocumento in reports
// Maps to TipoDocumentoEnum string values (follows enum order)
export enum TipoDocumentoNumerico {
  Pedido = 0, // ORDER
  Factura = 1, // INVOICE
  Cotizacion = 2, // QUOTE
  OrdenCompra = 3, // BUY
  Recibo = 4, // RECEIPT
  NotaCredito = 5, // CREDIT_NOTE
  NotaDebito = 6, // DEBIT_NOTE
  Devolucion = 7, // RETURN_ORDER
}

// Mapping from numeric to string enum
const numericoToString: Record<number, TipoDocumentoEnum> = {
  0: TipoDocumentoEnum.ORDER,
  1: TipoDocumentoEnum.INVOICE,
  2: TipoDocumentoEnum.QUOTE,
  3: TipoDocumentoEnum.BUY,
  4: TipoDocumentoEnum.RECEIPT,
  5: TipoDocumentoEnum.CREDIT_NOTE,
  6: TipoDocumentoEnum.DEBIT_NOTE,
  7: TipoDocumentoEnum.RETURN_ORDER,
}

// Helper function to get Spanish name for numeric document type
export function getTipoDocumentoName(tipoDocumento: number): string {
  const tipoString = numericoToString[tipoDocumento]
  if (tipoString) {
    return tipoDocumentoSpanishNames[tipoString]
  }
  return `Tipo ${tipoDocumento}`
}

export enum TipoPlantilla {
  Print = 1,
  Email = 2,
}

export enum ReportStatus {
  Draft = 'Draft',
  Active = 'Active',
  Inactive = 'Inactive',
  Archived = 'Archived',
}

export enum ReportCategory {
  Ventas = 'Ventas',
  Inventario = 'Inventario',
  CuentasPorCobrar = 'CuentasPorCobrar',
  Clientes = 'Clientes',
  Productos = 'Productos',
  Financiero = 'Financiero',
  Operacional = 'Operacional',
  Personalizado = 'Personalizado',
}

export enum ReportFrequency {
  Diario = 'Diario',
  Semanal = 'Semanal',
  Quincenal = 'Quincenal',
  Mensual = 'Mensual',
  Trimestral = 'Trimestral',
  Anual = 'Anual',
  Personalizado = 'Personalizado',
}

export enum TemplateStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

// ============================================
// Main Report Template Entity
// ============================================

export interface PlantillaReporte {
  id: number
  nombre: string
  tipoDocumento: TipoDocumentoNumerico
  tipoModulo?: TipoDocumentoNumerico // Legacy alias
  tipoPlantilla: TipoPlantilla
  contenidoScriban: string // HTML/CSS with Scriban syntax for rendering
  idioma: string
  version: number
  habilitado: boolean
  esPlantillaPorDefecto: boolean
  isGlobal: boolean
  descripcion: string | null
  usuarioCreacion: string | null
  fechaCreacion: string // ISO 8601 date string
  usuarioModificacion?: string | null
  fechaModificacion?: string | null

  // Legacy fields (for backward compatibility)
  categoria?: ReportCategory
  estado?: TemplateStatus
  frecuenciaGeneracion?: ReportFrequency | null
  formatoSalida?: string | null
  parametrosJson?: string | null
  consultaSql?: string | null
  businessId?: string | null

  // Parsed parameters
  parametros?: ReportParameter[]

  // Navigation properties
  reportesGenerados?: ReporteGenerado[]
}

export interface ReportParameter {
  nombre: string
  tipo: 'string' | 'number' | 'date' | 'boolean' | 'select'
  requerido: boolean
  valorPorDefecto?: any
  opciones?: { label: string; value: any }[]
  descripcion?: string
}

// ============================================
// Generated Report Entity
// ============================================

export interface ReporteGenerado {
  id: number
  plantillaReporteId: number
  fechaGeneracion: string // ISO 8601 date string
  parametrosEjecucion: string | null
  rutaArchivo: string | null
  nombreArchivo: string | null
  tamanioArchivo: number | null
  businessId: string | null
  usuarioGeneracion: string | null

  // Navigation properties
  plantillaReporte?: PlantillaReporte

  // Parsed execution parameters
  parametros?: Record<string, any>

  // Calculated properties
  tamanioFormateado?: string
}

// ============================================
// API Request/Response Types
// ============================================

export interface ReportsFilters {
  search?: string
  categoria?: ReportCategory
  estado?: TemplateStatus
  frecuencia?: ReportFrequency
  businessId?: string
  usuarioCreacion?: string
  fechaCreacionDesde?: string
  fechaCreacionHasta?: string
}

export interface ReportsListParams {
  pageNumber?: number
  pageSize?: number
  filters?: ReportsFilters
  query?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasPrevious: boolean
    hasNext: boolean
  }
}

export interface CreateReportTemplateRequest {
  nombre: string
  descripcion?: string
  tipoDocumento: TipoDocumentoNumerico // Required - backend validates this
  tipoPlantilla: TipoPlantilla
  contenidoScriban: string // HTML/CSS with Scriban syntax for rendering
  idioma: string
  habilitado: boolean
  esPlantillaPorDefecto: boolean
  isGlobal: boolean

  // Legacy fields
  categoria?: ReportCategory
  estado?: TemplateStatus
  frecuenciaGeneracion?: ReportFrequency
  formatoSalida?: string
  parametrosJson?: string
  consultaSql?: string
}

export interface UpdateReportTemplateRequest {
  id: number
  nombre: string
  descripcion?: string
  tipoDocumento: TipoDocumentoNumerico // Required - backend validates this
  tipoPlantilla: TipoPlantilla // Required - backend validates this
  contenidoScriban?: string
  idioma: string
  version: number
  habilitado: boolean
  esPlantillaPorDefecto: boolean
  isGlobal: boolean

  // Legacy fields
  categoria?: ReportCategory
  estado?: TemplateStatus
  frecuenciaGeneracion?: ReportFrequency
  formatoSalida?: string
  parametrosJson?: string
  consultaSql?: string
}

export interface GenerateReportRequest {
  plantillaReporteId: number
  parametros?: Record<string, any>
}

export interface GenerateReportResponse {
  reporteGeneradoId: number
  rutaArchivo: string
  nombreArchivo: string
  mensaje: string
}

// ============================================
// Report Statistics
// ============================================

export interface ReportsSummaryStats {
  totalTemplates: number
  activeTemplates: number
  inactiveTemplates: number
  reportsGeneratedThisMonth: number
  reportsGeneratedToday: number
  reportsByCategory: {
    categoria: ReportCategory
    cantidad: number
  }[]
  mostUsedTemplates: {
    plantillaId: number
    nombre: string
    categoria: ReportCategory
    cantidadGeneraciones: number
  }[]
}

// ============================================
// Redux State
// ============================================

export interface ReportsState {
  // Report Templates List
  templates: PlantillaReporte[]
  templatesTotal: number
  templatesPageNumber: number
  templatesPageSize: number
  templatesTotalPages: number

  // Selected Template
  selectedTemplate: PlantillaReporte | null

  // Summary Statistics
  summaryStats: ReportsSummaryStats | null

  // UI State
  isLoading: boolean
  isProcessing: boolean
  filters: ReportsFilters
  error: string | null
  lastUpdated: string | null
}

// ============================================
// Form Types
// ============================================

export interface ReportTemplateFormData {
  nombre: string
  descripcion: string
  categoria: ReportCategory
  estado: TemplateStatus
  frecuenciaGeneracion: ReportFrequency | null
  formatoSalida: string
  parametrosJson: string
  consultaSql: string
}

export interface GenerateReportFormData {
  plantillaReporteId: number
  parametros: Record<string, any>
}
