// ** React Imports
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** Types
import {
  DashboardFilters,
  DashboardState,
  DashboardStats,
  OrdersByStatus,
  RecentActivity,
  RevenueData,
  TopProduct,
  TopSeller,
  TransportActivity,
} from 'src/types/apps/dashboardTypes'

// ** Mock Data
const mockStats: DashboardStats = {
  totalOrders: 1245,
  ordersGrowth: 15.5,
  totalRevenue: 125000.5,
  revenueGrowth: 23.2,
  totalCollections: 98000.25,
  collectionsGrowth: 12.8,
  pendingCollections: 27000.25,
  activeDrivers: 24,
  driversGrowth: 8.5,
  activeSellers: 45,
  sellersGrowth: 12.3,
  totalProducts: 350,
  lowStockProducts: 28,
  activeTransports: 18,
  completedToday: 156,
}

const mockRevenueData: RevenueData[] = [
  { month: 'Ene', revenue: 45000, collections: 38000 },
  { month: 'Feb', revenue: 52000, collections: 45000 },
  { month: 'Mar', revenue: 48000, collections: 42000 },
  { month: 'Abr', revenue: 61000, collections: 55000 },
  { month: 'May', revenue: 58000, collections: 52000 },
  { month: 'Jun', revenue: 65000, collections: 58000 },
  { month: 'Jul', revenue: 72000, collections: 65000 },
  { month: 'Ago', revenue: 68000, collections: 61000 },
  { month: 'Sep', revenue: 75000, collections: 68000 },
  { month: 'Oct', revenue: 82000, collections: 75000 },
  { month: 'Nov', revenue: 88000, collections: 80000 },
  { month: 'Dic', revenue: 95000, collections: 85000 },
]

const mockTopProducts: TopProduct[] = [
  {
    id: 'prod-1',
    name: 'Coca Cola 2.5L',
    sales: 450,
    revenue: 22500,
    trend: 15.5,
  },
  { id: 'prod-2', name: 'Pepsi 2L', sales: 380, revenue: 19000, trend: 12.3 },
  {
    id: 'prod-3',
    name: 'Agua Mineral 500ml',
    sales: 520,
    revenue: 10400,
    trend: -5.2,
  },
  {
    id: 'prod-4',
    name: 'Cerveza Presidente 355ml',
    sales: 290,
    revenue: 17400,
    trend: 8.7,
  },
  {
    id: 'prod-5',
    name: 'Galletas Saladas 200g',
    sales: 310,
    revenue: 9300,
    trend: 18.9,
  },
]

const mockTopSellers: TopSeller[] = [
  {
    id: 'seller-1',
    name: 'Juan Pérez',
    orders: 125,
    revenue: 65000,
    collections: 52000,
  },
  {
    id: 'seller-2',
    name: 'María García',
    orders: 110,
    revenue: 58000,
    collections: 48000,
  },
  {
    id: 'seller-3',
    name: 'Carlos Rodríguez',
    orders: 95,
    revenue: 48000,
    collections: 42000,
  },
  {
    id: 'seller-4',
    name: 'Ana Martínez',
    orders: 88,
    revenue: 45000,
    collections: 38000,
  },
  {
    id: 'seller-5',
    name: 'Luis Sánchez',
    orders: 82,
    revenue: 42000,
    collections: 36000,
  },
]

const mockRecentActivity: RecentActivity[] = [
  {
    id: 'act-1',
    type: 'order',
    description:
      'Nueva orden #1234 creada por Juan Pérez - Cliente: Colmado El Buen Precio',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    status: 'success',
  },
  {
    id: 'act-2',
    type: 'collection',
    description:
      'Cobro de $5,000 registrado por María García - Cliente: Super 24',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    status: 'success',
  },
  {
    id: 'act-3',
    type: 'transport',
    description: 'Ruta iniciada por Carlos Rodríguez - 12 entregas pendientes',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    status: 'info',
  },
  {
    id: 'act-4',
    type: 'product',
    description:
      'Alerta: Stock bajo de Coca Cola 2.5L - Solo quedan 15 unidades',
    timestamp: new Date(Date.now() - 65 * 60000).toISOString(),
    status: 'warning',
  },
  {
    id: 'act-5',
    type: 'order',
    description:
      'Orden #1233 completada y entregada - Cliente: Mini Market Central',
    timestamp: new Date(Date.now() - 85 * 60000).toISOString(),
    status: 'success',
  },
  {
    id: 'act-6',
    type: 'collection',
    description: 'Cobro pendiente de $3,500 - Cliente: Colmado La Española',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    status: 'warning',
  },
  {
    id: 'act-7',
    type: 'transport',
    description: 'Entrega fallida - Cliente no disponible en dirección',
    timestamp: new Date(Date.now() - 150 * 60000).toISOString(),
    status: 'error',
  },
  {
    id: 'act-8',
    type: 'order',
    description: 'Nueva orden #1232 procesada - 25 productos en total',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    status: 'success',
  },
]

const mockOrdersByStatus: OrdersByStatus = {
  pending: 45,
  processing: 78,
  completed: 1020,
  cancelled: 12,
}

