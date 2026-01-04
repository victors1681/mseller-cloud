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

// ** Components
import { DocumentRendererModal } from 'src/views/ui/documentRenderer'

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
  const [showPrintModal, setShowPrintModal] = useState(false)

  const handlePrint = () => {
    // Use new DocumentRenderer component for auto-print
    setShowPrintModal(true)
  }

  const handleCloseModal = () => {
    onClose()
  }

  return (
    <>
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

          {/* <Button
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
        </Button> */}

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

      {/* Document Print Modal */}
      {showPrintModal && documentNumber && (
        <DocumentRendererModal
          open={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          documentNo={documentNumber}
          tipoDocumento={(documentData?.tipoDocumento ?? 0) as any}
          autoPrint={true}
          showPreview={false}
          onPrintCompleted={() => {
            setShowPrintModal(false)
          }}
          onPrintCancelled={() => {
            setShowPrintModal(false)
          }}
        />
      )}
    </>
  )
}

export default DocumentSuccessModal
