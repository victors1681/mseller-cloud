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
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as yup from 'yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  createConfiguracion,
  fetchConfiguracion,
  updateConfiguracion,
} from 'src/store/apps/configuracionEmpresa'

// ** Types
import {
  COUNTRIES,
  COUNTRY_DEFAULTS,
  CreateConfiguracionRequest,
  CURRENCIES,
  TIMEZONES,
  TIPO_COMPROBANTE_LABELS,
  TipoComprobanteFiscal,
  UpdateConfiguracionRequest,
} from 'src/types/apps/configuracionEmpresaTypes'

interface ConfigFormData {
  codigoPais: string
  codigoMoneda: string
  zonaHoraria: string
  codigoIdioma: string
  formatoFecha: string
  separadorDecimal: string
  separadorMiles: string
  tipoComprobanteFiscal: TipoComprobanteFiscal
  enableITBISLimit: boolean
  diasMaximosDevolucionITBIS: number | null
}

const ConfiguracionEmpresaView = () => {
  // ** Hooks
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // ** Store
  const {
    data: config,
    loading,
    hasConfiguration,
  } = useAppSelector((state) => state.configuracionEmpresa)

  // ** State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countryChangeDialogOpen, setCountryChangeDialogOpen] = useState(false)
  const [pendingCountry, setPendingCountry] = useState<string | null>(null)

  // ** Validation Schema
  const schema = yup.object().shape({
    codigoPais: yup.string().required('El país es requerido'),
    codigoMoneda: yup.string().required('La moneda es requerida'),
    zonaHoraria: yup.string().required('La zona horaria es requerida'),
    codigoIdioma: yup.string().required('El idioma es requerido'),
    formatoFecha: yup.string().required('El formato de fecha es requerido'),
    separadorDecimal: yup
      .string()
      .required('El separador decimal es requerido')
      .test(
        'different-separators',
        'Los separadores deben ser diferentes',
        function (value) {
          return value !== this.parent.separadorMiles
        },
      ),
    separadorMiles: yup.string().required('El separador de miles es requerido'),
    tipoComprobanteFiscal: yup
      .number()
      .required('El tipo de comprobante es requerido'),
    enableITBISLimit: yup.boolean(),
    diasMaximosDevolucionITBIS: yup
      .number()
      .nullable()
      .when('enableITBISLimit', {
        is: true,
        then: (schema) =>
          schema
            .required(
              'Los días son requeridos cuando el límite está habilitado',
            )
            .min(1, 'Debe ser al menos 1 día')
            .max(365, 'No puede exceder 365 días'),
        otherwise: (schema) => schema.nullable(),
      }),
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ConfigFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      codigoPais: 'DO',
      codigoMoneda: 'DOP',
      zonaHoraria: 'America/Santo_Domingo',
      codigoIdioma: 'es-DO',
      formatoFecha: 'dd/MM/yyyy',
      separadorDecimal: '.',
      separadorMiles: ',',
      tipoComprobanteFiscal: TipoComprobanteFiscal.NCF,
      enableITBISLimit: true,
      diasMaximosDevolucionITBIS: 30,
    },
  })

  // ** Watch values
  const selectedCountry = watch('codigoPais')
  const enableITBISLimit = watch('enableITBISLimit')
  const separadorDecimal = watch('separadorDecimal')
  const separadorMiles = watch('separadorMiles')
  const diasITBIS = watch('diasMaximosDevolucionITBIS')

  // ** Effects
  useEffect(() => {
    dispatch(fetchConfiguracion())
  }, [dispatch])

  useEffect(() => {
    if (config) {
      reset({
        codigoPais: config.codigoPais,
        codigoMoneda: config.codigoMoneda,
        zonaHoraria: config.zonaHoraria,
        codigoIdioma: config.codigoIdioma,
        formatoFecha: config.formatoFecha,
        separadorDecimal: config.separadorDecimal,
        separadorMiles: config.separadorMiles,
        tipoComprobanteFiscal: config.tipoComprobanteFiscal,
        enableITBISLimit: config.diasMaximosDevolucionITBIS !== null,
        diasMaximosDevolucionITBIS: config.diasMaximosDevolucionITBIS,
      })
    }
  }, [config, reset])

  // ** Handlers
  const handleCountryChange = (newCountry: string) => {
    if (config && newCountry !== config.codigoPais) {
      setPendingCountry(newCountry)
      setCountryChangeDialogOpen(true)
    } else {
      applyCountryDefaults(newCountry)
    }
  }

  const confirmCountryChange = () => {
    if (pendingCountry) {
      applyCountryDefaults(pendingCountry)
      setPendingCountry(null)
    }
    setCountryChangeDialogOpen(false)
  }

  const applyCountryDefaults = (countryCode: string) => {
    const defaults = COUNTRY_DEFAULTS[countryCode]
    if (defaults) {
      setValue('codigoPais', defaults.codigoPais)
      setValue('codigoMoneda', defaults.codigoMoneda)
      setValue('zonaHoraria', defaults.zonaHoraria)
      setValue('codigoIdioma', defaults.codigoIdioma)
      setValue('formatoFecha', defaults.formatoFecha)
      setValue('separadorDecimal', defaults.separadorDecimal)
      setValue('separadorMiles', defaults.separadorMiles)
      setValue('tipoComprobanteFiscal', defaults.tipoComprobanteFiscal)
      setValue('enableITBISLimit', defaults.diasMaximosDevolucionITBIS !== null)
      setValue(
        'diasMaximosDevolucionITBIS',
        defaults.diasMaximosDevolucionITBIS,
      )
    }
  }

  const onSubmit = async (data: ConfigFormData) => {
    setIsSubmitting(true)

    try {
      const requestData:
        | CreateConfiguracionRequest
        | UpdateConfiguracionRequest = {
        codigoPais: data.codigoPais,
        codigoMoneda: data.codigoMoneda,
        zonaHoraria: data.zonaHoraria,
        codigoIdioma: data.codigoIdioma,
        formatoFecha: data.formatoFecha,
        separadorDecimal: data.separadorDecimal,
        separadorMiles: data.separadorMiles,
        tipoComprobanteFiscal: data.tipoComprobanteFiscal,
        diasMaximosDevolucionITBIS: data.enableITBISLimit
          ? data.diasMaximosDevolucionITBIS
          : null,
      }

      if (hasConfiguration && config) {
        await dispatch(
          updateConfiguracion({ id: config.id, request: requestData }),
        ).unwrap()
        toast.success('Configuración actualizada exitosamente')
      } else {
        await dispatch(
          createConfiguracion(requestData as CreateConfiguracionRequest),
        ).unwrap()
        toast.success('Configuración creada exitosamente')
      }
    } catch (error: any) {
      toast.error(error || 'Error al guardar la configuración')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ** Format number preview
  const formatNumberPreview = () => {
    const num = 1234567.89
    const parts = num.toFixed(2).split('.')
    const integerPart = parts[0].replace(
      /\B(?=(\d{3})+(?!\d))/g,
      separadorMiles,
    )
    return `${integerPart}${separadorDecimal}${parts[1]}`
  }

  // ** Loading State
  if (loading && !config) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={<Skeleton width={200} />} />
            <CardContent>
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Skeleton height={56} />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Configuración de Empresa"
              subheader="Configure los parámetros operacionales de su negocio"
            />
            <Divider />
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent>
                <Grid container spacing={5}>
                  {/* Country & Regional Settings */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      <Icon
                        icon="mdi:earth"
                        fontSize="1.5rem"
                        style={{ verticalAlign: 'middle', marginRight: 8 }}
                      />
                      Configuración Regional
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="codigoPais"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.codigoPais}>
                          <InputLabel>País *</InputLabel>
                          <Select
                            {...field}
                            label="País *"
                            onChange={(e) =>
                              handleCountryChange(e.target.value)
                            }
                          >
                            {COUNTRIES.map((country) => (
                              <MenuItem key={country.code} value={country.code}>
                                {country.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.codigoPais && (
                            <FormHelperText>
                              {errors.codigoPais.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="codigoMoneda"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.codigoMoneda}>
                          <InputLabel>Moneda *</InputLabel>
                          <Select {...field} label="Moneda *">
                            {CURRENCIES.map((currency) => (
                              <MenuItem
                                key={currency.code}
                                value={currency.code}
                              >
                                {currency.symbol} - {currency.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.codigoMoneda && (
                            <FormHelperText>
                              {errors.codigoMoneda.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="zonaHoraria"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.zonaHoraria}>
                          <InputLabel>Zona Horaria *</InputLabel>
                          <Select {...field} label="Zona Horaria *">
                            {TIMEZONES.map((tz) => (
                              <MenuItem key={tz.value} value={tz.value}>
                                {tz.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.zonaHoraria && (
                            <FormHelperText>
                              {errors.zonaHoraria.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="codigoIdioma"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Idioma *"
                          error={!!errors.codigoIdioma}
                          helperText={errors.codigoIdioma?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  {/* Fiscal Configuration */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      <Icon
                        icon="mdi:file-document"
                        fontSize="1.5rem"
                        style={{ verticalAlign: 'middle', marginRight: 8 }}
                      />
                      Configuración Fiscal
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="tipoComprobanteFiscal"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          component="fieldset"
                          error={!!errors.tipoComprobanteFiscal}
                        >
                          <FormLabel component="legend">
                            Tipo de Comprobante Fiscal *
                          </FormLabel>
                          <RadioGroup
                            {...field}
                            value={field.value.toString()}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
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
                          {errors.tipoComprobanteFiscal && (
                            <FormHelperText>
                              {errors.tipoComprobanteFiscal.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />

                    {selectedCountry === 'DO' && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        Los negocios en República Dominicana deben seleccionar
                        NCF o ECF para cumplir con la DGII
                      </Alert>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  {/* Return Policy */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      <Icon
                        icon="mdi:keyboard-return"
                        fontSize="1.5rem"
                        style={{ verticalAlign: 'middle', marginRight: 8 }}
                      />
                      Política de Devoluciones
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="enableITBISLimit"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox {...field} checked={field.value} />
                          }
                          label={`Habilitar límite de tiempo para reembolso de ${
                            selectedCountry === 'DO'
                              ? 'ITBIS'
                              : selectedCountry === 'MX'
                              ? 'IVA'
                              : 'impuestos'
                          }`}
                        />
                      )}
                    />
                  </Grid>

                  {enableITBISLimit && (
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="diasMaximosDevolucionITBIS"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            label={`Días permitidos para reembolso de ${
                              selectedCountry === 'DO'
                                ? 'ITBIS'
                                : selectedCountry === 'MX'
                                ? 'IVA'
                                : 'impuestos'
                            }`}
                            error={!!errors.diasMaximosDevolucionITBIS}
                            helperText={
                              errors.diasMaximosDevolucionITBIS?.message ||
                              'Las devoluciones después de este período no incluirán reembolso de impuestos'
                            }
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
                      />
                    </Grid>
                  )}

                  {!enableITBISLimit && (
                    <Grid item xs={12}>
                      <Alert severity="info">
                        Sin límite de tiempo - Los reembolsos de impuestos se
                        permitirán en cualquier momento
                      </Alert>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  {/* Format Preferences */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      <Icon
                        icon="mdi:format-text"
                        fontSize="1.5rem"
                        style={{ verticalAlign: 'middle', marginRight: 8 }}
                      />
                      Preferencias de Formato
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="formatoFecha"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.formatoFecha}>
                          <InputLabel>Formato de Fecha *</InputLabel>
                          <Select {...field} label="Formato de Fecha *">
                            <MenuItem value="dd/MM/yyyy">dd/MM/yyyy</MenuItem>
                            <MenuItem value="MM/dd/yyyy">MM/dd/yyyy</MenuItem>
                            <MenuItem value="yyyy-MM-dd">yyyy-MM-dd</MenuItem>
                          </Select>
                          {errors.formatoFecha && (
                            <FormHelperText>
                              {errors.formatoFecha.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="separadorDecimal"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          error={!!errors.separadorDecimal}
                        >
                          <InputLabel>Separador Decimal *</InputLabel>
                          <Select {...field} label="Separador Decimal *">
                            <MenuItem value=".">Punto (.)</MenuItem>
                            <MenuItem value=",">Coma (,)</MenuItem>
                          </Select>
                          {errors.separadorDecimal && (
                            <FormHelperText>
                              {errors.separadorDecimal.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="separadorMiles"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.separadorMiles}>
                          <InputLabel>Separador de Miles *</InputLabel>
                          <Select {...field} label="Separador de Miles *">
                            <MenuItem value=",">Coma (,)</MenuItem>
                            <MenuItem value=".">Punto (.)</MenuItem>
                          </Select>
                          {errors.separadorMiles && (
                            <FormHelperText>
                              {errors.separadorMiles.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'background.default',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Vista Previa de Número:{' '}
                        <Typography
                          component="span"
                          variant="body1"
                          fontWeight={600}
                        >
                          {formatNumberPreview()}
                        </Typography>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end',
                    flexDirection: isMobile ? 'column' : 'row',
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    startIcon={
                      isSubmitting ? (
                        <Icon icon="mdi:loading" className="spin" />
                      ) : (
                        <Icon icon="mdi:content-save" />
                      )
                    }
                    fullWidth={isMobile}
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar Configuración'}
                  </Button>
                </Box>
              </CardContent>
            </form>
          </Card>
        </Grid>
      </Grid>

      {/* Country Change Confirmation Dialog */}
      <Dialog
        open={countryChangeDialogOpen}
        onClose={() => setCountryChangeDialogOpen(false)}
      >
        <DialogTitle>
          <Icon icon="mdi:alert" fontSize="1.5rem" color="warning.main" />{' '}
          Confirmar Cambio de País
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Cambiar el país actualizará automáticamente la configuración
            regional incluyendo moneda, zona horaria e idioma.
            <br />
            <br />
            ¿Está seguro que desea continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCountryChangeDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={confirmCountryChange}
            variant="contained"
            color="primary"
          >
            Sí, Cambiar País
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ConfiguracionEmpresaView
