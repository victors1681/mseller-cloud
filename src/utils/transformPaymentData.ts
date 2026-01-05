// src/utils/transformPaymentData.ts
import {
  DocumentUpdateDetail,
  DocumentUpdateType,
  EstadoPago,
  TipoDocumentoEnum,
} from 'src/types/apps/documentTypes'

export function transformPOSDataToDocument(
  paymentData: any,
): DocumentUpdateType {
  const customer = paymentData.customer?.tempData || {}
  const existingCustomer = paymentData.customer?.customer
  const isNewCustomer = paymentData.customer?.isNew

  // Determine condicionPago based on customer or default to first non-credit payment type
  let condicionPago = ''

  // If existing customer has a payment condition, use it
  if (existingCustomer?.condicionPago && !isNewCustomer) {
    condicionPago = existingCustomer.condicionPago.condicionPago
  } else {
    // For new customers or customers without payment condition, use first payment type with dias = 0
    console.log('PaymentTypes received:', paymentData.paymentTypes)
    const defaultPaymentType = paymentData.paymentTypes?.find(
      (pt: any) => pt.dias === 0,
    )
    console.log('Found default payment type with dias=0:', defaultPaymentType)

    if (defaultPaymentType) {
      condicionPago = defaultPaymentType.condicionPago
    } else {
      // Log warning if no payment type with dias = 0 found
      console.warn(
        'No payment type with dias = 0 found in paymentTypes list. Using fallback.',
      )
      console.log('Fallback paymentType:', paymentData.paymentType)
      condicionPago = paymentData.paymentType?.condicionPago || '00'
    }
  }

  console.log('Final condicionPago to be used:', condicionPago)

  return {
    noPedidoStr: '',
    nota: paymentData.notes || '',
    condicionPago: condicionPago,
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
    tipoDocumento: paymentData.tipoDocumento || TipoDocumentoEnum.INVOICE,
    codigoCliente: customer.codigo,
    nombreCliente: customer.nombre,
    firebaseUserId: paymentData.firebaseUserId || '',
    localidadId: customer.localidadId || '1',
    noOrden: paymentData.noOrden || '',
    avatarUrl: paymentData.avatarUrl || '',
    confirmado: paymentData.confirmado ?? true,
    codigoVendedor: customer.codigoVendedor,
    clienteNuevo: customer ? customer : undefined,
    // POS specific fields
    terminal: paymentData.terminal,
    secuenciaDocumento: paymentData.secuenciaDocumento,
    estadoPago: paymentData.estadoPago ?? EstadoPago.Paid,
    tipoPago: paymentData.tipoPago,
    moneda: paymentData.moneda || 'DOP',
    dispositivo: paymentData.dispositivo,
    impresion: paymentData.impresion ?? 0,
    fechaImpresion: paymentData.fechaImpresion,
    turnoId: paymentData.turnoId,
    cancelada: paymentData.cancelada ?? false,
    razonCancelacion: paymentData.razonCancelacion,
    reembolsada: paymentData.reembolsada ?? false,
    fechaReembolso: paymentData.fechaReembolso,
    montoRecibido: paymentData.montoRecibido || paymentData.amountReceived,
    montoDevuelto: paymentData.montoDevuelto || paymentData.change || 0,
    esVentaPOS: true,
  }
}
