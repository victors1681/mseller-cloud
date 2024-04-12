import { LocalidadType } from './locationType'
import { CondicionPagoType } from './paymentTypeTypes'
import { VendedorType } from './sellerType'

export interface CustomerType {
  codigo: string
  nombre: string
  direccion: string
  telefono1: string
  ciudad: string
  balance: number
  limiteFacturas: number
  limiteCredito: number
  status: string
  rnc: string
  confirmado: boolean
  email: string
  condicionPrecio: number
  codigoVendedor: string
  rutaVenta: number
  clasificacion: string
  actualizar: boolean
  descuento: number
  impuesto: boolean
  condicion: string
  dia: number
  frecuencia: number
  secuencia: number
  localidadId: number
  bloqueoPorVencimiento: boolean
  descuentoProntoPago: number
  tipoCliente: string
  contacto: any
  localidad?: LocalidadType
  geoLocalizacion?: GeoLocalizacionType
  vendedor: VendedorType
  condicionPago?: CondicionPagoType
}

export interface GeoLocalizacionType {
  codigo_cliente: string
  longitud: number
  latitud: number
}
