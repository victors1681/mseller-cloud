// ** React Imports
import { useEffect, useState } from 'react'

// ** Next.js Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  IconButton,
  Typography,
  Paper,
} from '@mui/material'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from 'src/store'

// ** Types & Actions
import { AbrirTurnoRequest } from 'src/types/apps/posType'
import { abrirTurno, toggleAbrirTurnoModal } from 'src/store/apps/pos'

// ** Utils
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import moment from 'moment'
import 'moment/locale/es' // Spanish locale for moment

// ** Component Props Interface
interface AbrirTurnoModalProps {
  allowToClose?: boolean
}

// ** Device Detection Utility
const generateDeviceId = () => {
  try {
    // Get browser info
    const userAgent = navigator.userAgent
    const platform = navigator.platform || 'Unknown'

    // Detect device type
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent)
    const isTablet = /iPad|Android.*Tablet/i.test(userAgent)
    const deviceType = isMobile ? (isTablet ? 'TABLET' : 'MOBILE') : 'DESKTOP'

    // Get browser name
    let browserName = 'Unknown'
    if (userAgent.includes('Chrome')) browserName = 'Chrome'
    else if (userAgent.includes('Firefox')) browserName = 'Firefox'
    else if (userAgent.includes('Safari')) browserName = 'Safari'
    else if (userAgent.includes('Edge')) browserName = 'Edge'

    // Create readable device ID
    const timestamp = Date.now().toString().slice(-6) // Last 6 digits of timestamp
    return `POS-${deviceType}-${browserName}-${timestamp}`
  } catch (error) {
    console.warn('Error generating device ID:', error)
    return `POS-${Date.now().toString().slice(-6)}`
  }
}

const schema = yup.object().shape({
  codigoVendedor: yup
    .string()
    .required('Código de vendedor es requerido')
    .min(2, 'Mínimo 2 caracteres'),
  idDispositivo: yup
    .string()
    .required('ID de dispositivo es requerido')
    .min(2, 'Mínimo 2 caracteres'),
  efectivoApertura: yup
    .number()
    .min(0, 'El efectivo de apertura debe ser mayor o igual a 0')
    .required('Efectivo de apertura es requerido'),
  notas: yup.string().max(500, 'Las notas no deben exceder 500 caracteres'),
})

const defaultValues: AbrirTurnoRequest = {
  codigoVendedor: 'V001', // Will be overridden by user's seller code
  idDispositivo: generateDeviceId(), // Auto-generated device ID
  efectivoApertura: 0,
  notas: '',
}

const AbrirTurnoModal = ({ allowToClose = false }: AbrirTurnoModalProps) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const posStore = useSelector((state: RootState) => state.pos)
  const { user } = useAuth()
  const router = useRouter()

  // ** Clock State
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  // ** Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // ** Reset form when modal opens
  useEffect(() => {
    if (posStore.isAbrirTurnoModalOpen) {
      // Use user's seller code if available and generate fresh device ID
      const formData = {
        ...defaultValues,
        codigoVendedor: user?.sellerCode || defaultValues.codigoVendedor,
        idDispositivo: generateDeviceId(), // Generate fresh device ID each time
      }
      reset(formData)
    }
  }, [posStore.isAbrirTurnoModalOpen, reset, user?.sellerCode])

  // ** Handlers
  const onSubmit = async (data: AbrirTurnoRequest) => {
    try {
      const response = await dispatch(abrirTurno(data)).unwrap()

      if (response.success) {
        handleClose()
        reset()
      } else {
        toast.error(response.message || 'Error abriendo turno')
      }
    } catch (error) {
      console.error('Error in modal:', error)
      toast.error('Error inesperado al abrir turno')
    }
  }

  const handleClose = () => {
    // Allow closing if there's an active turno OR if the allowToClose prop is set
    if (posStore.turnoActual || allowToClose) {
      dispatch(toggleAbrirTurnoModal(null))
      reset()
    }
  }

  const handleGoToRoot = () => {
    router.push('/')
  }

  return (
    <Dialog
      open={posStore.isAbrirTurnoModalOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={!posStore.turnoActual && !allowToClose} // Allow Esc if turno exists or allowToClose is true
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {posStore.turnoActual
            ? 'Abrir Nuevo Turno'
            : 'Abrir Turno - Requerido'}
          {(posStore.turnoActual || allowToClose) && (
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{ color: 'text.primary' }}
            >
              <Icon icon="mdi:close" fontSize={20} />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {/* Current DateTime Display */}
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              mx: 2,
              mb: 3,
              textAlign: 'center',
              backgroundColor: 'grey.200',
              color: 'text.primary',
              border: '0px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" component="div">
              {moment(currentDateTime)
                .locale('es')
                .format('dddd, D [de] MMMM [de] YYYY')}
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 'bold', mt: 0.5 }}
            >
              {moment(currentDateTime).format('h:mm:ss A')}
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.7, fontSize: '0.7rem' }}
            >
              Hora de apertura del turno
            </Typography>
          </Paper>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="codigoVendedor"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Código de Vendedor"
                    placeholder="V001"
                    error={!!error}
                    helperText={
                      error?.message ||
                      `Este código está asociado con la cuenta de esta sesión: ${
                        user?.firstName || ''
                      } ${user?.lastName || ''}`.trim()
                    }
                    disabled={!!user?.sellerCode}
                    value={user?.sellerCode || field.value}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="idDispositivo"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="ID de Dispositivo"
                    placeholder="POS-DESKTOP-Chrome-123456"
                    error={!!error}
                    helperText={
                      error?.message ||
                      'ID generado automáticamente basado en su dispositivo y navegador'
                    }
                    disabled={true}
                    InputProps={{
                      startAdornment: (
                        <Icon
                          icon="mdi:devices"
                          style={{ marginRight: 8, color: 'text.secondary' }}
                        />
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="efectivoApertura"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Efectivo de Apertura"
                    placeholder="0"
                    error={!!error}
                    helperText={error?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    InputProps={{
                      startAdornment: '$',
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="notas"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Notas (Opcional)"
                    placeholder="Observaciones sobre la apertura del turno..."
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleGoToRoot}
            disabled={isSubmitting}
            startIcon={<Icon icon="mdi:home" />}
          >
            Ir a Inicio
          </Button>
          {(posStore.turnoActual || allowToClose) && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <Icon icon="mdi:loading" className="animate-spin" />
              ) : (
                <Icon icon="mdi:play-circle" />
              )
            }
          >
            {isSubmitting ? 'Abriendo...' : 'Abrir Turno'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AbrirTurnoModal
