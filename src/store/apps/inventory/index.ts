// ** Redux Imports
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** RestClient
import restClient from 'src/configs/restClient'

// ** Types
import {
  CrearReconciliacionRequest,
  CrearSnapshotRequest,
  InventarioAnalytics,
  InventarioConteoDTO,
  InventarioFilters,
  InventarioReconciliacionDTO,
  InventarioSnapshotDTO,
  LocalidadDTO,
  PlanificarConteoRequest,
  ReporteDiscrepancia,
  UsuarioEstadisticas,
} from 'src/types/apps/inventoryTypes'

interface InventoryState {
  // Conteos
  conteos: InventarioConteoDTO[]
  selectedConteo: InventarioConteoDTO | null

  // Snapshots
  snapshots: InventarioSnapshotDTO[]
  selectedSnapshot: InventarioSnapshotDTO | null

  // Reconciliaciones
  reconciliaciones: InventarioReconciliacionDTO[]
  reconciliacionesPendientes: InventarioReconciliacionDTO[]

  // Analytics y reportes
  analytics: InventarioAnalytics | null
  discrepancias: ReporteDiscrepancia[]
  usuarioEstadisticas: UsuarioEstadisticas[]

  // Localidades
  localidades: LocalidadDTO[]
  selectedLocalidad: LocalidadDTO | null

  // UI State
  loading: boolean
  error: string | null
  filters: InventarioFilters

  // Usuarios activos
  usuariosActivos: string[]
}

const initialState: InventoryState = {
  conteos: [],
  selectedConteo: null,
  snapshots: [],
  selectedSnapshot: null,
  reconciliaciones: [],
  reconciliacionesPendientes: [],
  analytics: null,
  discrepancias: [],
  usuarioEstadisticas: [],
  localidades: [],
  selectedLocalidad: null,
  loading: false,
  error: null,
  filters: {},
  usuariosActivos: [],
}

// ** Async Thunks - Conteos
export const fetchConteos = createAsyncThunk(
  'inventory/fetchConteos',
  async (params: {
    localidadId: number
    filters?: Partial<InventarioFilters>
  }) => {
    let url = `/api/portal/Inventario/localidad/${params.localidadId}/conteos`

    const searchParams = new URLSearchParams()
    if (params.filters?.fechaDesde)
      searchParams.append('desde', params.filters.fechaDesde)
    if (params.filters?.fechaHasta)
      searchParams.append('hasta', params.filters.fechaHasta)
    if (params.filters?.estado)
      searchParams.append('estado', params.filters.estado)

    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`
    }

    const response = await restClient.get(url)
    return response.data
  },
)

export const fetchConteo = createAsyncThunk(
  'inventory/fetchConteo',
  async (conteoId: number) => {
    const response = await restClient.get(
      `/api/portal/Inventario/conteo/${conteoId}`,
    )
    return response.data
  },
)

export const planificarConteo = createAsyncThunk(
  'inventory/planificarConteo',
  async (request: PlanificarConteoRequest) => {
    const response = await restClient.post(
      '/api/portal/Inventario/conteo/planificar',
      request,
    )
    return response.data
  },
)

export const iniciarConteo = createAsyncThunk(
  'inventory/iniciarConteo',
  async (params: { conteoId: number; usuario: string }) => {
    const response = await restClient.post(
      `/api/portal/Inventario/conteo/${params.conteoId}/iniciar`,
      {
        usuario: params.usuario,
      },
    )
    return response.data
  },
)

export const completarConteo = createAsyncThunk(
  'inventory/completarConteo',
  async (params: { conteoId: number; usuario: string }) => {
    const response = await restClient.post(
      `/api/portal/Inventario/conteo/${params.conteoId}/completar`,
      {
        usuario: params.usuario,
      },
    )
    return response.data
  },
)

export const cancelarConteo = createAsyncThunk(
  'inventory/cancelarConteo',
  async (params: { conteoId: number; usuario: string; motivo: string }) => {
    const response = await restClient.post(
      `/api/portal/Inventario/conteo/${params.conteoId}/cancelar`,
      {
        usuario: params.usuario,
        motivo: params.motivo,
      },
    )
    return response.data
  },
)

// ** Async Thunks - Snapshots
export const fetchSnapshots = createAsyncThunk(
  'inventory/fetchSnapshots',
  async (params: {
    localidadId: number
    filters?: Partial<InventarioFilters>
  }) => {
    let url = `/api/portal/Inventario/localidad/${params.localidadId}/snapshots`

    const searchParams = new URLSearchParams()
    if (params.filters?.fechaDesde)
      searchParams.append('desde', params.filters.fechaDesde)
    if (params.filters?.fechaHasta)
      searchParams.append('hasta', params.filters.fechaHasta)

    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`
    }

    const response = await restClient.get(url)
    return response.data
  },
)

