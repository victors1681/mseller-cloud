// ** React Imports
import { useCallback, useState } from 'react'

// ** MUI Imports
import {
  Alert,
  Box,
  Fade,
  Grid,
  Paper,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { clearErrors, resetState } from 'src/store/apps/itemReturns'

// ** Components
import DocumentSearchCard from './DocumentSearchCard'
import ReturnCalculationCard from './ReturnCalculationCard'
import ReturnHistoryCard from './ReturnHistoryCard'
import ReturnProcessingCard from './ReturnProcessingCard'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const steps = [
  {
    label: 'Buscar Documento',
    description: 'Selecciona la factura o documento',
    icon: 'mdi:magnify',
  },
  {
    label: 'Calcular Devolución',
    description: 'Configura productos y cantidades',
    icon: 'mdi:calculator',
  },
  {
    label: 'Procesar',
    description: 'Confirma y procesa la devolución',
    icon: 'mdi:send',
  },
]

const ItemReturnsView = () => {
  // ** State
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  // ** Redux
  const dispatch = useDispatch<AppDispatch>()
  const {
    selectedDocument,
    documentItems,
    isLoadingDocumentItems,
    calculations,
    isProcessing,
    documentItemsError,
    calculationError,
    processError,
    processingResult,
  } = useSelector((state: RootState) => state.itemReturns)

  // ** Determine current step
  const getActiveStep = () => {
    if (!selectedDocument) return 0
    if (!calculations) return 1
    return 2
  }

  const activeStep = getActiveStep()

  // ** Handlers
  const handleDocumentSelected = useCallback((numeroDocumento: string) => {
    // Move to calculation step when document is selected
    setCurrentStep(1)
  }, [])

  const handleProcessComplete = useCallback(
    (numeroDocumento: string) => {
      setSuccessMessage(
        `Devolución procesada exitosamente para el documento: ${numeroDocumento}`,
      )

      // Reset to step 0 after a delay
      setTimeout(() => {
        dispatch(resetState())
        setCurrentStep(0)
      }, 3000)
    },
    [dispatch],
  )

  const handleClearError = useCallback(() => {
    dispatch(clearErrors())
  }, [dispatch])

  const handleCloseSuccess = useCallback(() => {
    setSuccessMessage(null)
  }, [])

  return (
    <Grid container spacing={{ xs: 3, sm: 6 }}>
      {/* Header */}
      <Grid item xs={12}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
            mb: 1,
          }}
        >
          Devoluciones de Productos
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          Procesa devoluciones de productos con cálculos fiscales y
          actualización automática de CXC
        </Typography>
      </Grid>

      {/* Process Stepper */}
      <Grid item xs={12}>
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 2 }}>
          <Stepper
            activeStep={activeStep}
            orientation="horizontal"
            sx={{
              '& .MuiStepLabel-root': {
                cursor: 'default',
              },
            }}
          >
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={({ active, completed }) => (
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: completed
                          ? 'success.main'
                          : active
                          ? 'primary.main'
                          : 'action.disabled',
                        color: completed || active ? 'white' : 'text.disabled',
                      }}
                    >
                      <Icon
                        icon={completed ? 'mdi:check' : step.icon}
                        fontSize="1rem"
                      />
                    </Box>
                  )}
                >
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                    >
                      {step.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      </Grid>

      {/* Global Error Alert */}
      {(documentItemsError || calculationError || processError) && (
        <Grid item xs={12}>
          <Alert
            severity="error"
            onClose={handleClearError}
            sx={{
              mb: 2,
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            {documentItemsError || calculationError || processError}
          </Alert>
        </Grid>
      )}

      {/* Step 1: Document Search */}
      <Grid item xs={12}>
        <Fade in={true} timeout={500}>
          <Box>
            <DocumentSearchCard onDocumentSelected={handleDocumentSelected} />
          </Box>
        </Fade>
      </Grid>

      {/* Step 2: Return Calculation */}
      {selectedDocument && documentItems.length > 0 && (
        <Grid item xs={12}>
          <Fade in={true} timeout={500}>
            <Box>
              <ReturnCalculationCard disabled={isProcessing} />
            </Box>
          </Fade>
        </Grid>
      )}

      {/* Step 3: Process Return */}
      {selectedDocument && calculations && (
        <Grid item xs={12}>
          <Fade in={true} timeout={500}>
            <Box>
              <ReturnProcessingCard onProcessComplete={handleProcessComplete} />
            </Box>
          </Fade>
        </Grid>
      )}

      {/* Help Information */}
      <Grid item xs={12}>
        <Paper sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'action.hover' }}>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 1,
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            ℹ️ Información Importante:
          </Typography>
          <Box
            component="ul"
            sx={{
              m: 0,
              pl: { xs: 2, sm: 3 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            <li>
              <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
                Las devoluciones se procesan con los precios originales del
                documento
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
                Los cálculos fiscales incluyen descuentos e impuestos aplicables
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
                Se generará un movimiento automático en CXC para ventas a
                crédito
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
                El inventario se actualizará automáticamente con los productos
                devueltos
              </Typography>
            </li>
          </Box>
        </Paper>
      </Grid>

      {/* Return History */}
      <Grid item xs={12}>
        <ReturnHistoryCard maxHeight={300} />
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
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

export default ItemReturnsView
