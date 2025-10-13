// ** React Imports
import { useState, useEffect, useCallback, useMemo } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Typography,
  Collapse,
  IconButton,
  Tooltip,
  Stack,
  Fab,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
  InputAdornment,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  Slider,
  Autocomplete,
} from '@mui/material'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridPaginationModel,
} from '@mui/x-data-grid'

// ** Third Party Imports
import { useDispatch, useSelector } from 'react-redux'
import { debounce } from 'lodash'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { AppDispatch, RootState } from 'src/store'
import {
  fetchCxcList,
  setFilters,
  clearFilters,
  setFilterValue,
  setDateRangeFilter,
  setAmountRangeFilter,
  setOverdueFilter,
  setPageSize,
  setPageNumber,
  fetchCxcSummaryStats,
} from 'src/store/apps/cxc'

// ** Component Imports
import { SellerAutocomplete } from 'src/views/ui/sellerAutoComplete'
import { LocationAutocomplete } from 'src/views/ui/locationAutoComplete'
import { PaymentTypeAutocomplete } from 'src/views/ui/paymentTypeAutoComplete'

// ** Types
import {
  EstadoCxc,
  CuentaCxc,
  CxcFilters,
  MobileViewConfig,
  AdvancedFilters,
  DateRange,
  AmountRange,
} from 'src/types/apps/cxcTypes'

// ** Utils
import formatCurrency from 'src/utils/formatCurrency'

// ** Components
import CxcStatusBadge from './components/CxcStatusBadge'
import CxcCard from './components/CxcCard'

interface CellType {
  row: CuentaCxc
}

