// ** Redux Imports
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** Third Party Imports
import restClient from 'src/configs/restClient'

// ** Types
import {
  CuentaCxc,
  CxcFilters,
  CxcListParams,
  CxcState,
  CxcSummaryStats,
  DevolucionRequest,
  EstadoCxc,
  MovimientoCxc,
  NotaCreditoRequest,
  PaginatedResponse,
  PagoRequest,
  ReporteCxc,
} from 'src/types/apps/cxcTypes'

// ============================================
// Initial State
// ============================================

const initialState: CxcState = {
  // List data
  data: [],
  total: 0,
  pageNumber: 1,
  pageSize: 20,
  totalPages: 0,
  totalResults: 0,

  // Single CXC detail
  selectedCxc: null,

  // Overdue CXCs
  overdueData: [],
  overdueTotal: 0,

  // Client CXCs
  clientCxcData: [],
  clientCxcTotal: 0,

  // Reports
  reportData: null,
  summaryStats: null,

  // UI State
  isLoading: false,
  isProcessing: false,
  filters: {},
  error: null,
  lastUpdated: null,
}

// ============================================
// Async Thunks
// ============================================

// Fetch paginated CXC list
export const fetchCxcList = createAsyncThunk(
  'cxc/fetchList',
  async (params: CxcListParams, { rejectWithValue }) => {
    try {
      // Build API parameters from filters
      const apiParams: any = {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 20,
      }

      // Handle filters if provided
      if (params.filters) {
        const filters = params.filters

        // Client filters
        if (filters.codigoCliente)
          apiParams.codigoCliente = filters.codigoCliente
        if (filters.nombreCliente)
          apiParams.nombreCliente = filters.nombreCliente

        // Vendor filter
        if (filters.codigoVendedor)
          apiParams.codigoVendedor = filters.codigoVendedor

        // Document filters
        if (filters.numeroDocumento)
          apiParams.numeroDocumento = filters.numeroDocumento
        if (filters.secuenciaDocumento)
          apiParams.secuenciaDocumento = filters.secuenciaDocumento

        // Status filter - handle both single and array
        if (filters.estado) {
          if (Array.isArray(filters.estado)) {
            // For now, take the first state if multiple selected
            // Backend might need to be updated to handle multiple states
            apiParams.estado = filters.estado[0]
          } else {
            apiParams.estado = filters.estado
          }
        }

        // Location filter
        if (filters.localidadId) apiParams.localidadId = filters.localidadId

        // Payment condition
        if (filters.condicionPago)
          apiParams.condicionPago = filters.condicionPago

        // Date filters - prefer new names, fallback to legacy
        apiParams.fechaDesde = filters.fechaDesde || filters.fechaEmisionDesde
        apiParams.fechaHasta = filters.fechaHasta || filters.fechaEmisionHasta
        if (filters.fechaVencimientoDesde)
          apiParams.fechaVencimientoDesde = filters.fechaVencimientoDesde
        if (filters.fechaVencimientoHasta)
          apiParams.fechaVencimientoHasta = filters.fechaVencimientoHasta

        // Amount filters
        if (filters.montoMinimo !== undefined)
          apiParams.montoMinimo = filters.montoMinimo
        if (filters.montoMaximo !== undefined)
          apiParams.montoMaximo = filters.montoMaximo
        if (filters.saldoPendienteMinimo !== undefined)
          apiParams.saldoPendienteMinimo = filters.saldoPendienteMinimo
        if (filters.saldoPendienteMaximo !== undefined)
          apiParams.saldoPendienteMaximo = filters.saldoPendienteMaximo

        // Overdue filters
        if (filters.soloVencidas !== undefined)
          apiParams.soloVencidas = filters.soloVencidas
        if (filters.diasVencidosMinimo !== undefined)
          apiParams.diasVencidosMinimo = filters.diasVencidosMinimo
        if (filters.diasVencidosMaximo !== undefined)
          apiParams.diasVencidosMaximo = filters.diasVencidosMaximo
      }

      // Handle general search query (could be applied to multiple fields)
      if (params.query) {
        // For now, apply to cliente name or documento number
        // Backend might need custom handling for general search
        apiParams.nombreCliente = apiParams.nombreCliente || params.query
        apiParams.numeroDocumento = apiParams.numeroDocumento || params.query
      }

      const response = await restClient.get<PaginatedResponse<CuentaCxc>>(
        '/api/portal/cxc/paginado',
        { params: apiParams },
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching CXC list',
      )
    }
  },
)

