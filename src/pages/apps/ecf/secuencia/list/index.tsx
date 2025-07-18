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
  Chip,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSecuenciaECF,
  toggleSecuenciaECFAddUpdate,
  deleteSecuenciaECF,
  toggleSecuenciaECFStatus,
} from 'src/store/apps/ecf'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { SecuenciaEcfType } from 'src/types/apps/ecfType'
import SecuenciaTableHeader from 'src/views/apps/ecf/secuencia/TableHeader'
import AddSecuenciaECFDrawer from 'src/views/apps/ecf/secuencia/AddSecuenciaECFDrawer'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import OptionsMenu from 'src/@core/components/option-menu'
import { getTipoClienteLabel, tipoClienteOptionsJSON } from 'src/utils/tipoClienteOptions'

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: SecuenciaEcfType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'tipoCliente',
    minWidth: 130,
    headerName: 'Tipo Cliente',
    renderCell: ({ row }: CellType) => (
      <Typography
        noWrap
        variant="body2"
        sx={{
          color: 'text.primary',
          fontWeight: 600,
        }}
      >
        {getTipoClienteLabel(row.tipoCliente)}
      </Typography>
    ),
  },
  {
    flex: 0.15,
    minWidth: 180,
    field: 'descripcion',
    headerName: 'Descripción',
    renderCell: ({ row }: CellType) => (
      <Typography
        noWrap
        variant="body2"
        sx={{
          color: 'text.primary',
        }}
      >
        {row.descripcion}
      </Typography>
    ),
  },
  {
    flex: 0.08,
    minWidth: 100,
    field: 'encabezado',
    headerName: 'Encabezado',
    renderCell: ({ row }: CellType) => (
      <Typography
        noWrap
        variant="body2"
        sx={{
          color: 'text.primary',
          fontWeight: 600,
        }}
      >
        {row.encabezado}
      </Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 120,
    field: 'secuencia',
    headerName: 'Secuencia',
    renderCell: ({ row }: CellType) => (
      <Typography
        noWrap
        variant="body2"
        sx={{
          color: 'text.primary',
        }}
      >
        {row.secuencia.toLocaleString()}
      </Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 120,
    field: 'rango',
    headerName: 'Rango',
    renderCell: ({ row }: CellType) => (
      <Typography
        noWrap
        variant="body2"
        sx={{
          color: 'text.primary',
        }}
      >
        {row.secuenciaIni.toLocaleString()} -{' '}
        {row.secuenciaFin.toLocaleString()}
      </Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 120,
    field: 'vencimiento',
    headerName: 'Vencimiento',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">
        {row.vencimiento && row.vencimiento !== '9999-12-31T23:59:59.999Z'
          ? format(new Date(row.vencimiento), 'dd/MM/yyyy')
          : 'Sin vencimiento'}
      </Typography>
    ),
  },
  {
    flex: 0.08,
    minWidth: 100,
    field: 'entorno',
    headerName: 'Entorno',
    renderCell: ({ row }: CellType) => (
      <Chip
        size="small"
        label={row.entorno || 'N/A'}
        color={row.entorno === 'PRODUCCION' ? 'success' : 'warning'}
        variant="outlined"
      />
    ),
  },
  {
    flex: 0.08,
    minWidth: 100,
    field: 'esElectronico',
    headerName: 'Electrónico',
    renderCell: ({ row }: CellType) => (
      <Chip
        size="small"
        label={row.esElectronico ? 'Sí' : 'No'}
        color={row.esElectronico ? 'info' : 'default'}
        variant="outlined"
      />
    ),
  },
  {
    flex: 0.08,
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

const SecuenciaECFList = () => {
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [tipoCliente, setTipoCliente] = useState<string>('')
  const [entorno, setEntorno] = useState<string>('')
  const [esElectronico, setEsElectronico] = useState<string>('')
  const [habilitado, setHabilitado] = useState<string>('')
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [toggleStatusDialogOpen, setToggleStatusDialogOpen] =
    useState<boolean>(false)
  const [selectedRowForAction, setSelectedRowForAction] =
    useState<SecuenciaEcfType | null>(null)
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
      fetchSecuenciaECF({
        query: value,
        pageNumber: paginationModel.page,
        pageSize: paginationModel.pageSize,
      }),
    )
  }, [])

  const handlePagination = useCallback(
    (values: any) => {
      setPaginationModel(values)
      dispatch(
        fetchSecuenciaECF({
          query: value,
          tipoCliente: tipoCliente || undefined,
          entorno: entorno || undefined,
          esElectronico: esElectronico ? esElectronico === 'true' : undefined,
          habilitado: habilitado ? habilitado === 'true' : undefined,
          pageNumber: values.page,
          pageSize: values.pageSize,
        }),
      )
    },
    [value, tipoCliente, entorno, esElectronico, habilitado],
  )

  const performRequest = useCallback(
    (searchValue: string, filters: any = {}) => {
      dispatch(
        fetchSecuenciaECF({
          query: searchValue,
          tipoCliente: filters.tipoCliente || undefined,
          entorno: filters.entorno || undefined,
          esElectronico: filters.esElectronico
            ? filters.esElectronico === 'true'
            : undefined,
          habilitado: filters.habilitado
            ? filters.habilitado === 'true'
            : undefined,
          pageNumber: 0,
          pageSize: paginationModel.pageSize,
        }),
      )
    },
    [dispatch, paginationModel.pageSize],
  )

  const fn = useCallback(
    debounce((val: string, filters: any) => {
      setPaginationModel({ page: 0, pageSize: 20 })
      performRequest(val, filters)
    }, 900),
    [performRequest],
  )

  const handleFilter = useCallback(
    (val: string) => {
      fn.clear()
      setValue(val)
      fn(val, { tipoCliente, entorno, esElectronico, habilitado })
    },
    [fn, tipoCliente, entorno, esElectronico, habilitado],
  )

  const handleTipoClienteFilter = useCallback(
    (val: string) => {
      setTipoCliente(val)
      fn.clear()
      fn(value, { tipoCliente: val, entorno, esElectronico, habilitado })
    },
    [fn, value, entorno, esElectronico, habilitado],
  )

  const handleEntornoFilter = useCallback(
    (val: string) => {
      setEntorno(val)
      fn.clear()
      fn(value, { tipoCliente, entorno: val, esElectronico, habilitado })
    },
    [fn, value, tipoCliente, esElectronico, habilitado],
  )

  const handleEsElectronicoFilter = useCallback(
    (val: string) => {
      setEsElectronico(val)
      fn.clear()
      fn(value, { tipoCliente, entorno, esElectronico: val, habilitado })
    },
    [fn, value, tipoCliente, entorno, habilitado],
  )

  const handleHabilitadoFilter = useCallback(
    (val: string) => {
      setHabilitado(val)
      fn.clear()
      fn(value, { tipoCliente, entorno, esElectronico, habilitado: val })
    },
    [fn, value, tipoCliente, entorno, esElectronico],
  )

  const handleEdit = (row: SecuenciaEcfType) => {
    dispatch(toggleSecuenciaECFAddUpdate(row))
  }

  const handleDelete = (row: SecuenciaEcfType) => {
    setSelectedRowForAction(row)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedRowForAction) {
      dispatch(deleteSecuenciaECF(selectedRowForAction.id))
    }
    setDeleteDialogOpen(false)
    setSelectedRowForAction(null)
  }

  const handleToggleStatus = (row: SecuenciaEcfType) => {
    setSelectedRowForAction(row)
    setToggleStatusDialogOpen(true)
  }

  const confirmToggleStatus = () => {
    if (selectedRowForAction) {
      dispatch(toggleSecuenciaECFStatus(selectedRowForAction.id))
    }
    setToggleStatusDialogOpen(false)
    setSelectedRowForAction(null)
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
            <IconButton size="small" onClick={() => handleDelete(row)}>
              <Icon icon="tabler:trash" fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title={row.habilitado ? 'Deshabilitar' : 'Habilitar'}>
            <IconButton size="small" onClick={() => handleToggleStatus(row)}>
              <Icon
                icon={
                  row.habilitado ? 'tabler:toggle-right' : 'tabler:toggle-left'
                }
                fontSize={20}
                color={row.habilitado ? 'success' : 'error'}
              />
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
              title="Secuencias ECF"
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
            <SecuenciaTableHeader
              value={value}
              selectedRows={selectedRows}
              handleFilter={handleFilter}
              placeholder="Buscar por descripción, vendedor o encabezado"
              tipoCliente={tipoCliente}
              handleTipoClienteFilter={handleTipoClienteFilter}
              entorno={entorno}
              handleEntornoFilter={handleEntornoFilter}
              esElectronico={esElectronico}
              handleEsElectronicoFilter={handleEsElectronicoFilter}
              habilitado={habilitado}
              handleHabilitadoFilter={handleHabilitadoFilter}
            />
            <DataGrid
              autoHeight
              pagination
              rows={store.secuenciaData}
              columns={columns}
              disableRowSelectionOnClick
              paginationModel={paginationModel}
              onPaginationModelChange={handlePagination}
              onRowSelectionModelChange={(rows) => setSelectedRows(rows)}
              getRowId={(row: SecuenciaEcfType) => row.id}
              paginationMode="server"
              loading={store.isSecuenciaLoading}
              rowCount={store.secuenciaTotalResults}
            />
          </Card>
        </Grid>
      </Grid>
      <AddSecuenciaECFDrawer open={store.isSecuenciaAddUpdateDrawerOpen} />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            ¿Está seguro de que desea eliminar la secuencia ECF "
            {selectedRowForAction?.descripcion}"?
            <br />
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toggle Status Confirmation Dialog */}
      <Dialog
        open={toggleStatusDialogOpen}
        onClose={() => setToggleStatusDialogOpen(false)}
        aria-labelledby="toggle-dialog-title"
        aria-describedby="toggle-dialog-description"
      >
        <DialogTitle id="toggle-dialog-title">
          Confirmar Cambio de Estado
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="toggle-dialog-description">
            ¿Está seguro de que desea{' '}
            {selectedRowForAction?.habilitado ? 'deshabilitar' : 'habilitar'} la
            secuencia ECF "{selectedRowForAction?.descripcion}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setToggleStatusDialogOpen(false)}
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmToggleStatus}
            color="primary"
            variant="contained"
          >
            {selectedRowForAction?.habilitado ? 'Deshabilitar' : 'Habilitar'}
          </Button>
        </DialogActions>
      </Dialog>
    </DatePickerWrapper>
  )
}

export default SecuenciaECFList
