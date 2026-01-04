import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import React from 'react'
import { Control, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { NewDetailForm } from '../types'

interface DetailFormProps {
  control: Control<any>
  cantidadInputRef: React.RefObject<HTMLInputElement>
  newDetailForm: NewDetailForm
  setNewDetailForm: (
    form: NewDetailForm | ((prev: NewDetailForm) => NewDetailForm),
  ) => void
  isEditingDetail: number | null
  onProductSearch: () => void
  onSaveDetail: () => void
  onCancelEdit: () => void
}

export const DetailForm: React.FC<DetailFormProps> = ({
  control,
  cantidadInputRef,
  newDetailForm,
  setNewDetailForm,
  isEditingDetail,
  onProductSearch,
  onSaveDetail,
  onCancelEdit,
}) => {
  // Helper function to handle setNewDetailForm safely
  const handleSetNewDetailForm = (
    updater: (prev: NewDetailForm) => NewDetailForm,
  ) => {
    if (typeof setNewDetailForm === 'function') {
      setNewDetailForm(updater)
    }
  }
  return (
    <Grid item xs={12}>
      <Card data-section="detail-form">
        <CardHeader
          title={
            isEditingDetail !== null
              ? 'Editar Línea de Detalle'
              : 'Agregar Línea de Detalle'
          }
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={isEditingDetail !== null ? 5 : 6}>
              <Controller
                name="codigoProducto"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    onClick={onProductSearch}
                    label="Código Producto"
                    placeholder="Código del producto"
                    error={!!error}
                    disabled={field.value && field.value.length > 0}
                    helperText={error?.message}
                    sx={{
                      '& .MuiInputBase-root': {
                        fontSize: '0.875rem',
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          size="small"
                          onClick={onProductSearch}
                          title="Buscar producto"
                          sx={{ mr: 1 }}
                        >
                          <Icon icon="mdi:magnify" fontSize="1.25rem" />
                        </IconButton>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4} sm={1}>
              <Controller
                name="cantidad"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    inputRef={cantidadInputRef}
                    fullWidth
                    size="small"
                    type="number"
                    label="Cantidad"
                    placeholder="1"
                    error={!!error}
                    helperText={error?.message}
                    inputProps={{ min: 1 }}
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        cantidadInputRef.current?.select()
                      }
                    }}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 1
                      field.onChange(newValue)
                      handleSetNewDetailForm((prev) => ({
                        ...prev,
                        cantidad: newValue,
                      }))
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4} sm={2}>
              <Controller
                name="precio"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    type="number"
                    label="Precio"
                    placeholder="0.00"
                    error={!!error}
                    helperText={error?.message}
                    inputProps={{ min: 0, step: 1 }}
                    autoComplete="off"
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value) || 0
                      field.onChange(newValue)
                      handleSetNewDetailForm((prev) => ({
                        ...prev,
                        precio: newValue,
                      }))
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4} sm={1.5}>
              <Controller
                name="porcientoDescuento"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    type="number"
                    label="Descuento (%)"
                    placeholder="0.00"
                    error={!!error}
                    helperText={error?.message}
                    inputProps={{ min: 0, step: 1, max: 100 }}
                    autoComplete="off"
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value) || 0
                      field.onChange(newValue)
                      handleSetNewDetailForm((prev) => ({
                        ...prev,
                        porcientoDescuento: newValue,
                      }))
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={isEditingDetail !== null ? 3 : 1.5}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                disabled={!newDetailForm.codigoProducto.trim()}
                startIcon={
                  <Icon
                    icon={isEditingDetail !== null ? 'mdi:check' : 'mdi:plus'}
                  />
                }
                onClick={onSaveDetail}
              >
                {isEditingDetail !== null ? 'Actualizar' : 'Agregar'}
              </Button>
              {isEditingDetail !== null && (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<Icon icon="mdi:close" />}
                  sx={{ ml: 2 }}
                  onClick={onCancelEdit}
                >
                  Cancelar
                </Button>
              )}
            </Grid>

            {/* Description Display - Read Only */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 1.5,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? 'grey.50'
                      : 'background.default',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: (theme) =>
                    theme.palette.mode === 'light' ? 'grey.300' : 'divider',
                }}
              >
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mb: 0.5, display: 'block' }}
                >
                  Descripción del Producto
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.85rem',
                    minHeight: '1.2rem',
                    fontWeight: '500',
                  }}
                >
                  {newDetailForm.descripcion || 'Seleccione un producto'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}
