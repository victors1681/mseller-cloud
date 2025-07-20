// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import {
  TurnoType,
  AbrirTurnoRequest,
  CerrarTurnoRequest,
  MovimientoTurnoRequest,
  AprobacionTurnoRequest,
  MovimientoType,
  AprobacionType,
} from 'src/types/apps/posType'
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

// ** Abrir Turno
export const abrirTurno = createAsyncThunk<
  any,
  AbrirTurnoRequest,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appPos/abrirTurno',
  async (data: AbrirTurnoRequest, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await restClient.post<any>(
        '/api/portal/Pos/turno/abrir',
        data,
      )

      if (response.status === 200) {
        toast.success('Turno abierto exitosamente')

        // Refresh current turno
        await dispatch(fetchTurnoActual())

        return {
          success: true,
          data: response.data.data,
          message: 'Turno abierto exitosamente',
        }
      }

      return rejectWithValue({
        message: response?.data?.message || 'Error abriendo turno',
      })
    } catch (error) {
      console.error('Abrir turno error:', error)
      return rejectWithValue({
        message: 'Error inesperado abriendo turno',
      })
    }
  },
)

// ** Cerrar Turno
export const cerrarTurno = createAsyncThunk<
  any,
  CerrarTurnoRequest,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appPos/cerrarTurno',
  async (data: CerrarTurnoRequest, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await restClient.post<any>(
        '/api/portal/Pos/turno/cerrar',
        data,
      )

      if (response.status === 200) {
        toast.success('Turno cerrado exitosamente')

        // Refresh current turno
        await dispatch(fetchTurnoActual())

        return {
          success: true,
          data: response.data.data,
          message: 'Turno cerrado exitosamente',
        }
      }

      return rejectWithValue({
        message: response?.data?.message || 'Error cerrando turno',
      })
    } catch (error) {
      console.error('Cerrar turno error:', error)
      return rejectWithValue({
        message: 'Error inesperado cerrando turno',
      })
    }
  },
)

// ** Crear Movimiento
export const crearMovimiento = createAsyncThunk<
  any,
  MovimientoTurnoRequest,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appPos/crearMovimiento',
  async (
    data: MovimientoTurnoRequest,
    { dispatch, getState, rejectWithValue },
  ) => {
    try {
      const response = await restClient.post<any>(
        '/api/portal/Pos/turno/movimiento',
        data,
      )

      if (response.status === 200) {
        toast.success('Movimiento creado exitosamente')

        // Refresh movimientos for the turno
        await dispatch(fetchMovimientos(data.idTurno))

        return {
          success: true,
          data: response.data.data,
          message: 'Movimiento creado exitosamente',
        }
      }

      return rejectWithValue({
        message: response?.data?.message || 'Error creando movimiento',
      })
    } catch (error) {
      console.error('Crear movimiento error:', error)
      return rejectWithValue({
        message: 'Error inesperado creando movimiento',
      })
    }
  },
)

// ** Crear Aprobación
export const crearAprobacion = createAsyncThunk<
  any,
  AprobacionTurnoRequest,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: { message: string }
  }
>(
  'appPos/crearAprobacion',
  async (
    data: AprobacionTurnoRequest,
    { dispatch, getState, rejectWithValue },
  ) => {
    try {
      const response = await restClient.post<any>(
        '/api/portal/Pos/turno/aprobacion',
        data,
      )

      if (response.status === 200) {
        toast.success('Aprobación procesada exitosamente')

        // Refresh aprobaciones for the turno
        await dispatch(fetchAprobaciones(data.idTurno))

        return {
          success: true,
          data: response.data.data,
          message: 'Aprobación procesada exitosamente',
        }
      }

      return rejectWithValue({
        message: response?.data?.message || 'Error procesando aprobación',
      })
    } catch (error) {
      console.error('Crear aprobación error:', error)
      return rejectWithValue({
        message: 'Error inesperado procesando aprobación',
      })
    }
  },
)

// ** Fetch Turno Actual
export const fetchTurnoActual = createAsyncThunk(
  'appPos/fetchTurnoActual',
  async () => {
    const response = await restClient.get<any, AxiosResponse<TurnoType>>(
      '/api/portal/Pos/turno/actual',
    )

    return {
      data: response.data,
      isLoading: false,
    }
  },
)

// ** Fetch Turnos por Vendedor
export const fetchTurnosByVendedor = createAsyncThunk(
  'appPos/fetchTurnosByVendedor',
  async (codigoVendedor: string) => {
    const response = await restClient.get<any, AxiosResponse<TurnoType[]>>(
      `/api/portal/Pos/turnos/${codigoVendedor}`,
    )

    return {
      data: response.data,
      isLoading: false,
    }
  },
)

// ** Fetch Movimientos por Turno
export const fetchMovimientos = createAsyncThunk(
  'appPos/fetchMovimientos',
  async (idTurno: string) => {
    const response = await restClient.get<any, AxiosResponse<MovimientoType[]>>(
      `/api/portal/Pos/turno/${idTurno}/movimientos`,
    )

    return {
      data: response.data,
      idTurno,
      isLoading: false,
    }
  },
)

