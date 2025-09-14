// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  cancelarConteo,
  clearFilters,
  completarConteo,
  fetchConteos,
  iniciarConteo,
  setFilters,
} from 'src/store/apps/inventory'

// ** Types
import {
  EstadoInventario,
  InventarioConteoDTO,
  InventarioFilters,
} from 'src/types/apps/inventoryTypes'

// ** Utils
import { format } from 'date-fns'

// ** Helper Functions
const mapEstadoFromApi = (estadoNumerico: number): EstadoInventario => {
  const estadoMap = {
    0: EstadoInventario.Planificado,
    1: EstadoInventario.EnProgreso,
    2: EstadoInventario.Completado,
    3: EstadoInventario.Reconciliado,
    4: EstadoInventario.Cancelado,
  } as const

  return (
    estadoMap[estadoNumerico as keyof typeof estadoMap] ||
    EstadoInventario.Planificado
  )
}

const getEstadoLabel = (estado: EstadoInventario): string => {
  const labelMap = {
    [EstadoInventario.Planificado]: 'Planificado',
    [EstadoInventario.EnProgreso]: 'En Progreso',
    [EstadoInventario.Completado]: 'Completado',
    [EstadoInventario.Reconciliado]: 'Reconciliado',
    [EstadoInventario.Cancelado]: 'Cancelado',
  }

  return labelMap[estado]
}

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'
import PlanCountDialog from './PlanCountDialog'
import TableHeader from './TableHeader'

