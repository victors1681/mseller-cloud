// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

// ** Third Party Imports
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useDispatch, useSelector } from 'react-redux'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { AppDispatch, RootState } from 'src/store'
import { fetchCxcList } from 'src/store/apps/cxc'

// ** Types
import { TipoMovimientoCxc } from 'src/types/apps/cxcTypes'

// ** Utils
import formatCurrency from 'src/utils/formatCurrency'

// ** Components
import CustomerSearchDialog from 'src/views/ui/customerSearchDialog'

const NotesListView = () => {
  // ** Hooks
  const theme = useTheme()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const cxcStore = useSelector((state: RootState) => state.cxc)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // ** State
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [noteType, setNoteType] = useState<'credit' | 'debit'>('credit')
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // ** Effects
  useEffect(() => {
    dispatch(fetchCxcList({ pageNumber: 1, pageSize: 100 }))
  }, [dispatch])

  // ** Get all movements from CXCs
  const allMovements = cxcStore.data.flatMap((cxc) => {
    if (!cxc.movimientos) return []
    return cxc.movimientos
      .filter(
        (mov) =>
          mov.tipoMovimiento === TipoMovimientoCxc.NotaCredito ||
          mov.tipoMovimiento === TipoMovimientoCxc.NotaDebito,
      )
      .map((mov) => ({
        ...mov,
        cxc,
      }))
  })

  // ** Filtered movements
  const filteredMovements = allMovements.filter((mov) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      mov.numeroMovimiento.toLowerCase().includes(query) ||
      mov.cxc.numeroCxc.toLowerCase().includes(query) ||
      mov.cxc.cliente?.nombre?.toLowerCase().includes(query)
    )
  })

  // ** Handlers
  const handleCreateCreditNote = () => {
    setNoteType('credit')
    setCustomerSearchOpen(true)
  }

  const handleCreateDebitNote = () => {
    setNoteType('debit')
    setCustomerSearchOpen(true)
  }

  const handleCustomerSelect = (customer: any) => {
    setCustomerSearchOpen(false)
    // Navigate to customer detail to create note
    router.push(`/apps/clients/detail/${customer.codigo}`)
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es })
    } catch {
      return 'Fecha inválida'
    }
  }

  const getMovementTypeChip = (tipo: string) => {
    const isCredit = tipo === TipoMovimientoCxc.NotaCredito
    return (
      <Chip
        label={isCredit ? 'Nota Crédito' : 'Nota Débito'}
        color={isCredit ? 'info' : 'warning'}
        size="small"
        icon={
          <Icon
            icon={isCredit ? 'mdi:note-edit-outline' : 'mdi:note-plus-outline'}
          />
        }
      />
    )
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Stack
          direction={isMobile ? 'column' : 'row'}
          justifyContent="space-between"
          alignItems={isMobile ? 'flex-start' : 'center'}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              component="h1"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              Notas de Crédito y Débito
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestiona todas las notas de crédito y débito del sistema
            </Typography>
          </Box>

          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={1}
            sx={{ width: isMobile ? '100%' : 'auto' }}
          >
            <Button
              variant="contained"
              color="info"
              startIcon={<Icon icon="mdi:note-edit-outline" />}
              onClick={handleCreateCreditNote}
              fullWidth={isMobile}
              size={isMobile ? 'medium' : 'medium'}
              sx={{ minHeight: isMobile ? 44 : 'auto' }}
            >
              Crear Nota Crédito
            </Button>
            <Button
              variant="contained"
              color="warning"
              startIcon={<Icon icon="mdi:note-plus-outline" />}
              onClick={handleCreateDebitNote}
              fullWidth={isMobile}
              size={isMobile ? 'medium' : 'medium'}
              sx={{ minHeight: isMobile ? 44 : 'auto' }}
            >
              Crear Nota Débito
            </Button>
          </Stack>
        </Stack>

        {/* Info Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  <Icon icon="mdi:note-multiple-outline" fontSize="1.5rem" />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    {allMovements.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Notas
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'info.main',
                    color: 'info.contrastText',
                  }}
                >
                  <Icon icon="mdi:note-edit-outline" fontSize="1.5rem" />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    {
                      allMovements.filter(
                        (m) =>
                          m.tipoMovimiento === TipoMovimientoCxc.NotaCredito,
                      ).length
                    }
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Notas Crédito
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'warning.main',
                    color: 'warning.contrastText',
                  }}
                >
                  <Icon icon="mdi:note-plus-outline" fontSize="1.5rem" />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    {
                      allMovements.filter(
                        (m) =>
                          m.tipoMovimiento === TipoMovimientoCxc.NotaDebito,
                      ).length
                    }
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Notas Débito
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'success.main',
                    color: 'success.contrastText',
                  }}
                >
                  <Icon icon="mdi:currency-usd" fontSize="1.5rem" />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    {formatCurrency(
                      allMovements.reduce((sum, m) => sum + m.monto, 0),
                    )}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Monto Total
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Buscar por número de nota, CXC o cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Icon icon="mdi:magnify" fontSize="1.25rem" />,
            }}
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader
          title={`Notas Registradas (${filteredMovements.length})`}
          titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
        />
        <CardContent>
          {cxcStore.isLoading ? (
            <Box sx={{ py: 4 }}>
              {[...Array(5)].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height={60}
                  sx={{ mb: 2 }}
                />
              ))}
            </Box>
          ) : filteredMovements.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Icon
                icon="mdi:note-outline"
                fontSize="3rem"
                style={{ color: theme.palette.text.disabled }}
              />
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                {searchQuery
                  ? 'No se encontraron notas'
                  : 'No hay notas registradas'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Crea tu primera nota de crédito o débito
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Número</TableCell>
                    <TableCell>CXC</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Usuario</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMovements.map((movement) => (
                    <TableRow key={movement.id} hover>
                      <TableCell>
                        {getMovementTypeChip(movement.tipoMovimiento)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {movement.numeroMovimiento}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {movement.cxc.numeroCxc}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {movement.cxc.numeroDocumento}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {movement.cxc.cliente?.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {movement.cxc.codigoCliente}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(movement.monto)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(movement.fechaMovimiento)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {movement.usuarioCreacion}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() =>
                            router.push(
                              `/apps/cxc/detail/${movement.cxc.numeroCxc}`,
                            )
                          }
                        >
                          <Icon icon="mdi:eye-outline" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Customer Search Dialog */}
      <CustomerSearchDialog
        open={customerSearchOpen}
        onClose={() => {
          setCustomerSearchOpen(false)
        }}
        onSelectCustomer={handleCustomerSelect}
      />
    </Box>
  )
}

export default NotesListView
