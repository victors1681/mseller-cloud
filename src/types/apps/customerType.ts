import { LocalidadType } from './locationType'
import { NcfType } from './ncfTypes'
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

  // New fields
  estado?: string
  codigoPostal?: string
  contactoWhatsApp?: string
  preferenciasDeContacto?: string
  idiomaPreferido?: string
  notas?: string
  pais?: string

  localidad?: LocalidadType
  geoLocalizacion?: GeoLocalizacionType
  vendedor?: VendedorType
  condicionPago?: CondicionPagoType
}

export interface GeoLocalizacionType {
  codigo_cliente: string
  longitud: number
  latitud: number
}

//Temporary I can fetch, sellers, locations, payment types
export interface ClientDetailType {
  cliente?: CustomerType
  ciudades: string[]
  tipoClientes: string[]
  estados: string[]
  codigoPostales: string[]
  paises: string[]
  clasificaciones: string[]
  ncfs: NcfType[]
}

export interface CustomerDetailState {
  client?: CustomerType
  cities: string[]
  customerType: string[]
  states: string[]
  postalCodes: string[]
  countries: string[]
  classifications: string[]
  ncfs: NcfType[]
}
