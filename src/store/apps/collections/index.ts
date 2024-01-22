// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { CollectionType, ReceiptType } from 'src/types/apps/collectionType'
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
  'appCollection/fetchData',
  async (params: DataParams) => {
    if (params.status === '') {
      delete params.status
    }
    const response = await restClient.get<
      any,
      AxiosResponse<PaginatedResponse<CollectionType>>
    >('/api/portal/Cobro', {
      params: {
        ...params,
        ...getDateParam(params.dates),
      },
    })

    return {
      collectionsData: response.data.data,
      params,
      allData: [],
      collectionData: null,
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
  'appCollection/deleteData',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.delete('/api/Cobro/Deposito', {
      data: id,
    })
    await dispatch(fetchData(getState().transport.params))

    return response.data
  },
)

export const fetchSingleCollectionData = createAsyncThunk(
  'appCollection/docs',
  async (noDeposito: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.get<any, AxiosResponse<CollectionType>>(
      '/api/portal/Cobro/Deposito',
      {
        params: { noDeposito },
      },
    )

    //await dispatch(fetchData(getState().transport.params))

    const currentState = getState().transports

    return {
      collectionsData: currentState.transportData,
      params: currentState.params,
      total: currentState.total,
      collectionData: response.data,
    }
  },
)

export const apptransportslice = createSlice({
  name: 'appCollection',
  initialState: {
    collectionsData: [] as any,
    pageNumber: 0,
    pageSize: 0,
    totalPages: 0,
    totalResults: 0,
    total: 0,
    isLoading: true,
    isFailed: false,
    params: {},
    collectionData: {} as CollectionType,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, action) => {
      state.isLoading = true
      state.isFailed = false
    })
    builder.addCase(fetchData.rejected, (state, action) => {
      state.isLoading = false
      state.isFailed = true
      state.collectionsData = []
      state.total = 0
      state.pageNumber = 0
      state.pageSize = 0
      state.totalPages = 0
    })

    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.collectionsData = action.payload.collectionsData
      state.params = action.payload.params
      state.total = action.payload.total
      state.pageNumber = action.payload.pageNumber
      state.pageSize = action.payload.pageSize
      state.totalPages = action.payload.totalPages
      state.totalResults = action.payload.totalResults
      state.isLoading = false
      state.isFailed = false
    })

    builder.addCase(fetchSingleCollectionData.pending, (state, action) => {
      state.isLoading = true
      state.isFailed = false
    })
    builder.addCase(fetchSingleCollectionData.rejected, (state, action) => {
      state.isLoading = false
      state.isFailed = true
    })

    builder.addCase(fetchSingleCollectionData.fulfilled, (state, action) => {
      state.collectionsData = action.payload.collectionsData
      state.params = action.payload.params
      state.total = action.payload.total
      state.collectionData = action.payload.collectionData
      state.isLoading = false
    })
  },
})

export default apptransportslice.reducer
