// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** Types Imports
import toast from 'react-hot-toast'
import restClient from 'src/configs/restClient'
import { AppDispatch, RootState } from 'src/store'
import {
  EcfDocumentoFilters,
  EcfDocumentoState,
  EcfDocumentoType,
  PaginatedEcfDocumentoResponse,
} from 'src/types/apps/ecfDocumentoTypes'

interface AxiosResponse<T> {
  data: T
}

// ** Fetch ECF Documents for Audit
export const fetchEcfDocuments = createAsyncThunk<
  {
    data: EcfDocumentoType[]
    params: EcfDocumentoFilters
    pageNumber: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasPreviousPage: boolean
    hasNextPage: boolean
  },
  EcfDocumentoFilters,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'ecfDocumentos/fetchData',
  async (params: EcfDocumentoFilters = {}, { rejectWithValue }) => {
    try {
      const response = await restClient.get<
        any,
        AxiosResponse<PaginatedEcfDocumentoResponse>
      >('/api/portal/ConfiguracionFacturacionElectronica/ecf-documentos', {
        params,
      })

      return {
        data: response.data.items || [],
        params,
        pageNumber: response.data.pageNumber || 1,
        pageSize: response.data.pageSize || 20,
        totalCount: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 1,
        hasPreviousPage: response.data.hasPreviousPage || false,
        hasNextPage: response.data.hasNextPage || false,
      }
    } catch (error: any) {
      toast.error('Error al cargar documentos ECF')
      return rejectWithValue({
        message:
          error.response?.data?.message || 'Error al cargar documentos ECF',
      })
    }
  },
)

// ** Get ECF Document Detail
export const getEcfDocumentDetail = createAsyncThunk<
  EcfDocumentoType,
  number,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>('ecfDocumentos/getDetail', async (id: number, { rejectWithValue }) => {
  try {
    const response = await restClient.get<any, AxiosResponse<EcfDocumentoType>>(
      `/api/portal/ConfiguracionFacturacionElectronica/ecf-documentos/${id}`,
    )

    return response.data
  } catch (error: any) {
    toast.error('Error al cargar detalles del documento')
    return rejectWithValue({
      message:
        error.response?.data?.message ||
        'Error al cargar detalles del documento',
    })
  }
})

// ** Retry ECF Document Processing
export const retryEcfDocumentProcessing = createAsyncThunk<
  { success: boolean; message: string },
  { id: number; documentoId: string },
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'ecfDocumentos/retryProcessing',
  async ({ id, documentoId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await restClient.post<
        any,
        AxiosResponse<{ success: boolean; message: string }>
      >(
        `/api/portal/ConfiguracionFacturacionElectronica/ecf-documentos/${id}/retry`,
      )

      toast.success(`Reprocesamiento iniciado para documento ${documentoId}`)

      // Refresh the data after retry
      dispatch(fetchEcfDocuments({}))

      return response.data
    } catch (error: any) {
      toast.error('Error al reintentar procesamiento')
      return rejectWithValue({
        message:
          error.response?.data?.message || 'Error al reintentar procesamiento',
      })
    }
  },
)

// ** Export ECF Documents Data
export const exportEcfDocuments = createAsyncThunk<
  { downloadUrl: string },
  { filters: EcfDocumentoFilters; format: 'excel' | 'csv' },
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'ecfDocumentos/exportData',
  async ({ filters, format }, { rejectWithValue }) => {
    try {
      const response = await restClient.post<
        any,
        AxiosResponse<{ downloadUrl: string }>
      >(
        '/api/portal/ConfiguracionFacturacionElectronica/ecf-documentos/export',
        {
          filters,
          format,
        },
      )

      toast.success(
        'Exportación iniciada. El archivo se descargará automáticamente.',
      )
      return response.data
    } catch (error: any) {
      toast.error('Error al exportar datos')
      return rejectWithValue({
        message: error.response?.data?.message || 'Error al exportar datos',
      })
    }
  },
)

// ** Initial State
const initialState: EcfDocumentoState & {
  // Pagination state
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  params: EcfDocumentoFilters

  // UI state
  isDetailModalOpen: boolean
  isExporting: boolean
  isRetrying: boolean

  // Selected items for bulk operations
  selectedIds: number[]
} = {
  // Core data
  data: [],
  total: 0,
  loading: false,
  error: null,
  selectedItem: null,

  // Pagination
  pageNumber: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
  params: {},

  // UI state
  isDetailModalOpen: false,
  isExporting: false,
  isRetrying: false,

  // Selection
  selectedIds: [],
}

export const ecfDocumentosSlice = createSlice({
  name: 'ecfDocumentos',
  initialState,
  reducers: {
    // UI Actions
    toggleDetailModal: (state, action) => {
      state.isDetailModalOpen = !state.isDetailModalOpen
      if (action.payload) {
        state.selectedItem = action.payload
      } else {
        state.selectedItem = null
      }
    },

    clearError: (state) => {
      state.error = null
    },

    setSelectedIds: (state, action) => {
      state.selectedIds = action.payload
    },

    clearSelectedIds: (state) => {
      state.selectedIds = []
    },

    updateFilters: (state, action) => {
      state.params = { ...state.params, ...action.payload }
      // Reset pagination when filters change
      if (action.payload && Object.keys(action.payload).length > 0) {
        state.pageNumber = 1
      }
    },

    clearFilters: (state) => {
      state.params = {}
      state.pageNumber = 1
    },
  },
  extraReducers: (builder) => {
    // Fetch ECF Documents
    builder.addCase(fetchEcfDocuments.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchEcfDocuments.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload.data
      state.total = action.payload.totalCount
      state.pageNumber = action.payload.pageNumber
      state.pageSize = action.payload.pageSize
      state.totalCount = action.payload.totalCount
      state.totalPages = action.payload.totalPages
      state.hasPreviousPage = action.payload.hasPreviousPage
      state.hasNextPage = action.payload.hasNextPage
      state.params = action.payload.params
    })
    builder.addCase(fetchEcfDocuments.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload?.message || 'Error al cargar documentos ECF'
      state.data = []
      state.total = 0
    })

    // Get Document Detail
    builder.addCase(getEcfDocumentDetail.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getEcfDocumentDetail.fulfilled, (state, action) => {
      state.loading = false
      state.selectedItem = action.payload
    })
    builder.addCase(getEcfDocumentDetail.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload?.message || 'Error al cargar detalles'
    })

    // Retry Processing
    builder.addCase(retryEcfDocumentProcessing.pending, (state) => {
      state.isRetrying = true
    })
    builder.addCase(retryEcfDocumentProcessing.fulfilled, (state) => {
      state.isRetrying = false
    })
    builder.addCase(retryEcfDocumentProcessing.rejected, (state, action) => {
      state.isRetrying = false
      state.error = action.payload?.message || 'Error al reintentar'
    })

    // Export Data
    builder.addCase(exportEcfDocuments.pending, (state) => {
      state.isExporting = true
    })
    builder.addCase(exportEcfDocuments.fulfilled, (state) => {
      state.isExporting = false
    })
    builder.addCase(exportEcfDocuments.rejected, (state, action) => {
      state.isExporting = false
      state.error = action.payload?.message || 'Error al exportar'
    })
  },
})

export const {
  toggleDetailModal,
  clearError,
  setSelectedIds,
  clearSelectedIds,
  updateFilters,
  clearFilters,
} = ecfDocumentosSlice.actions

export default ecfDocumentosSlice.reducer
