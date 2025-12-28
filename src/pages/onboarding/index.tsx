// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Components
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Onboarding Steps
import AddressStep from 'src/views/onboarding/AddressStep'
import BusinessNameStep from 'src/views/onboarding/BusinessNameStep'
import BusinessTypeStep from 'src/views/onboarding/BusinessTypeStep'
import CountryStep from 'src/views/onboarding/CountryStep'
import DataSetupStep from 'src/views/onboarding/DataSetupStep'
import PhoneStep from 'src/views/onboarding/PhoneStep'

// ** Hooks
import { useFirebase } from 'src/firebase/useFirebase'
import { useAuth } from 'src/hooks/useAuth'

// ** Store Imports
import { useAppDispatch, useAppSelector } from 'src/store'
import { configureOnboarding } from 'src/store/apps/onboarding'

// ** Firebase
import toast from 'react-hot-toast'
import { auth as firebase_auth } from 'src/firebase'

// ** Types
export interface OnboardingData {
  businessName: string
  phone: string
  street: string
  city: string
  country: string
  rnc?: string
  businessType: string
  industry: string
  setupOption: 'new' | 'sample' | 'upload' | null
}

const steps = [
  'Nombre del Negocio',
  'Teléfono',
  'Dirección',
  'País',
  'Tipo de Negocio',
  'Configuración Inicial',
]

// ** Styled Components
const OnboardingWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}))

const StepperWrapper = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 800,
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}))

