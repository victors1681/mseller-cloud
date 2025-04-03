// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios, { isAxiosError } from 'axios'
import {
  DocumentoEntregaResponse,
  DocumentoEntregaResponseAxios,
  DocumentoEntregaType,
  PaymentTypeEnum,
  TransporteListType,
} from 'src/types/apps/transportType'
import { PaginatedResponse } from 'src/types/apps/response'
import { getDateParam } from 'src/utils/getDateParam'
import restClient from 'src/configs/restClient'
import { TransportStatusEnum } from 'src/utils/transportMappings'
import toast from 'react-hot-toast'

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
  },
})

export default apptransportslice.reducer
