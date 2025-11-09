// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'

// ** Axios Imports
import { isAxiosError } from 'axios'
import toast from 'react-hot-toast'
import restClient from 'src/configs/restClient'
import { PaginatedResponse } from 'src/types/apps/response'
import {
  DocumentoEntregaResponse,
  DocumentoEntregaResponseAxios,
  DocumentoEntregaType,
  TransporteListType,
} from 'src/types/apps/transportType'
import { getDateParam } from 'src/utils/getDateParam'
import { TransportStatusEnum } from 'src/utils/transportMappings'

export interface DataParams {
  query: string
  dates?: Date[]
  status?: string
  procesado?: string
  pageNumber?: number
  distribuidores?: string
  localidad?: string
}

export interface AxiosResponse<T> {
  data: T
}
interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch transports
export const fetchData = createAsyncThunk(
  'appTransport/fetchData',
  async (params: DataParams) => {
    if (params.status === '') {
      delete params.status
    }
    const response = await restClient.get<
      any,
      AxiosResponse<PaginatedResponse<TransporteListType>>
    >('/api/portal/Transporte', {
      params: {
        ...params,
        ...getDateParam(params.dates),
      },
    })

    return {
      transportData: response.data.data,
      params,
      allData: [],
      docsData: null,
      total: response.data.data.length,
      pageNumber: response.data.pageNumber,
      pageSize: response.data.pageSize,
      totalPages: response.data.totalPages,
      totalResults: response.data.totalResults,
      isLoading: false,
    }
  },
)

interface TransportStatusPayload {
  transportNo: string
  status: TransportStatusEnum
}

export const changeTransportStatus = createAsyncThunk(
  'appTransport/changeStatus',
  async (data: TransportStatusPayload, { getState, dispatch }: Redux) => {
    try {
      const payload = {
        noTransporte: data.transportNo,
        status: data.status,
      }
      const response = await restClient.put(
        `/api/portal/Transporte/UpdateStatus?NoTransporte=${payload.noTransporte}&status=${payload.status}`,
      )

      if (response.status === 200) {
        dispatch(apptransportslice.actions.updateTransportStatus(payload))
        toast.success(response.data)
      } else {
        throw new Error(response?.data?.message)
      }
    } catch (err) {
      toast.error(
        `Error al actualizar el transporte: ${data.transportNo} con el status: ${data.status}`,
      )
    }
  },
)

export const deleteInvoice = createAsyncThunk(
  'appTransport/deleteData',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.delete('/apps/transport/delete', {
      data: id,
    })
    await dispatch(fetchData(getState().transport.params))

    return response.data
  },
)

export const forceCloseTransport = createAsyncThunk(
  'appTransport/closeTransport',
  async (transportNo: number | string, { getState, dispatch }: Redux) => {
    try {
      const payload = {
        noTransporte: transportNo,
        status: TransportStatusEnum.Recibido,
      }

      const response = await restClient.put(
        `/api/portal/Transporte/ForzarCierre?noTransporte=${transportNo}`,
      )

      if (response.status === 200) {
        dispatch(apptransportslice.actions.updateTransportStatus(payload))
        toast.success(response?.data?.message)
      } else {
        throw new Error(response?.data?.message)
      }

      return response.data
    } catch (err) {
      toast.error(`Error al forzar cierre del transporte: ${transportNo}`)
    }
  },
)

export const deliveryReport = async (
  noTransporte?: string,
  codigoVendedor?: string,
  localidades?: string,
  distribuidores?: string,
  fechaRango?: string,
  promocionesOnly?: boolean,
) => {
  const params: Record<string, any> = {}

  if (noTransporte) params.noTransporte = noTransporte
  if (codigoVendedor) params.codigoVendedor = codigoVendedor
  if (localidades) params.localidades = localidades
  if (distribuidores) params.distribuidores = distribuidores
  if (fechaRango) params.fechaRango = fechaRango
  if (promocionesOnly !== undefined) params.promocionesOnly = promocionesOnly

  const response = await restClient.get(
    '/api/portal/Transporte/ReporteEntrega',
    { params },
  )
  return response.data
}

export const deliveryReportAmount = async (
  noTransporte: string,
  paymentType?: string,
  sellerCode?: string,
  customerType?: string,
) => {
  let filter = {}
  if (paymentType) {
    Object.assign(filter, { TipoPago: paymentType })
  }
  if (sellerCode) {
    Object.assign(filter, { CodigoVendedor: sellerCode })
  }
  if (customerType) {
    Object.assign(filter, { TipoCliente: customerType })
  }

  const response = await restClient.get(
    `/api/portal/Transporte/ReporteEntregaMontos`,
    {
      params: {
        noTransporte,
        ...filter,
      },
    },
  )
  return response.data
}