// ** Fetch Aprobaciones por Turno
export const fetchAprobaciones = createAsyncThunk(
  'appPos/fetchAprobaciones',
  async (idTurno: string) => {
    const response = await restClient.get<any, AxiosResponse<AprobacionType[]>>(
      `/api/portal/Pos/turno/${idTurno}/aprobaciones`,
    )

    return {
      data: response.data,
      idTurno,
      isLoading: false,
    }
  },
)

export const appPosSlice = createSlice({
  name: 'appPos',
  initialState: {
    // Turno Actual
    turnoActual: null as TurnoType | null,
    isTurnoActualLoading: false,

    // Turnos por Vendedor
    turnosByVendedor: [] as TurnoType[],
    isTurnosByVendedorLoading: false,

    // Movimientos
    movimientos: [] as MovimientoType[],
    isMovimientosLoading: false,
    currentTurnoIdForMovimientos: null as string | null,

    // Aprobaciones
    aprobaciones: [] as AprobacionType[],
    isAprobacionesLoading: false,
    currentTurnoIdForAprobaciones: null as string | null,

    // UI State
    isAbrirTurnoModalOpen: false,
    isCerrarTurnoModalOpen: false,
    isMovimientoModalOpen: false,
    isAprobacionModalOpen: false,

    // Selected data for modals
    selectedTurno: null as TurnoType | null,
  },
  reducers: {
    toggleAbrirTurnoModal: (state, action) => {
      state.isAbrirTurnoModalOpen = !state.isAbrirTurnoModalOpen
    },
    toggleCerrarTurnoModal: (state, action) => {
      state.selectedTurno = action.payload
      state.isCerrarTurnoModalOpen = !state.isCerrarTurnoModalOpen
    },
    toggleMovimientoModal: (state, action) => {
      state.selectedTurno = action.payload
      state.isMovimientoModalOpen = !state.isMovimientoModalOpen
    },
    toggleAprobacionModal: (state, action) => {
      state.selectedTurno = action.payload
      state.isAprobacionModalOpen = !state.isAprobacionModalOpen
    },
    clearSelectedTurno: (state) => {
      state.selectedTurno = null
    },
  },
  extraReducers: (builder) => {
    // Turno Actual
    builder.addCase(fetchTurnoActual.pending, (state) => {
      state.isTurnoActualLoading = true
    })
    builder.addCase(fetchTurnoActual.rejected, (state) => {
      state.isTurnoActualLoading = false
      state.turnoActual = null
    })
    builder.addCase(fetchTurnoActual.fulfilled, (state, action) => {
      state.turnoActual = action.payload.data
      state.isTurnoActualLoading = false
    })

    // Turnos por Vendedor
    builder.addCase(fetchTurnosByVendedor.pending, (state) => {
      state.isTurnosByVendedorLoading = true
    })
    builder.addCase(fetchTurnosByVendedor.rejected, (state) => {
      state.isTurnosByVendedorLoading = false
      state.turnosByVendedor = []
    })
    builder.addCase(fetchTurnosByVendedor.fulfilled, (state, action) => {
      state.turnosByVendedor = action.payload.data
      state.isTurnosByVendedorLoading = false
    })

    // Movimientos
    builder.addCase(fetchMovimientos.pending, (state) => {
      state.isMovimientosLoading = true
    })
    builder.addCase(fetchMovimientos.rejected, (state) => {
      state.isMovimientosLoading = false
      state.movimientos = []
    })
    builder.addCase(fetchMovimientos.fulfilled, (state, action) => {
      state.movimientos = action.payload.data
      state.currentTurnoIdForMovimientos = action.payload.idTurno
      state.isMovimientosLoading = false
    })

    // Aprobaciones
    builder.addCase(fetchAprobaciones.pending, (state) => {
      state.isAprobacionesLoading = true
    })
    builder.addCase(fetchAprobaciones.rejected, (state) => {
      state.isAprobacionesLoading = false
      state.aprobaciones = []
    })
    builder.addCase(fetchAprobaciones.fulfilled, (state, action) => {
      state.aprobaciones = action.payload.data
      state.currentTurnoIdForAprobaciones = action.payload.idTurno
      state.isAprobacionesLoading = false
    })

    // Async actions that modify state
    builder.addCase(abrirTurno.fulfilled, (state) => {
      state.isAbrirTurnoModalOpen = false
    })

    builder.addCase(cerrarTurno.fulfilled, (state) => {
      state.isCerrarTurnoModalOpen = false
      state.selectedTurno = null
    })

    builder.addCase(crearMovimiento.fulfilled, (state) => {
      state.isMovimientoModalOpen = false
      state.selectedTurno = null
    })

    builder.addCase(crearAprobacion.fulfilled, (state) => {
      state.isAprobacionModalOpen = false
      state.selectedTurno = null
    })
  },
})

export default appPosSlice.reducer
export const {
  toggleAbrirTurnoModal,
  toggleCerrarTurnoModal,
  toggleMovimientoModal,
  toggleAprobacionModal,
  clearSelectedTurno,
} = appPosSlice.actions
