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
import Menu from '@mui/material/Menu'
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
import { format } from 'date-fns'

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
      await dispatch(
        aprobarReconciliacion({
          reconciliacionId: selectedReconciliacion.id,
          usuario: 'current-user',
        }),
      ).unwrap()

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
  const getEstadoColor = (estado: EstadoReconciliacion) => {
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

  // ** Columns
  const columns: GridColDef[] = [
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
            href={`/apps/inventory-management/reconciliaciones/${row.id}`}
          >
            <Icon icon="mdi:eye-outline" fontSize={20} />
          </IconButton>
          <IconButton size="small" onClick={(e) => handleMenuClick(e, row)}>
            <Icon icon="mdi:dots-vertical" fontSize={20} />
          </IconButton>
        </Box>
      ),
    },
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
          href={`/apps/inventory-management/reconciliaciones/${row.id}`}
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
          href={`/apps/inventory-management/conteos/${row.conteoId}`}
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
      renderCell: ({ row }: CellType) => (
        <Chip
          variant="outlined"
          label={row.estado}
          color={getEstadoColor(row.estado)}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      flex: 0.1,
      minWidth: 90,
      field: 'totalDiscrepancias',
      headerName: 'Discrepancias',
      type: 'number',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CustomAvatar
            skin="light"
            color={row.totalDiscrepancias > 0 ? 'error' : 'success'}
            sx={{ width: 24, height: 24 }}
          >
            <Icon
              icon={
                row.totalDiscrepancias > 0 ? 'mdi:alert-outline' : 'mdi:check'
              }
              fontSize={14}
            />
          </CustomAvatar>
          <Typography variant="body2" color="text.primary">
            {row.totalDiscrepancias}
          </Typography>
        </Box>
      ),
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'reconciliadoPor',
      headerName: 'Reconciliado Por',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CustomAvatar skin="light" sx={{ width: 30, height: 30 }}>
            {row.reconciliadoPor.charAt(0).toUpperCase()}
          </CustomAvatar>
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
      renderCell: ({ row }: CellType) => (
        <Typography variant="body2" noWrap>
          {format(new Date(row.fechaCreacion), 'dd/MM/yyyy HH:mm')}
        </Typography>
      ),
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'fechaAprobacion',
      headerName: 'Fecha Aprobación',
      type: 'dateTime',
      renderCell: ({ row }: CellType) => (
        <Typography variant="body2" noWrap>
          {row.fechaAprobacion
            ? format(new Date(row.fechaAprobacion), 'dd/MM/yyyy HH:mm')
            : '-'}
        </Typography>
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

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedReconciliacion?.estado === EstadoReconciliacion.Pendiente && (
          <>
            <MenuItem onClick={() => setAprobarDialog(true)}>
              <Icon icon="mdi:check" fontSize={20} />
              <Typography sx={{ ml: 2 }}>Aprobar</Typography>
            </MenuItem>
            <MenuItem onClick={() => setRechazarDialog(true)}>
              <Icon icon="mdi:close" fontSize={20} />
              <Typography sx={{ ml: 2 }}>Rechazar</Typography>
            </MenuItem>
          </>
        )}
        <MenuItem
          component={Link}
          href={`/apps/inventory-management/reconciliaciones/${selectedReconciliacion?.id}`}
          onClick={handleMenuClose}
        >
          <Icon icon="mdi:eye-outline" fontSize={20} />
          <Typography sx={{ ml: 2 }}>Ver Detalles</Typography>
        </MenuItem>
      </Menu>

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
