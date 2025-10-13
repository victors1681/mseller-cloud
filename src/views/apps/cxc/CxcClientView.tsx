// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
  Skeleton,
  Alert,
} from '@mui/material'

// ** Third Party Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

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
        <Grid item xs={6} sm={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              textAlign: 'center',
              bgcolor: 'primary.main',
              color: 'white',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {clientData.length}
            </Typography>
            <Typography variant="caption">Total CXC</Typography>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              textAlign: 'center',
              bgcolor: 'info.main',
              color: 'white',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontSize: isMobile ? '1rem' : '1.25rem' }}
            >
              {formatCurrency(totalAmount)}
            </Typography>
            <Typography variant="caption">Total Facturado</Typography>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              textAlign: 'center',
              bgcolor: 'warning.main',
              color: 'white',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontSize: isMobile ? '1rem' : '1.25rem' }}
            >
              {formatCurrency(totalOutstanding)}
            </Typography>
            <Typography variant="caption">Saldo Pendiente</Typography>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              textAlign: 'center',
              bgcolor: 'error.main',
              color: 'white',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {overdueCount}
            </Typography>
            <Typography variant="caption">Vencidas</Typography>
          </Paper>
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
