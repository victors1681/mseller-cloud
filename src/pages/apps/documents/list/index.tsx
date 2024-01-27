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
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridRowParams,
} from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchData,
  deleteInvoice,
  changeDocumentStatus,
} from 'src/store/apps/documents'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import {
  DocumentStatus,
  DocumentType,
  StatusParam,
} from 'src/types/apps/documentTypes'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import TableHeader from 'src/views/apps/documents/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import formatDate from 'src/utils/formatDate'
import formatCurrency from 'src/utils/formatCurrency'
import Autocomplete from '@mui/material/Autocomplete'
import { debounce } from '@mui/material'
import { SellerAutocomplete } from 'src/views/ui/sellerAutoComplete'
import { LocationAutocomplete } from 'src/views/ui/locationAutoComplete'
import { PaymentTypeAutocomplete } from 'src/views/ui/paymentTypeAutoComplete'

interface InvoiceStatusObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: DocumentType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

// ** Vars
const invoiceStatusObj: InvoiceStatusObj = {
  Sent: { color: 'secondary', icon: 'mdi:send' },
  Paid: { color: 'success', icon: 'mdi:check' },
  Draft: { color: 'primary', icon: 'mdi:content-save-outline' },
  'Partial Payment': { color: 'warning', icon: 'mdi:chart-pie' },
  'Past Due': { color: 'error', icon: 'mdi:information-outline' },
  Downloaded: { color: 'info', icon: 'mdi:arrow-down' },
}

const orderStatusLabels: any = {
  '': 'Ninguno',
  '0': 'Pendiente',
  '1': 'Procesado',
  '3': 'Retenido',
  '5': 'Pendinete Imprimir',
  '6': 'Condicion Crédito',
  '7': 'Backorder',
  '8': 'Error Integración',
  '9': 'Listo Para Integrar',
  '10': 'Enviado al ERP',
}

const orderStatusObj: any = {
  '1': 'success',
  '10': 'success',
  '0': 'warning',
  '3': 'info',
  '9': 'secondary',
  '5': 'primary',
  '8': 'error',
}

