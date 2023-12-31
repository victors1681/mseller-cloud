export interface ProductType {
  codigo: string
  codigoBarra: string
  nombre: string
  area: string
  iDArea: number
  grupoId: string
  departamento: string
  ultCompra: string
  precio1: number
  precio2: number
  precio3: number
  precio4: number
  precio5: number
  costo: number
  existenciaAlmacen1: number
  existenciaAlmacen2: number
  existenciaAlmacen3: number
  existenciaAlmacen4: number
  existenciaAlmacen5: number
  existenciaAlmacen6: number
  existenciaAlmacen7: number
  unidad: string
  empaque: string
  impuesto: number
  factor: number
  iSC: number
  aDV: number
  descuento: number
  tipoImpuesto: string
  apartado: number
  promocion: boolean
  status: 'A' | 'I'
}
