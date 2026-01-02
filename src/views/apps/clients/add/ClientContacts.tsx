// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListItemText from '@mui/material/ListItemText'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { Controller, useFormContext } from 'react-hook-form'

// ** Type Imports
import { ClienteContacto, CustomerType } from '@/types/apps/customerType'

// ** Utils
import toast from 'react-hot-toast'

// Common contact positions
const COMMON_POSITIONS = [
  'Propietario',
  'Gerente General',
  'Gerente de Compras',
  'Gerente de Ventas',
  'Gerente Administrativo',
  'Contador',
  'Administrador',
  'Supervisor',
  'Encargado',
  'Asistente',
  'Secretaria',
  'Recepcionista',
  'Director',
  'Coordinador',
  'Jefe de Departamento',
]

// Utility to format phone number to E.164
const formatPhoneToE164 = (
  phone: string | null,
  defaultCountryCode: string = '1809',
): string | null => {
  if (!phone) return null

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')

  if (!cleaned) return null

  // If already has country code format (starts with 1 and has proper length)
  if (cleaned.startsWith('1') && cleaned.length >= 11) {
    return `+${cleaned}`
  }

  // If it's a local number (10 digits or less), add default country code
  if (cleaned.length <= 10) {
    return `+${defaultCountryCode}${cleaned}`
  }

  // Otherwise, just add + prefix
  return `+${cleaned}`
}

// Display phone number without + for user input
const displayPhoneNumber = (phone: string | null): string => {
  if (!phone) return ''
  // Remove + prefix if present, keep only digits for editing
  return phone.replace(/^\+/, '').replace(/[^\d]/g, '')
}

