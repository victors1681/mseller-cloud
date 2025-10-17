// ** React Imports
import { useCallback, useEffect, useState } from 'react'

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
  Collapse,
  FormControl,
  Grid,
  Hidden,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Pagination,
  Paper,
  Select,
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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Imports
import LocationAutoComplete from 'src/views/ui/locationAutoComplete'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from 'src/store'
import {
  clearListFilters,
  fetchItemReturnsList,
  setListFilters,
  setSelectedListItem,
} from 'src/store/apps/itemReturns'

// ** Types
import {
  ItemReturnListItem,
  ItemReturnsListFilters,
} from 'src/types/apps/itemReturnsTypes'

// ** Utils
import { formatCurrency } from 'src/utils/formatCurrency'
import { formatDate } from 'src/utils/formatDate'

const ItemReturnsListView = () => {
  // ** Hooks
  const theme = useTheme()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // ** Redux State
  const {
    listView: {
      listData,
      totalCount,
      pageNumber,
      pageSize,
      totalPages,
      hasPreviousPage,
      hasNextPage,
      isLoadingList,
      listError,
      listFilters,
    },
  } = useSelector((state: RootState) => state.itemReturns)

  // ** Local State
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] =
    useState<ItemReturnsListFilters>(listFilters)

  // ** Effects
  useEffect(() => {
    dispatch(fetchItemReturnsList(listFilters))
  }, [dispatch, listFilters])

  // ** Handlers
  const handleFilterChange = useCallback(
    (newFilters: Partial<ItemReturnsListFilters>) => {
      const updatedFilters = { ...localFilters, ...newFilters, pageNumber: 1 }
      setLocalFilters(updatedFilters)
      dispatch(setListFilters(updatedFilters))
    },
    [localFilters, dispatch],
  )

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      const updatedFilters = { ...listFilters, pageNumber: page }
      dispatch(setListFilters(updatedFilters))
    },
    [listFilters, dispatch],
  )

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      const updatedFilters = {
        ...listFilters,
        pageSize: newPageSize,
        pageNumber: 1,
      }
      dispatch(setListFilters(updatedFilters))
    },
    [listFilters, dispatch],
  )

  const handleClearFilters = useCallback(() => {
    const defaultFilters = { pageNumber: 1, pageSize: 20 }
    setLocalFilters(defaultFilters)
    dispatch(clearListFilters())
  }, [dispatch])

  const handleItemSelect = useCallback(
    (item: ItemReturnListItem) => {
      dispatch(setSelectedListItem(item))
      // Navigate to detail view or show modal
      // router.push(`/apps/documents/item-returns/detail/${item.id}`)
    },
    [dispatch],
  )

  const handleDocumentNavigation = useCallback(
    (numeroDocumento: string, event: React.MouseEvent) => {
      event.stopPropagation()
      router.push(`/apps/documents/preview/${numeroDocumento}/`)
    },
    [router],
  )

  const handleCreateReturn = () => {
    router.push('/apps/documents/item-returns')
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
            >
              Historial de Devoluciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestiona y consulta todas las devoluciones de inventario
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 1, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 280 },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<Icon icon="mdi:filter-variant" />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                minWidth: { xs: '100%', sm: 120 },
                height: { xs: 44, sm: 'auto' },
              }}
            >
              Filtros
            </Button>
            <Button
              variant="contained"
              startIcon={<Icon icon="mdi:plus" />}
              onClick={handleCreateReturn}
              sx={{
                minWidth: { xs: '100%', sm: 140 },
                height: { xs: 44, sm: 'auto' },
              }}
            >
              Nueva Devolución
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Filters */}
      <Collapse in={showFilters}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title="Filtros de Búsqueda"
            action={
              <IconButton onClick={() => setShowFilters(false)}>
                <Icon icon="mdi:close" />
              </IconButton>
            }
          />
          <CardContent>
            <Grid container spacing={3}>
              {/* Document Number */}
              <Grid item xs={12} sm={6} lg={3}>
                <TextField
                  fullWidth
                  label="Número de Documento"
                  value={localFilters.numeroDocumento || ''}
                  onChange={(e) =>
                    handleFilterChange({ numeroDocumento: e.target.value })
                  }
                  InputProps={{
                    startAdornment: <Icon icon="mdi:file-document-outline" />,
                  }}
                />
              </Grid>

              {/* Product Code */}
              <Grid item xs={12} sm={6} lg={3}>
                <TextField
                  fullWidth
                  label="Código de Producto"
                  value={localFilters.codigoProducto || ''}
                  onChange={(e) =>
                    handleFilterChange({ codigoProducto: e.target.value })
                  }
                  InputProps={{
                    startAdornment: <Icon icon="mdi:barcode" />,
                  }}
                />
              </Grid>

              {/* Customer Code */}
              <Grid item xs={12} sm={6} lg={3}>
                <TextField
                  fullWidth
                  label="Código de Cliente"
                  value={localFilters.codigoCliente || ''}
                  onChange={(e) =>
                    handleFilterChange({ codigoCliente: e.target.value })
                  }
                  InputProps={{
                    startAdornment: <Icon icon="mdi:account-outline" />,
                  }}
                />
              </Grid>

              {/* Location */}
              <Grid item xs={12} sm={6} lg={3}>
                <LocationAutoComplete
                  selectedLocation={localFilters.localidadId?.toString()}
                  callBack={(value: string) =>
                    handleFilterChange({
                      localidadId: value ? parseInt(value) : undefined,
                    })
                  }
                />
              </Grid>

              {/* Date Range */}
              <Grid item xs={12} sm={6} lg={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha Desde"
                  value={
                    localFilters.fechaDesde
                      ? localFilters.fechaDesde.split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    handleFilterChange({
                      fechaDesde: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : undefined,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha Hasta"
                  value={
                    localFilters.fechaHasta
                      ? localFilters.fechaHasta.split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    handleFilterChange({
                      fechaHasta: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : undefined,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* User */}
              <Grid item xs={12} sm={6} lg={3}>
                <TextField
                  fullWidth
                  label="Usuario"
                  value={localFilters.usuario || ''}
                  onChange={(e) =>
                    handleFilterChange({ usuario: e.target.value })
                  }
                  InputProps={{
                    startAdornment: <Icon icon="mdi:account-circle-outline" />,
                  }}
                />
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12} lg={3}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    flexDirection: { xs: 'row', lg: 'column' },
                    height: '100%',
                    alignItems: { xs: 'center', lg: 'flex-end' },
                    justifyContent: { xs: 'flex-start', lg: 'flex-end' },
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    startIcon={<Icon icon="mdi:filter-remove-outline" />}
                    sx={{
                      minWidth: { xs: 120, lg: '100%' },
                      mb: { lg: 1 },
                    }}
                  >
                    Limpiar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Collapse>

      {/* Loading */}
      {isLoadingList && <LinearProgress sx={{ mb: 3 }} />}

      {/* Error */}
      {listError && (
        <Paper
          sx={{
            p: 3,
            mb: 3,
            bgcolor: 'error.light',
            color: 'error.contrastText',
          }}
        >
          <Typography variant="body1">{listError}</Typography>
        </Paper>
      )}

      {/* Results Summary */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        >
          {totalCount > 0
            ? `Mostrando ${(pageNumber - 1) * pageSize + 1}-${Math.min(
                pageNumber * pageSize,
                totalCount,
              )} de ${totalCount} resultados`
            : 'No se encontraron resultados'}
        </Typography>

        {/* Page Size Selector */}
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
          <InputLabel>Por página</InputLabel>
          <Select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            label="Por página"
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Results List - Desktop Table */}
      <Hidden mdDown>
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Documento</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Costo Unit.</TableCell>
                <TableCell align="right">Valor Total</TableCell>
                <TableCell>Localidad</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listData.map((item: ItemReturnListItem) => (
                <TableRow
                  key={item.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleItemSelect(item)}
                >
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{
                          cursor: 'pointer',
                          color: 'primary.main',
                          textDecoration: 'underline',
                          '&:hover': {
                            color: 'primary.dark',
                          },
                        }}
                        onClick={(e) =>
                          handleDocumentNavigation(item.numeroDocumento, e)
                        }
                      >
                        {item.numeroDocumento}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {item.id}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {item.nombreCliente}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.codigoCliente}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{ maxWidth: 200 }}
                      >
                        {item.nombreProducto}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.codigoProducto}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={item.cantidad}
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {formatCurrency(item.costoUnitario)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      color="success.main"
                    >
                      {formatCurrency(item.valorTotal)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item.nombreLocalidad}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item.usuarioCreacion}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(item.fechaMovimiento)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary">
                      <Icon icon="mdi:eye-outline" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Hidden>

      {/* Results List - Mobile Cards */}
      <Hidden mdUp>
        <Grid container spacing={2}>
          {listData.map((item: ItemReturnListItem) => (
            <Grid item xs={12} key={item.id}>
              <ItemReturnCard
                item={item}
                onSelect={handleItemSelect}
                onDocumentClick={handleDocumentNavigation}
                isMobile={true}
              />
            </Grid>
          ))}
        </Grid>
      </Hidden>

      {/* Empty State */}
      {!isLoadingList && listData.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Icon
            icon="mdi:package-variant-remove"
            fontSize="4rem"
            color="disabled"
          />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            No hay devoluciones registradas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {Object.keys(localFilters).length > 2
              ? 'No se encontraron devoluciones con los filtros aplicados'
              : 'Aún no hay devoluciones registradas en el sistema'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Icon icon="mdi:plus" />}
            onClick={handleCreateReturn}
          >
            Crear Primera Devolución
          </Button>
        </Paper>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={pageNumber}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? 'small' : 'medium'}
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  )
}

// ** Item Return Card Component
interface ItemReturnCardProps {
  item: ItemReturnListItem
  onSelect: (item: ItemReturnListItem) => void
  onDocumentClick: (numeroDocumento: string, event: React.MouseEvent) => void
  isMobile: boolean
}

const ItemReturnCard = ({
  item,
  onSelect,
  onDocumentClick,
  isMobile,
}: ItemReturnCardProps) => {
  const theme = useTheme()

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: theme.transitions.create(['box-shadow', 'transform']),
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-2px)',
        },
      }}
      onClick={() => onSelect(item)}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Header Info - Full width on mobile */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Icon icon="mdi:file-document-outline" color="primary" />
              <Typography
                variant="h6"
                color="primary"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': {
                    color: 'primary.dark',
                  },
                }}
                onClick={(e) => onDocumentClick(item.numeroDocumento, e)}
              >
                {item.numeroDocumento}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Cliente: {item.nombreCliente} ({item.codigoCliente})
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography
                variant="h6"
                color="success.main"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                {formatCurrency(item.valorTotal)}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {formatDate(item.fechaMovimiento)}
              </Typography>
            </Box>
          </Grid>

          {/* Product Info - Stack on mobile, side by side on desktop */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Icon icon="mdi:package-variant" />
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 500,
                }}
              >
                {item.nombreProducto}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                '& .MuiChip-root': {
                  fontSize: { xs: '0.625rem', sm: '0.75rem' },
                  height: { xs: 24, sm: 32 },
                },
              }}
            >
              <Chip
                label={`Código: ${item.codigoProducto}`}
                size="small"
                variant="outlined"
              />
              <Chip
                label={`Cantidad: ${item.cantidad}`}
                size="small"
                color="info"
              />
              <Chip
                label={`Costo Unit: ${formatCurrency(item.costoUnitario)}`}
                size="small"
                color="secondary"
              />
            </Box>
          </Grid>

          {/* Location and User - Stack on mobile */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                textAlign: { xs: 'left', md: 'right' },
                mt: { xs: 1, md: 0 },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1,
                  justifyContent: { xs: 'flex-start', md: 'flex-end' },
                }}
              >
                <Icon icon="mdi:map-marker" fontSize="small" />
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  {item.nombreLocalidad}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  justifyContent: { xs: 'flex-start', md: 'flex-end' },
                }}
              >
                <Icon icon="mdi:account-circle-outline" fontSize="small" />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  {item.usuarioCreacion}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Observations - Full width */}
          {item.observaciones && (
            <Grid item xs={12}>
              <Box
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  mt: 1,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  <strong>Observaciones:</strong> {item.observaciones}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ItemReturnsListView
