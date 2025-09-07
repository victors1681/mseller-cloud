// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  aprobarReconciliacion,
  fetchReconciliaciones,
} from 'src/store/apps/inventory'

// ** Types
import {
  EstadoReconciliacion,
  InventarioReconciliacionDTO,
} from 'src/types/apps/inventoryTypes'

// ** Utils
import formatCurrency from 'src/utils/formatCurrency'
import formatDate from 'src/utils/formatDate'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'
import TableHeader from 'src/views/apps/inventory-management/components/TableHeader'

// ** Toast
import toast from 'react-hot-toast'

interface CellType {
  row: InventarioReconciliacionDTO
}

const InventoryReconciliationsList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [selectedEstado, setSelectedEstado] = useState<
    EstadoReconciliacion | ''
  >('')
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedReconciliacion, setSelectedReconciliacion] =
    useState<InventarioReconciliacionDTO | null>(null)
  const [aprobarDialog, setAprobarDialog] = useState(false)
  const [rechazarDialog, setRechazarDialog] = useState(false)
  const [observaciones, setObservaciones] = useState('')

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.inventory)

  // ** Effects
  useEffect(() => {
    // For now, fetch all reconciliaciones for localidad 1
    dispatch(fetchReconciliaciones(1))
  }, [dispatch])

  // ** Search Handler
  const handleFilter = useCallback((val: string) => {
    setValue(val)
    setPaginationModel({ page: 0, pageSize: 10 })
  }, [])

  // ** Estado Filter Handler
  const handleEstadoChange = useCallback(
    (estado: EstadoReconciliacion | '') => {
      setSelectedEstado(estado)
      setPaginationModel({ page: 0, pageSize: 10 })
    },
    [],
  )

  // ** Menu Handlers
  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    reconciliacion: InventarioReconciliacionDTO,
  ) => {
    setAnchorEl(event.currentTarget)
    setSelectedReconciliacion(reconciliacion)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedReconciliacion(null)
  }

  // ** Action Handlers
  const handleAprobar = async () => {
    if (!selectedReconciliacion) return

    try {
      if (typeof selectedReconciliacion.id === 'number') {
        await dispatch(
          aprobarReconciliacion({
            reconciliacionId: selectedReconciliacion.id,
          }),
        ).unwrap()
      } else {
        throw new Error('ID de reconciliación inválido')
      }

      toast.success('Reconciliación aprobada exitosamente')
      setAprobarDialog(false)
      setObservaciones('')
      handleMenuClose()
    } catch (error: any) {
      toast.error(error.message || 'Error al aprobar reconciliación')
    }
  }

  const handleRechazar = async () => {
    if (!selectedReconciliacion) return

    try {
      // For now, just show a message since rechazarReconciliacion is not implemented
      toast.success('Funcionalidad de rechazo pendiente de implementación')
      setRechazarDialog(false)
      setObservaciones('')
      handleMenuClose()
    } catch (error: any) {
      toast.error(error.message || 'Error al rechazar reconciliación')
    }
  }

  // ** Estado Color Helper
  const getEstadoColor = (estado?: EstadoReconciliacion) => {
    if (!estado) return 'default'

    switch (estado) {
      case EstadoReconciliacion.Pendiente:
        return 'warning'
      case EstadoReconciliacion.Aprobada:
        return 'success'
      case EstadoReconciliacion.Rechazada:
        return 'error'
      default:
        return 'default'
    }
  }

  // ** Helper to get status from ajustesAplicados
  const getStatusFromAjustes = (
    ajustesAplicados: boolean,
    fechaAplicacion?: string,
  ) => {
    if (ajustesAplicados && fechaAplicacion) return 'Aplicado'
    if (!ajustesAplicados && fechaAplicacion) return 'Pendiente'
    return 'Creado'
  }

  const getStatusColor = (
    ajustesAplicados: boolean,
    fechaAplicacion?: string,
  ) => {
    if (ajustesAplicados && fechaAplicacion) return 'success'
    if (!ajustesAplicados && fechaAplicacion) return 'warning'
    return 'info'
  }

  // ** Columns
  const columns: GridColDef[] = [
    {
      flex: 0.15,
      minWidth: 120,
      field: 'codigoReconciliacion',
      headerName: 'Código',
      renderCell: ({ row }: CellType) => (
        <Typography
          noWrap
          variant="body2"
          component={Link}
          href={`/apps/inventory-management/reconciliations/${row.id}`}
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {row.codigoReconciliacion}
        </Typography>
      ),
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'conteoId',
      headerName: 'Conteo',
      renderCell: ({ row }: CellType) => (
        <Typography
          noWrap
          variant="body2"
          component={Link}
          href={`/apps/inventory-management/counts/${row.conteoId}`}
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Conteo #{row.conteoId}
        </Typography>
      ),
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'estado',
      headerName: 'Estado',
      renderCell: ({ row }: CellType) => {
        const status =
          row.estado ||
          getStatusFromAjustes(row.ajustesAplicados, row.fechaAplicacion)
        const color = row.estado
          ? getEstadoColor(row.estado)
          : getStatusColor(row.ajustesAplicados, row.fechaAplicacion)

        return (
          <Chip
            variant="outlined"
            label={status}
            color={color}
            size="small"
            sx={{ textTransform: 'capitalize' }}
          />
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 90,
      field: 'totalAjustes',
      headerName: 'Ajustes',
      type: 'number',
      renderCell: ({ row }: CellType) => {
        const totalAjustes =
          (row.totalAjustesPositivos || 0) +
          Math.abs(row.totalAjustesNegativos || 0)
        const hasAdjustments = totalAjustes > 0

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CustomAvatar
              skin="light"
              color={hasAdjustments ? 'warning' : 'success'}
              sx={{ width: 24, height: 24 }}
            >
              <Icon
                icon={hasAdjustments ? 'mdi:swap-horizontal' : 'mdi:check'}
                fontSize={14}
              />
            </CustomAvatar>
            <Typography variant="body2" color="text.primary">
              {totalAjustes}
            </Typography>
          </Box>
        )
      },
    },
    {
      flex: 0.12,
      minWidth: 100,
      field: 'valorTotalAjustes',
      headerName: 'Valor Total',
      type: 'number',
      renderCell: ({ row }: CellType) => {
        const valorAjustes = row.valorTotalAjustes ?? 0

        return (
          <Typography
            variant="body2"
            color="text.primary"
            sx={{
              fontWeight: 'medium',
              color:
                valorAjustes > 0
                  ? 'success.main'
                  : valorAjustes < 0
                  ? 'error.main'
                  : 'text.primary',
            }}
          >
            {formatCurrency(valorAjustes)}
          </Typography>
        )
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'reconciliadoPor',
      headerName: 'Reconciliado Por',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography noWrap variant="body2">
            {row.reconciliadoPor}
          </Typography>
        </Box>
      ),
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'fechaReconciliacion',
      headerName: 'Fecha Reconciliación',
      type: 'dateTime',
      valueGetter: (params) => {
        return params.row.fechaReconciliacion
          ? new Date(params.row.fechaReconciliacion)
          : null
      },
      renderCell: ({ row }: CellType) => (
        <Typography variant="body2" noWrap>
          {formatDate(row.fechaReconciliacion)}
        </Typography>
      ),
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'fechaAplicacion',
      headerName: 'Fecha Aplicación',
      type: 'dateTime',
      valueGetter: (params) => {
        return params.row.fechaAplicacion
          ? new Date(params.row.fechaAplicacion)
          : null
      },
      renderCell: ({ row }: CellType) => (
        <Typography variant="body2" noWrap>
          {row.fechaAplicacion ? formatDate(row.fechaAplicacion) : '-'}
        </Typography>
      ),
    },
    {
      flex: 0.12,
      minWidth: 100,
      field: 'aplicadoPor',
      headerName: 'Aplicado Por',
      renderCell: ({ row }: CellType) => (
        <Typography variant="body2" noWrap>
          {row.aplicadoPor || '-'}
        </Typography>
      ),
    },
    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: 'Acciones',
      renderCell: ({
        row,
      }: GridRenderCellParams<InventarioReconciliacionDTO>) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="small"
            component={Link}
            href={`/apps/inventory-management/reconciliations/${row.id}`}
          >
            <Icon icon="mdi:eye-outline" fontSize={20} />
          </IconButton>
        </Box>
      ),
    },
  ]

  return (
    <>
      <Card>
        <CardHeader title="Reconciliaciones de Inventario" />

        <TableHeader
          value={value}
          handleFilter={handleFilter}
          toggle={() => {}}
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={selectedEstado}
              label="Estado"
              onChange={(e) =>
                handleEstadoChange(e.target.value as EstadoReconciliacion | '')
              }
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.values(EstadoReconciliacion).map((estado) => (
                <MenuItem key={estado} value={estado}>
                  {estado}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableHeader>

        <DataGrid
          autoHeight
          rows={store.reconciliaciones}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={store.loading}
          pageSizeOptions={[10, 25, 50]}
          rowCount={store.reconciliaciones.length}
          paginationMode="server"
        />
      </Card>

      {/* Aprobar Dialog */}
      <Dialog
        open={aprobarDialog}
        onClose={() => setAprobarDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Aprobar Reconciliación</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Ingrese observaciones sobre la aprobación..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAprobarDialog(false)}>Cancelar</Button>
          <Button onClick={handleAprobar} variant="contained" color="success">
            Aprobar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rechazar Dialog */}
      <Dialog
        open={rechazarDialog}
        onClose={() => setRechazarDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rechazar Reconciliación</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            required
            multiline
            rows={3}
            label="Motivo del Rechazo"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Ingrese el motivo del rechazo..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRechazarDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleRechazar}
            variant="contained"
            color="error"
            disabled={!observaciones.trim()}
          >
            Rechazar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default InventoryReconciliationsList
