// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { DistribuidorType } from 'src/types/apps/driverType'
import { PaginatedResponse } from 'src/types/apps/response'
import restClient from 'src/configs/restClient'
import toast from 'react-hot-toast'

interface DataParams {
  query: string
  dates?: Date[]
  procesado?: string
  pageNumber: number
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export interface AxiosResponse<T> {
  data: T
}

// ** Fetch PaymentTypes
export const fetchData = createAsyncThunk(
  'appDriver/fetchData',
  async (params?: DataParams) => {
    const response = await restClient.get<
      any,
      AxiosResponse<PaginatedResponse<DistribuidorType>>
    >('/api/portal/Distribuidor', {
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

export const deletePaymentType = createAsyncThunk(
  'appDriver/deleteData',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.delete('/apps/PaymentType/delete', {
      data: id,
    })
    await dispatch(fetchData(getState().PaymentType.params))

    return response.data
  },
)

export const appDriverSlice = createSlice({
  name: 'appDriver',
  initialState: {
    data: [] as DistribuidorType[],
    params: {} as any,
    allData: [],
    pageNumber: 0,
    pageSize: 0,
    totalPages: 0,
    totalResults: 0,
    total: 0,
    isLoading: true,
    isFailed: false,
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
      state.data = []
      state.total = 0
      state.pageNumber = 0
      state.pageSize = 0
      state.totalPages = 0
      toast.error('Error al cargar los distribuidores')
    })
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
      state.pageNumber = action.payload.pageNumber
      state.pageSize = action.payload.pageSize
      state.totalPages = action.payload.totalPages
      state.totalResults = action.payload.totalResults
      state.isLoading = false
      state.isFailed = false
    })
  },
})

export default appDriverSlice.reducer
