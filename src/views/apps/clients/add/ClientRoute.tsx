'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'

// Component Imports
import { Controller, useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

const ProductOrganize = () => {
  const { control } = useFormContext()
  const store = useSelector((state: RootState) => state.products)

  const weekDays = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 7, label: 'Domingo' },
  ]

  const frequency = [
    { value: 1, label: 'Quinsenal' },
    { value: 2, label: 'Mensual' },
  ]

  return (
    <Card>
      <CardHeader title="Rutas de ventas" />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <Controller
              name="dia"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl fullWidth error={!!error}>
                  <InputLabel id="dias-label">Días de visita</InputLabel>
                  <Select
                    labelId="dias-label"
                    value={value || ''}
                    onChange={onChange}
                    label="Días de visita"
                  >
                    {weekDays.map((day) => (
                      <MenuItem key={day.label} value={day.value}>
                        {day.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="frecuencia"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl fullWidth error={!!error}>
                  <InputLabel id="dias-label">Frecuencia de Visita</InputLabel>
                  <Select
                    labelId="dias-label"
                    value={value || ''}
                    onChange={onChange}
                    label="Frecuencia de Visita"
                  >
                    {frequency.map((day) => (
                      <MenuItem key={day.label} value={day.value}>
                        {day.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="secuencia"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="Secuencia de visita"
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

export default ProductOrganize
