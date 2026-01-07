// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  fetchDashboardStats,
  fetchOrdersByStatus,
  fetchRecentActivity,
  fetchRevenueData,
  fetchTopProducts,
  fetchTopSellers,
  fetchTransportActivity,
} from 'src/store/apps/dashboard'

// ** Component Imports
import DashboardOrdersDonut from './DashboardOrdersDonut'
import DashboardRecentActivity from './DashboardRecentActivity'
import DashboardRevenueChart from './DashboardRevenueChart'
import DashboardStatsCard from './DashboardStatsCard'
import DashboardTopProducts from './DashboardTopProducts'
import DashboardTopSellers from './DashboardTopSellers'
import DashboardTransportActivity from './DashboardTransportActivity'

// ** Types
import { DashboardFilters } from 'src/types/apps/dashboardTypes'

const OverviewDashboard = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const {
    stats,
    revenueData,
    topProducts,
    topSellers,
    recentActivity,
    ordersByStatus,
    transportActivity,
    loading,
    error,
  } = useAppSelector((state) => state.dashboard)

  const [filters, setFilters] = useState<DashboardFilters>({
    vendedorId: '',
    localidadId: undefined,
    distribuidorId: '',
  })

  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState('today')

  const getDateRangeFilters = (range: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    switch (range) {
      case 'today': {
        const endOfDay = new Date(today)
        endOfDay.setHours(23, 59, 59, 999)
        return {
          startDate: today.toISOString(),
          endDate: endOfDay.toISOString(),
        }
      }
      case 'week': {
        const startOfWeek = new Date(today)
        const day = startOfWeek.getDay()
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
        startOfWeek.setDate(diff)
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(endOfWeek.getDate() + 6)
        endOfWeek.setHours(23, 59, 59, 999)
        return {
          startDate: startOfWeek.toISOString(),
          endDate: endOfWeek.toISOString(),
        }
      }
      case 'month': {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
        )
        endOfMonth.setHours(23, 59, 59, 999)
        return {
          startDate: startOfMonth.toISOString(),
          endDate: endOfMonth.toISOString(),
        }
      }
      case 'lastMonth': {
        const startOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1,
        )
        const endOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0,
        )
        endOfLastMonth.setHours(23, 59, 59, 999)
        return {
          startDate: startOfLastMonth.toISOString(),
          endDate: endOfLastMonth.toISOString(),
        }
      }
      default:
        return {}
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [dateRange])

  const loadDashboardData = async (invalidateCache = false) => {
    const dateFilters = getDateRangeFilters(dateRange)
    const combinedFilters = { ...filters, ...dateFilters, invalidateCache }

    await Promise.all([
      dispatch(fetchDashboardStats(combinedFilters)),
      dispatch(fetchRevenueData(combinedFilters)),
      dispatch(fetchTopProducts(combinedFilters)),
      dispatch(fetchTopSellers(combinedFilters)),
      dispatch(fetchRecentActivity(20)),
      dispatch(fetchOrdersByStatus(combinedFilters)),
      dispatch(fetchTransportActivity(combinedFilters)),
    ])
  }

  const handleRefresh = () => {
    loadDashboardData(true)
  }

  const handleDateRangeChange = (event: SelectChangeEvent) => {
    setDateRange(event.target.value)
  }

  return (
    <Box>
      {/* Loading Progress */}
      {loading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
        </Box>
      )}

      {/* Header Section */}
      <Box sx={{ mb: { xs: 4, sm: 6 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            mb: 3,
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: { xs: '1.5rem', sm: '2rem' },
              }}
            >
              Informaciones Generales
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Actividades y estadísticas de la plataforma en tiempo real
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              width: { xs: '100%', sm: 'auto' },
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <FormControl sx={{ minWidth: { xs: '100%', sm: 180 } }}>
              <Select
                value={dateRange}
                onChange={handleDateRangeChange}
                size="small"
                sx={{
                  minHeight: { xs: 44, sm: 'auto' },
                  backgroundColor: 'background.paper',
                }}
              >
                <MenuItem value="today">Hoy</MenuItem>
                <MenuItem value="week">Esta Semana</MenuItem>
                <MenuItem value="month">Este Mes</MenuItem>
                <MenuItem value="lastMonth">Mes Pasado</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<Icon icon="mdi:refresh" />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                minHeight: { xs: 44, sm: 'auto' },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Actualizar
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Error Display */}
      {error && (
        <Card sx={{ mb: 4, backgroundColor: theme.palette.error.light }}>
          <CardContent>
            <Typography color="error">{error}</Typography>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardStatsCard
            title="Ingresos Totales"
            value={`$${stats?.totalRevenue.toLocaleString() || 0}`}
            subtitle="Este período"
            icon="mdi:currency-usd"
            color="primary"
            trend={stats?.revenueGrowth}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardStatsCard
            title="Facturas Emitidas"
            value={stats?.totalInvoices || 0}
            subtitle="Total procesadas"
            icon="mdi:cart"
            color="success"
            trend={stats?.ordersGrowth}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardStatsCard
            title="Órdenes"
            value={stats?.totalOrders || 0}
            subtitle="Total procesadas"
            icon="mdi:cart"
            color="success"
            trend={stats?.ordersGrowth}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardStatsCard
            title="Cobros"
            value={`$${stats?.totalCollections.toLocaleString() || 0}`}
            subtitle={`$${
              stats?.pendingCollections.toLocaleString() || 0
            } pendientes`}
            icon="mdi:cash-multiple"
            color="warning"
            trend={stats?.collectionsGrowth}
          />
        </Grid>
      </Grid>

      {/* Secondary Stats */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardStatsCard
            title="Productos"
            value={stats?.totalProducts || 0}
            subtitle={`${stats?.lowStockProducts || 0} stock bajo`}
            icon="mdi:package-variant"
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardStatsCard
            title="Vendedores Activos"
            value={stats?.activeSellers || 0}
            subtitle="En campo"
            icon="mdi:account-tie"
            color="secondary"
            trend={stats?.sellersGrowth}
          />
        </Grid>
        {/* <Grid item xs={12} sm={6} lg={3}>
          <DashboardStatsCard
            title="Distribuidores"
            value={stats?.activeDrivers || 0}
            subtitle="En ruta"
            icon="mdi:truck-delivery"
            color="success"
            trend={stats?.driversGrowth}
          />
        </Grid> */}
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardStatsCard
            title="Transportes Activos"
            value={stats?.activeTransports || 0}
            subtitle="En operación"
            icon="mdi:truck"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DashboardStatsCard
            title="Entregas Hoy"
            value={stats?.completedToday || 0}
            subtitle="Completadas"
            icon="mdi:checkbox-marked-circle"
            color="success"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid item xs={12} lg={8}>
          <DashboardRevenueChart data={revenueData} />
        </Grid>
        <Grid item xs={12} lg={4}>
          {ordersByStatus && <DashboardOrdersDonut data={ordersByStatus} />}
        </Grid>
      </Grid>

      {/* Lists Section */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid item xs={12} lg={6}>
          <DashboardTopProducts data={topProducts} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <DashboardTopSellers data={topSellers} />
        </Grid>
      </Grid>

      {/* Activity Section */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} lg={6}>
          <DashboardRecentActivity data={recentActivity} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <DashboardTransportActivity data={transportActivity} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default OverviewDashboard
