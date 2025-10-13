'use client'

// MUI Imports
import { RootState } from '@/store'
import LoadingWrapper from '@/views/ui/LoadingWrapper'
import CustomAutocomplete from '@/views/ui/customAutocomplete'
import { CustomerTypeAutocomplete } from '@/views/ui/customerTypeAutocomplete'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { useCodeGenerator } from 'src/hooks/useCodeGenerator'

const ClientInformation = ({ id }: { id: string }) => {
  const { control, watch, setValue } = useFormContext()
  const store = useSelector((state: RootState) => state.clients)
  const { generateCustomer } = useCodeGenerator()

  const isNewCustomer = id === 'new'

  const ncfsOpts = useMemo(() => {
    return store.customerDetail?.ncfs?.map((unit) => ({
      label: unit.descripcion,
      value: unit.tipoCliente,
    }))
  }, [store])

  const cityOpts = useMemo(() => {
    return store.customerDetail.cities.map((unit) => ({
      label: unit,
      value: unit,
    }))
  }, [store])

  const statesOpts = useMemo(() => {
    return store.customerDetail.states.map((unit) => ({
      label: unit,
      value: unit,
    }))
  }, [store])

  const countriesOpts = useMemo(() => {
    return store.customerDetail.countries.map((unit) => ({
      label: unit,
      value: unit,
    }))
  }, [store])

  return (
    <>
      <Card>
        <CardHeader title="Información del Cliente" />
        <CardContent>
          <LoadingWrapper isLoading={store.isLoading}>
            <Grid container spacing={5} className="mbe-5">
              <Grid item xs={12} sm={2}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <Controller
                    name="codigo"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Código"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                  {isNewCustomer && (
                    <IconButton
                      onClick={() => {
                        const customerName = watch('nombre')
                        const generatedCode = generateCustomer(customerName, {
                          prefix: 'CLI',
                          length: 6,
                          includeDate: true,
                          includeSequence: true,
                          separator: '-',
                        })
                        setValue('codigo', generatedCode)
                      }}
                      size="small"
                      color="primary"
                      sx={{
                        mt: 0.5,
                        minWidth: 40,
                        minHeight: 40,
                      }}
                      title="Generar código automáticamente"
                    >
                      <Icon icon="mdi:refresh" />
                    </IconButton>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={10}>
                <Controller
                  name="nombre"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Nombre del cliente"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="rnc"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Impuesto/RNC"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="tipoCliente"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <CustomerTypeAutocomplete
                        selectedCustomerType={field.value}
                        callBack={(value) => field.onChange(value)}
                        size="medium"
                        multiple={false}
                        sx={{ width: '100%' }}
                      />
                      {error && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ ml: 2, mt: 0.5 }}
                        >
                          {error.message}
                        </Typography>
                      )}
                    </Box>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="telefono1"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Teléfono"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Correo Electrónico"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="contacto"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Persona de contacto"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="contactoWhatsApp"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="WhatsApp"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Controller
                  name="notas"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Notas del cliente"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider>Localización</Divider>
              </Grid>

              <Grid item xs={12} sm={12}>
                <Controller
                  name="direccion"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Dirección"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6} sm={4}>
                <CustomAutocomplete
                  name="ciudad"
                  control={control}
                  options={cityOpts}
                  label="Ciudad"
                  freeSolo
                />
              </Grid>

              <Grid item xs={6} sm={4}>
                <CustomAutocomplete
                  name="estado"
                  control={control}
                  options={statesOpts}
                  label="Estado/Sector"
                  freeSolo
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <Controller
                  name="codigoPostal"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Código Postal"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <CustomAutocomplete
                  name="pais"
                  control={control}
                  options={countriesOpts}
                  label="País"
                  freeSolo
                />
              </Grid>
            </Grid>
          </LoadingWrapper>
        </CardContent>
      </Card>
    </>
  )
}
export default ClientInformation
