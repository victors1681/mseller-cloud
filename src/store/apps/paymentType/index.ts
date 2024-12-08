// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { CondicionPagoType } from 'src/types/apps/paymentTypeTypes'
import { PaginatedResponse } from 'src/types/apps/response'
import restClient from 'src/configs/restClient'
import { AppDispatch, RootState } from '@/store'
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

export const addUpdatePaymentType = createAsyncThunk<
  any,
  CondicionPagoType,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appPaymentTypes/addUpdatePaymentType',
  async (
    paymentType: CondicionPagoType,
    { dispatch, getState, rejectWithValue },
  ) => {
    try {
      const response = await restClient.put<any>(
        '/api/portal/CondicionPago',
        paymentType,
      )

      if (response.status === 200) {
        toast.success('Condición de pago actualizado exitosamente')

        const state = getState()
        const params = state.paymentTypes.params
        await dispatch(fetchPaymentType(params))

        return {
          success: true,
          data: response.data.data,
          message: 'Condicion de pago actualizado exitosamente',
        }
      }

      return rejectWithValue({
        message:
          response.data.message || 'Error actualizando condicion de pago',
      })
    } catch (error) {
      console.error('Update payment type error:', error)
      return rejectWithValue({
        message: 'Error inesperado actualizando la condición de pago',
      })
    }
  },
)

export const addPaymentType = createAsyncThunk(
  'appSeller/addLocation',
  async (paymentTypes: CondicionPagoType[], { dispatch, getState }: Redux) => {
    const response = await restClient.post(
      '/api/portal/CondicionPago',
      paymentTypes,
    )

    const state = getState()
    const params = state.appSeller.params

    await dispatch(fetchPaymentType(params))

    return response.data
  },
)

// ** Fetch PaymentTypes
export const fetchPaymentType = createAsyncThunk(
  'appPaymentType/fetchData',
  async (params?: DataParams) => {
    const response = await restClient.get<
      any,
      AxiosResponse<PaginatedResponse<CondicionPagoType>>
    >('/api/portal/CondicionPago', {
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
  'appPaymentType/deleteData',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.delete('/apps/PaymentType/delete', {
      data: id,
    })
    await dispatch(fetchPaymentType(getState().PaymentType.params))

    return response.data || {}
  },
)

export const appPaymentTypeSlice = createSlice({
  name: 'appPaymentType',
  initialState: {
    isAddUpdateDrawerOpen: false,
    editData: null as CondicionPagoType | null | undefined,
    data: [] as CondicionPagoType[],
    params: {} as any,
    allData: [],
    pageNumber: 0,
    pageSize: 0,
    totalPages: 0,
    totalResults: 0,
    total: 0,
    isLoading: true,
  },
  reducers: {
    togglePaymentTypeAddUpdate: (state, payload) => {
      state.editData = payload.payload
      state.isAddUpdateDrawerOpen = !state.isAddUpdateDrawerOpen
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPaymentType.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchPaymentType.rejected, (state, action) => {
      state.isLoading = false
      state.data = []
      state.total = 0
      state.pageNumber = 0
      state.pageSize = 0
      state.totalPages = 0
    })
    builder.addCase(fetchPaymentType.fulfilled, (state, action) => {
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

    // builder.addCase(addPaymentType.fulfilled, (state, action) => {
    //   state.data = [...state.data, ...action.payload]
    // })
  },
})

export const { togglePaymentTypeAddUpdate } = appPaymentTypeSlice.actions
export default appPaymentTypeSlice.reducer
