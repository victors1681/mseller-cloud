// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import { LocationAutocomplete } from 'src/views/ui/locationAutoComplete'
import ProductSearchDialog from 'src/views/ui/productsSearchDialog'

// ** Types
import { AjusteInventarioRequest } from 'src/types/apps/inventoryMovementsTypes'
import { ProductType } from 'src/types/apps/productTypes'

// ** Validation Schema
const schema = yup.object().shape({
  codigoProducto: yup.string().required('El producto es requerido'),
  localidadId: yup.number().required('La localidad es requerida'),
  cantidadAjuste: yup
    .number()
    .required('La cantidad de ajuste es requerida')
    .test('not-zero', 'La cantidad no puede ser cero', (value) => value !== 0),
  razonAjuste: yup.string().required('La razón del ajuste es requerida'),
  numeroDocumento: yup.string(),
  costoUnitario: yup.number().positive('El costo debe ser positivo'),
})

interface CreateAdjustmentCardProps {
  onCreateAdjustment: (data: AjusteInventarioRequest) => Promise<void>
  loading: boolean
}

// ** Common adjustment reasons
const adjustmentReasons = [
  'Productos dañados',
  'Productos vencidos',
  'Error en conteo físico',
  'Merma natural',
  'Robo/Pérdida',
  'Error en sistema',
  'Corrección de inventario',
  'Devolución a proveedor',
  'Otro',
]

const CreateAdjustmentCard = ({
  onCreateAdjustment,
  loading,
}: CreateAdjustmentCardProps) => {
  // ** State
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  )
  const [showCustomReason, setShowCustomReason] = useState(false)

  // ** Form
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AjusteInventarioRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      codigoProducto: '',
      localidadId: 0,
      cantidadAjuste: 0,
      razonAjuste: '',
      numeroDocumento: '',
      costoUnitario: undefined,
    },
  })

  const watchedReason = watch('razonAjuste')

  // ** Effects
  useEffect(() => {
    if (watchedReason === 'Otro') {
      setShowCustomReason(true)
      setValue('razonAjuste', '')
    } else {
      setShowCustomReason(false)
    }
  }, [watchedReason, setValue])

  // ** Handlers
  const handleProductSelect = (product: ProductType) => {
    setSelectedProduct(product)
    setValue('codigoProducto', product.codigo)

    // Set default cost if available
    if (product.costo) {
      setValue('costoUnitario', product.costo)
    }

    setProductDialogOpen(false)
  }

  const handleLocationChange = (locationId: string) => {
    setValue('localidadId', locationId ? parseInt(locationId) : 0)
  }

  const onSubmit = async (data: AjusteInventarioRequest) => {
    try {
      await onCreateAdjustment(data)
      // Reset form on success
      reset()
      setSelectedProduct(null)
      setShowCustomReason(false)
    } catch (error) {
      console.error('Error submitting adjustment:', error)
    }
  }

  const handleReset = () => {
    reset()
    setSelectedProduct(null)
    setShowCustomReason(false)
  }

  return (
    <Card>
      <CardHeader
        title={
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
          >
            Crear Ajuste de Inventario
          </Typography>
        }
        subheader={
          <Typography
            variant="body2"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Realiza correcciones manuales del stock
          </Typography>
        }
        action={
          <Button
            variant="outlined"
            onClick={handleReset}
            startIcon={<Icon icon="mdi:refresh" />}
            disabled={loading}
            size="small"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 2, sm: 3 },
            }}
          >
            Limpiar
          </Button>
        }
      />
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={{ xs: 2, sm: 4 }}>
            {/* Product Selection */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Producto *"
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
                placeholder="Haz clic para seleccionar un producto..."
                error={!!errors.codigoProducto}
                helperText={errors.codigoProducto?.message}
                size="small"
              />
            </Grid>

            {/* Product Info */}
            {selectedProduct && (
              <Grid item xs={12}>
                <Alert
                  severity="info"
                  sx={{
                    mb: 2,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    <strong>Código:</strong> {selectedProduct.codigo} |
                    <strong> Unidad:</strong> {selectedProduct.unidad || 'N/A'}
                  </Typography>
                </Alert>
              </Grid>
            )}

            {/* Location */}
            <Grid item xs={12} md={6}>
              <Controller
                name="localidadId"
                control={control}
                render={({ field }) => (
                  <LocationAutocomplete
                    selectedLocation={field.value?.toString()}
                    callBack={handleLocationChange}
                    size="small"
                  />
                )}
              />
              {errors.localidadId && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 1, display: 'block' }}
                >
                  {errors.localidadId.message}
                </Typography>
              )}
            </Grid>

            {/* Adjustment Quantity */}
            <Grid item xs={12} md={6}>
              <Controller
                name="cantidadAjuste"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Cantidad de Ajuste *"
                    placeholder="Ej: -5 (disminuir) o +10 (aumentar)"
                    error={!!errors.cantidadAjuste}
                    helperText={
                      errors.cantidadAjuste?.message ||
                      'Usa números positivos para aumentar, negativos para disminuir'
                    }
                    inputProps={{
                      step: 0.01,
                    }}
                    size="small"
                  />
                )}
              />
            </Grid>

            {/* Adjustment Reason */}
            <Grid item xs={12}>
              <Controller
                name="razonAjuste"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select={!showCustomReason}
                    multiline={showCustomReason}
                    rows={showCustomReason ? 3 : 1}
                    label="Razón del Ajuste *"
                    error={!!errors.razonAjuste}
                    helperText={errors.razonAjuste?.message}
                    placeholder={
                      showCustomReason
                        ? 'Describe la razón del ajuste...'
                        : undefined
                    }
                    size="small"
                  >
                    {!showCustomReason &&
                      adjustmentReasons.map((reason) => (
                        <MenuItem key={reason} value={reason}>
                          {reason}
                        </MenuItem>
                      ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Optional Fields */}
            <Grid item xs={12} md={6}>
              <Controller
                name="numeroDocumento"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Número de Documento (Opcional)"
                    placeholder="Ej: ADJ-2024-001"
                    helperText="Déjalo vacío para generar automáticamente"
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="costoUnitario"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Costo Unitario (Opcional)"
                    placeholder="0.00"
                    error={!!errors.costoUnitario}
                    helperText={
                      errors.costoUnitario?.message ||
                      'Se usará el costo del producto si no se especifica'
                    }
                    inputProps={{
                      step: 0.01,
                      min: 0,
                    }}
                    size="small"
                  />
                )}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', sm: 'flex-end' },
                  gap: { xs: 1, sm: 2 },
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleReset}
                  disabled={loading}
                  size="small"
                  sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={16} />
                    ) : (
                      <Icon icon="mdi:check" />
                    )
                  }
                  size="small"
                  sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                >
                  {loading ? 'Procesando...' : 'Crear Ajuste'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        {/* Product Search Dialog */}
        <ProductSearchDialog
          open={productDialogOpen}
          onClose={() => setProductDialogOpen(false)}
          onSelectProduct={handleProductSelect}
          title="Seleccionar Producto para Ajuste"
          maxWidth="lg"
        />
      </CardContent>
    </Card>
  )
}

export default CreateAdjustmentCard