const ClientContacts = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // ** Hooks
  const { control, watch, setValue } = useFormContext<CustomerType>()

  // ** States
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [currentContact, setCurrentContact] = useState<
    Omit<ClienteContacto, 'id'>
  >({
    nombreContacto: '',
    phoneNumberWhatsApp: null,
    phoneNumber: null,
    email: null,
    cargo: null,
    esContactoPrincipal: false,
    isActive: true,
    notasInternas: null,
  })

  // Watch contacts array
  const contactos = watch('contactos') || []

  // ** Validation
  const validateContact = (
    contact: Omit<ClienteContacto, 'id'>,
  ): string | null => {
    if (!contact.nombreContacto || contact.nombreContacto.trim() === '') {
      return 'El nombre del contacto es requerido'
    }

    if (!contact.phoneNumberWhatsApp && !contact.phoneNumber) {
      return 'Debe proporcionar al menos un número de teléfono'
    }

    // Validate phone number has at least some digits
    const hasDigits = (phone: string | null) => {
      if (!phone) return false
      return /\d{7,}/.test(phone.replace(/\D/g, ''))
    }

    if (
      contact.phoneNumberWhatsApp &&
      !hasDigits(contact.phoneNumberWhatsApp)
    ) {
      return 'Número de WhatsApp inválido (mínimo 7 dígitos)'
    }

    if (contact.phoneNumber && !hasDigits(contact.phoneNumber)) {
      return 'Número de teléfono inválido (mínimo 7 dígitos)'
    }

    if (
      contact.email &&
      contact.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
    ) {
      return 'Formato de email inválido'
    }

    return null
  }

  // ** Handlers
  const handleOpenDialog = (index?: number) => {
    if (index !== undefined && index >= 0) {
      // Edit mode
      setEditingIndex(index)
      const contact = contactos[index]
      setCurrentContact({
        nombreContacto: contact.nombreContacto,
        phoneNumberWhatsApp: contact.phoneNumberWhatsApp,
        phoneNumber: contact.phoneNumber,
        email: contact.email,
        cargo: contact.cargo || null,
        esContactoPrincipal: contact.esContactoPrincipal,
        isActive: contact.isActive ?? true,
        notasInternas: contact.notasInternas || null,
      })
    } else {
      // Add mode
      setEditingIndex(null)
      setCurrentContact({
        nombreContacto: '',
        phoneNumberWhatsApp: null,
        phoneNumber: null,
        email: null,
        cargo: null,
        esContactoPrincipal: false,
        isActive: true,
        notasInternas: null,
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingIndex(null)
    setCurrentContact({
      nombreContacto: '',
      phoneNumberWhatsApp: null,
      phoneNumber: null,
      email: null,
      cargo: null,
      esContactoPrincipal: false,
      isActive: true,
      notasInternas: null,
    })
  }

  const handleWhatsAppChange = (value: string) => {
    // Store raw value, format only on save
    const cleaned = value.replace(/[^\d]/g, '') // Keep only digits
    setCurrentContact({
      ...currentContact,
      phoneNumberWhatsApp: cleaned || null,
    })
  }

  const handlePhoneNumberChange = (value: string) => {
    // Store raw value, format only on save
    const cleaned = value.replace(/[^\d]/g, '') // Keep only digits
    setCurrentContact({
      ...currentContact,
      phoneNumber: cleaned || null,
    })
  }

  const handleSaveContact = () => {
    // Format phone numbers before validation
    const contactToValidate = {
      ...currentContact,
      phoneNumberWhatsApp: formatPhoneToE164(
        currentContact.phoneNumberWhatsApp,
      ),
      phoneNumber: formatPhoneToE164(currentContact.phoneNumber),
    }

    // Validate
    const validationError = validateContact(contactToValidate)
    if (validationError) {
      toast.error(validationError)
      return
    }

    const newContactos = [...contactos]

    if (editingIndex !== null && editingIndex >= 0) {
      // Update existing contact
      newContactos[editingIndex] = {
        ...newContactos[editingIndex],
        ...contactToValidate,
      }
    } else {
      // Add new contact
      const newContact: ClienteContacto = {
        id: Date.now(), // Temporary ID for UI purposes
        ...contactToValidate,
      }
      newContactos.push(newContact)
    }

    // If this is marked as principal, unmark others
    if (currentContact.esContactoPrincipal) {
      newContactos.forEach((contact, index) => {
        if (editingIndex !== null) {
          if (index !== editingIndex) {
            contact.esContactoPrincipal = false
          }
        } else {
          if (index < newContactos.length - 1) {
            contact.esContactoPrincipal = false
          }
        }
      })
    }

    setValue('contactos', newContactos, {
      shouldDirty: true,
      shouldValidate: true,
    })
    handleCloseDialog()
  }

  const handleDeleteContact = (index: number) => {
    const newContactos = contactos.filter((_, i) => i !== index)
    setValue('contactos', newContactos, {
      shouldDirty: true,
      shouldValidate: true,
    })
    toast.success('Contacto eliminado exitosamente')
  }

  const formatPhoneNumber = (phone: string | null): string => {
    if (!phone) return 'N/A'
    return phone
  }

  return (
    <Card>
      <CardHeader
        title="Contactos del Cliente"
        action={
          <Button
            variant="contained"
            size={isMobile ? 'small' : 'medium'}
            startIcon={<Icon icon="mdi:plus" />}
            onClick={() => handleOpenDialog()}
            sx={{ minHeight: { xs: 40, sm: 'auto' } }}
          >
            {isMobile ? 'Agregar' : 'Agregar Contacto'}
          </Button>
        }
      />
      <CardContent>
        <Controller
          name="contactos"
          control={control}
          render={({ field }) => (
            <>
              {field.value && field.value.length > 0 ? (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {field.value.map((contact, index) => (
                    <Box key={contact.id || index}>
                      <ListItem
                        sx={{
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          py: 2,
                        }}
                      >
                        <ListItemText
                          sx={{
                            width: { xs: '100%', sm: 'auto' },
                            mb: { xs: 1, sm: 0 },
                          }}
                          primary={
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                flexWrap: 'wrap',
                              }}
                            >
                              <Typography variant="subtitle1" fontWeight={600}>
                                {contact.nombreContacto}
                              </Typography>
                              {contact.esContactoPrincipal && (
                                <Chip
                                  label="Principal"
                                  color="primary"
                                  size="small"
                                  sx={{ height: 20 }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              {contact.cargo && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 0.5,
                                  }}
                                >
                                  <Icon
                                    icon="mdi:briefcase-outline"
                                    fontSize={16}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {contact.cargo}
                                  </Typography>
                                </Box>
                              )}
                              {contact.phoneNumberWhatsApp && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 0.5,
                                  }}
                                >
                                  <Icon icon="mdi:whatsapp" fontSize={16} />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {formatPhoneNumber(
                                      contact.phoneNumberWhatsApp,
                                    )}
                                  </Typography>
                                </Box>
                              )}
                              {contact.phoneNumber && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 0.5,
                                  }}
                                >
                                  <Icon icon="mdi:phone" fontSize={16} />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {formatPhoneNumber(contact.phoneNumber)}
                                  </Typography>
                                </Box>
                              )}
                              {contact.email && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                  }}
                                >
                                  <Icon icon="mdi:email" fontSize={16} />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {contact.email}
                                  </Typography>
                                </Box>
                              )}
                              {contact.isActive === false && (
                                <Chip
                                  label="Inactivo"
                                  color="error"
                                  size="small"
                                  sx={{ height: 20, mt: 0.5 }}
                                />
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction
                          sx={{
                            position: { xs: 'relative', sm: 'absolute' },
                            right: { xs: 0, sm: 16 },
                            top: { xs: 'auto', sm: '50%' },
                            transform: { xs: 'none', sm: 'translateY(-50%)' },
                            display: 'flex',
                            gap: 1,
                            mt: { xs: 1, sm: 0 },
                          }}
                        >
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleOpenDialog(index)}
                            size="small"
                          >
                            <Icon icon="mdi:pencil-outline" />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteContact(index)}
                            size="small"
                            color="error"
                          >
                            <Icon icon="mdi:delete-outline" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < field.value.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              ) : (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    color: 'text.secondary',
                  }}
                >
                  <Icon icon="mdi:account-multiple-outline" fontSize={48} />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    No hay contactos agregados. Haz clic en "Agregar Contacto"
                    para comenzar.
                  </Typography>
                </Box>
              )}
            </>
          )}
        />
      </CardContent>

      {/* Add/Edit Contact Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingIndex !== null ? 'Editar Contacto' : 'Agregar Contacto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del Contacto *"
                value={currentContact.nombreContacto}
                onChange={(e) =>
                  setCurrentContact({
                    ...currentContact,
                    nombreContacto: e.target.value,
                  })
                }
                placeholder="Ej: Juan Pérez"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="WhatsApp"
                value={displayPhoneNumber(currentContact.phoneNumberWhatsApp)}
                onChange={(e) => handleWhatsAppChange(e.target.value)}
                onBlur={() => {
                  // Auto-populate SMS when leaving WhatsApp field if SMS is empty
                  if (
                    currentContact.phoneNumberWhatsApp &&
                    !currentContact.phoneNumber
                  ) {
                    setCurrentContact({
                      ...currentContact,
                      phoneNumber: currentContact.phoneNumberWhatsApp,
                    })
                  }
                }}
                placeholder="8091234567 o 18091234567"
                helperText="Se agregará automáticamente el prefijo +. También se usará para SMS al salir del campo."
                InputProps={{
                  startAdornment: (
                    <Icon icon="mdi:whatsapp" style={{ marginRight: 8 }} />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Teléfono SMS"
                value={displayPhoneNumber(currentContact.phoneNumber)}
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                placeholder="8091234567 o 18091234567"
                helperText="Se agregará automáticamente el prefijo +. Se auto-completa con WhatsApp si está disponible."
                InputProps={{
                  startAdornment: (
                    <Icon icon="mdi:phone" style={{ marginRight: 8 }} />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email (Opcional)"
                value={currentContact.email || ''}
                onChange={(e) =>
                  setCurrentContact({
                    ...currentContact,
                    email: e.target.value || null,
                  })
                }
                placeholder="contacto@ejemplo.com"
                helperText="Email para comunicaciones (opcional)"
                InputProps={{
                  startAdornment: (
                    <Icon icon="mdi:email" style={{ marginRight: 8 }} />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={COMMON_POSITIONS}
                value={currentContact.cargo || ''}
                onChange={(event, newValue) =>
                  setCurrentContact({
                    ...currentContact,
                    cargo: newValue || null,
                  })
                }
                onInputChange={(event, newValue) =>
                  setCurrentContact({
                    ...currentContact,
                    cargo: newValue || null,
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Cargo/Posición (Opcional)"
                    placeholder="Seleccione o escriba un cargo"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <Icon
                            icon="mdi:briefcase-outline"
                            style={{ marginRight: 8 }}
                          />
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notas Internas"
                value={currentContact.notasInternas || ''}
                onChange={(e) =>
                  setCurrentContact({
                    ...currentContact,
                    notasInternas: e.target.value || null,
                  })
                }
                placeholder="Información adicional sobre el contacto..."
                helperText="Estas notas son internas y no se comparten con el cliente"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={currentContact.esContactoPrincipal}
                    onChange={(e) =>
                      setCurrentContact({
                        ...currentContact,
                        esContactoPrincipal: e.target.checked,
                      })
                    }
                  />
                }
                label="Marcar como contacto principal"
              />
              {currentContact.esContactoPrincipal && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ ml: 4 }}
                >
                  Este contacto será usado por defecto para comunicaciones
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={currentContact.isActive ?? true}
                    onChange={(e) =>
                      setCurrentContact({
                        ...currentContact,
                        isActive: e.target.checked,
                      })
                    }
                  />
                }
                label="Contacto activo"
              />
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ ml: 4 }}
              >
                Los contactos inactivos no aparecerán en las opciones de
                comunicación
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  <strong>Nota:</strong> Debe proporcionar al menos un número de
                  teléfono (WhatsApp o SMS). El prefijo internacional se
                  agregará automáticamente. Si ingresa WhatsApp, también se
                  usará para SMS.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveContact} variant="contained">
            {editingIndex !== null ? 'Cerrar' : 'Cerrar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default ClientContacts
