// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import { useMediaQuery, useTheme } from '@mui/material'

// ** API Client
import restClient from 'src/configs/restClient'

// ** Types
import type {
  UseDocumentRendererOptions,
  UseDocumentRendererReturn,
} from 'src/views/ui/documentRenderer/types'

export const useDocumentRenderer = ({
  documentNo,
  tipoDocumento,
  plantillaId,
  autoFetch = false,
}: UseDocumentRendererOptions): UseDocumentRendererReturn => {
  // ** Hooks
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // ** State
  const [htmlContent, setHtmlContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ** Detect kiosk mode (Chrome with special flags)
  const isSilentPrintAvailable = useCallback(() => {
    // Check for kiosk mode indicators
    const isKioskMode =
      window.navigator.userAgent.includes('Chrome') &&
      (window.navigator.userAgent.includes('Kiosk') ||
        // @ts-ignore - checking for Electron
        window.navigator.userAgent.includes('Electron') ||
        // Check if window has limited features (kiosk mode)
        (!window.toolbar?.visible && !window.menubar?.visible))

    return isKioskMode
  }, [])

  // ** Fetch document HTML
  const fetchDocument = useCallback(async () => {
    if (!documentNo || (!tipoDocumento && tipoDocumento !== 0)) {
      setError('Document number and type are required')
      return
    }

    setLoading(true)
    setError(null)
    setHtmlContent(null)

    try {
      const params: Record<string, any> = {
        tipoDocumento,
      }

      if (plantillaId) {
        params.plantillaId = plantillaId
      }

      const response = await restClient.get<string>(
        `/api/portal/PlantillaReporte/documento/${documentNo}/html`,
        {
          params,
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
        'Error al cargar el documento'
      setError(errorMessage)
      console.error('Document fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [documentNo, tipoDocumento, plantillaId])

  // ** Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchDocument()
    }
  }, [autoFetch, fetchDocument])

  return {
    htmlContent,
    loading,
    error,
    fetchDocument,
    isSilentPrintAvailable: isSilentPrintAvailable(),
    isMobile,
  }
}
