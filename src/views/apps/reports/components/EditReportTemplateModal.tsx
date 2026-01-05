// ** React Imports
import { FC, useEffect, useState } from 'react'

// ** MUI Imports
import {
  Alert,
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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useAppDispatch, useAppSelector } from 'src/store'
import { updateReportTemplate } from 'src/store/apps/reports'

// ** Type Imports
import {
  PlantillaReporte, 
  TipoDocumentoNumerico, 
  TipoPlantilla,
  UpdateReportTemplateRequest,
} from 'src/types/apps/reportsTypes'

interface Props {
  open: boolean
  template: PlantillaReporte
  onClose: () => void
  onSuccess: () => void
}

const EditReportTemplateModal: FC<Props> = ({
  open,
  template,
  onClose,
  onSuccess,
}) => {
  // ** Hooks
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const dispatch = useAppDispatch()

  // ** Redux State
  const { isProcessing } = useAppSelector((state) => state.reports)

  // ** State
  const [formData, setFormData] = useState<UpdateReportTemplateRequest>({
    id: template.id,
    nombre: template.nombre,
    descripcion: template.descripcion || '',
    tipoDocumento: template.tipoDocumento,
    tipoPlantilla: template.tipoPlantilla,
    contenidoScriban: template.contenidoScriban,
    idioma: template.idioma,
    version: template.version,
    habilitado: template.habilitado,
    esPlantillaPorDefecto: template.esPlantillaPorDefecto,
    isGlobal: template.isGlobal,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // ** Update form when template changes
  useEffect(() => {
    if (template) {
      setFormData({
        id: template.id,
        nombre: template.nombre,
        descripcion: template.descripcion || '',
        tipoDocumento: template.tipoDocumento,
        tipoPlantilla: template.tipoPlantilla,
        contenidoScriban: template.contenidoScriban,
        idioma: template.idioma,
        version: template.version,
        habilitado: template.habilitado,
        esPlantillaPorDefecto: template.esPlantillaPorDefecto,
        isGlobal: template.isGlobal,
      })
    }
  }, [template])

  // ** Handle Change
  const handleChange = (
    field: keyof UpdateReportTemplateRequest,
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

    if (!formData.idioma.trim()) {
      newErrors.idioma = 'El idioma es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ** Handle Submit
  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const payload: UpdateReportTemplateRequest = {
        id: formData.id,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        tipoDocumento: formData.tipoDocumento,
        tipoPlantilla: formData.tipoPlantilla,
        contenidoScriban: formData.contenidoScriban,
        idioma: formData.idioma,
        version: formData.version,
        habilitado: formData.habilitado,
        esPlantillaPorDefecto: formData.esPlantillaPorDefecto,
        isGlobal: formData.isGlobal,
      }

      await dispatch(updateReportTemplate(payload)).unwrap()
      handleClose()
      onSuccess()
    } catch (error) {
      console.error('Error updating report template:', error)
    }
  }

  // ** Handle Close
  const handleClose = () => {
    setErrors({})
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>Editar Plantilla de Documento</DialogTitle>
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
                rows={2}
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
              >
                <MenuItem value={TipoDocumentoNumerico.Factura}>Factura</MenuItem>
                <MenuItem value={TipoDocumentoNumerico.Cotizacion}>Cotización</MenuItem>
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
                placeholder="es, en, fr"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Estado"
                value={formData.habilitado}
                onChange={(e) =>
                  handleChange('habilitado', e.target.value === 'true')
                }
              >
                <MenuItem value="true">Habilitado</MenuItem>
                <MenuItem value="false">Deshabilitado</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Plantilla por Defecto"
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
                label="Alcance"
                value={formData.isGlobal}
                onChange={(e) =>
                  handleChange('isGlobal', e.target.value === 'true')
                }
              >
                <MenuItem value="true">Global</MenuItem>
                <MenuItem value="false">Local</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Alert
                severity="info"
                icon={<Icon icon="mdi:information-outline" />}
              >
                Para editar el contenido de la plantilla, utilice la vista de
                detalle completa. Este modal solo permite editar la
                configuración y metadatos.
              </Alert>
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
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditReportTemplateModal
