// ** Redux Imports
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** Third Party Imports
import restClient from 'src/configs/restClient'

// ** Types
import {
  CreateReportTemplateRequest,
  GenerateReportRequest,
  GenerateReportResponse,
  PaginatedResponse,
  PlantillaReporte,
  ReportsFilters,
  ReportsListParams,
  ReportsState,
  ReportsSummaryStats,
  UpdateReportTemplateRequest,
} from 'src/types/apps/reportsTypes'

// ============================================
// Initial State
// ============================================

const initialState: ReportsState = {
  // Report Templates List
  templates: [],
  templatesTotal: 0,
  templatesPageNumber: 1,
  templatesPageSize: 20,
  templatesTotalPages: 0,

  // Selected Template
  selectedTemplate: null,

  // Summary Statistics
  summaryStats: null,

  // UI State
  isLoading: false,
  isProcessing: false,
  filters: {},
  error: null,
  lastUpdated: null,
}

// ============================================
// Async Thunks - Report Templates
// ============================================

// Fetch paginated report templates list
export const fetchReportTemplates = createAsyncThunk(
  'reports/fetchTemplates',
  async (params: ReportsListParams, { rejectWithValue }) => {
    try {
      const apiParams: any = {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 20,
      }

      if (params.filters) {
        const filters = params.filters
        if (filters.search) apiParams.search = filters.search
        if (filters.categoria) apiParams.categoria = filters.categoria
        if (filters.estado) apiParams.estado = filters.estado
        if (filters.frecuencia) apiParams.frecuencia = filters.frecuencia
        if (filters.businessId) apiParams.businessId = filters.businessId
        if (filters.usuarioCreacion)
          apiParams.usuarioCreacion = filters.usuarioCreacion
        if (filters.fechaCreacionDesde)
          apiParams.fechaCreacionDesde = filters.fechaCreacionDesde
        if (filters.fechaCreacionHasta)
          apiParams.fechaCreacionHasta = filters.fechaCreacionHasta
      }

      if (params.query) {
        apiParams.search = params.query
      }

      const response = await restClient.get<
        PaginatedResponse<PlantillaReporte>
      >('/api/portal/PlantillaReporte', { params: apiParams })

      return {
        data: response.data.data,
        pageNumber: response.data.pagination.currentPage,
        pageSize: response.data.pagination.pageSize,
        totalPages: response.data.pagination.totalPages,
        totalResults: response.data.pagination.totalCount,
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching report templates',
      )
    }
  },
)

// Fetch single report template by ID
export const fetchReportTemplateById = createAsyncThunk(
  'reports/fetchTemplateById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await restClient.get<PlantillaReporte>(
        `/api/portal/PlantillaReporte/${id}`,
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching report template',
      )
    }
  },
)

// Create new report template
export const createReportTemplate = createAsyncThunk(
  'reports/createTemplate',
  async (request: CreateReportTemplateRequest, { rejectWithValue }) => {
    try {
      const response = await restClient.post<PlantillaReporte>(
        '/api/portal/PlantillaReporte',
        request,
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error creating report template',
      )
    }
  },
)

// Update existing report template
export const updateReportTemplate = createAsyncThunk(
  'reports/updateTemplate',
  async (request: UpdateReportTemplateRequest, { rejectWithValue }) => {
    try {
      const response = await restClient.put<PlantillaReporte>(
        `/api/portal/PlantillaReporte/${request.id}`,
        request,
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error updating report template',
      )
    }
  },
)

// Delete report template
export const deleteReportTemplate = createAsyncThunk(
  'reports/deleteTemplate',
  async (id: number, { rejectWithValue }) => {
    try {
      await restClient.delete(`/api/portal/PlantillaReporte/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error deleting report template',
      )
    }
  },
)

// ============================================
// Async Thunks - Generated Reports
// ============================================

// Generate new report
export const generateReport = createAsyncThunk(
  'reports/generateReport',
  async (request: GenerateReportRequest, { rejectWithValue }) => {
    try {
      const response = await restClient.post<GenerateReportResponse>(
        '/api/portal/PlantillaReporte/generar',
        request,
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error generating report',
      )
    }
  },
)

// Download generated report
export const downloadReport = createAsyncThunk(
  'reports/downloadReport',
  async (reporteGeneradoId: number, { rejectWithValue }) => {
    try {
      const response = await restClient.get(
        `/api/portal/ReporteGenerado/${reporteGeneradoId}/descargar`,
        {
          responseType: 'blob',
        },
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error downloading report',
      )
    }
  },
)

// Delete generated report
export const deleteGeneratedReport = createAsyncThunk(
  'reports/deleteGeneratedReport',
  async (id: number, { rejectWithValue }) => {
    try {
      await restClient.delete(`/api/portal/ReporteGenerado/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error deleting generated report',
      )
    }
  },
)

