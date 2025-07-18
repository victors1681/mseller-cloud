// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Types Imports
import { BusinessType } from 'src/types/apps/businessType'
import { PaginatedResponse } from 'src/types/apps/response'
import restClient from 'src/configs/restClient'
import { AppDispatch, RootState } from '@/store'
import toast from 'react-hot-toast'

interface DataParams {
  query?: string
  dates?: Date[]
  pageNumber?: number
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export interface AxiosResponse<T> {
  data: T
}

// ** Fetch Business Data
export const fetchBusinessData = createAsyncThunk(
  'appBusiness/fetchData',
  async (params?: DataParams) => {
    const response = await restClient.get<
      any,
      AxiosResponse<PaginatedResponse<BusinessType>>
    >('/api/portal/DatosEmpresas', {
      params,
    })

    return {
      data: response.data.data || response.data,
      params,
      allData: [],
      pageNumber: response.data.pageNumber || 1,
      pageSize: response.data.pageSize || 10,
      totalPages: response.data.totalPages || 1,
      totalResults:
        response.data.totalResults ||
        (response.data.data ? response.data.data.length : 1),
      total: response.data.data ? response.data.data.length : 1,
      isLoading: false,
    }
  },
)

// ** Add Business Data
export const addBusinessData = createAsyncThunk<
  any,
  BusinessType,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appBusiness/addBusinessData',
  async (data: BusinessType, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await restClient.post<any>(
        '/api/portal/DatosEmpresas',
        data,
      )

      if (response.status === 200 || response.status === 201) {
        toast.success('Datos de empresa creados exitosamente')

        const state = getState()
        const params = state.business.params
        await dispatch(fetchBusinessData(params))

        return {
          success: true,
          data: response.data.data || response.data,
          message: 'Datos de empresa creados exitosamente',
        }
      }

      return rejectWithValue({
        message:
          response?.data?.message || 'Error creando los datos de empresa',
      })
    } catch (error) {
      console.error('Business data add error:', error)
      return rejectWithValue({
        message: 'Error inesperado creando los datos de empresa',
      })
    }
  },
)

// ** Update Business Data
export const updateBusinessData = createAsyncThunk<
  any,
  BusinessType,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appBusiness/updateBusinessData',
  async (data: BusinessType, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await restClient.put<any>(
        '/api/portal/DatosEmpresas',
        data,
      )

      if (response.status === 200) {
        toast.success('Datos de empresa actualizados exitosamente')

        const state = getState()
        const params = state.business.params
        await dispatch(fetchBusinessData(params))

        return {
          success: true,
          data: response.data.data || response.data,
          message: 'Datos de empresa actualizados exitosamente',
        }
      }

      return rejectWithValue({
        message:
          response?.data?.message || 'Error actualizando los datos de empresa',
      })
    } catch (error) {
      console.error('Business data update error:', error)
      return rejectWithValue({
        message: 'Error inesperado actualizando los datos de empresa',
      })
    }
  },
)

// ** Delete Business Data
export const deleteBusinessData = createAsyncThunk(
  'appBusiness/deleteData',
  async (id: string, { getState, dispatch }: Redux) => {
    try {
      const response = await restClient.delete('/api/portal/DatosEmpresas', {
        data: { id },
      })

      toast.success('Datos de empresa eliminados exitosamente')
      await dispatch(fetchBusinessData(getState().business.params))

      return response.data || {}
    } catch (error) {
      console.error('Business data delete error:', error)
      toast.error('Error eliminando los datos de empresa')
      throw error
    }
  },
)

export const appBusinessSlice = createSlice({
  name: 'appBusiness',
  initialState: {
    isAddUpdateDrawerOpen: false,
    editData: null as BusinessType | null | undefined,
    data: [] as BusinessType[],
    singleData: null as BusinessType | null,
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
    toggleBusinessAddUpdate: (state, payload) => {
      state.editData = payload.payload
      state.isAddUpdateDrawerOpen = !state.isAddUpdateDrawerOpen
    },
  },
  extraReducers: (builder) => {
    // Fetch Business Data
    builder.addCase(fetchBusinessData.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchBusinessData.rejected, (state, action) => {
      state.isLoading = false
      state.data = []
      state.total = 0
      state.pageNumber = 0
      state.pageSize = 0
      state.totalPages = 0
    })
    builder.addCase(fetchBusinessData.fulfilled, (state, action) => {
      state.data = Array.isArray(action.payload.data)
        ? action.payload.data
        : [action.payload.data]
      state.singleData = Array.isArray(action.payload.data)
        ? action.payload.data[0]
        : action.payload.data
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
      state.pageNumber = action.payload.pageNumber
      state.pageSize = action.payload.pageSize
      state.totalPages = action.payload.totalPages
      state.totalResults = action.payload.totalResults
      state.isLoading = false
    })

    // Add Business Data
    builder.addCase(addBusinessData.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(addBusinessData.fulfilled, (state, action) => {
      state.isLoading = false
      state.isAddUpdateDrawerOpen = false
      state.editData = null
    })
    builder.addCase(addBusinessData.rejected, (state, action) => {
      state.isLoading = false
    })

    // Update Business Data
    builder.addCase(updateBusinessData.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(updateBusinessData.fulfilled, (state, action) => {
      state.isLoading = false
      state.isAddUpdateDrawerOpen = false
      state.editData = null
    })
    builder.addCase(updateBusinessData.rejected, (state, action) => {
      state.isLoading = false
    })

    // Delete Business Data
    builder.addCase(deleteBusinessData.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(deleteBusinessData.fulfilled, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(deleteBusinessData.rejected, (state, action) => {
      state.isLoading = false
    })
  },
})

export default appBusinessSlice.reducer
export const { toggleBusinessAddUpdate } = appBusinessSlice.actions
