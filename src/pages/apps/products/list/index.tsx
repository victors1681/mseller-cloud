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

// ** Third Party Imports
import format from 'date-fns/format'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, deleteProduct } from 'src/store/apps/products'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import TableHeader from 'src/views/apps/products/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { ProductType } from 'src/types/apps/productTypes'
import PriceDisplay from 'src/views/apps/products/list/PriceDisplay'
import OptionsMenu from 'src/@core/components/option-menu'

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: ProductType
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
      <Typography variant="body2">{row.codigo}</Typography>
    ),
  },
  {
    flex: 0.35,
    field: 'name',
    minWidth: 300,
    headerName: 'Nombre',
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
              {row.nombre}
            </Typography>
            <Typography noWrap variant="caption">
              {row.area} - {row.iDArea}
            </Typography>
          </Box>
        </Box>
      )
    },
  },
  {
    flex: 0.15,
    minWidth: 130,
    field: 'unit',
    headerName: 'Un',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{row.unidad}</Typography>
    ),
  },
  {
    flex: 0.15,
    minWidth: 130,
    field: 'pack',
    headerName: 'Empaque',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{row.empaque}</Typography>
    ),
  },
  {
    flex: 0.2,
    field: 'price',
    minWidth: 200,
    headerName: 'Precios',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <PriceDisplay
              defaultPrice={row.precio1}
              prices={[row.precio2, row.precio3, row.precio4, row.precio5]}
            />
          </Box>
        </Box>
      )
    },
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'stock',
    headerName: 'Impuesto',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{row.impuesto}%</Typography>
    ),
  },

  {
    flex: 0.1,
    minWidth: 80,
    field: 'fact',
    headerName: 'Factor',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{row.factor}</Typography>
    ),
  },
  {
    flex: 0.05,
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
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string>('')
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.products)

  //Initial Load
  useEffect(() => {
    dispatch(
      fetchData({
        query: value,
        status: statusValue,
        pageNumber: paginationModel.page,
      }),
    )
  }, [statusValue])

  const handlePagination = useCallback(
    (values: any) => {
      setPaginationModel(values)
      dispatch(
        fetchData({
          query: value,
          status: statusValue,
          pageNumber: values.page,
        }),
      )
    },
    [paginationModel, value, statusValue],
  )

  const performRequest = useCallback(
    (value: string) => {
      dispatch(
        fetchData({
          query: value,
          status: statusValue,
          pageNumber: paginationModel.page,
        }),
      )
    },
    [dispatch, statusValue, value, dates, paginationModel],
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
              component={Link}
              href={`/apps/products/add/${row.codigo}`}
            >
              <Icon icon="tabler:edit" fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton
              size="small"
              disabled
              onClick={() => dispatch(deleteProduct(row.codigo))}
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
              title="Productos"
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
    </DatePickerWrapper>
  )
}

export default InvoiceList
