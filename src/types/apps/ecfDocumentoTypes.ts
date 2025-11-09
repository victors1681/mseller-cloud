// ** ECF Documento Types for Electronic Invoice Framework Module

// ============================================
// Enums
// ============================================

export enum EcfDocumentType {
  Invoice = 'Invoice',
  CreditNote = 'CreditNote',
  DebitNote = 'DebitNote',
  Cancellation = 'Cancellation',
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
  id: number

  // Document Reference - Universal across all document types
  documentoId: string // NoPedidoStr, NoDocEntrega, etc.
  tipoDocumento: TipoDocumento // invoice, credit_note, debit_note, conduce, etc.
  tipoDocumentoEcf: EcfDocumentType // Invoice, CreditNote, DebitNote, Cancellation

  // Business context
  codigoCliente: string
  codigoVendedor?: string
  localidadId?: number
  fechaDocumento: string // ISO 8601 date string

  // ECF Response Data (from DGII service)
  qrUrl?: string
  internalTrackId?: string
  securityCode?: string
  signedDate?: string

  ncf?: string // NCF assigned by DGII
  ncfDescripcion?: string // Description of NCF type

  // ECF Status tracking
  statusEcf?: EcfStatusEnum // Uses EcfStatusEnum descriptions
  statusEcfUltimaActualizacion?: string // ISO 8601 date string

  // DGII Response History - Store all responses as JSON array
  dgiiResponses?: string // JSON string containing array of DGII response objects

  // NCF Auto-update tracking
  ncfAutoActualizado?: boolean
  ncfFechaAutoActualizado?: string // ISO 8601 date string

  // Background Job Tracking
  jobId?: string
  jobStatus?: JobStatus
  jobQueuedAt?: string // ISO 8601 date string
  jobStartedAt?: string // ISO 8601 date string
  jobCompletedAt?: string // ISO 8601 date string
  jobErrorMessage?: string // Long text for error details
  jobRetryCount?: number
  jobRetryMaxAttempts?: number

  // Document References (for credit notes, cancellations, etc.)
  documentoReferenciadoId?: string // Original invoice for credit note
  documentoReferenciadoEcfId?: number // FK to parent EcfDocumento
  motivoReferencia?: string // Cancellation reason, credit note reason, etc.

  // Audit fields
  usuarioCreacion: string
  fechaCreacion: string // ISO 8601 date string
  usuarioModificacion?: string
  fechaModificacion?: string // ISO 8601 date string

  // Additional metadata
  asignacionAutomatica?: boolean
  metadataJson?: string // For flexible additional data

  // Multi-tenancy
  businessId?: string

  // Navigation properties
  documentoReferenciadoEcf?: EcfDocumentoType
  documentosReferenciados?: EcfDocumentoType[]
}

// ============================================
// API Interfaces
// ============================================

export interface EcfDocumentoFilters {
  search?: string
  tipoDocumento?: TipoDocumento
  tipoDocumentoEcf?: EcfDocumentType
  codigoCliente?: string
  codigoVendedor?: string
  localidadId?: number
  statusEcf?: string
  jobStatus?: JobStatus
  fechaDocumentoDesde?: string // ISO 8601 date string
  fechaDocumentoHasta?: string // ISO 8601 date string
  ncfAutoActualizado?: boolean
  asignacionAutomatica?: boolean
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
