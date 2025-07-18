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
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import { Box, debounce, IconButton, Tooltip, Chip } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchECFConfiguration,
  toggleECFAddUpdate,
  deleteECFConfiguration,
} from 'src/store/apps/ecf'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import TableHeader from 'src/views/apps/ecf/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { ECFType } from 'src/types/apps/ecfType'
import OptionsMenu from 'src/@core/components/option-menu'
import AddECFDrawer from 'src/views/apps/ecf/AddECFDrawer'

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: ECFType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'ambiente',
    minWidth: 120,
    headerName: 'Ambiente',
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
        {row.ambiente}
      </Typography>
    ),
  },
  {
    flex: 0.2,
    minWidth: 200,
    field: 'urlBase',
    headerName: 'URL Base',
    renderCell: ({ row }: CellType) => (
      <Typography
        noWrap
        variant="body2"
        sx={{
          color: 'text.primary',
        }}
      >
        {row.urlBase}
      </Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 120,
    field: 'usuario',
    headerName: 'Usuario',
    renderCell: ({ row }: CellType) => (
      <Typography
        noWrap
        variant="body2"
        sx={{
          color: 'text.primary',
        }}
      >
        {row.usuario}
      </Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'habilitado',
    headerName: 'Estado',
    renderCell: ({ row }: CellType) => (
      <Chip
        size="small"
        label={row.habilitado ? 'Activo' : 'Inactivo'}
        color={row.habilitado ? 'success' : 'error'}
        variant="outlined"
      />
    ),
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: 'fechaActualizacion',
    headerName: 'Última Actualización',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">
        {row.fechaActualizacion
          ? format(new Date(row.fechaActualizacion), 'dd/MM/yyyy HH:mm')
          : '-'}
      </Typography>
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

const ECFList = () => {
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.ecf)

  //Initial Load
  useEffect(() => {
    dispatch(
      fetchECFConfiguration({
        query: value,
        pageNumber: paginationModel.page,
      }),
    )
  }, [])

  const handlePagination = useCallback(
    (values: any) => {
      setPaginationModel(values)
      dispatch(
        fetchECFConfiguration({
          query: value,
          pageNumber: values.page,
        }),
      )
    },
    [paginationModel, value],
  )

  const performRequest = useCallback(
    (value: string) => {
      dispatch(
        fetchECFConfiguration({
          query: value,
          pageNumber: paginationModel.page,
        }),
      )
    },
    [dispatch, value, dates, paginationModel],
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

  const handleEdit = (row: ECFType) => {
    dispatch(toggleECFAddUpdate(row))
  }

  const handleDelete = (id: string) => {
    if (
      window.confirm('¿Está seguro de que desea eliminar esta integración?')
    ) {
      dispatch(deleteECFConfiguration(id))
    }
  }

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 150,
      sortable: false,
      field: 'actions',
      headerName: 'Acciones',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => handleEdit(row)}>
              <Icon icon="tabler:edit" fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton size="small" onClick={() => handleDelete(row.id)}>
              <Icon icon="tabler:trash" fontSize={20} />
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
              title="Integración de Facturación Electrónica"
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
              placeholder="Buscar por ambiente o usuario"
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
              getRowId={(row: ECFType) => row.id}
              paginationMode="server"
              loading={store.isLoading}
              rowCount={store.totalResults}
            />
          </Card>
        </Grid>
      </Grid>
      <AddECFDrawer open={store.isAddUpdateDrawerOpen} />
    </DatePickerWrapper>
  )
}

export default ECFList
