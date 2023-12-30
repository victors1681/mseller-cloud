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
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import {  deleteInvoice, fetchTransportDocsData } from 'src/store/apps/transports'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { DocumentoEntregaType, TransporteType } from 'src/types/apps/transportType'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import formatDate from 'src/utils/formatDate'
import formatCurrency from 'src/utils/formatCurrency'
import { TransportStatusEnum, transportStatusLabels, transportStatusObj } from '../utils/transportMappings'
import CardWidgetsDocsDeliveryOverview from 'src/views/ui/cards/widgets/CardWidgetsDocsDeliveryOverview'
import CardStatisticsTransport from 'src/views/ui/cards/statistics/CardStatisticsTransport'
import DocDetailModal from './docDetailModal'
import MapModal from 'src/views/apps/transports/docs/MapModal'
import SignatureModal from 'src/views/apps/transports/docs/SignatureModal'

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
  row: DocumentoEntregaType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

// ** Vars
const invoiceStatusObj: InvoiceStatusObj = {
  Sent: { color: 'secondary', icon: 'mdi:send' },
  Paid: { color: 'success', icon: 'mdi:check' },
  Draft: { color: 'primary', icon: 'mdi:content-save-outline' },
  'Partial Payment': { color: 'warning', icon: 'mdi:chart-pie' },
  'Past Due': { color: 'error', icon: 'mdi:information-outline' },
  Downloaded: { color: 'info', icon: 'mdi:arrow-down' }
}





// ** renders client column

const defaultColumns: GridColDef[] = [
  {
    flex: 0.15,
    field: 'id',
    minWidth: 120,
    headerName: '#',
    renderCell: ({ row }: CellType) => <DocDetailModal title={row.noDocEntrega} data={row}/>
  },
  {
    flex: 0.25,
    minWidth: 250,
    field: 'client',
    headerName: 'Cliente',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', textTransform: 'capitalize' }}>
              {row.cliente.nombre}
            </Typography>
            <Typography noWrap variant='caption'>
              {row.cliente.codigo}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.25,
    field: 'driver',
    minWidth: 200,
    headerName: 'Vendedor',
    renderCell: ({ row }: CellType) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {row.vendedor.nombre}
            </Typography>
            <Typography noWrap variant='caption'>
              {row.vendedor.codigo}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'location',
    minWidth: 100,
    headerName: 'Total',
    renderCell: ({ row }: CellType) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', textTransform: 'capitalize' }}>
              {row.status === TransportStatusEnum.Entregado ? formatCurrency(row.bruto_E) : formatCurrency(row.bruto)}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  
  {
    flex: 0.18,
    minWidth: 150,
    field: 'date',
    headerName: 'Fecha',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{formatDate(row.fecha)}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 120,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={transportStatusLabels[row?.status] || ""}
          color={transportStatusObj[row.status]}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    }
  },
]

/* eslint-disable */
const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates

  return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})
/* eslint-enable */

interface TransportDocsProps {
  noTransporte: string
}
const TransportDocs = (props: TransportDocsProps) => {
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [startDateRange, setStartDateRange] = useState<any>(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.transports)
  console.log("storestorestore", store)
  useEffect(() => {
    dispatch(
      fetchTransportDocsData(props.noTransporte)
    )
  }, [dispatch, statusValue, value, dates])

  const handleFilter = (val: string) => {
    setValue(val)
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
          <MapModal data={[row]}></MapModal>
          <SignatureModal url={row.firmaUrl}/>
        </Box>
      )
    }
  ]

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <CardStatisticsTransport docsData={store.docsData}/>
        </Grid>
        <Grid item xs={6}>
          <CardWidgetsDocsDeliveryOverview docsData={store.docsData?.documentos  || []}/>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <DataGrid
              autoHeight
              pagination
              rows={store.docsData?.documentos || []}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onRowSelectionModelChange={rows => setSelectedRows(rows)}
              getRowId={row => row.noDocEntrega}
            />
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default TransportDocs
