// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

// Component Imports

import { Autocomplete, Grid, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { useMemo } from 'react'
import CustomAutocomplete from '@/views/ui/customAutocomplete'

const ProductPricing = () => {
  const { register, control } = useFormContext()

  const store = useSelector((state: RootState) => state.products)

  const taxesTypeOptions = useMemo(() => {
    return store.taxes.map((unit) => ({
      label: unit,
      value: unit,
    }))
  }, [store])

  return (
    <Card>
      <CardHeader title="Precios" />
      <CardContent>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="precio1"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Precio General"
                  placeholder="$0"
                  type="number"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="precio2"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Precio 2"
                  placeholder="$0"
                  type="number"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="precio3"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Precio 3"
                  placeholder="$0"
                  type="number"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="precio4"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Precio 4"
                  placeholder="$0"
                  type="number"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="precio5"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Precio 5"
                  placeholder="$0"
                  type="number"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="costo"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Costo"
                  placeholder="$0"
                  type="number"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider>Impuestos</Divider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="impuesto"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Impuesto"
                  placeholder="$0"
                  type="number"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              name="tipoImpuesto"
              control={control}
              options={taxesTypeOptions}
              label={'Tipo de Impuesto'}
              freeSolo
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ProductPricing
