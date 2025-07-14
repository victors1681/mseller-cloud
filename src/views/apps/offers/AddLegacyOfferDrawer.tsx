// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import {
  FormControlLabel,
  Grid,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton as MuiIconButton,
} from '@mui/material'
import toast from 'react-hot-toast'
import { useEffect, useState, forwardRef } from 'react'
import {
  addUpdateLegacyOffer,
  toggleAddUpdateLegacyOffer,
} from '@/store/apps/offers'
import { LegacyOfferType, LegacyOfferDetailType } from '@/types/apps/offerType'
import { ProductAutoComplete } from '@/views/ui/productsAutoComplete'

interface AddLegacyOfferDialogType {
  open: boolean
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const schema = yup.object().shape({
  idOferta: yup.number().min(0, 'ID debe ser mayor o igual a 0'),

  nombre: yup
    .string()
    .max(100, 'El nombre no debe exceder 100 caracteres')
    .required('Nombre es requerido'),

  descripcion: yup
    .string()
    .max(500, 'La descripción no debe exceder 500 caracteres')
    .required('Descripción es requerida'),

  tipoOferta: yup
    .string()
    .oneOf(['0', '1', '3'], 'Debe seleccionar un tipo de oferta válido')
    .required('Tipo de oferta es requerido'),

  condicionPago: yup.string().nullable(),

  fechaInicio: yup.string().required('Fecha de inicio es requerida'),

  fechaFin: yup.string().required('Fecha de fin es requerida'),

  clasificacion: yup
    .string()
    .max(50, 'La clasificación no debe exceder 50 caracteres'),

  status: yup.boolean().required('Status es requerido'),
})

const defaultValues: LegacyOfferType = {
  idOferta: '',
  nombre: '',
  descripcion: '',
  tipoOferta: '0',
  condicionPago: null,
  fechaInicio: '',
  fechaFin: '',
  clasificacion: '',
  status: true,
  detalle: [],
}

const AddLegacyOfferDialog = (props: AddLegacyOfferDialogType) => {
  // ** Props
  const { open } = props

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  const store = useSelector((state: RootState) => state.offers)
  const toggle = () => dispatch(toggleAddUpdateLegacyOffer(null))

  // Modal state for adding details
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [editingDetailIndex, setEditingDetailIndex] = useState<number | null>(
    null,
  )

  useEffect(() => {
    if (store.legacyOfferEditData) {
      reset(store.legacyOfferEditData)
    } else {
      reset(defaultValues)
    }
  }, [store.legacyOfferEditData])

  const { reset, control, handleSubmit, watch, setValue } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  // Default values for detail form
  const defaultDetailValues: LegacyOfferDetailType = {
    id: undefined,
    idOferta: 0,
    codigoProducto: '',
    precio: 0,
    rangoInicial: 0,
    rangoFinal: 0,
    cantidadPromocion: 0,
    principal: false,
  }

  const detailSchema = yup.object().shape({
    codigoProducto: yup.string().required('Código de producto es requerido'),
    precio: yup
      .number()
      .min(0, 'El precio debe ser mayor o igual a 0')
      .required('Precio es requerido'),
    rangoInicial: yup
      .number()
      .min(0, 'El rango inicial debe ser mayor o igual a 0')
      .required('Rango inicial es requerido'),
    rangoFinal: yup
      .number()
      .min(0, 'El rango final debe ser mayor o igual a 0')
      .required('Rango final es requerido'),
    cantidadPromocion: yup
      .number()
      .min(0, 'La cantidad promoción debe ser mayor o igual a 0')
      .required('Cantidad promoción es requerida'),
    principal: yup.boolean(),
  })

  const {
    reset: resetDetail,
    control: controlDetail,
    handleSubmit: handleSubmitDetail,
  } = useForm({
    defaultValues: defaultDetailValues,
    mode: 'onChange',
    resolver: yupResolver(detailSchema),
  })

  // Watch the current details array
  const currentDetails = watch('detalle')

  const handleOpenDetailModal = () => {
    const isFirstDetail = currentDetails.length === 0
    const detailValues = {
      ...defaultDetailValues,
      principal: isFirstDetail, // Set principal to true if it's the first detail
    }
    resetDetail(detailValues)
    setEditingDetailIndex(null)
    setDetailModalOpen(true)
  }

  const handleEditDetail = (index: number) => {
    const detail = currentDetails[index]
    resetDetail(detail)
    setEditingDetailIndex(index)
    setDetailModalOpen(true)
  }

  const handleDeleteDetail = (index: number) => {
    const updatedDetails = currentDetails.filter((_, i) => i !== index)
    setValue('detalle', updatedDetails)
  }

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false)
    setEditingDetailIndex(null)
    resetDetail(defaultDetailValues)
  }

  const onSubmitDetail = (data: LegacyOfferDetailType) => {
    const updatedDetails = [...currentDetails]

    if (editingDetailIndex !== null) {
      // Editing existing detail
      updatedDetails[editingDetailIndex] = {
        ...data,
        id: currentDetails[editingDetailIndex].id,
        idOferta: watch('idOferta'),
      }
    } else {
      // Adding new detail
      const newDetail: LegacyOfferDetailType = {
        ...data,
        idOferta: watch('idOferta'),
        // Set as principal if it's the first item, otherwise use the provided value
        principal: currentDetails.length === 0 ? true : data.principal,
      }
      updatedDetails.push(newDetail)
    }

    setValue('detalle', updatedDetails)
    handleCloseDetailModal()
  }
  const onSubmit = async (data: LegacyOfferType) => {
    try {
      const response = await dispatch(addUpdateLegacyOffer(data)).unwrap()

      if (response.success) {
        toggle()
        reset()
      } else {
        toast.error(response.message || 'Error actualizando la oferta')
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Error inesperado al actualizar la oferta')
    }
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Icon icon="mdi:close" />
          </IconButton>
          <Typography
            sx={{ ml: 2, flex: 1, color: 'white' }}
            variant="h6"
            component="div"
          >
            Agregar Oferta
          </Typography>
          <Button autoFocus color="inherit" type="submit" form="offer-form">
            Grabar
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3, overflow: 'auto' }}>
        <form onSubmit={handleSubmit(onSubmit)} id="offer-form">
          <Grid container spacing={3} maxWidth="lg" sx={{ mx: 'auto' }}>
            <Grid item xs={12} sm={10}>
              <Controller
                name="nombre"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nombre"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Controller
                name="idOferta"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="ID Oferta"
                    disabled={true}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="descripcion"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Descripción"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="tipoOferta"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error}>
                    <InputLabel id="tipo-oferta-label">
                      Tipo de Oferta
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="tipo-oferta-label"
                      label="Tipo de Oferta"
                    >
                      <MenuItem value="0">0 - Escala</MenuItem>
                      <MenuItem value="1">1 - Promoción</MenuItem>
                      <MenuItem value="3">3 - Mixta</MenuItem>
                    </Select>
                    {error && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ ml: 2, mt: 0.5 }}
                      >
                        {error.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="condicionPago"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Condición de Pago"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="fechaInicio"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Fecha de Inicio"
                    InputLabelProps={{ shrink: true }}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="fechaFin"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Fecha de Fin"
                    InputLabelProps={{ shrink: true }}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="clasificacion"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Clasificación"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="status"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={(e) => {
                          onChange(e.target.checked)
                        }}
                      />
                    }
                    label="Status (Activo/Inactivo)"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Detalles de la Oferta</Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleOpenDetailModal}
                  startIcon={<Icon icon="mdi:plus" />}
                >
                  Agregar Detalle
                </Button>
              </Box>

              {currentDetails.length > 0 ? (
                <Table
                  size="small"
                  sx={{ border: '1px solid', borderColor: 'divider' }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Código Producto</TableCell>
                      <TableCell>Precio</TableCell>
                      <TableCell>Rango Inicial</TableCell>
                      <TableCell>Rango Final</TableCell>
                      <TableCell>Cantidad Promoción</TableCell>
                      <TableCell>Principal</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentDetails.map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell>{detail.codigoProducto}</TableCell>
                        <TableCell>{detail.precio}</TableCell>
                        <TableCell>{detail.rangoInicial}</TableCell>
                        <TableCell>{detail.rangoFinal}</TableCell>
                        <TableCell>{detail.cantidadPromocion}</TableCell>
                        <TableCell>{detail.principal ? 'Sí' : 'No'}</TableCell>
                        <TableCell>
                          <MuiIconButton
                            size="small"
                            onClick={() => handleEditDetail(index)}
                            sx={{ mr: 1 }}
                          >
                            <Icon icon="mdi:pencil" fontSize={16} />
                          </MuiIconButton>
                          <MuiIconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteDetail(index)}
                          >
                            <Icon icon="mdi:delete" fontSize={16} />
                          </MuiIconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'center', py: 2 }}
                >
                  No hay detalles agregados
                </Typography>
              )}
            </Grid>
          </Grid>
        </form>
      </Box>

      {/* Detail Modal */}
      <Dialog
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingDetailIndex !== null ? 'Editar Detalle' : 'Agregar Detalle'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitDetail(onSubmitDetail)} id="detail-form">
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <ProductAutoComplete
                  name="codigoProducto"
                  control={controlDetail}
                  label="Seleccionar Producto"
                  placeholder="Seleccionar un producto..."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="precio"
                  control={controlDetail}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Precio"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="rangoInicial"
                  control={controlDetail}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Rango Inicial"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="rangoFinal"
                  control={controlDetail}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Rango Final"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="cantidadPromocion"
                  control={controlDetail}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Cantidad Promoción"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="principal"
                  control={controlDetail}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={value}
                          onChange={(e) => onChange(e.target.checked)}
                        />
                      }
                      label="Principal"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailModal} color="secondary">
            Cancelar
          </Button>
          <Button type="submit" form="detail-form" variant="contained">
            {editingDetailIndex !== null ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  )
}

export default AddLegacyOfferDialog