const InventoryCountsList = () => {
  // ** State
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })
  const [planificarDialogOpen, setPlanificarDialogOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.inventory)

  // ** Fetch data on component mount and filter changes
  useEffect(() => {
    if (store.selectedLocalidad) {
      dispatch(
        fetchConteos({
          localidadId: store.selectedLocalidad.id,
          filters: store.filters,
        }),
      )
    }
  }, [dispatch, store.selectedLocalidad, store.filters])

  // ** Handle filter changes
  const handleFilterChange = useCallback(
    (field: keyof InventarioFilters, value: any) => {
      dispatch(setFilters({ [field]: value }))
    },
    [dispatch],
  )

  // ** Handle clear filters
  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters())
  }, [dispatch])

  // ** Handle conteo actions
  const handleIniciarConteo = async (conteoId: number) => {
    // TODO: Get current user from auth context
    await dispatch(iniciarConteo({ conteoId, usuario: 'current-user' }))
  }

  const handleCompletarConteo = async (conteoId: number) => {
    // TODO: Get current user from auth context
    await dispatch(completarConteo({ conteoId, usuario: 'current-user' }))
  }

  const handleCancelarConteo = async (conteoId: number, motivo: string) => {
    // TODO: Get current user from auth context
    await dispatch(
      cancelarConteo({ conteoId, usuario: 'current-user', motivo }),
    )
  }

  // ** Helper function to get current estado as enum
  const getCurrentEstado = (
    estadoValue: EstadoInventario | number,
  ): EstadoInventario => {
    return typeof estadoValue === 'number'
      ? mapEstadoFromApi(estadoValue)
      : estadoValue
  }

  // ** Render estado chip
  const renderEstadoChip = (estadoValue: EstadoInventario | number) => {
    // Handle both numeric and string enum values
    const estado = getCurrentEstado(estadoValue)

    const colorMap = {
      [EstadoInventario.Planificado]: 'info',
      [EstadoInventario.EnProgreso]: 'warning',
      [EstadoInventario.Completado]: 'primary',
      [EstadoInventario.Reconciliado]: 'success',
      [EstadoInventario.Cancelado]: 'error',
    } as const

    return (
      <Chip
        size="small"
        label={getEstadoLabel(estado)}
        color={colorMap[estado]}
        sx={{ textTransform: 'capitalize' }}
      />
    )
  }

  // ** Render action buttons
  const renderActionButtons = (conteo: InventarioConteoDTO) => {
    const currentEstado = getCurrentEstado(conteo.estado)

    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Ver detalles">
          <IconButton
            size="small"
            component={Link}
            href={`/apps/inventory-management/counts/${conteo.id}`}
          >
            <Icon icon="mdi:eye-outline" />
          </IconButton>
        </Tooltip>

        {currentEstado === EstadoInventario.Planificado && (
          <Tooltip title="Iniciar conteo">
            <IconButton
              size="small"
              onClick={() => handleIniciarConteo(conteo.id)}
              color="primary"
            >
              <Icon icon="mdi:play-outline" />
            </IconButton>
          </Tooltip>
        )}

        {currentEstado === EstadoInventario.EnProgreso && (
          <Tooltip title="Completar conteo">
            <IconButton
              size="small"
              onClick={() => handleCompletarConteo(conteo.id)}
              color="success"
            >
              <Icon icon="mdi:check-outline" />
            </IconButton>
          </Tooltip>
        )}

        {(currentEstado === EstadoInventario.Planificado ||
          currentEstado === EstadoInventario.EnProgreso) && (
          <Tooltip title="Cancelar conteo">
            <IconButton
              size="small"
              onClick={() =>
                handleCancelarConteo(conteo.id, 'Cancelado desde portal')
              }
              color="error"
            >
              <Icon icon="mdi:close-outline" />
            </IconButton>
          </Tooltip>
        )}

        {
          <Tooltip title="Ver analytics">
            <IconButton
              size="small"
              component={Link}
              href={`/apps/inventory-management/counts/${conteo.id}/analytics`}
            >
              <Icon icon="mdi:chart-line" />
            </IconButton>
          </Tooltip>
        }
      </Box>
    )
  }

  // ** Column definitions
  const columns: GridColDef[] = [
    {
      flex: 0.15,
      minWidth: 120,
      field: 'codigoConteo',
      headerName: 'Código',
      renderCell: ({ row }: { row: InventarioConteoDTO }) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {row.codigoConteo}
        </Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'estado',
      headerName: 'Estado',
      renderCell: ({ row }: { row: InventarioConteoDTO }) =>
        renderEstadoChip(row.estado),
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'fechaInicio',
      headerName: 'Fecha Inicio',
      renderCell: ({ row }: { row: InventarioConteoDTO }) => (
        <Typography variant="body2">
          {format(new Date(row.fechaInicio), 'dd/MM/yyyy')}
        </Typography>
      ),
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'creadoPor',
      headerName: 'Creado Por',
      renderCell: ({ row }: { row: InventarioConteoDTO }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CustomAvatar skin="light" sx={{ width: 30, height: 30 }}>
            {row.creadoPor?.charAt(0).toUpperCase() || 'N'}
          </CustomAvatar>
          <Typography variant="body2">{row.creadoPor || 'N/A'}</Typography>
        </Box>
      ),
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: 'totalDiscrepancias',
      headerName: 'Discrepancias',
      renderCell: ({ row }: { row: InventarioConteoDTO }) => (
        <Typography variant="body2">{row.totalDiscrepancias}</Typography>
      ),
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'totalProductosContados',
      headerName: 'Productos Contados',
      renderCell: ({ row }: { row: InventarioConteoDTO }) => (
        <Typography variant="body2">{row.totalProductosContados}</Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 160,
      field: 'actions',
      headerName: 'Acciones',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: ({ row }: { row: InventarioConteoDTO }) =>
        renderActionButtons(row),
    },
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Gestión de Inventario"
            action={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Icon icon="mdi:plus" />}
                  onClick={() => setPlanificarDialogOpen(true)}
                  disabled={!store.selectedLocalidad}
                >
                  Planificar Conteo
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Icon icon="mdi:filter-remove-outline" />}
                  onClick={handleClearFilters}
                >
                  Limpiar Filtros
                </Button>
              </Box>
            }
          />
          <Divider />

          <TableHeader
            filters={store.filters}
            onFilterChange={handleFilterChange}
            selectedLocalidad={store.selectedLocalidad}
          />

          <DataGrid
            autoHeight
            rows={store.conteos}
            columns={columns}
            checkboxSelection
            pageSizeOptions={[5, 10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onRowSelectionModelChange={(newSelection) =>
              setSelectedRows(newSelection)
            }
            loading={store.loading}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': { borderRadius: 0 },
            }}
          />
        </Card>
      </Grid>

      <PlanCountDialog
        open={planificarDialogOpen}
        onClose={() => setPlanificarDialogOpen(false)}
        localidad={store.selectedLocalidad}
      />
    </Grid>
  )
}

export default InventoryCountsList
