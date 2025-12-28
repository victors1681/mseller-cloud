// ** React Imports
import { ReactNode, useRef, useState } from 'react'

// ** Next Import
import LoadingButton from '@mui/lab/LoadingButton'
import Link from 'next/link'
import ReCAPTCHAV2 from 'react-google-recaptcha'

import Box, { BoxProps } from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography, { TypographyProps } from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import Image from 'next/image'
import { SignUpRequest } from 'src/firebase'
import { useAuth } from 'src/hooks/useAuth'
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import CountryDropdown from './CountryDropdown'
import TermsDialog from './TermModal'

// ** Styled Components
const RegisterIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10),
  },
}))

const RegisterIllustration = styled('img')(({ theme }) => ({
  maxWidth: '46rem',
  [theme.breakpoints.down('lg')]: {
    maxWidth: '35rem',
  },
}))

const TreeIllustration = styled('img')(({ theme }) => ({
  bottom: 0,
  left: '1.875rem',
  position: 'absolute',
  [theme.breakpoints.down('lg')]: {
    left: 0,
  },
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450,
  },
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('xl')]: {
    width: '100%',
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: 400,
  },
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) },
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  fontSize: '0.875rem',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main,
}))

const SITE_KEY = '6LcL4oMqAAAAANTcIMhAgqjATlFR9gy4lgh33IQJ'

