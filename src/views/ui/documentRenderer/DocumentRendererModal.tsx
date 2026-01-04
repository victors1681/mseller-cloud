// ** React Imports
import { FC, useCallback, useEffect, useRef, useState } from 'react'

// ** MUI Imports
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import { useDocumentRenderer } from 'src/hooks/useDocumentRenderer'

// ** Types
import type { DocumentRendererProps } from './types'

const DocumentRendererModal: FC<DocumentRendererProps> = ({
  open,
  onClose,
  documentNo,
  documentNos,
  tipoDocumento,
  plantillaId,
  showPreview = false,
  autoPrint = true,
  autoCloseDelay = 2000,
  title,
  onPrintStarted,
  onPrintCompleted,
  onPrintCancelled,
}) => {
  // ** Hooks
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // ** Batch printing state
  const [currentDocIndex, setCurrentDocIndex] = useState(0)
  const [isBatchMode, setIsBatchMode] = useState(false)
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 })

  // ** Determine current document to render
  const docs = documentNos || (documentNo ? [documentNo] : [])
  const currentDoc = docs[currentDocIndex]

  // ** Document renderer hook
  const { htmlContent, loading, error, fetchDocument, isMobile } =
    useDocumentRenderer({
      documentNo: currentDoc || '',
      tipoDocumento,
      plantillaId,
      autoFetch: false,
    })

  // ** Print completion detection
  const [printDialogOpen, setPrintDialogOpen] = useState(false)
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!open) {
      // Clear any pending timers when modal closes
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current)
        autoCloseTimerRef.current = null
      }
      return
    }

    const handleAfterPrint = () => {
      console.log('afterprint event fired')

      // Clear fallback timer since print dialog closed naturally
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current)
        autoCloseTimerRef.current = null
      }

      if (autoPrint && !showPreview) {
        // Print dialog closed
        if (currentDoc) {
          onPrintCompleted?.(currentDoc)
        }

        // If batch mode, move to next document
        if (isBatchMode && currentDocIndex < docs.length - 1) {
          setTimeout(() => {
            setCurrentDocIndex((prev) => prev + 1)
          }, 1000) // 1s delay between prints
        } else {
          // Close modal after delay
          setTimeout(() => {
            onClose()
          }, autoCloseDelay)
        }
      }
    }

    // Listen for afterprint event (more reliable than matchMedia)
    window.addEventListener('afterprint', handleAfterPrint)

    // Detect when print dialog opens/closes (fallback)
    const mediaQueryList = window.matchMedia('print')

    const handlePrintChange = (e: MediaQueryListEvent) => {
      setPrintDialogOpen(e.matches)

      if (!e.matches && autoPrint && !showPreview) {
        handleAfterPrint()
      }
    }

    mediaQueryList.addEventListener('change', handlePrintChange)

    return () => {
      window.removeEventListener('afterprint', handleAfterPrint)
      mediaQueryList.removeEventListener('change', handlePrintChange)
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current)
      }
    }
  }, [
    open,
    autoPrint,
    showPreview,
    autoCloseDelay,
    currentDoc,
    isBatchMode,
    currentDocIndex,
    docs.length,
    onClose,
    onPrintCompleted,
  ])

  // ** Initialize batch mode
  useEffect(() => {
    if (open && docs.length > 0) {
      setIsBatchMode(docs.length > 1)
      setBatchProgress({ current: 1, total: docs.length })
      setCurrentDocIndex(0)
      fetchDocument()
    }
  }, [open, docs.length, fetchDocument])

  // ** Auto-print logic
  useEffect(() => {
    if (
      htmlContent &&
      !loading &&
      !showPreview &&
      autoPrint &&
      iframeRef.current
    ) {
      // Wait for content to fully render
      const printTimer = setTimeout(() => {
        try {
          if (currentDoc) {
            onPrintStarted?.(currentDoc)
          }

          iframeRef.current?.contentWindow?.print()

          // Fallback timer: Always close modal after 5 seconds as safety net
          // This ensures the modal closes even if event listeners fail
          console.log('Setting fallback auto-close timer (5s)')
          autoCloseTimerRef.current = setTimeout(() => {
            console.log('Fallback timer closing modal')
            if (currentDoc) {
              onPrintCompleted?.(currentDoc)
            }
            onClose()
          }, 5000)
        } catch (err) {
          console.error('Print error:', err)
          if (currentDoc) {
            onPrintCancelled?.(currentDoc, 'Error al imprimir')
          }

          // Fallback: close after delay
          setTimeout(() => {
            onClose()
          }, autoCloseDelay)
        }
      }, 500) // Wait for styles to load

      return () => {
        clearTimeout(printTimer)
      }
    }
  }, [
    htmlContent,
    loading,
    showPreview,
    autoPrint,
    autoCloseDelay,
    currentDoc,
    onClose,
    onPrintStarted,
    onPrintCancelled,
    onPrintCompleted,
  ])

  // ** Update batch progress
  useEffect(() => {
    if (isBatchMode) {
      setBatchProgress({ current: currentDocIndex + 1, total: docs.length })
    }
  }, [currentDocIndex, docs.length, isBatchMode])

  // ** Handle manual print
  const handlePrint = useCallback(() => {
    if (iframeRef.current?.contentWindow) {
      if (currentDoc) {
        onPrintStarted?.(currentDoc)
      }

      iframeRef.current.contentWindow.print()
    }
  }, [currentDoc, onPrintStarted])

  // ** Handle close
  const handleClose = useCallback(() => {
    if (currentDoc && !printDialogOpen) {
      onPrintCancelled?.(currentDoc, 'Usuario canceló')
    }
    onClose()
  }, [currentDoc, printDialogOpen, onClose, onPrintCancelled])

  // ** Render content
  const renderContent = () => {
    if (loading) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: showPreview ? '70vh' : '200px',
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Cargando documento...
          </Typography>
          {isBatchMode && (
            <Typography variant="caption" color="text.secondary">
              Documento {batchProgress.current} de {batchProgress.total}
            </Typography>
          )}
        </Box>
      )
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      )
    }

    if (htmlContent) {
      if (showPreview) {
        // Show preview mode with full iframe
        return (
          <Box>
            {isMobile && (
              <Alert severity="info" sx={{ mb: 2 }}>
                En dispositivos móviles, el comportamiento de impresión puede
                variar. Algunos navegadores mostrarán vista previa, otros
                guardarán como PDF.
              </Alert>
            )}
            {isBatchMode && (
              <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper' }}>
                <Typography variant="body2" color="primary">
                  Imprimiendo documento {batchProgress.current} de{' '}
                  {batchProgress.total}
                </Typography>
              </Box>
            )}
            {/* Minimal preview thumbnail */}
            <Box
              sx={{
                mb: 2,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
                height: 300,
                width: 200,
                mx: 'auto',
              }}
            >
              <iframe
                ref={iframeRef}
                srcDoc={htmlContent}
                title="Document Preview Thumbnail"
                style={{
                  width: '800px',
                  height: '1200px',
                  border: 'none',
                  transform: 'scale(0.25)',
                  transformOrigin: '0 0',
                }}
              />
            </Box>
            {/* Full preview iframe */}
            <iframe
              srcDoc={htmlContent}
              title="Document Preview"
              style={{
                width: '100%',
                height: '70vh',
                border: 'none',
              }}
            />
          </Box>
        )
      } else {
        // Hidden iframe for auto-print
        return (
          <Box sx={{ display: 'none' }}>
            <iframe
              ref={iframeRef}
              srcDoc={htmlContent}
              title="Document Print"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          </Box>
        )
      }
    }

    return null
  }

  if (!showPreview && autoPrint) {
    // For auto-print without preview, show printing status with close button
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
              gap: 2,
            }}
          >
            {loading ? (
              <>
                <CircularProgress />
                <Typography variant="body1">Cargando documento...</Typography>
                {isBatchMode && (
                  <Typography variant="caption" color="text.secondary">
                    Documento {batchProgress.current} de {batchProgress.total}
                  </Typography>
                )}
              </>
            ) : error ? (
              <>
                <Alert severity="error" sx={{ width: '100%' }}>
                  <Typography variant="body2">{error}</Typography>
                </Alert>
                <Button variant="contained" onClick={handleClose}>
                  Cerrar
                </Button>
              </>
            ) : (
              <>
                <Icon icon="mdi:printer" fontSize="3rem" color="primary" />
                <Typography variant="h6">
                  Abriendo diálogo de impresión...
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  Se abrirá el diálogo de impresión de su navegador.
                  <br />
                  Esta ventana se cerrará automáticamente.
                </Typography>
                {isBatchMode && (
                  <Typography variant="caption" color="text.secondary">
                    Imprimiendo documento {batchProgress.current} de{' '}
                    {batchProgress.total}
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  sx={{ mt: 2 }}
                  startIcon={<Icon icon="mdi:close" />}
                >
                  Cancelar
                </Button>
              </>
            )}
          </Box>
          {/* Hidden iframe for printing */}
          {renderContent()}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon icon="mdi:file-document-outline" fontSize={24} />
            <Typography variant="h6">
              {title || 'Vista Previa del Documento'}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Icon icon="mdi:close" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>{renderContent()}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cerrar
        </Button>
        {showPreview && !loading && !error && (
          <Button
            onClick={handlePrint}
            variant="contained"
            startIcon={<Icon icon="mdi:printer" />}
          >
            Imprimir
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default DocumentRendererModal
