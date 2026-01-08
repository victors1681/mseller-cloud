// ** React Imports
import { forwardRef, useCallback, useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import { SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from 'src/store/apps/collections'

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'
import { CollectionType } from 'src/types/apps/collectionType'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import TableHeader from 'src/views/apps/transports/list/TableHeader'
import MSellerIOSAppLink from 'src/views/ui/MSellerIOSAppLink'

// ** Styled Components
import { debounce } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import formatCurrency from 'src/utils/formatCurrency'
import formatDate from 'src/utils/formatDate'
import { LocationAutocomplete } from 'src/views/ui/locationAutoComplete'
import { SellerAutocomplete } from 'src/views/ui/sellerAutoComplete'
import {
  collectionStatusLabels,
  collectionStatusObj,
} from '../../../../utils/collectionMappings'
import CollectionStatusSelect from '../collectionStatusSelect'

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: CollectionType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

// ** renders client column
const renderClient = (row: CollectionType) => {
  if (row.avatarUrl) {
    return (
      <CustomAvatar
        src={row.avatarUrl}
        sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }}
      />
    )
  }
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

// ** renders client column

const defaultColumns: GridColDef[] = [
  {
    flex: 0.15,
    field: 'id',
    minWidth: 110,
    headerName: '#',
    renderCell: ({ row }: CellType) => (
      <LinkStyled
        href={`/apps/collections/receipt/${row.noDepositoStr}`}
      >{`${row.noDepositoStr}`}</LinkStyled>
    ),
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'documents',
    headerName: 'Recibos',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{`${row.cantidadRecibos}`}</Typography>
    ),
  },
  {
    flex: 0.25,
    field: 'seller',
    minWidth: 250,
    headerName: 'Vendedor',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: 'text.primary', fontWeight: 600 }}
            >
              {row.vendedor.nombre}
            </Typography>
            <Typography noWrap variant="caption">
              {row.vendedor.codigo}
            </Typography>
          </Box>
        </Box>
      )
    },
  },
  {
    flex: 0.15,
    field: 'location',
    minWidth: 100,
    headerName: 'Cobrado',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: 'text.primary', textTransform: 'capitalize' }}
            >
              {formatCurrency(row.totalCobrado)}
            </Typography>
          </Box>
        </Box>
      )
    },
  },
  {
    flex: 0.18,
    minWidth: 150,
    field: 'date',
    headerName: 'Fecha',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{formatDate(row.fecha)}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 120,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin="light"
          size="small"
          label={collectionStatusLabels[row?.procesado] || ''}
          color={collectionStatusObj[row.procesado]}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    },
  },
]

