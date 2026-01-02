// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** API Imports
import restClient from 'src/configs/restClient'

// ** Types
import { ClienteContacto } from 'src/types/apps/customerType'

interface CreateContactModalProps {
  open: boolean
  onClose: () => void
  clientCode: string
  clientName: string
  onContactCreated: (contact: ClienteContacto) => void
}

const CreateContactModal = ({
  open,
  onClose,
  clientCode,
  clientName,
  onContactCreated,
}: CreateContactModalProps) => {
  // ** Hooks
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  // ** State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombreContacto: '',
    phoneNumber: '',
    phoneNumberWhatsApp: '',
    email: '',
    cargo: '',
    esContactoPrincipal: false,
    notasInternas: '',
  })

  const handleChange = (field: string) => (e: any) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, esContactoPrincipal: e.target.checked })
  }

  const handleSubmit = async () => {
    if (!formData.nombreContacto.trim()) {
      setError('El nombre del contacto es requerido')
      return
    }

    if (!formData.phoneNumber && !formData.phoneNumberWhatsApp) {
      setError('Debe proporcionar al menos un número de teléfono')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await restClient.post('/api/portal/Contact/simple', {
        clienteCodigo: clientCode,
        nombreContacto: formData.nombreContacto,
        phoneNumber: formData.phoneNumber || null,
        phoneNumberWhatsApp: formData.phoneNumberWhatsApp || null,
        email: formData.email || null,
        cargo: formData.cargo || null,
        esContactoPrincipal: formData.esContactoPrincipal,
        notasInternas: formData.notasInternas || null,
      })

      // Call the callback with the created contact
      onContactCreated(response.data)

      // Reset form
      setFormData({
        nombreContacto: '',
        phoneNumber: '',
        phoneNumberWhatsApp: '',
        email: '',
        cargo: '',
        esContactoPrincipal: false,
        notasInternas: '',
      })

      onClose()
    } catch (err: any) {
      console.error('Error creating contact:', err)
      setError(err.response?.data?.message || 'Error al crear el contacto')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setError(null)
      setFormData({
        nombreContacto: '',
        phoneNumber: '',
        phoneNumberWhatsApp: '',
        email: '',
        cargo: '',
        esContactoPrincipal: false,
        notasInternas: '',
      })
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Icon icon="tabler:user-plus" fontSize={24} />
          <Box>
            <Typography variant="h6">Crear Contacto Rápido</Typography>
            <Typography variant="body2" color="text.secondary">
              Cliente: {clientName}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Nombre del Contacto"
              value={formData.nombreContacto}
              onChange={handleChange('nombreContacto')}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teléfono"
              placeholder="809-555-1234"
              value={formData.phoneNumber}
              onChange={handleChange('phoneNumber')}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <Icon
                    icon="tabler:phone"
                    fontSize={20}
                    style={{ marginRight: 8 }}
                  />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="WhatsApp"
              placeholder="809-555-1234"
              value={formData.phoneNumberWhatsApp}
              onChange={handleChange('phoneNumberWhatsApp')}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <Icon
                    icon="mdi:whatsapp"
                    fontSize={20}
                    style={{ marginRight: 8, color: '#25D366' }}
                  />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              placeholder="contacto@ejemplo.com"
              value={formData.email}
              onChange={handleChange('email')}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cargo"
              placeholder="Gerente, Asistente, etc."
              value={formData.cargo}
              onChange={handleChange('cargo')}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Notas Internas"
              placeholder="Notas adicionales sobre el contacto..."
              value={formData.notasInternas}
              onChange={handleChange('notasInternas')}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.esContactoPrincipal}
                  onChange={handleCheckboxChange}
                  disabled={loading}
                />
              }
              label="Marcar como contacto principal"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.nombreContacto.trim()}
          startIcon={
            loading ? (
              <CircularProgress size={20} />
            ) : (
              <Icon icon="tabler:check" />
            )
          }
        >
          {loading ? 'Creando...' : 'Crear Contacto'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateContactModal
