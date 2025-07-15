import {
  DocumentType,
  DocumentUpdateType,
  DocumentUpdateDetail,
  DocumentTypeDetail,
} from 'src/types/apps/documentTypes'

/**
 * Converts a DocumentType to a DocumentUpdateType for API submission
 */
export const convertToDocumentUpdate = (
  document: DocumentType,
  detailsData: DocumentTypeDetail[],
  orderCalculations: {
    subtotal: number
    descuentoTotal: number
    impuestoTotal: number
    total: number
  },
): DocumentUpdateType => {
  return {
    noPedidoStr: document.noPedidoStr,
    nota: document.nota || '',
    condicionPago: document.condicionPago || '',
    descuento: orderCalculations.descuentoTotal,
    fecha: document.fecha || new Date().toISOString(),
    porcientoDescuento: document.porcientoDescuento || 0,
    subTotal: orderCalculations.subtotal,
    impuesto: orderCalculations.impuestoTotal,
    total: orderCalculations.total,
    fechaVencimiento: document.fechaVencimiento || new Date().toISOString(),
    detalle: convertDetailsToUpdateDetails(detailsData),
    // New required fields
    tipoDocumento: document.tipoDocumento || '',
    codigoCliente: document.codigoCliente || '',
    nombreCliente: document.nombreCliente,
    firebaseUserId: document.firebaseUserId,
    localidadId: document.localidadId || 0,
    noOrden: document.noOrden,
    avatarUrl: document.avatarUrl,
    confirmado: document.confirmado || false,
  }
}

/**
 * Converts DocumentTypeDetail[] to DocumentUpdateDetail[]
 */
export const convertDetailsToUpdateDetails = (
  details: DocumentTypeDetail[],
): DocumentUpdateDetail[] => {
  return details.map(
    (detail, index): DocumentUpdateDetail => ({
      id: detail.id ? parseInt(detail.id) : undefined,
      codigoProducto: detail.codigoProducto,
      cantidad: detail.cantidad,
      descripcion: detail.descripcion,
      precio: detail.precio,
      impuesto: detail.impuesto || 0,
      porcientoImpuesto: detail.porcientoImpuesto || 0,
      descuento: detail.descuento || 0,
      porcientoDescuento: detail.porcientoDescuento || 0,
      factor: detail.factor || 1,
      factorOriginal: detail.factorOriginal || 1,
      isc: detail.isc || 0,
      adv: detail.adv || 0,
      subTotal: detail.subTotal,
      productoRef: detail.productoRef || '',
      grupoId: detail.grupoId || '',
      area: detail.area || '',
      unidad: detail.unidad || '',
      tipoImpuesto: detail.tipoImpuesto || '',
      cantidadOriginal: detail.cantidadOriginal || detail.cantidad,
      existencia: 0, // This would need to come from product data
      apartado: 0, // This would need to come from product data
      promocion: detail.promocion || false,
    }),
  )
}

/**
 * Creates a new DocumentUpdateType for document creation
 */
export const createNewDocumentUpdate = (
  noPedidoStr: string,
  basicData: {
    nota?: string
    condicionPago?: string
    fechaVencimiento?: string
    tipoDocumento?: string
    codigoCliente?: string
    nombreCliente?: string
    firebaseUserId?: string
    localidadId?: number
    noOrden?: string
    avatarUrl?: string
    confirmado?: boolean
  },
  detailsData: DocumentTypeDetail[],
  orderCalculations: {
    subtotal: number
    descuentoTotal: number
    impuestoTotal: number
    total: number
  },
): DocumentUpdateType => {
  return {
    noPedidoStr,
    nota: basicData.nota || '',
    condicionPago: basicData.condicionPago || '',
    descuento: orderCalculations.descuentoTotal,
    fecha: new Date().toISOString(),
    porcientoDescuento: 0,
    subTotal: orderCalculations.subtotal,
    impuesto: orderCalculations.impuestoTotal,
    total: orderCalculations.total,
    fechaVencimiento: basicData.fechaVencimiento || new Date().toISOString(),
    detalle: convertDetailsToUpdateDetails(detailsData),
    // New required fields
    tipoDocumento: basicData.tipoDocumento || '',
    codigoCliente: basicData.codigoCliente || '',
    nombreCliente: basicData.nombreCliente,
    firebaseUserId: basicData.firebaseUserId,
    localidadId: basicData.localidadId || 0,
    noOrden: basicData.noOrden,
    avatarUrl: basicData.avatarUrl,
    confirmado: basicData.confirmado || false,
  }
}
