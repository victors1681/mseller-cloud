// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import { DocTypeSecType } from 'src/types/apps/docTypeSecType'
import { PaginatedResponse } from 'src/types/apps/response'
import restClient from 'src/configs/restClient'
import { AppDispatch, RootState } from '@/store'
import toast from 'react-hot-toast'

interface DataParams {
  query?: string
  pageSize?: number
  pageNumber?: number
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export interface AxiosResponse<T> {
  data: T
}

export const addUpdateDocTypeSecType = createAsyncThunk<
  any,
  DocTypeSecType,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appDocTypeSec/addUpdateDocTypeSecType',
  async (data: DocTypeSecType, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await restClient.put<any>(
        '/api/portal/TipoDocumentoSecuencia',
        data,
      )

      if (response.status === 200) {
        toast.success('Tipo de documento actualizado exitosamente')

        const state = getState()
        const params = state.docTypeSec.params
        await dispatch(fetchDocTypeSecs(params))

        return {
          success: true,
          data: response.data.data,
          message: 'Tipo de documento actualizado exitosamente',
        }
      }

      return rejectWithValue({
        message:
          response?.data?.message || 'Error actualizando tipo de documento',
      })
    } catch (error) {
      console.error('DocTypeSec type error:', error)
      return rejectWithValue({
        message: 'Error inesperado actualizando el tipo de documento',
      })
    }
  },
)

export const addDocTypeSecs = createAsyncThunk(
  'appDocTypeSec/addDocTypeSecs',
  async (docTypeSecs: DocTypeSecType[], { dispatch, getState }: Redux) => {
    const response = await restClient.post(
      '/api/portal/TipoDocumentoSecuencia',
      docTypeSecs,
    )

    const state = getState()
    const params = state.appDocTypeSec.params

    await dispatch(fetchDocTypeSecs(params))

    return response.data
  },
)

export const initializeDocTypeSecSequence = createAsyncThunk(
  'appDocTypeSec/initializeSequence',
  async (_, { dispatch, getState }: Redux) => {
    try {
      const response = await restClient.post(
        '/api/portal/TipoDocumentoSecuencia/inicializar-secuencia',
        '',
      )

      if (response.status !== 200) {
        throw new Error('Error inicializando la secuencia')
      }
      toast.success('Secuencia inicializada exitosamente')

      await new Promise((resolve) => setTimeout(resolve, 2000))
      await dispatch(fetchDocTypeSecs({}))

      return response.data
    } catch (error) {
      toast.error('Error inicializando la secuencia')
      throw error
    }
  },
)

// ** Fetch DocTypeSecs
export const fetchDocTypeSecs = createAsyncThunk(
  'appDocTypeSec/fetchDocTypeSecs',
  async (params: DataParams = {}, { rejectWithValue }) => {
    try {
      console.log('Fetching DocTypeSecs with params:', params)
      const response = await restClient.get<
        any,
        AxiosResponse<PaginatedResponse<DocTypeSecType>>
      >('/api/portal/TipoDocumentoSecuencia', {
        params,
      })

      console.log('API Response:', response)

      // Handle both paginated and non-paginated responses
      const responseData = response.data
      const isArray = Array.isArray(responseData)

      const result = {
        data: isArray ? responseData : responseData.data || [],
        params,
        allData: [],
        pageNumber: isArray ? 1 : responseData.pageNumber || 1,
        pageSize: isArray ? responseData.length : responseData.pageSize || 20,
        totalPages: isArray ? 1 : responseData.totalPages || 1,
        totalResults: isArray
          ? responseData.length
          : responseData.totalResults || 0,
        total: isArray ? responseData.length : responseData.data?.length || 0,
        isLoading: false,
      }

      console.log('Processed result:', result)
      return result
    } catch (error) {
      console.error('fetchDocTypeSecs error:', error)
      return rejectWithValue({
        message: 'Error fetching document types',
      })
    }
  },
)

export const deleteDocTypeSec = createAsyncThunk(
  'appDocTypeSec/deleteDocTypeSec',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.delete(
      '/apps/portal/TipoDocumentoSecuencia',
      {
        data: id,
      },
    )
    await dispatch(fetchDocTypeSecs(getState().docTypeSec.params))

    return response.data
  },
)

export const appDocTypeSecSlice = createSlice({
  name: 'appDocTypeSec',
  initialState: {
    isAddUpdateDrawerOpen: false,
    editData: null as DocTypeSecType | null | undefined,
    data: [] as DocTypeSecType[],
    params: {} as any,
    allData: [],
    pageNumber: 0,
    pageSize: 0,
    totalPages: 0,
    totalResults: 0,
    total: 0,
    isLoading: true,
    isInitializing: false,
  },
  reducers: {
    toggleDocTypeSecAddUpdate: (state, payload) => {
      state.editData = payload.payload
      state.isAddUpdateDrawerOpen = !state.isAddUpdateDrawerOpen
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDocTypeSecs.pending, (state, action) => {
      console.log('fetchDocTypeSecs pending')
      state.isLoading = true
    })
    builder.addCase(fetchDocTypeSecs.rejected, (state, action) => {
      console.log('fetchDocTypeSecs rejected:', action)
      state.isLoading = false
      state.data = []
      state.total = 0
      state.pageNumber = 0
      state.pageSize = 0
      state.totalPages = 0
    })
    builder.addCase(fetchDocTypeSecs.fulfilled, (state, action) => {
      console.log('fetchDocTypeSecs fulfilled:', action.payload)
      state.data = action.payload.data
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
      state.pageNumber = action.payload.pageNumber
      state.pageSize = action.payload.pageSize
      state.totalPages = action.payload.totalPages
      state.totalResults = action.payload.totalResults
      state.isLoading = false
    })

    builder.addCase(addDocTypeSecs.fulfilled, (state, action) => {
      state.data = [...state.data, ...action.payload]
    })

    builder.addCase(initializeDocTypeSecSequence.pending, (state, action) => {
      state.isInitializing = true
    })
    builder.addCase(initializeDocTypeSecSequence.fulfilled, (state, action) => {
      state.isInitializing = false
      // Data will be refreshed by the fetchDocTypeSecs call in the thunk
    })
    builder.addCase(initializeDocTypeSecSequence.rejected, (state, action) => {
      state.isInitializing = false
    })
  },
})

export default appDocTypeSecSlice.reducer
export const { toggleDocTypeSecAddUpdate } = appDocTypeSecSlice.actions
