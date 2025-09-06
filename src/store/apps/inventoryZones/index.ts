// ** Redux Imports
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** restClient.import restClient.from 'restClient.

// ** Types
import {
  ConfiguracionZonasMasivaResponse,
  ConfigurarZonaProductoRequest,
  ConfigurarZonasMasivaRequest,
  GenerarZonasRequest,
  InventarioZonaDTO,
  ProductoZonaInfo,
  ReasignarZonaRequest,
  ResumenProgresoZonaDTO,
} from 'src/types/apps/inventoryTypes'
import restClient from '../../../configs/restClient'

interface InventoryZonesState {
  // Zonas
  zonas: InventarioZonaDTO[]
  selectedZona: InventarioZonaDTO | null

  // Configuración de zonas
  configuracionZonas: { [zona: string]: ProductoZonaInfo[] }

  // Progreso por zonas
  progresoZonas: ResumenProgresoZonaDTO[]

  // UI State
  loading: boolean
  error: string | null

  // Usuarios disponibles para asignación
  usuariosDisponibles: string[]
}

const initialState: InventoryZonesState = {
  zonas: [],
  selectedZona: null,
  configuracionZonas: {},
  progresoZonas: [],
  loading: false,
  error: null,
  usuariosDisponibles: [],
}

// ** Async Thunks
export const fetchConfiguracionZonas = createAsyncThunk(
  'inventoryZones/fetchConfiguracionZonas',
  async () => {
    const response = await restClient.get(
      '/api/portal/InventarioZonas/configuracion',
    )
    return response.data.data
  },
)

export const configurarZonaProducto = createAsyncThunk(
  'inventoryZones/configurarZonaProducto',
  async (request: ConfigurarZonaProductoRequest) => {
    const response = await restClient.post(
      '/api/portal/InventarioZonas/configurar-producto',
      request,
    )
    return { request, response: response.data }
  },
)

export const configurarZonasMasiva = createAsyncThunk(
  'inventoryZones/configurarZonasMasiva',
  async (request: ConfigurarZonasMasivaRequest) => {
    const response = await restClient.post(
      '/api/portal/InventarioZonas/configurar-masiva',
      request,
    )
    return response.data.data as ConfiguracionZonasMasivaResponse
  },
)

export const fetchProgresoZonas = createAsyncThunk(
  'inventoryZones/fetchProgresoZonas',
  async (conteoId: number) => {
    const response = await restClient.get(
      `/api/portal/InventarioZonas/progreso/${conteoId}`,
    )
    return response.data.data
  },
)

export const reasignarZona = createAsyncThunk(
  'inventoryZones/reasignarZona',
  async (params: { zonaId: number; request: ReasignarZonaRequest }) => {
    const response = await restClient.post(
      `/api/portal/InventarioZonas/reasignar/${params.zonaId}`,
      params.request,
    )
    return {
      zonaId: params.zonaId,
      nuevoUsuario: params.request.nuevoUsuario,
      response: response.data,
    }
  },
)

export const generarZonasOrganizadas = createAsyncThunk(
  'inventoryZones/generarZonasOrganizadas',
  async (params: { conteoId: number; request: GenerarZonasRequest }) => {
    const response = await restClient.post(
      `/api/portal/InventarioZonas/generar/${params.conteoId}`,
      params.request,
    )
    return response.data.data
  },
)

// ** Slice
export const inventoryZonesSlice = createSlice({
  name: 'inventoryZones',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSelectedZona: (
      state,
      action: PayloadAction<InventarioZonaDTO | null>,
    ) => {
      state.selectedZona = action.payload
    },
    updateZonaInList: (state, action: PayloadAction<InventarioZonaDTO>) => {
      const index = state.zonas.findIndex((z) => z.id === action.payload.id)
      if (index !== -1) {
        state.zonas[index] = action.payload
      }
    },
    setUsuariosDisponibles: (state, action: PayloadAction<string[]>) => {
      state.usuariosDisponibles = action.payload
    },
  },
  extraReducers: (builder) => {
    // ** Configuración de Zonas
    builder
      .addCase(fetchConfiguracionZonas.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConfiguracionZonas.fulfilled, (state, action) => {
        state.loading = false
        state.configuracionZonas = action.payload
      })
      .addCase(fetchConfiguracionZonas.rejected, (state, action) => {
        state.loading = false
        state.error =
          action.error.message || 'Error fetching zone configuration'
      })

    // ** Configurar Producto
    builder.addCase(configurarZonaProducto.fulfilled, (state, action) => {
      const { codigoProducto, zona } = action.payload.request
      // Actualizar la configuración local si es necesario
      Object.keys(state.configuracionZonas).forEach((zonaKey) => {
        const productos = state.configuracionZonas[zonaKey]
        const productoIndex = productos.findIndex(
          (p) => p.codigoProducto === codigoProducto,
        )
        if (productoIndex !== -1) {
          if (zonaKey !== zona) {
            // Remover de la zona anterior
            productos.splice(productoIndex, 1)
          }
        }
      })
    })

    // ** Configuración Masiva
    builder
      .addCase(configurarZonasMasiva.pending, (state) => {
        state.loading = true
      })
      .addCase(configurarZonasMasiva.fulfilled, (state, action) => {
        state.loading = false
        // Refrescar configuración después de operación masiva
      })
      .addCase(configurarZonasMasiva.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error in bulk zone configuration'
      })

    // ** Progreso de Zonas
    builder.addCase(fetchProgresoZonas.fulfilled, (state, action) => {
      state.progresoZonas = action.payload
    })

    // ** Reasignar Zona
    builder.addCase(reasignarZona.fulfilled, (state, action) => {
      const { zonaId, nuevoUsuario } = action.payload
      const zona = state.zonas.find((z) => z.id === zonaId)
      if (zona) {
        zona.usuarioAsignado = nuevoUsuario
        zona.fechaAsignacion = new Date().toISOString()
      }

      const progresoZona = state.progresoZonas.find(
        (p) => p.nombreZona === zona?.nombreZona,
      )
      if (progresoZona) {
        progresoZona.usuarioAsignado = nuevoUsuario
      }
    })

    // ** Generar Zonas
    builder
      .addCase(generarZonasOrganizadas.pending, (state) => {
        state.loading = true
      })
      .addCase(generarZonasOrganizadas.fulfilled, (state, action) => {
        state.loading = false
        state.zonas = action.payload
      })
      .addCase(generarZonasOrganizadas.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error generating organized zones'
      })
  },
})

export const {
  clearError,
  setSelectedZona,
  updateZonaInList,
  setUsuariosDisponibles,
} = inventoryZonesSlice.actions

export default inventoryZonesSlice.reducer
