// ** React Imports
import { useState, useEffect, forwardRef, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import { Box, debounce, IconButton, Tooltip } from '@mui/material'
// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, toggleDriverAddUpdate } from 'src/store/apps/driver'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import TableHeader from 'src/views/apps/drivers/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DistribuidorType } from 'src/types/apps/driverType'
import OptionsMenu from 'src/@core/components/option-menu'

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: DistribuidorType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

const defaultColumns: GridColDef[] = [
  {
    flex: 0.05,
    field: 'id',
    minWidth: 80,
    headerName: 'Código',
    renderCell: ({ row }: CellType) => (
      <LinkStyled href={`#`}>{`${row.codigo}`}</LinkStyled>
    ),
  },
  {
    flex: 0.2,
    minWidth: 130,
    field: 'day',
    headerName: 'Nombre',
    renderCell: ({ row }: CellType) => (
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
    ),
  },
  {
    flex: 0.05,
    minWidth: 50,
    field: 'route',
    headerName: 'Ruta',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{row.rutas}</Typography>
    ),
  },
  {
    flex: 0.05,
    minWidth: 50,
    field: 'ficha',
    headerName: 'Ficha',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{row.ficha}</Typography>
    ),
  },
  {
    flex: 0.05,
    minWidth: 50,
    field: 'locale',
    headerName: 'Localidad',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{row.localidad}</Typography>
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
  const store = useSelector((state: RootState) => state.drivers)

  //Initial Load
  useEffect(() => {
    dispatch(
      fetchData({
        query: value,
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

  const handleEdit = (row: DistribuidorType) => {
    dispatch(toggleDriverAddUpdate(row))
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
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => handleEdit(row)}>
              <Icon icon="tabler:edit" fontSize={20} />
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
              title="Distribuidores"
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
              getRowId={(row: DistribuidorType) => row.codigo}
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
