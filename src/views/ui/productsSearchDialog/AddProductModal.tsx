import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { useCodeGenerator } from 'src/hooks/useCodeGenerator'
import { AppDispatch, RootState } from 'src/store'
import { fetchProductDetail, updateProduct } from 'src/store/apps/products'
import { ProductType } from 'src/types/apps/productTypes'
import CustomAutocomplete from 'src/views/ui/customAutocomplete'
import * as yup from 'yup'

// Simplified validation schema for quick add
const quickAddSchema = yup.object().shape({
  codigo: yup
    .string()
    .required('El código es requerido')
    .max(20, 'El código no debe exceder 20 caracteres'),
  nombre: yup
    .string()
    .required('El nombre es requerido')
    .max(100, 'El nombre no debe exceder 100 caracteres'),
  esServicio: yup.boolean(),
  precio1: yup
    .number()
    .required('El precio es requerido')
    .min(0, 'El precio debe ser mayor o igual a 0'),
  unidad: yup.string().when('esServicio', {
    is: false,
    then: (schema) => schema.required('La unidad es requerida'),
    otherwise: (schema) => schema.optional(),
  }),
  impuesto: yup
    .number()
    .required('El impuesto es requerido')
    .min(0, 'El impuesto debe ser mayor o igual a 0')
    .max(100, 'El impuesto no puede ser mayor a 100'),
  tipoImpuesto: yup.string().required('El tipo de impuesto es requerido'),
  visibleTienda: yup.boolean(),
})

interface AddProductModalProps {
  open: boolean
  onClose: () => void
  onProductCreated: (product: ProductType) => void
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onClose,
  onProductCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { generateProduct } = useCodeGenerator()

  // ** Redux store selectors
  const store = useSelector((state: RootState) => state.products)

  // ** Fetch product detail data on component mount to get options
  useEffect(() => {
    if (open) {
      dispatch(fetchProductDetail('new'))
    }
  }, [dispatch, open])

  // ** Unit options
  const unitOptions = useMemo(() => {
    const defaultUnits = [
      { label: 'UN - Unidad', value: 'UN' },
      { label: 'KG - Kilogramo', value: 'KG' },
      { label: 'LB - Libra', value: 'LB' },
      { label: 'MT - Metro', value: 'MT' },
      { label: 'LT - Litro', value: 'LT' },
      { label: 'GAL - Galón', value: 'GAL' },
      { label: 'PZA - Pieza', value: 'PZA' },
    ]
    return defaultUnits
  }, [])

  // ** Tax type options
  const taxTypeOptions = useMemo(() => {
    const defaultTaxTypes = store.taxes?.map((tax) => ({
      label: tax,
      value: tax,
    })) || [
      { label: 'ITBIS', value: 'ITBIS' },
      { label: 'Exento', value: 'Exento' },
      { label: 'ISC', value: 'ISC' },
    ]
    return defaultTaxTypes
  }, [store.taxes])

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductType>({
    defaultValues: {
      codigo: '',
      nombre: '',
      descripcion: '',
      esServicio: false,
      precio1: 0,
      precio2: 0,
      precio3: 0,
      precio4: 0,
      precio5: 0,
      costo: 0,
      unidad: 'UN',
      empaque: 'UN',
      impuesto: 18,
      factor: 1,
      tipoImpuesto: 'ITBIS',
      visibleTienda: true,
      status: 'A',
      promocion: false,
      imagenes: [],
      // Initialize other required fields with defaults
      codigoBarra: '',
      area: '',
      iDArea: 0,
      grupoId: '',
      departamento: '',
      ultCompra: '',
      existenciaAlmacen1: 0,
      existenciaAlmacen2: 0,
      existenciaAlmacen3: 0,
      existenciaAlmacen4: 0,
      existenciaAlmacen5: 0,
      existenciaAlmacen6: 0,
      existenciaAlmacen7: 0,
      iSC: 0,
      aDV: 0,
      descuento: 0,
      apartado: 0,
    },
    resolver: yupResolver(quickAddSchema),
  })

  // Watch precio1 and update other prices automatically
  const precio1Value = watch('precio1')
  const esServicio = watch('esServicio')

  useEffect(() => {
    if (precio1Value !== undefined) {
      setValue('precio2', precio1Value)
      setValue('precio3', precio1Value)
      setValue('precio4', precio1Value)
      setValue('precio5', precio1Value)
    }
  }, [precio1Value, setValue])

