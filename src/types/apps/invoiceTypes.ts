export type InvoiceStatus = 'Paid' | string

export type InvoiceLayoutProps = {
  noTransporte: string | undefined
}

export type InvoiceClientType = {
  name: string
  address: string
  company: string
  country: string
  contact: string
  companyEmail: string
}

export interface OrderType {
  noPedidoStr: string
  noPedido: number
  codigoVendedor: string
  tipoDocumento: string
  confirmado: boolean
  tipoPedido: string
  codigoCliente: string
  nombreCliente: string
  nuevoCliente: boolean
  fecha: string
  nota: string
  emailVendedor: string
  condicionPago: string
  noContacto: string
  descuento: number
  porcientoDescuento: number
  impuesto: number
  subTotal: number
  isc: number
  adv: number
  total: number
  firebaseUserId: string
  fechaVencimiento: string
  localidadId: number
  ncf: string
  ncfDescripcion: string
  noFactura: string
  noOrden: string
  avatarUrl: string
  procesado: number
  fechaProcesado: any
  impedimento: boolean
  notaImpedimento: string
  noPedidoServer: string
  fechaPedidoServer: string
  noFacturaServer: string
  fechaFacturaServer: any
  anulado: boolean
  fechaAnulado: any
  paramPedido: boolean
  paramFactura: boolean
  paramImpedimento: boolean
  usuarioProcesado: string
  usuarioModificado: string
  status: string
  mensajesError: string
  reintentar: number
  condicion: Condicion
  vendedor: Vendedor
  clienteNuevo: any
  detalle: any[]
}
export interface Condicion {
  id: number
  condicionPago: string
  dias: number
  tipo_condicion: string
  descripcion: string
}

export interface Vendedor {
  codigo: string
  nombre: string
  email: string
  status: string
  localidad: number
}

export type InvoicePaymentType = {
  iban: string
  totalDue: string
  bankName: string
  country: string
  swiftCode: string
}

export type SingleInvoiceType = {
  invoice: any
  paymentDetails: InvoicePaymentType
}
