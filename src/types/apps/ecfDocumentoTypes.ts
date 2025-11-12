// ** ECF Documento Types for Electronic Invoice Framework Module

// ============================================
// Enums
// ============================================

export enum EcfDocumentType {
  // Electronic invoice (Factura Electrónica)
  Invoice = 0,
  // Credit note (Nota de Crédito Electrónica)
  CreditNote = 1,
  // Debit note (Nota de Débito Electrónica)
  DebitNote = 2,
  // ECF cancellation (Anulación de ECF)
  Cancellation = 3,
  // Minor expenses (Gastos Menores)
  MinorExpenses = 4,
  // Special regime (Régimen Especial)
  SpecialRegime = 5,
  // Governmental invoice (Factura Gubernamental)
  Government = 6,
}

export enum TipoDocumento {
  Invoice = 'invoice',
  CreditNote = 'credit_note',
  DebitNote = 'debit_note',
  Conduce = 'conduce',
  Order = 'order',
  Quote = 'quote',
}

export enum JobStatus {
  Pending = 0,
  Running = 1,
  Completed = 2,
  Failed = 3,
  Cancelled = 4,
  Retrying = 5,
}

export enum EcfStatusEnum {
  ECF_MSELLER = 'ecf mSeller',
  NOT_FOUND = 'No encontrado',
  ACCEPTED = 'Aceptado',
  REJECTED = 'Rechazado',
  IN_PROCESS = 'En Proceso',
  CONDITIONAL_ACCEPTED = 'Aceptado Condicional',
  IN_QUEUE = 'En Cola',
  SENT_TO_DGII = 'Enviado a la DGII',
  ERROR = 'Error',
  PENDING = 'Pendiente',
}

// ============================================
// Main ECF Document Entity
// ============================================

export interface EcfDocumentoType {
  // Core Identifiers
  id: number
  documentoId: string // NoPedidoStr, NoDocEntrega, etc.
  tipoDocumento: TipoDocumento // invoice, credit_note, debit_note, conduce, etc.
  tipoDocumentoEcf: EcfDocumentType // Invoice, CreditNote, DebitNote, Cancellation

  // Business Context
  codigoCliente: string
  codigoVendedor?: string | null
  localidadId?: number | null
  fechaDocumento: string // ISO 8601 datetime

  // ECF Response Data
  ncf?: string
  ncfDescripcion?: string | null
  tipoeCF?: number
  qrUrl?: string | null
  internalTrackId?: string | null
  securityCode?: string | null
  signedDate?: string | null

  // Status Tracking
  statusEcf?: string | null
  statusEcfUltimaActualizacion?: string | null // ISO 8601 datetime
  dgiiResponses?: string | null // JSON string

  // NCF Auto-update
  ncfAutoActualizado?: boolean
  ncfFechaAutoActualizado?: string | null // ISO 8601 datetime

  // Job Tracking
  jobId?: string | null
  jobStatus?: JobStatus | null
  jobQueuedAt?: string | null // ISO 8601 datetime
  jobStartedAt?: string | null // ISO 8601 datetime
  jobCompletedAt?: string | null // ISO 8601 datetime
  jobErrorMessage?: string | null
  jobRetryCount?: number
  jobRetryMaxAttempts?: number | null

  // Document References
  documentoReferenciadoId?: string | null
  documentoReferenciadoEcfId?: number | null
  motivoReferencia?: string | null

  // Audit Fields
  usuarioCreacion: string
  fechaCreacion: string // ISO 8601 datetime
  usuarioModificacion?: string | null
  fechaModificacion?: string | null // ISO 8601 datetime

  // Additional
  asignacionAutomatica?: boolean
  metadataJson?: string | null
  businessId?: string | null

  // Navigation properties
  documentoReferenciadoEcf?: EcfDocumentoType
  documentosReferenciados?: EcfDocumentoType[]
}

// ============================================
// API Interfaces
// ============================================

export interface EcfDocumentoFilters {
  // Basic search
  search?: string
  documentoId?: string // Partial match on document ID

  // Document type filters
  tipoDocumento?: TipoDocumento
  tipoDocumentoEcf?: EcfDocumentType

  // Business context filters
  codigoCliente?: string // Exact match on client code
  codigoVendedor?: string // Exact match on vendor code
  localidadId?: number // Location/warehouse ID

  // ECF specific filters
  ncf?: string // Partial match on NCF
  tipoeCF?: number // ECF type (31, 32, 33, etc.)
  statusEcf?: string // ECF status

  // Job and system filters
  jobStatus?: JobStatus
  ncfAutoActualizado?: boolean
  asignacionAutomatica?: boolean

