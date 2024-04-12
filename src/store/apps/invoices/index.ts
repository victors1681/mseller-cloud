// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { PaginatedResponse } from 'src/types/apps/response'
import restClient from 'src/configs/restClient'
import { InvoiceListType, InvoiceType } from 'src/types/apps/invoicesTypes'
import toast from 'react-hot-toast'
import { isAxiosError } from 'axios'
import { getDateParam } from 'src/utils/getDateParam'

interface InvoiceParams {
  query: string
  dates?: Date[]
  pageNumber: number
  vendedores?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export interface AxiosResponse<T> {
  data: T
}

// ** Fetch Clients
export const fetchInvoice = createAsyncThunk(
  'appClient/fetchInvoice',
  async (params: InvoiceParams) => {
    console.log('params', params)

    try {
      const response = await restClient.get<
        any,
        AxiosResponse<PaginatedResponse<InvoiceType>>
      >('/api/portal/FacturaCxC', {
        params: {
          ...params,
          ...getDateParam(params.dates),
        },
      })

      if (isAxiosError(response)) {
        throw new Error(response.message)
      }

      return {
        data: response.data.data || [],
        params,
        pageNumber: response.data.pageNumber || 0,
        pageSize: response.data.pageSize || 0,
        totalPages: response.data.totalPages || 0,
        totalResults: response.data.totalResults || 0,
        total: response.data.data.length || 0,
        isLoading: false,
      }
    } catch (err) {
      toast.error(`Error al obtener las facturas ${err}`)
    }
  },
)

export const appInvoiceSlice = createSlice({
  name: 'appClient',
  initialState: {
    data: [] as InvoiceType[],
    params: {},
    pageNumber: 0,
    pageSize: 0,
    totalPages: 0,
    totalResults: 0,
    total: 0,
    isLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchInvoice.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchInvoice.rejected, (state, action) => {
      state.isLoading = false
      state.data = []
      state.total = 0
      state.pageNumber = 0
      state.pageSize = 0
      state.totalPages = 0
    })

    builder.addCase(fetchInvoice.fulfilled, (state, action) => {
      state.data = action?.payload?.data || []
      state.params = action?.payload?.params || {}
      state.total = action?.payload?.total || 0
      state.pageNumber = action?.payload?.pageNumber || 0
      state.pageSize = action?.payload?.pageSize || 0
      state.totalPages = action?.payload?.totalPages || 0
      state.totalResults = action?.payload?.totalResults || 0
      state.isLoading = false
    })
  },
})

export default appInvoiceSlice.reducer
