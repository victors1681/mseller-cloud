// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { DocumentoEntregaResponse, DocumentoEntregaResponseAxios, DocumentoEntregaType } from 'src/types/apps/transportType'

interface DataParams {
  noTransporte: string
  dates?: Date[]
  status?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch transports
export const fetchData = createAsyncThunk('appTransport/fetchData', async (params: DataParams) => {
  
  if(params.status === ''){
    delete params.status;
  }
  const response = await axios.get('/api/transport/transports', {
    params
  })


  return {
    transportData: response.data.transportes,
    params,
    allData: [],
    total: response.data.total,
    docsData: null
  }
})

export const deleteInvoice = createAsyncThunk(
  'appTransport/deleteData',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete('/apps/transport/delete', {
      data: id
    })
    await dispatch(fetchData(getState().transport.params))

    return response.data
  }
)

export const fetchTransportDocsData = createAsyncThunk(
  'appTransport/docs',
  async (noTransporte: number | string, { getState, dispatch }: Redux) => {
    
    const response = await axios.get<any, DocumentoEntregaResponseAxios>('/api/transport/transport-docs', {
      params: {noTransporte}
    })
    
    //await dispatch(fetchData(getState().transport.params))

    const currentState = getState().transports
    
    return {
      transportData: currentState.transportData,
      params: currentState.params,
      allData: [],
      total: currentState.total,
      docsData: response.data
    }
  }
)

export const apptransportslice = createSlice({
  name: 'appTransport',
  initialState: {
    transportData: [],
    total: 0,
    params: {},
    allData: [],
    docsData:  {
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
    } as DocumentoEntregaResponse | null
  },
  reducers: {},
  extraReducers: builder => {
    
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.transportData = action.payload.transportData
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total,
      state.docsData = null
    })

    builder.addCase(fetchTransportDocsData.fulfilled, (state, action) => {
      state.transportData = action.payload.transportData
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total,
      state.docsData = action.payload.docsData
    })
  }
})

export default apptransportslice.reducer
