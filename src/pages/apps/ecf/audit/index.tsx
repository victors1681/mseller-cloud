// ** React Imports
import { forwardRef, useCallback, useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  debounce,
  Divider,
  FormControl,
  Hidden,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'
import { es } from 'date-fns/locale'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchEcfDocuments,
  retryEcfDocumentProcessing,
  toggleDetailModal,
  updateFilters,
} from 'src/store/apps/ecf/ecfDocumentosSlice'

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'
import {
  EcfDocumentoFilters,
  EcfDocumentoType,
  EcfDocumentType,
  EcfStatusEnum,
  ecfStatusObj,
  JobStatus,
  jobStatusColors,
  TipoDocumento,
} from 'src/types/apps/ecfDocumentoTypes'

// ** Custom Component Imports
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import EcfDocumentDetailModal from 'src/views/apps/ecf/audit/EcfDocumentDetailModal'
import { useCustomerSearchDialog } from 'src/views/ui/customerSearchDialog/useCustomerSearchDialog'
import { LocationAutocomplete } from 'src/views/ui/locationAutoComplete'
import { SellerAutocomplete } from 'src/views/ui/sellerAutoComplete'

// ** Styled Components
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

/* eslint-disable */
const CustomInput = forwardRef((props: any, ref) => {
  const startDate =
    props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate =
    props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates
    ? props.setDates([])
    : null
  const updatedProps = { ...props }
  delete updatedProps.setDates

  return (
    <TextField
      fullWidth
      inputRef={ref}
      {...updatedProps}
      label={props.label || ''}
      value={value}
    />
  )
})
/* eslint-enable */

