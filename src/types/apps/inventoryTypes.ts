// ** Enums
export enum EstadoInventario {
  Planificado = 'Planificado',
  EnProgreso = 'EnProgreso',
  Completado = 'Completado',
  Cancelado = 'Cancelado',
}

export enum EstadoReconciliacion {
  Pendiente = 'Pendiente',
  Aprobada = 'Aprobada',
  Rechazada = 'Rechazada',
}

export enum TipoConteo {
  Completo = 'Completo',
  Parcial = 'Parcial',
  Ciclico = 'Ciclico',
}

// ** Inventory Snapshot Types
export interface InventarioSnapshotDTO {
  id: number
  codigoSnapshot: string
  localidadId: number
  descripcion: string
  fechaCreacion: string
  creadoPor: string
  totalProductos: number
  estado: string
}

export interface CrearSnapshotRequest {
  localidadId: number
  descripcion: string
  creadoPor: string
}

// ** Inventory Count Types
export interface InventarioConteoDTO {
  id: number
  codigoConteo: string
  tipoConteo: TipoConteo
  estado: EstadoInventario
  localidadId: number
  fechaInicio: string
  fechaFinalizacion?: string
  snapshotId?: number
  descripcion?: string
  creadoPor?: string
  finalizadoPor?: string
  observaciones?: string
  totalProductosContados: number
  totalDiscrepancias: number
  valorTotalAjustes: number
  businessId?: string
}

export interface PlanificarConteoRequest {
  codigoConteo?: string
  tipoConteo: TipoConteo
  localidadId: number
  fechaInicio: string
  descripcion?: string
  planificadoPor: string
  observaciones?: string
  crearSnapshot?: boolean
}

export interface AccionConteoRequest {
  usuario: string
}

export interface CancelarConteoRequest {
  usuario: string
  motivo: string
}

// ** Reconciliation Types
export interface InventarioReconciliacionDTO {
  id: number
  codigoReconciliacion: string
  conteoId: number
  fechaCreacion: string
  fechaAprobacion?: string
  reconciliadoPor: string
  aprobadoPor?: string
  estado: EstadoReconciliacion
  observaciones?: string
  totalDiscrepancias: number
  valorTotalDiscrepancias: number
  conteo?: InventarioConteoDTO
}

export interface CrearReconciliacionRequest {
  reconciliadoPor: string
  observaciones?: string
}

// ** Reporting Types
export interface ReporteDiscrepancia {
  codigoProducto: string
  nombreProducto: string
  cantidadEsperada: number
  cantidadContada: number
  diferencia: number
  valorUnitario: number
  valorTotalDiscrepancia: number
  zona?: string
  ubicacion?: string
  usuario?: string
}

// ** Zone Management Types
export interface InventarioZonaDTO {
  id: number
  conteoId: number
  nombreZona: string
  descripcion?: string
  usuarioAsignado: string
  fechaAsignacion: string
  fechaInicio?: string
  fechaCompletion?: string
  estado: EstadoInventario
  totalProductos: number
  productosContados: number
  progreso: number
}

export interface ProductoZonaInfo {
  codigoProducto: string
  nombreProducto: string
  zona: string
  ubicacion?: string
  cantidadActual: number
  fechaUltimaActualizacion: string
}

export interface ConfigurarZonaProductoRequest {
  codigoProducto: string
  zona: string
}

export interface ConfigurarZonasMasivaRequest {
  zona: string
  criterios: {
    categoria?: string
    proveedor?: string
    codigosProductos?: string[]
    rangoPrecios?: {
      minimo: number
      maximo: number
    }
  }
}

export interface ConfiguracionZonasMasivaResponse {
  productosActualizados: number
  mensaje: string
  errores?: string[]
}

export interface ResumenProgresoZonaDTO {
  nombreZona: string
  usuarioAsignado: string
  totalProductos: number
  productosContados: number
  progreso: number
  estado: EstadoInventario
  fechaInicio?: string
  tiempoTranscurrido?: string
}

export interface ReasignarZonaRequest {
  nuevoUsuario: string
}

export interface GenerarZonasRequest {
  usuarios: string[]
}

// ** Filter and Search Types
export interface InventarioFilters {
  localidadId?: number
  estado?: EstadoInventario
  fechaDesde?: string
  fechaHasta?: string
  usuario?: string
  zona?: string
}

// ** Analytics Types
export interface InventarioAnalytics {
  totalConteos: number
  conteosCompletados: number
  conteosEnProgreso: number
  conteosCancelados: number
  promedioTiempoConteo: number
  totalDiscrepancias: number
  valorTotalDiscrepancias: number
  usuariosMasActivos: {
    usuario: string
    totalConteos: number
  }[]
  zonasMasProblematicas: {
    zona: string
    totalDiscrepancias: number
  }[]
}

export interface UsuarioEstadisticas {
  usuario: string
  totalConteos: number
  conteosCompletados: number
  promedioTiempo: number
  totalDiscrepancias: number
  precisionPromedio: number
  ultimaActividad: string
}

// ** API Response Types
export interface InventarioApiResponse<T = any> {
  status: number
  data?: T
  message?: string
  errors?: string[]
}

// ** Localidad Types (for location management)
export interface LocalidadDTO {
  id: number
  codigo: string
  nombre: string
  descripcion?: string
  activa: boolean
  direccion?: string
  responsable?: string
}
