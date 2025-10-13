'use client'

// MUI Imports
import InputLabelTooltip from '@/views/ui/inputLabelTooltip'
import { FormControlLabel, Grid, Switch } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { Controller, useFormContext } from 'react-hook-form'

const ClientSettings = () => {
  const { control } = useFormContext()

  return (
    <Card>
      <CardHeader title="Más opciones" />
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12}>
            <Controller
              name="impuesto"
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
                  label={
                    <InputLabelTooltip
                      title="Impuesto"
                      description="Desactive esta opción si el cliente está exento de impuesto"
                    />
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="confirmado"
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
                  label="Confirmado (optional)"
                />
              )}
            />
          </Grid>
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
              name="bloqueoPorVencimiento"
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
                  label={
                    <InputLabelTooltip
                      title="Bloqueo por Vencimiento de factura"
                      description="Si está activado, el sistema bloqueará automáticamente las ventas o toma de pedidos al cliente cuando tenga facturas vencidas"
                    />
                  }
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ClientSettings
