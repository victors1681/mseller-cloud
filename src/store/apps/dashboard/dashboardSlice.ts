// ** React Imports
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** API Client
import restClient from 'src/configs/restClient'

// ** Types
import {
  DashboardFilters,
  DashboardState,
  DashboardStats,
  OrdersByStatus,
  RecentActivity,
  RecentActivityAPI,
  RevenueData,
  RevenueDataAPI,
  TopProduct,
  TopProductAPI,
  TopSeller,
  TopSellerAPI,
  TransportActivity,
  TransportActivityAPI,
} from 'src/types/apps/dashboardTypes'

// Helper function to map month abbreviation
const getMonthAbbr = (date: string): string => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const d = new Date(date)
  return months[d.getMonth()]
}

// Helper to determine activity status from type
const getActivityStatus = (type: string): 'success' | 'warning' | 'error' | 'info' => {
  const typeMap: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
    order: 'success',
    payment: 'success',
    collection: 'success',
    delivery: 'info',
    transport: 'info',
    product: 'warning',
    error: 'error',
  }
  return typeMap[type.toLowerCase()] || 'info'
}

// Helper to normalize activity type
const normalizeActivityType = (type: string): 'order' | 'collection' | 'transport' | 'product' => {
  const normalized = type.toLowerCase()
  if (normalized.includes('order')) return 'order'
  if (normalized.includes('payment') || normalized.includes('collection')) return 'collection'
  if (normalized.includes('delivery') || normalized.includes('transport')) return 'transport'
  return 'product'
}

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

// Async thunks with real API calls
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (filters: DashboardFilters, { rejectWithValue }) => {
    try {
      const response = await restClient.get<DashboardStats>('/api/portal/Dashboard/stats', {
        params: filters,
      })
      return response.data
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
      const response = await restClient.get<RevenueDataAPI[]>('/api/portal/Dashboard/revenue', {
        params: filters,
      })
      // Transform API response to frontend format
      const transformedData: RevenueData[] = response.data.map((item) => ({
        month: getMonthAbbr(item.date),
        revenue: item.revenue,
        collections: item.collections,
      }))
      return transformedData
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching revenue data',
      )
    }
  },
)

export const fetchTopProducts = createAsyncThunk(
  'dashboard/fetchTopProducts',
  async (filters: DashboardFilters & { limit?: number }, { rejectWithValue }) => {
    try {
      const response = await restClient.get<TopProductAPI[]>('/api/portal/Dashboard/top-products', {
        params: { ...filters, limit: filters.limit || 5 },
      })
      // Transform API response to frontend format
      const transformedData: TopProduct[] = response.data.map((item) => ({
        id: item.productId,
        name: item.productName,
        sales: item.quantity,
        revenue: item.revenue,
        trend: 0, // API doesn't provide trend yet, default to 0
      }))
      return transformedData
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching top products',
      )
    }
  },
)

export const fetchTopSellers = createAsyncThunk(
  'dashboard/fetchTopSellers',
  async (filters: DashboardFilters & { limit?: number }, { rejectWithValue }) => {
    try {
      const response = await restClient.get<TopSellerAPI[]>('/api/portal/Dashboard/top-sellers', {
        params: { ...filters, limit: filters.limit || 5 },
      })
      // Transform API response to frontend format
      const transformedData: TopSeller[] = response.data.map((item) => ({
        id: item.sellerId,
        name: item.sellerName,
        orders: item.orders,
        revenue: item.revenue,
        collections: 0, // API doesn't provide collections yet, default to 0
        avatar: undefined,
      }))
      return transformedData
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching top sellers',
      )
    }
  },
)

export const fetchRecentActivity = createAsyncThunk(
  'dashboard/fetchActivity',
  async (limit: number = 20, { rejectWithValue }) => {
    try {
      const response = await restClient.get<RecentActivityAPI[]>('/api/portal/Dashboard/recent-activity', {
        params: { limit },
      })
      // Transform API response to frontend format
      const transformedData: RecentActivity[] = response.data.map((item, index) => ({
        id: `activity-${index}`,
        type: normalizeActivityType(item.type),
        description: item.description,
        timestamp: item.timestamp,
        status: getActivityStatus(item.type),
      }))
      return transformedData
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
      const response = await restClient.get<OrdersByStatus>('/api/portal/Dashboard/orders-status', {
        params: filters,
      })
      return response.data
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
      const response = await restClient.get<TransportActivityAPI[]>('/api/portal/Dashboard/transport-activity', {
        params: filters,
      })
      // Transform API response to frontend format with placeholder values for missing fields
      const transformedData: TransportActivity[] = response.data.map((item) => ({
        driverId: item.driverId,
        driverName: item.driverName,
        activeRoutes: item.status === 'active' ? 1 : 0,
        completedToday: item.deliveries,
        pendingDeliveries: 0, // API doesn't provide this yet
        status: (item.status as 'active' | 'idle' | 'offline') || 'idle',
        deliveryStats: {
          delivered: item.deliveries,
          notDelivered: 0,
          deliveredAnotherDay: 0,
          partialDelivery: 0,
          returned: 0,
        },
      }))
      return transformedData
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
