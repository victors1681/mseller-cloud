// ** React Imports

// ** React Imports
import { useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** PDF Imports
import {
  generateDocumentPDF,
  isClientSide,
} from 'src/utils/cleanPDFGenerator'

// ** Types
import { DocumentType } from 'src/types/apps/documentTypes'

// ** Type Imports
interface DocumentSuccessModalProps {
  open: boolean
  onClose: () => void
  documentId?: string
  documentNumber?: string
  documentData?: DocumentType
}

const DocumentSuccessModal = ({
  open,
  onClose,
  documentId,
  documentNumber,
  documentData,
}: DocumentSuccessModalProps) => {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [isGenerating, setIsGenerating] = useState(false)

  const handlePrint = () => {
    if (documentId) {
      // Navigate to print preview page
      router.push(`/apps/documents/preview/${documentId}`)
    }
    onClose()
  }

  const handleDownloadShare = async () => {
    if (!documentData) {
      if (documentId) router.push(`/apps/documents/preview/${documentId}`)
      onClose()
      return
    }

    // Check if PDF generation is available (client-side only)
    if (!isClientSide()) {
      // Fallback to preview page for server-side rendering
      if (documentId) router.push(`/apps/documents/preview/${documentId}`)
      onClose()
      return
    }

    setIsGenerating(true)
    try {
      await generateDocumentPDF(documentData)
    } catch (err) {
      // If PDF generation failed, fallback to preview
      if (documentId) router.push(`/apps/documents/preview/${documentId}`)
    } finally {
      setIsGenerating(false)
      onClose()
    }
  }

  const handleEmail = () => {
    // Since email sharing isn't available in the clean generator,
    // just redirect to the preview page where user can access all options
    if (documentId) {
      router.push(`/apps/documents/preview/${documentId}`)
    }
    onClose()
  }

  const handleCloseModal = () => {
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: 'success.main',
              borderRadius: '50%',
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Icon icon="mdi:check" fontSize="2rem" />
          </Box>
          <Typography variant="h5" component="h2">
            ¡Documento Creado Exitosamente!
          </Typography>
          {documentNumber && (
            <Typography variant="body2" color="text.secondary">
              Documento #{documentNumber}
            </Typography>
          )}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="body1" color="text.secondary">
          El documento ha sido guardado correctamente. ¿Qué desea hacer a
          continuación?
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 2 },
          p: 3,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<Icon icon="mdi:printer" />}
          onClick={handlePrint}
          fullWidth={isMobile}
          sx={{
            minHeight: { xs: 48, sm: 'auto' },
            fontSize: { xs: '1rem', sm: '0.875rem' },
          }}
        >
          Imprimir
        </Button>

        <Button
          variant="outlined"
          startIcon={<Icon icon="mdi:download" />}
          onClick={handleDownloadShare}
          disabled={isGenerating}
          fullWidth={isMobile}
          sx={{
            minHeight: { xs: 48, sm: 'auto' },
            fontSize: { xs: '1rem', sm: '0.875rem' },
          }}
        >
          {isGenerating ? 'Generando PDF...' : 'Descargar / Compartir'}
        </Button>

        <Button
          variant="outlined"
          startIcon={<Icon icon="mdi:email-outline" />}
          onClick={handleEmail}
          fullWidth={isMobile}
          sx={{
            minHeight: { xs: 48, sm: 'auto' },
            fontSize: { xs: '1rem', sm: '0.875rem' },
          }}
        >
          Enviar por Email
        </Button>

        <Button
          variant="contained"
          startIcon={<Icon icon="mdi:close" />}
          onClick={handleCloseModal}
          fullWidth={isMobile}
          sx={{
            minHeight: { xs: 48, sm: 'auto' },
            fontSize: { xs: '1rem', sm: '0.875rem' },
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DocumentSuccessModal
