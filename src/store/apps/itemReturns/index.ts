// ** Redux Toolkit Imports
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** Config
import restClient from 'src/configs/restClient'

// ** Types
import {
  CalcularDevolucionRequest,
  DevolucionResponse,
  DocumentoResponse,
  initialCombinedItemReturnsState,
  ItemReturnListItem,
  ItemReturnsListFilters,
  PaginatedItemReturnsListResponse,
  ProcesarDevolucionRequest,
  ProcessedReturn,
  SelectedDocument,
} from 'src/types/apps/itemReturnsTypes'

// ** Async Actions

// ============================================
// List View Actions
// ============================================

// Fetch paginated list of item returns
export const fetchItemReturnsList = createAsyncThunk(
  'itemReturns/fetchItemReturnsList',
  async (filters: ItemReturnsListFilters, { rejectWithValue }) => {
    try {
      const response = await restClient.get<PaginatedItemReturnsListResponse>(
        '/api/portal/Devolucion',
        { params: filters },
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching item returns list',
      )
    }
  },
)

// ============================================
// Document Processing Actions
// ============================================

// Fetch document items by document number
export const fetchDocumentItems = createAsyncThunk(
  'itemReturns/fetchDocumentItems',
  async (numeroDocumento: string) => {
    const response = await restClient.get<DocumentoResponse>(
      `/api/portal/Pedido/detalle/`,
      { params: { noPedidoStr: numeroDocumento } },
    )
    return response.data
  },
)

// Calculate Item Return (Preview)
export const calculateItemReturn = createAsyncThunk(
  'itemReturns/calculateItemReturn',
  async (request: CalcularDevolucionRequest) => {
    const response = await restClient.post<DevolucionResponse>(
      '/api/portal/Devolucion/calcular',
      request,
    )
    return response.data
  },
)

// Process Item Return
export const processItemReturn = createAsyncThunk(
  'itemReturns/processItemReturn',
  async (request: ProcesarDevolucionRequest, { rejectWithValue }) => {
    try {
      const response = await restClient.post<DevolucionResponse>(
        '/api/portal/Devolucion',
        request,
      )
      return response.data
    } catch (error: any) {
      // Handle specific 400 errors with detailed messages
      if (error.response?.status === 400) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data ||
          'Error de validación en la solicitud'
        return rejectWithValue(errorMessage)
      }

      // Handle other errors
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Error al procesar la devolución'
      return rejectWithValue(errorMessage)
    }
  },
)

// Fetch return history
export const fetchReturnHistory = createAsyncThunk(
  'itemReturns/fetchReturnHistory',
  async (filters?: { dateFrom?: string; dateTo?: string; status?: string }) => {
    const response = await restClient.get<ProcessedReturn[]>(
      '/api/portal/Devolucion/historial',
      { params: filters },
    )
    return response.data
  },
)

