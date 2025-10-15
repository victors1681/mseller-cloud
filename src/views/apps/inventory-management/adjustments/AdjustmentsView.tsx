// ** React Imports
import { useCallback, useState } from 'react'

// ** MUI Imports
import { Alert, Grid, Snackbar, Typography } from '@mui/material'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  clearError,
  createInventoryAdjustment,
  fetchLocationAdjustments,
} from 'src/store/apps/inventoryMovements'

// ** Components
import AdjustmentHistoryList from './AdjustmentHistoryList'
import CreateAdjustmentCard from './CreateAdjustmentCard'

// ** Types
import { AjusteInventarioRequest } from 'src/types/apps/inventoryMovementsTypes'

const AdjustmentsView = () => {
  // ** State
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null,
  )

  // ** Redux
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector(
    (state: RootState) => state.inventoryMovements,
  )

  // ** Handlers
  const handleCreateAdjustment = useCallback(
    async (adjustmentData: AjusteInventarioRequest) => {
      try {
        const result = await dispatch(createInventoryAdjustment(adjustmentData))

        if (createInventoryAdjustment.fulfilled.match(result)) {
          setSuccessMessage(
            `Ajuste creado exitosamente. Documento: ${result.payload.numeroDocumento}`,
          )

          // Refresh history if we have a selected location
          if (selectedLocationId) {
            dispatch(
              fetchLocationAdjustments({
                localidadId: selectedLocationId,
                filters: { limit: 50 },
              }),
            )
          }
        }
      } catch (error) {
        console.error('Error creating adjustment:', error)
      }
    },
    [dispatch, selectedLocationId],
  )

  const handleLocationChange = useCallback(
    (locationId: number | null) => {
      setSelectedLocationId(locationId)
      if (locationId) {
        dispatch(
          fetchLocationAdjustments({
            localidadId: locationId,
            filters: { limit: 50 },
          }),
        )
      }
    },
    [dispatch],
  )

  const handleClearError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleCloseSuccess = useCallback(() => {
    setSuccessMessage(null)
  }, [])

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
          Ajustes de Inventario
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          Realiza ajustes manuales de inventario para correcciones de stock
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

      {/* Create Adjustment Form */}
      <Grid item xs={12} lg={6}>
        <CreateAdjustmentCard
          onCreateAdjustment={handleCreateAdjustment}
          loading={loading}
        />
      </Grid>

      {/* Adjustment History */}
      <Grid item xs={12} lg={6}>
        <AdjustmentHistoryList
          onLocationChange={handleLocationChange}
          selectedLocationId={selectedLocationId}
        />
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{
            width: '100%',
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Grid>
  )
}

export default AdjustmentsView
