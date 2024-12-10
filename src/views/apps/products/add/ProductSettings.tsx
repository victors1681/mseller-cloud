'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { FormControlLabel, Grid, Switch } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

const ProductSettings = () => {
  const { control } = useFormContext()
  const store = useSelector((state: RootState) => state.products)

  return (
    <Card>
      <CardHeader title="Organización" />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="status"
              control={control}
              defaultValue="A"
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value === 'A'}
                      onChange={(e) => {
                        onChange(e.target.checked ? 'A' : 'I')
                      }}
                    />
                  }
                  label="Status (Activo/Inactivo)"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="visibleTienda"
              control={control}
              defaultValue={true}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  }
                  label="Visible en Tienda"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="promocion"
              control={control}
              defaultValue={false}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  }
                  label="En Promoción"
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ProductSettings
