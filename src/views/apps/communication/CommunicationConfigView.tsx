// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  clearError,
  clearSuccessMessage,
  deleteCommunicationConfig,
  fetchCommunicationConfig,
  saveCommunicationConfig,
} from 'src/store/apps/communicationConfig'

// ** Types
import { CommunicationConfigForm } from 'src/types/apps/communicationTypes'

// Validation Schema
const schema = yup.object({
  twilioAccountSid: yup
    .string()
    .required('Twilio Account SID is required')
    .max(100, 'Maximum 100 characters'),
  twilioAuthToken: yup
    .string()
    .required('Twilio Auth Token is required')
    .max(100, 'Maximum 100 characters'),
  twilioWhatsAppNumber: yup.string().when('whatsAppEnabled', {
    is: true,
    then: (schema) =>
      schema
        .required('WhatsApp number is required when WhatsApp is enabled')
        .matches(
          /^whatsapp:\+[0-9]{10,15}$/,
          'Format must be whatsapp:+[phone number]',
        )
        .max(50, 'Maximum 50 characters'),
    otherwise: (schema) => schema.max(50, 'Maximum 50 characters'),
  }),
  twilioSmsNumber: yup.string().when('smsEnabled', {
    is: true,
    then: (schema) =>
      schema
        .required('SMS number is required when SMS is enabled')
        .matches(
          /^\+[0-9]{10,15}$/,
          'Format must be +[country code][phone number]',
        )
        .max(50, 'Maximum 50 characters'),
    otherwise: (schema) => schema.max(50, 'Maximum 50 characters'),
  }),
  twilioWebhookSecret: yup.string().max(100, 'Maximum 100 characters'),
  whatsAppEnabled: yup.boolean(),
  smsEnabled: yup.boolean(),
  isActive: yup.boolean(),
})

