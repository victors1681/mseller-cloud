// ============================================
// Dashboard Overview Types
// ============================================

export interface DashboardStats {
  totalOrders: number
  ordersGrowth: number
  totalRevenue: number
  revenueGrowth: number
  totalCollections: number
  collectionsGrowth: number
  pendingCollections: number
  activeDrivers: number
  driversGrowth: number
  activeSellers: number
  sellersGrowth: number
  totalProducts: number
  lowStockProducts: number
  activeTransports: number
  completedToday: number
}

// API Response Types
export interface RevenueDataAPI {
  date: string
  revenue: number
  collections: number
}

// Frontend Display Type (with month abbreviation)
export interface RevenueData {
  month: string
  revenue: number
  collections: number
}

export interface TopProductAPI {
  productId: string
  productName: string
  quantity: number
  revenue: number
}

export interface TopProduct {
  id: string
  name: string
  sales: number
  revenue: number
  trend: number
}

export interface TopSellerAPI {
  sellerId: string
  sellerName: string
  orders: number
  revenue: number
}

export interface TopSeller {
  id: string
  name: string
  orders: number
  revenue: number
  collections: number
  avatar?: string
}

export interface RecentActivityAPI {
  timestamp: string
  type: string
  description: string
  user: string
}

export interface RecentActivity {
  id: string
  type: 'order' | 'collection' | 'transport' | 'product'
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
}

export interface OrdersByStatus {
  pending: number
  processing: number
  completed: number
  cancelled: number
}

export interface TransportActivityAPI {
  driverId: string
  driverName: string
  deliveries: number
  status: string
}

export interface TransportActivity {
  driverId: string
  driverName: string
  activeRoutes: number
  completedToday: number
  pendingDeliveries: number
  status: 'active' | 'idle' | 'offline'
  deliveryStats: {
    delivered: number
    notDelivered: number
    deliveredAnotherDay: number
    partialDelivery: number
    returned: number
  }
}

export interface DashboardFilters {
  startDate?: string
  endDate?: string
  vendedorId?: string
  localidadId?: number
  distribuidorId?: string
}

export interface DashboardState {
  stats: DashboardStats | null
  revenueData: RevenueData[]
  topProducts: TopProduct[]
  topSellers: TopSeller[]
  recentActivity: RecentActivity[]
  ordersByStatus: OrdersByStatus | null
  transportActivity: TransportActivity[]
  loading: boolean
  error: string | null
}
