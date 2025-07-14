// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import { LegacyOfferType } from 'src/types/apps/offerType'
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

export const addUpdateLegacyOffer = createAsyncThunk<
  any,
  LegacyOfferType,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appOffers/addUpdateLegacyOffer',
  async (data: LegacyOfferType, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await restClient.put<any>('/api/portal/Legacy Offer', data)

      if (response.status === 200) {
        toast.success('Legacy Offer actualizado exitosamente')

        const state = getState()
        const params = state.paymentTypes.params
        await dispatch(fetchLegacyOffer(params))

        return {
          success: true,
          data: response.data.data,
          message: 'Legacy Offer actualizado exitosamente',
        }
      }

      return rejectWithValue({
        message: response?.data?.message || 'Error actualizando Legacy Offer',
      })
    } catch (error) {
      console.error('Legacy Offer type error:', error)
      return rejectWithValue({
        message: 'Error inesperado actualizando la Legacy Offer',
      })
    }
  },
)

export const addLegacyOffer = createAsyncThunk(
  'appOffers/addLegacyOffer',
  async (legacyOffer: LegacyOfferType, { dispatch, getState }: Redux) => {
    const response = await restClient.put('/api/portal/OfertaLegada', legacyOffer)

    const state = getState()
    const params = state.appOffers.params

    await dispatch(fetchLegacyOffer(params))

    return response.data
  },
)

// ** Fetch PaymentTypes
export const fetchLegacyOffer = createAsyncThunk(
  'appOffers/fetchLegacyOffer',
  async (params?: DataParams) => {
    const response = await restClient.get<
      any,
      AxiosResponse<PaginatedResponse<LegacyOfferType>>
    >('/api/portal/OfertaLegada', {
      params,
    })

    return {
      legacyOfferData: response.data.data,
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

export const deleteLegacyOffer = createAsyncThunk(
  'appOffers/deleteLegacyOffer',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.delete('/apps/LegacyOffer', {
      data: id,
    })
    await dispatch(fetchLegacyOffer(getState().PaymentType.params))

    return response.data
  },
)

export const appOffersSlice = createSlice({
  name: 'appOffers',
  initialState: {
    isAddUpdateDrawerOpen: false,
    legacyOfferEditData: null as LegacyOfferType | null | undefined,
    legacyOfferData: [] as LegacyOfferType[],
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
    toggleAddUpdateLegacyOffer: (state, payload) => {
      state.legacyOfferEditData = payload.payload
      state.isAddUpdateDrawerOpen = !state.isAddUpdateDrawerOpen
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLegacyOffer.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchLegacyOffer.rejected, (state, action) => {
      state.isLoading = false
      state.legacyOfferData = []
      state.total = 0
      state.pageNumber = 0
      state.pageSize = 0
      state.totalPages = 0
    })
    builder.addCase(fetchLegacyOffer.fulfilled, (state, action) => {
      state.legacyOfferData = action.payload.legacyOfferData
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
      state.pageNumber = action.payload.pageNumber
      state.pageSize = action.payload.pageSize
      state.totalPages = action.payload.totalPages
      ;(state.totalResults = action.payload.totalResults),
        (state.isLoading = false)
    })

    builder.addCase(addLegacyOffer.fulfilled, (state, action) => {
      state.legacyOfferData = [...state.legacyOfferData, ...action.payload]
    })
  },
})

export default appOffersSlice.reducer
export const { toggleAddUpdateLegacyOffer } = appOffersSlice.actions