const mockTransportActivity: TransportActivity[] = [
  {
    driverId: 'driver-1',
    driverName: 'Carlos Rodríguez',
    activeRoutes: 3,
    completedToday: 12,
    pendingDeliveries: 8,
    status: 'active',
    deliveryStats: {
      delivered: 28,
      notDelivered: 3,
      deliveredAnotherDay: 5,
      partialDelivery: 2,
      returned: 1,
    },
  },
  {
    driverId: 'driver-2',
    driverName: 'Pedro Gómez',
    activeRoutes: 2,
    completedToday: 15,
    pendingDeliveries: 5,
    status: 'active',
    deliveryStats: {
      delivered: 32,
      notDelivered: 2,
      deliveredAnotherDay: 4,
      partialDelivery: 1,
      returned: 0,
    },
  },
  {
    driverId: 'driver-3',
    driverName: 'José Ramírez',
    activeRoutes: 0,
    completedToday: 18,
    pendingDeliveries: 0,
    status: 'idle',
    deliveryStats: {
      delivered: 35,
      notDelivered: 1,
      deliveredAnotherDay: 3,
      partialDelivery: 0,
      returned: 0,
    },
  },
  {
    driverId: 'driver-4',
    driverName: 'Miguel Torres',
    activeRoutes: 4,
    completedToday: 10,
    pendingDeliveries: 12,
    status: 'active',
    deliveryStats: {
      delivered: 25,
      notDelivered: 4,
      deliveredAnotherDay: 6,
      partialDelivery: 3,
      returned: 2,
    },
  },
  {
    driverId: 'driver-5',
    driverName: 'Rafael López',
    activeRoutes: 0,
    completedToday: 0,
    pendingDeliveries: 0,
    status: 'offline',
    deliveryStats: {
      delivered: 15,
      notDelivered: 2,
      deliveredAnotherDay: 1,
      partialDelivery: 0,
      returned: 1,
    },
  },
]

const initialState: DashboardState = {
  stats: null,
  revenueData: [],
  topProducts: [],
  topSellers: [],
  recentActivity: [],
  ordersByStatus: null,
  transportActivity: [],
  loading: false,
  error: null,
}

// Async thunks with mock data
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (filters: DashboardFilters, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))
      return mockStats
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching dashboard stats',
      )
    }
  },
)

export const fetchRevenueData = createAsyncThunk(
  'dashboard/fetchRevenue',
  async (filters: DashboardFilters, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      return mockRevenueData
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching revenue data',
      )
    }
  },
)

export const fetchTopProducts = createAsyncThunk(
  'dashboard/fetchTopProducts',
  async (filters: DashboardFilters, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockTopProducts
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching top products',
      )
    }
  },
)

export const fetchTopSellers = createAsyncThunk(
  'dashboard/fetchTopSellers',
  async (filters: DashboardFilters, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockTopSellers
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching top sellers',
      )
    }
  },
)

export const fetchRecentActivity = createAsyncThunk(
  'dashboard/fetchActivity',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))
      return mockRecentActivity
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching recent activity',
      )
    }
  },
)

export const fetchOrdersByStatus = createAsyncThunk(
  'dashboard/fetchOrdersStatus',
  async (filters: DashboardFilters, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockOrdersByStatus
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching orders status',
      )
    }
  },
)

export const fetchTransportActivity = createAsyncThunk(
  'dashboard/fetchTransport',
  async (filters: DashboardFilters, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockTransportActivity
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching transport activity',
      )
    }
  },
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetDashboard: (state) => {
      state.stats = null
      state.revenueData = []
      state.topProducts = []
      state.topSellers = []
      state.recentActivity = []
      state.ordersByStatus = null
      state.transportActivity = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchDashboardStats.fulfilled,
        (state, action: PayloadAction<DashboardStats>) => {
          state.loading = false
          state.stats = action.payload
        },
      )
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch Revenue
      .addCase(
        fetchRevenueData.fulfilled,
        (state, action: PayloadAction<RevenueData[]>) => {
          state.revenueData = action.payload
        },
      )
      // Fetch Top Products
      .addCase(
        fetchTopProducts.fulfilled,
        (state, action: PayloadAction<TopProduct[]>) => {
          state.topProducts = action.payload
        },
      )
      // Fetch Top Sellers
      .addCase(
        fetchTopSellers.fulfilled,
        (state, action: PayloadAction<TopSeller[]>) => {
          state.topSellers = action.payload
        },
      )
      // Fetch Recent Activity
      .addCase(
        fetchRecentActivity.fulfilled,
        (state, action: PayloadAction<RecentActivity[]>) => {
          state.recentActivity = action.payload
        },
      )
      // Fetch Orders Status
      .addCase(
        fetchOrdersByStatus.fulfilled,
        (state, action: PayloadAction<OrdersByStatus>) => {
          state.ordersByStatus = action.payload
        },
      )
      // Fetch Transport Activity
      .addCase(
        fetchTransportActivity.fulfilled,
        (state, action: PayloadAction<TransportActivity[]>) => {
          state.transportActivity = action.payload
        },
      )
  },
})

export const { clearError, resetDashboard } = dashboardSlice.actions
export default dashboardSlice.reducer
