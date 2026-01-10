// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAuth } from 'src/hooks/useAuth'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { isValidResponse } from 'src/firebase'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

interface FormValues {
  email: string
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' },
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  fontSize: '0.875rem',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main,
}))

const ForgotPassword = () => {
  // ** State
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const { triggerForgotPassword } = useAuth()

  // ** Vars
  const { skin } = settings

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)

    try {
      const response = await triggerForgotPassword({ email: data.email })
      if (isValidResponse(response)) {
        setIsSuccess(true)
        toast.success(
          'Se ha enviado un correo electrónico para actualizar su contraseña',
        )
      } else {
        toast.error('Error inesperado al recuperar la contraseña')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error al enviar el correo')
    } finally {
      setIsLoading(false)
    }
  }

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
            <Box
              component="a"
              href="https://mseller.app"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                cursor: 'pointer',
                display: 'inline-flex',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <img
                src="/images/logos/mseller-logo.svg"
                alt="MSeller Logo"
                style={{ height: '36px', width: 'auto' }}
              />
            </Box>
          </Box>

          {!isSuccess ? (
            <>
              <Box sx={{ mb: 6 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
                  Olvidó su contraseña? 🔒
                </Typography>
                <Typography variant="body2">
                  Ingrese su correo electrónico y recibirá instrucciones para
                  restaurar su contraseña
                </Typography>
              </Box>
              <form
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
              >
                <TextField
                  autoFocus
                  fullWidth
                  type="email"
                  label="Email"
                  placeholder="correo electrónico"
                  sx={{ mb: 4 }}
                  {...register('email', {
                    required: 'Email es requerido',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Dirección de correo inválida',
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                />
                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{ mb: 5.25 }}
                  loading={isLoading}
                >
                  Restaurar Contraseña
                </LoadingButton>
                <Typography
                  variant="body2"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LinkStyled href="/login">
                    <Icon icon="mdi:chevron-left" />
                    <span>Regresar al inicio de sesión</span>
                  </LinkStyled>
                </Typography>
              </form>
            </>
          ) : (
            <>
              <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Icon
                  icon="mdi:email-check-outline"
                  fontSize={64}
                  color="success"
                />
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, mb: 1.5, mt: 4 }}
                >
                  ¡Correo Enviado!
                </Typography>
                <Alert severity="success" sx={{ mb: 4, textAlign: 'left' }}>
                  Se ha enviado un correo electrónico con las instrucciones para
                  restaurar su contraseña.
                </Alert>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Por favor, revise su bandeja de entrada y su carpeta de spam.
                </Typography>
                <Typography variant="body2" sx={{ mb: 4 }}>
                  Si no recibe el correo en unos minutos, contacte a soporte en{' '}
                  <Box
                    component="a"
                    href="mailto:soporte@mseller.app"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    soporte@mseller.app
                  </Box>
                </Typography>
              </Box>
              <Button
                fullWidth
                size="large"
                variant="contained"
                href="/login"
                sx={{ mb: 4 }}
              >
                Volver al inicio de sesión
              </Button>
            </>
          )}

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
              }}
            >
              ¿Necesitas ayuda?{' '}
              <Box
                component="a"
                href="https://mseller.app"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Visita mseller.app
              </Box>
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <FooterIllustrationsV2 />
    </Box>
  )
}

ForgotPassword.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

ForgotPassword.guestGuard = true

export default ForgotPassword
