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
import {
  Box,
  debounce,
  IconButton,
  Tooltip,
  Button,
  CardContent,
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchDocTypeSecs,
  toggleDocTypeSecAddUpdate,
  initializeDocTypeSecSequence,
} from 'src/store/apps/docTypeSec'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import TableHeader from 'src/views/apps/docTypeSec/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DocTypeSecType } from 'src/types/apps/docTypeSecType'
import OptionsMenu from 'src/@core/components/option-menu'
import AddDocTypeSecDrawer from 'src/views/apps/docTypeSec/AddDocTypeSecDrawer'
import { getTipoDocumentoSpanishName } from '@/types/apps/documentTypes'

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: DocTypeSecType
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
    headerName: 'ID',
    renderCell: ({ row }: CellType) => (
      <LinkStyled href={`#`}>{`${row.id}`}</LinkStyled>
    ),
  },
  {
    flex: 0.15,
    minWidth: 130,
    field: 'prefijo',
    headerName: 'Prefijo',
    renderCell: ({ row }: CellType) => (
      <Typography
        noWrap
        variant="body2"
        sx={{
          color: 'text.primary',
          fontWeight: 600,
        }}
      >
        {row.prefijo}
      </Typography>
    ),
  },
  {
    flex: 0.15,
    minWidth: 130,
    field: 'tipoDocumento',
    headerName: 'Tipo Documento',
    renderCell: ({ row }: CellType) => (
      <Typography
        noWrap
        variant="body2"
        sx={{
          color: 'text.primary',
        }}
      >
        {getTipoDocumentoSpanishName(row.tipoDocumento)}
      </Typography>
    ),
  },
  {
    flex: 0.15,
    minWidth: 130,
    field: 'secuencia',
    headerName: 'Secuencia',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{row.secuencia}</Typography>
    ),
  },
  {
    flex: 0.15,
    minWidth: 130,
    field: 'secuenciaContado',
    headerName: 'Sec. Contado',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{row.secuenciaContado}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'localidad',
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

const DocTypeSecList = () => {
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
  const store = useSelector((state: RootState) => state.docTypeSec)

  //Initial Load
  useEffect(() => {
    dispatch(
      fetchDocTypeSecs({
        query: value,
        pageNumber: paginationModel.page,
      }),
    )
  }, [statusValue])

  const handlePagination = useCallback(
    (values: any) => {
      setPaginationModel(values)
      dispatch(
        fetchDocTypeSecs({
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
        fetchDocTypeSecs({
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

  const handleEdit = (row: DocTypeSecType) => {
    dispatch(toggleDocTypeSecAddUpdate(row))
  }

  const handleInitializeSequence = () => {
    dispatch(initializeDocTypeSecSequence())
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
  console.log(store.data)
  // Check if there's no data to show the initialize button
  const showInitializeButton = !store.isLoading && store.data.length === 0

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Tipos de Documentos de Secuencia"
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
            {showInitializeButton ? (
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 200,
                  textAlign: 'center',
                }}
              >
                <Icon
                  icon="tabler:file-plus"
                  fontSize={48}
                  style={{ marginBottom: 16, color: '#666' }}
                />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  No hay tipos de documentos configurados
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 4, color: 'text.secondary' }}
                >
                  Inicializa la secuencia con los tipos de documentos estándar
                  para comenzar
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleInitializeSequence}
                  disabled={store.isInitializing}
                  startIcon={
                    store.isInitializing ? (
                      <Icon icon="line-md:loading-twotone-loop" />
                    ) : (
                      <Icon icon="tabler:rocket" />
                    )
                  }
                >
                  {store.isInitializing
                    ? 'Inicializando...'
                    : 'Inicializar Secuencia'}
                </Button>
              </CardContent>
            ) : (
              <>
                <TableHeader
                  value={value}
                  selectedRows={selectedRows}
                  handleFilter={handleFilter}
                  placeholder="Prefijo o ID"
                  showInitializeButton={showInitializeButton}
                  onInitializeSequence={handleInitializeSequence}
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
                  getRowId={(row: DocTypeSecType) => row.id}
                  paginationMode="server"
                  loading={store.isLoading}
                  rowCount={store.totalResults}
                />
              </>
            )}
          </Card>
        </Grid>
        <AddDocTypeSecDrawer open={store.isAddUpdateDrawerOpen} />
      </Grid>
    </DatePickerWrapper>
  )
}

export default DocTypeSecList
