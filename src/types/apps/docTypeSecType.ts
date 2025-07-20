import { TipoDocumentoEnum } from "./documentTypes"

export interface DocTypeSecType {
  id: number
  prefijo: string
  tipoDocumento: TipoDocumentoEnum
  secuencia: number
  secuenciaContado: number
  localidad: number
}