export const crearSnapshot = createAsyncThunk(
  'inventory/crearSnapshot',
  async (request: CrearSnapshotRequest) => {
    const response = await restClient.post(
      '/api/portal/Inventario/snapshot',
      request,
    )
    return response.data
  },
)

export const eliminarSnapshot = createAsyncThunk(
  'inventory/eliminarSnapshot',
  async (params: { snapshotId: number; eliminadoPor: string }) => {
    const response = await restClient.delete(
      `/api/portal/Inventario/snapshot/${params.snapshotId}?eliminadoPor=${params.eliminadoPor}`,
    )
    return { snapshotId: params.snapshotId, success: response.data }
  },
)

// ** Async Thunks - Reconciliaciones
export const fetchReconciliaciones = createAsyncThunk(
  'inventory/fetchReconciliaciones',
  async (localidadId: number) => {
    const response = await restClient.get(
      `/api/portal/Inventario/localidad/${localidadId}/reconciliaciones`,
    )
    return response.data
  },
)

export const fetchReconciliacionesPendientes = createAsyncThunk(
  'inventory/fetchReconciliacionesPendientes',
  async (localidadId?: number) => {
    let url = '/api/portal/Inventario/reconciliaciones-pendientes'
    if (localidadId) {
      url += `?localidadId=${localidadId}`
    }
    const response = await restClient.get(url)
    return response.data
  },
)

export const crearReconciliacion = createAsyncThunk(
  'inventory/crearReconciliacion',
  async (params: { conteoId: number; request: CrearReconciliacionRequest }) => {
    const response = await restClient.post(
      `/api/portal/Inventario/conteo/${params.conteoId}/reconciliar`,
      params.request,
    )
    return response.data
  },
)

export const aprobarReconciliacion = createAsyncThunk(
  'inventory/aprobarReconciliacion',
  async (params: { reconciliacionId: number; usuario: string }) => {
    const response = await restClient.post(
      `/api/portal/Inventario/reconciliacion/${params.reconciliacionId}/aprobar`,
      { usuario: params.usuario },
    )
    return { reconciliacionId: params.reconciliacionId, success: response.data }
  },
)

// ** Async Thunks - Analytics y Reportes
export const fetchAnalyticsConteo = createAsyncThunk(
  'inventory/fetchAnalyticsConteo',
  async (conteoId: number) => {
    const response = await restClient.get(
      `/api/portal/Inventario/conteo/${conteoId}/analytics`,
    )
    return response.data
  },
)

export const fetchReporteDiscrepancias = createAsyncThunk(
  'inventory/fetchReporteDiscrepancias',
  async (conteoId: number) => {
    const response = await restClient.get(
      `/api/portal/Inventario/conteo/${conteoId}/reporte-discrepancias`,
    )
    return response.data
  },
)

export const fetchEstadisticasGenerales = createAsyncThunk(
  'inventory/fetchEstadisticasGenerales',
  async (params: { localidadId: number; ultimosDias?: number }) => {
    let url = `/api/portal/Inventario/localidad/${params.localidadId}/estadisticas`
    if (params.ultimosDias) {
      url += `?ultimosDias=${params.ultimosDias}`
    }
    const response = await restClient.get(url)
    return response.data
  },
)

export const fetchUsuariosActivos = createAsyncThunk(
  'inventory/fetchUsuariosActivos',
  async (localidadId: number) => {
    const response = await restClient.get(
      `/api/portal/Inventario/localidad/${localidadId}/usuarios-activos`,
    )
    return response.data
  },
)

export const fetchEstadisticasUsuario = createAsyncThunk(
  'inventory/fetchEstadisticasUsuario',
  async (params: {
    usuario: string
    localidadId: number
    ultimosDias?: number
  }) => {
    let url = `/api/portal/Inventario/usuario/${params.usuario}/estadisticas?localidadId=${params.localidadId}`
    if (params.ultimosDias) {
      url += `&ultimosDias=${params.ultimosDias}`
    }
    const response = await restClient.get(url)
    return response.data
  },
)

