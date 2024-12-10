// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { LocationType } from 'src/types/apps/locationType'
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

export const addUpdateLocationType = createAsyncThunk<
  any,
  LocationType,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appSeller/addUpdateLocalidadType',
  async (data: LocationType, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await restClient.put<any>('/api/portal/Localidad', data)

      if (response.status === 200) {
        toast.success('Localidad actualizada exitosamente')

        const state = getState()
        const params = state.paymentTypes.params
        await dispatch(fetchLocations(params))

        return {
          success: true,
          data: response.data.data,
          message: 'Localidad actualizada exitosamente',
        }
      }

      return rejectWithValue({
        message:
          response?.data?.message || 'Error actualizanda sucursal o ya existe',
      })
    } catch (error) {
      console.error('Localidad type error:', error)
      return rejectWithValue({
        message: 'Error inesperado actualizando la sucursal o ya existe',
      })
    }
  },
)

export const addLocation = createAsyncThunk(
  'appSeller/addLocation',
  async (locations: LocationType[], { dispatch, getState }: Redux) => {
    const response = await restClient.post('/api/portal/Localidad', locations)

    const state = getState()
    const params = state.appSeller.params

    await dispatch(fetchLocations(params))

    return response.data || {}
  },
)

// ** Fetch Locations
export const fetchLocations = createAsyncThunk(
  'appLocation/fetchData',
  async (params?: DataParams) => {
    const response = await restClient.get<
      any,
      AxiosResponse<PaginatedResponse<LocationType>>
    >('/api/portal/Localidad', {
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

export const deleteLocation = createAsyncThunk(
  'appLocation/deleteData',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.delete('/apps/Location/delete', {
      data: id,
    })
    await dispatch(fetchLocations(getState().Location.params))

    return response.data || {}
  },
)

export const appLocationSlice = createSlice({
  name: 'appLocation',
  initialState: {
    isAddUpdateDrawerOpen: false,
    editData: null as LocationType | null | undefined,
    data: [] as LocationType[],
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
    toggleLocationAddUpdate: (state, payload) => {
      state.editData = payload.payload
      state.isAddUpdateDrawerOpen = !state.isAddUpdateDrawerOpen
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLocations.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchLocations.rejected, (state, action) => {
      state.isLoading = false
      state.data = []
      state.total = 0
      state.pageNumber = 0
      state.pageSize = 0
      state.totalPages = 0
    })
    builder.addCase(fetchLocations.fulfilled, (state, action) => {
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
    builder.addCase(addLocation.fulfilled, (state, action) => {
      state.data = [...state.data, ...action.payload]
    })
  },
})

export default appLocationSlice.reducer
export const { toggleLocationAddUpdate } = appLocationSlice.actions
