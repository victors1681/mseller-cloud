// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Firebase
import {
  GoogleAuthProvider,
  // OAuthProvider, // TODO: Uncomment when Apple Sign-In is configured
  signInWithPopup,
} from 'firebase/auth'
import toast from 'react-hot-toast'
import { auth, SignUpRequest } from 'src/firebase'

// ** Form Handling
import { Controller, useForm } from 'react-hook-form'

interface State {
  password: string
  showPassword: boolean
}

interface SimpleRegisterFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' },
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

const RegisterSimple = () => {
  // ** State
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // ** Hook
  const theme = useTheme()
  const router = useRouter()
  const authContext = useAuth()

  // ** Form
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SimpleRegisterFormData>({
    mode: 'onSubmit',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = watch('password')

  // ** Helper: Create SignUpRequest from user data
  const createSignUpRequest = (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    captchaToken: string,
    uid?: string,
  ): SignUpRequest => ({
    business_name: `${firstName} ${lastName}'s Business`,
    user_email: email,
    user_password: password,
    user_first_name: firstName,
    user_last_name: lastName,
    phone: '', // Will be filled in onboarding
    address: '', // Will be filled in onboarding
    country: '', // Will be filled in onboarding
    reCaptchaToken: captchaToken,
    terms: true,
    ...(uid && { uid }), // Include userId only for social logins
  })

  // ** Helper: Process signup response
  const processSignUpResponse = async (
    response: any,
    successMessage: string,
    fromProvider?: boolean,
    email?: string,
    password?: string,
  ) => {
    if (response && 'error' in response) {
      // Handle existing user gracefully
      if (
        response.error.includes('already exists') ||
        response.error.includes('already in use')
      ) {
        toast.success(successMessage)

        // Sign in by token for social logins, or by credentials for email/password
        if (fromProvider) {
          await authContext.signInByToken()
        }

        router.push('/onboarding')
      } else {
        toast.error(response.error)
      }
    } else if (response) {
      toast.success(successMessage)

      // Sign in by token for social logins, or by credentials for email/password
      if (fromProvider) {
        await authContext.signInByToken()
      } else if (email && password) {
        await authContext.login({ email, password })
      }

      // // Redirect to onboarding
      // router.push('/onboarding')
    }
  }

  // ** Handle Email/Password Registration
  const onSubmit = async (data: SimpleRegisterFormData) => {
    setIsLoading(true)
    try {
      const signUpData = createSignUpRequest(
        data.firstName,
        data.lastName,
        data.email,
        data.password,
        'simple-registration',
      )

      const response = await authContext.signUp(signUpData)
      await processSignUpResponse(
        response,
        'Cuenta creada exitosamente',
        false, // Not from provider
        data.email,
        data.password,
      )
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error('Error al crear la cuenta')
    } finally {
      setIsLoading(false)
    }
  }

  // ** Helper: Handle social login popup errors
  const handleSocialLoginError = (error: any, provider: string) => {
    console.error(`${provider} sign-in error:`, error)

    let errorMessage = `Error al iniciar sesión con ${provider}`
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Inicio de sesión cancelado'
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage =
        'Popup bloqueado. Por favor, permite popups en tu navegador'
    }

    toast.error(errorMessage)
  }

  // ** Helper: Extract name from social login
  const extractNameParts = (
    displayName: string,
    email: string,
    defaultLastName: string,
  ) => {
    if (displayName) {
      const nameParts = displayName.split(' ')
      return {
        firstName: nameParts[0] || 'User',
        lastName: nameParts.slice(1).join(' ') || defaultLastName,
        fullName: displayName,
      }
    }

    // Fallback to email prefix if no display name
    const emailPrefix = email.split('@')[0]
    return {
      firstName: emailPrefix || 'User',
      lastName: defaultLastName,
      fullName: `${emailPrefix} ${defaultLastName}`,
    }
  }

  // ** Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      console.log('provider', result)
      if (result.user) {
        const { firstName, lastName } = extractNameParts(
          result.user.displayName || '',
          result.user.email || '',
          'Google',
        )

        const signUpData = createSignUpRequest(
          firstName,
          lastName,
          result.user.email || '',
          '', // Password not needed for social logins
          'google-social-login',
          result.user.uid, // Pass Firebase UID for social login
        )

        const response = await authContext.signUp(signUpData)
        await processSignUpResponse(
          response,
          'Inicio de sesión exitoso con Google',
          true, // From social provider
        )
      }
    } catch (error: any) {
      handleSocialLoginError(error, 'Google')
    } finally {
      setIsLoading(false)
    }
  }

  // ** Handle Apple Sign In
  // TODO: Apple Sign-In will be configured in the future
  /*
  const handleAppleSignIn = async () => {
    setIsLoading(true)
    try {
      const provider = new OAuthProvider('apple.com')
      provider.addScope('email')
      provider.addScope('name')

      const result = await signInWithPopup(auth, provider)

      if (result.user) {
        const { firstName, lastName } = extractNameParts(
          result.user.displayName || '',
          result.user.email || '',
          'Apple',
        )

        const signUpData = createSignUpRequest(
          firstName,
          lastName,
          result.user.email || '',
          '', // Password not needed for social logins
          'apple-social-login',
          result.user.uid, // Pass Firebase UID for social login
        )

        const response = await authContext.signUp(signUpData)
        await processSignUpResponse(
          response,
          'Inicio de sesión exitoso con Apple',
          true, // From social provider
        )
      }
    } catch (error: any) {
      handleSocialLoginError(error, 'Apple')
    } finally {
      setIsLoading(false)
    }
  }
  */

  return (
    <Box className="content-center">
      <Card sx={{ zIndex: 1 }}>
        <CardContent
          sx={{ p: (theme) => `${theme.spacing(12, 9, 7)} !important` }}
        >
          <Box
            sx={{
              mb: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                lineHeight: 1,
                fontWeight: 600,
                fontSize: '1.5rem !important',
              }}
            >
              Bienvenido a MSeller
            </Typography>
          </Box>

          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
              Regístrate gratis
            </Typography>
            <Typography variant="body2">
              Crea tu cuenta y comienza a vender en minutos
            </Typography>
          </Box>

          {/* Social Login Buttons */}
          <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              size="large"
              variant="outlined"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              startIcon={<Icon icon="mdi:google" />}
              sx={{
                borderColor: '#db4437',
                color: '#db4437',
                '&:hover': {
                  borderColor: '#db4437',
                  backgroundColor: 'rgba(219, 68, 55, 0.04)',
                },
              }}
            >
              Continue with Google
            </Button>

            {/* TODO: Apple Sign-In will be configured in the future */}
            {/*
            <Button
              fullWidth
              size="large"
              variant="outlined"
              onClick={handleAppleSignIn}
              disabled={isLoading}
              startIcon={<Icon icon="mdi:apple" />}
              sx={{
                borderColor: 'divider',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              Continue with Apple
            </Button>
            */}
          </Box>

          <Divider sx={{ my: (theme) => `${theme.spacing(5)} !important` }}>
            o
          </Divider>

          {/* Email/Password Form */}
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="firstName"
              control={control}
              rules={{
                required: 'El nombre es obligatorio',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoFocus
                  fullWidth
                  label="Nombre"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  disabled={isLoading}
                  sx={{ mb: 4 }}
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              rules={{
                required: 'El apellido es obligatorio',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Apellido"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  disabled={isLoading}
                  sx={{ mb: 4 }}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: 'El correo electrónico es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo electrónico inválido',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="email"
                  label="Correo Electrónico"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                  sx={{ mb: 4 }}
                />
              )}
            />

            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel
                htmlFor="auth-register-password"
                error={!!errors.password}
              >
                Contraseña
              </InputLabel>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: 'La contraseña es obligatoria',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres',
                  },
                }}
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    label="Contraseña"
                    id="auth-register-password"
                    error={!!errors.password}
                    type={showPassword ? 'text' : 'password'}
                    disabled={isLoading}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <Icon
                            icon={
                              showPassword
                                ? 'mdi:eye-outline'
                                : 'mdi:eye-off-outline'
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.password && (
                <FormHelperText error>{errors.password.message}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel
                htmlFor="auth-register-confirm-password"
                error={!!errors.confirmPassword}
              >
                Confirmar Contraseña
              </InputLabel>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: 'Confirma tu contraseña',
                  validate: (value) =>
                    value === password || 'Las contraseñas no coinciden',
                }}
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    label="Confirmar Contraseña"
                    id="auth-register-confirm-password"
                    error={!!errors.confirmPassword}
                    type={showConfirmPassword ? 'text' : 'password'}
                    disabled={isLoading}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <Icon
                            icon={
                              showConfirmPassword
                                ? 'mdi:eye-outline'
                                : 'mdi:eye-off-outline'
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.confirmPassword && (
                <FormHelperText error>
                  {errors.confirmPassword.message}
                </FormHelperText>
              )}
            </FormControl>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isLoading}
              sx={{ mb: 7 }}
            >
              Crear cuenta
            </LoadingButton>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2" sx={{ mr: 2 }}>
                ¿Ya tienes una cuenta?
              </Typography>
              <Typography variant="body2">
                <LinkStyled href="/login">Inicia sesión</LinkStyled>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

RegisterSimple.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

RegisterSimple.guestGuard = true

export default RegisterSimple
