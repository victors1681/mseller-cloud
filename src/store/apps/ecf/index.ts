// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Types Imports
import {
  ECFType,
  ECFTestConnectionRequest,
  ECFTestConnectionResponse,
  ECFTransformDocumentRequest,
  ECFTransformDocumentResponse,
  SecuenciaEcfType,
  SecuenciaEcfParams,
} from 'src/types/apps/ecfType'
import { PaginatedResponse } from 'src/types/apps/response'
import restClient from 'src/configs/restClient'
import { AppDispatch, RootState } from '@/store'
import toast from 'react-hot-toast'

interface DataParams {
  query?: string
  dates?: Date[]
  pageNumber?: number
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export interface AxiosResponse<T> {
  data: T
}

// ** Fetch ECF Configuration
export const fetchECFConfiguration = createAsyncThunk(
  'appECF/fetchData',
  async (params?: DataParams) => {
    const response = await restClient.get<
      any,
      AxiosResponse<PaginatedResponse<ECFType>>
    >('/api/portal/ConfiguracionFacturacionElectronica', {
      params,
    })

    return {
      data: response.data.data || response.data,
      params,
      allData: [],
      pageNumber: response.data.pageNumber || 1,
      pageSize: response.data.pageSize || 10,
      totalPages: response.data.totalPages || 1,
      totalResults:
        response.data.totalResults ||
        (response.data.data ? response.data.data.length : 1),
      total: response.data.data ? response.data.data.length : 1,
      isLoading: false,
    }
  },
)

// ** Add ECF Configuration
export const addECFConfiguration = createAsyncThunk<
  any,
  ECFType,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appECF/addECFConfiguration',
  async (data: ECFType, { dispatch, getState, rejectWithValue }) => {
    try {
      data.id = crypto.randomUUID()
      const response = await restClient.post<any>(
        '/api/portal/ConfiguracionFacturacionElectronica',
        data,
      )

      if (response.status === 200 || response.status === 201) {
        toast.success(
          'Integración de facturación electrónica creada exitosamente',
        )

        const state = getState()
        const params = state.ecf.params
        await dispatch(fetchECFConfiguration(params))

        return {
          success: true,
          data: response.data.data || response.data,
          message: 'Integración creada exitosamente',
        }
      }

      return rejectWithValue({
        message: response?.data?.message || 'Error creando la integración',
      })
    } catch (error) {
      console.error('ECF Configuration add error:', error)
      return rejectWithValue({
        message: 'Error inesperado creando la integración',
      })
    }
  },
)

// ** Update ECF Configuration
export const updateECFConfiguration = createAsyncThunk<
  any,
  ECFType,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appECF/updateECFConfiguration',
  async (data: ECFType, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await restClient.put<any>(
        '/api/portal/ConfiguracionFacturacionElectronica',
        data,
      )

      if (response.status === 200) {
        toast.success(
          'Integración de facturación electrónica actualizada exitosamente',
        )

        const state = getState()
        const params = state.ecf.params
        await dispatch(fetchECFConfiguration(params))

        return {
          success: true,
          data: response.data.data || response.data,
          message: 'Integración actualizada exitosamente',
        }
      }

      return rejectWithValue({
        message: response?.data?.message || 'Error actualizando la integración',
      })
    } catch (error) {
      console.error('ECF Configuration update error:', error)
      return rejectWithValue({
        message: 'Error inesperado actualizando la integración',
      })
    }
  },
)

// ** Delete ECF Configuration
export const deleteECFConfiguration = createAsyncThunk(
  'appECF/deleteData',
  async (id: string, { getState, dispatch }: Redux) => {
    try {
      const response = await restClient.delete(
        '/api/portal/ConfiguracionFacturacionElectronica',
        {
          data: { id },
        },
      )

      toast.success('Integración eliminada exitosamente')
      await dispatch(fetchECFConfiguration(getState().ecf.params))

      return response.data || {}
    } catch (error) {
      console.error('ECF Configuration delete error:', error)
      toast.error('Error eliminando la integración')
      throw error
    }
  },
)

// ** Test Connection
export const testECFConnection = createAsyncThunk<
  ECFTestConnectionResponse,
  ECFTestConnectionRequest,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appECF/testConnection',
  async (data: ECFTestConnectionRequest, { rejectWithValue }) => {
    try {
      const response = await restClient.post<ECFTestConnectionResponse>(
        '/api/portal/ConfiguracionFacturacionElectronica/probar-conexion',
        data,
      )

      if (response.status === 200) {
        toast.success('Conexión exitosa')
      } else {
        toast.error(response.data.message || 'Error en la conexión')
      }

      return response.data
    } catch (error) {
      console.error('ECF Connection test error:', error)
      const errorMessage = 'Error probando la conexión'
      toast.error(errorMessage)
      return rejectWithValue({
        message: errorMessage,
      })
    }
  },
)

