// ** Redux Imports
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** RestClient
import restClient from 'src/configs/restClient'

// ** Types
import {
  AjusteInventarioRequest,
  initialInventoryMovementsState,
  MovimientoInventarioFilters,
  MovimientoInventarioResponse,
  PagedResult,
  TipoMovimientoInventario,
} from 'src/types/apps/inventoryMovementsTypes'

// ** Async Actions

// Get Product Movement History
export const fetchProductMovements = createAsyncThunk(
  'inventoryMovements/fetchProductMovements',
  async (params: {
    codigoProducto: string
    filters: Partial<MovimientoInventarioFilters>
  }) => {
    const { codigoProducto, filters } = params
    const response = await restClient.get(
      `/api/portal/Inventario/producto/${codigoProducto}/movimientos`,
      { params: filters },
    )
    return response.data as PagedResult<MovimientoInventarioResponse>
  },
)

// Manual Inventory Adjustment
export const createInventoryAdjustment = createAsyncThunk(
  'inventoryMovements/createInventoryAdjustment',
  async (request: AjusteInventarioRequest) => {
    const response = await restClient.post(
      '/api/portal/Inventario/ajuste-manual',
      request,
    )
    return response.data as MovimientoInventarioResponse
  },
)

// Get Location Adjustment History
export const fetchLocationAdjustments = createAsyncThunk(
  'inventoryMovements/fetchLocationAdjustments',
  async (params: {
    localidadId: number
    filters?: {
      codigoProducto?: string
      desde?: string
      hasta?: string
      limit?: number
    }
  }) => {
    const { localidadId, filters } = params
    const response = await restClient.get(
      `/api/portal/Inventario/localidad/${localidadId}/ajustes`,
      { params: filters },
    )
    return response.data as MovimientoInventarioResponse[]
  },
)

// ** Slice
const inventoryMovementsSlice = createSlice({
  name: 'inventoryMovements',
  initialState: initialInventoryMovementsState,
  reducers: {
    // Update filters
    setFilters: (
      state,
      action: PayloadAction<Partial<MovimientoInventarioFilters>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload }
    },

    // Reset filters
    resetFilters: (state) => {
      state.filters = {
        pageNumber: 1,
        pageSize: 20,
      }
    },

    // Set selected movement
    setSelectedMovement: (
      state,
      action: PayloadAction<MovimientoInventarioResponse | null>,
    ) => {
      state.selectedMovement = action.payload
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },

    // Reset state
    resetState: () => initialInventoryMovementsState,
  },
  extraReducers: (builder) => {
    // Fetch Product Movements
    builder
      .addCase(fetchProductMovements.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductMovements.fulfilled, (state, action) => {
        state.loading = false
        state.movements = action.payload
      })
      .addCase(fetchProductMovements.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error fetching movements'
      })

    // Create Inventory Adjustment
    builder
      .addCase(createInventoryAdjustment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createInventoryAdjustment.fulfilled, (state, action) => {
        state.loading = false
        // Add new adjustment to movements if it matches current filters
        if (action.payload.tipoMovimiento === TipoMovimientoInventario.Ajuste) {
          state.movements.items.unshift(action.payload)
          state.movements.totalCount += 1
        }
      })
      .addCase(createInventoryAdjustment.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error creating adjustment'
      })

    // Fetch Location Adjustments
    builder
      .addCase(fetchLocationAdjustments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLocationAdjustments.fulfilled, (state, action) => {
        state.loading = false
        // Update movements with location adjustments
        state.movements.items = action.payload
        state.movements.totalCount = action.payload.length
      })
      .addCase(fetchLocationAdjustments.rejected, (state, action) => {
        state.loading = false
        state.error =
          action.error.message || 'Error fetching location adjustments'
      })
  },
})

// ** Export actions
export const {
  setFilters,
  resetFilters,
  setSelectedMovement,
  clearError,
  resetState,
} = inventoryMovementsSlice.actions

// ** Export reducer
export default inventoryMovementsSlice.reducer