const CommunicationConfigView = () => {
  // ** Hooks
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { config, loading, saving, deleting, error, mode, successMessage } =
    useAppSelector((state) => state.communicationConfig)

  // ** States
  const [showAuthToken, setShowAuthToken] = useState(false)
  const [showWebhookSecret, setShowWebhookSecret] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // ** Form
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<CommunicationConfigForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      twilioAccountSid: '',
      twilioAuthToken: '',
      twilioWhatsAppNumber: 'whatsapp:',
      twilioSmsNumber: '',
      twilioWebhookSecret: '',
      whatsAppEnabled: true,
      smsEnabled: true,
      isActive: true,
    },
  })

  const whatsAppEnabled = watch('whatsAppEnabled')
  const smsEnabled = watch('smsEnabled')

  // ** Load config on mount
  useEffect(() => {
    dispatch(fetchCommunicationConfig())
  }, [dispatch])

  // ** Update form when config loads
  useEffect(() => {
    if (config) {
      reset({
        twilioAccountSid: config.twilioAccountSid,
        twilioAuthToken: '***HIDDEN***',
        twilioWhatsAppNumber: config.twilioWhatsAppNumber,
        twilioSmsNumber: config.twilioSmsNumber,
        twilioWebhookSecret: '***HIDDEN***',
        whatsAppEnabled: config.whatsAppEnabled,
        smsEnabled: config.smsEnabled,
        isActive: config.isActive,
      })
    }
  }, [config, reset])

  // ** Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, dispatch])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  // ** Handlers
  const onSubmit = async (data: CommunicationConfigForm) => {
    // If auth token or webhook secret hasn't changed, don't send masked value
    const submitData = { ...data }
    if (config && data.twilioAuthToken === '***HIDDEN***') {
      delete (submitData as any).twilioAuthToken
    }
    if (config && data.twilioWebhookSecret === '***HIDDEN***') {
      delete (submitData as any).twilioWebhookSecret
    }

    // Validate at least one channel is enabled
    if (!data.whatsAppEnabled && !data.smsEnabled) {
      dispatch({
        type: 'communicationConfig/setError',
        payload: 'At least one channel must be enabled',
      })
      return
    }

    try {
      await dispatch(saveCommunicationConfig(submitData)).unwrap()
      reset(data)
    } catch (error) {
      // Error handled by reducer
    }
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteCommunicationConfig()).unwrap()
      setDeleteDialogOpen(false)
      reset({
        twilioAccountSid: '',
        twilioAuthToken: '',
        twilioWhatsAppNumber: 'whatsapp:',
        twilioSmsNumber: '',
        twilioWebhookSecret: '',
        whatsAppEnabled: true,
        smsEnabled: true,
        isActive: true,
      })
    } catch (error) {
      // Error handled by reducer
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          {(loading || saving || deleting) && <LinearProgress />}
          <CardHeader
            title="Configuración de Comunicación"
            subheader="Configurar Twilio para mensajería WhatsApp y SMS"
          />
          <CardContent>
            {/* Loading State */}
            {loading && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight={300}
              >
                <CircularProgress />
              </Box>
            )}

            {/* Success Message */}
            {successMessage && (
              <Alert
                severity="success"
                sx={{ mb: 3 }}
                onClose={() => dispatch(clearSuccessMessage())}
              >
                {successMessage}
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
                onClose={() => dispatch(clearError())}
              >
                {error}
              </Alert>
            )}

            {/* No Config Message */}
            {!loading && !config && mode === 'create' && (
              <Alert severity="info" sx={{ mb: 3 }}>
                No communication configuration found. Create one to enable
                WhatsApp and SMS messaging.
              </Alert>
            )}

            {/* Form */}
            {!loading && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  {/* Twilio Account SID */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="twilioAccountSid"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Twilio Account SID"
                          placeholder="AC1234567890abcdef"
                          error={!!errors.twilioAccountSid}
                          helperText={
                            errors.twilioAccountSid?.message ||
                            'Your Twilio Account SID from the Twilio Console'
                          }
                          required
                        />
                      )}
                    />
                  </Grid>

                  {/* Twilio Auth Token */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="twilioAuthToken"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type={showAuthToken ? 'text' : 'password'}
                          label="Twilio Auth Token"
                          placeholder="Enter your Twilio Auth Token"
                          error={!!errors.twilioAuthToken}
                          helperText={
                            errors.twilioAuthToken?.message ||
                            (config
                              ? 'Leave unchanged to keep current token'
                              : 'Your Twilio Auth Token from the Twilio Console')
                          }
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  edge="end"
                                  onClick={() =>
                                    setShowAuthToken(!showAuthToken)
                                  }
                                  onMouseDown={(e) => e.preventDefault()}
                                >
                                  <Icon
                                    icon={
                                      showAuthToken
                                        ? 'mdi:eye-outline'
                                        : 'mdi:eye-off-outline'
                                    }
                                  />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* WhatsApp Phone Number */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="twilioWhatsAppNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value
                            // Ensure the prefix always starts with "whatsapp:"
                            if (!value.startsWith('whatsapp:')) {
                              field.onChange('whatsapp:')
                            } else {
                              field.onChange(value)
                            }
                          }}
                          fullWidth
                          label="WhatsApp Phone Number"
                          placeholder="whatsapp:+15551234567"
                          error={!!errors.twilioWhatsAppNumber}
                          helperText={
                            errors.twilioWhatsAppNumber?.message ||
                            'Format: whatsapp:+[country_code][phone_number]'
                          }
                          required={whatsAppEnabled}
                          disabled={!whatsAppEnabled}
                        />
                      )}
                    />
                  </Grid>

                  {/* SMS Phone Number */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="twilioSmsNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="SMS Phone Number"
                          placeholder="+15559876543"
                          error={!!errors.twilioSmsNumber}
                          helperText={
                            errors.twilioSmsNumber?.message ||
                            'Format: +[country_code][phone_number] (E.164)'
                          }
                          required={smsEnabled}
                          disabled={!smsEnabled}
                        />
                      )}
                    />
                  </Grid>

                  {/* Webhook Secret */}
                  <Grid item xs={12}>
                    <Controller
                      name="twilioWebhookSecret"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type={showWebhookSecret ? 'text' : 'password'}
                          label="Webhook Secret (Optional)"
                          placeholder="Enter webhook secret (optional)"
                          error={!!errors.twilioWebhookSecret}
                          helperText={
                            errors.twilioWebhookSecret?.message ||
                            'Optional secret for validating Twilio webhook signatures'
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  edge="end"
                                  onClick={() =>
                                    setShowWebhookSecret(!showWebhookSecret)
                                  }
                                  onMouseDown={(e) => e.preventDefault()}
                                >
                                  <Icon
                                    icon={
                                      showWebhookSecret
                                        ? 'mdi:eye-outline'
                                        : 'mdi:eye-off-outline'
                                    }
                                  />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Toggle Switches */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="whatsAppEnabled"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Switch {...field} checked={field.value} />}
                          label={
                            <Box>
                              <Typography variant="body1">
                                Enable WhatsApp Messaging
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Enable or disable WhatsApp messaging
                              </Typography>
                            </Box>
                          }
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="smsEnabled"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Switch {...field} checked={field.value} />}
                          label={
                            <Box>
                              <Typography variant="body1">
                                Enable SMS Messaging
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Enable or disable SMS messaging
                              </Typography>
                            </Box>
                          }
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Switch {...field} checked={field.value} />}
                          label={
                            <Box>
                              <Typography variant="body1">
                                Configuration Active
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Activate or deactivate this configuration
                              </Typography>
                            </Box>
                          }
                        />
                      )}
                    />
                  </Grid>

                  {/* Last Updated Info */}
                  {config && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        Last Updated:{' '}
                        {new Date(config.fechaModificacion).toLocaleString()}
                      </Typography>
                    </Grid>
                  )}

                  {/* Action Buttons */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={saving || (!isDirty && mode === 'edit')}
                        startIcon={
                          saving ? (
                            <CircularProgress size={20} />
                          ) : (
                            <Icon icon="mdi:content-save" />
                          )
                        }
                        sx={{
                          minHeight: { xs: 48, sm: 'auto' },
                          fontSize: { xs: '1rem', sm: '0.875rem' },
                        }}
                      >
                        {mode === 'create'
                          ? 'Create Configuration'
                          : 'Save Configuration'}
                      </Button>

                      {mode === 'edit' && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="large"
                          disabled={deleting}
                          onClick={() => setDeleteDialogOpen(true)}
                          startIcon={<Icon icon="mdi:delete-outline" />}
                          sx={{
                            minHeight: { xs: 48, sm: 'auto' },
                            fontSize: { xs: '1rem', sm: '0.875rem' },
                          }}
                        >
                          Delete Configuration
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </form>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Configuration?</DialogTitle>
        <DialogContent>
          <Typography>
            This will deactivate the communication configuration. You can
            recreate it later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default CommunicationConfigView
