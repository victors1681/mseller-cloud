// ** React Imports
import { forwardRef, useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Collapse from '@mui/material/Collapse'
import Grid from '@mui/material/Grid'
import Hidden from '@mui/material/Hidden'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import CardHeader from '@mui/material/CardHeader'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { DataGrid, GridRowParams } from '@mui/x-data-grid'
import {
  columns,
  DocumentCard,
  orderStatusLabels,
} from 'src/views/apps/documents/list/tableColRows'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import {
  changeDocumentStatus,
  fetchData,
  loadMoreData,
} from 'src/store/apps/documents'

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'

import {
  DocumentStatus,
  DocumentType,
  StatusParam,
  TipoDocumentoEnum,
} from 'src/types/apps/documentTypes'

// ** Custom Components Imports
import { ViewCustomerInfoDialog } from '@/views/apps/documents/viewCustomerInfoDialog'
import Icon from 'src/@core/components/icon'
import AddEditDocumentDialog from 'src/views/apps/documents/add-edit-document'
import TableHeader from 'src/views/apps/documents/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import { debounce } from '@mui/material'
import { LocationAutocomplete } from 'src/views/ui/locationAutoComplete'
import { PaymentTypeAutocomplete } from 'src/views/ui/paymentTypeAutoComplete'
import { SellerAutocomplete } from 'src/views/ui/sellerAutoComplete'

import { useRouter } from 'next/router'

interface DocumentsListProps {
  documentType?: TipoDocumentoEnum
  pageTitle?: string
}

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

/* eslint-disable */
const CustomInput = forwardRef((props: CustomInputProps, ref) => {
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

const InvoiceList = ({ documentType, pageTitle }: DocumentsListProps) => {
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [actionValue, setActionValue] = useState<string>('-1')
  const [statusValue, setStatusValue] = useState<string>('0')
  const [documentTypeValue, setDocumentTypeValue] = useState<string>(
    documentType || '',
  )
  const [endDateRange, setEndDateRange] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [startDateRange, setStartDateRange] = useState<any>(null)
  const [selectedSellers, setSelectedSellers] = useState<string | undefined>(
    undefined,
  )
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
    undefined,
  )
  const [selectedPaymentType, setSelectedPaymentType] = useState<any>(null)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  })

  // Scroll to top state
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Pull to refresh state
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Load more state for mobile
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Customer dialog state
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false)
  const [selectedCustomerCode, setSelectedCustomerCode] = useState<string>('')

  // Filter collapse state (mobile only)
  const [filtersExpanded, setFiltersExpanded] = useState(false)

  // ** Hooks
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Customer view handler
  const handleViewCustomer = (codigoCliente: string) => {
    setSelectedCustomerCode(codigoCliente)
    setCustomerDialogOpen(true)
  }

  const handleCloseCustomerDialog = () => {
    setCustomerDialogOpen(false)
    setSelectedCustomerCode('')
  }

  const toggleFilters = () => {
    setFiltersExpanded(!filtersExpanded)
  }

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.documents)
  const router = useRouter()

  const orderStatusParam = router?.query?.status
  const documentTypeParam = router?.query?.documentType
  const startDateParam = router?.query?.startDate
  const endDateParam = router?.query?.endDate
  const sellersParam = router?.query?.sellers
  const PaymentTypeParam = router?.query?.paymentType
  const LocationParam = router?.query?.location
  const { page, pageSize } = router.query

  useEffect(() => {
    setPaginationModel({
      page: page ? Number(page) : 0,
      pageSize: pageSize ? Number(pageSize) : 20,
    })

    if (!orderStatusParam) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, status: '' },
      })
    } else {
      setStatusValue(orderStatusParam as string)
    }

    if (documentTypeParam) {
      setDocumentTypeValue(documentTypeParam as string)
    }
    if (startDateParam && endDateParam) {
      const startDate = new Date(startDateParam as string)
      const endDate = new Date(endDateParam as string)
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        setStartDateRange(startDate)
        setEndDateRange(endDate)
        setDates([startDate, endDate])
      }
    }
    if (sellersParam) {
      setSelectedSellers(decodeURIComponent(sellersParam as string))
    }
    if (PaymentTypeParam) {
      setSelectedPaymentType(decodeURIComponent(PaymentTypeParam as string))
    }
    if (LocationParam) {
      setSelectedLocation(decodeURIComponent(LocationParam as string))
    }
  }, [
    orderStatusParam,
    documentTypeParam,
    startDateParam,
    endDateParam,
    sellersParam,
    PaymentTypeParam,
    LocationParam,
  ])

  useEffect(() => {
    dispatch(
      fetchData({
        dates,
        query: value,
        procesado: statusValue,
        pageNumber: paginationModel.page,
        vendedores: selectedSellers,
        localidad: selectedLocation,
        condicionPago: selectedPaymentType,
        tipoDocumento: documentTypeValue,
      }),
    )
  }, [
    dispatch,
    statusValue,
    dates,
    selectedSellers,
    selectedPaymentType,
    selectedLocation,
    documentTypeValue,
  ])

  // Scroll to top functionality for mobile
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    if (isMobile) {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [isMobile])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // Pull to refresh functionality
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return

    setIsRefreshing(true)
    try {
      await dispatch(
        fetchData({
          dates,
          query: value,
          procesado: statusValue,
          pageNumber: 0, // Reset to first page
          vendedores: selectedSellers,
          localidad: selectedLocation,
          condicionPago: selectedPaymentType,
          tipoDocumento: documentTypeValue,
        }),
      )
      // Reset pagination to first page
      setPaginationModel((prev) => ({ ...prev, page: 0 }))
    } finally {
      setIsRefreshing(false)
    }
  }, [
    dispatch,
    dates,
    value,
    statusValue,
    selectedSellers,
    selectedLocation,
    selectedPaymentType,
    documentTypeValue,
    isRefreshing,
  ])

  // Load more functionality for mobile
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || store.isLoading) return

    const nextPage = paginationModel.page + 1
    const currentlyLoaded = store.data.length
    const hasMoreResults = currentlyLoaded < store.totalResults

    if (!hasMoreResults) return

    setIsLoadingMore(true)
    try {
      // The next API page to load (paginationModel tracks current loaded page)
      const apiPageNumber = paginationModel.page + 1
      const params = {
        dates,
        query: value,
        procesado: statusValue,
        pageNumber: apiPageNumber, // Next page to load
        vendedores: selectedSellers,
        localidad: selectedLocation,
        condicionPago: selectedPaymentType,
        tipoDocumento: documentTypeValue,
      }

      const result = await dispatch(loadMoreData(params))

      // Update pagination model to track the API page we just loaded
      setPaginationModel((prev) => ({ ...prev, page: apiPageNumber }))
    } catch (error) {
      console.error('Load more error:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [
    dispatch,
    isLoadingMore,
    store.isLoading,
    store.totalResults,
    paginationModel.page,
    paginationModel.pageSize,
    dates,
    value,
    statusValue,
    selectedSellers,
    selectedLocation,
    selectedPaymentType,
    documentTypeValue,
  ])

  const performRequest = useCallback(
    (value: string) => {
      dispatch(
        fetchData({
          dates,
          query: value,
          procesado: statusValue,
          pageNumber: paginationModel.page,
          vendedores: selectedSellers,
          localidad: selectedLocation,
          condicionPago: selectedPaymentType,
          tipoDocumento: documentTypeValue,
        }),
      )
    },
    [
      dispatch,
      statusValue,
      value,
      dates,
      selectedSellers,
      selectedPaymentType,
      selectedLocation,
      paginationModel,
    ],
  )

  const fn = useCallback(
    debounce((val: string) => {
      setPaginationModel({ page: 1, pageSize: 20 })
      performRequest(val)
    }, 900),
    [],
  )

  const handlePagination = useCallback(
    (values: any) => {
      setPaginationModel(values)
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          page: values.page,
          pageSize: values.pageSize,
        },
      })
      dispatch(
        fetchData({
          dates,
          query: value,
          procesado: statusValue,
          pageNumber: values.page,
          vendedores: selectedSellers,
          localidad: selectedLocation,
          condicionPago: selectedPaymentType,
          tipoDocumento: documentTypeValue,
        }),
      )
    },
    [
      paginationModel,
      value,
      statusValue,
      selectedLocation,
      selectedPaymentType,
      documentTypeValue,
    ],
  )

  const handleFilter = useCallback(
    (val: string) => {
      fn.clear()
      setValue(val)
      fn(val)
    },
    [fn],
  )

  const handleStatusValue = (e: SelectChangeEvent) => {
    setStatusValue(e.target.value)
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: 0,
        status: e.target.value,
      },
    })
  }

  const handleSellerValue = (sellers: string) => {
    setSelectedSellers(sellers)
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: 0,
        sellers: sellers,
      },
    })
  }

  const handlePaymentTypeValue = (paymentType: string) => {
    setSelectedPaymentType(paymentType)
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: 0,
        paymentType: paymentType,
      },
    })
  }

  const handleLocationValue = (location: string) => {
    setSelectedLocation(location)
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: 0,
        location: location,
      },
    })
  }

  const handleDocumentTypeValue = (e: SelectChangeEvent) => {
    setDocumentTypeValue(e.target.value)
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: 0,
        documentType: e.target.value,
      },
    })
  }

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: 0,
        startDate: start ? start.toISOString() : '',
        endDate: end ? end.toISOString() : '',
      },
    })
  }

  const handleSelectionAction = async (event: SelectChangeEvent<string>) => {
    setActionValue(event.target.value)

    const label = event.target.value === '9' ? 'aprobar' : 'retener'
    const template = `Seguro que deseas ${label} ${selectedRows.length} documentos`
    const result = window.confirm(template)

    if (result) {
      const payload = []
      for (let row of selectedRows) {
        const params: StatusParam = {
          noPedidoStr: row,
          status: parseInt(event.target.value) as any,
        }
        payload.push(params)
      }
      await dispatch(changeDocumentStatus(payload))
    }
    setActionValue('-1')
  }

  //Params for paymentTypes
  const selectedPaymentTypeParams = Array.isArray(PaymentTypeParam)
    ? PaymentTypeParam.map((param) => decodeURIComponent(param)).join(', ')
    : decodeURIComponent(PaymentTypeParam ?? '')

  const selectedSellersParams = Array.isArray(sellersParam)
    ? sellersParam.map((param) => decodeURIComponent(param)).join(', ')
    : decodeURIComponent(sellersParam ?? '')

  return (
    <DatePickerWrapper>
      <Grid container spacing={{ xs: 3, sm: 6 }}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={pageTitle || 'Documentos'}
              sx={{
                '& .MuiCardHeader-title': {
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                },
              }}
            />
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 5 } }}>
              {/* Mobile Filter Toggle */}
              <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={toggleFilters}
                  startIcon={
                    <Icon
                      icon={
                        filtersExpanded
                          ? 'mdi:chevron-up'
                          : 'mdi:filter-variant'
                      }
                    />
                  }
                  sx={{
                    minHeight: { xs: 48, sm: 44 },
                    fontSize: { xs: '1rem', sm: '0.875rem' },
                    justifyContent: 'center',
                  }}
                >
                  {filtersExpanded ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                </Button>
              </Box>
              <Collapse in={!isMobile || filtersExpanded} timeout="auto">
                <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <FormControl fullWidth>
                      <InputLabel id="order-status-select">
                        Estado de la orden
                      </InputLabel>

                      <Select
                        fullWidth
                        value={statusValue}
                        sx={{ mb: { xs: 1, sm: 2 } }}
                        label="Estado de la orden"
                        onChange={handleStatusValue}
                        labelId="order-status-select"
                      >
                        <MenuItem value="">none</MenuItem>
                        {Object.keys(orderStatusLabels).map((k, index) => {
                          return (
                            <MenuItem value={k} key={`${k}-${index}`}>
                              {orderStatusLabels[k]}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Box sx={{ mb: { xs: 1, sm: 2 } }}>
                      <PaymentTypeAutocomplete
                        selectedPaymentType={selectedPaymentTypeParams}
                        multiple
                        callBack={handlePaymentTypeValue}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Box sx={{ mb: { xs: 1, sm: 2 } }}>
                      <LocationAutocomplete
                        selectedLocation={
                          Array.isArray(LocationParam)
                            ? LocationParam.map((param) =>
                                decodeURIComponent(param),
                              ).join(', ')
                            : decodeURIComponent(LocationParam ?? '')
                        }
                        multiple
                        callBack={handleLocationValue}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <FormControl fullWidth>
                      <InputLabel id="documentType-status-select">
                        Tipo Documento
                      </InputLabel>

                      <Select
                        fullWidth
                        value={documentTypeValue}
                        sx={{ mb: { xs: 1, sm: 2 } }}
                        label="Tipo Documento"
                        onChange={handleDocumentTypeValue}
                        labelId="documentType-status-select"
                      >
                        <MenuItem value="">none</MenuItem>
                        <MenuItem value={TipoDocumentoEnum.ORDER}>
                          Pedido
                        </MenuItem>
                        <MenuItem value={TipoDocumentoEnum.INVOICE}>
                          Factura
                        </MenuItem>
                        <MenuItem value={TipoDocumentoEnum.QUOTE}>
                          Cotización
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Box sx={{ mb: { xs: 1, sm: 2 } }}>
                      <SellerAutocomplete
                        selectedSellers={selectedSellersParams}
                        multiple
                        callBack={handleSellerValue}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Box sx={{ mb: { xs: 1, sm: 2 } }}>
                      <DatePicker
                        isClearable
                        selectsRange
                        monthsShown={isSmallMobile ? 1 : 2}
                        endDate={endDateRange}
                        selected={startDateRange}
                        startDate={startDateRange}
                        shouldCloseOnSelect={false}
                        id="date-range-picker-months"
                        onChange={handleOnChangeRange}
                        popperProps={{
                          strategy: 'fixed',
                          modifiers: [
                            {
                              name: 'preventOverflow',
                              options: {
                                boundary: 'viewport',
                              },
                            },
                          ],
                        }}
                        customInput={
                          <CustomInput
                            dates={dates}
                            setDates={setDates}
                            label="Fecha"
                            end={endDateRange as number | Date}
                            start={startDateRange as number | Date}
                          />
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Collapse>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader
              actionValue={actionValue}
              searchValue={value}
              selectedRows={selectedRows}
              handleFilter={handleFilter}
              handleAction={handleSelectionAction}
              placeholder="Cliente, NoPedido"
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />

            {/* Mobile Refresh Button */}
            <Hidden mdUp>
              <Box
                sx={{
                  p: 2,
                  pb: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {store.totalResults} documento(s) encontrado(s)
                </Typography>
                <IconButton
                  onClick={handleRefresh}
                  disabled={isRefreshing || store.isLoading}
                  size="small"
                  sx={{
                    minWidth: 40,
                    minHeight: 40,
                    bgcolor: 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' },
                  }}
                >
                  <Icon
                    icon={isRefreshing ? 'mdi:loading' : 'mdi:refresh'}
                    fontSize="1.25rem"
                    className={isRefreshing ? 'animate-spin' : ''}
                  />
                </IconButton>
              </Box>
            </Hidden>

            {/* Desktop Table View */}
            <Hidden mdDown>
              <DataGrid
                autoHeight
                pagination
                checkboxSelection
                isRowSelectable={(params: GridRowParams) =>
                  params.row.procesado === DocumentStatus.Pending
                }
                rows={store.data}
                columns={columns(dispatch, handleViewCustomer)}
                disableRowSelectionOnClick
                paginationModel={paginationModel}
                onPaginationModelChange={handlePagination}
                onRowSelectionModelChange={(rows) =>
                  setSelectedRows(rows as string[])
                }
                getRowId={(row) => row.noPedidoStr}
                paginationMode="server"
                loading={store.isLoading}
                rowCount={store.totalResults}
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'grey.50',
                    borderRadius: '8px 8px 0 0',
                  },
                }}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      seller: true,
                      issuedDate: true,
                      tipoDocumento: true,
                    },
                  },
                }}
              />
            </Hidden>

            {/* Mobile Card View */}
            <Hidden mdUp>
              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                {store.isLoading ? (
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', py: 4 }}
                  >
                    <Icon icon="mdi:loading" fontSize="2rem" />
                  </Box>
                ) : store.data.length === 0 ? (
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
                      No se encontraron documentos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Intenta ajustar los filtros de búsqueda
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={0}>
                    {store.data.map((document: DocumentType) => (
                      <Grid item xs={12} key={document.noPedidoStr}>
                        <DocumentCard
                          document={document}
                          onViewCustomer={handleViewCustomer}
                          dispatch={dispatch}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* Mobile Load More Controls */}
                {store.data.length > 0 && store.totalResults > 0 && (
                  <Box sx={{ mt: 3 }}>
                    {/* Results Info */}
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Mostrando {store.data.length} de {store.totalResults}{' '}
                        documentos
                      </Typography>
                    </Box>

                    {/* Load More Button */}
                    {store.data.length < store.totalResults ? (
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Button
                          variant="contained"
                          onClick={handleLoadMore}
                          disabled={isLoadingMore || store.isLoading}
                          sx={{
                            minHeight: 48,
                            px: 4,
                            borderRadius: 3,
                            fontSize: '1rem',
                          }}
                        >
                          {isLoadingMore || store.isLoading
                            ? 'Cargando...'
                            : 'Cargar más documentos'}
                        </Button>
                      </Box>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: 'center', py: 2 }}
                      >
                        Has visto todos los documentos
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Hidden>
          </Card>
        </Grid>
      </Grid>
      <AddEditDocumentDialog open={store.isEditDialogOpen} />
      <ViewCustomerInfoDialog
        open={customerDialogOpen}
        onClose={handleCloseCustomerDialog}
        codigoCliente={selectedCustomerCode}
      />
    </DatePickerWrapper>
  )
}

export default InvoiceList
