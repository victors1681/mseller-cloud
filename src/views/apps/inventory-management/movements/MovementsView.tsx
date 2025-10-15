// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import { Alert, Grid, Typography } from '@mui/material'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  clearError,
  fetchProductMovements,
  resetFilters,
  setFilters,
} from 'src/store/apps/inventoryMovements'

// ** Components
import MovementDataGrid from './MovementDataGrid'
import MovementDetailModal from './MovementDetailModal'
import MovementFilters from './MovementFilters'
import MovementStatsCard from './MovementStatsCard'

// ** Types
import { MovimientoInventarioResponse } from 'src/types/apps/inventoryMovementsTypes'

const MovementsView = () => {
  // ** State
  const [selectedMovement, setSelectedMovement] =
    useState<MovimientoInventarioResponse | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  // ** Redux
  const dispatch = useDispatch<AppDispatch>()
  const { movements, loading, error, filters } = useSelector(
    (state: RootState) => state.inventoryMovements,
  )

  // ** Effects
  useEffect(() => {
    // Load movements when filters change and product code is available
    if (filters.codigoProducto) {
      dispatch(
        fetchProductMovements({
          codigoProducto: filters.codigoProducto,
          filters: {
            localidadId: filters.localidadId,
            tipoMovimiento: filters.tipoMovimiento,
            desde: filters.desde,
            hasta: filters.hasta,
            pageNumber: filters.pageNumber,
            pageSize: filters.pageSize,
          },
        }),
      )
    }
  }, [dispatch, filters])

  // ** Handlers
  const handleFilterChange = useCallback(
    (newFilters: any) => {
      dispatch(setFilters(newFilters))
    },
    [dispatch],
  )

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters())
  }, [dispatch])

  const handleViewDetails = useCallback(
    (movement: MovimientoInventarioResponse) => {
      setSelectedMovement(movement)
      setDetailModalOpen(true)
    },
    [],
  )

  const handleCloseModal = useCallback(() => {
    setDetailModalOpen(false)
    setSelectedMovement(null)
  }, [])

  const handleClearError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setFilters({ pageNumber: page }))
    },
    [dispatch],
  )

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      dispatch(setFilters({ pageSize, pageNumber: 1 }))
    },
    [dispatch],
  )

  return (
    <Grid container spacing={{ xs: 3, sm: 6 }}>
      <Grid item xs={12}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
            mb: 1,
          }}
        >
          Movimientos de Inventario
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          Consulta el historial de movimientos de inventario con filtros
          avanzados
        </Typography>
      </Grid>

      {/* Error Alert */}
      {error && (
        <Grid item xs={12}>
          <Alert
            severity="error"
            onClose={handleClearError}
            sx={{
              mb: { xs: 2, sm: 4 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            {error}
          </Alert>
        </Grid>
      )}

      {/* Filters */}
      <Grid item xs={12}>
        <MovementFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          loading={loading}
        />
      </Grid>

      {/* Stats */}
      {movements.items.length > 0 && (
        <Grid item xs={12}>
          <MovementStatsCard movements={movements.items} />
        </Grid>
      )}

      {/* Data Grid */}
      <Grid item xs={12}>
        <MovementDataGrid
          movements={movements}
          loading={loading}
          onViewDetails={handleViewDetails}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Grid>

      {/* Detail Modal */}
      <MovementDetailModal
        open={detailModalOpen}
        movement={selectedMovement}
        onClose={handleCloseModal}
      />
    </Grid>
  )
}

export default MovementsView
