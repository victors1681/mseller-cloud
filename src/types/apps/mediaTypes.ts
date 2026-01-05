// ** Image Types Import
import { ImageDocument } from './imageTypes'

// ============================================
// Enums
// ============================================
export enum MediaType {
  All = 'all',
  Products = 'products',
  Profile = 'profile',
  Documents = 'documents',
}

export enum MediaViewMode {
  Grid = 'grid',
  List = 'list',
}

// ============================================
// Extended Media Item Interface
// ============================================
export interface MediaItem extends ImageDocument {
  title?: string
  description?: string
  tags?: string[]
  usedBy?: {
    products?: string[]
    customers?: string[]
    [key: string]: string[] | undefined
  }
}

// ============================================
// API Interfaces
// ============================================
export interface MediaFilters {
  search?: string
  type?: MediaType | string
  dateFrom?: string
  dateTo?: string
  tags?: string[]
  uploadedBy?: string
  pageNumber?: number
  pageSize?: number
}

export interface PaginatedMediaResponse {
  data: MediaItem[]
  total: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

// ============================================
// Redux State Interface
// ============================================
export interface MediaState {
  data: MediaItem[]
  total: number
  loading: boolean
  error: string | null
  selectedMedia: MediaItem[]
  filters: MediaFilters
  viewMode: MediaViewMode
}

// ============================================
// Usage Reference Interfaces
// ============================================
export interface UsageReference {
  mediaId: string
  entityType: 'products' | 'customers' | string
  entityId: string
}

export interface BulkDeleteRequest {
  mediaIds: string[]
}

export interface BulkDeleteResponse {
  success: boolean
  deleted: string[]
  failed: Array<{
    id: string
    reason: string
  }>
}

// ============================================
// Metadata Update Interface
// ============================================
export interface UpdateMediaMetadataRequest {
  mediaId: string
  title?: string
  description?: string
  tags?: string[]
}
