// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useAppDispatch } from 'src/store'
import { createConfiguracion } from 'src/store/apps/configuracionEmpresa'

// ** Types
import {
  COUNTRIES,
  COUNTRY_DEFAULTS,
  CreateConfiguracionRequest,
  TAX_LABEL_BY_COUNTRY,
  TIPO_COMPROBANTE_LABELS,
  TipoComprobanteFiscal,
} from 'src/types/apps/configuracionEmpresaTypes'

interface SetupWizardProps {
  open: boolean
  onClose: () => void
  onComplete: () => void
}

const steps = ['País', 'Configuración Fiscal', 'Política de Devoluciones']

const BusinessSetupWizard: React.FC<SetupWizardProps> = ({
  open,
  onClose,
  onComplete,
}) => {
  // ** Hooks
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // ** State
  const [activeStep, setActiveStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    codigoPais: 'DO',
    tipoComprobanteFiscal: TipoComprobanteFiscal.NCF,
    enableITBISLimit: true,
    diasMaximosDevolucionITBIS: 30,
  })

  // ** Handlers
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleCountryChange = (country: string) => {
    const defaults = COUNTRY_DEFAULTS[country]
    setFormData({
      ...formData,
      codigoPais: country,
      tipoComprobanteFiscal:
        defaults?.tipoComprobanteFiscal || TipoComprobanteFiscal.Ninguno,
      enableITBISLimit: defaults?.diasMaximosDevolucionITBIS !== null,
      diasMaximosDevolucionITBIS: defaults?.diasMaximosDevolucionITBIS || 30,
    })
  }

  const handleFinish = async () => {
    setIsSubmitting(true)

    try {
      const defaults = COUNTRY_DEFAULTS[formData.codigoPais]
      const request: CreateConfiguracionRequest = {
        codigoPais: formData.codigoPais,
        codigoMoneda: defaults.codigoMoneda,
        zonaHoraria: defaults.zonaHoraria,
        codigoIdioma: defaults.codigoIdioma,
        formatoFecha: defaults.formatoFecha,
        separadorDecimal: defaults.separadorDecimal,
        separadorMiles: defaults.separadorMiles,
        tipoComprobanteFiscal: formData.tipoComprobanteFiscal,
        diasMaximosDevolucionITBIS: formData.enableITBISLimit
          ? formData.diasMaximosDevolucionITBIS
          : null,
      }

      await dispatch(createConfiguracion(request)).unwrap()
      toast.success('¡Configuración creada exitosamente!')
      onComplete()
    } catch (error: any) {
      toast.error(error || 'Error al crear la configuración')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  // ** Render Step Content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ py: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
              ¿Dónde está ubicado su negocio?
            </Typography>
            <FormControl fullWidth>
              <InputLabel>País *</InputLabel>
              <Select
                value={formData.codigoPais}
                label="País *"
                onChange={(e) => handleCountryChange(e.target.value)}
              >
                {COUNTRIES.map((country) => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )

      case 1:
        return (
          <Box sx={{ py: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
              ¿Cómo maneja los comprobantes fiscales?
            </Typography>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                Tipo de Comprobante Fiscal
              </FormLabel>
              <RadioGroup
                value={formData.tipoComprobanteFiscal.toString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tipoComprobanteFiscal: parseInt(e.target.value),
                  })
                }
              >
                {Object.entries(TIPO_COMPROBANTE_LABELS).map(
                  ([value, label]) => (
                    <FormControlLabel
                      key={value}
                      value={value}
                      control={<Radio />}
                      label={label}
                    />
                  ),
                )}
              </RadioGroup>
            </FormControl>
            {formData.codigoPais === 'DO' && (
              <Typography
                variant="caption"
                color="info.main"
                sx={{ mt: 2, display: 'block' }}
              >
                Nota: Los negocios en República Dominicana deben seleccionar NCF
                o ECF para cumplir con la DGII
              </Typography>
            )}
          </Box>
        )

      case 2:
        return (
          <Box sx={{ py: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
              ¿Desea limitar los reembolsos de{' '}
              {TAX_LABEL_BY_COUNTRY[formData.codigoPais] || 'impuestos'} en
              devoluciones?
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={formData.enableITBISLimit ? 'yes' : 'no'}
                onChange={(e) => {
                  const enable = e.target.value === 'yes'
                  setFormData({
                    ...formData,
                    enableITBISLimit: enable,
                    diasMaximosDevolucionITBIS: enable ? 30 : null,
                  })
                }}
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography>Sí, limitar a</Typography>
                      {formData.enableITBISLimit && (
                        <TextField
                          type="number"
                          value={formData.diasMaximosDevolucionITBIS}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              diasMaximosDevolucionITBIS: parseInt(
                                e.target.value,
                              ),
                            })
                          }
                          size="small"
                          sx={{ width: 100, ml: 2 }}
                          InputProps={{
                            endAdornment: (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                días
                              </Typography>
                            ),
                          }}
                        />
                      )}
                    </Box>
                  }
                />
                <FormControlLabel
                  value="no"
                  control={<Radio />}
                  label="No, permitir reembolsos en cualquier momento"
                />
              </RadioGroup>
            </FormControl>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 2, display: 'block' }}
            >
              Esta configuración determina si las devoluciones después de cierta
              fecha incluirán reembolso de impuestos
            </Typography>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleSkip}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
        },
      }}
    >
      <DialogContent sx={{ p: isMobile ? 2 : 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Icon icon="mdi:cog-outline" fontSize="3rem" color="primary.main" />
          <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
            Configuración Inicial
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure los parámetros básicos de su negocio
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card variant="outlined">
          <CardContent sx={{ minHeight: 300 }}>
            {renderStepContent()}
          </CardContent>
        </Card>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 4,
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2,
          }}
        >
          <Button onClick={handleSkip} variant="outlined" fullWidth={isMobile}>
            Saltar
          </Button>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: isMobile ? 'column' : 'row',
            }}
          >
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              fullWidth={isMobile}
              startIcon={<Icon icon="mdi:chevron-left" />}
            >
              Atrás
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handleFinish}
                variant="contained"
                disabled={isSubmitting}
                fullWidth={isMobile}
                startIcon={
                  isSubmitting ? (
                    <Icon icon="mdi:loading" className="spin" />
                  ) : (
                    <Icon icon="mdi:check" />
                  )
                }
              >
                {isSubmitting ? 'Guardando...' : 'Finalizar'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                fullWidth={isMobile}
                endIcon={<Icon icon="mdi:chevron-right" />}
              >
                Continuar
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default BusinessSetupWizard
