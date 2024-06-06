// ** React Imports
import { useState, useEffect, forwardRef, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import { debounce } from '@mui/material'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import DatePicker from 'react-datepicker'
// ** Third Party Imports
import format from 'date-fns/format'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchInvoice } from 'src/store/apps/invoices'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import OptionsMenu from 'src/@core/components/option-menu'
import TableHeader from 'src/views/apps/clients/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import formatCurrency from 'src/utils/formatCurrency'
import { CustomerType } from 'src/types/apps/customerType'
import { SellerAutocomplete } from 'src/views/ui/sellerAutoComplete'
import { InvoiceType } from 'src/types/apps/invoicesTypes'
import formatDate from 'src/utils/formatDate'

import { useRouter } from 'next/router'

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: InvoiceType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 80,
    headerName: 'Código',
    renderCell: ({ row }: CellType) => (
      <LinkStyled href={`#`}>{`${row.no_factura}`}</LinkStyled>
    ),
  },
  {
    flex: 0.25,
    field: 'client',
    minWidth: 250,
    headerName: 'Nombre/Dir',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant="body2"
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {row.cliente.nombre}
            </Typography>
            <Typography noWrap variant="caption">
              {row.cliente.direccion} - {row.cliente.ciudad}
            </Typography>
          </Box>
        </Box>
      )
    },
  },
  {
    flex: 0.15,
    field: 'seller',
    minWidth: 200,
    headerName: 'Vendedor',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
    flex: 0.1,
    minWidth: 100,
    field: 'rnc',
    headerName: 'NCR/Condición',
    renderCell: ({ row }: CellType) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            noWrap
            variant="body2"
            sx={{ color: 'text.primary', fontWeight: 600 }}
          >
            {row.ncf}
          </Typography>
          <Typography noWrap variant="caption">
            {row.condicion_pago}
          </Typography>
        </Box>
      </Box>
    ),
  },

  {
    flex: 0.1,
    minWidth: 120,
    field: 'balance',
    headerName: 'Balance/Fecha',
    renderCell: ({ row }: CellType) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            noWrap
            variant="body2"
            sx={{ color: 'text.primary', fontWeight: 600 }}
          >
            {formatCurrency(row.total)}
          </Typography>
          <Typography noWrap variant="caption">
            {formatDate(row.fecha)}
          </Typography>
        </Box>
      </Box>
    ),
  },
]

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

const InvoiceList = () => {
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [selectedSellers, setSelectedSellers] = useState<any>(null)
  const [startDateRange, setStartDateRange] = useState<any>(null)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  })
  console.log(selectedSellers)
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.invoices)
  const router = useRouter()

  const sellersParam = router?.query?.sellers
  const startDateParam = router?.query?.startDate
  const endDateParam = router?.query?.endDate

  useEffect(() => {
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
  }, [
    startDateParam,
    endDateParam,
    sellersParam,
  ])

  //Initial Load
  useEffect(() => {
    dispatch(
      fetchInvoice({
        dates,
        query: value,
        pageNumber: paginationModel.page,
        vendedores: selectedSellers,
      }),
    )
  }, [selectedSellers, dates])

  const handlePagination = useCallback(
    (values: any) => {
      setPaginationModel(values)
      dispatch(
        fetchInvoice({
          dates,
          query: value,
          pageNumber: values.page,
          vendedores: selectedSellers,
        }),
      )
    },
    [paginationModel, value, statusValue, selectedSellers],
  )

  const performRequest = useCallback(
    (value: string) => {
      dispatch(
        fetchInvoice({
          dates,
          query: value,
          pageNumber: paginationModel.page,
          vendedores: selectedSellers,
        }),
      )
    },
    [dispatch, statusValue, value, dates, paginationModel, selectedSellers],
  )

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
  }

  const handleSellerValue = (sellers: string) => {
    setSelectedSellers(sellers)
    router.push({
      pathname: `/apps/invoices/list`,
      query: {
        ...router.query,
        page: 0,
        sellers: sellers,
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
      pathname: `/apps/invoices/list`,
      query: {
        ...router.query,
        page: 0,
        startDate: start ? start.toISOString() : '',
        endDate: end ? end.toISOString() : '',
      },
    })
  }

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
          <Tooltip title="Aprobar">
            <IconButton size="small" disabled>
              <Icon icon="tabler:edit" fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton
              size="small"
              component={Link}
              disabled
              href={`/apps/invoice/preview/${row.no_factura}`}
            >
              <Icon icon="mdi:eye-outline" fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  const selectedSellersParams = Array.isArray(sellersParam)
  ? sellersParam.map((param) => decodeURIComponent(param)).join(', ')
  : decodeURIComponent(sellersParam ?? '')

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Facturas"
              action={
                <OptionsMenu
                  options={[
                    {
                      text: 'Importar',
                      icon: <Icon icon="tabler:file-import" fontSize={20} />,
                    },
                    {
                      text: 'Exportar',
                      icon: <Icon icon="clarity:export-line" fontSize={20} />,
                    },
                  ]}
                  iconButtonProps={{
                    size: 'small',
                    sx: { color: 'text.primary' },
                  }}
                />
              }
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <SellerAutocomplete selectedSellers={selectedSellersParams} multiple callBack={handleSellerValue} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ padding: 3 }}>
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
                  </Box>
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
              placeholder="No.Factura ó Cliente"
            />
            <DataGrid
              autoHeight
              pagination
              rows={store.data}
              columns={columns}
              disableRowSelectionOnClick
              paginationModel={paginationModel}
              onPaginationModelChange={handlePagination}
              onRowSelectionModelChange={(rows) => setSelectedRows(rows)}
              getRowId={(row) => row.no_factura}
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

export default InvoiceList
