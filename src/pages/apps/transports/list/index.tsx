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
  changeTransportStatus,
  forceCloseTransport,
} from 'src/store/apps/transports'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { TransporteListType } from 'src/types/apps/transportType'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'
import TableHeader from 'src/views/apps/transports/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import formatDate from 'src/utils/formatDate'
import {
  TransportStatusEnum,
  transportStatusLabels,
  transportStatusObj,
} from '../../../../utils/transportMappings'
import { debounce } from '@mui/material'
import { DriverAutocomplete } from 'src/views/ui/driverAutoComplete'
import { LocationAutocomplete } from 'src/views/ui/locationAutoComplete'
import { useAuth } from 'src/hooks/useAuth'
import TransportStatusSelect from '../transportStatusSelect'
import ConfirmTransportStatus from '../confirmStatus'

import { useRouter } from 'next/router'
import driver from 'src/store/apps/driver'

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
  row: TransporteListType
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
      <Typography variant="body2">{`${row.totalEntregas}`}</Typography>
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
          label={transportStatusLabels[row?.status] || ''}
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
  const [statusValue, setStatusValue] = useState<string>('0')
  const [endDateRange, setEndDateRange] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [startDateRange, setStartDateRange] = useState<any>(null)
  const [selectedDrivers, setSelectedDrivers] = useState<any>(null)
  const [selectTransportNumber, setSelectTransportNumber] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  })
  const [transportConfirmDialog, setTransportConfirmDialog] =
    useState<boolean>(false)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.transports)
  const { accessControl, user } = useAuth()
  const router = useRouter()

  const statusParam = router?.query?.status
  const driversParam = router?.query?.drivers
  const startDateParam = router?.query?.startDate
  const endDateParam = router?.query?.endDate
  const LocationParam = router?.query?.location
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
    undefined,
  )
  const { page, pageSize } = router.query

  useEffect(() => {
    setPaginationModel({
      page: page ? Number(page) : 0,
      pageSize: pageSize ? Number(pageSize) : 20,
    })

    if (!statusParam) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, status: '0' },
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
    if (driversParam) {
      setSelectedDrivers(decodeURIComponent(driversParam as string))
    }
    if (LocationParam) {
      setSelectedLocation(decodeURIComponent(LocationParam as string))
    }
  }, [
    statusParam,
    startDateParam,
    endDateParam,
    driversParam,
  ])

  useEffect(() => {
    dispatch(
      fetchData({
        dates,
        query: value,
        status: statusValue,
        pageNumber: paginationModel.page,
        distribuidores: selectedDrivers,
        localidad: selectedLocation,
      }),
    )
  }, [statusValue, selectedDrivers, dates,selectedLocation])

  const performRequest = useCallback(
    (value: string) => {
      dispatch(
        fetchData({
          dates,
          query: value,
          status: statusValue,
          pageNumber: paginationModel.page,
          distribuidores: selectedDrivers,
          localidad: selectedLocation,
        }),
      )
    },
    [dispatch, statusValue, value, dates, selectedDrivers,selectedLocation, paginationModel],
  )

      //Params for Drivers

      const selectedDriversParams = Array.isArray(driversParam)
      ? driversParam.map((param) => decodeURIComponent(param)).join(', ')
      : decodeURIComponent(driversParam ?? '')

      const selectedLocationParams = Array.isArray(LocationParam)
      ? LocationParam.map((param) =>
          decodeURIComponent(param),
        ).join(', ')
      : decodeURIComponent(LocationParam ?? '')

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
      pathname: `/apps/transports/list`,
      query: {
        ...router.query,
        page: 0,
        status: e.target.value,
      },
    })
  }

  const handleDriversValue = (drivers: string) => {
    setStatusValue(drivers)
    router.push({
      pathname: `/apps/transports/list`,
      query: {
        ...router.query,
        page: 0,
        drivers: drivers,
      },
    })
  }

  const handleLocationValue = (location: string) => {
    setSelectedLocation(location)
    router.push({
      pathname: `/apps/transports/list`,
      query: {
        ...router.query,
        page: 0,
        location: location,
      },
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
          distribuidores: selectedDrivers,
          localidad: selectedLocation,
        }),
      )
    },
    [paginationModel, value, selectedDrivers, statusValue,selectedLocation],
  )

  const handleCloseTransport = async (transportNo: string) => {
    const result = window.confirm(
      `Seguro que deseas cerrar el transporte ${transportNo}? \n Todas las entregas aún no procesadas cambiarán a status entregar después`,
    )

    if (result) {
      dispatch(forceCloseTransport(transportNo))
    }
  }

  const handleChangeStatus = async (
    status: TransportStatusEnum,
    transportNo: string,
  ) => {
    let msg = ''
    switch (status) {
      case TransportStatusEnum.Pendiente: //Allow a distributor to re-load the transport in another device
        msg = `Seguro que desea restaurar el transporte ${transportNo} en otro equipo? \n Útil si el equipo es robado, daños ó sin batería en transcurso de entrega`
        break
      case TransportStatusEnum.ERP: //
        msg = `Seguro que desea marcar el transporte ${transportNo} como enviado al ERP? \n Útil cuando el transporte ya se envió al ERP y no se actualizó el MSeller`
        break
      default:
        msg = `Seguro que desea cambiar el status a ${status} al transporte ${transportNo}`
        break
    }
    const result = window.confirm(msg)

    // Check the user's choice
    if (result) {
      dispatch(changeTransportStatus({ transportNo, status }))
    }
  }

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
    router.push({
      pathname: `/apps/documents/list`,
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
          <Tooltip title="View">
            <IconButton
              size="small"
              component={Link}
              href={`/apps/transports/docs/${row.noTransporte}`}
            >
              <Icon icon="mdi:eye-outline" fontSize={20} />
            </IconButton>
          </Tooltip>{' '}
          <OptionsMenu
            iconProps={{ fontSize: 20 }}
            iconButtonProps={{ size: 'small' }}
            menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
            options={[
              {
                text: 'Cerrar Transporte',
                icon: <Icon icon="ri:file-close-fill" fontSize={20} />,
                menuItemProps: {
                  disabled:
                    !accessControl?.transports.allowForceClose ||
                    [
                      TransportStatusEnum.Integrado,
                      TransportStatusEnum.ERP,
                      TransportStatusEnum.Cancelado,
                    ].includes(row.status),
                  onClick: () => handleCloseTransport(row.noTransporte),
                },
              },
              {
                text: 'Restaurar Dispositivo',
                icon: <Icon icon="tabler:device-mobile-up" fontSize={20} />,
                menuItemProps: {
                  disabled:
                    !accessControl?.transports.allowChangeStatus ||
                    [
                      TransportStatusEnum.Integrado,
                      TransportStatusEnum.ERP,
                      TransportStatusEnum.Cancelado,
                      TransportStatusEnum.Pendiente,
                    ].includes(row.status),
                  onClick: () =>
                    handleChangeStatus(
                      TransportStatusEnum.Pendiente,
                      row.noTransporte,
                    ),
                },
              },
              {
                text: 'Transporte Enviado al ERP',
                icon: <Icon icon="carbon:document-export" fontSize={20} />,
                menuItemProps: {
                  disabled:
                    !accessControl?.transports.allowChangeStatus ||
                    [
                      TransportStatusEnum.Integrado,
                      TransportStatusEnum.ERP,
                      TransportStatusEnum.Cancelado,
                      TransportStatusEnum.Pendiente,
                    ].includes(row.status),
                  onClick: () =>
                    handleChangeStatus(
                      TransportStatusEnum.ERP,
                      row.noTransporte,
                    ),
                },
              },
              {
                text: 'Cambiar Status',
                icon: <Icon icon="tabler:status-change" fontSize={20} />,
                menuItemProps: {
                  disabled: user?.type !== 'superuser',
                  onClick: () => {
                    setSelectTransportNumber(row.noTransporte)
                    setTransportConfirmDialog((prev) => !prev)
                  },
                },
              },
            ]}
          />
        </Box>
      ),
    },
  ]

  return (
    <DatePickerWrapper>
      <ConfirmTransportStatus
        transportNo={selectTransportNumber}
        open={transportConfirmDialog}
        setOpen={setTransportConfirmDialog}
      />
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Transportes" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TransportStatusSelect
                    handleStatusValue={handleStatusValue}
                    statusValue={statusValue}
                  />
                </Grid>

                <Grid xs={12} sm={4}>
                  <DriverAutocomplete selectedDrivers={selectedDriversParams}
                   multiple 
                   callBack={handleDriversValue} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <LocationAutocomplete
                    selectedLocation={selectedLocationParams}
                    multiple
                    callBack={handleLocationValue}
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
              placeholder="No.Transporte"
            />
            <DataGrid
              autoHeight
              pagination
              rows={store.transportData}
              columns={columns}
              disableRowSelectionOnClick
              paginationModel={paginationModel}
              onPaginationModelChange={handlePagination}
              onRowSelectionModelChange={(rows) => setSelectedRows(rows)}
              getRowId={(row) => row.noTransporte}
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

export default TransportList
