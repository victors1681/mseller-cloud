// ** Redux Imports
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** RestClient
import restClient from 'src/configs/restClient'

// ** Types
import {
  initialStockTransfersState,
  StockTransferFilters,
  TransferenciaStockHistorial,
  TransferenciaStockResponse,
  TransferirStockRequest,
} from 'src/types/apps/stockTransfersTypes'

// ** Async Actions

// Transfer Stock Between Locations
export const transferStock = createAsyncThunk(
  'stockTransfers/transferStock',
  async (request: TransferirStockRequest) => {
    const response = await restClient.post(
      '/api/portal/Inventario/transferir-stock',
      request,
    )
    return response.data as TransferenciaStockResponse
  },
)

// Get Location Transfer History
export const fetchLocationTransfers = createAsyncThunk(
  'stockTransfers/fetchLocationTransfers',
  async (params: { localidadId: number; filters?: StockTransferFilters }) => {
    const { localidadId, filters } = params
    const response = await restClient.get(
      `/api/portal/Inventario/localidad/${localidadId}/transferencias`,
      { params: filters },
    )
    return response.data as TransferenciaStockHistorial[]
  },
)

// Get Product Transfer History
export const fetchProductTransfers = createAsyncThunk(
  'stockTransfers/fetchProductTransfers',
  async (params: {
    codigoProducto: string
    filters?: StockTransferFilters
  }) => {
    const { codigoProducto, filters } = params
    const response = await restClient.get(
      `/api/portal/Inventario/producto/${codigoProducto}/transferencias`,
      { params: filters },
    )
    return response.data as TransferenciaStockHistorial[]
  },
)

// ** Slice
const stockTransfersSlice = createSlice({
  name: 'stockTransfers',
  initialState: initialStockTransfersState,
  reducers: {
    // Update filters
    setFilters: (
      state,
      action: PayloadAction<Partial<StockTransferFilters>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload }
    },

    // Reset filters
    resetFilters: (state) => {
      state.filters = {
        limit: 50,
      }
    },

    // Clear last transfer response
    clearLastTransfer: (state) => {
      state.lastTransferResponse = null
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },

    // Set processing state
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.processing = action.payload
    },

    // Reset state
    resetState: () => initialStockTransfersState,
  },
  extraReducers: (builder) => {
    // Transfer Stock
    builder
      .addCase(transferStock.pending, (state) => {
        state.processing = true
        state.error = null
      })
      .addCase(transferStock.fulfilled, (state, action) => {
        state.processing = false
        state.lastTransferResponse = action.payload

        // Add new transfer to relevant arrays
        const newTransfer: TransferenciaStockHistorial = {
          id: Date.now(), // Temporary ID
          codigoProducto: action.payload.codigoProducto,
          numeroTransferencia: action.payload.numeroTransferencia,
          localidadOrigenId: action.payload.localidadOrigenId,
          localidadOrigenNombre: action.payload.localidadOrigenNombre,
          localidadDestinoId: action.payload.localidadDestinoId,
          localidadDestinoNombre: action.payload.localidadDestinoNombre,
          cantidad: action.payload.cantidad,
          fechaTransferencia: action.payload.fechaTransferencia,
          usuario: action.payload.usuario,
          observaciones: action.payload.observaciones,
        }

        state.transfers.unshift(newTransfer)
        state.locationTransfers.unshift(newTransfer)
        state.productTransfers.unshift(newTransfer)
      })
      .addCase(transferStock.rejected, (state, action) => {
        state.processing = false
        state.error = action.error.message || 'Error transferring stock'
      })

    // Fetch Location Transfers
    builder
      .addCase(fetchLocationTransfers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLocationTransfers.fulfilled, (state, action) => {
        state.loading = false
        state.locationTransfers = action.payload
      })
      .addCase(fetchLocationTransfers.rejected, (state, action) => {
        state.loading = false
        state.error =
          action.error.message || 'Error fetching location transfers'
      })

    // Fetch Product Transfers
    builder
      .addCase(fetchProductTransfers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductTransfers.fulfilled, (state, action) => {
        state.loading = false
        state.productTransfers = action.payload
      })
      .addCase(fetchProductTransfers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error fetching product transfers'
      })
  },
})

// ** Export actions
export const {
  setFilters,
  resetFilters,
  clearLastTransfer,
  clearError,
  setProcessing,
  resetState,
} = stockTransfersSlice.actions

// ** Export reducer
export default stockTransfersSlice.reducer
