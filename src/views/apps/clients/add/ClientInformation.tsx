'use client'

// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Autocomplete } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import LoadingWrapper from '@/views/ui/LoadingWrapper'
import InputLabelTooltip from '@/views/ui/inputLabelTooltip'
import CustomAutocomplete from '@/views/ui/customAutocomplete'

const ClientInformation = () => {
  const { control } = useFormContext()
  const store = useSelector((state: RootState) => state.clients)

  // const customerTypeOpts = useMemo(() => {
  //   return store.customerDetail.customerType.map((unit) => ({
  //     label: unit,
  //     value: unit,
  //   }))
  // }, [store])

  // const classificationsOpts = useMemo(() => {
  //   return store.customerDetail.classifications.map((unit) => ({
  //     label: unit,
  //     value: unit,
  //   }))
  // }, [store])

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
                <CustomAutocomplete
                  name="tipoCliente"
                  control={control}
                  options={ncfsOpts}
                  label={
                    <InputLabelTooltip
                      title="Tipo de cliente"
                      description="Este campo se utiliza para determinal el tipo de impuesto que corresponde con el cliente, Crédito Fiscal, Consumo, entre otros, debe configurarse en el mantenimiento de NCF para asignar el comprobante correspondiente"
                    />
                  }
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
