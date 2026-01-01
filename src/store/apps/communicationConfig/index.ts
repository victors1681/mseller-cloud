// ** Redux Imports
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** Config
import restClient from 'src/configs/restClient'

// ** Types
import {
  CommunicationConfig,
  CommunicationConfigForm,
  CommunicationConfigState,
} from 'src/types/apps/communicationTypes'

// Initial State
const initialState: CommunicationConfigState = {
  config: null,
  loading: false,
  saving: false,
  deleting: false,
  error: null,
  mode: 'create',
  successMessage: null,
}

// Async Thunks
export const fetchCommunicationConfig = createAsyncThunk(
  'communicationConfig/fetchConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await restClient.get<CommunicationConfig>(
        '/api/portal/communication/config',
      )
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      return rejectWithValue(
        error.response?.data?.message ||
          'Error fetching communication configuration',
      )
    }
  },
)

export const saveCommunicationConfig = createAsyncThunk(
  'communicationConfig/saveConfig',
  async (data: CommunicationConfigForm, { rejectWithValue }) => {
    try {
      const response = await restClient.post<CommunicationConfig>(
        '/api/portal/communication/config',
        data,
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'Error saving communication configuration',
      )
    }
  },
)

export const deleteCommunicationConfig = createAsyncThunk(
  'communicationConfig/deleteConfig',
  async (_, { rejectWithValue }) => {
    try {
      await restClient.delete('/api/portal/communication/config')
      return true
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Error deleting communication configuration',
      )
    }
  },
)

// Slice
const communicationConfigSlice = createSlice({
  name: 'communicationConfig',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null
    },
    setMode: (state, action: PayloadAction<'create' | 'edit'>) => {
      state.mode = action.payload
    },
  },
  extraReducers: (builder) => {
    // Fetch Config
    builder
      .addCase(fetchCommunicationConfig.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCommunicationConfig.fulfilled, (state, action) => {
        state.loading = false
        state.config = action.payload
        state.mode = action.payload ? 'edit' : 'create'
      })
      .addCase(fetchCommunicationConfig.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Save Config
    builder
      .addCase(saveCommunicationConfig.pending, (state) => {
        state.saving = true
        state.error = null
        state.successMessage = null
      })
      .addCase(saveCommunicationConfig.fulfilled, (state, action) => {
        state.saving = false
        state.config = action.payload
        state.mode = 'edit'
        state.successMessage = 'Configuration saved successfully'
      })
      .addCase(saveCommunicationConfig.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload as string
      })

    // Delete Config
    builder
      .addCase(deleteCommunicationConfig.pending, (state) => {
        state.deleting = true
        state.error = null
        state.successMessage = null
      })
      .addCase(deleteCommunicationConfig.fulfilled, (state) => {
        state.deleting = false
        state.config = null
        state.mode = 'create'
        state.successMessage = 'Configuration deleted successfully'
      })
      .addCase(deleteCommunicationConfig.rejected, (state, action) => {
        state.deleting = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearSuccessMessage, setMode } =
  communicationConfigSlice.actions
export default communicationConfigSlice.reducer
