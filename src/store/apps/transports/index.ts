// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import {
  DocumentoEntregaResponse,
  DocumentoEntregaResponseAxios,
  DocumentoEntregaType,
  TransporteListType,
} from 'src/types/apps/transportType'
import { PaginatedResponse } from 'src/types/apps/response'
import { getDateParam } from 'src/utils/getDateParam'
import restClient from 'src/configs/restClient'

interface DataParams {
  query: string
  dates?: Date[]
  status?: string
  pageNumber?: number
  distribuidores?: string
}

export interface AxiosResponse<T> {
  data: T
}
interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch transports
export const fetchData = createAsyncThunk(
  'appTransport/fetchData',
  async (params: DataParams) => {
    if (params.status === '') {
      delete params.status
    }
    const response = await restClient.get<
      any,
      AxiosResponse<PaginatedResponse<TransporteListType>>
    >('/api/portal/Transporte', {
      params: {
        ...params,
        ...getDateParam(params.dates),
      },
    })

    return {
      transportData: response.data.data,
      params,
      allData: [],
      docsData: null,
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
  'appTransport/deleteData',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.delete('/apps/transport/delete', {
      data: id,
    })
    await dispatch(fetchData(getState().transport.params))

    return response.data
  },
)

export const closeTransport = createAsyncThunk(
  'appTransport/closeTransport',
  async (NoTransporte: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.put(
      'api/portal/Transporte/ForzarCierre',
      {
        NoTransporte, //add usuario
      },
    )
    await dispatch(fetchData(getState().transport.params))

    return response.data
  },
)

export const deliveryReport = async (noTransporte: string) => {
  const response = await restClient.get(
    '/api/portal/Transporte/ReporteEntrega',
    {
      params: {
        noTransporte,
      },
    },
  )
  console.log(response.data)
  return response.data
}

export const fetchTransportDocsData = createAsyncThunk(
  'appTransport/docs',
  async (noTransporte: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.get<any, DocumentoEntregaResponseAxios>(
      '/api/portal/Transporte/DocumentosEntrega',
      {
        params: { noTransporte },
      },
    )

    //await dispatch(fetchData(getState().transport.params))

    const currentState = getState().transports

    return {
      transportData: currentState.transportData,
      params: currentState.params,
      allData: [],
      total: currentState.total,
      docsData: response.data,
    }
  },
)

export const apptransportslice = createSlice({
  name: 'appTransport',
  initialState: {
    transportData: [] as any,
    pageNumber: 0,
    pageSize: 0,
    totalPages: 0,
    totalResults: 0,
    total: 0,
    isLoading: true,
    params: {},
    allData: [],
    docsData: {
      noTransporte: '',
      localidadId: 0,
      codigoDistribuidor: '',
      fecha: '',
      documentos: [] as DocumentoEntregaType[],
      distribuidor: {},
      procesado: false,
      status: 0,
      entregadas: 0,
      noEntregadas: 0,
      entregarDespues: 0,
    } as DocumentoEntregaResponse | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchData.rejected, (state, action) => {
      state.isLoading = false
      state.transportData = []
      state.total = 0
      state.pageNumber = 0
      state.pageSize = 0
      state.totalPages = 0
    })

    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.transportData = action.payload.transportData
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
      state.pageNumber = action.payload.pageNumber
      state.pageSize = action.payload.pageSize
      state.totalPages = action.payload.totalPages
      state.totalResults = action.payload.totalResults
      state.isLoading = false
    })

    builder.addCase(fetchTransportDocsData.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchTransportDocsData.rejected, (state, action) => {
      state.isLoading = false
    })

    builder.addCase(fetchTransportDocsData.fulfilled, (state, action) => {
      state.transportData = action.payload.transportData
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
      state.docsData = action.payload.docsData
      state.isLoading = false
    })
  },
})

export default apptransportslice.reducer