// ** renders client column
const renderClient = (row: DocumentType) => {
  if (row.avatarUrl) {
    return (
      <CustomAvatar
        src={row.avatarUrl}
        sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }}
      />
    )
  } else {
    return (
      <CustomAvatar
        skin="light"
        sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
      >
        {getInitials(row.nombreCliente || '')}
      </CustomAvatar>
    )
  }
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.2,
    field: 'id',
    minWidth: 120,
    headerName: '#',
    renderCell: ({ row }: CellType) => (
      <LinkStyled
        href={`/apps/documents/preview/${row.noPedidoStr}`}
      >{`${row.noPedidoStr}`}</LinkStyled>
    ),
  },
  {
    flex: 0.2,
    field: 'seller',
    minWidth: 210,
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
    flex: 0.25,
    field: 'client',
    minWidth: 300,
    headerName: 'Cliente',
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
              {row.nombreCliente}
            </Typography>
            <Typography noWrap variant="caption">
              {row.codigoCliente} - {row.condicion.descripcion}
            </Typography>
          </Box>
        </Box>
      )
    },
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'total',
    headerName: 'Total',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{`${
        formatCurrency(row.total) || 0
      }`}</Typography>
    ),
  },
  {
    flex: 0.15,
    minWidth: 130,
    field: 'issuedDate',
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
          label={orderStatusLabels[row?.procesado] || ''}
          color={orderStatusObj[row.procesado]}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    },
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
  const [actionValue, setActionValue] = useState<string>('-1')
  const [statusValue, setStatusValue] = useState<string>('0')
  const [documentTypeValue, setDocumentTypeValue] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [startDateRange, setStartDateRange] = useState<any>(null)
  const [selectedSellers, setSelectedSellers] = useState<any>(null)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [selectedPaymentType, setSelectedPaymentType] = useState<any>(null)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.invoice)

  const handlePagination = useCallback(
    (values: any) => {
      setPaginationModel(values)
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
      paginationModel,
      selectedLocation,
    ],
  )

  const fn = useCallback(
    debounce((val: string) => {
      setPaginationModel({ page: 1, pageSize: 20 })
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

  const handleDocumentTypeValue = (e: SelectChangeEvent) => {
    setDocumentTypeValue(e.target.value)
  }

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const handleApproval = (noPedidoStr: string, status: DocumentStatus) => {
    const label =
      status === DocumentStatus.ReadyForIntegration
        ? 'Seguro que deseas aprobar este pedido?'
        : 'Seguro que deseas retener este pedido?'

    const result = window.confirm(label)

    // Check the user's choice
    if (result) {
      const payload = {
        noPedidoStr,
        status,
      }
      dispatch(changeDocumentStatus([payload]))
    }
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

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.2,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Aprobar">
            <IconButton
              size="small"
              color="success"
              disabled={
                ![DocumentStatus.Pending, DocumentStatus.Retained].includes(
                  row.procesado,
                )
              }
              onClick={() =>
                handleApproval(
                  row.noPedidoStr,
                  DocumentStatus.ReadyForIntegration,
                )
              }
            >
              <Icon icon="material-symbols:order-approve" fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Retener">
            <IconButton
              size="small"
              color="warning"
              disabled={![DocumentStatus.Pending].includes(row.procesado)}
              onClick={() =>
                handleApproval(row.noPedidoStr, DocumentStatus.Retained)
              }
            >
              <Icon
                icon="fluent:document-header-dismiss-24-filled"
                fontSize={20}
              />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="View">
            <IconButton
              size="small"
              component={Link}
              href={`/apps/documents/preview/${row.noPedidoStr}`}
            >
              <Icon icon="mdi:eye-outline" fontSize={20} />
            </IconButton>
          </Tooltip> */}
          <OptionsMenu
            iconProps={{ fontSize: 20 }}
            iconButtonProps={{ size: 'small' }}
            menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
            options={[
              {
                text: 'Download',
                icon: <Icon icon="mdi:download" fontSize={20} />,
              },
              {
                text: 'Edit',
                href: `/apps/documents/edit/${row.noPedidoStr}`,
                icon: <Icon icon="mdi:pencil-outline" fontSize={20} />,
              },
              {
                text: 'Duplicate',
                icon: <Icon icon="mdi:content-copy" fontSize={20} />,
              },
            ]}
          />
        </Box>
      ),
    },
  ]

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Pedidos" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="order-status-select">
                      Estado de la orden
                    </InputLabel>

                    <Select
                      fullWidth
                      value={statusValue}
                      sx={{ mr: 4, mb: 2 }}
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
                <Grid item xs={12} sm={4}>
                  <PaymentTypeAutocomplete callBack={setSelectedPaymentType} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <LocationAutocomplete callBack={setSelectedLocation} />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="documentType-status-select">
                      Tipo Documento
                    </InputLabel>

                    <Select
                      fullWidth
                      value={documentTypeValue}
                      sx={{ mr: 4, mb: 2 }}
                      label="Tipo Documento"
                      onChange={handleDocumentTypeValue}
                      labelId="documentType-status-select"
                    >
                      <MenuItem value="">none</MenuItem>
                      <MenuItem value="order">Pedido</MenuItem>
                      <MenuItem value="invoice">Cotización</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid xs={12} sm={4}>
                  <SellerAutocomplete multiple callBack={setSelectedSellers} />
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
              actionValue={actionValue}
              searchValue={value}
              selectedRows={selectedRows}
              handleFilter={handleFilter}
              handleAction={handleSelectionAction}
              placeholder="Cliente, NoPedido"
            />
            <DataGrid
              autoHeight
              pagination
              checkboxSelection
              isRowSelectable={(params: GridRowParams) =>
                params.row.procesado === DocumentStatus.Pending
              }
              rows={store.data}
              columns={columns}
              disableRowSelectionOnClick
              paginationModel={paginationModel}
              onPaginationModelChange={handlePagination}
              onRowSelectionModelChange={(rows) =>
                setSelectedRows(rows as string[])
              }
              getRowId={(row) => row.noPedidoStr}
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
