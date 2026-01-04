// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** API Client
import restClient from 'src/configs/restClient'

// ** Store Imports
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  fetchReportTemplateById,
  generateReport,
  setSelectedTemplate,
  updateReportTemplate,
} from 'src/store/apps/reports'

// ** Type Imports
import {
  TipoDocumentoNumerico,
  TipoPlantilla,
  UpdateReportTemplateRequest,
} from 'src/types/apps/reportsTypes'

// ** Component Imports
import GenerateReportModal from './components/GenerateReportModal'
import TemplateEditorTabs from './components/TemplateEditorTabs'

interface Props {
  reportId: number
}

const ReportDetailView = ({ reportId }: Props) => {
  // ** Hooks
  const router = useRouter()
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  // ** State
  const [generateModalOpen, setGenerateModalOpen] = useState(false)
  const [configModalOpen, setConfigModalOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewHtml, setPreviewHtml] = useState<string>('')
  const [previewLoading, setPreviewLoading] = useState(false)
  const [formData, setFormData] = useState<UpdateReportTemplateRequest | null>(
    null,
  )
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // ** Redux State
  const { selectedTemplate, isLoading, isProcessing, error } = useAppSelector(
    (state) => state.reports,
  )

  // ** Effects
  useEffect(() => {
    if (reportId) {
      // Clear the selected template first to avoid showing stale data
      dispatch(setSelectedTemplate(null))
      // Reset local state
      setFormData(null)
      setHasUnsavedChanges(false)
      // Fetch the new template
      dispatch(fetchReportTemplateById(reportId))
    }
  }, [reportId, dispatch])

  // Initialize form data when template is loaded
  useEffect(() => {
    if (selectedTemplate && selectedTemplate.id === reportId && !formData) {
      setFormData({
        id: selectedTemplate.id,
        nombre: selectedTemplate.nombre,
        descripcion: selectedTemplate.descripcion || '',
        tipoDocumento: selectedTemplate.tipoDocumento,
        tipoPlantilla: selectedTemplate.tipoPlantilla || TipoPlantilla.Print,
        contenidoScriban: selectedTemplate.contenidoScriban,
        idioma: selectedTemplate.idioma,
        version: selectedTemplate.version,
        habilitado: selectedTemplate.habilitado,
        esPlantillaPorDefecto: selectedTemplate.esPlantillaPorDefecto,
        isGlobal: selectedTemplate.isGlobal,
      })
    }
  }, [selectedTemplate, formData])

  // ** Handle Generate Report
  const handleGenerateReport = async (parametros: Record<string, any>) => {
    try {
      await dispatch(
        generateReport({
          plantillaReporteId: reportId,
          parametros,
        }),
      ).unwrap()
      setGenerateModalOpen(false)
    } catch (error) {
      console.error('Error generating report:', error)
    }
  }

  // ** Handle Field Change
  const handleFieldChange = (
    field: keyof UpdateReportTemplateRequest,
    value: any,
  ) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value,
      })
      setHasUnsavedChanges(true)
    }
  }

  // ** Sanitize HTML entities for Scriban compatibility
  const sanitizeForScriban = (html: string): string => {
    if (!html) return html

    // Use browser's native HTML entity decoder - more elegant and handles all entities
    const textarea = document.createElement('textarea')
    textarea.innerHTML = html
    return textarea.value
  }

  // ** Handle Save
  const handleSave = async () => {
    if (!formData) return

    // Build payload - always include all fields that exist in formData
    const payload: UpdateReportTemplateRequest = {
      id: formData.id,
      nombre: formData.nombre,
      version: formData.version,
      descripcion: formData.descripcion || '',
      idioma: formData.idioma || 'es',
      habilitado: formData.habilitado ?? true,
      esPlantillaPorDefecto: formData.esPlantillaPorDefecto ?? false,
      isGlobal: formData.isGlobal ?? false,
      tipoDocumento: formData.tipoDocumento,
      tipoPlantilla: formData.tipoPlantilla,
      contenidoScriban: sanitizeForScriban(formData.contenidoScriban || ''),
    }

    try {
      console.log(
        'Saving template with payload:',
        JSON.stringify(payload, null, 2),
      )

      await dispatch(updateReportTemplate(payload)).unwrap()
      toast.success('Plantilla actualizada correctamente')
      setHasUnsavedChanges(false)
      dispatch(fetchReportTemplateById(reportId))
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al actualizar la plantilla'
      const errorDetails = error?.errors ? `\n${error.errors.join('\n')}` : ''
      toast.error(`${errorMessage}${errorDetails}`)
      console.error('Error updating template:', error, 'Payload was:', payload)
    }
  }

  // ** Handle Preview
  const handlePreview = async () => {
    setPreviewLoading(true)
    setPreviewModalOpen(true)
    setPreviewHtml('')

    try {
      const response = await restClient.get(
        `/api/portal/PlantillaReporte/${reportId}/preview`,
        {
          responseType: 'text',
          headers: {
            Accept: 'text/html',
          },
        },
      )
      setPreviewHtml(response.data)
    } catch (error) {
      toast.error('Error al cargar la vista previa')
      console.error('Error loading preview:', error)
      setPreviewModalOpen(false)
    } finally {
      setPreviewLoading(false)
    }
  }

  if (isLoading && !selectedTemplate) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    )
  }

  if (!selectedTemplate || !formData) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        Plantilla de reporte no encontrada
      </Alert>
    )
  }

  return (
    <>
      <Grid container spacing={3}>
        {/* Global Template Warning */}
        {selectedTemplate.isGlobal && (
          <Grid item xs={12}>
            <Alert severity="warning" icon={<Icon icon="mdi:earth" />}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                Plantilla Global
              </Typography>
              <Typography variant="body2">
                Esta plantilla es global y se utiliza para todos los usuarios en
                MSeller. Para personalizarla, necesitas duplicarla usando el
                botón "Duplicar".
              </Typography>
            </Alert>
          </Grid>
        )}

        {/* Header */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton onClick={() => router.back()}>
                    <Icon icon="mdi:arrow-left" />
                  </IconButton>
                  <Typography variant="h5">
                    Editando: {formData.nombre}
                  </Typography>
                  {hasUnsavedChanges && (
                    <Chip
                      label="Cambios sin guardar"
                      color="warning"
                      size="small"
                    />
                  )}
                </Box>
              }
              action={
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Icon icon="mdi:eye-outline" />}
                    onClick={handlePreview}
                    disabled={isProcessing || hasUnsavedChanges}
                  >
                    Vista Previa
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Icon icon="mdi:cog" />}
                    onClick={() => setConfigModalOpen(true)}
                  >
                    Configuración
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={
                      <Icon
                        icon={
                          selectedTemplate?.isGlobal
                            ? 'mdi:content-duplicate'
                            : 'mdi:content-save'
                        }
                      />
                    }
                    onClick={handleSave}
                    disabled={isProcessing || !hasUnsavedChanges}
                  >
                    {selectedTemplate?.isGlobal
                      ? 'Duplicar'
                      : 'Guardar Cambios'}
                  </Button>
                </Box>
              }
            />
          </Card>
        </Grid>

        {/* Editor - Full Width */}
        <Grid item xs={12}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <TemplateEditorTabs
                value={formData.contenidoScriban || ''}
                onChange={(html) => {
                  // Update contenidoScriban (HTML/CSS with Scriban syntax)
                  setFormData({
                    ...formData,
                    contenidoScriban: html,
                  })
                  setHasUnsavedChanges(true)
                }}
                onValidationError={(error) => {
                  toast.error(`Error de validación: ${error}`)
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Configuration Modal */}
      <Dialog
        open={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        fullScreen={fullScreen}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Configuración de Plantilla</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre"
                  required
                  value={formData.nombre}
                  onChange={(e) => handleFieldChange('nombre', e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  multiline
                  rows={2}
                  value={formData.descripcion}
                  onChange={(e) =>
                    handleFieldChange('descripcion', e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Tipo de Documento"
                  value={formData.tipoDocumento}
                  onChange={(e) =>
                    handleFieldChange('tipoDocumento', Number(e.target.value))
                  }
                >
                  <MenuItem value={TipoDocumentoNumerico.Factura}>
                    Factura
                  </MenuItem>
                  <MenuItem value={TipoDocumentoNumerico.Cotizacion}>
                    Cotización
                  </MenuItem>
                  <MenuItem value={TipoDocumentoNumerico.Pedido}>
                    Pedido
                  </MenuItem>
                  <MenuItem value={TipoDocumentoNumerico.NotaCredito}>
                    Nota de Crédito
                  </MenuItem>
                  <MenuItem value={TipoDocumentoNumerico.NotaDebito}>
                    Nota de Débito
                  </MenuItem>
                  <MenuItem value={TipoDocumentoNumerico.Recibo}>
                    Recibo
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Tipo de Plantilla"
                  value={formData.tipoPlantilla}
                  onChange={(e) =>
                    handleFieldChange('tipoPlantilla', Number(e.target.value))
                  }
                >
                  <MenuItem value={TipoPlantilla.Print}>Impresión</MenuItem>
                  <MenuItem value={TipoPlantilla.Email}>Email</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Idioma"
                  value={formData.idioma}
                  onChange={(e) => handleFieldChange('idioma', e.target.value)}
                  placeholder="es, en, fr"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Estado"
                  value={formData.habilitado ? 'true' : 'false'}
                  onChange={(e) =>
                    handleFieldChange('habilitado', e.target.value === 'true')
                  }
                >
                  <MenuItem value="true">Habilitado</MenuItem>
                  <MenuItem value="false">Deshabilitado</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Plantilla por Defecto"
                  value={formData.esPlantillaPorDefecto ? 'true' : 'false'}
                  onChange={(e) =>
                    handleFieldChange(
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
                  value={formData.isGlobal ? 'true' : 'false'}
                  onChange={(e) =>
                    handleFieldChange('isGlobal', e.target.value === 'true')
                  }
                >
                  <MenuItem value="true">Global</MenuItem>
                  <MenuItem value="false">Local</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setConfigModalOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Generate Report Modal */}
      <GenerateReportModal
        open={generateModalOpen}
        template={selectedTemplate}
        onClose={() => setGenerateModalOpen(false)}
        onGenerate={handleGenerateReport}
      />

      {/* Preview Modal */}
      <Dialog
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        maxWidth="lg"
        fullWidth
        fullScreen={fullScreen}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon icon="mdi:eye-outline" fontSize={24} />
            Vista Previa - {selectedTemplate.nombre}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: '80vh' }}>
          {previewLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <CircularProgress />
            </Box>
          ) : previewHtml ? (
            <iframe
              srcDoc={previewHtml}
              title="Preview"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Typography color="text.secondary">
                No se pudo cargar la vista previa
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setPreviewModalOpen(false)}>Cerrar</Button>
          <Button
            variant="contained"
            startIcon={<Icon icon="mdi:printer" />}
            onClick={() => {
              const iframe = document.querySelector(
                'iframe[title="Preview"]',
              ) as HTMLIFrameElement
              if (iframe?.contentWindow) {
                iframe.contentWindow.print()
              }
            }}
            disabled={!previewHtml}
          >
            Imprimir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ReportDetailView