  // Date filters
  fechaCreacionDesde?: string // ISO 8601 date (YYYY-MM-DD)
  fechaCreacionHasta?: string // ISO 8601 date (YYYY-MM-DD)
  fechaDocumentoDesde?: string // ISO 8601 date string
  fechaDocumentoHasta?: string // ISO 8601 date string

  // Pagination
  pageNumber?: number
  pageSize?: number
}

export interface EcfDocumentoState {
  data: EcfDocumentoType[]
  total: number
  loading: boolean
  error: string | null
  selectedItem: EcfDocumentoType | null
}

export interface PaginatedEcfDocumentoResponse {
  items: EcfDocumentoType[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

// Legacy compatibility - keep for existing code
export interface LegacyPaginatedEcfDocumentoResponse {
  data: EcfDocumentoType[]
  total: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

// ============================================
// Create/Update Request Types
// ============================================

export interface CreateEcfDocumentoRequest {
  documentoId: string
  tipoDocumento: TipoDocumento
  tipoDocumentoEcf: EcfDocumentType
  codigoCliente: string
  codigoVendedor?: string
  localidadId?: number
  fechaDocumento: string
  documentoReferenciadoId?: string
  documentoReferenciadoEcfId?: number
  motivoReferencia?: string
  asignacionAutomatica?: boolean
  metadataJson?: string
  usuarioCreacion: string
}

export interface UpdateEcfDocumentoRequest {
  id: number
  qrUrl?: string
  internalTrackId?: string
  securityCode?: string
  signedDate?: string
  statusEcf?: string
  dgiiResponses?: string
  ncfAutoActualizado?: boolean
  ncfFechaAutoActualizado?: string
  jobId?: string
  jobStatus?: JobStatus
  jobQueuedAt?: string
  jobStartedAt?: string
  jobCompletedAt?: string
  jobErrorMessage?: string
  jobRetryCount?: number
  jobRetryMaxAttempts?: number
  motivoReferencia?: string
  asignacionAutomatica?: boolean
  metadataJson?: string
  usuarioModificacion: string
}

// ============================================
// Job Management Types
// ============================================

export interface EcfJobInfo {
  jobId: string
  status: JobStatus
  queuedAt: string
  startedAt?: string
  completedAt?: string
  errorMessage?: string
  retryCount: number
  maxRetries: number
  documentoId: string
  tipoDocumento: TipoDocumento
}

export interface ProcessEcfDocumentRequest {
  documentoId: string
  tipoDocumento: TipoDocumento
  priority?: 'low' | 'normal' | 'high'
  retryMaxAttempts?: number
}

export interface ProcessEcfDocumentResponse {
  success: boolean
  message: string
  jobId?: string
  estimatedCompletionTime?: string
}

// ============================================
// DGII Integration Types
// ============================================

export interface DgiiResponse {
  timestamp: string
  responseCode: string
  message: string
  qrUrl?: string
  internalTrackId?: string
  securityCode?: string
  signedDate?: string
  additionalData?: Record<string, any>
}

export interface EcfStatusUpdateRequest {
  documentoId: string
  statusEcf: string
  dgiiResponse?: DgiiResponse
  automaticUpdate?: boolean
}

// ============================================
// Report and Analytics Types
// ============================================

export interface EcfDocumentoSummary {
  totalDocuments: number
  pendingDocuments: number
  completedDocuments: number
  failedDocuments: number
  processingDocuments: number
  byTipoDocumento: Record<TipoDocumento, number>
  byStatus: Record<string, number>
  averageProcessingTime: number
}

export interface EcfDocumentoReportFilters extends EcfDocumentoFilters {
  includeMetrics?: boolean
  groupBy?: 'day' | 'week' | 'month'
  exportFormat?: 'json' | 'csv' | 'excel'
}

// ============================================
// ECF Status Enum and Mappings
// ============================================

export const ecfStatusLabels: Record<EcfStatusEnum | string, string> = {
  [EcfStatusEnum.ECF_MSELLER]: 'ecf mSeller',
  [EcfStatusEnum.NOT_FOUND]: 'No encontrado',
  [EcfStatusEnum.ACCEPTED]: 'Aceptado',
  [EcfStatusEnum.REJECTED]: 'Rechazado',
  [EcfStatusEnum.IN_PROCESS]: 'En Proceso',
  [EcfStatusEnum.CONDITIONAL_ACCEPTED]: 'Aceptado Condicional',
  [EcfStatusEnum.IN_QUEUE]: 'En Cola',
  [EcfStatusEnum.SENT_TO_DGII]: 'Enviado a la DGII',
  [EcfStatusEnum.ERROR]: 'Error',
  [EcfStatusEnum.PENDING]: 'Pendiente',
}

export const ecfStatusObj: Record<EcfStatusEnum | string, string> = {
  [EcfStatusEnum.ECF_MSELLER]: 'info',
  [EcfStatusEnum.NOT_FOUND]: 'warning',
  [EcfStatusEnum.ACCEPTED]: 'success',
  [EcfStatusEnum.REJECTED]: 'error',
  [EcfStatusEnum.IN_PROCESS]: 'info',
  [EcfStatusEnum.CONDITIONAL_ACCEPTED]: 'warning',
  [EcfStatusEnum.IN_QUEUE]: 'secondary',
  [EcfStatusEnum.SENT_TO_DGII]: 'primary',
  [EcfStatusEnum.ERROR]: 'error',
  [EcfStatusEnum.PENDING]: 'warning',
}

// Helper function to get ECF status description (equivalent to C# extension method)
export const getEcfStatusDescription = (
  status: EcfStatusEnum | string,
): string => {
  return ecfStatusLabels[status] || ''
}

// TipoDocumento Enum Mappings
export const tipoDocumentoLabels: Record<TipoDocumento | string, string> = {
  [TipoDocumento.Invoice]: 'Factura',
  [TipoDocumento.CreditNote]: 'Nota de Crédito',
  [TipoDocumento.DebitNote]: 'Nota de Débito',
  [TipoDocumento.Conduce]: 'Conduce',
  [TipoDocumento.Order]: 'Orden',
  [TipoDocumento.Quote]: 'Cotización',
}

export const tipoDocumentoObj: Record<TipoDocumento | string, string> = {
  [TipoDocumento.Invoice]: 'primary',
  [TipoDocumento.CreditNote]: 'success',
  [TipoDocumento.DebitNote]: 'warning',
  [TipoDocumento.Conduce]: 'info',
  [TipoDocumento.Order]: 'secondary',
  [TipoDocumento.Quote]: 'default',
}

// Helper function to get TipoDocumento label
export const getTipoDocumentoLabel = (tipo: TipoDocumento | string): string => {
  return tipoDocumentoLabels[tipo] || tipo
}

// EcfDocumentType Enum Mappings
export const ecfDocumentTypeLabels: Record<EcfDocumentType | number, string> = {
  [EcfDocumentType.Invoice]: 'Factura Electrónica',
  [EcfDocumentType.CreditNote]: 'Nota de Crédito Electrónica',
  [EcfDocumentType.DebitNote]: 'Nota de Débito Electrónica',
  [EcfDocumentType.Cancellation]: 'Anulación de ECF',
  [EcfDocumentType.MinorExpenses]: 'Gastos Menores',
  [EcfDocumentType.SpecialRegime]: 'Régimen Especial',
  [EcfDocumentType.Government]: 'Factura Gubernamental',
}

export const ecfDocumentTypeObj: Record<EcfDocumentType | number, string> = {
  [EcfDocumentType.Invoice]: 'primary',
  [EcfDocumentType.CreditNote]: 'success',
  [EcfDocumentType.DebitNote]: 'warning',
  [EcfDocumentType.Cancellation]: 'error',
  [EcfDocumentType.MinorExpenses]: 'info',
  [EcfDocumentType.SpecialRegime]: 'secondary',
  [EcfDocumentType.Government]: 'default',
}

// Helper function to get EcfDocumentType label
export const getEcfDocumentTypeLabel = (
  tipo: EcfDocumentType | number,
): string => {
  return ecfDocumentTypeLabels[tipo] || tipo.toString()
}

// ============================================
// Job Status Enum and Mappings
// ============================================

export const jobStatusLabels: Record<JobStatus | number, string> = {
  [JobStatus.Pending]: 'Pendiente',
  [JobStatus.Running]: 'En Ejecución',
  [JobStatus.Completed]: 'Completado',
  [JobStatus.Failed]: 'Fallido',
  [JobStatus.Cancelled]: 'Cancelado',
  [JobStatus.Retrying]: 'Reintentando',
}

export const jobStatusColors: Record<JobStatus | number, string> = {
  [JobStatus.Pending]: 'warning',
  [JobStatus.Running]: 'info',
  [JobStatus.Completed]: 'success',
  [JobStatus.Failed]: 'error',
  [JobStatus.Cancelled]: 'default',
  [JobStatus.Retrying]: 'secondary',
}

// Helper function to get Job status description
export const getJobStatusDescription = (status: JobStatus | number): string => {
  return jobStatusLabels[status] || 'Desconocido'
}

// Helper function to get Job status color
export const getJobStatusColor = (status: JobStatus | number): string => {
  return jobStatusColors[status] || 'default'
}
