// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import restClient from 'src/configs/restClient'

// ** Types
import {
  ConfiguracionEmpresa,
  ConfiguracionEmpresaState,
  CreateConfiguracionRequest,
  UpdateConfiguracionRequest,
} from 'src/types/apps/configuracionEmpresaTypes'

// ============================================
// Initial State
// ============================================

const initialState: ConfiguracionEmpresaState = {
  data: null,
  loading: false,
  error: null,
  hasConfiguration: false,
}

// ============================================
// Async Thunks
// ============================================

// Fetch current business configuration
export const fetchConfiguracion = createAsyncThunk(
  'configuracionEmpresa/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await restClient.get<ConfiguracionEmpresa>(
        '/api/portal/configuracion-empresa',
      )
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return rejectWithValue('NO_CONFIGURATION')
      }
      return rejectWithValue(
        error.response?.data?.message || 'Error al cargar la configuración',
      )
    }
  },
)

// Create initial configuration
export const createConfiguracion = createAsyncThunk(
  'configuracionEmpresa/create',
  async (request: CreateConfiguracionRequest, { rejectWithValue }) => {
    try {
      const response = await restClient.post<ConfiguracionEmpresa>(
        '/api/portal/configuracion-empresa',
        request,
      )
      return response.data
    } catch (error: any) {
      if (error.response?.status === 409) {
        return rejectWithValue('Ya existe una configuración para este negocio')
      }
      return rejectWithValue(
        error.response?.data?.message || 'Error al crear la configuración',
      )
    }
  },
)

// Update configuration
export const updateConfiguracion = createAsyncThunk(
  'configuracionEmpresa/update',
  async (
    { id, request }: { id: string; request: UpdateConfiguracionRequest },
    { rejectWithValue },
  ) => {
    try {
      const response = await restClient.put<ConfiguracionEmpresa>(
        `/api/portal/configuracion-empresa/${id}`,
        request,
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al actualizar la configuración',
      )
    }
  },
)

// ============================================
// Slice
// ============================================

const configuracionEmpresaSlice = createSlice({
  name: 'configuracionEmpresa',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetConfiguration: (state) => {
      state.data = null
      state.loading = false
      state.error = null
      state.hasConfiguration = false
    },
  },
  extraReducers: (builder) => {
    // Fetch Configuration
    builder
      .addCase(fetchConfiguracion.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConfiguracion.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
        state.hasConfiguration = true
        state.error = null
      })
      .addCase(fetchConfiguracion.rejected, (state, action) => {
        state.loading = false
        if (action.payload === 'NO_CONFIGURATION') {
          state.hasConfiguration = false
          state.error = null
        } else {
          state.error = action.payload as string
        }
      })

    // Create Configuration
    builder
      .addCase(createConfiguracion.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createConfiguracion.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
        state.hasConfiguration = true
        state.error = null
      })
      .addCase(createConfiguracion.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Update Configuration
    builder
      .addCase(updateConfiguracion.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateConfiguracion.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
        state.error = null
      })
      .addCase(updateConfiguracion.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, resetConfiguration } =
  configuracionEmpresaSlice.actions

export default configuracionEmpresaSlice.reducer
