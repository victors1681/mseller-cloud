// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { CustomerType } from 'src/types/apps/customerType'
import { PaginatedResponse } from 'src/types/apps/response'
import restClient from 'src/configs/restClient'

interface DataParams {
  query: string
  dates?: Date[]
  procesado?: string
  pageNumber: number
  vendedor?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export interface AxiosResponse<T> {
  data: T
}

// ** Fetch Clients
export const fetchData = createAsyncThunk(
  'appClient/fetchData',
  async (params: DataParams) => {
    console.log('params', params)
    if (params.procesado === '') {
      delete params.procesado
    }
    const response = await restClient.get<
      any,
      AxiosResponse<PaginatedResponse<CustomerType>>
    >('/api/portal/Cliente', {
      params,
    })

    return {
      data: response.data.data,
      params,
      allData: [],
      pageNumber: response.data.pageNumber,
      pageSize: response.data.pageSize,
      totalPages: response.data.totalPages,
      totalResults: response.data.totalResults,
      total: response.data.data.length,
      isLoading: false,
    }
  },
)

export const deleteClient = createAsyncThunk(
  'appClient/deleteData',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.delete('/api/portal/Cliente', {
      data: id,
    })
    await dispatch(fetchData(getState().Client.params))

    return response.data
  },
)

export const appClientSlice = createSlice({
  name: 'appClient',
  initialState: {
    data: [] as CustomerType[],
    params: {},
    allData: [],
    pageNumber: 0,
    pageSize: 0,
    totalPages: 0,
    totalResults: 0,
    total: 0,
    isLoading: true,
  },
  reducers: {},
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

export default appClientSlice.reducer