// ** Slice
const itemReturnsSlice = createSlice({
  name: 'itemReturns',
  initialState: initialCombinedItemReturnsState,
  reducers: {
    // Set selected document
    setSelectedDocument: (
      state,
      action: PayloadAction<SelectedDocument | null>,
    ) => {
      state.selectedDocument = action.payload
      // Clear document items when changing document
      if (
        action.payload?.numeroDocumento !==
        state.selectedDocument?.numeroDocumento
      ) {
        state.documentItems = []
        state.returnItems = []
        state.calculations = null
        state.processingResult = null
      }
    },

    // Clear document items
    clearDocumentItems: (state) => {
      state.documentItems = []
      state.documentItemsError = null
    },

    // Set return items from document items
    setReturnItemsFromDocument: (state, action: PayloadAction<string[]>) => {
      const selectedCodes = action.payload
      state.returnItems = state.documentItems
        .filter((item) => selectedCodes.includes(item.codigoProducto))
        .map((item) => ({
          codigoProducto: item.codigoProducto,
          descripcionProducto: item.descripcionProducto,
          cantidad: 1, // Default quantity
          cantidadMaxima: item.cantidadDisponible,
          precioUnitario: item.precioUnitario,
          motivoDevolucion: undefined,
        }))
    },

    // Update return item quantity
    updateReturnItemQuantity: (
      state,
      action: PayloadAction<{ codigoProducto: string; cantidad: number }>,
    ) => {
      const { codigoProducto, cantidad } = action.payload
      const item = state.returnItems.find(
        (item) => item.codigoProducto === codigoProducto,
      )
      if (item) {
        item.cantidad = Math.min(cantidad, item.cantidadMaxima)
      }
    },

    // Remove return item
    removeReturnItem: (state, action: PayloadAction<string>) => {
      state.returnItems = state.returnItems.filter(
        (item) => item.codigoProducto !== action.payload,
      )
    },

    // Clear calculations
    clearCalculations: (state) => {
      state.calculations = null
      state.calculationError = null
    },

    // Clear processing result
    clearProcessingResult: (state) => {
      state.processingResult = null
      state.processError = null
    },

    // Force reset processing state
    resetProcessingState: (state) => {
      state.isProcessing = false
    },

    // Set filters
    setFilters: (
      state,
      action: PayloadAction<
        Partial<typeof initialCombinedItemReturnsState.filters>
      >,
    ) => {
      state.filters = { ...state.filters, ...action.payload }
    },

    // Clear all errors
    clearErrors: (state) => {
      state.documentItemsError = null
      state.calculationError = null
      state.processError = null
      state.historyError = null
    },

    // Reset state
    resetState: () => initialCombinedItemReturnsState,

    // ============================================
    // List View Actions
    // ============================================
    setListFilters: (state, action: PayloadAction<ItemReturnsListFilters>) => {
      state.listView.listFilters = {
        ...state.listView.listFilters,
        ...action.payload,
      }
    },
    clearListFilters: (state) => {
      state.listView.listFilters = {
        pageNumber: 1,
        pageSize: 20,
      }
    },
    setSelectedListItem: (
      state,
      action: PayloadAction<ItemReturnListItem | null>,
    ) => {
      state.listView.selectedListItem = action.payload
    },
    clearListErrors: (state) => {
      state.listView.listError = null
    },
  },
  extraReducers: (builder) => {
    // Fetch document items
    builder
      .addCase(fetchDocumentItems.pending, (state) => {
        state.isLoadingDocumentItems = true
        state.documentItemsError = null
      })
      .addCase(fetchDocumentItems.fulfilled, (state, action) => {
        state.isLoadingDocumentItems = false
        // Convert DocumentTypeDetail[] to DocumentoDetalle[]
        state.documentItems = action.payload.detalle.map((item) => ({
          codigoProducto: item.codigoProducto,
          descripcionProducto: item.descripcion,
          cantidad: item.cantidad,
          cantidadDisponible: item.cantidadOriginal || item.cantidad, // Use original quantity as available
          precioUnitario: item.precio,
          descuentoUnitario: item.descuento,
          porcentajeDescuento: item.porcientoDescuento,
          impuestoUnitario: item.impuesto,
          porcentajeImpuesto: item.porcientoImpuesto,
          tipoImpuesto: item.tipoImpuesto,
          subTotal: item.subTotal,
          unidad: item.unidad,
          categoria: item.area,
        }))
        // Update selected document with full details
        if (action.payload) {
          state.selectedDocument = {
            numeroDocumento: action.payload.noPedidoStr,
            fechaDocumento: action.payload.fecha,
            nombreCliente: action.payload.nombreCliente,
            tipoDocumento: action.payload.tipoDocumento,
            montoTotal: action.payload.total,
          }
        }
      })
      .addCase(fetchDocumentItems.rejected, (state, action) => {
        state.isLoadingDocumentItems = false
        state.documentItemsError =
          action.error.message || 'Error loading document items'
        state.documentItems = []
      })

    // Calculate item return
    builder
      .addCase(calculateItemReturn.pending, (state) => {
        state.isCalculating = true
        state.calculationError = null
      })
      .addCase(calculateItemReturn.fulfilled, (state, action) => {
        state.isCalculating = false
        state.calculations = action.payload
      })
      .addCase(calculateItemReturn.rejected, (state, action) => {
        state.isCalculating = false
        state.calculationError =
          action.error.message || 'Error calculating return'
      })

    // Process item return
    builder
      .addCase(processItemReturn.pending, (state) => {
        state.isProcessing = true
        state.processError = null
      })
      .addCase(processItemReturn.fulfilled, (state, action) => {
        state.isProcessing = false
        state.processingResult = {
          success: true,
          numeroDocumento: action.payload.numeroDocumento,
          montoDevolucion: action.payload.montoDevolucion,
          movimientoCxc: action.payload.movimientoCxc,
        }
        // Clear current work after successful processing
        state.returnItems = []
        state.calculations = null
        state.documentItems = []
        state.selectedDocument = null
      })
      .addCase(processItemReturn.rejected, (state, action) => {
        state.isProcessing = false
        // Use the rejectWithValue payload if available, otherwise fallback to error message
        state.processError =
          (action.payload as string) ||
          action.error.message ||
          'Error al procesar la devolución'
      })

    // Fetch return history
    builder
      .addCase(fetchReturnHistory.pending, (state) => {
        state.isLoadingHistory = true
        state.historyError = null
      })
      .addCase(fetchReturnHistory.fulfilled, (state, action) => {
        state.isLoadingHistory = false
        state.returnHistory = action.payload
      })
      .addCase(fetchReturnHistory.rejected, (state, action) => {
        state.isLoadingHistory = false
        state.historyError =
          action.error.message || 'Error loading return history'
      })

    // ============================================
    // List View Cases
    // ============================================

    // Fetch item returns list
    builder
      .addCase(fetchItemReturnsList.pending, (state) => {
        state.listView.isLoadingList = true
        state.listView.listError = null
      })
      .addCase(fetchItemReturnsList.fulfilled, (state, action) => {
        state.listView.isLoadingList = false
        state.listView.listData = action.payload.items
        state.listView.totalCount = action.payload.totalCount
        state.listView.pageNumber = action.payload.pageNumber
        state.listView.pageSize = action.payload.pageSize
        state.listView.totalPages = action.payload.totalPages
        state.listView.hasPreviousPage = action.payload.hasPreviousPage
        state.listView.hasNextPage = action.payload.hasNextPage
      })
      .addCase(fetchItemReturnsList.rejected, (state, action) => {
        state.listView.isLoadingList = false
        state.listView.listError =
          (action.payload as string) ||
          action.error.message ||
          'Error loading item returns list'
      })
  },
})

// ** Export actions
export const {
  setSelectedDocument,
  clearDocumentItems,
  setReturnItemsFromDocument,
  updateReturnItemQuantity,
  removeReturnItem,
  clearCalculations,
  clearProcessingResult,
  resetProcessingState,
  setFilters,
  clearErrors,
  resetState,
  setListFilters,
  clearListFilters,
  setSelectedListItem,
  clearListErrors,
} = itemReturnsSlice.actions

// ** Export reducer
export default itemReturnsSlice.reducer
