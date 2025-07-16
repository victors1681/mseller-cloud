import { DocumentType, TipoDocumentoEnum } from 'src/types/apps/documentTypes'
import { NewDetailForm } from './types'

export const defaultDocumentValues: Partial<DocumentType> = {
  codigoCliente: '',
  codigoVendedor: '',
  nombreCliente: '',
  nota: '',
  condicionPago: '',
  fecha: new Date().toISOString().split('T')[0],
  tipoDocumento: TipoDocumentoEnum.ORDER,
  tipoPedido: '',
  confirmado: false,
  nuevoCliente: false,
  localidadId: 0,
}

export const defaultDetailFormValues: NewDetailForm = {
  codigoProducto: '',
  cantidad: 1,
  precio: 0,
  descripcion: '',
  unidad: '',
}

export const defaultDetailControlValues = {
  codigoProducto: '',
  cantidad: 1,
  precio: 0,
}
