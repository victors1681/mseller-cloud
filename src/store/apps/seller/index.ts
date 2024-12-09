// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import { SellerType } from 'src/types/apps/sellerType'
import { PaginatedResponse } from 'src/types/apps/response'
import restClient from 'src/configs/restClient'
import { AppDispatch, RootState } from '@/store'
import toast from 'react-hot-toast'

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

export const addUpdateSellerType = createAsyncThunk<
  any,
  SellerType,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appSeller/addUpdateSellerType',
  async (data: SellerType, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await restClient.put<any>('/api/portal/Vendedor', data)

      if (response.status === 200) {
        toast.success('Vendedor actualizado exitosamente')

        const state = getState()
        const params = state.paymentTypes.params
        await dispatch(fetchSellers(params))

        return {
          success: true,
          data: response.data.data,
          message: 'Vendedor actualizado exitosamente',
        }
      }

      return rejectWithValue({
        message: response.data.message || 'Error actualizando vendedor',
      })
    } catch (error) {
      console.error('Vendedor type error:', error)
      return rejectWithValue({
        message: 'Error inesperado actualizando la vendedor',
      })
    }
  },
)

export const addSellers = createAsyncThunk(
  'appSeller/addVendedores',
  async (sellers: SellerType[], { dispatch, getState }: Redux) => {
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
      AxiosResponse<PaginatedResponse<SellerType>>
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
    isAddUpdateDrawerOpen: false,
    editData: null as SellerType | null | undefined,
    data: [] as SellerType[],
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
    toggleSellerAddUpdate: (state, payload) => {
      state.editData = payload.payload
      state.isAddUpdateDrawerOpen = !state.isAddUpdateDrawerOpen
    },
  },
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
export const { toggleSellerAddUpdate } = appSellerSlice.actions