const Onboarding = () => {
  // ** State
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    businessName: '',
    phone: '',
    street: '',
    city: '',
    country: '',
    rnc: '',
    businessType: '',
    industry: '',
    setupOption: null,
  })

  // ** Hooks
  const router = useRouter()
  const auth = useAuth()
  const firebase = useFirebase()
  const dispatch = useAppDispatch()
  const { configuring } = useAppSelector((state) => state.onboarding)

  // ** Update onboarding data
  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }))
  }

  // ** Handle Next Step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  // ** Handle Back Step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  // ** Handle Complete Onboarding
  const handleComplete = async () => {
    setIsLoading(true)

    const user = firebase_auth.currentUser
    if (!user) {
      toast.error('No hay usuario conectado')
      setIsLoading(false)
      return
    }

    // Step 1: Configure onboarding via API
    try {
      await dispatch(
        configureOnboarding({
          businessName: onboardingData.businessName,
          phone: onboardingData.phone,
          street: onboardingData.street,
          city: onboardingData.city,
          country: onboardingData.country,
          rnc: onboardingData.rnc,
          businessType: onboardingData.businessType,
          industry: onboardingData.industry,
          setupOption: onboardingData.setupOption!,
        }),
      ).unwrap()
    } catch (error: any) {
      console.error('Configuration API error:', error)
      toast.error('Error al configurar el negocio')
      setIsLoading(false)
      return
    }

    // Step 2: Save onboarding data to Firebase via Cloud Function
    try {
      // Clean the onboarding data - remove empty optional fields
      const cleanedData = {
        businessName: onboardingData.businessName,
        phone: onboardingData.phone,
        street: onboardingData.street,
        city: onboardingData.city,
        country: onboardingData.country,
        businessType: onboardingData.businessType,
        industry: onboardingData.industry,
        setupOption: onboardingData.setupOption!,
        ...(onboardingData.rnc && onboardingData.rnc.trim() !== ''
          ? { rnc: onboardingData.rnc }
          : {}),
      }

      await firebase.completeOnboarding({
        userId: user.uid,
        onboardingData: cleanedData,
        hasCompletedOnboarding: true,
      })
    } catch (error: any) {
      console.error('Firebase onboarding error:', error)
      toast.error('Error al guardar la configuración')
      setIsLoading(false)
      return
    }

    // Both steps succeeded - refresh user data and redirect
    setIsLoading(false)
    toast.success('¡Configuración completada exitosamente!')

    // Refresh user information to update hasCompletedOnboarding flag
    await auth.signInByToken()

    router.push('/home')
  }

  // ** Validate current step
  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return onboardingData.businessName.trim() !== ''
      case 1:
        return onboardingData.phone.trim() !== ''
      case 2:
        return (
          onboardingData.street.trim() !== '' &&
          onboardingData.city.trim() !== ''
        )
      case 3:
        return onboardingData.country.trim() !== ''
      case 4:
        return (
          onboardingData.businessType.trim() !== '' &&
          onboardingData.industry.trim() !== ''
        )
      case 5:
        return onboardingData.setupOption !== null
      default:
        return false
    }
  }

  // ** Get step content
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BusinessNameStep
            value={onboardingData.businessName}
            onChange={(value) => updateOnboardingData({ businessName: value })}
          />
        )
      case 1:
        return (
          <PhoneStep
            value={onboardingData.phone}
            onChange={(value) => updateOnboardingData({ phone: value })}
          />
        )
      case 2:
        return (
          <AddressStep
            street={onboardingData.street}
            city={onboardingData.city}
            onStreetChange={(value) => updateOnboardingData({ street: value })}
            onCityChange={(value) => updateOnboardingData({ city: value })}
          />
        )
      case 3:
        return (
          <CountryStep
            value={onboardingData.country}
            rnc={onboardingData.rnc || ''}
            onChange={(country, rnc) => updateOnboardingData({ country, rnc })}
          />
        )
      case 4:
        return (
          <BusinessTypeStep
            businessType={onboardingData.businessType}
            industry={onboardingData.industry}
            onChange={(businessType, industry) =>
              updateOnboardingData({ businessType, industry })
            }
          />
        )
      case 5:
        return (
          <DataSetupStep
            value={onboardingData.setupOption}
            onChange={(value) => updateOnboardingData({ setupOption: value })}
          />
        )
      default:
        return 'Unknown step'
    }
  }

  return (
    <>
      <OnboardingWrapper>
        <StepperWrapper>
          <CardContent sx={{ p: { xs: 2, sm: 4, md: 8 } }}>
            <Box sx={{ mb: { xs: 4, sm: 6, md: 8 }, textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                }}
              >
                Configuración de tu Negocio
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                Complete estos pasos para configurar su cuenta
              </Typography>
            </Box>

            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                mb: { xs: 4, sm: 6 },
                '& .MuiStepLabel-label': {
                  fontSize: { xs: '0.7rem', sm: '0.875rem' },
                  display: { xs: 'none', sm: 'block' },
                },
                '& .MuiStepLabel-iconContainer': {
                  paddingRight: { xs: 0, sm: '8px' },
                },
                '& .MuiStepConnector-root': {
                  top: { xs: 12, sm: 20 },
                },
              }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>
                    <Box
                      sx={{
                        display: { xs: 'none', sm: 'block' },
                      }}
                    >
                      {label}
                    </Box>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ minHeight: { xs: 200, sm: 300 }, mb: { xs: 4, sm: 6 } }}>
              {getStepContent(activeStep)}
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: { xs: 1, sm: 2 },
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <Button
                color="secondary"
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0 || isLoading}
                sx={{
                  minWidth: { xs: '100%', sm: 100 },
                  order: { xs: 2, sm: 1 },
                }}
              >
                Atrás
              </Button>

              {activeStep === steps.length - 1 ? (
                <LoadingButton
                  variant="contained"
                  onClick={handleComplete}
                  loading={isLoading}
                  disabled={!isStepValid()}
                  sx={{
                    minWidth: { xs: '100%', sm: 100 },
                    order: { xs: 1, sm: 2 },
                  }}
                >
                  Finalizar
                </LoadingButton>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isStepValid() || isLoading}
                  sx={{
                    minWidth: { xs: '100%', sm: 100 },
                    order: { xs: 1, sm: 2 },
                  }}
                >
                  Siguiente
                </Button>
              )}
            </Box>
          </CardContent>
        </StepperWrapper>
      </OnboardingWrapper>

      {/* Configuration Loading Dialog */}
      <Dialog
        open={configuring}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            px: 2,
            py: 4,
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              textAlign: 'center',
            }}
          >
            <CircularProgress size={60} thickness={4} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            >
              Configurando {onboardingData.businessName}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Por favor espere, esto puede tomar unos minutos...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

Onboarding.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

// This page should be accessible only to authenticated users who haven't completed onboarding
Onboarding.authGuard = true

export default Onboarding
