// ** React Imports
import { useCallback, useState } from 'react'

// ** MUI Imports
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  clearErrors,
  fetchDocumentItems,
  setSelectedDocument,
} from 'src/store/apps/itemReturns'

// ** Types
interface DocumentSearchForm {
  numeroDocumento: string
}

interface DocumentSearchCardProps {
  onDocumentSelected?: (numeroDocumento: string) => void
}

// ** Validation Schema
const schema = yup.object().shape({
  numeroDocumento: yup
    .string()
    .required('El número de documento es requerido')
    .min(3, 'Mínimo 3 caracteres'),
})

const DocumentSearchCard = ({
  onDocumentSelected,
}: DocumentSearchCardProps) => {
  // ** State
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  // ** Redux
  const dispatch = useDispatch<AppDispatch>()
  const {
    selectedDocument,
    documentItems,
    isLoadingDocumentItems,
    documentItemsError,
  } = useSelector((state: RootState) => state.itemReturns)

  // ** Form
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DocumentSearchForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      numeroDocumento: selectedDocument?.numeroDocumento || '',
    },
  })

  // ** Handlers
  const onSubmit = useCallback(
    async (data: DocumentSearchForm) => {
      const { numeroDocumento } = data

      // Clear any previous errors
      dispatch(clearErrors())

      try {
        // Fetch document items automatically
        await dispatch(fetchDocumentItems(numeroDocumento)).unwrap()

        // Add to search history if not already there
        setSearchHistory((prev) => {
          const newHistory = prev.filter((doc) => doc !== numeroDocumento)
          return [numeroDocumento, ...newHistory].slice(0, 5) // Keep last 5
        })

        // Call parent callback
        onDocumentSelected?.(numeroDocumento)
      } catch (error) {
        // Error is handled by Redux state
        console.error('Error fetching document items:', error)
      }
    },
    [dispatch, onDocumentSelected],
  )

  const handleClearDocument = useCallback(() => {
    dispatch(setSelectedDocument(null))
    dispatch(clearErrors())
    reset()
  }, [dispatch, reset])

  const handleSelectFromHistory = useCallback(
    async (numeroDocumento: string) => {
      setValue('numeroDocumento', numeroDocumento)
      dispatch(clearErrors())

      try {
        await dispatch(fetchDocumentItems(numeroDocumento)).unwrap()
        onDocumentSelected?.(numeroDocumento)
      } catch (error) {
        console.error('Error fetching document items:', error)
      }
    },
    [setValue, dispatch, onDocumentSelected],
  )

  return (
    <Card>
      <CardHeader
        title={
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
          >
            Buscar Documento
          </Typography>
        }
        subheader={
          <Typography
            variant="body2"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Ingresa el número de factura o documento para procesar la devolución
          </Typography>
        }
        action={
          selectedDocument && (
            <Button
              variant="outlined"
              onClick={handleClearDocument}
              startIcon={<Icon icon="mdi:close" />}
              size="small"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 2, sm: 3 },
              }}
            >
              Limpiar
            </Button>
          )
        }
      />

      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Document Number Input */}
            <Grid item xs={12}>
              <Controller
                name="numeroDocumento"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Número de Documento *"
                    placeholder="Ej: FAC-2024-001234"
                    error={!!errors.numeroDocumento}
                    helperText={
                      errors.numeroDocumento?.message ||
                      'Ingresa el número de factura o documento'
                    }
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          type="submit"
                          edge="end"
                          disabled={isLoadingDocumentItems}
                        >
                          <Icon
                            icon={
                              isLoadingDocumentItems
                                ? 'mdi:loading'
                                : 'mdi:magnify'
                            }
                          />
                        </IconButton>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Loading State */}
            {isLoadingDocumentItems && (
              <Grid item xs={12}>
                <Alert
                  severity="info"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' },
                        },
                        animation: 'spin 1s linear infinite',
                        display: 'flex',
                      }}
                    >
                      <Icon icon="mdi:loading" />
                    </Box>
                    <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
                      Cargando detalles del documento...
                    </Typography>
                  </Box>
                </Alert>
              </Grid>
            )}

            {/* Selected Document Display */}
            {selectedDocument && !isLoadingDocumentItems && (
              <Grid item xs={12}>
                <Alert
                  severity="success"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon icon="mdi:check-circle" />
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
                        <strong>Documento:</strong>{' '}
                        {selectedDocument.numeroDocumento}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: 'inherit', mt: 0.5 }}
                      >
                        <strong>Cliente:</strong>{' '}
                        {selectedDocument.nombreCliente}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
                        <strong>Tipo:</strong> {selectedDocument.tipoDocumento}{' '}
                        | <strong>Total:</strong> $
                        {selectedDocument.montoTotal.toLocaleString()}
                      </Typography>
                      {documentItems.length > 0 && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: 'inherit', mt: 0.5 }}
                        >
                          {documentItems.length} artículos disponibles para
                          devolución
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Alert>
              </Grid>
            )}

            {/* Error Display */}
            {documentItemsError && (
              <Grid item xs={12}>
                <Alert
                  severity="error"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  {documentItemsError}
                </Alert>
              </Grid>
            )}

            {/* Search History */}
            {searchHistory.length > 0 && (
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  Documentos recientes:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {searchHistory.map((doc, index) => (
                    <Chip
                      key={`${doc}-${index}`}
                      label={doc}
                      variant={
                        doc === selectedDocument?.numeroDocumento
                          ? 'filled'
                          : 'outlined'
                      }
                      color={
                        doc === selectedDocument?.numeroDocumento
                          ? 'primary'
                          : 'default'
                      }
                      size="small"
                      onClick={() => handleSelectFromHistory(doc)}
                      clickable
                      sx={{
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            )}

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', sm: 'flex-end' },
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Icon icon="mdi:magnify" />}
                  size="small"
                  sx={{
                    minWidth: { xs: '100%', sm: 'auto' },
                  }}
                >
                  Buscar Documento
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        {/* Instructions */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.625rem', sm: '0.75rem' },
              display: 'block',
            }}
          >
            <strong>Formatos aceptados:</strong>
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.625rem', sm: '0.75rem' },
            }}
          >
            • Número de factura (FAC-2024-001234)
            <br />
            • Secuencia de documento (001234)
            <br />• Número de pedido (PED-001234)
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default DocumentSearchCard
