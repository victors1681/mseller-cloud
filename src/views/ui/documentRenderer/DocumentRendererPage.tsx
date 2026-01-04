// ** React Imports
import { FC, useEffect, useRef } from 'react'

// ** MUI Imports
import { Alert, Box, CircularProgress, Typography } from '@mui/material'

// ** Hooks
import { useDocumentRenderer } from 'src/hooks/useDocumentRenderer'

// ** Types
interface DocumentRendererPageProps {
  documentNo: string
  tipoDocumento: number
  plantillaId?: number
  onPrintCompleted?: () => void
  onPrintCancelled?: (error?: string) => void
  autoCloseDelay?: number
}

/**
 * Same-tab document renderer for POS scenarios
 * Renders document in hidden iframe, auto-prints, then unmounts
 */
const DocumentRendererPage: FC<DocumentRendererPageProps> = ({
  documentNo,
  tipoDocumento,
  plantillaId,
  onPrintCompleted,
  onPrintCancelled,
  autoCloseDelay = 2000,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const printTriggeredRef = useRef(false)

  // ** Fetch document
  const { htmlContent, loading, error, isMobile } = useDocumentRenderer({
    documentNo,
    tipoDocumento,
    plantillaId,
    autoFetch: true,
  })

  // ** Auto-print when content loads
  useEffect(() => {
    if (htmlContent && !loading && !printTriggeredRef.current) {
      printTriggeredRef.current = true

      // Wait for content to render
      setTimeout(() => {
        try {
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.print()

            // Detect print completion
            const mediaQueryList = window.matchMedia('print')
            const handlePrintClose = (e: MediaQueryListEvent) => {
              if (!e.matches) {
                // Print dialog closed
                setTimeout(() => {
                  onPrintCompleted?.()
                }, autoCloseDelay)
              }
            }

            mediaQueryList.addEventListener('change', handlePrintClose)

            // Fallback timeout
            setTimeout(() => {
              mediaQueryList.removeEventListener('change', handlePrintClose)
              onPrintCompleted?.()
            }, autoCloseDelay + 5000)
          }
        } catch (err) {
          console.error('Print error:', err)
          onPrintCancelled?.('Error al imprimir')
        }
      }, 500)
    }
  }, [htmlContent, loading, autoCloseDelay, onPrintCompleted, onPrintCancelled])

  // ** Handle errors
  useEffect(() => {
    if (error) {
      onPrintCancelled?.(error)
    }
  }, [error, onPrintCancelled])

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body1">Preparando documento...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <Typography variant="body1">{error}</Typography>
        </Alert>
      </Box>
    )
  }

  return (
    <Box>
      {isMobile && (
        <Box sx={{ p: 2 }}>
          <Alert severity="info">
            En dispositivos móviles, el comportamiento de impresión puede variar
            según el navegador.
          </Alert>
        </Box>
      )}
      {/* Hidden iframe for printing */}
      <iframe
        ref={iframeRef}
        srcDoc={htmlContent || ''}
        title="Document Print"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
    </Box>
  )
}

export default DocumentRendererPage
