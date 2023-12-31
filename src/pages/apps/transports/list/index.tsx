// ** React Imports
import { useState, useEffect, forwardRef } from 'react'

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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, deleteInvoice } from 'src/store/apps/transports'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { TransporteType } from 'src/types/apps/transportType'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'
import TableHeader from 'src/views/apps/documents/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import formatDate from 'src/utils/formatDate'
import formatCurrency from 'src/utils/formatCurrency'
import Autocomplete from '@mui/material/Autocomplete'
import {
  transportStatusLabels,
  transportStatusObj,
} from '../utils/transportMappings'

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
  row: TransporteType
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

// ** renders client column

const defaultColumns: GridColDef[] = [
  {
    flex: 0.15,
    field: 'id',
    minWidth: 110,
    headerName: '#',
    renderCell: ({ row }: CellType) => (
      <LinkStyled
        href={`/apps/transports/docs/${row.noTransporte}`}
      >{`${row.noTransporte}`}</LinkStyled>
    ),
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'documents',
    headerName: 'Entregas',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{`${row.documentosEntrega.length}`}</Typography>
    ),
  },
  {
    flex: 0.25,
    field: 'driver',
    minWidth: 250,
    headerName: 'Distribuidor',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: 'text.primary', fontWeight: 600 }}
            >
              {row.distribuidor.nombre}
            </Typography>
            <Typography noWrap variant="caption">
              {row.distribuidor.codigo}
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
    headerName: 'Localidad',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: 'text.primary', textTransform: 'capitalize' }}
            >
              {row.localidad.descripcion}
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
          label={transportStatusLabels[row?.status?.toString()] || ''}
          color={transportStatusObj[row.status]}
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

const TransportList = () => {
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [startDateRange, setStartDateRange] = useState<any>(null)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.transports)
  console.log('storestorestore', store)
  useEffect(() => {
    dispatch(
      fetchData({
        dates,
        noTransporte: value,
        status: statusValue,
      }),
    )
  }, [dispatch, statusValue, value, dates])

  const handleFilter = (val: string) => {
    setValue(val)
  }

  const handleStatusValue = (e: SelectChangeEvent) => {
    setStatusValue(e.target.value)
  }

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
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
            <IconButton
              size="small"
              onClick={() => dispatch(deleteInvoice(row.id))}
            >
              <Icon icon="material-symbols:order-approve" fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton
              size="small"
              component={Link}
              href={`/apps/invoice/preview/${row.id}`}
            >
              <Icon icon="mdi:eye-outline" fontSize={20} />
            </IconButton>
          </Tooltip>
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
                href: `/apps/invoice/edit/${row.noTransporte}`,
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
            <CardHeader title="Filters" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="invoice-status-select">
                      Estado de la orden
                    </InputLabel>

                    <Select
                      fullWidth
                      value={statusValue}
                      sx={{ mr: 4, mb: 2 }}
                      label="Estado de la orden"
                      onChange={handleStatusValue}
                      labelId="invoice-status-select"
                    >
                      <MenuItem value="">none</MenuItem>
                      {Object.keys(transportStatusLabels).map((k) => {
                        return (
                          <MenuItem value={k}>
                            {transportStatusLabels[k]}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="invoice-status-select">
                      Condición de Pago
                    </InputLabel>

                    <Select
                      fullWidth
                      value={statusValue}
                      sx={{ mr: 4, mb: 2 }}
                      label="Estado de la orden"
                      onChange={handleStatusValue}
                      labelId="invoice-status-select"
                    >
                      <MenuItem value="">none</MenuItem>
                      {Object.keys(transportStatusLabels).map((k) => {
                        return (
                          <MenuItem value={k}>
                            {transportStatusLabels[k]}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="invoice-status-select">
                      Localidad
                    </InputLabel>

                    <Select
                      fullWidth
                      value={statusValue}
                      sx={{ mr: 4, mb: 2 }}
                      label="Estado de la orden"
                      onChange={handleStatusValue}
                      labelId="invoice-status-select"
                    >
                      <MenuItem value="">none</MenuItem>
                      {Object.keys(transportStatusLabels).map((k) => {
                        return (
                          <MenuItem value={k}>
                            {transportStatusLabels[k]}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="invoice-status-select">
                      Tipo Documento
                    </InputLabel>

                    <Select
                      fullWidth
                      value={statusValue}
                      sx={{ mr: 4, mb: 2 }}
                      label="Estado de la orden"
                      onChange={handleStatusValue}
                      labelId="invoice-status-select"
                    >
                      <MenuItem value="">none</MenuItem>
                      <MenuItem value="2">Pedido</MenuItem>
                      <MenuItem value="2">Cotización</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid xs={12} sm={4}>
                  <Autocomplete
                    multiple
                    options={[{ title: 'test' }]}
                    filterSelectedOptions
                    defaultValue={[{ title: 'test' }]}
                    id="autocomplete-multiple-outlined"
                    getOptionLabel={(option) => option.title || ''}
                    sx={{ mt: 3, ml: 3 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Distribuidores"
                        placeholder="Distribuidores"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}></Grid>
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
              placeholder="No.Transporte"
            />
            <DataGrid
              autoHeight
              pagination
              rows={store.transportData}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onRowSelectionModelChange={(rows) => setSelectedRows(rows)}
              getRowId={(row) => row.noTransporte}
            />
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default TransportList
