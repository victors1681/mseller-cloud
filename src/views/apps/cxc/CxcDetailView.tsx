// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'

// ** Third Party Imports
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { AppDispatch, RootState } from 'src/store'
import { clearSelectedCxc, fetchCxcDetail } from 'src/store/apps/cxc'

// ** Types
import { TipoMovimientoCxc } from 'src/types/apps/cxcTypes'

// ** Utils
import formatCurrency from 'src/utils/formatCurrency'

// ** Components
import CreditNoteModal from './components/CreditNoteModal'
import CxcStatusBadge from './components/CxcStatusBadge'
import PaymentModal from './components/PaymentModal'

interface CxcDetailViewProps {
  numeroCxc: string
}

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[6],
  borderRadius: 12,
  [theme.breakpoints.down('md')]: {
    borderRadius: 8,
    boxShadow: theme.shadows[3],
  },
}))

const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
  cursor: 'default',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    borderRadius: 8,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    borderRadius: 6,
  },
  '&:hover': {
    boxShadow: theme.shadows[2],
    transform: 'translateY(-1px)',
  },
}))

const CxcDetailView: React.FC<CxcDetailViewProps> = ({ numeroCxc }) => {
  // ** Hooks
  const theme = useTheme()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.cxc)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // ** State
  const [actionMenuOpen, setActionMenuOpen] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [creditNoteModalOpen, setCreditNoteModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // ** Effects
  useEffect(() => {
    if (numeroCxc) {
      dispatch(fetchCxcDetail(numeroCxc))
    }

    return () => {
      dispatch(clearSelectedCxc())
    }
  }, [dispatch, numeroCxc])

  // ** Handlers
  const handleGoBack = () => {
    router.back()
  }

  const handleViewClient = () => {
    if (store.selectedCxc) {
      router.push(`/apps/cxc/client/${store.selectedCxc.codigoCliente}`)
    }
  }

  const handleProcessPayment = () => {
    setPaymentModalOpen(true)
  }

  const handleCreateCreditNote = () => {
    setCreditNoteModalOpen(true)
  }

  const handleProcessReturn = () => {
    // TODO: Open return dialog
    toast.success('Abrir formulario de devolución')
  }

  // ** Helper functions
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es })
    } catch {
      return 'Fecha inválida'
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es })
    } catch {
      return 'Fecha inválida'
    }
  }

  const getMovementIcon = (tipo: TipoMovimientoCxc) => {
    switch (tipo) {
      case TipoMovimientoCxc.Pago:
        return 'mdi:cash'
      case TipoMovimientoCxc.NotaCredito:
        return 'mdi:note-edit-outline'
      case TipoMovimientoCxc.Devolucion:
        return 'mdi:keyboard-return'
      case TipoMovimientoCxc.AjustePositivo:
        return 'mdi:plus-circle-outline'
      case TipoMovimientoCxc.AjusteNegativo:
        return 'mdi:minus-circle-outline'
      default:
        return 'mdi:file-document-outline'
    }
  }

  const getMovementColor = (tipo: TipoMovimientoCxc) => {
    switch (tipo) {
      case TipoMovimientoCxc.Pago:
        return 'success'
      case TipoMovimientoCxc.NotaCredito:
        return 'info'
      case TipoMovimientoCxc.Devolucion:
        return 'warning'
      case TipoMovimientoCxc.AjustePositivo:
        return 'success'
      case TipoMovimientoCxc.AjusteNegativo:
        return 'error'
      default:
        return 'default'
    }
  }

  // ** Loading State
  if (store.isLoading) {
    return (
      <Box
        sx={{
          p: { xs: 1.5, sm: 2, md: 3 },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: { xs: 8, md: 12 } }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={isMobile ? 32 : 40}
                />
                <Skeleton
                  variant="text"
                  width="40%"
                  height={isMobile ? 24 : 30}
                  sx={{ mt: 1 }}
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={isMobile ? 150 : 200}
                  sx={{ mt: 3, borderRadius: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    )
  }

  // ** Error State
  if (store.error) {
    return (
      <Box
        sx={{
          p: { xs: 1.5, sm: 2, md: 3 },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: { xs: 8, md: 12 },
            '& .MuiAlert-message': {
              fontSize: isMobile ? '0.875rem' : undefined,
            },
          }}
        >
          {store.error}
        </Alert>
        <Button
          variant="contained"
          onClick={handleGoBack}
          startIcon={<Icon icon="mdi:arrow-left" />}
          size={isMobile ? 'medium' : 'large'}
          sx={{
            minHeight: isMobile ? 44 : 48,
            borderRadius: { xs: 6, md: 8 },
          }}
        >
          Volver
        </Button>
      </Box>
    )
  }

  // ** No Data State
  if (!store.selectedCxc) {
    return (
      <Box
        sx={{
          p: { xs: 1.5, sm: 2, md: 3 },
          textAlign: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Icon
          icon="mdi:file-document-outline"
          fontSize={isMobile ? '3rem' : '4rem'}
          color="disabled"
        />
        <Typography
          variant={isMobile ? 'body1' : 'h6'}
          color="text.secondary"
          sx={{
            mt: 2,
            mb: 3,
            maxWidth: 300,
            lineHeight: 1.4,
          }}
        >
          No se encontró la cuenta por cobrar
        </Typography>
        <Button
          variant="contained"
          onClick={handleGoBack}
          startIcon={<Icon icon="mdi:arrow-left" />}
          size={isMobile ? 'medium' : 'large'}
          sx={{
            minHeight: isMobile ? 44 : 48,
            borderRadius: { xs: 6, md: 8 },
          }}
        >
          Volver
        </Button>
      </Box>
    )
  }

  const cxc = store.selectedCxc

  // ** Modal handlers
  const handleClosePaymentModal = () => {
    setPaymentModalOpen(false)
  }

  const handleCloseCreditNoteModal = () => {
    setCreditNoteModalOpen(false)
  }

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2, md: 3 },
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Stack
          direction={isMobile ? 'column' : 'row'}
          justifyContent="space-between"
          alignItems={isMobile ? 'flex-start' : 'center'}
          spacing={isMobile ? 3 : 2}
        >
          <Box sx={{ width: isMobile ? '100%' : 'auto' }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 1, flexWrap: isSmallMobile ? 'wrap' : 'nowrap' }}
            >
              <IconButton
                onClick={handleGoBack}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  minWidth: 'auto',
                  p: isMobile ? 1 : 1.5,
                }}
              >
                <Icon icon="mdi:arrow-left" />
              </IconButton>
              <Typography
                variant={isSmallMobile ? 'h6' : isMobile ? 'h5' : 'h4'}
                component="h1"
                sx={{
                  fontWeight: 700,
                  flex: 1,
                  minWidth: 0,
                  wordBreak: 'break-word',
                }}
              >
                CXC {cxc.numeroCxc}
              </Typography>
              <Box sx={{ flexShrink: 0 }}>
                <CxcStatusBadge
                  status={cxc.estado}
                  size={isMobile ? 'small' : 'medium'}
                />
              </Box>
            </Stack>
            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              color="text.secondary"
              sx={{
                ml: isMobile ? 6 : 7,
                wordBreak: 'break-word',
              }}
            >
              Documento: {cxc.numeroDocumento}
            </Typography>
          </Box>

          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={isMobile ? 1.5 : 1}
            sx={{ width: isMobile ? '100%' : 'auto' }}
          >
            {cxc.saldoPendiente > 0 && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Icon icon="mdi:cash" />}
                  onClick={handleProcessPayment}
                  size={isMobile ? 'medium' : 'medium'}
                  fullWidth={isMobile}
                  sx={{
                    minHeight: isMobile ? 44 : 36,
                    fontSize: isMobile ? '0.875rem' : '0.75rem',
                  }}
                >
                  {isMobile ? 'Registrar Pago' : 'Pago'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Icon icon="mdi:note-edit-outline" />}
                  onClick={handleCreateCreditNote}
                  size={isMobile ? 'medium' : 'medium'}
                  fullWidth={isMobile}
                  sx={{
                    minHeight: isMobile ? 44 : 36,
                    fontSize: isMobile ? '0.875rem' : '0.75rem',
                  }}
                >
                  {isMobile ? 'Nota Crédito' : 'N. Crédito'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Icon icon="mdi:keyboard-return" />}
                  onClick={handleProcessReturn}
                  size={isMobile ? 'medium' : 'medium'}
                  fullWidth={isMobile}
                  sx={{
                    minHeight: isMobile ? 44 : 36,
                    fontSize: isMobile ? '0.875rem' : '0.75rem',
                  }}
                >
                  Devolución
                </Button>
              </>
            )}
            <Button
              variant="outlined"
              startIcon={<Icon icon="mdi:account-outline" />}
              onClick={handleViewClient}
              size={isMobile ? 'medium' : 'medium'}
              fullWidth={isMobile}
              sx={{
                minHeight: isMobile ? 44 : 36,
                fontSize: isMobile ? '0.875rem' : '0.75rem',
              }}
            >
              Ver Cliente
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        {/* Summary Cards */}
        <Grid item xs={12}>
          <Grid container spacing={isMobile ? 1.5 : 2}>
            <Grid item xs={6} sm={3}>
              <InfoCard
                sx={{
                  p: isMobile ? 2 : 3,
                  minHeight: isMobile ? 80 : 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant={isSmallMobile ? 'overline' : 'caption'}
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.2,
                    mb: 0.5,
                    fontSize: isSmallMobile ? '0.65rem' : undefined,
                  }}
                >
                  Monto Total
                </Typography>
                <Typography
                  variant={isSmallMobile ? 'h6' : isMobile ? 'h5' : 'h5'}
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                    fontSize: isSmallMobile ? '1.1rem' : undefined,
                  }}
                >
                  {formatCurrency(cxc.montoTotal)}
                </Typography>
              </InfoCard>
            </Grid>

            <Grid item xs={6} sm={3}>
              <InfoCard
                sx={{
                  p: isMobile ? 2 : 3,
                  minHeight: isMobile ? 80 : 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant={isSmallMobile ? 'overline' : 'caption'}
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.2,
                    mb: 0.5,
                    fontSize: isSmallMobile ? '0.65rem' : undefined,
                  }}
                >
                  Monto Abonado
                </Typography>
                <Typography
                  variant={isSmallMobile ? 'h6' : isMobile ? 'h5' : 'h5'}
                  sx={{
                    fontWeight: 700,
                    color: 'success.main',
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                    fontSize: isSmallMobile ? '1.1rem' : undefined,
                  }}
                >
                  {formatCurrency(cxc.montoAbonado)}
                </Typography>
              </InfoCard>
            </Grid>

            <Grid item xs={6} sm={3}>
              <InfoCard
                sx={{
                  p: isMobile ? 2 : 3,
                  minHeight: isMobile ? 80 : 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant={isSmallMobile ? 'overline' : 'caption'}
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.2,
                    mb: 0.5,
                    fontSize: isSmallMobile ? '0.65rem' : undefined,
                  }}
                >
                  Saldo Pendiente
                </Typography>
                <Typography
                  variant={isSmallMobile ? 'h6' : isMobile ? 'h5' : 'h5'}
                  sx={{
                    fontWeight: 700,
                    color:
                      cxc.saldoPendiente > 0 ? 'error.main' : 'success.main',
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                    fontSize: isSmallMobile ? '1.1rem' : undefined,
                  }}
                >
                  {formatCurrency(cxc.saldoPendiente)}
                </Typography>
              </InfoCard>
            </Grid>

            <Grid item xs={6} sm={3}>
              <InfoCard
                sx={{
                  p: isMobile ? 2 : 3,
                  minHeight: isMobile ? 80 : 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant={isSmallMobile ? 'overline' : 'caption'}
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.2,
                    mb: 0.5,
                    fontSize: isSmallMobile ? '0.65rem' : undefined,
                  }}
                >
                  % Pagado
                </Typography>
                <Typography
                  variant={isSmallMobile ? 'h6' : isMobile ? 'h5' : 'h5'}
                  sx={{
                    fontWeight: 700,
                    color: 'info.main',
                    lineHeight: 1.2,
                    fontSize: isSmallMobile ? '1.1rem' : undefined,
                  }}
                >
                  {cxc.porcentajePagado.toFixed(1)}%
                </Typography>
              </InfoCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Account Details */}
        <Grid item xs={12} lg={8}>
          <StyledCard>
            <CardHeader
              title="Detalles de la Cuenta"
              titleTypographyProps={{
                variant: isMobile ? 'subtitle1' : 'h6',
                fontWeight: 600,
              }}
              sx={{ pb: isMobile ? 1 : 2 }}
            />
            <CardContent sx={{ pt: isMobile ? 1 : 2 }}>
              <Grid container spacing={isMobile ? 2 : 3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: isMobile ? 2 : 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        mb: 0.5,
                        textTransform: 'uppercase',
                        fontSize: isMobile ? '0.7rem' : '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      Cliente
                    </Typography>
                    <Typography
                      variant={isMobile ? 'body2' : 'body1'}
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1.3,
                        wordBreak: 'break-word',
                      }}
                    >
                      {cxc.cliente?.nombre || 'N/A'}
                    </Typography>
                    <Typography
                      variant={isMobile ? 'caption' : 'body2'}
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.2,
                        fontSize: isMobile ? '0.7rem' : undefined,
                      }}
                    >
                      Código: {cxc.codigoCliente}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: isMobile ? 2 : 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        mb: 0.5,
                        textTransform: 'uppercase',
                        fontSize: isMobile ? '0.7rem' : '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      Tipo de Documento
                    </Typography>
                    <Typography
                      variant={isMobile ? 'body2' : 'body1'}
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1.3,
                      }}
                    >
                      {cxc.tipoDocumento}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: isMobile ? 2 : 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        mb: 0.5,
                        textTransform: 'uppercase',
                        fontSize: isMobile ? '0.7rem' : '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      Fecha de Emisión
                    </Typography>
                    <Typography
                      variant={isMobile ? 'body2' : 'body1'}
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1.3,
                      }}
                    >
                      {formatDate(cxc.fechaEmision)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: isMobile ? 2 : 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        mb: 0.5,
                        textTransform: 'uppercase',
                        fontSize: isMobile ? '0.7rem' : '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      Fecha de Vencimiento
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: isMobile ? 'flex-start' : 'center',
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant={isMobile ? 'body2' : 'body1'}
                        sx={{
                          fontWeight: 600,
                          color: cxc.estaVencido
                            ? 'error.main'
                            : 'text.primary',
                          lineHeight: 1.3,
                        }}
                      >
                        {formatDate(cxc.fechaVencimiento)}
                      </Typography>
                      {cxc.estaVencido && (
                        <Chip
                          label={`${cxc.diasVencimiento} días vencido`}
                          color="error"
                          size="small"
                          sx={{
                            height: isMobile ? 20 : 24,
                            fontSize: isMobile ? '0.65rem' : '0.75rem',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: isMobile ? 2 : 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        mb: 0.5,
                        textTransform: 'uppercase',
                        fontSize: isMobile ? '0.7rem' : '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      Condición de Pago
                    </Typography>
                    <Typography
                      variant={isMobile ? 'body2' : 'body1'}
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1.3,
                      }}
                    >
                      {cxc.condicionPago || 'N/A'}
                    </Typography>
                    <Typography
                      variant={isMobile ? 'caption' : 'body2'}
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.2,
                        fontSize: isMobile ? '0.7rem' : undefined,
                      }}
                    >
                      {cxc.diasCredito} días
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: isMobile ? 2 : 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        mb: 0.5,
                        textTransform: 'uppercase',
                        fontSize: isMobile ? '0.7rem' : '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      Localidad
                    </Typography>
                    <Typography
                      variant={isMobile ? 'body2' : 'body1'}
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1.3,
                        wordBreak: 'break-word',
                      }}
                    >
                      {cxc.localidad?.nombre || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: isMobile ? 1 : 2 }} />
                  <Box sx={{ mb: 0 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        mb: 0.5,
                        textTransform: 'uppercase',
                        fontSize: isMobile ? '0.7rem' : '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      Creado por
                    </Typography>
                    <Typography
                      variant={isMobile ? 'body2' : 'body1'}
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1.3,
                      }}
                    >
                      {cxc.creadoPor || 'N/A'}
                    </Typography>
                    <Typography
                      variant={isMobile ? 'caption' : 'body2'}
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.2,
                        fontSize: isMobile ? '0.7rem' : undefined,
                      }}
                    >
                      {formatDateTime(cxc.fechaCreacion)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Payment History */}
        <Grid item xs={12} lg={4}>
          <StyledCard>
            <CardHeader
              title="Historial de Movimientos"
              titleTypographyProps={{
                variant: isMobile ? 'subtitle1' : 'h6',
                fontWeight: 600,
              }}
              sx={{ pb: isMobile ? 1 : 2 }}
            />
            <CardContent sx={{ pt: isMobile ? 1 : 2 }}>
              {cxc.movimientos && cxc.movimientos.length > 0 ? (
                <Timeline
                  sx={{
                    p: 0,
                    '& .MuiTimelineItem-root': {
                      minHeight: isMobile ? 'auto' : 70,
                    },
                    '& .MuiTimelineItem-root:before': {
                      flex: isMobile ? 0.1 : 0.2,
                      padding: isMobile ? '6px 8px' : '6px 16px',
                    },
                  }}
                >
                  {cxc.movimientos.map((movimiento, index) => (
                    <TimelineItem key={movimiento.id}>
                      <TimelineSeparator>
                        <TimelineDot
                          sx={{
                            width: isMobile ? 28 : 32,
                            height: isMobile ? 28 : 32,
                            bgcolor: (theme) => {
                              const colorName = getMovementColor(
                                movimiento.tipoMovimiento,
                              )
                              switch (colorName) {
                                case 'success':
                                  return theme.palette.success.main
                                case 'info':
                                  return theme.palette.info.main
                                case 'warning':
                                  return theme.palette.warning.main
                                case 'error':
                                  return theme.palette.error.main
                                default:
                                  return theme.palette.grey[400]
                              }
                            },
                            color: (theme) => {
                              const colorName = getMovementColor(
                                movimiento.tipoMovimiento,
                              )
                              switch (colorName) {
                                case 'success':
                                  return (
                                    theme.palette.success.contrastText || '#fff'
                                  )
                                case 'info':
                                  return (
                                    theme.palette.info.contrastText || '#fff'
                                  )
                                case 'warning':
                                  return (
                                    theme.palette.warning.contrastText || '#fff'
                                  )
                                case 'error':
                                  return (
                                    theme.palette.error.contrastText || '#fff'
                                  )
                                default:
                                  return theme.palette.getContrastText(
                                    theme.palette.grey[400],
                                  )
                              }
                            },
                          }}
                        >
                          <Icon
                            icon={getMovementIcon(movimiento.tipoMovimiento)}
                            fontSize={isMobile ? '0.9rem' : '1rem'}
                          />
                        </TimelineDot>
                        {index < cxc.movimientos!.length - 1 && (
                          <TimelineConnector />
                        )}
                      </TimelineSeparator>
                      <TimelineContent
                        sx={{
                          py: isMobile ? '8px' : '12px',
                          px: isMobile ? 1 : 2,
                          pr: 0,
                        }}
                      >
                        <Typography
                          variant={isMobile ? 'caption' : 'subtitle2'}
                          sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            fontSize: isMobile ? '0.75rem' : undefined,
                            lineHeight: 1.2,
                          }}
                        >
                          {movimiento.tipoMovimientoDescripcion}
                        </Typography>
                        <Typography
                          variant={isMobile ? 'body2' : 'h6'}
                          sx={{
                            fontWeight: 700,
                            color: 'success.main',
                            mb: 0.5,
                            fontSize: isMobile ? '1rem' : undefined,
                            lineHeight: 1.2,
                          }}
                        >
                          {formatCurrency(movimiento.monto)}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            fontSize: isMobile ? '0.65rem' : '0.75rem',
                            lineHeight: 1.2,
                            mb: 0.25,
                          }}
                        >
                          {formatDateTime(movimiento.fechaMovimiento)}
                        </Typography>
                        {movimiento.numeroReferencia && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: 'block',
                              fontSize: isMobile ? '0.65rem' : '0.75rem',
                              lineHeight: 1.2,
                              mb: 0.25,
                            }}
                          >
                            Ref: {movimiento.numeroReferencia}
                          </Typography>
                        )}
                        {movimiento.observaciones && (
                          <Typography
                            variant={isMobile ? 'caption' : 'body2'}
                            color="text.secondary"
                            sx={{
                              mt: 0.5,
                              fontSize: isMobile ? '0.7rem' : undefined,
                              lineHeight: 1.3,
                              wordBreak: 'break-word',
                            }}
                          >
                            {movimiento.observaciones}
                          </Typography>
                        )}
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              ) : (
                <Box sx={{ textAlign: 'center', py: isMobile ? 3 : 4 }}>
                  <Icon
                    icon="mdi:timeline-outline"
                    fontSize={isMobile ? '2.5rem' : '3rem'}
                    color="disabled"
                  />
                  <Typography
                    variant={isMobile ? 'caption' : 'body2'}
                    color="text.secondary"
                    sx={{
                      mt: 2,
                      fontSize: isMobile ? '0.75rem' : undefined,
                    }}
                  >
                    No hay movimientos registrados
                  </Typography>
                </Box>
              )}
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Modal Components */}
      <PaymentModal
        open={paymentModalOpen}
        onClose={handleClosePaymentModal}
        cxc={cxc}
      />
      <CreditNoteModal
        open={creditNoteModalOpen}
        onClose={handleCloseCreditNoteModal}
        cxc={cxc}
      />
    </Box>
  )
}

export default CxcDetailView
