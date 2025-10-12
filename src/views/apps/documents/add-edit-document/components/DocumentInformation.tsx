import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import React from 'react'
import { Control, Controller } from 'react-hook-form'
import {
  TipoDocumentoEnum,
  tipoDocumentoSpanishNames,
} from 'src/types/apps/documentTypes'
import { LocationAutocomplete } from 'src/views/ui/locationAutoComplete'

interface DocumentInformationProps {
  control: Control<any>
  setValue: (name: string, value: any) => void
  isSubmitting: boolean
  isCreateMode?: boolean
}

export const DocumentInformation: React.FC<DocumentInformationProps> = ({
  control,
  isSubmitting,
  isCreateMode = false,
}) => {
  return (
    <Grid item xs={12} md={6}>
      <Card>
        <CardHeader title="Información del Documento" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="fecha"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    type="date"
                    disabled={isSubmitting}
                    label="Fecha"
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="tipoDocumento"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    error={!!error}
                    size="small"
                    disabled={isSubmitting || isCreateMode}
                  >
                    <InputLabel>Tipo de Documento</InputLabel>
                    <Select {...field} label="Tipo de Documento">
                      <MenuItem value={TipoDocumentoEnum.INVOICE}>
                        {tipoDocumentoSpanishNames[TipoDocumentoEnum.INVOICE]}
                      </MenuItem>
                      <MenuItem value={TipoDocumentoEnum.ORDER}>
                        {tipoDocumentoSpanishNames[TipoDocumentoEnum.ORDER]}
                      </MenuItem>
                      <MenuItem value={TipoDocumentoEnum.QUOTE}>
                        {tipoDocumentoSpanishNames[TipoDocumentoEnum.QUOTE]}
                      </MenuItem>
                    </Select>
                    {error && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 1, ml: 2 }}
                      >
                        {error.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="localidadId"
                control={control}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <>
                    <LocationAutocomplete
                      size="small"
                      selectedLocation={value?.toString() || ''}
                      sx={{ mt: 0, ml: 0 }}
                      callBack={(selectedLocationId: string) => {
                        if (!isSubmitting) {
                          onChange(parseInt(selectedLocationId) || 0)
                        }
                      }}
                    />
                    {error && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 1, ml: 2, display: 'block' }}
                      >
                        {error.message}
                      </Typography>
                    )}
                  </>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="confirmado"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                      />
                    }
                    label="Confirmado"
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
