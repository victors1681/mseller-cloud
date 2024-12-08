// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import {
  ClientDetailType,
  CustomerDetailState,
  CustomerType,
} from 'src/types/apps/customerType'
import { PaginatedResponse } from 'src/types/apps/response'
import restClient from 'src/configs/restClient'
import { AppDispatch, RootState } from '@/store'
import toast from 'react-hot-toast'

interface DataParams {
  query: string
  dates?: Date[]
  procesado?: string
  pageNumber: number
  vendedor?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export interface AxiosResponse<T> {
  data: T
}

interface UpdateCustomerResponse {
  success: boolean
  data: CustomerType
  message: string
}

export const addOrUpdateCustomer = createAsyncThunk<
  UpdateCustomerResponse,
  CustomerType,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appClient/updateCustomer',
  async (product: CustomerType, { dispatch, getState, rejectWithValue }) => {
    try {
      if (!product.codigo || !product.nombre) {
        return rejectWithValue({
          message: 'Código y nombre son requeridos',
        })
      }

      const response = await restClient.put<UpdateCustomerResponse>(
        '/api/portal/Cliente',
        product,
      )

      if (response.status === 200) {
        toast.success('Producto actualizado exitosamente')

        return {
          success: true,
          data: response.data.data,
          message: 'Producto actualizado exitosamente',
        }
      }

      return rejectWithValue({
        message: response.data.message || 'Error actualizando producto',
      })
    } catch (error) {
      console.error('Update product error:', error)
      return rejectWithValue({
        message: 'Error inesperado actualizando producto',
      })
    }
  },
)

export const fetchCustomer = createAsyncThunk(
  'appClient/client',
  async (id: string, { dispatch, getState }: Redux) => {
    const state = getState()
    try {
      const response = await restClient.get<
        { codigoCliente: string },
        AxiosResponse<ClientDetailType>
      >('/api/portal/Cliente/detalle', {
        params: {
          codigoCliente: id,
        },
      })

      //await dispatch(fetchData(params))
      return {
        client: response.data.cliente,
        cities: response.data.ciudades,
        customerType: response.data.tipoClientes,
        states: response.data.estados,
        postalCodes: response.data.codigoPostales,
        countries: response.data.paises,
        classifications: response.data.clasificaciones,
        ncfs: response.data.ncfs,
        isLoading: false,
      }
    } catch (error) {
      throw new Error('Error al obtener el detalle del producto')
    }
  },
)

export const addClients = createAsyncThunk(
  'appClient/addClients',
  async (clients: CustomerType[], { dispatch, getState }: Redux) => {
    const response = await restClient.post('/api/portal/Cliente', clients)
    const state = getState()
    const params = state.appSeller.params

    await dispatch(fetchData(params))

    return response.data
  },
)

// ** Fetch Clients
export const fetchData = createAsyncThunk(
  'appClient/fetchData',
  async (params: DataParams) => {
    if (params.procesado === '') {
      delete params.procesado
    }
    const response = await restClient.get<
      any,
      AxiosResponse<PaginatedResponse<CustomerType>>
    >('/api/portal/Cliente', {
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

export const deleteClient = createAsyncThunk(
  'appClient/deleteData',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.delete('/api/portal/Cliente', {
      data: id,
    })
    await dispatch(fetchData(getState().Client.params))

    return response.data
  },
)

export const appClientSlice = createSlice({
  name: 'appClient',
  initialState: {
    data: [] as CustomerType[],
    params: {},
    allData: [],
    pageNumber: 0,
    pageSize: 0,
    totalPages: 0,
    totalResults: 0,
    total: 0,
    isLoading: true,
    customerDetail: {
      client: null,
      cities: [],
      customerType: [],
      states: [],
      postalCodes: [],
      countries: [],
      classifications: [],
      ncfs: [],
    } as unknown as CustomerDetailState,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchData.rejected, (state, action) => {
      state.isLoading = false
      state.data = []
      state.total = 0
      state.pageNumber = 0
      state.pageSize = 0
      state.totalPages = 0
    })
    builder.addCase(fetchData.fulfilled, (state, action) => {
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

    builder.addCase(addClients.fulfilled, (state, action) => {
      state.data = [...state.data, ...action.payload]
    })

    builder.addCase(fetchCustomer.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchCustomer.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(fetchCustomer.fulfilled, (state, action) => {
      state.isLoading = false
      state.customerDetail = {
        client: action.payload.client,
        cities: action.payload.cities,
        customerType: action.payload.customerType,
        states: action.payload.states,
        postalCodes: action.payload.postalCodes,
        countries: action.payload.countries,
        classifications: action.payload.classifications,
        ncfs: action.payload.ncfs || [],
      }
      state.isLoading = false
    })
  },
})

export default appClientSlice.reducer
