// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'

// ** Axios Imports
import { AppDispatch, RootState } from '@/store'
import { isAxiosError } from 'axios'
import toast from 'react-hot-toast'
import restClient from 'src/configs/restClient'
import {
  DocumentStatus,
  DocumentType,
  DocumentUpdateType,
  StatusParam,
} from 'src/types/apps/documentTypes'
import { PaginatedResponse } from 'src/types/apps/response'
import { extractDocumentErrorMessage } from 'src/utils/errorUtils'
import { getDateParam } from 'src/utils/getDateParam'
interface DataParams {
  query: string
  dates?: Date[]
  procesado?: string | number
  pageNumber?: number
  vendedores?: string
  localidad?: string
  condicionPago?: string
  tipoDocumento?: string
  codigoCliente?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export interface AxiosResponse<T> {
  data: T
}
// ** Fetch Documents
export const fetchData = createAsyncThunk(
  'appDocuments/fetchData',
  async (params: DataParams) => {
    // Create a mutable copy of params to avoid mutating the original
    const queryParams = { ...params }

    if (queryParams.procesado === '') {
      delete queryParams.procesado
    } else if (queryParams.procesado) {
      queryParams.procesado = parseInt(queryParams.procesado as string)
    }

    const response = await restClient.get<
      any,
      AxiosResponse<PaginatedResponse<DocumentType>>
    >('/api/portal/Pedido', {
      params: {
        ...queryParams,
        ...getDateParam(queryParams.dates),
      },
    })

    return {
      data: response.data.data,
      params,
      allData: [],
      total: response.data.data.length,
      pageNumber: response.data.pageNumber,
      pageSize: response.data.pageSize,
      totalPages: response.data.totalPages,
      totalResults: response.data.totalResults,
      isLoading: false,
    }
  },
)

// ** Load More Documents (for mobile infinite scroll)
export const loadMoreData = createAsyncThunk(
  'appDocuments/loadMoreData',
  async (params: DataParams) => {
    // Create a mutable copy of params to avoid mutating the original
    const queryParams = { ...params }

    if (queryParams.procesado === '') {
      delete queryParams.procesado
    } else if (queryParams.procesado) {
      queryParams.procesado = parseInt(queryParams.procesado as string)
    }

    const response = await restClient.get<
      any,
      AxiosResponse<PaginatedResponse<DocumentType>>
    >('/api/portal/Pedido', {
      params: {
        ...queryParams,
        ...getDateParam(queryParams.dates),
      },
    })

    return {
      newData: response.data.data,
      params,
      pageNumber: response.data.pageNumber,
      pageSize: response.data.pageSize,
      totalPages: response.data.totalPages,
      totalResults: response.data.totalResults,
      isLoading: false,
    }
  },
)

export const deleteInvoice = createAsyncThunk(
  'appDocuments/deleteData',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.delete('/api/portal/Pedido', {
      data: id,
    })
    await dispatch(fetchData(getState().invoice.params))

    return response.data
  },
)

interface DocumentStatusList {
  noPedidoStr: string
  status: DocumentStatus
}
interface StatusUpdateResponse {
  data: DocumentStatusList[]
}
export const fetchDocumentDetails = createAsyncThunk(
  'appDocuments/fetchDocumentDetails',
  async (noPedidoStr: string, { rejectWithValue }) => {
    try {
      const response = await restClient.get<any, AxiosResponse<DocumentType>>(
        '/api/portal/Pedido/detalle',
        {
          params: { noPedidoStr },
        },
      )

      return response.data
    } catch (error) {
      console.error('Document details fetch error:', error)
      return rejectWithValue({
        message: 'Error obteniendo los detalles del documento',
      })
    }
  },
)

export const addNewDocument = createAsyncThunk<
  any,
  DocumentUpdateType,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appDocuments/addNewDocument',
  async (data: DocumentUpdateType, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await restClient.post<any>(
        '/api/portal/Pedido/InsertarCompleto',
        data,
      )

      if (response.status === 200) {
        toast.success('Documento creado exitosamente')

        const state = getState()
        const params = state.documents.params || { query: '' }

        try {
          await dispatch(fetchData(params as DataParams)).unwrap()
          console.log('fetchData completed successfully')
        } catch (fetchError) {
          console.error('Error refreshing document list:', fetchError)
          // Don't fail the creation if refresh fails
        }

        return {
          success: true,
          data: response.data, // API returns document info directly in response.data
          message: response.data.message || 'Documento creado exitosamente',
        }
      }

      if (isAxiosError(response)) {
        return rejectWithValue({
          message: response.response?.data.message || 'Error creando documento',
        })
      }

      console.log('Document creation response error:', response)
    } catch (error: any) {
      console.error('Document creation error:', error)

      const errorMessage = extractDocumentErrorMessage(error, 'create')

      return rejectWithValue({
        message: errorMessage,
      })
    }
  },
)

