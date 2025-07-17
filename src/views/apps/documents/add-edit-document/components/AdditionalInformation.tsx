import React from 'react'
import { Controller, Control } from 'react-hook-form'
import { Grid, Card, CardHeader, CardContent, TextField } from '@mui/material'

interface AdditionalInformationProps {
  control: Control<any>
  isSubmitting: boolean
}

export const AdditionalInformation: React.FC<AdditionalInformationProps> = ({
  control,
  isSubmitting,
}) => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title="Información Adicional" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="nota"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    disabled={isSubmitting}
                    label="Notas"
                    placeholder="Ingrese notas adicionales..."
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}