// Fetch CXC by client with pagination
export const fetchCxcByClient = createAsyncThunk(
  'cxc/fetchByClient',
  async (
    params: { codigoCliente: string; pageNumber?: number; pageSize?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await restClient.get<PaginatedResponse<CuentaCxc>>(
        `/api/portal/cxc/cliente/${params.codigoCliente}/paginado`,
        {
          params: {
            pageNumber: params.pageNumber || 1,
            pageSize: params.pageSize || 20,
          },
        },
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching client CXC',
      )
    }
  },
)

// Fetch overdue CXC with pagination
export const fetchOverdueCxc = createAsyncThunk(
  'cxc/fetchOverdue',
  async (
    params: { pageNumber?: number; pageSize?: number; filters?: CxcFilters },
    { rejectWithValue },
  ) => {
    try {
      const response = await restClient.get<PaginatedResponse<CuentaCxc>>(
        '/api/portal/cxc/vencidas/paginado',
        {
          params: {
            pageNumber: params.pageNumber || 1,
            pageSize: params.pageSize || 20,
            ...params.filters,
          },
        },
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching overdue CXC',
      )
    }
  },
)

// Fetch single CXC detail
export const fetchCxcDetail = createAsyncThunk(
  'cxc/fetchDetail',
  async (numeroCxc: string, { rejectWithValue }) => {
    try {
      const response = await restClient.get<CuentaCxc>(
        `/api/portal/cxc/numero/${numeroCxc}`,
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching CXC detail',
      )
    }
  },
)

// Generate CXC report
export const generateCxcReport = createAsyncThunk(
  'cxc/generateReport',
  async (
    params: { fechaInicio: string; fechaFin: string; filters?: CxcFilters },
    { rejectWithValue },
  ) => {
    try {
      const response = await restClient.get<ReporteCxc>(
        '/api/portal/cxc/reporte',
        {
          params: {
            fechaInicio: params.fechaInicio,
            fechaFin: params.fechaFin,
            ...params.filters,
          },
        },
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error generating report',
      )
    }
  },
)

// Process payment
export const processPayment = createAsyncThunk(
  'cxc/processPayment',
  async (
    params: { cxcId: number; request: PagoRequest },
    { rejectWithValue },
  ) => {
    try {
      const response = await restClient.post<MovimientoCxc>(
        `/api/portal/Cxc/${params.cxcId}/pago`,
        params.request,
      )
      return { cxcId: params.cxcId, movimiento: response.data }
    } catch (error: any) {
      debugger
      return rejectWithValue(
        error.response?.data?.message || 'Error processing payment',
      )
    }
  },
)

// Create credit note
export const createCreditNote = createAsyncThunk(
  'cxc/createCreditNote',
  async (
    params: { cxcId: number; request: NotaCreditoRequest },
    { rejectWithValue },
  ) => {
    try {
      const response = await restClient.post<MovimientoCxc>(
        `/api/portal/Cxc/${params.cxcId}/nota-credito`,
        params.request,
      )
      return { cxcId: params.cxcId, movimiento: response.data }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error creating credit note',
      )
    }
  },
)

// Process return/devolution
export const processReturn = createAsyncThunk(
  'cxc/processReturn',
  async (
    params: { cxcId: number; request: DevolucionRequest },
    { rejectWithValue },
  ) => {
    try {
      const response = await restClient.post<MovimientoCxc>(
        `/api/portal/cxc/${params.cxcId}/devolucion`,
        params.request,
      )
      return { cxcId: params.cxcId, movimiento: response.data }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error processing return',
      )
    }
  },
)

// Fetch CXC summary statistics
export const fetchCxcSummaryStats = createAsyncThunk(
  'cxc/fetchSummaryStats',
  async (filters: CxcFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await restClient.get<CxcSummaryStats>(
        '/api/portal/cxc/resumen',
        {
          params: { ...filters },
        },
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching summary stats',
      )
    }
  },
)

// ============================================
// Slice Definition
// ============================================