  const onSubmit = async (data: ProductType) => {
    setIsSubmitting(true)
    try {
      const response = await dispatch(updateProduct(data)).unwrap()

      if (response.success) {
        onProductCreated(response.data || data)
        reset()
      }
    } catch (error) {
      console.error('Create product error:', error)
      //toast.error('Error inesperado al crear producto')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleGoToFullForm = () => {
    router.push('/apps/products/add/new')
    handleClose()
  }

  const handleGenerateCode = () => {
    const productName = watch('nombre')
    const generatedCode = generateProduct(productName)
    setValue('codigo', generatedCode)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          minHeight: { xs: '100vh', sm: '60vh' },
          maxHeight: { xs: '100vh', sm: '90vh' },
          m: { xs: 0, sm: 2 },
          borderRadius: { xs: 0, sm: 1 },
          maxWidth: { xs: '100vw', sm: '600px' },
        },
      }}
    >
      <DialogTitle>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 5 }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
          >
            Agregar Nuevo Producto
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Icon icon="mdi:close" />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          dividers
          sx={{
            p: { xs: 2, sm: 3 },
            '& .MuiTextField-root': {
              '& .MuiInputBase-input': {
                fontSize: { xs: '1rem', sm: '0.875rem' },
              },
            },
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Información Básica
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Controller
                  name="codigo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Código *"
                      error={!!errors.codigo}
                      helperText={errors.codigo?.message}
                      size="small"
                    />
                  )}
                />
                <IconButton
                  onClick={handleGenerateCode}
                  size="small"
                  color="primary"
                  sx={{
                    mt: 0.5,
                    minWidth: 40,
                    minHeight: 40,
                  }}
                  title="Generar código automáticamente"
                >
                  <Icon icon="mdi:refresh" />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nombre *"
                    error={!!errors.nombre}
                    helperText={errors.nombre?.message}
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="esServicio"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Es Servicio"
                    sx={{ mt: 1 }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="precio1"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Precio *"
                    type="number"
                    error={!!errors.precio1}
                    helperText={errors.precio1?.message}
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                )}
              />
            </Grid>

            {!esServicio && (
              <Grid item xs={12} sm={6}>
                <CustomAutocomplete
                  name="unidad"
                  control={control}
                  options={unitOptions}
                  label="Unidad *"
                  size="small"
                  freeSolo
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <Controller
                name="impuesto"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Impuesto (%) *"
                    type="number"
                    error={!!errors.impuesto}
                    helperText={errors.impuesto?.message}
                    size="small"
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomAutocomplete
                name="tipoImpuesto"
                control={control}
                options={taxTypeOptions}
                label="Tipo de Impuesto *"
                size="small"
                freeSolo
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="visibleTienda"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Visible en Tienda"
                    sx={{ mt: 1 }}
                  />
                )}
              />
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12}>
              <Divider sx={{ mt: 2, mb: 1 }}>Información Adicional</Divider>
            </Grid>

            {!esServicio && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name="costo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Costo"
                      type="number"
                      size="small"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  )}
                />
              </Grid>
            )}

            {!esServicio && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name="existenciaAlmacen1"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Inventario"
                      type="number"
                      size="small"
                      inputProps={{ min: 0, step: 1 }}
                      helperText="Cantidad en stock"
                    />
                  )}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <Controller
                name="descuento"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Descuento (%)"
                    type="number"
                    size="small"
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    helperText="Porcentaje de descuento"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 },
            '& .MuiButton-root': {
              minHeight: { xs: 48, sm: 36 }, // Larger touch targets on mobile
              fontSize: { xs: '0.875rem', sm: '0.875rem' },
            },
          }}
        >
          <Button
            onClick={handleGoToFullForm}
            color="info"
            variant="outlined"
            sx={{
              order: { xs: 1, sm: 1 },
              width: { xs: '100%', sm: 'auto' },
              mb: { xs: 0, sm: 0 },
              mt: { xs: 5, sm: 0 },
            }}
            startIcon={<Icon icon="mdi:form-textbox" />}
          >
            <Box
              component="span"
              sx={{ display: { xs: 'none', sm: 'inline' } }}
            >
              Formulario Completo
            </Box>
            <Box
              component="span"
              sx={{ display: { xs: 'inline', sm: 'none' } }}
            >
              Formulario
            </Box>
          </Button>

          <Box
            sx={{
              flex: { xs: 'none', sm: 1 },
              order: { xs: 4, sm: 2 },
            }}
          />

          <Button
            onClick={handleClose}
            color="secondary"
            sx={{
              order: { xs: 2, sm: 3 },
              width: { xs: '100%', sm: 'auto' },
              mb: { xs: 0, sm: 0 },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{
              order: { xs: 3, sm: 4 },
              width: { xs: '100%', sm: 'auto' },
              mb: { xs: 0, sm: 0 },
            }}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={16} />
              ) : (
                <Icon icon="mdi:content-save" />
              )
            }
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddProductModal
