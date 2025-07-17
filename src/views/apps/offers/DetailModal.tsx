// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

// ** Types Imports
import { LegacyOfferDetailType } from '@/types/apps/offerType'
import { ProductAutoComplete } from '@/views/ui/productsAutoComplete'

interface DetailModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: LegacyOfferDetailType) => void
  editingDetailIndex: number | null
  currentDetails: LegacyOfferDetailType[]
  tipoOferta: string
  initialData?: LegacyOfferDetailType
}

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

const DetailModal = ({
  open,
  onClose,
  onSubmit,
  editingDetailIndex,
  currentDetails,
  tipoOferta,
  initialData = defaultDetailValues,
}: DetailModalProps) => {
  const detailSchema = yup.object().shape({
    codigoProducto: yup.string().required('Código de producto es requerido'),
    precio: yup
      .number()
      .min(0, 'El precio debe ser mayor o igual a 0')
      .required('Precio es requerido'),
    rangoInicial: yup
      .number()
      .min(0, 'El rango inicial debe ser mayor o igual a 0')
      .test(
        'conditional-required',
        'Rango inicial es requerido',
        function (value) {
          const { principal } = this.parent
          const currentTipoOferta = tipoOferta

          // If tipoOferta is '0' and principal is false, field is not required
          if (currentTipoOferta === '0' && !principal) {
            return true
          }

          // Otherwise, field is required
          return value !== undefined && value !== null && !isNaN(Number(value))
        },
      ),
    rangoFinal: yup
      .number()
      .min(0, 'El rango final debe ser mayor o igual a 0')
      .test(
        'conditional-required',
        'Rango final es requerido',
        function (value) {
          const { principal } = this.parent
          const currentTipoOferta = tipoOferta

          // If tipoOferta is '0' and principal is false, field is not required
          if (currentTipoOferta === '0' && !principal) {
            return true
          }

          // Otherwise, field is required
          return value !== undefined && value !== null && !isNaN(Number(value))
        },
      ),
    cantidadPromocion: yup
      .number()
      .min(0, 'La cantidad promoción debe ser mayor o igual a 0')
      .test(
        'conditional-required',
        'Cantidad promoción es requerida',
        function (value) {
          const { principal } = this.parent
          const currentTipoOferta = tipoOferta

          // If tipoOferta is not "0", field is not required (disabled)
          if (currentTipoOferta !== '0') {
            return true
          }

          // If tipoOferta is "0" and principal is false, field is not required
          if (currentTipoOferta === '0' && !principal) {
            return true
          }

          // Otherwise, field is required
          return value !== undefined && value !== null && !isNaN(Number(value))
        },
      ),
    principal: yup.boolean(),
  })

  const { reset, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: defaultDetailValues,
    mode: 'onChange',
    resolver: yupResolver(detailSchema),
  })

  const detailPrincipal = watch('principal')

  // Effect to clear disabled fields when they become disabled
  useEffect(() => {
    // Clear cantidadPromocion if tipoOferta is not "0"
    if (tipoOferta !== '0') {
      setValue('cantidadPromocion', 0, { shouldValidate: false })
      // Set principal to true by default for non-Escala types since the switch is disabled
      setValue('principal', true, { shouldValidate: false })
    }
    // Clear fields for tipoOferta "0" when principal is false
    else if (tipoOferta === '0' && !detailPrincipal) {
      setValue('rangoInicial', 0, { shouldValidate: false })
      setValue('rangoFinal', 0, { shouldValidate: false })
      setValue('cantidadPromocion', 0, { shouldValidate: false })
    }
  }, [tipoOferta, detailPrincipal, setValue])

  // Reset form when initialData changes or modal opens
  useEffect(() => {
    if (open) {
      reset(initialData)
    }
  }, [open, initialData, reset])

  const handleCloseModal = () => {
    reset(defaultDetailValues)
    onClose()
  }

  const onSubmitDetail = (data: LegacyOfferDetailType) => {
    // Special validation for tipoOferta "1" (Promoción)
    if (tipoOferta === '1') {
      // For Promoción type, we don't need complex validation as only one detail is allowed
      // The validation is already handled in the parent component
      onSubmit(data)
      handleCloseModal()
      return
    }

    // Validate detail requirements for other types (0 - Escala, 3 - Mixta)
    const principalCount = currentDetails.filter(
      (detail) => detail.principal,
    ).length
    const nonPrincipalCount = currentDetails.filter(
      (detail) => !detail.principal,
    ).length

    // When adding a new detail
    if (editingDetailIndex === null) {
      if (!data.principal && principalCount === 0 && nonPrincipalCount === 0) {
        toast.error('El primer detalle debe ser principal')
        return
      }
    } else {
      // When editing existing detail
      const currentDetail = currentDetails[editingDetailIndex]

      if (currentDetail.principal && !data.principal) {
        if (nonPrincipalCount === 0) {
          toast.error(
            'Debe tener al menos un detalle no principal antes de cambiar el principal',
          )
          return
        }
      }
    }

    onSubmit(data)
    handleCloseModal()
  }

  // Check if there's already a principal detail
  const hasPrincipal = currentDetails.some((detail) => detail.principal)
  // If editing, check if the current detail being edited is the principal one
  const isEditingPrincipal =
    editingDetailIndex !== null && currentDetails[editingDetailIndex]?.principal

  // Disable principal switch if:
  // 1. tipoOferta is not "0" (Escala)
  // 2. tipoOferta is "1" (Promoción) since only one detail is allowed
  // 3. For tipoOferta "0", disable if there's already a principal and we're not editing the principal detail
  const isPrincipalDisabled =
    tipoOferta !== '0' ||
    (tipoOferta === '0' && hasPrincipal && !isEditingPrincipal)

  return (
    <Dialog open={open} onClose={handleCloseModal} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingDetailIndex !== null ? 'Editar Detalle' : 'Agregar Detalle'}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmitDetail)} id="detail-form">
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <ProductAutoComplete
                name="codigoProducto"
                control={control}
                label="Seleccionar Producto"
                placeholder="Seleccionar un producto..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="precio"
                control={control}
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
                control={control}
                render={({ field, fieldState: { error } }) => {
                  const isDisabled = tipoOferta === '0' && !detailPrincipal
                  return (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Rango Inicial"
                      disabled={isDisabled}
                      error={!!error}
                      helperText={
                        isDisabled
                          ? 'Campo deshabilitado para tipo Escala sin principal'
                          : error?.message
                      }
                      value={isDisabled ? 0 : field.value}
                      onChange={(e) => {
                        if (!isDisabled) {
                          field.onChange(e)
                        }
                      }}
                    />
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="rangoFinal"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  const isDisabled = tipoOferta === '0' && !detailPrincipal
                  return (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Rango Final"
                      disabled={isDisabled}
                      error={!!error}
                      helperText={
                        isDisabled
                          ? 'Campo deshabilitado para tipo Escala sin principal'
                          : error?.message
                      }
                      value={isDisabled ? 0 : field.value}
                      onChange={(e) => {
                        if (!isDisabled) {
                          field.onChange(e)
                        }
                      }}
                    />
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="cantidadPromocion"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  // Disable if tipoOferta is not "0", or if tipoOferta is "0" and principal is false
                  const isDisabled =
                    tipoOferta !== '0' ||
                    (tipoOferta === '0' && !detailPrincipal)
                  return (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Cantidad Promoción"
                      disabled={isDisabled}
                      error={!!error}
                      helperText={
                        isDisabled
                          ? tipoOferta !== '0'
                            ? 'Campo deshabilitado para ofertas que no son de tipo Escala'
                            : 'Campo deshabilitado para tipo Escala sin principal'
                          : error?.message
                      }
                      value={isDisabled ? 0 : field.value}
                      onChange={(e) => {
                        if (!isDisabled) {
                          field.onChange(e)
                        }
                      }}
                    />
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="principal"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        disabled={isPrincipalDisabled}
                        onChange={(e) => onChange(e.target.checked)}
                      />
                    }
                    label={
                      tipoOferta !== '0'
                        ? 'Principal (Deshabilitado para ofertas que no son de tipo Escala)'
                        : isPrincipalDisabled
                        ? 'Principal (Ya existe uno principal)'
                        : 'Principal'
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="secondary">
          Cancelar
        </Button>
        <Button type="submit" form="detail-form" variant="contained">
          {editingDetailIndex !== null ? 'Actualizar' : 'Agregar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DetailModal
