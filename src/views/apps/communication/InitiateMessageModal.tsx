// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'

// ** Custom Component Imports
import CreateContactModal from './CreateContactModal'

// ** Type Imports
import {
  ChannelType,
  getChannelIcon,
  getChannelName,
} from 'src/types/apps/communicationTypes'
import { ClienteContacto } from 'src/types/apps/customerType'

// ** API Imports
import restClient from 'src/configs/restClient'

// ** Redux Imports
import { useAppDispatch, useAppSelector } from 'src/store'
import { sendMessage } from 'src/store/apps/communication'
import { fetchCommunicationConfig } from 'src/store/apps/communicationConfig'

interface InitiateMessageModalProps {
  open: boolean
  onClose: () => void
  clientCode: string
  clientName: string
}

interface ContactOption {
  id: number
  label: string
  phoneNumber: string | null
  phoneNumberWhatsApp: string | null
  esContactoPrincipal: boolean
}

const InitiateMessageModal = ({
  open,
  onClose,
  clientCode,
  clientName,
}: InitiateMessageModalProps) => {
  // ** Hooks
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const dispatch = useAppDispatch()
  const { config, loading: configLoading } = useAppSelector(
    (state) => state.communicationConfig,
  )

  // ** State
  const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState<ContactOption[]>([])
  const [selectedContactId, setSelectedContactId] = useState<number | null>(
    null,
  )
  const [selectedPhone, setSelectedPhone] = useState<string>('')
  const [channelType, setChannelType] = useState<ChannelType>(
    ChannelType.WhatsApp,
  )
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [createContactOpen, setCreateContactOpen] = useState(false)

  // Load contacts when modal opens
  useEffect(() => {
    if (open) {
      loadContacts()
      dispatch(fetchCommunicationConfig())
    } else {
      // Reset state when modal closes
      setSelectedContactId(null)
      setSelectedPhone('')
      setMessage('')
      setError(null)
      setContacts([])
    }
  }, [open, clientCode, dispatch])

  const loadContacts = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch contacts from the customer endpoint
      const contactsResponse = await restClient.get(
        `/api/portal/Contact/customer/${clientCode}`,
      )

      const contactOptions: ContactOption[] = []

      // Process contacts from the response
      if (contactsResponse.data && Array.isArray(contactsResponse.data)) {
        contactsResponse.data.forEach((contact: ClienteContacto) => {
          contactOptions.push({
            id: contact.id,
            label: contact.nombreContacto,
            phoneNumber: contact.phoneNumber,
            phoneNumberWhatsApp: contact.phoneNumberWhatsApp,
            esContactoPrincipal: contact.esContactoPrincipal,
          })
        })
      }

      setContacts(contactOptions)

      // Auto-select principal contact or first contact
      const principalContact = contactOptions.find((c) => c.esContactoPrincipal)
      const firstContact = contactOptions[0]
      const defaultContact = principalContact || firstContact

      if (defaultContact) {
        setSelectedContactId(defaultContact.id)
        // Auto-select WhatsApp if available, otherwise regular phone
        if (defaultContact.phoneNumberWhatsApp) {
          setSelectedPhone(defaultContact.phoneNumberWhatsApp)
          setChannelType(ChannelType.WhatsApp)
        } else if (defaultContact.phoneNumber) {
          setSelectedPhone(defaultContact.phoneNumber)
          setChannelType(ChannelType.SMS)
        }
      }
    } catch (err) {
      console.error('Error loading contacts:', err)
      setError('Error al cargar contactos del cliente')
    } finally {
      setLoading(false)
    }
  }

  const handleContactChange = (contactId: number) => {
    setSelectedContactId(contactId)
    const contact = contacts.find((c) => c.id === contactId)
    if (contact) {
      // Auto-select WhatsApp if available, otherwise regular phone
      if (contact.phoneNumberWhatsApp) {
        setSelectedPhone(contact.phoneNumberWhatsApp)
        setChannelType(ChannelType.WhatsApp)
      } else if (contact.phoneNumber) {
        setSelectedPhone(contact.phoneNumber)
        setChannelType(ChannelType.SMS)
      } else {
        setSelectedPhone('')
      }
    }
  }

  const handlePhoneChange = (phone: string) => {
    setSelectedPhone(phone)
    // Auto-detect channel type based on selected phone
    const contact = contacts.find((c) => c.id === selectedContactId)
    if (contact) {
      if (phone === contact.phoneNumberWhatsApp) {
        setChannelType(ChannelType.WhatsApp)
      } else if (phone === contact.phoneNumber) {
        setChannelType(ChannelType.SMS)
      }
    }
  }

  const handleContactCreated = (newContact: ClienteContacto) => {
    // Add the new contact to the list
    const newOption: ContactOption = {
      id: newContact.id,
      label: newContact.nombreContacto,
      phoneNumber: newContact.phoneNumber,
      phoneNumberWhatsApp: newContact.phoneNumberWhatsApp,
      esContactoPrincipal: newContact.esContactoPrincipal,
    }
    setContacts([...contacts, newOption])

    // Auto-select the new contact
    setSelectedContactId(newContact.id)
    if (newContact.phoneNumberWhatsApp) {
      setSelectedPhone(newContact.phoneNumberWhatsApp)
      setChannelType(ChannelType.WhatsApp)
    } else if (newContact.phoneNumber) {
      setSelectedPhone(newContact.phoneNumber)
      setChannelType(ChannelType.SMS)
    }
  }

  const handleSend = async () => {
    if (!selectedContactId || !selectedPhone || !message.trim()) {
      setError('Por favor seleccione un contacto y escriba un mensaje')
      return
    }

    const hasConfiguration =
      config &&
      config.twilioAccountSid &&
      config.twilioAuthToken &&
      (config.twilioWhatsAppNumber || config.twilioSmsNumber)

    if (!hasConfiguration) {
      setError(
        'La configuración de comunicación no está disponible. Configure Twilio en Comunicación → Configuración.',
      )
      return
    }

    setSending(true)
    setError(null)

    try {
      // Send message using the selected contact ID
      await dispatch(
        sendMessage({
          toContactoId: selectedContactId,
          messageContent: message,
          channelType,
        }),
      ).unwrap()

      onClose()
    } catch (err: any) {
      console.error('Error sending message:', err)
      setError(err.message || 'Error al enviar el mensaje')
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Icon icon="tabler:message-circle" fontSize={24} />
          <Typography variant="h6">Iniciar Conversación</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {clientName}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {!config ||
            !config.twilioAccountSid ||
            !config.twilioAuthToken ||
            (!config.twilioWhatsAppNumber && !config.twilioSmsNumber) ? (
              <Alert severity="warning" sx={{ mb: 3 }}>
                La configuración de comunicación no está disponible. Configure
                Twilio en Comunicación → Configuración.
              </Alert>
            ) : null}

            {contacts.length === 0 ? (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Este cliente no tiene contactos registrados. Cree un contacto
                  para poder enviar mensajes.
                </Alert>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Icon icon="tabler:user-plus" />}
                  onClick={() => setCreateContactOpen(true)}
                  size="large"
                >
                  Crear Contacto
                </Button>
              </Box>
            ) : (
              <>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Contacto</InputLabel>
                  <Select
                    value={selectedContactId || ''}
                    onChange={(e) =>
                      handleContactChange(Number(e.target.value))
                    }
                    label="Contacto"
                  >
                    {contacts.map((contact) => (
                      <MenuItem key={contact.id} value={contact.id}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Typography>{contact.label}</Typography>
                          {contact.esContactoPrincipal && (
                            <CustomChip
                              size="small"
                              label="Principal"
                              color="primary"
                              skin="light"
                            />
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedContactId &&
                  (() => {
                    const contact = contacts.find(
                      (c) => c.id === selectedContactId,
                    )
                    const availablePhones = []
                    if (contact?.phoneNumber)
                      availablePhones.push(contact.phoneNumber)
                    if (contact?.phoneNumberWhatsApp)
                      availablePhones.push(contact.phoneNumberWhatsApp)

                    return availablePhones.length > 0 ? (
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Número de Teléfono</InputLabel>
                        <Select
                          value={selectedPhone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          label="Número de Teléfono"
                        >
                          {contact?.phoneNumber && (
                            <MenuItem value={contact.phoneNumber}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <Icon icon="tabler:phone" fontSize={18} />
                                <Typography>{contact.phoneNumber}</Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  (SMS)
                                </Typography>
                              </Box>
                            </MenuItem>
                          )}
                          {contact?.phoneNumberWhatsApp && (
                            <MenuItem value={contact.phoneNumberWhatsApp}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <Icon
                                  icon="mdi:whatsapp"
                                  fontSize={18}
                                  color="#25D366"
                                />
                                <Typography>
                                  {contact.phoneNumberWhatsApp}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  (WhatsApp)
                                </Typography>
                              </Box>
                            </MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    ) : (
                      <Alert severity="warning" sx={{ mb: 3 }}>
                        Este contacto no tiene números de teléfono registrados.
                      </Alert>
                    )
                  })()}

                <Box
                  sx={{
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <FormLabel>Canal de Comunicación</FormLabel>
                  <Button
                    size="small"
                    variant="text"
                    startIcon={<Icon icon="tabler:user-plus" />}
                    onClick={() => setCreateContactOpen(true)}
                  >
                    Crear Nuevo Contacto
                  </Button>
                </Box>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <RadioGroup
                    row
                    value={channelType}
                    onChange={(e) =>
                      setChannelType(Number(e.target.value) as ChannelType)
                    }
                  >
                    <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                      <Box
                        sx={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid',
                          borderColor:
                            channelType === ChannelType.WhatsApp
                              ? 'primary.main'
                              : 'divider',
                          borderRadius: 1,
                          p: 1.5,
                          cursor: 'pointer',
                          bgcolor:
                            channelType === ChannelType.WhatsApp
                              ? 'action.selected'
                              : 'transparent',
                        }}
                        onClick={() => setChannelType(ChannelType.WhatsApp)}
                      >
                        <Radio value={ChannelType.WhatsApp} />
                        <Icon
                          icon={getChannelIcon(ChannelType.WhatsApp)}
                          fontSize={20}
                        />
                        <Typography sx={{ ml: 1 }}>
                          {getChannelName(ChannelType.WhatsApp)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid',
                          borderColor:
                            channelType === ChannelType.SMS
                              ? 'primary.main'
                              : 'divider',
                          borderRadius: 1,
                          p: 1.5,
                          cursor: 'pointer',
                          bgcolor:
                            channelType === ChannelType.SMS
                              ? 'action.selected'
                              : 'transparent',
                        }}
                        onClick={() => setChannelType(ChannelType.SMS)}
                      >
                        <Radio value={ChannelType.SMS} />
                        <Icon
                          icon={getChannelIcon(ChannelType.SMS)}
                          fontSize={20}
                        />
                        <Typography sx={{ ml: 1 }}>
                          {getChannelName(ChannelType.SMS)}
                        </Typography>
                      </Box>
                    </Box>
                  </RadioGroup>
                </FormControl>

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Mensaje"
                  placeholder="Escriba su mensaje aquí..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={
                    !config ||
                    !config.twilioAccountSid ||
                    !config.twilioAuthToken ||
                    (!config.twilioWhatsAppNumber && !config.twilioSmsNumber)
                  }
                />
              </>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" disabled={sending}>
          Cancelar
        </Button>
        <Button
          onClick={handleSend}
          variant="contained"
          disabled={
            !selectedContactId ||
            !selectedPhone ||
            !message.trim() ||
            sending ||
            !config ||
            !config.twilioAccountSid ||
            !config.twilioAuthToken ||
            (!config.twilioWhatsAppNumber && !config.twilioSmsNumber) ||
            loading ||
            contacts.length === 0
          }
          startIcon={
            sending ? (
              <CircularProgress size={20} />
            ) : (
              <Icon icon="tabler:send" />
            )
          }
        >
          {sending ? 'Enviando...' : 'Enviar'}
        </Button>
      </DialogActions>

      {/* Create Contact Modal */}
      <CreateContactModal
        open={createContactOpen}
        onClose={() => setCreateContactOpen(false)}
        clientCode={clientCode}
        clientName={clientName}
        onContactCreated={handleContactCreated}
      />
    </Dialog>
  )
}

export default InitiateMessageModal
