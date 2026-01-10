// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Switch,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

// ** Third Party Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Components

// ** Store Imports
import { AppDispatch, RootState } from 'src/store'
import { fetchCustomer } from 'src/store/apps/clients'
import { fetchCxcByClient } from 'src/store/apps/cxc'
import { fetchData as fetchDocuments } from 'src/store/apps/documents'

// ** Utils
import formatCurrency from 'src/utils/formatCurrency'

// ** Components
import CreditNoteModal from '../cxc/components/CreditNoteModal'
import CxcCard from '../cxc/components/CxcCard'
import DebitNoteModal from '../cxc/components/DebitNoteModal'

// ** Types
import { CustomerType } from 'src/types/apps/customerType'
import { CuentaCxc } from 'src/types/apps/cxcTypes'
import { DocumentType, TipoDocumentoEnum } from 'src/types/apps/documentTypes'

interface ClientDetailViewProps {
  codigoCliente: string
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`client-tabpanel-${index}`}
      aria-labelledby={`client-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

const ClientDetailView: React.FC<ClientDetailViewProps> = ({
  codigoCliente,
}) => {
  // ** Hooks
  const theme = useTheme()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const cxcStore = useSelector((state: RootState) => state.cxc)
  const documentsStore = useSelector((state: RootState) => state.documents)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // ** State
  const [activeTab, setActiveTab] = useState(0)
  const [showOnlyCxc, setShowOnlyCxc] = useState(false)
  const [creditNoteModalOpen, setCreditNoteModalOpen] = useState(false)
  const [debitNoteModalOpen, setDebitNoteModalOpen] = useState(false)
  const [selectedCxc, setSelectedCxc] = useState<CuentaCxc | null>(null)
  const [customerInfo, setCustomerInfo] = useState<CustomerType | null>(null)
  console.log('selectedCxc', selectedCxc)
  // ** Effects
  useEffect(() => {
    if (codigoCliente) {
      // Fetch CXC data
      dispatch(fetchCxcByClient({ codigoCliente }))

      // Fetch customer details
      dispatch(fetchCustomer(codigoCliente)).then((result: any) => {
        if (result.payload?.client) {
          setCustomerInfo(result.payload.client)
        }
      })

      // Fetch all documents (orders, invoices, quotes) for this customer
      dispatch(
        fetchDocuments({
          query: '',
          pageNumber: 0,
          codigoCliente: codigoCliente,
        }),
      )
    }
  }, [dispatch, codigoCliente])

  // ** Handlers
  const handleGoBack = () => {
    router.push('/apps/clients/list')
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleViewDetail = (cxc: CuentaCxc) => {
    router.push(`/apps/cxc/detail/${cxc.numeroCxc}`)
  }

  const handleCreateCreditNote = (cxc?: CuentaCxc) => {
    setSelectedCxc(cxc || null)
    setCreditNoteModalOpen(true)
  }

  const handleCreateDebitNote = (cxc?: CuentaCxc) => {
    setSelectedCxc(cxc || null)
    setDebitNoteModalOpen(true)
  }

  const handleCloseCreditNoteModal = () => {
    setCreditNoteModalOpen(false)
    setSelectedCxc(null)
    // Refresh data
    if (codigoCliente) {
      dispatch(fetchCxcByClient({ codigoCliente }))
    }
  }

  const handleCloseDebitNoteModal = () => {
    setDebitNoteModalOpen(false)
    setSelectedCxc(null)
    // Refresh data
    if (codigoCliente) {
      dispatch(fetchCxcByClient({ codigoCliente }))
    }
  }

  // ** Computed values
  const clientData = cxcStore.clientCxcData
  const allDocumentsRaw: DocumentType[] = documentsStore.data || []
  const loadingDocuments = documentsStore.isLoading
  const totalOutstanding = clientData.reduce(
    (sum, cxc) => sum + cxc.saldoPendiente,
    0,
  )

  // Helper to check if document has CXC
  const hasCxc = (doc: DocumentType) => {
    return clientData.some(
      (c) =>
        c.numeroDocumento === doc.secuenciaDocumento ||
        c.numeroDocumento === doc.noPedidoStr,
    )
  }

  // Filter documents based on showOnlyCxc toggle
  const allDocuments = showOnlyCxc
    ? allDocumentsRaw.filter(hasCxc)
    : allDocumentsRaw

  // Calculate total from all documents
  const totalAmount = allDocuments.reduce(
    (sum: number, doc: DocumentType) => sum + doc.total,
    0,
  )
  const overdueCount = clientData.filter((cxc) => cxc.estaVencido).length
  const clientName = customerInfo?.nombre || codigoCliente

  // Filter documents by type
  const invoiceDocuments = allDocuments.filter(
    (doc: DocumentType) => doc.tipoDocumento === TipoDocumentoEnum.INVOICE,
  )
  const orderDocuments = allDocuments.filter(
    (doc: DocumentType) => doc.tipoDocumento === TipoDocumentoEnum.ORDER,
  )
  const quoteDocuments = allDocuments.filter(
    (doc: DocumentType) => doc.tipoDocumento === TipoDocumentoEnum.QUOTE,
  )

  // Filter CXCs by status
  const activeCxcs = clientData.filter((cxc) => cxc.saldoPendiente > 0)
  const paidCxcs = clientData.filter((cxc) => cxc.estado === 'Pagado')
  const overdueCxcs = clientData.filter((cxc) => cxc.estaVencido)

  // Helper function to get document status color
  const getDocumentStatusColor = (doc: DocumentType) => {
    if (doc.procesado === 1) return 'success'
    if (doc.procesado === 0) return 'warning'
    return 'default'
  }

  // Helper function to get document status label
  const getDocumentStatusLabel = (doc: DocumentType) => {
    if (doc.procesado === 1) return 'Procesado'
    if (doc.procesado === 0) return 'Pendiente'
    return 'Desconocido'
  }

  // Helper function to render document card
  const renderDocumentCard = (doc: DocumentType) => {
    // Check if this is an invoice with CXC
    const cxc = clientData.find(
      (c) =>
        c.numeroDocumento === doc.secuenciaDocumento ||
        c.numeroDocumento === doc.noPedidoStr,
    )

    // If CXC exists and has pending balance, show CxcCard
    if (cxc && cxc.saldoPendiente > 0) {
      return (
        <CxcCard
          key={doc.noPedidoStr}
          cxc={cxc}
          onViewDetail={handleViewDetail}
          onCreditNote={handleCreateCreditNote}
          onDebitNote={handleCreateDebitNote}
          compact={isMobile}
        />
      )
    }

    // Otherwise, show a simplified document card
    return (
      <Card
        key={doc.noPedidoStr}
        sx={{
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          borderLeftWidth: 3,
          borderLeftColor: `${getDocumentStatusColor(doc)}.main`,
          bgcolor: `${
            getDocumentStatusColor(doc) === 'success'
              ? theme.palette.success.main
              : theme.palette.warning.main
          }08`,
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
          },
        }}
        onClick={() =>
          router.push(`/apps/documents/preview/${doc.noPedidoStr}`)
        }
      >
        <CardContent sx={{ py: { xs: 2, md: 1.5 }, px: { xs: 2, md: 2 } }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              mb: { xs: 2, md: 1 },
            }}
          >
            <Box>
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{ fontSize: { xs: '1rem', md: '0.9rem' } }}
              >
                {doc.secuenciaDocumento || doc.noPedidoStr}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', md: '0.7rem' } }}
              >
                {new Date(doc.fecha).toLocaleDateString('es-DO')}
              </Typography>
            </Box>
            <Chip
              label={getDocumentStatusLabel(doc)}
              size="small"
              color={getDocumentStatusColor(doc) as any}
              icon={
                <Icon
                  icon={
                    doc.procesado === 1
                      ? 'mdi:check-circle'
                      : 'mdi:clock-outline'
                  }
                  fontSize="small"
                />
              }
              sx={{
                height: { xs: 24, md: 20 },
                fontSize: { xs: '0.75rem', md: '0.7rem' },
              }}
            />
          </Box>
          <Divider sx={{ my: { xs: 2, md: 1 } }} />
          <Grid container spacing={{ xs: 2, md: 1 }}>
            <Grid item xs={6} md={4}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', md: '0.65rem' } }}
              >
                Tipo
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ fontSize: { xs: '0.875rem', md: '0.75rem' } }}
              >
                {doc.tipoDocumento === TipoDocumentoEnum.INVOICE
                  ? 'Factura'
                  : doc.tipoDocumento === TipoDocumentoEnum.ORDER
                  ? 'Pedido'
                  : 'Cotización'}
              </Typography>
            </Grid>
            <Grid item xs={6} md={4}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', md: '0.65rem' } }}
              >
                Total
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ fontSize: { xs: '0.875rem', md: '0.75rem' } }}
              >
                {formatCurrency(doc.total)}
              </Typography>
            </Grid>
            {doc.vendedor && (
              <Grid item xs={12} md={4}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', md: '0.65rem' } }}
                >
                  Vendedor
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ fontSize: { xs: '0.875rem', md: '0.75rem' } }}
                >
                  {doc.vendedor.nombre}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    )
  }

  // ** Loading State
  if (cxcStore.isLoading) {
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
  if (cxcStore.error) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {cxcStore.error}
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
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Card sx={{ mb: 3, borderRadius: theme.shape.borderRadius / 4 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack
            direction={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems={isMobile ? 'flex-start' : 'center'}
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton onClick={handleGoBack} size="small">
                <Icon icon="mdi:arrow-left" />
              </IconButton>
              <Box>
                <Typography
                  variant={isMobile ? 'h5' : 'h4'}
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    cursor: 'pointer',
                    '&:hover': { color: 'primary.main' },
                  }}
                  onClick={() =>
                    router.push(`/apps/clients/list?search=${clientName}`)
                  }
                >
                  {clientName}
                </Typography>
                <Typography
                  variant="body2"
                  color="primary.main"
                  sx={{
                    mt: 0.5,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                  onClick={() =>
                    router.push(`/apps/clients/list?search=${codigoCliente}`)
                  }
                >
                  Código: {codigoCliente}
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction={isMobile ? 'column' : 'row'}
              spacing={1}
              sx={{ width: isMobile ? '100%' : 'auto' }}
            >
              <Button
                variant="contained"
                color="info"
                startIcon={<Icon icon="mdi:note-edit-outline" />}
                onClick={() => handleCreateCreditNote()}
                fullWidth={isMobile}
                size="medium"
                sx={{ minHeight: 44 }}
              >
                Nota Crédito
              </Button>
              <Button
                variant="contained"
                color="warning"
                startIcon={<Icon icon="mdi:note-plus-outline" />}
                onClick={() => handleCreateDebitNote()}
                fullWidth={isMobile}
                size="medium"
                sx={{ minHeight: 44 }}
              >
                Nota Débito
              </Button>
            </Stack>
          </Stack>

          {/* Customer Info */}
          {customerInfo && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6} md={3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Icon
                      icon="mdi:card-account-details"
                      fontSize={18}
                      color={theme.palette.text.secondary}
                    />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        RNC/Cédula
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {customerInfo.rnc || 'N/A'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Icon
                      icon="mdi:phone"
                      fontSize={18}
                      color={theme.palette.text.secondary}
                    />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Teléfono
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {customerInfo.telefono1 || 'N/A'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Icon
                      icon="mdi:email"
                      fontSize={18}
                      color={theme.palette.text.secondary}
                    />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: { xs: 100, sm: 150 },
                        }}
                      >
                        {customerInfo.email || 'N/A'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Icon
                      icon="mdi:credit-card-outline"
                      fontSize={18}
                      color={theme.palette.text.secondary}
                    />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Límite de Crédito
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(customerInfo.limiteCredito)}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={{ xs: 2, sm: 2 }} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 1,
              boxShadow: theme.shadows[2],
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[6],
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  bgcolor: `${theme.palette.primary.main}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1,
                }}
              >
                <Icon
                  icon="mdi:file-document-multiple"
                  fontSize={22}
                  color={theme.palette.primary.main}
                />
              </Box>
              <Typography
                variant="h5"
                fontWeight={700}
                color="primary.main"
                sx={{ mb: 0.5 }}
              >
                {allDocuments.length}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                Total Documentos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 1,
              boxShadow: theme.shadows[2],
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[6],
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  bgcolor: `${theme.palette.info.main}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1,
                }}
              >
                <Icon
                  icon="mdi:currency-usd"
                  fontSize={22}
                  color={theme.palette.info.main}
                />
              </Box>
              <Typography
                variant="h6"
                fontWeight={700}
                color="info.main"
                sx={{ mb: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                {formatCurrency(totalAmount)}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                Total Facturado
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 1,
              boxShadow: theme.shadows[2],
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[6],
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  bgcolor: `${theme.palette.warning.main}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1,
                }}
              >
                <Icon
                  icon="mdi:clock-outline"
                  fontSize={22}
                  color={theme.palette.warning.main}
                />
              </Box>
              <Typography
                variant="h6"
                fontWeight={700}
                color="warning.main"
                sx={{ mb: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                {formatCurrency(totalOutstanding)}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                Saldo Pendiente
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 1,
              boxShadow: theme.shadows[2],
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[6],
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  bgcolor: `${theme.palette.error.main}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1,
                }}
              >
                <Icon
                  icon="mdi:alert-circle-outline"
                  fontSize={22}
                  color={theme.palette.error.main}
                />
              </Box>
              <Typography
                variant="h5"
                fontWeight={700}
                color="error.main"
                sx={{ mb: 0.5 }}
              >
                {overdueCount}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                Vencidas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ borderRadius: 2 }}>
        {/* Filter Controls */}
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            pt: 2,
            pb: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyCxc}
                onChange={(e) => setShowOnlyCxc(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                Solo CXC
              </Typography>
            }
          />
        </Box>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="client detail tabs"
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons={isMobile ? 'auto' : false}
            sx={{
              px: { xs: 1, sm: 2 },
              '& .MuiTab-root': {
                minHeight: { xs: 56, sm: 64 },
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              },
            }}
          >
            <Tab
              label={`Todos (${allDocuments.length})`}
              icon={<Icon icon="mdi:file-document-multiple" />}
              iconPosition="start"
            />
            <Tab
              label={`Facturas (${invoiceDocuments.length})`}
              icon={<Icon icon="mdi:file-invoice" />}
              iconPosition="start"
            />
            <Tab
              label={`Pedidos (${orderDocuments.length})`}
              icon={<Icon icon="mdi:cart" />}
              iconPosition="start"
            />
            <Tab
              label={`Cotizaciones (${quoteDocuments.length})`}
              icon={<Icon icon="mdi:file-document-edit" />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          {/* All Documents Tab */}
          <TabPanel value={activeTab} index={0}>
            {loadingDocuments ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Cargando documentos...
                </Typography>
              </Box>
            ) : allDocuments.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 2,
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: `${theme.palette.primary.main}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Icon
                    icon="mdi:file-document-outline"
                    fontSize="2rem"
                    style={{ color: theme.palette.text.disabled }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{ mb: 1 }}
                >
                  No se encontraron documentos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Este cliente no tiene documentos registrados
                </Typography>
              </Box>
            ) : (
              <Stack spacing={{ xs: 2, md: 1.5 }}>
                {allDocuments.map((doc: DocumentType) =>
                  renderDocumentCard(doc),
                )}
              </Stack>
            )}
          </TabPanel>

          {/* Invoices Tab */}
          <TabPanel value={activeTab} index={1}>
            {invoiceDocuments.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 2,
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: `${theme.palette.primary.main}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Icon
                    icon="mdi:file-invoice"
                    fontSize="2rem"
                    style={{ color: theme.palette.text.disabled }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{ mb: 1 }}
                >
                  No hay facturas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No se encontraron facturas para este cliente
                </Typography>
              </Box>
            ) : (
              <Stack spacing={{ xs: 2, md: 1.5 }}>
                {invoiceDocuments.map((doc: DocumentType) =>
                  renderDocumentCard(doc),
                )}
              </Stack>
            )}
          </TabPanel>

          {/* Orders Tab */}
          <TabPanel value={activeTab} index={2}>
            {orderDocuments.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 2,
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: `${theme.palette.primary.main}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Icon
                    icon="mdi:cart"
                    fontSize="2rem"
                    style={{ color: theme.palette.text.disabled }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{ mb: 1 }}
                >
                  No hay pedidos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No se encontraron pedidos para este cliente
                </Typography>
              </Box>
            ) : (
              <Stack spacing={{ xs: 2, md: 1.5 }}>
                {orderDocuments.map((doc: DocumentType) =>
                  renderDocumentCard(doc),
                )}
              </Stack>
            )}
          </TabPanel>

          {/* Quotes Tab */}
          <TabPanel value={activeTab} index={3}>
            {quoteDocuments.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 2,
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: `${theme.palette.primary.main}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Icon
                    icon="mdi:file-document-edit"
                    fontSize="2rem"
                    style={{ color: theme.palette.text.disabled }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{ mb: 1 }}
                >
                  No hay cotizaciones
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No se encontraron cotizaciones para este cliente
                </Typography>
              </Box>
            ) : (
              <Stack spacing={{ xs: 2, md: 1.5 }}>
                {quoteDocuments.map((doc: DocumentType) =>
                  renderDocumentCard(doc),
                )}
              </Stack>
            )}
          </TabPanel>
        </CardContent>
      </Card>

      {/* Modal Components */}
      <CreditNoteModal
        open={creditNoteModalOpen}
        onClose={handleCloseCreditNoteModal}
        cxc={selectedCxc}
      />
      <DebitNoteModal
        open={debitNoteModalOpen}
        onClose={handleCloseDebitNoteModal}
        cxc={selectedCxc}
      />
    </Box>
  )
}

export default ClientDetailView
