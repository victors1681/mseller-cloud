// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import LinearProgress from '@mui/material/LinearProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Utils
import toast from 'react-hot-toast'
import restClient from 'src/configs/restClient'
import {
  generateExampleFilenames,
  parseImageFilename,
} from 'src/utils/imageAutoLinkUtils'

// ** Types
import { AutoLinkResponse } from 'src/types/apps/imageAutoLinkTypes'
import { MediaItem } from 'src/types/apps/mediaTypes'

interface AutoLinkDialogProps {
  open: boolean
  onClose: () => void
  selectedMedia: MediaItem[]
  onSuccess?: () => void
}

const AutoLinkDialog = ({
  open,
  onClose,
  selectedMedia,
  onSuccess,
}: AutoLinkDialogProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // ** State
  const [step, setStep] = useState<'preview' | 'processing' | 'results'>(
    'preview',
  )
  const [preview, setPreview] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [overwriteExisting, setOverwriteExisting] = useState(false)
  const [results, setResults] = useState<AutoLinkResponse | null>(null)

  // ** Effects
  useEffect(() => {
    if (open && selectedMedia.length > 0) {
      generatePreview()
    }
  }, [open, selectedMedia])

  // ** Preview Generation
  const generatePreview = () => {
    setLoading(true)

    const previewItems = selectedMedia.map((media) => {
      // Use originalFilename if available (from upload), fallback to title or path extraction
      let filenameToUse = media.originalFilename || media.title

      if (!filenameToUse || filenameToUse.trim() === '') {
        // Extract from originalFile path - get the last segment
        const pathSegments = media.originalFile.split('/')
        const lastSegment = pathSegments[pathSegments.length - 1]

        // If last segment looks like a UUID filename (e.g., "11300e37...jpg"),
        // can't extract product code from it
        if (lastSegment && /^[a-f0-9]{8}-[a-f0-9]{4}-/i.test(lastSegment)) {
          filenameToUse = lastSegment
        } else {
          filenameToUse = lastSegment || media.originalFile
        }
      }

      const parsed = parseImageFilename(filenameToUse)

      return {
        media,
        parsedFilename: {
          productCode: parsed.productCode,
          variant: parsed.variant,
          isPrimary: parsed.isPrimary,
        },
        matchedProduct: null,
        existingImages: 0,
        willLink: parsed.isValid,
        reason: parsed.isValid
          ? undefined
          : parsed.error || 'Invalid filename format',
      }
    })

    setPreview(previewItems)
    setLoading(false)
  }

  // ** Process Auto-Link
  const handleProcess = async () => {
    setStep('processing')
    setLoading(true)

    try {
      // Build image objects with parsed product codes (both original and thumbnail)
      const imagenes = selectedMedia.flatMap((media, index) => {
        // Use originalFilename if available (from upload), fallback to title or path extraction
        let filenameToUse = media.originalFilename || media.title

        if (!filenameToUse || filenameToUse.trim() === '') {
          // Extract from originalFile path - get the last segment
          const pathSegments = media.originalFile.split('/')
          const lastSegment = pathSegments[pathSegments.length - 1]

          // If last segment looks like a UUID filename, can't extract product code
          if (lastSegment && /^[a-f0-9]{8}-[a-f0-9]{4}-/i.test(lastSegment)) {
            filenameToUse = lastSegment
          } else {
            filenameToUse = lastSegment || media.originalFile
          }
        }

        const parsed = parseImageFilename(filenameToUse)

        if (!parsed.isValid || !parsed.productCode) {
          return []
        }

        const baseImage = {
          codigoProducto: parsed.productCode,
          titulo: media.title || media.originalFile,
          esImagenPredeterminada: parsed.isPrimary,
          fechaCreacion: new Date().toISOString(),
          idObjeto: media.id,
          businessId: media.businessId || '',
        }

        return [
          {
            ...baseImage,
            rutaPublica: media.originalUrl,
            ruta: media.originalUrl,
            tipoImagen: 'original' as const,
            ordenVisualizacion: index * 2,
          },
          {
            ...baseImage,
            rutaPublica: media.thumbnailUrl,
            ruta: media.thumbnailUrl,
            tipoImagen: 'thumbnail' as const,
            ordenVisualizacion: index * 2 + 1,
          },
        ]
      })

      const response = await restClient.post<AutoLinkResponse>(
        '/api/portal/Producto/auto-link-images',
        {
          imagenes,
          strategy: 'filename',
          dryRun: false,
          overwriteExisting,
        },
      )

      setResults(response.data)
      setStep('results')

      if (response.data.successful > 0) {
        toast.success(
          `${response.data.successful} imagen(es) vinculada(s) exitosamente`,
        )
        onSuccess?.()
      }

      if (response.data.failed > 0) {
        toast.error(`${response.data.failed} imagen(es) fallaron`)
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al procesar imágenes')
      setStep('preview')
    } finally {
      setLoading(false)
    }
  }

  // ** Reset Dialog
  const handleClose = () => {
    setStep('preview')
    setPreview([])
    setResults(null)
    onClose()
  }

  // ** Count stats
  const validCount = preview.filter((p) => p.willLink).length
  const invalidCount = preview.filter((p) => !p.willLink).length

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Icon icon="mdi:link-variant" fontSize={24} />
          <Typography variant="h6">
            Vincular Imágenes Automáticamente
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Step: Preview */}
        {step === 'preview' && (
          <>
            {/* Summary Cards */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Paper
                sx={{
                  p: 2,
                  flex: 1,
                  border: 2,
                  borderColor: 'divider',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Total Imágenes
                </Typography>
                <Typography variant="h4">{selectedMedia.length}</Typography>
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  flex: 1,
                  border: 2,
                  borderColor: 'success.main',
                  bgcolor: 'success.50',
                }}
              >
                <Typography variant="caption" color="success.dark">
                  Válidas
                </Typography>
                <Typography variant="h4" color="success.main">
                  {validCount}
                </Typography>
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  flex: 1,
                  border: 2,
                  borderColor: 'error.main',
                  bgcolor: 'error.50',
                }}
              >
                <Typography variant="caption" color="error.dark">
                  Inválidas
                </Typography>
                <Typography variant="h4" color="error.main">
                  {invalidCount}
                </Typography>
              </Paper>
            </Stack>

            {/* Info Alert */}
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Patrones de nombre soportados:</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {generateExampleFilenames('PROD001').map((example) => (
                  <Chip
                    key={example}
                    label={example}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Alert>

            {/* Options */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={overwriteExisting}
                  onChange={(e) => setOverwriteExisting(e.target.checked)}
                />
              }
              label="Reemplazar imágenes existentes"
            />

            <Divider sx={{ my: 3 }} />

            {/* Preview List */}
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Vista Previa ({preview.length} imágenes)
            </Typography>

            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {preview.map((item) => (
                <ListItem
                  key={item.media.id}
                  sx={{
                    border: 2,
                    borderColor: item.willLink ? 'success.main' : 'error.main',
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: item.willLink
                      ? 'rgba(76, 175, 80, 0.08)'
                      : 'rgba(244, 67, 54, 0.08)',
                  }}
                >
                  <Box sx={{ mr: 2, minWidth: 40 }}>
                    <Icon
                      icon={
                        item.willLink ? 'mdi:check-circle' : 'mdi:alert-circle'
                      }
                      fontSize={24}
                      color={item.willLink ? 'success' : 'error'}
                    />
                  </Box>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.media.title || 'Sin título'}
                        </Typography>
                        {item.parsedFilename.productCode && (
                          <Chip
                            label={item.parsedFilename.productCode}
                            size="small"
                            color="primary"
                          />
                        )}
                        {item.parsedFilename.isPrimary && (
                          <Chip
                            label="Principal"
                            size="small"
                            color="secondary"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        Archivo:{' '}
                        {item.media.title ||
                          item.media.originalFile.split('/').pop()}
                        {!item.willLink && (
                          <Box
                            component="span"
                            sx={{ ml: 1, color: 'error.main' }}
                          >
                            • {item.reason}
                          </Box>
                        )}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {/* Step: Processing */}
        {step === 'processing' && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6">Procesando imágenes...</Typography>
            <Typography variant="body2" color="text.secondary">
              Por favor espera mientras vinculamos las imágenes
            </Typography>
            <LinearProgress sx={{ mt: 3 }} />
          </Box>
        )}

        {/* Step: Results */}
        {step === 'results' && results && (
          <>
            {/* Results Summary */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Paper
                sx={{
                  p: 2,
                  flex: 1,
                  border: 2,
                  borderColor: 'success.main',
                  bgcolor: 'rgba(76, 175, 80, 0.08)',
                }}
              >
                <Typography variant="caption" color="success.dark">
                  Exitosas
                </Typography>
                <Typography variant="h4" color="success.main">
                  {results.successful}
                </Typography>
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  flex: 1,
                  border: 2,
                  borderColor: 'error.main',
                  bgcolor: 'rgba(244, 67, 54, 0.08)',
                }}
              >
                <Typography variant="caption" color="error.dark">
                  Fallidas
                </Typography>
                <Typography variant="h4" color="error.main">
                  {results.failed}
                </Typography>
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  flex: 1,
                  border: 2,
                  borderColor: 'warning.main',
                  bgcolor: 'rgba(255, 152, 0, 0.08)',
                }}
              >
                <Typography variant="caption" color="warning.dark">
                  Omitidas
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {results.skipped}
                </Typography>
              </Paper>
            </Stack>

            <Alert severity="success" sx={{ mb: 2 }}>
              {results.successful} imagen(es) vinculada(s) a{' '}
              {results.productsUpdated.length} producto(s)
            </Alert>

            {/* Results List */}
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Detalle de Resultados
            </Typography>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {results.results.map((result) => (
                <ListItem
                  key={result.mediaId}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <Box sx={{ mr: 2 }}>
                    <Icon
                      icon={
                        result.success ? 'mdi:check-circle' : 'mdi:close-circle'
                      }
                      fontSize={20}
                      color={result.success ? 'success' : 'error'}
                    />
                  </Box>
                  <ListItemText
                    primary={result.filename}
                    secondary={
                      result.success
                        ? `Vinculado a ${result.productCode} - ${
                            result.productName || ''
                          }`
                        : result.error
                    }
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>

      <DialogActions>
        {step === 'preview' && (
          <>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleProcess}
              disabled={validCount === 0 || loading}
              startIcon={<Icon icon="mdi:link-variant" />}
            >
              Vincular {validCount} Imagen(es)
            </Button>
          </>
        )}

        {step === 'results' && (
          <Button variant="contained" onClick={handleClose}>
            Cerrar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default AutoLinkDialog
