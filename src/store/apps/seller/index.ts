// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import { VendedorType } from 'src/types/apps/sellerType'
import { PaginatedResponse } from 'src/types/apps/response'
import restClient from 'src/configs/restClient'

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

export const addSellers = createAsyncThunk(
  'appSeller/addVendedores',
  async (sellers: VendedorType[], { dispatch, getState }: Redux) => {
    const response = await restClient.post('/api/portal/Vendedor', sellers)

    const state = getState()
    const params = state.appSeller.params

    await dispatch(fetchSellers(params))

    return response.data
  },
)

// ** Fetch PaymentTypes
export const fetchSellers = createAsyncThunk(
  'appSeller/fetchSellers',
  async (params?: DataParams) => {
    const response = await restClient.get<
      any,
      AxiosResponse<PaginatedResponse<VendedorType>>
    >('/api/portal/Vendedor', {
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
  'appSeller/deleteVendedor',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.delete('/apps/Vendedor', {
      data: id,
    })
    await dispatch(fetchSellers(getState().PaymentType.params))

    return response.data
  },
)

export const appSellerSlice = createSlice({
  name: 'appSeller',
  initialState: {
    data: [] as VendedorType[],
    params: {} as any,
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
    builder.addCase(fetchSellers.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchSellers.rejected, (state, action) => {
      state.isLoading = false
      state.data = []
      state.total = 0
      state.pageNumber = 0
      state.pageSize = 0
      state.totalPages = 0
    })
    builder.addCase(fetchSellers.fulfilled, (state, action) => {
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

    builder.addCase(addSellers.fulfilled, (state, action) => {
      state.data = [...state.data, ...action.payload]
    })
  },
})

export default appSellerSlice.reducer
