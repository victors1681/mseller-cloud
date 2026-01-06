// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material'

// ** API Client
import restClient from 'src/configs/restClient'

// ** Types
import { DocumentType } from 'src/types/apps/documentTypes'
import { mapDocumentTypeToNumerico } from 'src/types/apps/templateConfigTypes'

interface DocumentPreviewCardProps {
  data: DocumentType
}

const DocumentPreviewCard = ({ data }: DocumentPreviewCardProps) => {
  // ** State
  const [htmlContent, setHtmlContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocumentHTML = async () => {
      if (
        !data?.noPedidoStr ||
        data?.tipoDocumento === undefined ||
        data?.tipoDocumento === null
      ) {
        setError('Información del documento incompleta')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await restClient.get<string>(
          `/api/portal/PlantillaReporte/documento/${data.noPedidoStr}/html`,
          {
            params: {
              tipoDocumento: mapDocumentTypeToNumerico(data.tipoDocumento)
            },
            responseType: 'text',
            headers: {
              Accept: 'text/html',
            },
          },
        )

        setHtmlContent(response.data)
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          'Error al cargar la vista previa del documento'
        setError(errorMessage)
        console.error('Document preview fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDocumentHTML()
  }, [data?.noPedidoStr, data?.tipoDocumento])

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400,
              gap: 2,
            }}
          >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Cargando vista previa del documento...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">
            <Typography variant="body2">{error}</Typography>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!htmlContent) {
    return (
      <Card>
        <CardContent>
          <Alert severity="warning">
            <Typography variant="body2">
              No se pudo cargar el contenido del documento
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <iframe
          srcDoc={htmlContent}
          title="Document Preview"
          style={{
            width: '100%',
            minHeight: '800px',
            border: 'none',
            display: 'block',
          }}
        />
      </CardContent>
    </Card>
  )
}

export default DocumentPreviewCard