// ** Slice
export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action: PayloadAction<Partial<InventarioFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {}
    },
    setSelectedConteo: (
      state,
      action: PayloadAction<InventarioConteoDTO | null>,
    ) => {
      state.selectedConteo = action.payload
    },
    setSelectedSnapshot: (
      state,
      action: PayloadAction<InventarioSnapshotDTO | null>,
    ) => {
      state.selectedSnapshot = action.payload
    },
    setSelectedLocalidad: (
      state,
      action: PayloadAction<LocalidadDTO | null>,
    ) => {
      state.selectedLocalidad = action.payload
    },
    updateConteoInList: (state, action: PayloadAction<InventarioConteoDTO>) => {
      const index = state.conteos.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.conteos[index] = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    // ** Conteos
    builder
      .addCase(fetchConteos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConteos.fulfilled, (state, action) => {
        state.loading = false
        state.conteos = action.payload
      })
      .addCase(fetchConteos.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error fetching conteos'
      })

    // ** Single Conteo
    builder.addCase(fetchConteo.fulfilled, (state, action) => {
      state.selectedConteo = action.payload
    })

    // ** Planificar Conteo
    builder
      .addCase(planificarConteo.pending, (state) => {
        state.loading = true
      })
      .addCase(planificarConteo.fulfilled, (state, action) => {
        state.loading = false
        state.conteos.unshift(action.payload)
      })
      .addCase(planificarConteo.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error planning conteo'
      })

    // ** Acciones de Conteo (Iniciar, Completar, Cancelar)
    builder
      .addCase(iniciarConteo.fulfilled, (state, action) => {
        state.selectedConteo = action.payload
        inventorySlice.caseReducers.updateConteoInList(state, action)
      })
      .addCase(completarConteo.fulfilled, (state, action) => {
        state.selectedConteo = action.payload
        inventorySlice.caseReducers.updateConteoInList(state, action)
      })
      .addCase(cancelarConteo.fulfilled, (state, action) => {
        state.selectedConteo = action.payload
        inventorySlice.caseReducers.updateConteoInList(state, action)
      })

    // ** Snapshots
    builder
      .addCase(fetchSnapshots.fulfilled, (state, action) => {
        state.snapshots = action.payload
      })
      .addCase(crearSnapshot.fulfilled, (state, action) => {
        state.snapshots.unshift(action.payload)
      })
      .addCase(eliminarSnapshot.fulfilled, (state, action) => {
        state.snapshots = state.snapshots.filter(
          (s) => s.id !== action.payload.snapshotId,
        )
      })

    // ** Reconciliaciones
    builder
      .addCase(fetchReconciliaciones.fulfilled, (state, action) => {
        state.reconciliaciones = action.payload
      })
      .addCase(fetchReconciliacionesPendientes.fulfilled, (state, action) => {
        state.reconciliacionesPendientes = action.payload
      })
      .addCase(crearReconciliacion.fulfilled, (state, action) => {
        state.reconciliaciones.unshift(action.payload)
        state.reconciliacionesPendientes.unshift(action.payload)
      })
      .addCase(aprobarReconciliacion.fulfilled, (state, action) => {
        const index = state.reconciliacionesPendientes.findIndex(
          (r) => r.id === action.payload.reconciliacionId,
        )
        if (index !== -1) {
          state.reconciliacionesPendientes.splice(index, 1)
        }
      })

    // ** Analytics y Reportes
    builder
      .addCase(fetchAnalyticsConteo.fulfilled, (state, action) => {
        state.analytics = action.payload
      })
      .addCase(fetchReporteDiscrepancias.fulfilled, (state, action) => {
        state.discrepancias = action.payload
      })
      .addCase(fetchUsuariosActivos.fulfilled, (state, action) => {
        state.usuariosActivos = action.payload
      })
  },
})

export const {
  clearError,
  setFilters,
  clearFilters,
  setSelectedConteo,
  setSelectedSnapshot,
  setSelectedLocalidad,
  updateConteoInList,
} = inventorySlice.actions

export default inventorySlice.reducer