const EcfAuditPage = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.ecfDocumentos)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()

  // ** State
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  })

  // ** Local Filters State (synced with URL)
  const [filters, setFilters] = useState<EcfDocumentoFilters>({
    pageNumber: 1,
    pageSize: 20,
  })

  // ** Search value
  const [value, setValue] = useState<string>('')

  // ** Customer Search Dialog
  const customerDialog = useCustomerSearchDialog({
    onCustomerSelect: (customer) => {
      setSelectedCustomer(customer)
      handleFilterChange('codigoCliente', customer.codigo)
    },
  })

  // ** URL Sync Functions
  const updateURL = useCallback(
    (newFilters: EcfDocumentoFilters) => {
      const query: any = {}

      // Only add non-empty values to URL
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query[key] = value
        }
      })

      router.push(
        {
          pathname: router.pathname,
          query,
        },
        undefined,
        { shallow: true },
      )
    },
    [router],
  )

  const getFiltersFromURL = useCallback((): EcfDocumentoFilters => {
    const query = router.query
    const urlFilters: EcfDocumentoFilters = {
      pageNumber: 1,
      pageSize: 20,
    }

    // Parse URL parameters
    if (query.documentoId) urlFilters.documentoId = String(query.documentoId)
    if (query.codigoCliente)
      urlFilters.codigoCliente = String(query.codigoCliente)
    if (query.codigoVendedor)
      urlFilters.codigoVendedor = String(query.codigoVendedor)
    if (query.ncf) urlFilters.ncf = String(query.ncf)
    if (query.statusEcf) urlFilters.statusEcf = String(query.statusEcf)
    if (query.tipoDocumentoEcf)
      urlFilters.tipoDocumentoEcf = String(
        query.tipoDocumentoEcf,
      ) as EcfDocumentType
    if (query.tipoDocumento)
      urlFilters.tipoDocumento = String(query.tipoDocumento) as TipoDocumento
    if (query.localidadId) urlFilters.localidadId = Number(query.localidadId)
    if (query.tipoeCF) urlFilters.tipoeCF = Number(query.tipoeCF)
    if (query.jobStatus)
      urlFilters.jobStatus = Number(query.jobStatus) as JobStatus
    if (query.fechaCreacionDesde)
      urlFilters.fechaCreacionDesde = String(query.fechaCreacionDesde)
    if (query.fechaCreacionHasta)
      urlFilters.fechaCreacionHasta = String(query.fechaCreacionHasta)
    if (query.fechaDocumentoDesde)
      urlFilters.fechaDocumentoDesde = String(query.fechaDocumentoDesde)
    if (query.fechaDocumentoHasta)
      urlFilters.fechaDocumentoHasta = String(query.fechaDocumentoHasta)
    if (query.ncfAutoActualizado)
      urlFilters.ncfAutoActualizado = query.ncfAutoActualizado === 'true'
    if (query.asignacionAutomatica)
      urlFilters.asignacionAutomatica = query.asignacionAutomatica === 'true'
    if (query.pageNumber) urlFilters.pageNumber = Number(query.pageNumber)
    if (query.pageSize) urlFilters.pageSize = Number(query.pageSize)

    return urlFilters
  }, [router.query])

  // ** Filter Handlers
  const handleFilterChange = useCallback(
    (field: keyof EcfDocumentoFilters, value: any) => {
      const newFilters = {
        ...filters,
        [field]: value,
        pageNumber: 1, // Reset to first page when filters change
      }
      setFilters(newFilters)
      dispatch(updateFilters(newFilters))
      updateURL(newFilters)

      // Auto-apply filters
      dispatch(fetchEcfDocuments(newFilters))
    },
    [filters, dispatch, updateURL],
  )

  const handleClearFilters = useCallback(() => {
    const clearedFilters: EcfDocumentoFilters = {
      pageNumber: 1,
      pageSize: filters.pageSize || 20,
    }
    setFilters(clearedFilters)
    setSelectedCustomer(null)
    setValue('')
    dispatch(updateFilters(clearedFilters))
    updateURL(clearedFilters)
    dispatch(fetchEcfDocuments(clearedFilters))
  }, [filters.pageSize, dispatch, updateURL])

  // ** Initialize from URL on mount
  useEffect(() => {
    if (router.isReady) {
      const urlFilters = getFiltersFromURL()
      setFilters(urlFilters)
      if (urlFilters.documentoId) {
        setValue(urlFilters.documentoId)
      }
      dispatch(updateFilters(urlFilters))
      dispatch(fetchEcfDocuments(urlFilters))
    }
  }, [router.isReady, getFiltersFromURL, dispatch])

  // ** Pagination Effect
  useEffect(() => {
    if (
      paginationModel.page !== (filters.pageNumber || 1) - 1 ||
      paginationModel.pageSize !== (filters.pageSize || 20)
    ) {
      const newFilters = {
        ...filters,
        pageNumber: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      }
      setFilters(newFilters)
      dispatch(updateFilters(newFilters))
      updateURL(newFilters)
      dispatch(fetchEcfDocuments(newFilters))
    }
  }, [paginationModel, filters, dispatch, updateURL])

  // ** Search Handler
  const handleFilter = useCallback(
    debounce((val: string) => {
      setValue(val)
      handleFilterChange('documentoId', val)
    }, 500),
    [handleFilterChange],
  )

  const handlePagination = (model: any) => {
    setPaginationModel(model)
  }

  const handleRetryProcessing = (documento: EcfDocumentoType) => {
    dispatch(
      retryEcfDocumentProcessing({
        id: documento.id,
        documentoId: documento.documentoId,
      }),
    )
  }

  const handleViewDetails = (documento: EcfDocumentoType) => {
    dispatch(toggleDetailModal(documento))
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-'
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es })
    } catch {
      return dateString
    }
  }

  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return 'default'
    return ecfStatusObj[status] || 'default'
  }

  const getJobStatusColor = (status: JobStatus | null | undefined) => {
    if (status === null || status === undefined) return 'default'
    return jobStatusColors[status] || 'default'
  }

  // ** DataGrid Columns
  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 120,
      field: 'documentoId',
      headerName: 'ID Documento',
      renderCell: ({ row }: { row: EcfDocumentoType }) => {
        return (
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {row.documentoId}
          </Typography>
        )
      },
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'tipoDocumentoEcf',
      headerName: 'Tipo ECF',
      renderCell: ({ row }: { row: EcfDocumentoType }) => {
        return (
          <Chip
            size="small"
            label={row.tipoDocumentoEcf}
            color="primary"
            variant="outlined"
          />
        )
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'codigoCliente',
      headerName: 'Cliente',
      renderCell: ({ row }: { row: EcfDocumentoType }) => {
        return (
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {row.codigoCliente}
          </Typography>
        )
      },
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'ncf',
      headerName: 'NCF',
      renderCell: ({ row }: { row: EcfDocumentoType }) => {
        return (
          <Typography
            variant="body2"
            sx={{
              color: 'text.primary',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          >
            {row.ncf || '-'}
          </Typography>
        )
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'statusEcf',
      headerName: 'Estado ECF',
      renderCell: ({ row }: { row: EcfDocumentoType }) => {
        return (
          <Chip
            size="small"
            label={row.statusEcf || 'Sin estado'}
            color={getStatusColor(row.statusEcf) as any}
            variant="filled"
          />
        )
      },
    },
    {
      flex: 0.12,
      minWidth: 100,
      field: 'jobStatus',
      headerName: 'Job Status',
      renderCell: ({ row }: { row: EcfDocumentoType }) => {
        if (row.jobStatus === null || row.jobStatus === undefined) {
          return <Typography variant="body2">-</Typography>
        }
        return (
          <Chip
            size="small"
            label={JobStatus[row.jobStatus]}
            color={getJobStatusColor(row.jobStatus) as any}
            variant="outlined"
          />
        )
      },
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'fechaCreacion',
      headerName: 'Fecha Creación',
      renderCell: ({ row }: { row: EcfDocumentoType }) => {
        return (
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {formatDate(row.fechaCreacion)}
          </Typography>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 120,
      sortable: false,
      field: 'actions',
      headerName: 'Acciones',
      renderCell: ({ row }: { row: EcfDocumentoType }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Ver Detalles">
            <IconButton
              size="small"
              onClick={() => handleViewDetails(row)}
              sx={{ color: 'text.secondary' }}
            >
              <Icon icon="mdi:eye-outline" />
            </IconButton>
          </Tooltip>
          {(row.jobStatus === JobStatus.Failed ||
            row.statusEcf === 'Error') && (
            <Tooltip title="Reintentar">
              <IconButton
                size="small"
                onClick={() => handleRetryProcessing(row)}
                sx={{ color: 'warning.main' }}
                disabled={store.isRetrying}
              >
                <Icon icon="mdi:refresh" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ]

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6">
                    Auditoría de Documentos ECF
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setShowFilters(!showFilters)}
                    startIcon={
                      <Icon
                        icon={
                          showFilters ? 'mdi:filter-minus' : 'mdi:filter-plus'
                        }
                      />
                    }
                  >
                    {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
                  </Button>
                </Box>
              }
              action={
                <TextField
                  size="small"
                  value={value}
                  placeholder="Buscar documento..."
                  onChange={(e) => handleFilter(e.target.value)}
                  sx={{ minWidth: { xs: 200, sm: 300 } }}
                  InputProps={{
                    startAdornment: (
                      <Icon
                        icon="mdi:magnify"
                        style={{ marginRight: 8, color: '#666' }}
                      />
                    ),
                  }}
                />
              }
            />

            {/* Comprehensive Filters */}
            <Collapse in={showFilters}>
              <CardContent>
                <Grid container spacing={3}>
                  {/* Basic Filters Row */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Filtros Básicos
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="ID Documento"
                          value={filters.documentoId || ''}
                          onChange={(e) =>
                            handleFilterChange('documentoId', e.target.value)
                          }
                          placeholder="Buscar por ID..."
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Código Cliente"
                            value={filters.codigoCliente || ''}
                            onChange={(e) =>
                              handleFilterChange(
                                'codigoCliente',
                                e.target.value,
                              )
                            }
                            placeholder="Código..."
                          />
                          <IconButton
                            size="small"
                            onClick={customerDialog.openDialog}
                            sx={{ border: '1px solid', borderColor: 'divider' }}
                          >
                            <Icon icon="mdi:magnify" />
                          </IconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="NCF"
                          value={filters.ncf || ''}
                          onChange={(e) =>
                            handleFilterChange('ncf', e.target.value)
                          }
                          placeholder="Buscar por NCF..."
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Estado ECF</InputLabel>
                          <Select
                            value={filters.statusEcf || ''}
                            label="Estado ECF"
                            onChange={(e) =>
                              handleFilterChange('statusEcf', e.target.value)
                            }
                          >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value={EcfStatusEnum.ECF_MSELLER}>
                              ecf mSeller
                            </MenuItem>
                            <MenuItem value={EcfStatusEnum.ACCEPTED}>
                              Aceptado
                            </MenuItem>
                            <MenuItem value={EcfStatusEnum.REJECTED}>
                              Rechazado
                            </MenuItem>
                            <MenuItem value={EcfStatusEnum.IN_PROCESS}>
                              En Proceso
                            </MenuItem>
                            <MenuItem value={EcfStatusEnum.PENDING}>
                              Pendiente
                            </MenuItem>
                            <MenuItem value={EcfStatusEnum.ERROR}>
                              Error
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  {/* Advanced Filters Row */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Filtros Avanzados
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <SellerAutocomplete
                          selectedSellers={filters.codigoVendedor}
                          callBack={(value) =>
                            handleFilterChange('codigoVendedor', value)
                          }
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <LocationAutocomplete
                          selectedLocation={filters.localidadId?.toString()}
                          callBack={(value) =>
                            handleFilterChange(
                              'localidadId',
                              value ? Number(value) : undefined,
                            )
                          }
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Tipo Documento ECF</InputLabel>
                          <Select
                            value={filters.tipoDocumentoEcf || ''}
                            label="Tipo Documento ECF"
                            onChange={(e) =>
                              handleFilterChange(
                                'tipoDocumentoEcf',
                                e.target.value,
                              )
                            }
                          >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value={EcfDocumentType.Invoice}>
                              Factura
                            </MenuItem>
                            <MenuItem value={EcfDocumentType.CreditNote}>
                              Nota de Crédito
                            </MenuItem>
                            <MenuItem value={EcfDocumentType.DebitNote}>
                              Nota de Débito
                            </MenuItem>
                            <MenuItem value={EcfDocumentType.Cancellation}>
                              Anulación
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Estado del Job</InputLabel>
                          <Select
                            value={filters.jobStatus ?? ''}
                            label="Estado del Job"
                            onChange={(e) =>
                              handleFilterChange(
                                'jobStatus',
                                e.target.value === ''
                                  ? undefined
                                  : Number(e.target.value),
                              )
                            }
                          >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value={JobStatus.Pending}>
                              Pendiente
                            </MenuItem>
                            <MenuItem value={JobStatus.Running}>
                              En Ejecución
                            </MenuItem>
                            <MenuItem value={JobStatus.Completed}>
                              Completado
                            </MenuItem>
                            <MenuItem value={JobStatus.Failed}>
                              Fallido
                            </MenuItem>
                            <MenuItem value={JobStatus.Cancelled}>
                              Cancelado
                            </MenuItem>
                            <MenuItem value={JobStatus.Retrying}>
                              Reintentando
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  {/* Date Filters and Actions Row */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Filtros de Fecha
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          type="date"
                          label="Fecha Creación Desde"
                          value={filters.fechaCreacionDesde || ''}
                          onChange={(e) =>
                            handleFilterChange(
                              'fechaCreacionDesde',
                              e.target.value || undefined,
                            )
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          type="date"
                          label="Fecha Creación Hasta"
                          value={filters.fechaCreacionHasta || ''}
                          onChange={(e) =>
                            handleFilterChange(
                              'fechaCreacionHasta',
                              e.target.value || undefined,
                            )
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Tipo eCF</InputLabel>
                          <Select
                            value={filters.tipoeCF || ''}
                            label="Tipo eCF"
                            onChange={(e) =>
                              handleFilterChange(
                                'tipoeCF',
                                e.target.value === ''
                                  ? undefined
                                  : Number(e.target.value),
                              )
                            }
                          >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value={31}>
                              31 - Factura de Crédito Fiscal
                            </MenuItem>
                            <MenuItem value={32}>
                              32 - Factura de Consumo
                            </MenuItem>
                            <MenuItem value={33}>33 - Nota de Débito</MenuItem>
                            <MenuItem value={34}>34 - Nota de Crédito</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>NCF Auto-actualizado</InputLabel>
                          <Select
                            value={filters.ncfAutoActualizado ?? ''}
                            label="NCF Auto-actualizado"
                            onChange={(e) =>
                              handleFilterChange(
                                'ncfAutoActualizado',
                                e.target.value === ''
                                  ? undefined
                                  : e.target.value === 'true',
                              )
                            }
                          >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="true">Sí</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Action Buttons */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={handleClearFilters}
                        startIcon={<Icon icon="mdi:filter-remove" />}
                        disabled={store.loading}
                      >
                        Limpiar Filtros
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Collapse>

            {/* Mobile view */}
            <Hidden mdUp>
              <Box sx={{ p: 3 }}>
                {store.loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <Typography>Cargando...</Typography>
                  </Box>
                ) : store.data.length === 0 ? (
                  <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Typography color="text.secondary">
                      No se encontraron documentos ECF
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {store.data.map((documento) => (
                      <Card key={documento.id} variant="outlined">
                        <Box sx={{ p: 2 }}>
                          <Stack spacing={1}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                              }}
                            >
                              <Typography variant="subtitle2" color="primary">
                                {documento.documentoId}
                              </Typography>
                              <Chip
                                size="small"
                                label={documento.statusEcf || 'Sin estado'}
                                color={
                                  getStatusColor(documento.statusEcf) as any
                                }
                                variant="filled"
                              />
                            </Box>

                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Cliente: {documento.codigoCliente}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {documento.tipoDocumentoEcf}
                              </Typography>
                            </Box>

                            {documento.ncf && (
                              <Typography
                                variant="body2"
                                sx={{ fontFamily: 'monospace' }}
                              >
                                NCF: {documento.ncf}
                              </Typography>
                            )}

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatDate(documento.fechaCreacion)}
                            </Typography>

                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 1,
                                mt: 1,
                              }}
                            >
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleViewDetails(documento)}
                                startIcon={<Icon icon="mdi:eye-outline" />}
                              >
                                Ver
                              </Button>
                              {(documento.jobStatus === JobStatus.Failed ||
                                documento.statusEcf === 'Error') && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="warning"
                                  onClick={() =>
                                    handleRetryProcessing(documento)
                                  }
                                  disabled={store.isRetrying}
                                  startIcon={<Icon icon="mdi:refresh" />}
                                >
                                  Reintentar
                                </Button>
                              )}
                            </Box>
                          </Stack>
                        </Box>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>
            </Hidden>

            {/* Desktop view */}
            <Hidden mdDown>
              <DataGrid
                autoHeight
                rowHeight={62}
                rows={store.data || []}
                columns={columns}
                disableRowSelectionOnClick
                paginationModel={paginationModel}
                onPaginationModelChange={handlePagination}
                onRowSelectionModelChange={(rows) => setSelectedRows(rows)}
                getRowId={(row: EcfDocumentoType) => row.id}
                paginationMode="server"
                loading={store.loading}
                rowCount={store.totalCount}
                pageSizeOptions={[10, 20, 50, 100]}
                sx={{
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              />
            </Hidden>
          </Card>
        </Grid>
      </Grid>

      <EcfDocumentDetailModal />
    </DatePickerWrapper>
  )
}

export default EcfAuditPage
