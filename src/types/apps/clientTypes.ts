import { LocalidadType } from './transportType'

export interface ClienteType {
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

export interface VendedorType {
  codigo: string
  nombre: string
  email: string
  status: string
  localidad: number
}

export interface GeoLocalizacionType {
  codigo_cliente: string
  longitud: number
  latitud: number
}

export interface CondicionPagoType {
  id: number
  condicionPago: string
  dias: number
  tipo_condicion: string
  descripcion: string
}
