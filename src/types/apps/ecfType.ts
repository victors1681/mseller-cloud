export interface ECFType {
  id: string
  ambiente: string
  urlBase: string
  usuario: string
  clave: string
  claveApi: string
  habilitado: boolean
  fechaCreacion: string
  fechaActualizacion: string
  businessId?: string
}

export interface ECFTestConnectionRequest {
  ambiente: string
  urlBase: string
  usuario: string
  clave: string
  claveApi?: string
}

export interface ECFTestConnectionResponse {
  success: boolean
  message: string
  data?: any
}

export interface ECFTransformDocumentRequest {
  noDocumento: string
}

export interface ECFTransformDocumentResponse {
  success: boolean
  message: string
  data?: any
}

export interface SecuenciaEcfType {
  id: number
  tipoCliente: string
  descripcion: string
  encabezado: string
  secuenciaIni: number
  secuenciaFin: number
  secuencia: number
  vendedor: string
  vencimiento: string
  businessId: string
  habilitado: boolean
  entorno: string | null
  esElectronico: boolean
}

export interface SecuenciaEcfParams {
  tipoCliente?: string
  encabezado?: string
  entorno?: string
  esElectronico?: boolean
  habilitado?: boolean
  query?: string
  pageNumber?: number
  pageSize?: number
}
