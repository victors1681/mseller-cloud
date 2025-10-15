// ** Inventory Movements Types
// Based on API documentation: ui-integration-inventory-devolution-apis.md

export enum TipoMovimientoInventario {
  Salida = 0, // Inventory exit (sales, consumption)
  Entrada = 1, // Inventory entry (purchases, production)
  Devolucion = 2, // Returns (customer/supplier returns)
  Ajuste = 3, // Adjustments (corrections, shrinkage)
}

export interface PagedResult<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface MovimientoInventarioResponse {
  id: number
  numeroDocumento: string
  codigoProducto: string
  localidadId: number
  tipoMovimiento: TipoMovimientoInventario
  tipoMovimientoDescripcion: string
  cantidad: number
  costoUnitario: number
  valorTotal: number
  fechaMovimiento: string // ISO 8601 datetime
  usuarioCreacion: string
  observaciones?: string
  producto?: {
    codigo: string
    descripcion: string
    unidad: string
  }
  localidad?: {
    id: number
    nombre: string
  }
}

export interface AjusteInventarioRequest {
  codigoProducto: string // Required: Product code
  localidadId: number // Required: Location ID
  cantidadAjuste: number // Required: Adjustment quantity (+ increase, - decrease)
  razonAjuste: string // Required: Reason for adjustment
  numeroDocumento?: string // Optional: Custom document number
  costoUnitario?: number // Optional: Override unit cost
}

export interface MovimientoInventarioFilters {
  codigoProducto?: string
  localidadId?: number
  tipoMovimiento?: TipoMovimientoInventario
  desde?: string // ISO 8601 format
  hasta?: string // ISO 8601 format
  pageNumber: number
  pageSize: number
}

// ** State interface for Redux store
export interface InventoryMovementsState {
  movements: PagedResult<MovimientoInventarioResponse>
  selectedMovement: MovimientoInventarioResponse | null
  loading: boolean
  error: string | null
  filters: MovimientoInventarioFilters
}

// ** Initial state
export const initialMovimientoFilters: MovimientoInventarioFilters = {
  pageNumber: 1,
  pageSize: 20,
}

export const initialInventoryMovementsState: InventoryMovementsState = {
  movements: {
    items: [],
    pageNumber: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  },
  selectedMovement: null,
  loading: false,
  error: null,
  filters: initialMovimientoFilters,
}
