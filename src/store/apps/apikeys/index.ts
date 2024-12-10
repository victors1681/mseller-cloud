// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import { ApiKeyType, ApiKeyPostType } from 'src/types/apps/apyKeyTypes'
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

export const addApiKey = createAsyncThunk(
  'apiKeys/addApiKey',
  async (sellers: ApiKeyPostType, { dispatch }: Redux) => {
    try {
      const response = await restClient.post('/api/portal/ApiKey', sellers)

      if (response.status !== 200) {
        return null
      }

      const data = await dispatch(fetchApiKeys())
      console.log('DATAAA', data)
      return response.data
    } catch (err) {
      return null
    }
  },
)

// ** Fetch PaymentTypes
export const fetchApiKeys = createAsyncThunk(
  'apiKeys/fetchApiKeys',
  async (params?: DataParams) => {
    const response = await restClient.get<any, AxiosResponse<ApiKeyType[]>>(
      '/api/portal/ApiKey',
      {
        params,
      },
    )

    return {
      data: response.data,
      params,
      isLoading: false,
    }
  },
)

export const deletePaymentType = createAsyncThunk(
  'apiKeys/deleteApiKey',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.delete('/app/portal/ApiKey', {
      data: id,
    })
    await dispatch(fetchApiKeys(getState().PaymentType.params))

    return response.data
  },
)

export const apiKeysSlice = createSlice({
  name: 'apiKeys',
  initialState: {
    data: [] as ApiKeyType[],
    isLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchApiKeys.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchApiKeys.rejected, (state, action) => {
      state.isLoading = false
      state.data = []
    })
    builder.addCase(fetchApiKeys.fulfilled, (state, action) => {
      state.data = [...state.data, ...action.payload.data]
      state.isLoading = false
    })
  },
})

export default apiKeysSlice.reducer