export const deliveryReportAmountV2 = async (
  noTransporte: string,
  paymentType?: string,
  sellerCode?: string,
  customerType?: string,
  localidades?: string,
  distribuidores?: string,
  fechaRango?: string,
) => {
  let filter: Record<string, any> = {}

  if (noTransporte) {
    filter.noTransporte = noTransporte
  }
  if (paymentType) {
    filter.TipoPago = paymentType
  }
  if (sellerCode) {
    filter.CodigoVendedor = sellerCode
  }
  if (customerType) {
    filter.TipoCliente = customerType
  }
  if (localidades) {
    filter.localidades = localidades
  }
  if (distribuidores) {
    filter.distribuidores = distribuidores
  }
  if (fechaRango) {
    filter.fechaRango = fechaRango
  }

  const response = await restClient.get(
    `/api/portal/Transporte/v2/ReporteEntregaMontos`,
    {
      params: {
        ...filter,
      },
    },
  )
  return response.data
}

export const fetchTransportDocsData = createAsyncThunk(
  'appTransport/docs',
  async (noTransporte: number | string, { getState, dispatch }: Redux) => {
    const response = await restClient.get<any, DocumentoEntregaResponseAxios>(
      '/api/portal/Transporte/DocumentosEntrega',
      {
        params: { noTransporte },
      },
    )

    //await dispatch(fetchData(getState().transport.params))

    const currentState = getState().transports

    return {
      transportData: currentState.transportData,
      params: currentState.params,
      allData: [],
      total: currentState.total,
      docsData: response.data,
    }
  },
)

// ** Retry ECF Generation for Transport
export const retryEcfGeneration = createAsyncThunk(
  'appTransport/retryEcf',
  async (noTransporte: number | string, { rejectWithValue }) => {
    try {
      const response = await restClient.post(
        `/api/portal/Transporte/ReintentarEcf?noTransporte=${noTransporte}`,
      )

      // Only show success if response is actually successful (2xx status)
      if (response.status >= 200 && response.status < 300) {
        toast.success('ECF regeneration initiated successfully')
        return response.data
      } else {
        // Handle non-2xx responses as errors
        const message =
          response.data?.message ||
          response.data?.title ||
          'Error al reintentar generación de ECF'
        toast.error(message)
        return rejectWithValue(message)
      }
    } catch (error) {
      if (isAxiosError(error)) {
        // Get error message from response or use generic message
        const message =
          error.response?.data?.message ||
          error.response?.data?.title ||
          'Error al reintentar generación de ECF'

        toast.error(message)
        return rejectWithValue(message)
      }

      // Network or other non-HTTP errors
      const message = 'Error de conexión: Verifique su conexión a internet'
      toast.error(message)
      return rejectWithValue(message)
    }
  },
)

export const apptransportslice = createSlice({
  name: 'appTransport',
  initialState: {
    transportData: [] as TransporteListType[],
    pageNumber: 0,
    pageSize: 0,
    totalPages: 0,
    totalResults: 0,
    total: 0,
    isLoading: true,
    params: {},
    allData: [],
    docsData: {
      noTransporte: '',
      localidadId: 0,
      codigoDistribuidor: '',
      fecha: '',
      documentos: [] as DocumentoEntregaType[],
      distribuidor: {},
      procesado: false,
      status: 0,
      entregadas: 0,
      noEntregadas: 0,
      entregarDespues: 0,
      efectivo: 0,
      cheque: 0,
      transferencia: 0,
      credito: 0,
      neto: 0,
    } as DocumentoEntregaResponse | null,
  },
  reducers: {
    updateTransportStatus: (state, action) => {
      const payload = action.payload
      const index = state.transportData.findIndex(
        (f) => f.noTransporte === payload.noTransporte,
      )

      if (index > -1) {
        state.transportData[index].status = payload.status
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchData.rejected, (state, action) => {
      state.isLoading = false
      state.transportData = []
      state.total = 0
      state.pageNumber = 0
      state.pageSize = 0
      state.totalPages = 0
    })

    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.transportData = action.payload.transportData
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
      state.pageNumber = action.payload.pageNumber
      state.pageSize = action.payload.pageSize
      state.totalPages = action.payload.totalPages
      state.totalResults = action.payload.totalResults
      state.isLoading = false
    })

    builder.addCase(fetchTransportDocsData.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchTransportDocsData.rejected, (state, action) => {
      state.isLoading = false
    })

    builder.addCase(fetchTransportDocsData.fulfilled, (state, action) => {
      state.transportData = action.payload.transportData
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
      state.docsData = action.payload.docsData
      state.isLoading = false
    })

    builder.addCase(retryEcfGeneration.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(retryEcfGeneration.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(retryEcfGeneration.fulfilled, (state, action) => {
      state.isLoading = false
    })
  },
})

export default apptransportslice.reducer