// ============================================
// Async Thunks - Statistics
// ============================================

// Fetch summary statistics
export const fetchReportsSummary = createAsyncThunk(
  'reports/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await restClient.get<ReportsSummaryStats>(
        '/api/portal/PlantillaReporte/estadisticas',
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching reports summary',
      )
    }
  },
)

// ============================================
// Slice
// ============================================

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    // Set processing state
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload
    },

    // Set filters
    setFilters: (state, action: PayloadAction<ReportsFilters>) => {
      state.filters = action.payload
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {}
    },

    // Set selected template
    setSelectedTemplate: (
      state,
      action: PayloadAction<PlantillaReporte | null>,
    ) => {
      state.selectedTemplate = action.payload
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },

    // Reset state
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // ** Fetch Report Templates
    builder
      .addCase(fetchReportTemplates.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchReportTemplates.fulfilled, (state, action) => {
        state.isLoading = false
        state.templates = action.payload.data
        state.templatesTotal = action.payload.totalResults
        state.templatesPageNumber = action.payload.pageNumber
        state.templatesPageSize = action.payload.pageSize
        state.templatesTotalPages = action.payload.totalPages
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchReportTemplates.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // ** Fetch Report Template By ID
    builder
      .addCase(fetchReportTemplateById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchReportTemplateById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedTemplate = action.payload
      })
      .addCase(fetchReportTemplateById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // ** Create Report Template
    builder
      .addCase(createReportTemplate.pending, (state) => {
        state.isProcessing = true
        state.error = null
      })
      .addCase(createReportTemplate.fulfilled, (state, action) => {
        state.isProcessing = false
        state.templates.unshift(action.payload)
        state.templatesTotal += 1
      })
      .addCase(createReportTemplate.rejected, (state, action) => {
        state.isProcessing = false
        state.error = action.payload as string
      })

    // ** Update Report Template
    builder
      .addCase(updateReportTemplate.pending, (state) => {
        state.isProcessing = true
        state.error = null
      })
      .addCase(updateReportTemplate.fulfilled, (state, action) => {
        state.isProcessing = false
        const index = state.templates.findIndex(
          (t) => t.id === action.payload.id,
        )
        if (index !== -1) {
          state.templates[index] = action.payload
        }
        if (state.selectedTemplate?.id === action.payload.id) {
          state.selectedTemplate = action.payload
        }
      })
      .addCase(updateReportTemplate.rejected, (state, action) => {
        state.isProcessing = false
        state.error = action.payload as string
      })

    // ** Delete Report Template
    builder
      .addCase(deleteReportTemplate.pending, (state) => {
        state.isProcessing = true
        state.error = null
      })
      .addCase(deleteReportTemplate.fulfilled, (state, action) => {
        state.isProcessing = false
        state.templates = state.templates.filter((t) => t.id !== action.payload)
        state.templatesTotal -= 1
        if (state.selectedTemplate?.id === action.payload) {
          state.selectedTemplate = null
        }
      })
      .addCase(deleteReportTemplate.rejected, (state, action) => {
        state.isProcessing = false
        state.error = action.payload as string
      })

    // ** Generate Report
    builder
      .addCase(generateReport.pending, (state) => {
        state.isProcessing = true
        state.error = null
      })
      .addCase(generateReport.fulfilled, (state) => {
        state.isProcessing = false
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.isProcessing = false
        state.error = action.payload as string
      })

    // ** Fetch Summary Statistics
    builder
      .addCase(fetchReportsSummary.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchReportsSummary.fulfilled, (state, action) => {
        state.isLoading = false
        state.summaryStats = action.payload
      })
      .addCase(fetchReportsSummary.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

// ============================================
// Exports
// ============================================

export const {
  setLoading,
  setProcessing,
  setFilters,
  setGeneratedFilters,
  clearFilters,
  clearGeneratedFilters,
  setSelectedTemplate,
  clearError,
  resetState,
} = reportsSlice.actions

export default reportsSlice.reducer
