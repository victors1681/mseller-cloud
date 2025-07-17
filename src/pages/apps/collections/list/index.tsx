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
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import CustomAvatar from 'src/@core/components/mui/avatar'
// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports

import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from 'src/store/apps/collections'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { CollectionType } from 'src/types/apps/collectionType'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import TableHeader from 'src/views/apps/transports/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import formatDate from 'src/utils/formatDate'
import formatCurrency from 'src/utils/formatCurrency'
import {
  collectionStatusLabels,
  collectionStatusObj,
} from '../../../../utils/collectionMappings'
import { debounce } from '@mui/material'
import { SellerAutocomplete } from 'src/views/ui/sellerAutoComplete'
import { CustomInput } from '@/views/ui/customInput'
import { TipoDocumentoEnum } from '@/types/apps/documentTypes'

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

const TransportList = () => {
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [documentType, setDocumentType] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [startDateRange, setStartDateRange] = useState<any>(null)
  const [selectedSellers, setSelectedSellers] = useState<any>(null)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.collections)

  useEffect(() => {
    dispatch(
      fetchData({
        dates,
        query: value,
        status: documentType,
        pageNumber: paginationModel.page,
        distribuidores: selectedSellers,
      }),
    )
  }, [documentType, selectedSellers])

  const performRequest = useCallback(
    (value: string) => {
      dispatch(
        fetchData({
          dates,
          query: value,
          status: documentType,
          pageNumber: paginationModel.page,
          distribuidores: selectedSellers,
        }),
      )
    },
    [dispatch, documentType, value, dates, selectedSellers, paginationModel],
  )

  const fn = useCallback(
    debounce((val: string) => {
      setPaginationModel({ page: 0, pageSize: 20 })
      performRequest(val)
    }, 900),
    [],
  )
  const handleDocumentType = (e: SelectChangeEvent) => {
    setDocumentType(e.target.value)
  }

  const handleFilter = useCallback(
    (val: string) => {
      fn.clear()
      setValue(val)
      fn(val)
    },
    [fn],
  )
  const handlePagination = useCallback(
    (values: any) => {
      setPaginationModel(values)
      dispatch(
        fetchData({
          dates,
          query: value,
          status: documentType,
          pageNumber: values.page,
          distribuidores: selectedSellers,
        }),
      )
    },
    [paginationModel, value, selectedSellers, documentType],
  )

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
            <CardHeader title="Cobranza" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="invoice-status-select">
                      Estado de la orden
                    </InputLabel>

                    <Select
                      fullWidth
                      value={documentType}
                      sx={{ mr: 4, mb: 2 }}
                      label="Estado de la orden"
                      onChange={handleDocumentType}
                      labelId="invoice-status-select"
                    >
                      <MenuItem value="">none</MenuItem>
                      {Object.keys(collectionStatusLabels).map((k: any) => {
                        return (
                          <MenuItem value={k}>
                            {collectionStatusLabels[k]}
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
                      value={documentType}
                      sx={{ mr: 4, mb: 2 }}
                      label="Estado de la orden"
                      onChange={handleDocumentType}
                      labelId="invoice-status-select"
                    >
                      <MenuItem value="">none</MenuItem>
                      {Object.keys(collectionStatusLabels).map((k: any) => {
                        return (
                          <MenuItem value={k}>
                            {collectionStatusLabels[k]}
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
                      value={documentType}
                      sx={{ mr: 4, mb: 2 }}
                      label="Estado de la orden"
                      onChange={handleDocumentType}
                      labelId="invoice-status-select"
                    >
                      <MenuItem value="">none</MenuItem>
                      {Object.keys(collectionStatusLabels).map((k: any) => {
                        return (
                          <MenuItem value={k}>
                            {collectionStatusLabels[k]}
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
                      value={documentType}
                      sx={{ mr: 4, mb: 2 }}
                      label="Estado de la orden"
                      onChange={handleDocumentType}
                      labelId="invoice-status-select"
                    >
                      <MenuItem value="">none</MenuItem>
                      <MenuItem value={TipoDocumentoEnum.INVOICE}>
                        Factura
                      </MenuItem>
                      <MenuItem value={TipoDocumentoEnum.ORDER}>
                        Pedido
                      </MenuItem>
                      <MenuItem value={TipoDocumentoEnum.QUOTE}>
                        Cotización
                      </MenuItem>
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
              value={value}
              selectedRows={selectedRows}
              handleFilter={handleFilter}
              placeholder="No.Deposito"
            />
            <DataGrid
              autoHeight
              pagination
              rows={store.collectionsData}
              columns={columns}
              disableRowSelectionOnClick
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

export default TransportList
