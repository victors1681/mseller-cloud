// ** Stock Transfers Types
// Based on API documentation: ui-integration-inventory-devolution-apis.md

export interface TransferirStockRequest {
  codigoProducto: string // Required: Product code
  localidadOrigenId: number // Required: Source location ID
  localidadDestinoId: number // Required: Destination location ID
  cantidad: number // Required: Quantity to transfer
  observaciones?: string // Optional: Transfer notes/comments
}

export interface TransferenciaStockResponse {
  codigoProducto: string
  numeroTransferencia: string
  localidadOrigenId: number
  localidadOrigenNombre: string
  localidadDestinoId: number
  localidadDestinoNombre: string
  cantidad: number
  stockOrigenAntes: number
  stockOrigenDespues: number
  stockDestinoAntes: number
  stockDestinoDespues: number
  fechaTransferencia: string // ISO 8601 datetime
  usuario: string
  observaciones?: string
}

export interface TransferenciaStockHistorial {
  id: number
  codigoProducto: string
  numeroTransferencia: string
  localidadOrigenId: number
  localidadOrigenNombre: string
  localidadDestinoId: number
  localidadDestinoNombre: string
  cantidad: number
  fechaTransferencia: string // ISO 8601 datetime
  usuario: string
  observaciones?: string
}

export interface StockTransferFilters {
  codigoProducto?: string
  localidadId?: number
  desde?: string // ISO 8601 format
  hasta?: string // ISO 8601 format
  limit?: number
}

// ** State interface for Redux store
export interface StockTransfersState {
  transfers: TransferenciaStockHistorial[]
  locationTransfers: TransferenciaStockHistorial[]
  productTransfers: TransferenciaStockHistorial[]
  lastTransferResponse: TransferenciaStockResponse | null
  loading: boolean
  error: string | null
  processing: boolean
  filters: StockTransferFilters
}

// ** Initial state
export const initialStockTransferFilters: StockTransferFilters = {
  limit: 50,
}

export const initialStockTransfersState: StockTransfersState = {
  transfers: [],
  locationTransfers: [],
  productTransfers: [],
  lastTransferResponse: null,
  loading: false,
  error: null,
  processing: false,
  filters: initialStockTransferFilters,
}
