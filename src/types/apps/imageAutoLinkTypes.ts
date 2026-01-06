import { MediaItem } from './mediaTypes'
import { ProductType } from './productTypes'

// ============================================
// Auto-Link Request/Response Types
// ============================================

// Backend DTO structure
export interface ImagenProductoDTO {
  codigoProducto: string
  ruta: string
  rutaPublica: string
  titulo: string
  tipoImagen: 'original' | 'thumbnail'
  ordenVisualizacion: number
  esImagenPredeterminada: boolean
  fechaCreacion: string // ISO date string
  idObjeto: string // Media ID
  businessId?: string
}

export interface AutoLinkRequest {
  imagenes: ImagenProductoDTO[] // Full image objects
  strategy: 'filename' | 'manual'
  dryRun?: boolean // Preview without saving
  overwriteExisting?: boolean // Replace existing images
}

export interface AutoLinkResult {
  mediaId: string
  filename: string
  productCode: string | null
  productName?: string
  success: boolean
  isPrimary: boolean
  error?: string
  action: 'linked' | 'skipped' | 'failed'
}

export interface AutoLinkResponse {
  totalProcessed: number
  successful: number
  failed: number
  skipped: number
  results: AutoLinkResult[]
  productsUpdated: string[]
  errors: string[]
}

// ============================================
// Batch Link Types
// ============================================

export interface BatchLinkItem {
  mediaId: string
  productCode: string
  isPrimary: boolean
  title?: string
}

export interface BatchLinkRequest {
  items: BatchLinkItem[]
  overwriteExisting?: boolean
}

export interface BatchLinkResponse {
  successful: number
  failed: number
  results: Array<{
    mediaId: string
    productCode: string
    success: boolean
    error?: string
  }>
}

// ============================================
// Preview Types
// ============================================

export interface AutoLinkPreviewItem {
  media: MediaItem
  parsedFilename: {
    productCode: string | null
    variant: string | null
    isPrimary: boolean
  }
  matchedProduct: ProductType | null
  existingImages: number
  willLink: boolean
  reason?: string
}

export interface AutoLinkPreviewResponse {
  items: AutoLinkPreviewItem[]
  summary: {
    totalImages: number
    willLink: number
    willSkip: number
    productsAffected: number
  }
}

// ============================================
// Configuration Types
// ============================================

export interface AutoLinkConfig {
  enabled: boolean
  autoLinkOnUpload: boolean
  namingPatterns: string[]
  requireExactMatch: boolean
  caseSensitive: boolean
  skipIfHasImages: boolean
  maxImagesPerProduct: number
}