const Register = () => {
  // ** States
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isResponseError, setResponseError] = useState<boolean>(false)
  const [captchaError, setCaptchaError] = useState<boolean>(false)
  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const [captchaValid, setCaptchaValid] = useState(false)
  const auth = useAuth()
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isLoading },
    setValue,
    register,
    watch,
  } = useForm<SignUpRequest>({ mode: 'onChange' })

  const recaptchaRef = useRef<ReCAPTCHAV2 | null>(null)

  const formValues = watch()
  const isFormFilled =
    Object.values(formValues).every((value) => value !== '') &&
    Object.keys(errors).length == 0

  const onSubmit: SubmitHandler<SignUpRequest> = async (data) => {
    try {
      if (!captchaValid) {
        setCaptchaError(true)
        toast.error('Por favor, complete el captcha.')
        return
      }

      const response = await auth.signUp(data)
      if (response && 'error' in response) {
        toast.error(response.error)
        recaptchaRef?.current?.reset()
        setCaptchaValid(false)
        setCaptchaError(false)
      } else if (response) {
        //Success
        toast.success(`Business ${response.result.businessId} created`)
        //Auto login
        auth.login({
          email: data.user_email,
          password: data.user_password,
        })
      }
    } catch (error) {
      toast.error('Error intentando crear una nueva cuenta')
      recaptchaRef?.current?.reset()
      setCaptchaValid(false)
      setCaptchaError(false)
    }
  }
  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValid(!!value)
    setCaptchaError(false)
    value && setValue('reCaptchaToken', value)
  }
  // ** Vars
  const { skin } = settings

  const imageSource =
    skin === 'bordered'
      ? 'auth-v2-register-illustration-bordered'
      : 'auth-v2-register-illustration'

  return (
    <Box className="content-right">
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RegisterIllustrationWrapper>
            <RegisterIllustration
              alt="register-illustration"
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </RegisterIllustrationWrapper>
          <FooterIllustrationsV2
            image={
              <TreeIllustration alt="tree" src="/images/pages/tree-2.png" />
            }
          />
        </Box>
      ) : null}
      <RightWrapper
        sx={
          skin === 'bordered' && !hidden
            ? { borderLeft: `1px solid ${theme.palette.divider}` }
            : {}
        }
      >
        <Box
          sx={{
            p: 12,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper',
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: { xs: 0, md: 30 },
                left: { xs: 0, md: 40 },
                display: 'flex',
                position: { xs: 'relative', md: 'absolute' },
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                mb: { xs: 4, md: 0 },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Image
                  src="/images/logos/mseller-logo-dark.png"
                  alt="logo"
                  height="50"
                  width="200"
                  style={{ paddingLeft: '10px' }}
                />
              </Box>
            </Box>
            <Box sx={{ mb: 6, mt: { xs: 0, md: 6 } }}>
              <TypographyStyled variant="h5">
                Crear una nueva cuenta
              </TypographyStyled>
              <Typography variant="body2">
                Conecta tu fuerza de ventas con tu negocio
              </Typography>
            </Box>
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="business_name"
                control={control}
                defaultValue=""
                rules={{ required: 'Nombre de negocio es obligatorio' }}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Nombre de su negocio"
                    placeholder="Mi negocio SRL"
                    {...field}
                    error={!!errors.business_name}
                    disabled={isSubmitting}
                    helperText={
                      errors.business_name
                        ? (errors.business_name.message as string)
                        : ''
                    }
                    sx={{ mb: 4 }}
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                defaultValue=""
                rules={{ required: 'Teléfono es obligatorio' }}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Teléfono"
                    placeholder="809-000-0000"
                    disabled={isSubmitting}
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^\d{3}-?\d{3}-?\d{4}$/,
                        message: 'El número telefónico debe ser: 000-000-0000',
                      },
                    })}
                    {...field}
                    error={!!errors.phone}
                    helperText={
                      errors.phone ? (errors.phone.message as string) : ''
                    }
                    sx={{ mb: 4 }}
                  />
                )}
              />

              <Controller
                name="address"
                control={control}
                defaultValue=""
                rules={{ required: 'Dirección es obligatoria' }}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    disabled={isSubmitting}
                    label="Dirección"
                    {...field}
                    error={!!errors.address}
                    helperText={
                      errors.address ? (errors.address.message as string) : ''
                    }
                    sx={{ mb: 4 }}
                  />
                )}
              />

              <CountryDropdown
                name="country"
                control={control}
                disabled={isSubmitting}
                error={
                  errors?.country ? (errors.country.message as string) : ''
                }
              />

              <Divider sx={{ my: 5 }}>Datos del usuario</Divider>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Controller
                    name="user_first_name"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Nombre es obligatorio' }}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        disabled={isSubmitting}
                        label="Nombre"
                        {...field}
                        error={!!errors.user_first_name}
                        helperText={
                          errors.user_first_name
                            ? (errors.user_first_name.message as string)
                            : ''
                        }
                        sx={{ mb: 4 }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="user_last_name"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Apellido es obligatorio' }}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        disabled={isSubmitting}
                        label="Apellido"
                        {...field}
                        error={!!errors.user_last_name}
                        helperText={
                          errors.user_last_name
                            ? (errors.user_last_name.message as string)
                            : ''
                        }
                        sx={{ mb: 4 }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Controller
                name="user_email"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Correo electrónico es obligatorio',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Correo electrónico no válido',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    disabled={isSubmitting}
                    label="Correo electrónico"
                    {...field}
                    error={!!errors.user_email}
                    helperText={
                      errors.user_email
                        ? (errors.user_email.message as string)
                        : ''
                    }
                    sx={{ mb: 4 }}
                  />
                )}
              />

              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor="user_password">Contraseña</InputLabel>
                <Controller
                  name="user_password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'Contraseña es obligatoria',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres',
                    },
                    pattern: {
                      value: /[!@#$%^&*(),.?":{}|<>]/,
                      message:
                        'La contraseña debe contener al menos un carácter especial',
                    },
                  }}
                  render={({ field }) => (
                    <OutlinedInput
                      {...field}
                      disabled={isSubmitting}
                      id="user_password"
                      type={showPassword ? 'text' : 'password'}
                      label="Contraseña" // label here for accessibility
                      error={!!errors.user_password}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => setShowPassword(!showPassword)}
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
                <FormHelperText
                  sx={{
                    color: errors.user_password
                      ? theme.palette.error.main
                      : 'inherit',
                  }}
                >
                  {errors.user_password
                    ? (errors.user_password?.message as string)
                    : ''}
                </FormHelperText>
              </FormControl>

              <Controller
                name="terms"
                control={control}
                defaultValue={false}
                rules={{
                  validate: (value) =>
                    value || 'Debe aceptar los términos y condiciones',
                }}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        disabled={isSubmitting}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label={<TermsDialog />}
                  />
                )}
              />
              {errors.terms && (
                <FormHelperText error>
                  {errors?.terms ? (errors.terms?.message as string) : ''}
                </FormHelperText>
              )}

              {/* Google reCAPTCHA */}
              <Box sx={{ mt: 3, pb: 3, textAlign: 'center' }}>
                <ReCAPTCHAV2
                  ref={recaptchaRef}
                  sitekey={SITE_KEY}
                  onChange={handleCaptchaChange}
                />
                {captchaError && !captchaValid && (
                  <FormHelperText error>
                    Por favor, complete el captcha.
                  </FormHelperText>
                )}
              </Box>

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{ mb: 7 }}
                loading={isLoading}
                disabled={!isFormFilled || !captchaValid}
              >
                Crear nueva cuenta
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
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Register.guestGuard = true

export default Register
