// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import {
  RemoveDataType,
  RemoveDataCount,
  RemoveDataOptions,
} from 'src/types/apps/removeDataType'
import { PaginatedResponse } from 'src/types/apps/response'
import restClient from 'src/configs/restClient'
import { isAxiosError } from 'axios'

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

// ** Fetch PaymentTypes
export const fetchRemoveData = createAsyncThunk(
  'removeData/fetchData',
  async () => {
    const response = await restClient.get<
      any,
      AxiosResponse<RemoveDataCount[]>
    >('/api/portal/Utilidades/LimpiarDB')

    //transform into options

    const options: RemoveDataOptions[] = response.data.reduce(
      (acc: RemoveDataOptions[], curr: RemoveDataCount) => {
        return [
          ...acc,
          { label: `[${curr.count}]-${curr.action}`, value: curr.action },
        ]
      },
      [],
    )

    return {
      data: options,
      isLoading: false,
    }
  },
)

export const clearTable = createAsyncThunk(
  'removeData/deleteApiKey',
  async (values: RemoveDataType[], { getState, dispatch }: Redux) => {
    try {
      const response = await restClient.delete<any, any>(
        '/api/portal/Utilidades/LimpiarDB',
        { data: values },
      )

      if (response.status === 200) {
        // Dispatch additional actions only on successful cleanup
        await dispatch(fetchRemoveData())

        return { error: false, message: 'Limpieza completada' }
      }

      return { error: true, message: response?.message || 'Error desconocido' }
    } catch (err: any) {
      // Handle Axios or network-related errors
      console.error('Axios error: ', err)

      const errorMessage =
        err?.response?.data?.message ||
        'Error en la conexión. Por favor intente nuevamente.'

      return { error: true, message: errorMessage }
    }
  },
)

export const apiKeysSlice = createSlice({
  name: 'apiKeys',
  initialState: {
    data: [] as RemoveDataOptions[],
    isLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRemoveData.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchRemoveData.rejected, (state, action) => {
      state.isLoading = false
      state.data = []
    })
    builder.addCase(fetchRemoveData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.isLoading = false
    })
  },
})

export default apiKeysSlice.reducer
