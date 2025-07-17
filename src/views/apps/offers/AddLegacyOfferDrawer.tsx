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
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

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
import DatePickerWrapper from '@/@core/styles/libs/react-datepicker'
import DetailModal from './DetailModal'
import { useLegacyOfferDetailModal } from '@/hooks/useLegacyOfferDetailModal'

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

  // Detail modal hook
  const {
    detailModalOpen,
    editingDetailIndex,
    detailInitialData,
    openDetailModal,
    editDetail,
    deleteDetail,
    closeDetailModal,
    submitDetail,
  } = useLegacyOfferDetailModal()

  // Date range state
  const [startDateRange, setStartDateRange] = useState<Date | null>(null)
  const [endDateRange, setEndDateRange] = useState<Date | null>(null)
  const [dates, setDates] = useState('')

  useEffect(() => {
    if (store.legacyOfferEditData) {
      const editData = { ...store.legacyOfferEditData }

      // // Convert datetime to date format for DatePicker
      if (editData.fechaInicio) {
        const startDate = new Date(editData.fechaInicio)
        setStartDateRange(startDate)
        editData.fechaInicio = startDate.toISOString().split('T')[0]
      }
      if (editData.fechaFin) {
        const endDate = new Date(editData.fechaFin)
        setEndDateRange(endDate)
        editData.fechaFin = endDate.toISOString().split('T')[0]
      }

      // Update the dates string for the CustomInput display
      if (editData.fechaInicio && editData.fechaFin) {
        const startDate = new Date(editData.fechaInicio)
        const endDate = new Date(editData.fechaFin)
        setDates(
          `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        )
      } else if (editData.fechaInicio) {
        const startDate = new Date(editData.fechaInicio)
        setDates(startDate.toLocaleDateString())
      }

      reset(editData)
    } else {
      reset(defaultValues)
      setStartDateRange(null)
      setEndDateRange(null)
      setDates('')
    }
  }, [store.legacyOfferEditData])

  // Handle date range change
  const handleOnChangeRange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates
    setStartDateRange(start)
    setEndDateRange(end)

    if (start) {
      setValue('fechaInicio', start.toISOString().split('T')[0])
    } else {
      setValue('fechaInicio', '')
    }

    if (end) {
      setValue('fechaFin', end.toISOString().split('T')[0])
    } else {
      setValue('fechaFin', '')
    }

    // Update the dates string for display
    if (start && end) {
      setDates(`${start.toLocaleDateString()} - ${end.toLocaleDateString()}`)
    } else if (start) {
      setDates(start.toLocaleDateString())
    } else {
      setDates('')
    }
  }

  // Custom Input Component for DatePicker
  const CustomInput = ({
    dates,
    setDates,
    label,
    start,
    end,
    ...props
  }: any) => {
    return (
      <TextField
        {...props}
        fullWidth
        label={label}
        value={dates}
        onChange={(e) => setDates(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
    )
  }

  const { reset, control, handleSubmit, watch, setValue } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  // Watch the current details array
  const currentDetails = watch('detalle')
  const tipoOferta = watch('tipoOferta')

  // Handle tipoOferta changes - limit details for tipo "1" (Promoción)
  useEffect(() => {
    if (tipoOferta === '1' && currentDetails.length > 1) {
      // Keep only the first detail when switching to Promoción type
      const firstDetail = currentDetails[0]
      setValue('detalle', [firstDetail])
      toast.error(
        'Solo se permite un detalle para ofertas de tipo Promoción. Se mantuvo el primer detalle.',
      )
    }
  }, [tipoOferta, currentDetails.length, setValue])

  const handleOpenDetailModal = () => {
    // Check if tipoOferta is "1" (Promoción) and already has a detail
    if (tipoOferta === '1' && currentDetails.length >= 1) {
      toast.error('Solo se permite un detalle para ofertas de tipo Promoción')
      return
    }
    openDetailModal(currentDetails)
  }

  const handleEditDetail = (index: number) => {
    editDetail(index, currentDetails)
  }

  const handleDeleteDetail = (index: number) => {
    deleteDetail(index, currentDetails, setValue)
  }

  const handleCloseDetailModal = () => {
    closeDetailModal()
  }

  const onSubmitDetail = (data: LegacyOfferDetailType) => {
    submitDetail(data, currentDetails, setValue, () =>
      String(watch('idOferta') || ''),
    )
  }
  const onSubmit = async (data: LegacyOfferType) => {
    // Validate details based on tipoOferta
    const principalDetails = data.detalle.filter((detail) => detail.principal)
    const nonPrincipalDetails = data.detalle.filter(
      (detail) => !detail.principal,
    )

    if (data.idOferta === '') {
      data.idOferta = undefined
    }

    if (data.fechaInicio) {
      const startDate = new Date(data.fechaInicio + 'T00:00:00')
      data.fechaInicio = startDate.toISOString()
    }
    if (data.fechaFin) {
      const endDate = new Date(data.fechaFin + 'T00:50:50')
      data.fechaFin = endDate.toISOString()
    }

    // Special validation for tipoOferta "1" (Promoción)
    if (data.tipoOferta === '1') {
      if (data.detalle.length !== 1) {
        toast.error(
          'Las ofertas de tipo Promoción deben tener exactamente un detalle',
        )
        return
      }
    } else {
      // Validation for other types (0 - Escala, 3 - Mixta)
      if (principalDetails.length !== 1) {
        toast.error('Debe tener exactamente un detalle principal')
        return
      }

      if (nonPrincipalDetails.length === 0) {
        toast.error('Debe tener al menos un detalle no principal')
        return
      }
    }

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
      <DatePickerWrapper>
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
                      autoComplete="off"
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
                      autoComplete="off"
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
                      autoComplete="off"
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
                      autoComplete="off"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  isClearable
                  selectsRange
                  monthsShown={2}
                  endDate={endDateRange}
                  selected={startDateRange}
                  startDate={startDateRange}
                  shouldCloseOnSelect={false}
                  id="date-range-picker-months"
                  onChange={handleOnChangeRange}
                  customInput={
                    <CustomInput
                      dates={dates}
                      setDates={setDates}
                      label="Rango de Fechas"
                      end={endDateRange as number | Date}
                      start={startDateRange as number | Date}
                    />
                  }
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
                      autoComplete="off"
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
                    disabled={tipoOferta === '1' && currentDetails.length >= 1}
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
                          <TableCell>
                            {detail.principal ? 'Sí' : 'No'}
                          </TableCell>
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

        <DetailModal
          open={detailModalOpen}
          onClose={handleCloseDetailModal}
          onSubmit={onSubmitDetail}
          editingDetailIndex={editingDetailIndex}
          currentDetails={currentDetails}
          tipoOferta={tipoOferta}
          initialData={detailInitialData}
        />
      </DatePickerWrapper>
    </Dialog>
  )
}

export default AddLegacyOfferDialog
