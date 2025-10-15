// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  calculateItemReturn,
  clearCalculations,
} from 'src/store/apps/itemReturns'

// ** Custom Components
import ProductSearchDialog from 'src/views/ui/productsSearchDialog'

// ** Utils
import { formatCurrency } from 'src/utils/formatCurrency'

// ** Types
import {
  CalcularDevolucionRequest,
  DevolucionDetalle,
  motivosDevolucion,
} from 'src/types/apps/itemReturnsTypes'
import { ProductType } from 'src/types/apps/productTypes'

interface ReturnCalculationForm {
  productos: DevolucionDetalle[]
}

interface ReturnCalculationCardProps {
  disabled?: boolean
}

// ** Validation Schema
const schema = yup.object().shape({
  productos: yup
    .array()
    .of(
      yup.object().shape({
        codigoProducto: yup.string().required('El producto es requerido'),
        cantidad: yup
          .number()
          .positive('La cantidad debe ser mayor a 0')
          .required('La cantidad es requerida'),
        motivoDevolucion: yup.string(),
      }),
    )
    .min(1, 'Debe agregar al menos un producto'),
})

const ReturnCalculationCard = ({
  disabled = false,
}: ReturnCalculationCardProps) => {
  // ** State
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [selectedProductIndex, setSelectedProductIndex] = useState<
    number | null
  >(null)
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  // ** Redux
  const dispatch = useDispatch<AppDispatch>()
  const {
    selectedDocument,
    documentItems,
    calculations,
    isCalculating,
    calculationError,
  } = useSelector((state: RootState) => state.itemReturns)

  // ** Form
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReturnCalculationForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      productos: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productos',
  })

  const watchedProducts = watch('productos')

  // ** Effects
  useEffect(() => {
    // Clear calculation when document changes
    if (!selectedDocument) {
      reset({ productos: [] })
      dispatch(clearCalculations())
    }
  }, [selectedDocument, reset, dispatch])

  // ** Auto-populate with document items when loaded
  useEffect(() => {
    if (documentItems.length > 0 && fields.length === 0) {
      console.log('Auto-populating with document items:', documentItems)
      
      // Create products from document items
      const allProducts = documentItems.map(item => ({
        codigoProducto: item.codigoProducto,
        cantidad: 0, // Start with 0 so user can select what to return
        motivoDevolucion: motivosDevolucion[0] || '', // Default reason
      }))

      console.log('Products to populate:', allProducts)

      // Use the field array replace method to properly update the form
      allProducts.forEach(product => {
        append(product)
      })
    }
  }, [documentItems, fields.length, append])

  // ** Handlers
  const onSubmit = useCallback(
    (data: ReturnCalculationForm) => {
      if (!selectedDocument) return

      const request: CalcularDevolucionRequest = {
        numeroDocumento: selectedDocument?.numeroDocumento || '',
        productos: data.productos,
      }

      dispatch(calculateItemReturn(request))
    },
    [selectedDocument, dispatch],
  )

  const handleAddProduct = useCallback(() => {
    setSelectedProductIndex(null)
    setProductDialogOpen(true)
  }, [])

  const handleProductSelect = useCallback(
    (product: ProductType) => {
      const newProduct: DevolucionDetalle = {
        codigoProducto: product.codigo,
        cantidad: 1,
        motivoDevolucion: motivosDevolucion[0],
      }

      if (selectedProductIndex !== null) {
        // Replace existing product
        setValue(`productos.${selectedProductIndex}`, newProduct)
      } else {
        // Add new product
        append(newProduct)
      }

      setProductDialogOpen(false)
      setSelectedProductIndex(null)
    },
    [append, setValue, selectedProductIndex],
  )

  const handleEditProduct = useCallback((index: number) => {
    setSelectedProductIndex(index)
    setProductDialogOpen(true)
  }, [])

  const handleRemoveProduct = useCallback(
    (index: number) => {
      remove(index)
    },
    [remove],
  )

  const handleToggleExpand = useCallback((index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    )
  }, [])

  const handleClearCalculation = useCallback(() => {
    dispatch(clearCalculations())
    reset({ productos: [] })
  }, [dispatch, reset])

  return (
    <Card>
      <CardHeader
        title={
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
          >
            Cálculo de Devolución
          </Typography>
        }
        subheader={
          <Typography
            variant="body2"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Selecciona los productos y cantidades a devolver
          </Typography>
        }
        action={
          calculations && (
            <Button
              variant="outlined"
              onClick={handleClearCalculation}
              startIcon={<Icon icon="mdi:refresh" />}
              size="small"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 2, sm: 3 },
              }}
            >
              Nuevo Cálculo
            </Button>
          )
        }
      />

      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {!selectedDocument ? (
          <Alert
            severity="info"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Primero selecciona un documento para calcular la devolución
          </Alert>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {/* Products Section */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                    >
                      Productos a Devolver
                    </Typography>
                    {documentItems.length > 0 && (
                      <Chip
                        label={`${documentItems.length} items auto-cargados`}
                        size="small"
                        color="success"
                        variant="outlined"
                        icon={<Icon icon="mdi:check-circle" />}
                      />
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {documentItems.length > 0 && (
                      <>
                        <Button
                          variant="text"
                          onClick={() => {
                            fields.forEach((field, index: number) => {
                              // Find the corresponding document item
                              const docItem = documentItems.find(item => item.codigoProducto === field.codigoProducto)
                              if (docItem) {
                                setValue(`productos.${index}.cantidad`, docItem.cantidadDisponible || 0)
                              }
                            })
                          }}
                          size="small"
                          startIcon={<Icon icon="mdi:check-all" />}
                          disabled={disabled || isCalculating}
                        >
                          Seleccionar Todo
                        </Button>
                        <Button
                          variant="text"
                          onClick={() => {
                            fields.forEach((_, index: number) => {
                              setValue(`productos.${index}.cantidad`, 0)
                            })
                          }}
                          size="small"
                          startIcon={<Icon icon="mdi:close-box-multiple" />}
                          disabled={disabled || isCalculating}
                        >
                          Deseleccionar Todo
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outlined"
                      onClick={handleAddProduct}
                      startIcon={<Icon icon="mdi:plus" />}
                      disabled={disabled || isCalculating}
                      size="small"
                    >
                      Agregar Producto
                    </Button>
                  </Box>
                </Box>

                {fields.length === 0 ? (
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                    }}
                  >
                    <Icon
                      icon="mdi:package-variant"
                      fontSize="2rem"
                      color="text.secondary"
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                    >
                      No hay productos seleccionados
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                    >
                      Haz clic en "Agregar Producto" para comenzar
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Producto</TableCell>
                          <TableCell align="center">Cantidad</TableCell>
                          <TableCell>Motivo</TableCell>
                          <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fields.map((field, index) => (
                          <TableRow key={field.id}>
                            <TableCell>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    fontWeight: 'medium'
                                  }}
                                >
                                  {watchedProducts[index]?.codigoProducto ||
                                    'Sin código'}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    fontSize: { xs: '0.625rem', sm: '0.75rem' },
                                    display: 'block'
                                  }}
                                >
                                  {documentItems.find(item => 
                                    item.codigoProducto === watchedProducts[index]?.codigoProducto
                                  )?.descripcionProducto || 'Descripción no disponible'}
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell align="center">
                              <Controller
                                name={`productos.${index}.cantidad`}
                                control={control}
                                render={({ field: fieldProps }) => (
                                  <TextField
                                    {...fieldProps}
                                    type="number"
                                    size="small"
                                    inputProps={{ min: 0.01, step: 0.01 }}
                                    error={
                                      !!errors.productos?.[index]?.cantidad
                                    }
                                    sx={{ width: 80 }}
                                  />
                                )}
                              />
                            </TableCell>

                            <TableCell>
                              <Controller
                                name={`productos.${index}.motivoDevolucion`}
                                control={control}
                                render={({ field: fieldProps }) => (
                                  <TextField
                                    {...fieldProps}
                                    select
                                    size="small"
                                    sx={{ minWidth: 120 }}
                                  >
                                    {motivosDevolucion.map((motivo) => (
                                      <MenuItem key={motivo} value={motivo}>
                                        {motivo}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                )}
                              />
                            </TableCell>

                            <TableCell align="center">
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditProduct(index)}
                                  disabled={disabled || isCalculating}
                                >
                                  <Icon icon="mdi:pencil" fontSize="1rem" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveProduct(index)}
                                  disabled={disabled || isCalculating}
                                  color="error"
                                >
                                  <Icon icon="mdi:delete" fontSize="1rem" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {errors.productos && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    {errors.productos.message}
                  </Typography>
                )}
              </Grid>

              {/* Action Buttons */}
              {fields.length > 0 && (
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
                      type="submit"
                      variant="contained"
                      startIcon={
                        isCalculating ? (
                          <CircularProgress size={16} />
                        ) : (
                          <Icon icon="mdi:calculator" />
                        )
                      }
                      disabled={
                        disabled || isCalculating || fields.length === 0
                      }
                      size="small"
                      sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                    >
                      {isCalculating ? 'Calculando...' : 'Calcular Devolución'}
                    </Button>
                  </Box>
                </Grid>
              )}

              {/* Calculation Results */}
              {calculations && (
                <Grid item xs={12}>
                  <Alert
                    severity="success"
                    sx={{
                      mb: 2,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}
                    >
                      Resumen de Devolución
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
                      Documento: <strong>{calculations.numeroDocumento}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
                      Monto Total:{' '}
                      <strong>
                        {formatCurrency(calculations.montoDevolucion)}
                      </strong>
                    </Typography>
                  </Alert>

                  {/* Fiscal Summary */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}
                    >
                      Resumen Fiscal:
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary">
                          Base Gravable:
                        </Typography>
                        <Typography variant="body2">
                          {formatCurrency(
                            calculations.resumenFiscal.totalBaseGravable,
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary">
                          Descuentos:
                        </Typography>
                        <Typography variant="body2">
                          {formatCurrency(
                            calculations.resumenFiscal.totalDescuentos,
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary">
                          Impuestos:
                        </Typography>
                        <Typography variant="body2">
                          {formatCurrency(
                            calculations.resumenFiscal.totalImpuestos,
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary">
                          Total:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(
                            calculations.resumenFiscal.montoTotal,
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}

              {/* Error Display */}
              {calculationError && (
                <Grid item xs={12}>
                  <Alert
                    severity="error"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    {calculationError}
                  </Alert>
                </Grid>
              )}
            </Grid>
          </form>
        )}

        {/* Product Search Dialog */}
        <ProductSearchDialog
          open={productDialogOpen}
          onClose={() => setProductDialogOpen(false)}
          onSelectProduct={handleProductSelect}
          title="Seleccionar Producto para Devolución"
          maxWidth="lg"
        />
      </CardContent>
    </Card>
  )
}

export default ReturnCalculationCard
