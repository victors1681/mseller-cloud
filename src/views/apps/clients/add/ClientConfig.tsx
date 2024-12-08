// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'

// Component Imports

import {
  Autocomplete,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { useEffect, useMemo } from 'react'
import { fetchSellers } from '@/store/apps/seller'
import { fetchLocations } from '@/store/apps/location'
import { fetchPaymentType } from '@/store/apps/paymentType'
import InputLabelTooltip from '@/views/ui/inputLabelTooltip'
import CustomAutocomplete from '@/views/ui/customAutocomplete'

const ProductPricing = () => {
  const { register, control } = useFormContext()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.clients)
  const sellerStore = useSelector((state: RootState) => state.sellers)
  const locationStore = useSelector((state: RootState) => state.locations)
  const paymentTypeStore = useSelector((state: RootState) => state.paymentTypes)

  useEffect(() => {
    if (sellerStore.data.length === 0) {
      dispatch(fetchSellers())
    }
    if (locationStore.data.length === 0) {
      dispatch(fetchLocations())
    }

    if (paymentTypeStore.data.length === 0) {
      dispatch(fetchPaymentType())
    }
  }, [])

  const sellersOptions = useMemo(() => {
    return sellerStore.data.map((unit) => ({
      label: unit.nombre,
      value: unit.codigo,
    }))
  }, [sellerStore])

  const locationOptions = useMemo(() => {
    return locationStore.data.map((unit) => ({
      label: unit.descripcion,
      value: unit.id,
    }))
  }, [locationStore])

  const paymentTypesOptions = useMemo(() => {
    return paymentTypeStore.data.map((unit) => ({
      label: unit.descripcion,
      value: unit.condicionPago,
    }))
  }, [store])

  const classificationsOpts = useMemo(() => {
    return store.customerDetail.classifications.map((unit) => ({
      label: unit,
      value: unit,
    }))
  }, [store])

  return (
    <Card>
      <CardHeader title="Configuraciones" />
      <CardContent>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12}>
            <CustomAutocomplete
              name="codigoVendedor"
              control={control}
              options={sellersOptions}
              label="Vendedor"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomAutocomplete
              name="localidadId"
              control={control}
              options={locationOptions}
              label="Localidad del cliente"
              placeholder="Almacen 1 - Localidad 1"
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <CustomAutocomplete
              name="condicion"
              control={control}
              options={paymentTypesOptions}
              label={
                <InputLabelTooltip
                  title="Condicion de Pago"
                  description="Si está activado, el sistema bloqueará automáticamente las ventas o toma de pedidos al cliente cuando tenga facturas vencidas"
                />
              }
              placeholder="Almacen 1 - Localidad 1"
            />
          </Grid>
          <Grid item xs={12}>
            <Divider>Informaciones adicionales</Divider>
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomAutocomplete
              name="clasificacion"
              control={control}
              options={classificationsOpts}
              label="Clasicicación"
              placeholder="Farmacia, Supermercado, etc"
              freeSolo
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name="condicionPrecio"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl fullWidth error={!!error}>
                  <InputLabel id="precio-label">Condición de precio</InputLabel>
                  <Select
                    labelId="precio-label"
                    value={value || ''}
                    onChange={onChange}
                    label="Precio por defecto"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <MenuItem key={num} value={num}>
                        {`Precio ${num}`}
                      </MenuItem>
                    ))}
                  </Select>
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider>Descuentos</Divider>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name="descuento"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="% Descuento General"
                  placeholder="%"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name="descuentoProntoPago"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="% Descuento Pronto Pago"
                  placeholder="%"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider>Datos Financieros</Divider>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name="limiteCredito"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Límite de Crédito"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name="balance"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Balance Actual"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ProductPricing