export const addUpdateDocument = createAsyncThunk<
  any,
  DocumentUpdateType,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appDocuments/addUpdateDocument',
  async (data: DocumentUpdateType, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await restClient.put<any>(
        '/api/portal/Pedido/ActualizarCompleto',
        data,
      )

      if (response.status === 200) {
        toast.success('Documento actualizado exitosamente')

        const state = getState()
        const params = state.documents.params || { query: '' }

        console.log('Dispatching fetchData with params:', params)

        try {
          await dispatch(fetchData(params as DataParams)).unwrap()
          console.log('fetchData completed successfully')
        } catch (fetchError) {
          console.error('Error refreshing document list:', fetchError)
          // Don't fail the update if refresh fails
        }

        return {
          success: true,
          data: response.data.data,
          message: 'Documento actualizado exitosamente',
        }
      }

      return rejectWithValue({
        message: response?.data?.message || 'Error actualizando documento',
      })
    } catch (error: any) {
      console.error('Document update error:', error)

      const errorMessage = extractDocumentErrorMessage(error, 'update')

      return rejectWithValue({
        message: errorMessage,
      })
    }
  },
)

export const changeDocumentStatus = createAsyncThunk(
  'appDocuments/changeStatus',
  async (status: StatusParam[], { getState, dispatch }: Redux) => {
    try {
      const response = await restClient.put<
        StatusParam[],
        StatusUpdateResponse
      >('/api/portal/Pedido/ActualizarStatus', status)

      dispatch(appDocumentsSlice.actions.updateDocumentStatus(response.data))

      //return response.data
    } catch (err) {
      toast.error('Error al actualizar el documento')
    }
  },
)

export const appDocumentsSlice = createSlice({
  name: 'appDocuments',
  initialState: {
    isEditDialogOpen: false,
    isCreateMode: false,
    documentEditData: null as DocumentType | null | undefined,
    isLoadingDetails: false,
    isSubmitting: false,
    data: [] as any,
    params: {},
    allData: [],
    pageNumber: 0,
    pageSize: 0,
    totalPages: 0,
    totalResults: 0,
    total: 0,
    isLoading: true,
  },
  reducers: {
    toggleEditDocument: (state, payload) => {
      state.documentEditData = payload.payload
      state.isEditDialogOpen = !state.isEditDialogOpen
      state.isCreateMode = false
    },
    toggleCreateDocument: (state) => {
      state.documentEditData = null
      state.isEditDialogOpen = !state.isEditDialogOpen
      state.isCreateMode = true
    },
    updateDocumentStatus: (state, action) => {
      const payload = action.payload

      payload.forEach((element: DocumentStatusList) => {
        const index = state.data.findIndex(
          (f: DocumentType) => f.noPedidoStr == element.noPedidoStr,
        )
        if (index > -1) {
          state.data[index].procesado = element.status
        }
      })
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchData.rejected, (state, action) => {
      state.isLoading = false
      state.data = []
      state.total = 0
      state.pageNumber = 0
      state.pageSize = 0
      state.totalPages = 0
    })
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
      state.pageNumber = action.payload.pageNumber
      state.pageSize = action.payload.pageSize
      state.totalPages = action.payload.totalPages
      ;(state.totalResults = action.payload.totalResults),
        (state.isLoading = false)
    })
    // Handle loadMoreData states
    builder.addCase(loadMoreData.pending, (state) => {
      // Don't set isLoading to true for load more, use a separate loading state if needed
    })
    builder.addCase(loadMoreData.rejected, (state, action) => {
      // Handle error if needed
    })
    builder.addCase(loadMoreData.fulfilled, (state, action) => {
      // Append new data to existing data
      const newData = action.payload.newData || []
      state.data = [...state.data, ...newData]
      state.params = action.payload.params
      state.pageNumber = action.payload.pageNumber
      state.pageSize = action.payload.pageSize
      state.totalPages = action.payload.totalPages
      state.totalResults = action.payload.totalResults
    })
    builder.addCase(fetchDocumentDetails.pending, (state, action) => {
      state.isLoadingDetails = true
    })
    builder.addCase(fetchDocumentDetails.rejected, (state, action) => {
      state.isLoadingDetails = false
      toast.error('Error obteniendo los detalles del documento')
    })
    builder.addCase(fetchDocumentDetails.fulfilled, (state, action) => {
      state.documentEditData = action.payload
      state.isLoadingDetails = false
    })
    // Handle addNewDocument states
    builder.addCase(addNewDocument.pending, (state) => {
      state.isSubmitting = true
    })
    builder.addCase(addNewDocument.fulfilled, (state) => {
      state.isSubmitting = false
    })
    builder.addCase(addNewDocument.rejected, (state) => {
      state.isSubmitting = false
    })
    // Handle addUpdateDocument states
    builder.addCase(addUpdateDocument.pending, (state) => {
      state.isSubmitting = true
    })
    builder.addCase(addUpdateDocument.fulfilled, (state) => {
      state.isSubmitting = false
    })
    builder.addCase(addUpdateDocument.rejected, (state) => {
      state.isSubmitting = false
    })
  },
})

export default appDocumentsSlice.reducer
export const { toggleEditDocument, toggleCreateDocument } =
  appDocumentsSlice.actions
