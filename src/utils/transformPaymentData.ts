// src/utils/transformPaymentData.ts
import {
  DocumentUpdateType,
  DocumentUpdateDetail,
  TipoDocumentoEnum,
} from 'src/types/apps/documentTypes'

export function transformPOSDataToDocument(
  paymentData: any,
): DocumentUpdateType {
  const customer = paymentData.customer?.customer || {}
  return {
    noPedidoStr: '',
    nota: paymentData.notes || '',
    condicionPago:
      customer.condicionPago?.condicionPago ||
      paymentData.paymentType?.condicionPago ||
      '',
    fecha: paymentData.timestamp || new Date().toISOString(),
    descuento: paymentData.totals?.descuentoTotal || 0,
    porcientoDescuento: 0, // If available, map it
    subTotal: paymentData.totals?.subtotal || 0,
    impuesto: paymentData.totals?.impuestoTotal || 0,
    total: paymentData.totals?.total || 0,
    fechaVencimiento: paymentData.fechaVencimiento,
    detalle: paymentData.cart.map(
      (item: any): DocumentUpdateDetail => ({
        id: undefined,
        codigoProducto: item.producto.codigo,
        cantidad: item.cantidad,
        descripcion: item.producto.nombre,
        precio: item.precio,
        impuesto: item.impuesto,
        porcientoImpuesto: item.porcientoImpuesto || 0,
        descuento: item.descuento,
        porcientoDescuento: item.porcientoDescuento || 0,
        factor: item.producto.factor || 1,
        factorOriginal: item.producto.factor || 1,
        isc: item.producto.iSC || 0,
        adv: item.producto.aDV || 0,
        subTotal: item.subtotal,
        productoRef: item.producto.codigo,
        grupoId: item.producto.grupoId || '',
        area: item.producto.area || '',
        unidad: item.producto.unidad || '',
        tipoImpuesto: item.producto.tipoImpuesto || '',
        cantidadOriginal: item.cantidad,
        existencia: item.producto.existenciaAlmacen1 || 0,
        apartado: item.producto.apartado || 0,
        promocion: item.producto.promocion || false,
      }),
    ),
    tipoPedido: paymentData.tipoPedido || '',
    nuevoCliente: paymentData.customer?.isNew
      ? paymentData.customer
      : undefined,
    tipoDocumento: paymentData.tipoDocumento || TipoDocumentoEnum.INVOICE,
    codigoCliente: customer.codigo,
    nombreCliente: customer.nombre,
    firebaseUserId: paymentData.firebaseUserId || '',
    localidadId: customer.localidadId,
    noOrden: paymentData.noOrden || '',
    avatarUrl: paymentData.avatarUrl || '',
    confirmado: paymentData.confirmado ?? true,
    codigoVendedor: customer.codigoVendedor,
    clienteNuevo: paymentData.customer?.isNew ? customer : undefined,
    // New fields
    terminal: paymentData.terminal,
    secuenciaDocumento: paymentData.secuenciaDocumento,
    estadoPago: paymentData.estadoPago,
    tipoPago: paymentData.tipoPago,
    moneda: paymentData.moneda,
    dispositivo: paymentData.dispositivo,
    impresion: paymentData.impresion ?? 0,
    fechaImpresion: paymentData.fechaImpresion,
    turnoId: paymentData.turnoId,
    cancelada: paymentData.cancelada ?? false,
    razonCancelacion: paymentData.razonCancelacion,
    reembolsada: paymentData.reembolsada ?? false,
    fechaReembolso: paymentData.fechaReembolso,
    montoRecibido: paymentData.montoRecibido,
    montoDevuelto: paymentData.montoDevuelto,
    esVentaPOS: true,
  }
}
