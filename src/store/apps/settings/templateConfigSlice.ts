// ** Redux Toolkit
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** API Client
import restClient from 'src/configs/restClient'

// ** Types
import { PaginatedResponse } from 'src/types/apps/reportsTypes'
import {
  ConfigurationDetailResponse,
  ConfigurationFilters,
  ConfigurationSummaryResponse,
  PlantillaConfiguracion,
  SaveConfigurationRequest,
  TemplateConfigState,
  TipoDocumentoNumerico,
  UpdateConfigurationRequest,
} from 'src/types/apps/templateConfigTypes'

// ============================================
// Initial State
// ============================================

const initialState: TemplateConfigState = {
  summary: [],
  stats: null,
  currentConfiguration: null,
  configurations: [],
  loading: false,
  saving: false,
  error: null,
  lastUpdated: null,
}

// ============================================
// Async Thunks
// ============================================

/**
 * Fetch configuration summary for all document types
 */
export const fetchConfigurationSummary = createAsyncThunk(
  'templateConfig/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await restClient.get<ConfigurationSummaryResponse>(
        '/api/portal/PlantillaReporte/configuration/summary',
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Error al cargar el resumen de configuraciones',
      )
    }
  },
)

/**
 * Fetch configuration for a specific document type
 */
export const fetchConfigurationByDocumentType = createAsyncThunk(
  'templateConfig/fetchByDocumentType',
  async (tipoDocumento: TipoDocumentoNumerico, { rejectWithValue }) => {
    try {
      const response = await restClient.get<ConfigurationDetailResponse>(
        `/api/portal/PlantillaReporte/configuration/${tipoDocumento}`,
      )
      return response.data
    } catch (error: any) {
      // 404 is expected when no configuration exists yet
      if (error.response?.status === 404) {
        return null
      }
      return rejectWithValue(
        error.response?.data?.message || 'Error al cargar la configuración',
      )
    }
  },
)

/**
 * Fetch all configurations with optional filters
 */
export const fetchAllConfigurations = createAsyncThunk(
  'templateConfig/fetchAll',
  async (filters: ConfigurationFilters = {}, { rejectWithValue }) => {
    try {
      const response = await restClient.get<
        PaginatedResponse<PlantillaConfiguracion>
      >('/api/portal/PlantillaReporte/configuration', { params: filters })
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al cargar las configuraciones',
      )
    }
  },
)

/**
 * Save new configuration
 */
export const saveConfiguration = createAsyncThunk(
  'templateConfig/save',
  async (request: SaveConfigurationRequest, { rejectWithValue }) => {
    try {
      const response = await restClient.post<{
        success: boolean
        message: string
        configurationId: number
        documentType: string
        templateId: number
        templateName: string
      }>('/api/portal/PlantillaReporte/configuration', request)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al guardar la configuración',
      )
    }
  },
)

/**
 * Update existing configuration
 */
export const updateConfiguration = createAsyncThunk(
  'templateConfig/update',
  async (
    { id, request }: { id: number; request: UpdateConfigurationRequest },
    { rejectWithValue },
  ) => {
    try {
      const response = await restClient.put<{
        success: boolean
        message: string
        configuration: PlantillaConfiguracion
      }>(`/api/portal/PlantillaReporte/configuration/${id}`, request)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al actualizar la configuración',
      )
    }
  },
)

/**
 * Delete configuration
 */
export const deleteConfiguration = createAsyncThunk(
  'templateConfig/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await restClient.delete(
        `/api/portal/PlantillaReporte/configuration/${id}`,
      )
      return id
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al eliminar la configuración',
      )
    }
  },
)

// ============================================
// Slice
// ============================================

const templateConfigSlice = createSlice({
  name: 'templateConfig',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentConfiguration: (state) => {
      state.currentConfiguration = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
  extraReducers: (builder) => {
    // Fetch Summary
    builder
      .addCase(fetchConfigurationSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConfigurationSummary.fulfilled, (state, action) => {
        state.loading = false
        state.summary = action.payload.data
        state.stats = action.payload.stats
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchConfigurationSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch by Document Type
    builder
      .addCase(fetchConfigurationByDocumentType.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConfigurationByDocumentType.fulfilled, (state, action) => {
        state.loading = false
        state.currentConfiguration = action.payload?.data || null
      })
      .addCase(fetchConfigurationByDocumentType.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch All Configurations
    builder
      .addCase(fetchAllConfigurations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllConfigurations.fulfilled, (state, action) => {
        state.loading = false
        state.configurations = action.payload.data
      })
      .addCase(fetchAllConfigurations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Save Configuration
    builder
      .addCase(saveConfiguration.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(saveConfiguration.fulfilled, (state) => {
        state.saving = false
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(saveConfiguration.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload as string
      })

    // Update Configuration
    builder
      .addCase(updateConfiguration.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(updateConfiguration.fulfilled, (state, action) => {
        state.saving = false
        state.currentConfiguration = action.payload.configuration
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(updateConfiguration.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload as string
      })

    // Delete Configuration
    builder
      .addCase(deleteConfiguration.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(deleteConfiguration.fulfilled, (state) => {
        state.saving = false
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(deleteConfiguration.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload as string
      })
  },
})

// ============================================
// Actions
// ============================================

export const { clearError, clearCurrentConfiguration, setLoading } =
  templateConfigSlice.actions

// ============================================
// Selectors
// ============================================

export const selectTemplateConfigState = (state: {
  templateConfig: TemplateConfigState
}) => state.templateConfig

export const selectConfigurationSummary = (state: {
  templateConfig: TemplateConfigState
}) => state.templateConfig.summary

export const selectConfigurationStats = (state: {
  templateConfig: TemplateConfigState
}) => state.templateConfig.stats

export const selectCurrentConfiguration = (state: {
  templateConfig: TemplateConfigState
}) => state.templateConfig.currentConfiguration

export const selectConfiguredTemplateByType = (
  state: { templateConfig: TemplateConfigState },
  tipoDocumento: TipoDocumentoNumerico,
) => {
  return state.templateConfig.summary.find(
    (item) => item.tipoDocumento === tipoDocumento,
  )
}

export const selectIsLoading = (state: {
  templateConfig: TemplateConfigState
}) => state.templateConfig.loading

export const selectIsSaving = (state: {
  templateConfig: TemplateConfigState
}) => state.templateConfig.saving

export const selectError = (state: { templateConfig: TemplateConfigState }) =>
  state.templateConfig.error

// ============================================
// Export Reducer
// ============================================

export default templateConfigSlice.reducer
