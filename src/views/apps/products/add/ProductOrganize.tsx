'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import TextField from '@mui/material/TextField'

// Component Imports
import { RootState } from '@/store'
import CustomAutocomplete from '@/views/ui/customAutocomplete'
import { Alert, Grid, useMediaQuery, useTheme } from '@mui/material'
import { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'

const options = [{ label: 'UN', value: 'UN' }]

const ProductOrganize = () => {
  const { control, watch } = useFormContext()
  const store = useSelector((state: RootState) => state.products)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Watch esServicio field
  const esServicio = watch('esServicio')

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
      <CardHeader
        title="Organización"
        titleTypographyProps={{
          variant: isMobile ? 'h6' : 'h5',
        }}
      />
      <CardContent>
        {esServicio ? (
          <Alert
            severity="info"
            icon={<Icon icon="mdi:information" />}
            sx={{
              '& .MuiAlert-message': {
                fontSize: isMobile ? '0.875rem' : '1rem',
              },
            }}
          >
            Los servicios no requieren organización por áreas o departamentos
          </Alert>
        ) : (
          <Grid container spacing={isMobile ? 2 : 3}>
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
                    size={isMobile ? 'medium' : 'medium'}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: isMobile ? '0.875rem' : '1rem',
                      },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}

export default ProductOrganize
