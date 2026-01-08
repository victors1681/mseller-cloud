// ** React Imports
import { forwardRef, useCallback, useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import { debounce } from '@mui/material'
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
// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from 'src/store/apps/clients'

// ** Types Imports
import OptionsMenu from 'src/@core/components/option-menu'
import { AppDispatch, RootState } from 'src/store'
import TableHeader from 'src/views/apps/clients/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { CustomerType } from 'src/types/apps/customerType'
import formatCurrency from 'src/utils/formatCurrency'
import InitiateMessageModal from 'src/views/apps/communication/InitiateMessageModal'
import { SellerAutocomplete } from 'src/views/ui/sellerAutoComplete'

import { useRouter } from 'next/router'

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: CustomerType
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
    minWidth: 100,
    headerName: 'Código',
    renderCell: ({ row }: CellType) => (
      <Link
        href={`/apps/clients/detail/${row.codigo}`}
        passHref
        style={{ textDecoration: 'none' }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'primary.main',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {row.codigo}
        </Typography>
      </Link>
    ),
  },
  {
    flex: 0.35,
    field: 'client',
    minWidth: 200,
    headerName: 'Nombre/Dir',
    renderCell: ({ row }: CellType) => {
      return (
        <Link
          href={`/apps/clients/detail/${row.codigo}`}
          passHref
          style={{ textDecoration: 'none', width: '100%' }}
        >
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                noWrap
                variant="body2"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {row.nombre}
              </Typography>
              <Typography
                noWrap
                variant="caption"
                sx={{ color: 'text.secondary' }}
              >
                {row.direccion} - {row.ciudad}
              </Typography>
            </Box>
          </Box>
        </Link>
      )
    },
  },
  {
    flex: 0.2,
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
              {row?.vendedor?.nombre}
            </Typography>
            <Typography noWrap variant="caption">
              {row?.vendedor?.codigo}
            </Typography>
          </Box>
        </Box>
      )
    },
  },
  {
    flex: 0.12,
    minWidth: 130,
    field: 'rnc',
    headerName: 'RNC',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{row.rnc}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'total',
    headerName: 'Tipo/Cond.Pago',
    renderCell: ({ row }: CellType) => (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Tooltip title="Tipo Comprobante del Cliente">
          <Typography variant="body2">{row.tipoCliente}</Typography>
        </Tooltip>
        <Tooltip title="Condición de pago">
          <Typography noWrap variant="caption">
            {row.condicion}
          </Typography>
        </Tooltip>
      </Box>
    ),
  },

  {
    flex: 0.1,
    minWidth: 120,
    field: 'balance',
    headerName: 'Balance',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{formatCurrency(row.balance)}</Typography>
    ),
  },
  {
    width: 60,
    field: 'active',
    headerName: '',
    renderCell: ({ row }: CellType) =>
      row.status == 'A' ? (
        <Icon icon="lets-icons:check-fill" color="#56ca00" fontSize={20} />
      ) : (
        <Icon icon="bxs:x-circle" color="#ff4b51" fontSize={20} />
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
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.clients)
  const router = useRouter()

  const sellersParam = router?.query?.sellers
  const queryParam = router?.query?.query
  const pageParam = router?.query?.page
  const pageSizeParam = router?.query?.pageSize

  // ** State - Initialize from URL params
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>(
    queryParam ? decodeURIComponent(queryParam as string) : '',
  )
  const [statusValue, setStatusValue] = useState<string>('')
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [selectedSellers, setSelectedSellers] = useState<any>(
    sellersParam ? decodeURIComponent(sellersParam as string) : null,
  )
  const [paginationModel, setPaginationModel] = useState({
    page: pageParam ? Number(pageParam) : 0,
    pageSize: pageSizeParam ? Number(pageSizeParam) : 20,
  })
  const [isInitialized, setIsInitialized] = useState(false)

  // ** Message Modal State
  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<{
    code: string
    name: string
  } | null>(null)

  console.log(selectedSellers)

  // Sync state with URL params when they change
  useEffect(() => {
    if (router.isReady) {
      if (
        sellersParam &&
        selectedSellers !== decodeURIComponent(sellersParam as string)
      ) {
        setSelectedSellers(decodeURIComponent(sellersParam as string))
      }
      if (queryParam && value !== decodeURIComponent(queryParam as string)) {
        setValue(decodeURIComponent(queryParam as string))
      }
      setIsInitialized(true)
    }
  }, [sellersParam, queryParam, router.isReady])

  //Initial Load - only fetch when router is ready
  useEffect(() => {
    if (router.isReady) {
      dispatch(
        fetchData({
          dates,
          query: value,
          procesado: statusValue,
          pageNumber: paginationModel.page,
          vendedor: selectedSellers,
        }),
      )
    }
  }, [selectedSellers, value, router.isReady])

  const handlePagination = useCallback(
    (values: any) => {
      setPaginationModel(values)
      dispatch(
        fetchData({
          dates,
          query: value,
          procesado: statusValue,
          pageNumber: values.page,
          vendedor: selectedSellers,
        }),
      )
    },
    [paginationModel, value, statusValue, selectedSellers],
  )

  const performRequest = useCallback(
    (value: string) => {
      dispatch(
        fetchData({
          dates,
          query: value,
          procesado: statusValue,
          pageNumber: paginationModel.page,
          vendedor: selectedSellers,
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
      router.push({
        pathname: `/apps/clients/list`,
        query: {
          ...router.query,
          page: 0,
          query: val,
        },
      })
    },
    [fn, router],
  )

  const handleStatusValue = (e: SelectChangeEvent) => {
    setStatusValue(e.target.value)
  }

  const handleSellerValue = (sellers: string) => {
    setSelectedSellers(sellers)
    router.push({
      pathname: `/apps/clients/list`,
      query: {
        ...router.query,
        sellers: sellers,
      },
    })
  }

  const openGoogleMaps = (latitude?: number, longitude?: number) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`
    window.open(url, '_blank')
  }

  const handleOpenMessageModal = (clientCode: string, clientName: string) => {
    setSelectedClient({ code: clientCode, name: clientName })
    setMessageModalOpen(true)
  }

  const handleCloseMessageModal = () => {
    setMessageModalOpen(false)
    setSelectedClient(null)
  }

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Enviar Mensaje">
            <IconButton
              size="small"
              onClick={() => handleOpenMessageModal(row.codigo, row.nombre)}
            >
              <Icon icon="tabler:message-circle" fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={`Geolocalidad Lat:${row.geoLocalizacion?.latitud} Lon: ${row.geoLocalizacion?.longitud}`}
          >
            <IconButton
              size="small"
              disabled={
                !row.geoLocalizacion?.latitud || !row.geoLocalizacion?.longitud
              }
              onClick={() =>
                openGoogleMaps(
                  row.geoLocalizacion?.latitud,
                  row.geoLocalizacion?.longitud,
                )
              }
            >
              <Icon icon="ph:map-pin" fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              component={Link}
              href={`/apps/clients/add/${row.codigo}`}
            >
              <Icon icon="tabler:edit" fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Ver detalle">
            <IconButton
              size="small"
              component={Link}
              href={`/apps/clients/detail/${row.codigo}`}
            >
              <Icon icon="mdi:eye-outline" fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  //Params for paymentTypes
  const selectedSellersParams = Array.isArray(sellersParam)
    ? sellersParam.map((param) => decodeURIComponent(param)).join(', ')
    : decodeURIComponent(sellersParam ?? '')

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Clientes"
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
                  <SellerAutocomplete
                    selectedSellers={selectedSellersParams}
                    multiple
                    callBack={handleSellerValue}
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
              placeholder="Nombre o código"
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
              getRowId={(row) => row.codigo}
              paginationMode="server"
              loading={store.isLoading}
              rowCount={store.totalResults} //
            />
          </Card>
        </Grid>
      </Grid>

      {/* Message Modal */}
      {selectedClient && (
        <InitiateMessageModal
          open={messageModalOpen}
          onClose={handleCloseMessageModal}
          clientCode={selectedClient.code}
          clientName={selectedClient.name}
        />
      )}
    </DatePickerWrapper>
  )
}

export default InvoiceList
