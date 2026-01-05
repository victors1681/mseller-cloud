// ** Types for Template Configuration System

import { TipoDocumentoEnum } from './documentTypes'
import { TipoDocumentoNumerico } from './reportsTypes'

// Re-export for convenience
export { TipoDocumentoEnum, tipoDocumentoSpanishNames } from './documentTypes'
export { TipoDocumentoNumerico } from './reportsTypes'

// ============================================
// Mapping Functions
// ============================================

/**
 * Map TipoDocumentoEnum (string) to TipoDocumentoNumerico (number)
 */
export const mapDocumentTypeToNumerico = (
  documentType: TipoDocumentoEnum | string,
): TipoDocumentoNumerico => {
  const mapping: Record<TipoDocumentoEnum, TipoDocumentoNumerico> = {
    [TipoDocumentoEnum.ORDER]: TipoDocumentoNumerico.Pedido,
    [TipoDocumentoEnum.INVOICE]: TipoDocumentoNumerico.Factura,
    [TipoDocumentoEnum.QUOTE]: TipoDocumentoNumerico.Cotizacion,
    [TipoDocumentoEnum.BUY]: TipoDocumentoNumerico.OrdenCompra,
    [TipoDocumentoEnum.RECEIPT]: TipoDocumentoNumerico.Recibo,
    [TipoDocumentoEnum.CREDIT_NOTE]: TipoDocumentoNumerico.NotaCredito,
    [TipoDocumentoEnum.DEBIT_NOTE]: TipoDocumentoNumerico.NotaDebito,
    [TipoDocumentoEnum.RETURN_ORDER]: TipoDocumentoNumerico.Devolucion,
    [TipoDocumentoEnum.DELIVERY_NOTE]: TipoDocumentoNumerico.Pedido, // Fallback
    [TipoDocumentoEnum.INVOICE_TRANSPORT]: TipoDocumentoNumerico.Factura, // Fallback
  }

  return (
    mapping[documentType as TipoDocumentoEnum] || TipoDocumentoNumerico.Pedido
  )
}

/**
 * Map TipoDocumentoNumerico (number) to TipoDocumentoEnum (string)
 */
export const mapNumericoToDocumentType = (
  tipoNumerico: TipoDocumentoNumerico,
): TipoDocumentoEnum => {
  const mapping: Record<TipoDocumentoNumerico, TipoDocumentoEnum> = {
    [TipoDocumentoNumerico.Pedido]: TipoDocumentoEnum.ORDER,
    [TipoDocumentoNumerico.Factura]: TipoDocumentoEnum.INVOICE,
    [TipoDocumentoNumerico.Cotizacion]: TipoDocumentoEnum.QUOTE,
    [TipoDocumentoNumerico.OrdenCompra]: TipoDocumentoEnum.BUY,
    [TipoDocumentoNumerico.Recibo]: TipoDocumentoEnum.RECEIPT,
    [TipoDocumentoNumerico.NotaCredito]: TipoDocumentoEnum.CREDIT_NOTE,
    [TipoDocumentoNumerico.NotaDebito]: TipoDocumentoEnum.DEBIT_NOTE,
    [TipoDocumentoNumerico.Devolucion]: TipoDocumentoEnum.RETURN_ORDER,
  }

  return mapping[tipoNumerico] || TipoDocumentoEnum.ORDER
}

// ============================================
// Configuration Interfaces
// ============================================

export interface PlantillaConfiguracion {
  id: number
  businessId: string
  tipoDocumento: TipoDocumentoNumerico
  plantillaId: number
  esConfiguracionGlobal: boolean
  activo: boolean
  usuarioCreacion: string
  fechaCreacion: string
  usuarioModificacion?: string | null
  fechaModificacion?: string | null
  plantilla?: {
    id: number
    nombre: string
    isGlobal: boolean
    idioma: string
    version: number
  }
}

export interface ConfigurationSummaryItem {
  documentType: string // TipoDocumentoEnum string value from API
  tipoDocumento: TipoDocumentoNumerico // Numeric value for internal use
  hasConfiguration: boolean
  isConfigured: boolean
  templateId: number | null
  templateName: string | null
  templateLanguage: string | null
  isGlobalTemplate: boolean
  configurationSource: 'global' | 'tenant' | 'none'
}

export interface ConfigurationSummaryStats {
  totalDocumentTypes: number
  configured: number
  notConfigured: number
  usingGlobalTemplates: number
  usingCustomTemplates: number
}

export interface ConfigurationSummaryResponse {
  success: boolean
  data: ConfigurationSummaryItem[]
  stats: ConfigurationSummaryStats
}

export interface ConfigurationDetailResponse {
  success: boolean
  data: PlantillaConfiguracion
  info: {
    documentType: string
    templateId: number
    templateName: string
    isGlobal: boolean
    active: boolean
  }
}

// ============================================
// Request Interfaces
// ============================================

export interface SaveConfigurationRequest {
  tipoDocumento: TipoDocumentoNumerico
  plantillaId: number
  activo: boolean
}

export interface UpdateConfigurationRequest {
  plantillaId?: number
  activo?: boolean
}

// ============================================
// State Interface
// ============================================

export interface TemplateConfigState {
  summary: ConfigurationSummaryItem[]
  stats: ConfigurationSummaryStats | null
  currentConfiguration: PlantillaConfiguracion | null
  configurations: PlantillaConfiguracion[]
  loading: boolean
  saving: boolean
  error: string | null
  lastUpdated: string | null
}

// ============================================
// Filter Interface
// ============================================

export interface ConfigurationFilters {
  includeInactive?: boolean
  tipoDocumento?: TipoDocumentoNumerico
}

// ============================================
// Helper Types
// ============================================

export type ConfigurationStatus = 'configured' | 'not-configured' | 'inactive'
export type ConfigurationSource = 'global' | 'tenant' | 'none'

// ============================================
// Document Type Icons
// ============================================

export const DocumentTypeIcons: Record<string, string> = {
  [TipoDocumentoEnum.ORDER]: 'mdi:package-variant-closed',
  [TipoDocumentoEnum.INVOICE]: 'mdi:file-document',
  [TipoDocumentoEnum.QUOTE]: 'mdi:file-document-edit',
  [TipoDocumentoEnum.BUY]: 'mdi:cart',
  [TipoDocumentoEnum.RECEIPT]: 'mdi:receipt',
  [TipoDocumentoEnum.CREDIT_NOTE]: 'mdi:file-document-minus',
  [TipoDocumentoEnum.DEBIT_NOTE]: 'mdi:file-document-plus',
  [TipoDocumentoEnum.RETURN_ORDER]: 'mdi:package-variant-closed-remove',
  [TipoDocumentoEnum.DELIVERY_NOTE]: 'mdi:truck-delivery',
  [TipoDocumentoEnum.INVOICE_TRANSPORT]: 'mdi:truck-fast',
}
