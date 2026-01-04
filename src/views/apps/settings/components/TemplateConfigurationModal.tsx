// ** React Imports
import { FC, useEffect, useState } from 'react'

// ** MUI Imports
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  Radio,
  RadioGroup,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  clearCurrentConfiguration,
  clearError,
  fetchConfigurationByDocumentType,
  saveConfiguration,
  selectCurrentConfiguration,
  selectError,
  selectIsSaving,
  updateConfiguration,
} from 'src/store/apps/settings/templateConfigSlice'

// ** Types
import { PlantillaReporte } from 'src/types/apps/reportsTypes'
import {
  mapNumericoToDocumentType,
  TipoDocumentoNumerico,
  tipoDocumentoSpanishNames,
} from 'src/types/apps/templateConfigTypes'

// ** Config
import restClient from 'src/configs/restClient'

interface Props {
  open: boolean
  tipoDocumento: TipoDocumentoNumerico
  onClose: () => void
  onSaved: () => void
}

const TemplateConfigurationModal: FC<Props> = ({
  open,
  tipoDocumento,
  onClose,
  onSaved,
}) => {
  // ** Hooks
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  // ** State
  const currentConfig = useAppSelector(selectCurrentConfiguration)
  const saving = useAppSelector(selectIsSaving)
  const error = useAppSelector(selectError)

  const [templates, setTemplates] = useState<PlantillaReporte[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null,
  )
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // ** Effects
  useEffect(() => {
    if (open) {
      loadData()
    } else {
      // Reset state when modal closes
      setTemplates([])
      setSelectedTemplateId(null)
      setPreviewUrl(null)
      setShowConfirmation(false)
      dispatch(clearCurrentConfiguration())
      dispatch(clearError())
    }
  }, [open, tipoDocumento])

  useEffect(() => {
    if (currentConfig && currentConfig.plantillaId) {
      setSelectedTemplateId(currentConfig.plantillaId)
    }
  }, [currentConfig])

  useEffect(() => {
    if (selectedTemplateId) {
      loadPreview(selectedTemplateId)
    } else {
      setPreviewUrl(null)
    }
  }, [selectedTemplateId])

  // ** Load Data
  const loadData = async () => {
    // Guard against invalid tipoDocumento
    if (!tipoDocumento && tipoDocumento !== 0) {
      console.warn('Cannot load templates: tipoDocumento is invalid')
      return
    }

    try {
      // Load current configuration
      await dispatch(fetchConfigurationByDocumentType(tipoDocumento))

      // Load available templates
      setLoadingTemplates(true)
      const response = await restClient.get<PlantillaReporte[]>(
        `/api/portal/PlantillaReporte/by-module/${tipoDocumento}`,
        {
          params: {
            idioma: 'es',
            includeInactive: false,
          },
        },
      )
      setTemplates(response.data || [])
    } catch (err) {
      console.error('Error loading templates:', err)
    } finally {
      setLoadingTemplates(false)
    }
  }

  // ** Load Preview
  const loadPreview = async (templateId: number) => {
    try {
      setLoadingPreview(true)
      const response = await restClient.get(
        `/api/portal/PlantillaReporte/${templateId}/preview`,
        { responseType: 'text' },
      )
      setPreviewUrl(response.data)
    } catch (err) {
      console.error('Error loading preview:', err)
      setPreviewUrl(null)
    } finally {
      setLoadingPreview(false)
    }
  }

  // ** Handle Template Selection
  const handleTemplateSelect = (templateId: number) => {
    setSelectedTemplateId(templateId)
  }

  // ** Handle Save
  const handleSave = () => {
    if (!selectedTemplateId) return

    // Show confirmation if switching templates
    if (currentConfig && currentConfig.plantillaId !== selectedTemplateId) {
      setShowConfirmation(true)
    } else {
      performSave()
    }
  }

  const performSave = async () => {
    if (!selectedTemplateId) return

    try {
      if (currentConfig) {
        // Update existing configuration
        await dispatch(
          updateConfiguration({
            id: currentConfig.id,
            request: {
              plantillaId: selectedTemplateId,
              activo: true,
            },
          }),
        ).unwrap()
      } else {
        // Create new configuration
        await dispatch(
          saveConfiguration({
            tipoDocumento,
            plantillaId: selectedTemplateId,
            activo: true,
          }),
        ).unwrap()
      }

      onSaved()
    } catch (err) {
      console.error('Error saving configuration:', err)
    }
  }

  // ** Group templates by source
  const globalTemplates = templates.filter((t) => t.isGlobal)
  const customTemplates = templates.filter((t) => !t.isGlobal)

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId)
  const hasChanges = currentConfig?.plantillaId !== selectedTemplateId

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={fullScreen}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">
              Configurar Plantilla:{' '}
              {
                tipoDocumentoSpanishNames[
                  mapNumericoToDocumentType(tipoDocumento)
                ]
              }
            </Typography>
            <IconButton onClick={onClose} size="small">
              <Icon icon="mdi:close" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => dispatch(clearError())}
            >
              {error}
            </Alert>
          )}

          {/* Current Configuration Info */}
          {currentConfig && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Configuración Actual:
              </Typography>
              <Typography variant="body1" sx={{ mb: 0.5 }}>
                {currentConfig.plantilla?.nombre || 'Plantilla no disponible'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip
                  size="small"
                  label={
                    currentConfig.plantilla?.isGlobal
                      ? 'Global'
                      : 'Personalizada'
                  }
                  color={currentConfig.plantilla?.isGlobal ? 'info' : 'primary'}
                />
                <Chip
                  size="small"
                  label={currentConfig.activo ? 'Activo' : 'Inactivo'}
                  color={currentConfig.activo ? 'success' : 'default'}
                />
              </Box>
            </Box>
          )}

          {loadingTemplates && <LinearProgress sx={{ mb: 3 }} />}

          <Grid container spacing={3}>
            {/* Templates List */}
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset" fullWidth>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Plantillas Disponibles
                </Typography>

                <RadioGroup
                  value={selectedTemplateId}
                  onChange={(e) => handleTemplateSelect(Number(e.target.value))}
                >
                  {/* Global Templates */}
                  {globalTemplates.length > 0 && (
                    <>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 2,
                          mt: 1,
                        }}
                      >
                        <Icon icon="mdi:web" fontSize={20} />
                        <Typography variant="body2" fontWeight={600}>
                          Plantillas Globales
                        </Typography>
                      </Box>
                      {globalTemplates.map((template) => (
                        <FormControlLabel
                          key={template.id}
                          value={template.id}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="body2">
                                {template.nombre}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                v{template.version} |{' '}
                                {template.idioma.toUpperCase()} |{' '}
                                {template.habilitado ? 'Activo' : 'Inactivo'}
                              </Typography>
                            </Box>
                          }
                          sx={{ mb: 1 }}
                        />
                      ))}
                      <Divider sx={{ my: 2 }} />
                    </>
                  )}

                  {/* Custom Templates */}
                  {customTemplates.length > 0 && (
                    <>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Icon icon="mdi:office-building" fontSize={20} />
                        <Typography variant="body2" fontWeight={600}>
                          Plantillas Personalizadas
                        </Typography>
                      </Box>
                      {customTemplates.map((template) => (
                        <FormControlLabel
                          key={template.id}
                          value={template.id}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="body2">
                                {template.nombre}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                v{template.version} |{' '}
                                {template.idioma.toUpperCase()} |{' '}
                                {template.habilitado ? 'Activo' : 'Inactivo'}
                              </Typography>
                            </Box>
                          }
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </>
                  )}

                  {templates.length === 0 && !loadingTemplates && (
                    <Alert severity="warning">
                      No hay plantillas disponibles para este tipo de documento.
                    </Alert>
                  )}
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Preview */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Vista Previa
              </Typography>

              {loadingPreview && <LinearProgress sx={{ mb: 2 }} />}

              {selectedTemplate && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {selectedTemplate.nombre}
                  </Typography>
                  {selectedTemplate.descripcion && (
                    <Typography variant="caption" color="text.secondary">
                      {selectedTemplate.descripcion}
                    </Typography>
                  )}
                </Box>
              )}

              {previewUrl ? (
                <Box
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    overflow: 'hidden',
                    height: { xs: 400, md: 500 },
                  }}
                >
                  <iframe
                    srcDoc={previewUrl}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    title="Template Preview"
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    height: { xs: 400, md: 500 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'action.hover',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Seleccione una plantilla para ver la vista previa
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!selectedTemplateId || saving || !hasChanges}
          >
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon
              icon="mdi:alert-circle"
              fontSize={24}
              color={theme.palette.warning.main}
            />
            <Typography variant="h6">Confirmar Cambio de Plantilla</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ¿Está seguro que desea cambiar la plantilla?
          </Typography>
          <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Actual: {currentConfig?.plantilla?.nombre || 'N/A'}
            </Typography>
            <Typography
              variant="body2"
              color="primary.main"
              sx={{ fontWeight: 600 }}
            >
              Nueva: {selectedTemplate?.nombre || 'N/A'}
            </Typography>
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            Este cambio afectará todos los nuevos documentos generados después
            de guardar.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmation(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowConfirmation(false)
              performSave()
            }}
          >
            Sí, Cambiar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TemplateConfigurationModal
