'use client'

// MUI Imports
import { RootState } from '@/store'
import {
  FormControlLabel,
  Grid,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { Controller, useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'

const ProductSettings = () => {
  const { control, watch } = useFormContext()
  const store = useSelector((state: RootState) => state.products)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Watch esServicio field
  const esServicio = watch('esServicio')

  return (
    <Card>
      <CardHeader
        title="Configuración"
        titleTypographyProps={{
          variant: isMobile ? 'h6' : 'h5',
        }}
      />
      <CardContent>
        <Grid container spacing={isMobile ? 2 : 3}>
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
                      color="primary"
                    />
                  }
                  label={
                    <Typography
                      variant={isMobile ? 'body2' : 'body1'}
                      sx={{ fontWeight: 500 }}
                    >
                      Status (Activo/Inactivo)
                    </Typography>
                  }
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
                      color="primary"
                    />
                  }
                  label={
                    <Typography
                      variant={isMobile ? 'body2' : 'body1'}
                      sx={{ fontWeight: 500 }}
                    >
                      Visible en Tienda
                    </Typography>
                  }
                />
              )}
            />
          </Grid>
          {!esServicio && (
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
                        color="primary"
                      />
                    }
                    label={
                      <Typography
                        variant={isMobile ? 'body2' : 'body1'}
                        sx={{ fontWeight: 500 }}
                      >
                        En Promoción
                      </Typography>
                    }
                  />
                )}
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ProductSettings
