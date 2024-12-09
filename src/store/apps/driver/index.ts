// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { DistribuidorType } from 'src/types/apps/driverType'
import { PaginatedResponse } from 'src/types/apps/response'
import restClient from 'src/configs/restClient'
import toast from 'react-hot-toast'
import { AppDispatch, RootState } from '@/store'

interface DataParams {
  query?: string
  dates?: Date[]
  procesado?: string
  pageNumber?: number
  pageSize?: number
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export interface AxiosResponse<T> {
  data: T
}

export const addUpdateDriver = createAsyncThunk<
  any,
  DistribuidorType,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appSeller/addUpdateDriver',
  async (data: DistribuidorType, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await restClient.put<any>(
        '/api/portal/Distribuidor',
        data,
      )

      if (response.status === 200) {
        toast.success('Distribuidor actualizado exitosamente')

        const state = getState()
        const params = state.paymentTypes.params
        await dispatch(fetchData(params))

        return {
          success: true,
          data: response.data.data,
          message: 'Distribuidor actualizado exitosamente',
        }
      }

      return rejectWithValue({
        message: response.data.message || 'Error actualizando vendedor',
      })
    } catch (error) {
      console.error('Distribuidor type error:', error)
      return rejectWithValue({
        message: 'Error inesperado actualizando la vendedor',
      })
    }
  },
)

export const addDrivers = createAsyncThunk(
  'appSeller/addDrivers',
  async (drivers: DistribuidorType[], { dispatch, getState }: Redux) => {
    const response = await restClient.post('/api/portal/Distribuidor', drivers)

    const state = getState()
    const params = state.appSeller.params

    await dispatch(fetchData(params))

    return response.data
  },
)

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
    isAddUpdateDrawerOpen: false,
    editData: null as DistribuidorType | null | undefined,
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
  reducers: {
    toggleDriverAddUpdate: (state, payload) => {
      state.editData = payload.payload
      state.isAddUpdateDrawerOpen = !state.isAddUpdateDrawerOpen
    },
  },
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

    builder.addCase(addDrivers.fulfilled, (state, action) => {
      state.data = [...state.data, ...action.payload]
    })
  },
})

export default appDriverSlice.reducer
export const { toggleDriverAddUpdate } = appDriverSlice.actions
