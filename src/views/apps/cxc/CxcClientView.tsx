// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

// ** Third Party Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Components
import CardStatsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Store Imports
import { AppDispatch, RootState } from 'src/store'
import { fetchCxcByClient } from 'src/store/apps/cxc'

// ** Utils
import formatCurrency from 'src/utils/formatCurrency'

// ** Components
import CxcCard from './components/CxcCard'

interface CxcClientViewProps {
  codigoCliente: string
}

const CxcClientView: React.FC<CxcClientViewProps> = ({ codigoCliente }) => {
  // ** Hooks
  const theme = useTheme()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.cxc)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // ** Effects
  useEffect(() => {
    if (codigoCliente) {
      dispatch(fetchCxcByClient({ codigoCliente }))
    }
  }, [dispatch, codigoCliente])

  // ** Handlers
  const handleGoBack = () => {
    router.back()
  }

  const handleViewDetail = (cxc: any) => {
    router.push(`/apps/cxc/detail/${cxc.numeroCxc}`)
  }

  // ** Computed values
  const clientData = store.clientCxcData
  const totalOutstanding = clientData.reduce(
    (sum, cxc) => sum + cxc.saldoPendiente,
    0,
  )
  const totalAmount = clientData.reduce((sum, cxc) => sum + cxc.montoTotal, 0)
  const overdueCount = clientData.filter((cxc) => cxc.estaVencido).length
  const clientName = clientData[0]?.cliente?.nombre || codigoCliente

  // ** Loading State
  if (store.isLoading) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          sx={{ mt: 3 }}
        />
      </Box>
    )
  }

  // ** Error State
  if (store.error) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {store.error}
        </Alert>
        <Button
          variant="contained"
          onClick={handleGoBack}
          startIcon={<Icon icon="mdi:arrow-left" />}
        >
          Volver
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <IconButton onClick={handleGoBack}>
            <Icon icon="mdi:arrow-left" />
          </IconButton>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            component="h1"
            sx={{ fontWeight: 700 }}
          >
            CXC de {clientName}
          </Typography>
        </Stack>

        <Typography variant="body1" color="text.secondary">
          Código: {codigoCliente}
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <CardStatsHorizontal
            title="Total CXC"
            stats={clientData.length.toString()}
            icon={<Icon icon="mdi:file-document-multiple" />}
            color="primary"
            trendNumber="100%"
            trend="positive"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CardStatsHorizontal
            title="Total Facturado"
            stats={formatCurrency(totalAmount)}
            icon={<Icon icon="mdi:currency-usd" />}
            color="info"
            trendNumber="100%"
            trend="positive"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CardStatsHorizontal
            title="Saldo Pendiente"
            stats={formatCurrency(totalOutstanding)}
            icon={<Icon icon="mdi:clock-outline" />}
            color="warning"
            trendNumber={`${
              Math.round((totalOutstanding / totalAmount) * 100) || 0
            }%`}
            trend="negative"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CardStatsHorizontal
            title="Vencidas"
            stats={overdueCount.toString()}
            icon={<Icon icon="mdi:alert-circle-outline" />}
            color="error"
            trendNumber={`${
              Math.round((overdueCount / clientData.length) * 100) || 0
            }%`}
            trend="negative"
          />
        </Grid>
      </Grid>

      {/* CXC List */}
      <Card>
        <CardHeader
          title={`Cuentas por Cobrar (${clientData.length})`}
          titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
        />
        <CardContent>
          {clientData.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Icon
                icon="mdi:file-document-outline"
                fontSize="3rem"
                color="disabled"
              />
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                No se encontraron cuentas por cobrar para este cliente
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {clientData.map((cxc) => (
                <CxcCard
                  key={cxc.id}
                  cxc={cxc}
                  onViewDetail={handleViewDetail}
                  compact={isMobile}
                />
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default CxcClientView