// ** Transform Document
export const transformDocument = createAsyncThunk<
  ECFTransformDocumentResponse,
  ECFTransformDocumentRequest,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appECF/transformDocument',
  async (data: ECFTransformDocumentRequest, { rejectWithValue }) => {
    try {
      const response = await restClient.post<ECFTransformDocumentResponse>(
        '/api/portal/ConfiguracionFacturacionElectronica/transformar-documento',
        data,
      )

      if (response.data.success) {
        toast.success('Documento transformado exitosamente')
      } else {
        toast.error(response.data.message || 'Error transformando el documento')
      }

      return response.data
    } catch (error) {
      console.error('ECF Document transform error:', error)
      const errorMessage = 'Error transformando el documento'
      toast.error(errorMessage)
      return rejectWithValue({
        message: errorMessage,
      })
    }
  },
)

// ** Fetch Secuencia ECF
export const fetchSecuenciaECF = createAsyncThunk(
  'appECF/fetchSecuenciaECF',
  async (params?: SecuenciaEcfParams) => {
    const response = await restClient.get<
      any,
      AxiosResponse<PaginatedResponse<SecuenciaEcfType>>
    >('/api/portal/SecuenciaEcf', {
      params,
    })

    return {
      data: response.data.data || response.data,
      params,
      allData: [],
      pageNumber: response.data.pageNumber || 0,
      pageSize: response.data.pageSize || 20,
      totalPages: response.data.totalPages || 1,
      totalResults: response.data.totalResults || 0,
      total: response.data.total || 0,
      isLoading: false,
    }
  },
)

// ** Get Single Secuencia ECF
export const getSecuenciaECF = createAsyncThunk<
  SecuenciaEcfType,
  number,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>('appECF/getSecuenciaECF', async (id: number, { rejectWithValue }) => {
  try {
    const response = await restClient.get<SecuenciaEcfType>(
      `/api/portal/SecuenciaEcf/${id}`,
    )

    return response.data
  } catch (error) {
    console.error('Get Secuencia ECF error:', error)
    return rejectWithValue({
      message: 'Error obteniendo la secuencia ECF',
    })
  }
})

// ** Add Secuencia ECF
export const addSecuenciaECF = createAsyncThunk<
  any,
  Omit<SecuenciaEcfType, 'id'>,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appECF/addSecuenciaECF',
  async (
    data: Omit<SecuenciaEcfType, 'id'>,
    { dispatch, getState, rejectWithValue },
  ) => {
    try {
      const response = await restClient.post<any>(
        '/api/portal/SecuenciaEcf',
        data,
      )

      if (response.status === 200 || response.status === 201) {
        toast.success('Secuencia ECF creada exitosamente')

        const state = getState()
        const params = state.ecf.secuenciaParams
        await dispatch(fetchSecuenciaECF(params))

        return {
          success: true,
          data: response.data.data || response.data,
          message: 'Secuencia ECF creada exitosamente',
        }
      }

      return rejectWithValue({
        message: response?.data?.message || 'Error creando la secuencia ECF',
      })
    } catch (error) {
      console.error('Secuencia ECF add error:', error)
      return rejectWithValue({
        message: 'Error inesperado creando la secuencia ECF',
      })
    }
  },
)

// ** Update Secuencia ECF
export const updateSecuenciaECF = createAsyncThunk<
  any,
  SecuenciaEcfType,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appECF/updateSecuenciaECF',
  async (data: SecuenciaEcfType, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await restClient.put<any>(
        `/api/portal/SecuenciaEcf/${data.id}`,
        data,
      )

      if (response.status === 200) {
        toast.success('Secuencia ECF actualizada exitosamente')

        const state = getState()
        const params = state.ecf.secuenciaParams
        await dispatch(fetchSecuenciaECF(params))

        return {
          success: true,
          data: response.data.data || response.data,
          message: 'Secuencia ECF actualizada exitosamente',
        }
      }

      return rejectWithValue({
        message:
          response?.data?.message || 'Error actualizando la secuencia ECF',
      })
    } catch (error) {
      console.error('Secuencia ECF update error:', error)
      return rejectWithValue({
        message: 'Error inesperado actualizando la secuencia ECF',
      })
    }
  },
)

// ** Delete Secuencia ECF
export const deleteSecuenciaECF = createAsyncThunk(
  'appECF/deleteSecuenciaECF',
  async (id: number, { getState, dispatch }: Redux) => {
    try {
      const response = await restClient.delete(`/api/portal/SecuenciaEcf/${id}`)

      toast.success('Secuencia ECF eliminada exitosamente')
      await dispatch(fetchSecuenciaECF(getState().ecf.secuenciaParams))

      return response.data || {}
    } catch (error) {
      console.error('Secuencia ECF delete error:', error)
      toast.error('Error eliminando la secuencia ECF')
      throw error
    }
  },
)

