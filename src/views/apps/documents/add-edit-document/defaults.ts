import { DocumentType, TipoDocumentoEnum } from 'src/types/apps/documentTypes'
import { getLocalDateTimeString } from 'src/utils/dateUtils'
import { NewDetailForm } from './types'

export const defaultDocumentValues: Partial<DocumentType> = {
  codigoCliente: '',
  codigoVendedor: '',
  nombreCliente: '',
  nota: '',
  condicionPago: '1',
  fecha: getLocalDateTimeString(),
  tipoDocumento: TipoDocumentoEnum.ORDER,
  tipoPedido: '',
  confirmado: false,
  nuevoCliente: false,
  localidadId: 1,
}

export const defaultDetailFormValues: NewDetailForm = {
  codigoProducto: '',
  cantidad: 1,
  precio: 0,
  descripcion: '',
  unidad: '',
  porcientoDescuento: 0,
  porcientoImpuesto: 0,
}

export const defaultDetailControlValues = {
  codigoProducto: '',
  cantidad: 1,
  precio: 0,
  porcientoDescuento: 0,
}
