'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'

// Component Imports
import { Controller, useForm, useFormContext } from 'react-hook-form'
import { Autocomplete, Grid } from '@mui/material'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import CustomAutocomplete from '@/views/ui/customAutocomplete'

const options = [{ label: 'UN', value: 'UN' }]

const ProductOrganize = () => {
  const { control } = useFormContext()
  const store = useSelector((state: RootState) => state.products)

  const areasTypeOptions = useMemo(() => {
    return store.areas.map((unit) => ({
      label: unit,
      value: unit,
    }))
  }, [store])

  const departmentTypeOptions = useMemo(() => {
    return store.departments.map((unit) => ({
      label: unit,
      value: unit,
    }))
  }, [store])

  return (
    <Card>
      <CardHeader title="Organización" />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomAutocomplete
              name="area"
              control={control}
              options={areasTypeOptions}
              label={'Área'}
              freeSolo
            />
          </Grid>
          <Grid item xs={12}>
            <CustomAutocomplete
              name="departamento"
              control={control}
              options={departmentTypeOptions}
              label={'Departamento'}
              freeSolo
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="grupoId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Grupo"
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