const CollectionList = () => {
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string>('')
  const [documentType, setDocumentType] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [startDateRange, setStartDateRange] = useState<any>(null)
  const [selectedSellers, setSelectedSellers] = useState<any>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
    undefined,
  )
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.collections)
  const router = useRouter()

  const statusParam = router?.query?.status
  const sellersParam = router?.query?.sellers
  const startDateParam = router?.query?.startDate
  const endDateParam = router?.query?.endDate
  const locationParam = router?.query?.location
  const { page, pageSize } = router.query

  useEffect(() => {
    setPaginationModel({
      page: page ? Number(page) : 0,
      pageSize: pageSize ? Number(pageSize) : 20,
    })

    if (!statusParam) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, status: '' },
      })
    } else {
      setStatusValue(statusParam as string)
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
    if (locationParam) {
      setSelectedLocation(decodeURIComponent(locationParam as string))
    }
  }, [statusParam, startDateParam, endDateParam, sellersParam, locationParam])

  useEffect(() => {
    const fetchDataParams: any = {
      dates,
      query: value,
      pageNumber: paginationModel.page,
      vendedor: selectedSellers,
      status: statusValue,
      localidad: selectedLocation,
    }
    dispatch(fetchData(fetchDataParams))
  }, [statusValue, selectedSellers, dates, selectedLocation])

  const performRequest = useCallback(
    (value: string) => {
      dispatch(
        fetchData({
          dates,
          query: value,
          status: statusValue,
          pageNumber: paginationModel.page,
          vendedor: selectedSellers,
          localidad: selectedLocation,
        }),
      )
    },
    [
      dispatch,
      statusValue,
      value,
      dates,
      selectedSellers,
      selectedLocation,
      paginationModel,
    ],
  )

  //Params for Sellers
  const selectedSellersParams = Array.isArray(sellersParam)
    ? sellersParam.map((param) => decodeURIComponent(param)).join(', ')
    : decodeURIComponent(sellersParam ?? '')

  const selectedLocationParams = Array.isArray(locationParam)
    ? locationParam.map((param) => decodeURIComponent(param)).join(', ')
    : decodeURIComponent(locationParam ?? '')

  const fn = useCallback(
    debounce((val: string) => {
      setPaginationModel({ page: 0, pageSize: 20 })
      performRequest(val)
    }, 900),
    [],
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
      pathname: `/apps/collections/list`,
      query: {
        ...router.query,
        page: 0,
        status: e.target.value,
      },
    })
    setPaginationModel({
      ...paginationModel,
      page: 0,
    })
  }

  const handleSellersValue = (sellers: string) => {
    setSelectedSellers(sellers)
    router.push({
      pathname: `/apps/collections/list`,
      query: {
        ...router.query,
        page: 0,
        sellers: sellers,
      },
    })
    setPaginationModel({
      ...paginationModel,
      page: 0,
    })
  }

  const handleLocationValue = (location: string) => {
    setSelectedLocation(location)
    router.push({
      pathname: `/apps/collections/list`,
      query: {
        ...router.query,
        page: 0,
        location: location,
      },
    })
    setPaginationModel({
      ...paginationModel,
      page: 0,
    })
  }

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
          status: statusValue,
          pageNumber: values.page,
          vendedor: selectedSellers,
          localidad: selectedLocation,
        }),
      )
    },
    [
      paginationModel,
      value,
      selectedSellers,
      statusValue,
      selectedLocation,
      documentType,
    ],
  )

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
    router.push({
      pathname: `/apps/collections/list`,
      query: {
        ...router.query,
        page: 0,
        startDate: start ? start.toISOString() : '',
        endDate: end ? end.toISOString() : '',
      },
    })
    setPaginationModel({
      ...paginationModel,
      page: 0,
    })
  }

  const handleGenerateCollectionReport = () => {
    if (selectedRows.length === 0) {
      alert(
        'Por favor selecciona al menos una cobranza para generar el reporte.',
      )
      return
    }

    const collectionNumbers = selectedRows.join(',')
    const reportUrl = `/apps/collections/print/${collectionNumbers}`

    window.open(reportUrl, '_blank')
  }

  const reportOptions = [
    {
      label: 'Reporte de Cobranza',
      action: handleGenerateCollectionReport,
      icon: 'mdi:file-document-outline',
    },
  ]

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="View">
            <IconButton
              size="small"
              component={Link}
              href={`/apps/collections/receipt/${row.noDepositoStr}`}
            >
              <Icon icon="mdi:eye-outline" fontSize={20} />
            </IconButton>
          </Tooltip>
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
              title="Cobranzas Remotas"
              subheader={
                <>
                  Listado de cobranzas remotas realizadas por los vendedores
                  desde <MSellerIOSAppLink />
                </>
              }
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <CollectionStatusSelect
                    handleStatusValue={handleStatusValue}
                    statusValue={statusValue}
                    label="Estado de la Cobranza"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <LocationAutocomplete
                    selectedLocation={selectedLocationParams}
                    multiple
                    callBack={handleLocationValue}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <SellerAutocomplete
                    selectedSellers={selectedSellersParams}
                    multiple
                    callBack={handleSellersValue}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id="date-range-picker-months"
                    onChange={handleOnChangeRange}
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
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader
              value={value}
              selectedRows={selectedRows}
              handleFilter={handleFilter}
              placeholder="No.Deposito"
              reportOptions={reportOptions}
            />
            <DataGrid
              autoHeight
              pagination
              rows={store.collectionsData}
              columns={columns}
              // checkboxSelection
              paginationModel={paginationModel}
              onPaginationModelChange={handlePagination}
              onRowSelectionModelChange={(rows) => setSelectedRows(rows)}
              getRowId={(row: CollectionType) => row.noDepositoStr}
              paginationMode="server"
              loading={store.isLoading}
              rowCount={store.totalResults} //
            />
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default CollectionList
