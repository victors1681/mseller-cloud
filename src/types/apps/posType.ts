// ** POS Types
export interface TurnoType {
  id: string
  businessId: string
  codigoVendedor: string
  idDispositivo: string
  fechaApertura: string
  fechaCierre?: string | null
  efectivoApertura: number
  efectivoCierre?: number | null
  efectivoEsperado?: number | null
  totalVentas: number
  totalEfectivo: number
  totalTarjeta: number
  totalReembolsos: number
  estado: TurnoEstado
  notas?: string
  verificadoPor?: string | null
  fechaCreacion: string
  fechaActualizacion: string
  firebaseUserId: string
  movimientosCajaTurno?: MovimientoType[] | null
  aprobacionesCaja?: AprobacionType[] | null
}

export interface AbrirTurnoRequest {
  codigoVendedor: string
  idDispositivo: string
  efectivoApertura: number
  notas?: string
}

export interface CerrarTurnoRequest {
  idTurno: string
  efectivoCierre: number
}

export interface MovimientoTurnoRequest {
  idTurno: string
  tipo: TipoMovimiento
  monto: number
  motivo: string
}

export interface AprobacionTurnoRequest {
  idTurno: string
  accion: AccionAprobacion
  aprobadoPor: string
  razon: string
}

export interface MovimientoType {
  id: string
  idTurno: string
  tipo: TipoMovimiento
  monto: number
  motivo: string
  fecha: string
  usuario: string
}

export interface AprobacionType {
  id: string
  idTurno: string
  accion: AccionAprobacion
  aprobadoPor: string
  razon: string
  fecha: string
}

export enum TurnoEstado {
  ABIERTO = 0,
  CERRADO = 1,
  PENDIENTE_APROBACION = 2,
  APROBADO = 3,
  RECHAZADO = 4,
}

export enum TipoMovimiento {
  ENTRADA = 0,
  SALIDA = 1,
  AJUSTE = 2,
}

export enum AccionAprobacion {
  APROBAR = 0,
  RECHAZAR = 1,
  SOLICITAR_REVISION = 2,
}

export const getTurnoEstadoSpanishName = (estado: TurnoEstado): string => {
  switch (estado) {
    case TurnoEstado.ABIERTO:
      return 'Abierto'
    case TurnoEstado.CERRADO:
      return 'Cerrado'
    case TurnoEstado.PENDIENTE_APROBACION:
      return 'Pendiente de Aprobación'
    case TurnoEstado.APROBADO:
      return 'Aprobado'
    case TurnoEstado.RECHAZADO:
      return 'Rechazado'
    default:
      return 'Desconocido'
  }
}

export const getTipoMovimientoSpanishName = (tipo: TipoMovimiento): string => {
  switch (tipo) {
    case TipoMovimiento.ENTRADA:
      return 'Entrada'
    case TipoMovimiento.SALIDA:
      return 'Salida'
    case TipoMovimiento.AJUSTE:
      return 'Ajuste'
    default:
      return 'Desconocido'
  }
}

export const getAccionAprobacionSpanishName = (
  accion: AccionAprobacion,
): string => {
  switch (accion) {
    case AccionAprobacion.APROBAR:
      return 'Aprobar'
    case AccionAprobacion.RECHAZAR:
      return 'Rechazar'
    case AccionAprobacion.SOLICITAR_REVISION:
      return 'Solicitar Revisión'
    default:
      return 'Desconocido'
  }
}
