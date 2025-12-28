// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
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
import useMediaQuery from '@mui/material/useMediaQuery'

import MuiFormControlLabel, {
  FormControlLabelProps,
} from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Firebase
import {
  GoogleAuthProvider,
  // OAuthProvider, // TODO: Uncomment when Apple Sign-In is configured
  signInWithPopup,
} from 'firebase/auth'
import toast from 'react-hot-toast'
import { auth as firebaseAuth } from 'src/firebase'

// ** Hooks
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAuth } from 'src/hooks/useAuth'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' },
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(
  ({ theme }) => ({
    '& .MuiFormControlLabel-label': {
      fontSize: '0.875rem',
      color: theme.palette.text.secondary,
    },
  }),
)

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required(),
})

const defaultValues = {
  password: '',
  email: '',
}

interface FormData {
  email: string
  password: string
}

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState<boolean>(true)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isSocialLoading, setIsSocialLoading] = useState<boolean>(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const bgColors = useBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    // mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    const { email, password } = data
    auth.login({ email, password, rememberMe }, () => {
      setError('email', {
        type: 'manual',
        message: 'Email o contraseña inválida',
      })
    })
  }
  // ** Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsSocialLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(firebaseAuth, provider)

      if (result.user) {
        // User authenticated with Google, refresh profile
        await auth.signInByToken()
        toast.success('Inicio de sesión exitoso con Google')
      }
    } catch (error: any) {
      console.error('Google sign in error:', error)

      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Inicio de sesión cancelado')
      } else if (
        error.code === 'auth/account-exists-with-different-credential'
      ) {
        toast.error('Ya existe una cuenta con este correo usando otro método')
      } else {
        toast.error('Error al iniciar sesión con Google')
      }
    } finally {
      setIsSocialLoading(false)
    }
  }

  // ** Handle Apple Sign In
  // TODO: Apple Sign-In will be configured in the future
  /*
  const handleAppleSignIn = async () => {
    setIsSocialLoading(true)
    try {
      const provider = new OAuthProvider('apple.com')
      provider.addScope('email')
      provider.addScope('name')

      const result = await signInWithPopup(firebaseAuth, provider)

      if (result.user) {
        // User authenticated with Apple, refresh profile
        await auth.signInByToken()
        toast.success('Inicio de sesión exitoso con Apple')
      }
    } catch (error: any) {
      console.error('Apple sign in error:', error)

      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Inicio de sesión cancelado')
      } else if (
        error.code === 'auth/account-exists-with-different-credential'
      ) {
        toast.error('Ya existe una cuenta con este correo usando otro método')
      } else {
        toast.error('Error al iniciar sesión con Apple')
      }
    } finally {
      setIsSocialLoading(false)
    }
  }
  */
  const imageSource =
    skin === 'bordered'
      ? 'auth-v2-login-illustration-bordered'
      : 'auth-v2-login-illustration'

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
            <img
              src="/images/logos/mseller-logo.svg"
              alt="MSeller Logo"
              style={{ height: '36px', width: 'auto' }}
            />
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
              Bienvenido a {themeConfig.templateName}!
            </Typography>
            <Typography variant="body2">
              Por favor, inicia sesión en tu cuenta.
            </Typography>
          </Box>
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    label="Email"
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder="correo eléctronico"
                    disabled={auth.loadingForm}
                  />
                )}
              />
              {errors.email && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.email.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel
                htmlFor="auth-login-v2-password"
                error={Boolean(errors.password)}
                disabled={auth.loadingForm}
              >
                Contraseña
              </InputLabel>
              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <OutlinedInput
                    value={value}
                    onBlur={onBlur}
                    label="Contraseña"
                    onChange={onChange}
                    id="auth-login-v2-password"
                    error={Boolean(errors.password)}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon
                            icon={
                              showPassword
                                ? 'mdi:eye-outline'
                                : 'mdi:eye-off-outline'
                            }
                            fontSize={20}
                          />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.password && (
                <FormHelperText sx={{ color: 'error.main' }} id="">
                  {errors.password.message}
                </FormHelperText>
              )}
            </FormControl>
            <Box
              sx={{
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="Recuerdame"
              />
              <LinkStyled href="/forgot-password">
                Olvidó su contraseña?
              </LinkStyled>
            </Box>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              sx={{ mb: 7 }}
              loading={auth.loadingForm}
            >
              Iniciar Sesión
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
                Nuevo usuario?
              </Typography>
              <Typography variant="body2">
                <LinkStyled href="/register">Crear una cuenta</LinkStyled>
              </Typography>
            </Box>
            <Divider sx={{ my: (theme) => `${theme.spacing(5)} !important` }}>
              o
            </Divider>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Button
                fullWidth
                size="large"
                variant="outlined"
                sx={{
                  borderColor: '#db4437',
                  color: '#db4437',
                  '&:hover': {
                    borderColor: '#db4437',
                    backgroundColor: 'rgba(219, 68, 55, 0.04)',
                  },
                }}
                onClick={handleGoogleSignIn}
                disabled={isSocialLoading || auth.loadingForm}
                startIcon={<Icon icon="mdi:google" />}
              >
                Google
              </Button>
              {/* TODO: Apple Sign-In will be configured in the future */}
              {/*
                <Button
                  fullWidth
                  size='large'
                  variant="outlined"
                  sx={{
                    borderColor: (theme) =>
                      theme.palette.mode === 'light' ? '#000' : '#fff',
                    color: (theme) =>
                      theme.palette.mode === 'light' ? '#000' : '#fff',
                    '&:hover': {
                      borderColor: (theme) =>
                        theme.palette.mode === 'light' ? '#000' : '#fff',
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                          ? 'rgba(0, 0, 0, 0.04)'
                          : 'rgba(255, 255, 255, 0.04)',
                    },
                  }}
                  onClick={handleAppleSignIn}
                  disabled={isSocialLoading || auth.loadingForm}
                  startIcon={<Icon icon="mdi:apple" />}
                >
                  Apple
                </Button>
                */}
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV2 />
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