// ** Toggle Secuencia ECF Status
export const toggleSecuenciaECFStatus = createAsyncThunk<
  any,
  number,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appECF/toggleSecuenciaECFStatus',
  async (id: number, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await restClient.patch<any>(
        `/api/portal/SecuenciaEcf/${id}/toggle-status`,
      )

      if (response.status === 200) {
        toast.success('Estado de secuencia ECF actualizado exitosamente')

        const state = getState()
        const params = state.ecf.secuenciaParams
        await dispatch(fetchSecuenciaECF(params))

        return {
          success: true,
          data: response.data.data || response.data,
          message: 'Estado actualizado exitosamente',
        }
      }

      return rejectWithValue({
        message: response?.data?.message || 'Error actualizando el estado',
      })
    } catch (error) {
      console.error('Toggle Secuencia ECF status error:', error)
      return rejectWithValue({
        message: 'Error inesperado actualizando el estado',
      })
    }
  },
)

export const appECFSlice = createSlice({
  name: 'appECF',
  initialState: {
    isAddUpdateDrawerOpen: false,
    editData: null as ECFType | null | undefined,
    data: [] as ECFType[],
    singleData: null as ECFType | null,
    params: {} as any,
    allData: [],
    pageNumber: 0,
    pageSize: 0,
    totalPages: 0,
    totalResults: 0,
    total: 0,
    isLoading: true,
    isTestingConnection: false,
    connectionTestResult: null as ECFTestConnectionResponse | null,
    isTransformingDocument: false,
    transformDocumentResult: null as ECFTransformDocumentResponse | null,
    // Secuencia ECF state
    secuenciaData: [] as SecuenciaEcfType[],
    secuenciaSingleData: null as SecuenciaEcfType | null,
    secuenciaParams: {} as SecuenciaEcfParams,
    secuenciaAllData: [],
    secuenciaPageNumber: 0,
    secuenciaPageSize: 20,
    secuenciaTotalPages: 0,
    secuenciaTotalResults: 0,
    secuenciaTotal: 0,
    isSecuenciaLoading: true,
    secuenciaEditData: null as SecuenciaEcfType | null | undefined,
    isSecuenciaAddUpdateDrawerOpen: false,
  },
  reducers: {
    toggleECFAddUpdate: (state, payload) => {
      state.editData = payload.payload
      state.isAddUpdateDrawerOpen = !state.isAddUpdateDrawerOpen
    },
    clearConnectionTestResult: (state) => {
      state.connectionTestResult = null
    },
    clearTransformDocumentResult: (state) => {
      state.transformDocumentResult = null
    },
    toggleSecuenciaECFAddUpdate: (state, payload) => {
      state.secuenciaEditData = payload.payload
      state.isSecuenciaAddUpdateDrawerOpen =
        !state.isSecuenciaAddUpdateDrawerOpen
    },
  },
  extraReducers: (builder) => {
    // Fetch ECF Configuration
    builder.addCase(fetchECFConfiguration.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchECFConfiguration.rejected, (state, action) => {
      state.isLoading = false
      state.data = []
      state.total = 0
      state.pageNumber = 0
      state.pageSize = 0
      state.totalPages = 0
    })
    builder.addCase(fetchECFConfiguration.fulfilled, (state, action) => {
      state.data = Array.isArray(action.payload.data)
        ? action.payload.data
        : [action.payload.data]
      state.singleData = Array.isArray(action.payload.data)
        ? action.payload.data[0]
        : action.payload.data
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
      state.pageNumber = action.payload.pageNumber
      state.pageSize = action.payload.pageSize
      state.totalPages = action.payload.totalPages
      state.totalResults = action.payload.totalResults
      state.isLoading = false
    })

    // Add ECF Configuration
    builder.addCase(addECFConfiguration.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(addECFConfiguration.fulfilled, (state, action) => {
      state.isLoading = false
      state.isAddUpdateDrawerOpen = false
      state.editData = null
    })
    builder.addCase(addECFConfiguration.rejected, (state, action) => {
      state.isLoading = false
    })

    // Update ECF Configuration
    builder.addCase(updateECFConfiguration.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(updateECFConfiguration.fulfilled, (state, action) => {
      state.isLoading = false
      state.isAddUpdateDrawerOpen = false
      state.editData = null
    })
    builder.addCase(updateECFConfiguration.rejected, (state, action) => {
      state.isLoading = false
    })

    // Delete ECF Configuration
    builder.addCase(deleteECFConfiguration.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(deleteECFConfiguration.fulfilled, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(deleteECFConfiguration.rejected, (state, action) => {
      state.isLoading = false
    })

    // Test Connection
    builder.addCase(testECFConnection.pending, (state) => {
      state.isTestingConnection = true
      state.connectionTestResult = null
    })
    builder.addCase(testECFConnection.fulfilled, (state, action) => {
      state.isTestingConnection = false
      state.connectionTestResult = action.payload
    })
    builder.addCase(testECFConnection.rejected, (state, action) => {
      state.isTestingConnection = false
      state.connectionTestResult = {
        success: false,
        message: action.payload?.message || 'Error en la conexión',
      }
    })

    // Transform Document
    builder.addCase(transformDocument.pending, (state) => {
      state.isTransformingDocument = true
      state.transformDocumentResult = null
    })
    builder.addCase(transformDocument.fulfilled, (state, action) => {
      state.isTransformingDocument = false
      state.transformDocumentResult = action.payload
    })
    builder.addCase(transformDocument.rejected, (state, action) => {
      state.isTransformingDocument = false
      state.transformDocumentResult = {
        success: false,
        message: action.payload?.message || 'Error transformando el documento',
      }
    })

    // Fetch Secuencia ECF
    builder.addCase(fetchSecuenciaECF.pending, (state, action) => {
      state.isSecuenciaLoading = true
    })
    builder.addCase(fetchSecuenciaECF.rejected, (state, action) => {
      state.isSecuenciaLoading = false
      state.secuenciaData = []
      state.secuenciaTotal = 0
      state.secuenciaPageNumber = 0
      state.secuenciaPageSize = 20
      state.secuenciaTotalPages = 0
    })
    builder.addCase(fetchSecuenciaECF.fulfilled, (state, action) => {
      state.secuenciaData = Array.isArray(action.payload.data)
        ? action.payload.data
        : [action.payload.data]
      state.secuenciaSingleData = Array.isArray(action.payload.data)
        ? action.payload.data[0]
        : action.payload.data
      state.secuenciaParams = action.payload.params || {}
      state.secuenciaAllData = action.payload.allData
      state.secuenciaTotal = action.payload.total
      state.secuenciaPageNumber = action.payload.pageNumber
      state.secuenciaPageSize = action.payload.pageSize
      state.secuenciaTotalPages = action.payload.totalPages
      state.secuenciaTotalResults = action.payload.totalResults
      state.isSecuenciaLoading = false
    })

    // Get Single Secuencia ECF
    builder.addCase(getSecuenciaECF.pending, (state) => {
      state.isSecuenciaLoading = true
    })
    builder.addCase(getSecuenciaECF.fulfilled, (state, action) => {
      state.isSecuenciaLoading = false
      state.secuenciaSingleData = action.payload
    })
    builder.addCase(getSecuenciaECF.rejected, (state, action) => {
      state.isSecuenciaLoading = false
    })

    // Add Secuencia ECF
    builder.addCase(addSecuenciaECF.pending, (state) => {
      state.isSecuenciaLoading = true
    })
    builder.addCase(addSecuenciaECF.fulfilled, (state, action) => {
      state.isSecuenciaLoading = false
      state.isSecuenciaAddUpdateDrawerOpen = false
      state.secuenciaEditData = null
    })
    builder.addCase(addSecuenciaECF.rejected, (state, action) => {
      state.isSecuenciaLoading = false
    })

    // Update Secuencia ECF
    builder.addCase(updateSecuenciaECF.pending, (state) => {
      state.isSecuenciaLoading = true
    })
    builder.addCase(updateSecuenciaECF.fulfilled, (state, action) => {
      state.isSecuenciaLoading = false
      state.isSecuenciaAddUpdateDrawerOpen = false
      state.secuenciaEditData = null
    })
    builder.addCase(updateSecuenciaECF.rejected, (state, action) => {
      state.isSecuenciaLoading = false
    })

    // Delete Secuencia ECF
    builder.addCase(deleteSecuenciaECF.pending, (state) => {
      state.isSecuenciaLoading = true
    })
    builder.addCase(deleteSecuenciaECF.fulfilled, (state, action) => {
      state.isSecuenciaLoading = false
    })
    builder.addCase(deleteSecuenciaECF.rejected, (state, action) => {
      state.isSecuenciaLoading = false
    })

    // Toggle Secuencia ECF Status
    builder.addCase(toggleSecuenciaECFStatus.pending, (state) => {
      state.isSecuenciaLoading = true
    })
    builder.addCase(toggleSecuenciaECFStatus.fulfilled, (state, action) => {
      state.isSecuenciaLoading = false
    })
    builder.addCase(toggleSecuenciaECFStatus.rejected, (state, action) => {
      state.isSecuenciaLoading = false
    })
  },
})

export default appECFSlice.reducer
export const {
  toggleECFAddUpdate,
  clearConnectionTestResult,
  clearTransformDocumentResult,
  toggleSecuenciaECFAddUpdate,
} = appECFSlice.actions
