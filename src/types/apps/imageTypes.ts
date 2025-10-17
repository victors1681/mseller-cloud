export interface UploadImagesType {
  images: string[]
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