export const cxcSlice = createSlice({
  name: 'cxc',
  initialState,
  reducers: {
    // Set filters
    setFilters: (state, action: PayloadAction<Partial<CxcFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },

    // Clear all filters
    clearFilters: (state) => {
      state.filters = {}
    },

    // Set specific filter value
    setFilterValue: (
      state,
      action: PayloadAction<{ key: keyof CxcFilters; value: any }>,
    ) => {
      const { key, value } = action.payload
      if (value === null || value === undefined || value === '') {
        delete state.filters[key]
      } else {
        state.filters[key] = value
      }
    },

    // Set date range filter
    setDateRangeFilter: (
      state,
      action: PayloadAction<{
        type: 'emission' | 'due'
        from?: string
        to?: string
      }>,
    ) => {
      const { type, from, to } = action.payload
      if (type === 'emission') {
        if (from) state.filters.fechaDesde = from
        else delete state.filters.fechaDesde
        if (to) state.filters.fechaHasta = to
        else delete state.filters.fechaHasta
      } else if (type === 'due') {
        if (from) state.filters.fechaVencimientoDesde = from
        else delete state.filters.fechaVencimientoDesde
        if (to) state.filters.fechaVencimientoHasta = to
        else delete state.filters.fechaVencimientoHasta
      }
    },

    // Set amount range filter
    setAmountRangeFilter: (
      state,
      action: PayloadAction<{
        type: 'total' | 'pending'
        min?: number
        max?: number
      }>,
    ) => {
      const { type, min, max } = action.payload
      if (type === 'total') {
        if (min !== undefined) state.filters.montoMinimo = min
        else delete state.filters.montoMinimo
        if (max !== undefined) state.filters.montoMaximo = max
        else delete state.filters.montoMaximo
      } else if (type === 'pending') {
        if (min !== undefined) state.filters.saldoPendienteMinimo = min
        else delete state.filters.saldoPendienteMinimo
        if (max !== undefined) state.filters.saldoPendienteMaximo = max
        else delete state.filters.saldoPendienteMaximo
      }
    },

    // Set overdue filter
    setOverdueFilter: (
      state,
      action: PayloadAction<{
        onlyOverdue?: boolean
        minDays?: number
        maxDays?: number
      }>,
    ) => {
      const { onlyOverdue, minDays, maxDays } = action.payload
      if (onlyOverdue !== undefined) state.filters.soloVencidas = onlyOverdue
      if (minDays !== undefined) state.filters.diasVencidosMinimo = minDays
      else delete state.filters.diasVencidosMinimo
      if (maxDays !== undefined) state.filters.diasVencidosMaximo = maxDays
      else delete state.filters.diasVencidosMaximo
    },

    // Clear selected CXC
    clearSelectedCxc: (state) => {
      state.selectedCxc = null
    },

    // Set page size
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload
    },

    // Set page number
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },

    // Reset state
    resetCxcState: (state) => {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    // ============================================
    // Fetch CXC List
    // ============================================
    builder
      .addCase(fetchCxcList.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCxcList.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.items
        state.pageNumber = action.payload.pageNumber
        state.pageSize = action.payload.pageSize
        state.totalPages = action.payload.totalPages
        state.totalResults = action.payload.totalCount
        state.total = action.payload.totalCount
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchCxcList.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.data = []
      })

    // ============================================
    // Fetch CXC by Client
    // ============================================
    builder
      .addCase(fetchCxcByClient.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCxcByClient.fulfilled, (state, action) => {
        state.isLoading = false
        state.clientCxcData = action.payload.items
        state.clientCxcTotal = action.payload.totalCount
      })
      .addCase(fetchCxcByClient.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // ============================================
    // Fetch Overdue CXC
    // ============================================
    builder
      .addCase(fetchOverdueCxc.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOverdueCxc.fulfilled, (state, action) => {
        state.isLoading = false
        state.overdueData = action.payload.items
        state.overdueTotal = action.payload.totalCount
      })
      .addCase(fetchOverdueCxc.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // ============================================
    // Fetch CXC Detail
    // ============================================
    builder
      .addCase(fetchCxcDetail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCxcDetail.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedCxc = action.payload
      })
      .addCase(fetchCxcDetail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.selectedCxc = null
      })

    // ============================================
    // Generate Report
    // ============================================
    builder
      .addCase(generateCxcReport.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(generateCxcReport.fulfilled, (state, action) => {
        state.isLoading = false
        state.reportData = action.payload
      })
      .addCase(generateCxcReport.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // ============================================
    // Process Payment
    // ============================================
    builder
      .addCase(processPayment.pending, (state) => {
        state.isProcessing = true
        state.error = null
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.isProcessing = false

        // Update the selected CXC if it matches
        if (
          state.selectedCxc &&
          state.selectedCxc.id === action.payload.cxcId
        ) {
          if (!state.selectedCxc.movimientos) {
            state.selectedCxc.movimientos = []
          }
          state.selectedCxc.movimientos.unshift(action.payload.movimiento)

          // Update balance (approximate - should refetch for accuracy)
          state.selectedCxc.montoAbonado += action.payload.movimiento.monto
          state.selectedCxc.saldoPendiente -= action.payload.movimiento.monto

          // Update status if fully paid
          if (state.selectedCxc.saldoPendiente <= 0) {
            state.selectedCxc.estado = EstadoCxc.Pagado
            state.selectedCxc.porcentajePagado = 100
          } else {
            state.selectedCxc.estado = EstadoCxc.PagoParcial
            state.selectedCxc.porcentajePagado =
              (state.selectedCxc.montoAbonado / state.selectedCxc.montoTotal) *
              100
          }
        }

        // Update the CXC in the main list if present
        const cxcIndex = state.data.findIndex(
          (cxc) => cxc.id === action.payload.cxcId,
        )
        if (cxcIndex !== -1) {
          state.data[cxcIndex].montoAbonado += action.payload.movimiento.monto
          state.data[cxcIndex].saldoPendiente -= action.payload.movimiento.monto

          if (state.data[cxcIndex].saldoPendiente <= 0) {
            state.data[cxcIndex].estado = EstadoCxc.Pagado
            state.data[cxcIndex].porcentajePagado = 100
          } else {
            state.data[cxcIndex].estado = EstadoCxc.PagoParcial
            state.data[cxcIndex].porcentajePagado =
              (state.data[cxcIndex].montoAbonado /
                state.data[cxcIndex].montoTotal) *
              100
          }
        }
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.isProcessing = false
        state.error = action.payload as string
      })

    // ============================================
    // Create Credit Note
    // ============================================
    builder
      .addCase(createCreditNote.pending, (state) => {
        state.isProcessing = true
        state.error = null
      })
      .addCase(createCreditNote.fulfilled, (state, action) => {
        state.isProcessing = false

        // Similar logic to process payment for updating balances
        if (
          state.selectedCxc &&
          state.selectedCxc.id === action.payload.cxcId
        ) {
          if (!state.selectedCxc.movimientos) {
            state.selectedCxc.movimientos = []
          }
          state.selectedCxc.movimientos.unshift(action.payload.movimiento)

          // Credit notes reduce the outstanding balance
          state.selectedCxc.saldoPendiente -= action.payload.movimiento.monto

          if (state.selectedCxc.saldoPendiente <= 0) {
            state.selectedCxc.estado = EstadoCxc.Pagado
            state.selectedCxc.porcentajePagado = 100
          } else {
            state.selectedCxc.porcentajePagado =
              ((state.selectedCxc.montoTotal -
                state.selectedCxc.saldoPendiente) /
                state.selectedCxc.montoTotal) *
              100
          }
        }
      })
      .addCase(createCreditNote.rejected, (state, action) => {
        state.isProcessing = false
        state.error = action.payload as string
      })

    // ============================================
    // Process Return
    // ============================================
    builder
      .addCase(processReturn.pending, (state) => {
        state.isProcessing = true
        state.error = null
      })
      .addCase(processReturn.fulfilled, (state, action) => {
        state.isProcessing = false

        if (
          state.selectedCxc &&
          state.selectedCxc.id === action.payload.cxcId
        ) {
          if (!state.selectedCxc.movimientos) {
            state.selectedCxc.movimientos = []
          }
          state.selectedCxc.movimientos.unshift(action.payload.movimiento)

          // Returns reduce the outstanding balance
          state.selectedCxc.saldoPendiente -= action.payload.movimiento.monto

          if (state.selectedCxc.saldoPendiente <= 0) {
            state.selectedCxc.estado = EstadoCxc.Pagado
            state.selectedCxc.porcentajePagado = 100
          }
        }
      })
      .addCase(processReturn.rejected, (state, action) => {
        state.isProcessing = false
        state.error = action.payload as string
      })

    // ============================================
    // Fetch Summary Stats
    // ============================================
    builder.addCase(fetchCxcSummaryStats.fulfilled, (state, action) => {
      state.summaryStats = action.payload
    })
  },
})

// Export actions
export const {
  setFilters,
  clearFilters,
  setFilterValue,
  setDateRangeFilter,
  setAmountRangeFilter,
  setOverdueFilter,
  clearSelectedCxc,
  setPageSize,
  setPageNumber,
  clearError,
  resetCxcState,
} = cxcSlice.actions

// Export reducer
export default cxcSlice.reducer
