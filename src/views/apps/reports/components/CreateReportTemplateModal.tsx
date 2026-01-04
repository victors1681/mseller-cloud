// ** React Imports
import { FC, useState } from 'react'

// ** MUI Imports
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material'

// ** Store Imports
import { useAppDispatch, useAppSelector } from 'src/store'
import { createReportTemplate } from 'src/store/apps/reports'

// ** Type Imports
import {
  CreateReportTemplateRequest,
  TipoDocumentoNumerico,
  TipoPlantilla,
} from 'src/types/apps/reportsTypes'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

const CreateReportTemplateModal: FC<Props> = ({ open, onClose, onSuccess }) => {
  // ** Hooks
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const dispatch = useAppDispatch()

  // ** Redux State
  const { isProcessing } = useAppSelector((state) => state.reports)

  // ** State
  const [formData, setFormData] = useState<CreateReportTemplateRequest>({
    nombre: '',
    descripcion: '',
    tipoDocumento: TipoDocumentoNumerico.Pedido,
    tipoPlantilla: TipoPlantilla.Print,
    contenidoScriban: '',
    idioma: 'es',
    habilitado: true,
    esPlantillaPorDefecto: false,
    isGlobal: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // ** Handle Change
  const handleChange = (
    field: keyof CreateReportTemplateRequest,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // ** Validate Form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!formData.tipoDocumento && formData.tipoDocumento !== 0) {
      newErrors.tipoDocumento = 'El tipo de documento es requerido'
    }

    if (!formData.tipoPlantilla) {
      newErrors.tipoPlantilla = 'El tipo de plantilla es requerido'
    }

    if (!formData.idioma.trim()) {
      newErrors.idioma = 'El idioma es requerido'
    }

    if (!formData.contenidoScriban.trim()) {
      newErrors.contenidoScriban = 'El contenido de la plantilla es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ** Handle Submit
  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      await dispatch(createReportTemplate(formData)).unwrap()
      handleClose()
      onSuccess()
    } catch (error) {
      console.error('Error creating report template:', error)
    }
  }

  // ** Handle Close
  const handleClose = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      tipoDocumento: TipoDocumentoNumerico.Pedido,
      tipoPlantilla: TipoPlantilla.Print,
      contenidoScriban: '',
      idioma: 'es',
      habilitado: true,
      esPlantillaPorDefecto: false,
      isGlobal: false,
    })
    setErrors({})
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Crear Nueva Plantilla de Reporte</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                required
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={3}
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Tipo de Documento"
                required
                value={formData.tipoDocumento}
                onChange={(e) =>
                  handleChange('tipoDocumento', Number(e.target.value))
                }
                error={!!errors.tipoDocumento}
                helperText={errors.tipoDocumento}
              >
                <MenuItem value={TipoDocumentoNumerico.Factura}>
                  Factura
                </MenuItem>
                <MenuItem value={TipoDocumentoNumerico.Cotizacion}>
                  Cotización
                </MenuItem>
                <MenuItem value={TipoDocumentoNumerico.Pedido}>Pedido</MenuItem>
                <MenuItem value={TipoDocumentoNumerico.NotaCredito}>
                  Nota de Crédito
                </MenuItem>
                <MenuItem value={TipoDocumentoNumerico.NotaDebito}>
                  Nota de Débito
                </MenuItem>
                <MenuItem value={TipoDocumentoNumerico.Recibo}>Recibo</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Tipo de Plantilla"
                required
                value={formData.tipoPlantilla}
                onChange={(e) =>
                  handleChange('tipoPlantilla', Number(e.target.value))
                }
                error={!!errors.tipoPlantilla}
                helperText={errors.tipoPlantilla}
              >
                <MenuItem value={TipoPlantilla.Print}>Impresión</MenuItem>
                <MenuItem value={TipoPlantilla.Email}>Email</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Idioma"
                required
                value={formData.idioma}
                onChange={(e) => handleChange('idioma', e.target.value)}
                error={!!errors.idioma}
                helperText={errors.idioma}
                placeholder="es, en"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Habilitado"
                value={formData.habilitado}
                onChange={(e) =>
                  handleChange('habilitado', e.target.value === 'true')
                }
              >
                <MenuItem value="true">Sí</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Por Defecto"
                value={formData.esPlantillaPorDefecto}
                onChange={(e) =>
                  handleChange(
                    'esPlantillaPorDefecto',
                    e.target.value === 'true',
                  )
                }
              >
                <MenuItem value="true">Sí</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Global (Todas las empresas)"
                value={formData.isGlobal}
                onChange={(e) =>
                  handleChange('isGlobal', e.target.value === 'true')
                }
              >
                <MenuItem value="true">Sí</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contenido de Plantilla (Scriban/HTML)"
                multiline
                rows={10}
                required
                value={formData.contenidoScriban}
                onChange={(e) =>
                  handleChange('contenidoScriban', e.target.value)
                }
                error={!!errors.contenidoScriban}
                helperText={
                  errors.contenidoScriban || 'Plantilla Scriban con HTML'
                }
                placeholder="<!DOCTYPE html><html>...</html>"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={isProcessing}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isProcessing}
        >
          Crear Plantilla
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateReportTemplateModal
