export interface LegacyProductType {
  codigo: string
  codigoBarra: string
  nombre: string
  area: string
  iDArea: number | null
  grupoId: string | null
  departamento: string | null
  unidad: string
  empaque: string
  impuesto: number
  factor: number
  iSC: number
  aDV: number
  descuento: number
  tipoImpuesto: string | null
  apartado: number
}

export interface LegacyOfferDetailType {
  id: number
  idOferta: number
  codigoProducto: string
  producto: LegacyProductType
  precio: number
  rangoInicial: number
  rangoFinal: number
  cantidadPromocion: number
  principal: boolean
}

export interface LegacyOfferType {
  idOferta: number
  nombre: string
  descripcion: string
  tipoOferta: string
  condicionPago: string | null
  fechaInicio: string
  fechaFin: string
  clasificacion: string
  status: boolean
  detalle: LegacyOfferDetailType[]
}
