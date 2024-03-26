// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { PaginatedResponse } from 'src/types/apps/response'
import { getDateParam } from 'src/utils/getDateParam'
import restClient from 'src/configs/restClient'
import { DocumentStatus, StatusParam } from 'src/types/apps/documentTypes'
import toast from 'react-hot-toast'
import { DocumentType } from 'src/types/apps/documentTypes'
interface DataParams {
  query: string
  dates?: Date[]
  procesado?: string | number
  pageNumber?: number
  vendedores?: string
  localidad?: string
  condicionPago?: string
  tipoDocumento?: string
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
    if (params.procesado === '') {
      delete params.procesado
    } else {
      params.procesado = parseInt(params.procesado as string)
    }
    const response = await restClient.get<
      any,
      AxiosResponse<PaginatedResponse<DocumentType>>
    >('/api/portal/Pedido', {
      params: {
        ...params,
        ...getDateParam(params.dates),
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
  },
})

export default appDocumentsSlice.reducer
