// ** React Imports
import { useEffect, useState } from 'react'

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
  MenuItem,
  TextField,
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import { LocationAutocomplete } from 'src/views/ui/locationAutoComplete'
import ProductSearchDialog from 'src/views/ui/productsSearchDialog'

// ** Types
import {
  MovimientoInventarioFilters,
  TipoMovimientoInventario,
} from 'src/types/apps/inventoryMovementsTypes'
import { ProductType } from 'src/types/apps/productTypes'

interface MovementFiltersProps {
  filters: MovimientoInventarioFilters
  onFilterChange: (filters: Partial<MovimientoInventarioFilters>) => void
  onResetFilters: () => void
  loading: boolean
}

const movementTypeOptions = [
  { value: TipoMovimientoInventario.Salida, label: 'Salida', color: 'error' },
  {
    value: TipoMovimientoInventario.Entrada,
    label: 'Entrada',
    color: 'success',
  },
  {
    value: TipoMovimientoInventario.Devolucion,
    label: 'Devolución',
    color: 'warning',
  },
  { value: TipoMovimientoInventario.Ajuste, label: 'Ajuste', color: 'info' },
]

const MovementFilters = ({
  filters,
  onFilterChange,
  onResetFilters,
  loading,
}: MovementFiltersProps) => {
  // ** State
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  )
  const [fromDate, setFromDate] = useState<Date | null>(
    filters.desde ? new Date(filters.desde) : null,
  )
  const [toDate, setToDate] = useState<Date | null>(
    filters.hasta ? new Date(filters.hasta) : null,
  )

  // ** Effects
  useEffect(() => {
    // Update local dates when filters change
    setFromDate(filters.desde ? new Date(filters.desde) : null)
    setToDate(filters.hasta ? new Date(filters.hasta) : null)
  }, [filters.desde, filters.hasta])

  // ** Handlers
  const handleProductSelect = (product: ProductType) => {
    setSelectedProduct(product)
    onFilterChange({ codigoProducto: product.codigo })
    setProductDialogOpen(false)
  }

  const handleLocationChange = (locationId: string) => {
    onFilterChange({
      localidadId: locationId ? parseInt(locationId) : undefined,
    })
  }

  const handleMovementTypeChange = (type: string) => {
    onFilterChange({
      tipoMovimiento: type
        ? (parseInt(type) as TipoMovimientoInventario)
        : undefined,
    })
  }

  const handleFromDateChange = (date: Date | null) => {
    setFromDate(date)
    onFilterChange({
      desde: date ? date.toISOString() : undefined,
    })
  }

  const handleToDateChange = (date: Date | null) => {
    setToDate(date)
    onFilterChange({
      hasta: date ? date.toISOString() : undefined,
    })
  }

  const handleReset = () => {
    setSelectedProduct(null)
    setFromDate(null)
    setToDate(null)
    onResetFilters()
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.codigoProducto) count++
    if (filters.localidadId) count++
    if (filters.tipoMovimiento !== undefined) count++
    if (filters.desde) count++
    if (filters.hasta) count++
    return count
  }

  return (
    <Card>
      <CardHeader
        title="Filtros de Búsqueda"
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {getActiveFiltersCount() > 0 && (
              <Chip
                label={`${getActiveFiltersCount()} filtros activos`}
                color="primary"
                size="small"
              />
            )}
            <Button
              variant="outlined"
              onClick={handleReset}
              startIcon={<Icon icon="mdi:filter-off" />}
              disabled={loading || getActiveFiltersCount() === 0}
              size="small"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 2, sm: 3 },
              }}
            >
              Limpiar
            </Button>
          </Box>
        }
      />
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 2, sm: 4 }}>
          {/* Product Search */}
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Producto"
              value={selectedProduct?.descripcion || ''}
              onClick={() => setProductDialogOpen(true)}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton onClick={() => setProductDialogOpen(true)}>
                    <Icon icon="mdi:magnify" />
                  </IconButton>
                ),
              }}
              placeholder="Seleccionar producto..."
              helperText="Haz clic para buscar un producto"
              size="small"
            />
          </Grid>

          {/* Location Filter */}
          <Grid item xs={12} md={6} lg={4}>
            <LocationAutocomplete
              selectedLocation={filters.localidadId?.toString()}
              callBack={handleLocationChange}
              size="small"
            />
          </Grid>

          {/* Movement Type */}
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              select
              label="Tipo de Movimiento"
              value={filters.tipoMovimiento?.toString() || ''}
              size="small"
              onChange={(e) => handleMovementTypeChange(e.target.value)}
            >
              <MenuItem value="">Todos los tipos</MenuItem>
              {movementTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value.toString()}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={option.label}
                      color={option.color as any}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Date Range */}
          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Fecha Desde"
              type="date"
              value={fromDate ? fromDate.toISOString().split('T')[0] : ''}
              onChange={(e) =>
                handleFromDateChange(
                  e.target.value ? new Date(e.target.value) : null,
                )
              }
              InputLabelProps={{
                shrink: true,
              }}
              helperText="Fecha inicial del rango"
              size="small"
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <TextField
              fullWidth
              label="Fecha Hasta"
              type="date"
              value={toDate ? toDate.toISOString().split('T')[0] : ''}
              onChange={(e) =>
                handleToDateChange(
                  e.target.value ? new Date(e.target.value) : null,
                )
              }
              InputLabelProps={{
                shrink: true,
              }}
              helperText="Fecha final del rango"
              size="small"
            />
          </Grid>
        </Grid>

        {/* Product Search Dialog */}
        <ProductSearchDialog
          open={productDialogOpen}
          onClose={() => setProductDialogOpen(false)}
          onSelectProduct={handleProductSelect}
          title="Seleccionar Producto"
          maxWidth="lg"
        />
      </CardContent>
    </Card>
  )
}

export default MovementFilters
