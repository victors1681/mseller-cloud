// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Form Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Store Imports
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { planificarConteo } from 'src/store/apps/inventory'

// ** Types
import {
  LocalidadDTO,
  PlanificarConteoRequest,
  TipoConteo,
} from 'src/types/apps/inventoryTypes'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Toast
import toast from 'react-hot-toast'

interface PlanCountDialogProps {
  open: boolean
  onClose: () => void
  localidad: LocalidadDTO | null
}

const schema = yup.object({
  descripcion: yup.string(),
  tipoConteo: yup.string().required('El tipo de conteo es requerido'),
  fechaInicio: yup.string().required('La fecha de inicio es requerida'),
  observaciones: yup.string(),
  crearSnapshot: yup.boolean(),
})

const PlanCountDialog = ({
  open,
  onClose,
  localidad,
}: PlanCountDialogProps) => {
  // ** State
  const [loading, setLoading] = useState(false)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const auth = useAuth()

  // ** Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<PlanificarConteoRequest, 'localidadId' | 'planificadoPor'>>({
    resolver: yupResolver(schema),
    defaultValues: {
      descripcion: '',
      fechaInicio: new Date().toISOString().split('T')[0],
      observaciones: '',
      tipoConteo: undefined,
      crearSnapshot: true,
    },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (
    data: Omit<PlanificarConteoRequest, 'localidadId' | 'planificadoPor'>,
  ) => {
    if (!localidad || !auth.user) {
      toast.error('Faltan datos requeridos')
      return
    }

    setLoading(true)
    try {
      const request: PlanificarConteoRequest = {
        ...data,
        localidadId: localidad.id,
        planificadoPor: auth.user.email || 'unknown-user',
      }

      await dispatch(planificarConteo(request)).unwrap()
      toast.success('Conteo planificado exitosamente')
      handleClose()
    } catch (error: any) {
      toast.error(error.message || 'Error al planificar conteo')
    } finally {
      setLoading(false)
    }
  }

  if (!localidad) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>
            Debe seleccionar una localidad antes de planificar un conteo.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Planificar Nuevo Conteo - {localidad.nombre}</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name="descripcion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Descripción del Conteo"
                    placeholder="Ej: Conteo mensual de inventario"
                    error={Boolean(errors.descripcion)}
                    helperText={errors.descripcion?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="tipoConteo"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.tipoConteo)}>
                    <InputLabel>Tipo de Conteo</InputLabel>
                    <Select {...field} label="Tipo de Conteo">
                      <MenuItem value={TipoConteo.Completo}>Completo</MenuItem>
                      <MenuItem value={TipoConteo.Parcial}>Parcial</MenuItem>
                      <MenuItem value={TipoConteo.Ciclico}>Cíclico</MenuItem>
                    </Select>
                    {errors.tipoConteo && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 1, ml: 2 }}
                      >
                        {errors.tipoConteo?.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="fechaInicio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Fecha de Inicio"
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.fechaInicio)}
                    helperText={errors.fechaInicio?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="observaciones"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Observaciones (Opcional)"
                    placeholder="Observaciones adicionales sobre el conteo..."
                    error={Boolean(errors.observaciones)}
                    helperText={errors.observaciones?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Planificando...' : 'Planificar Conteo'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default PlanCountDialog
