// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { PaginatedResponse } from 'src/types/apps/response'
import { ProductType } from 'src/types/apps/productTypes'
import restClient from 'src/configs/restClient'

interface DataParams {
  query: string
  status?: string
  pageNumber: number
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export interface AxiosResponse<T> {
  data: T
}

// ** Fetch Products
export const fetchData = createAsyncThunk(
  'appProduct/fetchData',
  async (params: DataParams) => {
    console.log('params', params)
    if (params.status === '') {
      delete params.status
    }
    const response = await restClient.get<
      any,
      AxiosResponse<PaginatedResponse<ProductType>>
    >('/api/portal/Producto', {
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

export const deleteProduct = createAsyncThunk(
  'appProduct/deleteData',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.delete('/apps/product/delete', {
      data: id,
    })
    await dispatch(fetchData(getState().Product.params))

    return response.data
  },
)

export const appProductSlice = createSlice({
  name: 'appProduct',
  initialState: {
    data: [] as ProductType[],
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

export default appProductSlice.reducer
