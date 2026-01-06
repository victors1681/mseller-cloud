export interface UploadImagesType {
  images: string[]
  filenames?: string[] // Original filenames for auto-link
  type?: 'products' | 'profile' | 'documents'
}

export interface ImageDocument {
  success: boolean
  id: string
  businessId: string
  type: string
  originalFormat: string
  uploadedBy: string
  originalFile: string
  thumbnailFile: string
  originalUrl: string
  thumbnailUrl: string
  originalFilename?: string // Original filename from user upload (for auto-link)
  createdAt: any
  metadata: {
    size: number
    originalSize: number
    height: number
    width: number
  }
}
export interface UploadImagesResponseType {
  uploads: ImageDocument[]
}