const CxcListView = () => {
  // ** Hooks
  const theme = useTheme()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.cxc)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // ** State
  const [searchValue, setSearchValue] = useState<string>('')
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false)
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [mobileView, setMobileView] = useState<MobileViewConfig>({
    showFilters: false,
    compactMode: isMobile,
    cardView: isMobile,
    selectedItems: [],
  })

  // Advanced filter state
  const [tempDateRange, setTempDateRange] = useState<{
    emission: DateRange
    due: DateRange
  }>({
    emission: { from: undefined, to: undefined },
    due: { from: undefined, to: undefined },
  })

  const [tempAmountRange, setTempAmountRange] = useState<{
    total: AmountRange
    pending: AmountRange
  }>({
    total: { min: undefined, max: undefined },
    pending: { min: undefined, max: undefined },
  })

  const [tempOverdueSettings, setTempOverdueSettings] = useState<{
    onlyOverdue: boolean
    daysRange: AmountRange
  }>({
    onlyOverdue: false,
    daysRange: { min: undefined, max: undefined },
  })

  // ** Effects
  useEffect(() => {
    dispatch(fetchCxcSummaryStats())
  }, [dispatch])

  useEffect(() => {
    dispatch(
      fetchCxcList({
        pageNumber: store.pageNumber,
        pageSize: store.pageSize,
        query: searchValue,
        filters: store.filters,
      }),
    )
  }, [dispatch, store.pageNumber, store.pageSize, searchValue, store.filters])

  // ** Debounced search
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      setSearchValue(searchTerm)
      dispatch(setPageNumber(1))
    }, 500),
    [dispatch],
  )

  // ** Handlers
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    debouncedSearch(value)
  }

  const handleStatusFilter = (estados: EstadoCxc[]) => {
    dispatch(setFilters({ estado: estados }))
  }

  const handleOverdueFilter = () => {
    const newValue = !store.filters.soloVencidas
    dispatch(setFilters({ soloVencidas: newValue }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
    setSearchValue('')
  }

  const handlePaginationChange = (model: GridPaginationModel) => {
    dispatch(setPageNumber(model.page + 1))
    dispatch(setPageSize(model.pageSize))
  }

  const handleViewDetail = useCallback(
    (cxc: CuentaCxc) => {
      router.push(`/apps/cxc/detail/${cxc.numeroCxc}`)
    },
    [router],
  )

  const handleViewClient = useCallback(
    (cxc: CuentaCxc) => {
      router.push(`/apps/cxc/client/${cxc.codigoCliente}`)
    },
    [router],
  )

  const handlePayment = useCallback((cxc: CuentaCxc) => {
    // TODO: Open payment dialog
    toast.success(`Procesar pago para ${cxc.numeroCxc}`)
  }, [])

  const handleCreditNote = useCallback((cxc: CuentaCxc) => {
    // TODO: Open credit note dialog
    toast.success(`Crear nota de crédito para ${cxc.numeroCxc}`)
  }, [])

  const handleReturn = useCallback((cxc: CuentaCxc) => {
    // TODO: Open return dialog
    toast.success(`Procesar devolución para ${cxc.numeroCxc}`)
  }, [])

  // ** Advanced Filter Handlers
  const handleDateRangeChange = (
    type: 'emission' | 'due',
    field: 'from' | 'to',
    value: string | null,
  ) => {
    const newRange = { ...tempDateRange }
    newRange[type][field] = value || undefined
    setTempDateRange(newRange)

    dispatch(
      setDateRangeFilter({
        type,
        from: newRange[type].from,
        to: newRange[type].to,
      }),
    )
  }

  const handleAmountRangeChange = (
    type: 'total' | 'pending',
    field: 'min' | 'max',
    value: number | undefined,
  ) => {
    const newRange = { ...tempAmountRange }
    newRange[type][field] = value
    setTempAmountRange(newRange)

    dispatch(
      setAmountRangeFilter({
        type,
        min: newRange[type].min,
        max: newRange[type].max,
      }),
    )
  }

  const handleOverdueFilterAdvanced = (
    onlyOverdue?: boolean,
    minDays?: number,
    maxDays?: number,
  ) => {
    dispatch(setOverdueFilter({ onlyOverdue, minDays, maxDays }))
  }

  const handleFilterValueChange = (key: keyof CxcFilters, value: any) => {
    dispatch(setFilterValue({ key, value }))
  }

  // ** Autocomplete Handlers
  const handleSellerChange = (sellerCode: string) => {
    dispatch(
      setFilterValue({ key: 'codigoVendedor', value: sellerCode || undefined }),
    )
  }

  const handleLocationChange = (locationId: string) => {
    dispatch(
      setFilterValue({
        key: 'localidadId',
        value: locationId ? parseInt(locationId) : undefined,
      }),
    )
  }

  const handlePaymentTypeChange = (paymentType: string) => {
    dispatch(
      setFilterValue({ key: 'condicionPago', value: paymentType || undefined }),
    )
  }

  const handleClearAdvancedFilters = () => {
    dispatch(clearFilters())
    setSearchValue('')
    setTempDateRange({
      emission: { from: undefined, to: undefined },
      due: { from: undefined, to: undefined },
    })
    setTempAmountRange({
      total: { min: undefined, max: undefined },
      pending: { min: undefined, max: undefined },
    })
    setTempOverdueSettings({
      onlyOverdue: false,
      daysRange: { min: undefined, max: undefined },
    })
  }

  // ** Computed values
  const hasActiveFilters = useMemo(() => {
    return Object.keys(store.filters).length > 0 || searchValue.length > 0
  }, [store.filters, searchValue])

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es })
    } catch {
      return 'Fecha inválida'
    }
  }

  // ** Columns Definition for Desktop
  const columns: GridColDef[] = [
    {
      flex: 0.15,
      minWidth: 140,
      field: 'numeroCxc',
      headerName: 'No. CXC',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon icon="mdi:file-document-outline" fontSize="1rem" />
          <Typography
            component={Link}
            href={`/apps/cxc/detail/${row.numeroCxc}`}
            variant="body2"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 600,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {row.numeroCxc}
          </Typography>
        </Box>
      ),
    },
    {
      flex: 0.2,
      minWidth: 180,
      field: 'cliente',
      headerName: 'Cliente',
      renderCell: ({ row }: CellType) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {row.cliente?.nombre || 'N/A'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.codigoCliente}
          </Typography>
        </Box>
      ),
    },
    {
      flex: 0.12,
      minWidth: 120,
      field: 'numeroDocumento',
      headerName: 'No. Documento',
      renderCell: ({ row }: CellType) => (
        <Typography variant="body2">{row.numeroDocumento}</Typography>
      ),
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'fechaEmision',
      headerName: 'F. Emisión',
      renderCell: ({ row }: CellType) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {formatDate(row.fechaEmision)}
        </Typography>
      ),
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'fechaVencimiento',
      headerName: 'F. Vencimiento',
      renderCell: ({ row }: CellType) => {
        const isOverdue = row.estaVencido
        return (
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.875rem',
              color: isOverdue ? 'error.main' : 'text.primary',
              fontWeight: isOverdue ? 600 : 400,
            }}
          >
            {formatDate(row.fechaVencimiento)}
          </Typography>
        )
      },
    },
    {
      flex: 0.12,
      minWidth: 120,
      field: 'montoTotal',
      headerName: 'Total',
      renderCell: ({ row }: CellType) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {formatCurrency(row.montoTotal)}
        </Typography>
      ),
    },
    {
      flex: 0.12,
      minWidth: 120,
      field: 'saldoPendiente',
      headerName: 'Pendiente',
      renderCell: ({ row }: CellType) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: row.saldoPendiente > 0 ? 'warning.main' : 'success.main',
          }}
        >
          {formatCurrency(row.saldoPendiente)}
        </Typography>
      ),
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'estado',
      headerName: 'Estado',
      renderCell: ({ row }: CellType) => <CxcStatusBadge status={row.estado} />,
    },
    {
      flex: 0.08,
      minWidth: 80,
      field: 'diasVencimiento',
      headerName: 'Días',
      renderCell: ({ row }: CellType) => {
        if (!row.estaVencido) return <Typography variant="body2">-</Typography>

        return (
          <Chip
            label={row.diasVencimiento}
            color="error"
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.75rem' }}
          />
        )
      },
    },
  ]

  // ** Summary Stats Cards
  const SummaryCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={6} sm={3}>
        <Paper
          elevation={2}
          sx={{
            p: 2,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: isSmallMobile ? '1rem' : '1.25rem',
            }}
          >
            {store.summaryStats?.totalCuentas || 0}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: isSmallMobile ? '0.7rem' : '0.75rem' }}
          >
            Total CXC
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={6} sm={3}>
        <Paper
          elevation={2}
          sx={{
            p: 2,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: isSmallMobile ? '0.9rem' : '1.1rem',
            }}
          >
            {formatCurrency(store.summaryStats?.montoTotalPendiente || 0)}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: isSmallMobile ? '0.7rem' : '0.75rem' }}
          >
            Pendiente
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={6} sm={3}>
        <Paper
          elevation={2}
          sx={{
            p: 2,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: isSmallMobile ? '1rem' : '1.25rem',
            }}
          >
            {store.summaryStats?.cuentasVencidas || 0}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: isSmallMobile ? '0.7rem' : '0.75rem' }}
          >
            Vencidas
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={6} sm={3}>
        <Paper
          elevation={2}
          sx={{
            p: 2,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: isSmallMobile ? '0.85rem' : '1rem',
            }}
          >
            {store.summaryStats?.tasaCobranza?.toFixed(1) || 0}%
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: isSmallMobile ? '0.7rem' : '0.75rem' }}
          >
            Tasa Cobranza
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  )

  // ** Mobile Filters Drawer
  const FiltersDrawer = () => (
    <SwipeableDrawer
      anchor="bottom"
      open={filtersDrawerOpen}
      onClose={() => setFiltersDrawerOpen(false)}
      onOpen={() => setFiltersDrawerOpen(true)}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '90vh',
          overflow: 'auto',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
          Filtros
        </Typography>

        <Stack spacing={3}>
          {/* Basic Filters */}
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              multiple
              value={
                Array.isArray(store.filters.estado)
                  ? store.filters.estado
                  : store.filters.estado
                  ? [store.filters.estado]
                  : []
              }
              onChange={(e) =>
                handleStatusFilter(e.target.value as EstadoCxc[])
              }
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as EstadoCxc[]).map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {Object.values(EstadoCxc).map((estado) => (
                <MenuItem key={estado} value={estado}>
                  {estado}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={store.filters.soloVencidas || false}
                onChange={(e) =>
                  handleFilterValueChange('soloVencidas', e.target.checked)
                }
                color="error"
              />
            }
            label="Solo Cuentas Vencidas"
          />

          {/* Advanced Filters - Mobile Accordions */}
          <Accordion>
            <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
              <Typography variant="subtitle2">Cliente y Documento</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Código Cliente"
                  value={store.filters.codigoCliente || ''}
                  onChange={(e) =>
                    handleFilterValueChange(
                      'codigoCliente',
                      e.target.value || undefined,
                    )
                  }
                />
                <TextField
                  fullWidth
                  label="Nombre Cliente"
                  value={store.filters.nombreCliente || ''}
                  onChange={(e) =>
                    handleFilterValueChange(
                      'nombreCliente',
                      e.target.value || undefined,
                    )
                  }
                />
                <TextField
                  fullWidth
                  label="No. Documento"
                  value={store.filters.numeroDocumento || ''}
                  onChange={(e) =>
                    handleFilterValueChange(
                      'numeroDocumento',
                      e.target.value || undefined,
                    )
                  }
                />
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
              <Typography variant="subtitle2">Fechas</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <DatePicker
                  selected={
                    tempDateRange.emission.from
                      ? new Date(tempDateRange.emission.from)
                      : null
                  }
                  onChange={(date) =>
                    handleDateRangeChange(
                      'emission',
                      'from',
                      date?.toISOString() || null,
                    )
                  }
                  customInput={
                    <TextField
                      fullWidth
                      size="small"
                      label="Emisión - Desde"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  }
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Seleccionar fecha"
                />
                <DatePicker
                  selected={
                    tempDateRange.emission.to
                      ? new Date(tempDateRange.emission.to)
                      : null
                  }
                  onChange={(date) =>
                    handleDateRangeChange(
                      'emission',
                      'to',
                      date?.toISOString() || null,
                    )
                  }
                  customInput={
                    <TextField
                      fullWidth
                      size="small"
                      label="Emisión - Hasta"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  }
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Seleccionar fecha"
                />
                <DatePicker
                  selected={
                    tempDateRange.due.from
                      ? new Date(tempDateRange.due.from)
                      : null
                  }
                  onChange={(date) =>
                    handleDateRangeChange(
                      'due',
                      'from',
                      date?.toISOString() || null,
                    )
                  }
                  customInput={
                    <TextField
                      fullWidth
                      size="small"
                      label="Vencimiento - Desde"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  }
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Seleccionar fecha"
                />
                <DatePicker
                  selected={
                    tempDateRange.due.to ? new Date(tempDateRange.due.to) : null
                  }
                  onChange={(date) =>
                    handleDateRangeChange(
                      'due',
                      'to',
                      date?.toISOString() || null,
                    )
                  }
                  customInput={
                    <TextField
                      fullWidth
                      size="small"
                      label="Vencimiento - Hasta"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  }
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Seleccionar fecha"
                />
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
              <Typography variant="subtitle2">Montos</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Monto Total - Mínimo"
                  type="number"
                  value={tempAmountRange.total.min || ''}
                  onChange={(e) =>
                    handleAmountRangeChange(
                      'total',
                      'min',
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Monto Total - Máximo"
                  type="number"
                  value={tempAmountRange.total.max || ''}
                  onChange={(e) =>
                    handleAmountRangeChange(
                      'total',
                      'max',
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Saldo Pendiente - Mínimo"
                  type="number"
                  value={tempAmountRange.pending.min || ''}
                  onChange={(e) =>
                    handleAmountRangeChange(
                      'pending',
                      'min',
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Saldo Pendiente - Máximo"
                  type="number"
                  value={tempAmountRange.pending.max || ''}
                  onChange={(e) =>
                    handleAmountRangeChange(
                      'pending',
                      'max',
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
              <Typography variant="subtitle2">Otros</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <SellerAutocomplete
                  selectedSellers={store.filters.codigoVendedor || ''}
                  callBack={handleSellerChange}
                  size="small"
                />
                <LocationAutocomplete
                  selectedLocation={store.filters.localidadId?.toString() || ''}
                  callBack={handleLocationChange}
                  size="small"
                />
                <PaymentTypeAutocomplete
                  selectedPaymentType={store.filters.condicionPago || ''}
                  callBack={handlePaymentTypeChange}
                  size="small"
                />
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearAdvancedFilters}
              disabled={!hasActiveFilters}
            >
              Limpiar
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setFiltersDrawerOpen(false)}
            >
              Aplicar
            </Button>
          </Stack>
        </Stack>
      </Box>
    </SwipeableDrawer>
  )

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Summary Stats */}
      <SummaryCards />

      {/* Main Content Card */}
      <Card>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
                Cuentas por Cobrar
              </Typography>
              {store.isLoading && <LinearProgress sx={{ width: 100 }} />}
            </Box>
          }
          action={
            <Stack direction="row" spacing={1}>
              {hasActiveFilters && (
                <Button
                  variant="outlined"
                  size={isSmallMobile ? 'small' : 'medium'}
                  startIcon={<Icon icon="mdi:filter-remove-outline" />}
                  onClick={handleClearFilters}
                >
                  {isSmallMobile ? 'Limpiar' : 'Limpiar Filtros'}
                </Button>
              )}

              <Button
                variant="contained"
                size={isSmallMobile ? 'small' : 'medium'}
                startIcon={<Icon icon="mdi:file-chart-outline" />}
                onClick={() => router.push('/apps/cxc/reports')}
              >
                {isSmallMobile ? 'Reportes' : 'Ver Reportes'}
              </Button>
            </Stack>
          }
        />

        <CardContent>
          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Buscar por No. CXC, No. Documento o Cliente..."
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon="mdi:magnify" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Desktop Filters */}
          {!isMobile && (
            <Collapse in={mobileView.showFilters} sx={{ mb: 3 }}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                {/* Basic Filters Row */}
                <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Estado</InputLabel>
                      <Select
                        multiple
                        value={
                          Array.isArray(store.filters.estado)
                            ? store.filters.estado
                            : store.filters.estado
                            ? [store.filters.estado]
                            : []
                        }
                        onChange={(e) =>
                          handleStatusFilter(e.target.value as EstadoCxc[])
                        }
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                          >
                            {(selected as EstadoCxc[]).map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {Object.values(EstadoCxc).map((estado) => (
                          <MenuItem key={estado} value={estado}>
                            {estado}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <SellerAutocomplete
                      selectedSellers={store.filters.codigoVendedor || ''}
                      callBack={handleSellerChange}
                      size="medium"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <LocationAutocomplete
                      selectedLocation={
                        store.filters.localidadId?.toString() || ''
                      }
                      callBack={handleLocationChange}
                      size="medium"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={store.filters.soloVencidas || false}
                          onChange={(e) =>
                            handleFilterValueChange(
                              'soloVencidas',
                              e.target.checked,
                            )
                          }
                          color="error"
                        />
                      }
                      label="Solo Vencidas"
                    />
                  </Grid>
                </Grid>

                {/* Advanced Filters Toggle */}
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="text"
                    onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}
                    startIcon={
                      <Icon
                        icon={
                          advancedFiltersOpen
                            ? 'mdi:chevron-up'
                            : 'mdi:chevron-down'
                        }
                      />
                    }
                  >
                    Filtros Avanzados
                  </Button>
                </Box>

                {/* Advanced Filters */}
                <Collapse in={advancedFiltersOpen}>
                  <Box
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 2,
                    }}
                  >
                    {/* Client and Document Filters */}
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<Icon icon="mdi:chevron-down" />}
                      >
                        <Typography variant="subtitle2">
                          Cliente y Documento
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Código Cliente"
                              value={store.filters.codigoCliente || ''}
                              onChange={(e) =>
                                handleFilterValueChange(
                                  'codigoCliente',
                                  e.target.value || undefined,
                                )
                              }
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Nombre Cliente"
                              value={store.filters.nombreCliente || ''}
                              onChange={(e) =>
                                handleFilterValueChange(
                                  'nombreCliente',
                                  e.target.value || undefined,
                                )
                              }
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="No. Documento"
                              value={store.filters.numeroDocumento || ''}
                              onChange={(e) =>
                                handleFilterValueChange(
                                  'numeroDocumento',
                                  e.target.value || undefined,
                                )
                              }
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Secuencia Documento"
                              value={store.filters.secuenciaDocumento || ''}
                              onChange={(e) =>
                                handleFilterValueChange(
                                  'secuenciaDocumento',
                                  e.target.value || undefined,
                                )
                              }
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>

                    {/* Date Filters */}
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<Icon icon="mdi:chevron-down" />}
                      >
                        <Typography variant="subtitle2">
                          Rangos de Fecha
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <DatePicker
                              selected={
                                tempDateRange.emission.from
                                  ? new Date(tempDateRange.emission.from)
                                  : null
                              }
                              onChange={(date) =>
                                handleDateRangeChange(
                                  'emission',
                                  'from',
                                  date?.toISOString() || null,
                                )
                              }
                              customInput={
                                <TextField
                                  fullWidth
                                  label="Emisión - Desde"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                              }
                              dateFormat="dd/MM/yyyy"
                              placeholderText="Seleccionar fecha"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <DatePicker
                              selected={
                                tempDateRange.emission.to
                                  ? new Date(tempDateRange.emission.to)
                                  : null
                              }
                              onChange={(date) =>
                                handleDateRangeChange(
                                  'emission',
                                  'to',
                                  date?.toISOString() || null,
                                )
                              }
                              customInput={
                                <TextField
                                  fullWidth
                                  label="Emisión - Hasta"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                              }
                              dateFormat="dd/MM/yyyy"
                              placeholderText="Seleccionar fecha"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <DatePicker
                              selected={
                                tempDateRange.due.from
                                  ? new Date(tempDateRange.due.from)
                                  : null
                              }
                              onChange={(date) =>
                                handleDateRangeChange(
                                  'due',
                                  'from',
                                  date?.toISOString() || null,
                                )
                              }
                              customInput={
                                <TextField
                                  fullWidth
                                  label="Vencimiento - Desde"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                              }
                              dateFormat="dd/MM/yyyy"
                              placeholderText="Seleccionar fecha"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <DatePicker
                              selected={
                                tempDateRange.due.to
                                  ? new Date(tempDateRange.due.to)
                                  : null
                              }
                              onChange={(date) =>
                                handleDateRangeChange(
                                  'due',
                                  'to',
                                  date?.toISOString() || null,
                                )
                              }
                              customInput={
                                <TextField
                                  fullWidth
                                  label="Vencimiento - Hasta"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                              }
                              dateFormat="dd/MM/yyyy"
                              placeholderText="Seleccionar fecha"
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>

                    {/* Amount Filters */}
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<Icon icon="mdi:chevron-down" />}
                      >
                        <Typography variant="subtitle2">
                          Rangos de Monto
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Monto Total - Mínimo"
                              type="number"
                              value={tempAmountRange.total.min || ''}
                              onChange={(e) =>
                                handleAmountRangeChange(
                                  'total',
                                  'min',
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined,
                                )
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    $
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Monto Total - Máximo"
                              type="number"
                              value={tempAmountRange.total.max || ''}
                              onChange={(e) =>
                                handleAmountRangeChange(
                                  'total',
                                  'max',
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined,
                                )
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    $
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Saldo Pendiente - Mínimo"
                              type="number"
                              value={tempAmountRange.pending.min || ''}
                              onChange={(e) =>
                                handleAmountRangeChange(
                                  'pending',
                                  'min',
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined,
                                )
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    $
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Saldo Pendiente - Máximo"
                              type="number"
                              value={tempAmountRange.pending.max || ''}
                              onChange={(e) =>
                                handleAmountRangeChange(
                                  'pending',
                                  'max',
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined,
                                )
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    $
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>

                    {/* Payment Condition Filter */}
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<Icon icon="mdi:chevron-down" />}
                      >
                        <Typography variant="subtitle2">
                          Condición de Pago
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <PaymentTypeAutocomplete
                          selectedPaymentType={
                            store.filters.condicionPago || ''
                          }
                          callBack={handlePaymentTypeChange}
                          size="medium"
                        />
                      </AccordionDetails>
                    </Accordion>

                    {/* Clear Advanced Filters */}
                    <Box sx={{ mt: 2, textAlign: 'right' }}>
                      <Button
                        variant="outlined"
                        onClick={handleClearAdvancedFilters}
                        disabled={!hasActiveFilters}
                        startIcon={<Icon icon="mdi:filter-remove" />}
                      >
                        Limpiar Todos los Filtros
                      </Button>
                    </Box>
                  </Box>
                </Collapse>
              </Paper>
            </Collapse>
          )}

          {/* Toggle Filters Button for Desktop */}
          {!isMobile && (
            <Box sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                onClick={() =>
                  setMobileView((prev) => ({
                    ...prev,
                    showFilters: !prev.showFilters,
                  }))
                }
                startIcon={
                  <Icon
                    icon={
                      mobileView.showFilters
                        ? 'mdi:chevron-up'
                        : 'mdi:filter-variant'
                    }
                  />
                }
              >
                {mobileView.showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </Button>
            </Box>
          )}

          {/* Content Display */}
          {isMobile ? (
            /* Mobile Card View */
            <Box>
              {store.data.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Icon
                    icon="mdi:file-document-outline"
                    fontSize="3rem"
                    color="disabled"
                  />
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    No se encontraron cuentas por cobrar
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {store.data.map((cxc) => (
                    <CxcCard
                      key={cxc.id}
                      cxc={cxc}
                      onViewDetail={handleViewDetail}
                      onViewClient={handleViewClient}
                      onPayment={handlePayment}
                      onCreditNote={handleCreditNote}
                      onReturn={handleReturn}
                      compact={mobileView.compactMode}
                    />
                  ))}
                </Stack>
              )}

              {/* Mobile Pagination */}
              {store.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton
                      disabled={store.pageNumber === 1}
                      onClick={() =>
                        dispatch(setPageNumber(store.pageNumber - 1))
                      }
                    >
                      <Icon icon="mdi:chevron-left" />
                    </IconButton>

                    <Typography variant="body2">
                      {store.pageNumber} de {store.totalPages}
                    </Typography>

                    <IconButton
                      disabled={store.pageNumber === store.totalPages}
                      onClick={() =>
                        dispatch(setPageNumber(store.pageNumber + 1))
                      }
                    >
                      <Icon icon="mdi:chevron-right" />
                    </IconButton>
                  </Stack>
                </Box>
              )}
            </Box>
          ) : (
            /* Desktop Data Grid */
            <DataGrid
              autoHeight
              pagination
              rows={store.data}
              columns={columns}
              loading={store.isLoading}
              checkboxSelection
              disableRowSelectionOnClick
              paginationModel={{
                page: store.pageNumber - 1,
                pageSize: store.pageSize,
              }}
              onPaginationModelChange={handlePaginationChange}
              onRowSelectionModelChange={setSelectedRows}
              rowCount={store.totalResults}
              paginationMode="server"
              getRowId={(row) => row.id}
              sx={{
                '& .MuiDataGrid-row.overdue': {
                  backgroundColor: 'rgba(255, 82, 82, 0.04)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 82, 82, 0.08)',
                  },
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'grey.50',
                  borderRadius: '8px 8px 0 0',
                },
              }}
              getRowClassName={(params) => {
                return params.row.estaVencido ? 'overdue' : ''
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Mobile FAB for Filters */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
          onClick={() => setFiltersDrawerOpen(true)}
        >
          <Icon icon="mdi:filter-variant" />
        </Fab>
      )}

      {/* Mobile Filters Drawer */}
      <FiltersDrawer />
    </Box>
  )
}

export default CxcListView
