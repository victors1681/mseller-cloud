// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from 'src/store'
import {
  transformDocument,
  clearTransformDocumentResult,
} from 'src/store/apps/ecf'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface TransformDocumentDialogProps {
  open: boolean
  onClose: () => void
}

const TransformDocumentDialog = ({
  open,
  onClose,
}: TransformDocumentDialogProps) => {
  // ** State
  const [noDocumento, setNoDocumento] = useState('')

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.ecf)

  const handleSubmit = () => {
    if (noDocumento.trim()) {
      dispatch(transformDocument({ noDocumento: noDocumento.trim() }))
    }
  }

  const handleClose = () => {
    setNoDocumento('')
    dispatch(clearTransformDocumentResult())
    onClose()
  }

  const handleReset = () => {
    setNoDocumento('')
    dispatch(clearTransformDocumentResult())
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Icon icon="tabler:file-type-doc" fontSize={24} />
        Transformar Documento
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Número de Documento"
            value={noDocumento}
            onChange={(e) => setNoDocumento(e.target.value)}
            placeholder="Ingrese el número de documento"
            disabled={store.isTransformingDocument}
            sx={{ mb: 3 }}
          />

          {store.isTransformingDocument && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <CircularProgress size={20} />
              <Typography variant="body2">
                Transformando documento...
              </Typography>
            </Box>
          )}

          {store.transformDocumentResult && (
            <Alert
              severity={
                store.transformDocumentResult.success ? 'success' : 'error'
              }
              sx={{ mb: 3 }}
            >
              <Typography variant="body2">
                {store.transformDocumentResult.message}
              </Typography>
              {store.transformDocumentResult.data && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="caption"
                    component="pre"
                    sx={{ whiteSpace: 'pre-wrap' }}
                  >
                    {JSON.stringify(
                      store.transformDocumentResult.data,
                      null,
                      2,
                    )}
                  </Typography>
                </Box>
              )}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} color="secondary">
          Limpiar
        </Button>
        <Button onClick={handleClose} color="secondary">
          Cerrar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!noDocumento.trim() || store.isTransformingDocument}
          startIcon={
            store.isTransformingDocument ? (
              <CircularProgress size={20} />
            ) : (
              <Icon icon="tabler:file-type-doc" />
            )
          }
        >
          {store.isTransformingDocument ? 'Transformando...' : 'Transformar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TransformDocumentDialog
