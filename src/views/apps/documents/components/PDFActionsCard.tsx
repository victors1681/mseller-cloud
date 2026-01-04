// ** Example Component using Server-Side PDF Generation
import React, { useState } from 'react'

// ** MUI Imports
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useConfiguredPDFOperations } from 'src/hooks/useConfiguredPDFOperations'

// ** PDF Generator
import { EnhancedPDFGenerator } from 'src/services/pdf/client'

// ** Types
import { DocumentType } from 'src/types/apps/documentTypes'

interface PDFActionsCardProps {
  document: DocumentType
  variant?: 'default' | 'compact' | 'detailed'
}

/**
 * PDF Actions Card Component
 * Demonstrates the usage of the new server-side PDF generator
 */
const PDFActionsCard: React.FC<PDFActionsCardProps> = ({
  document,
  variant = 'default',
}) => {
  const theme = useTheme()
  const userData = useAuth()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Using the configured PDF operations hook (automatically uses configured templates)
  const {
    downloadPDF,
    openPDF,
    printPDF,
    downloadHighQuality,
    downloadLandscape,
    downloadMobileOptimized,
  } = useConfiguredPDFOperations()

  /**
   * Handle PDF operations with loading states
   */
  const handlePDFOperation = async (
    operation: () => Promise<void>,
    operationName: string,
  ) => {
    setLoading(operationName)
    setError(null)
    setSuccess(null)

    try {
      await operation()
      setSuccess(`${operationName} completed successfully!`)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${operationName.toLowerCase()}`,
      )
    } finally {
      setLoading(null)
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  /**
   * PDF Operation Handlers
   */
  const handleDownload = () => {
    handlePDFOperation(() => downloadPDF(document), 'Download PDF')
  }

  const handleDownloadCustomName = () => {
    const filename = `${document.tipoDocumento}-${document.noPedidoStr}-${
      new Date().toISOString().split('T')[0]
    }.pdf`
    handlePDFOperation(
      () => downloadPDF(document, filename),
      'Download PDF with Custom Name',
    )
  }

  const handleOpen = () => {
    handlePDFOperation(() => openPDF(document), 'Open PDF')
  }

  const handlePrint = () => {
    handlePDFOperation(() => printPDF(document), 'Print PDF')
  }

  const handleDownloadHighQuality = () => {
    handlePDFOperation(
      () => downloadHighQuality(document),
      'Download High Quality PDF',
    )
  }

  const handleDownloadLandscape = () => {
    handlePDFOperation(
      () => downloadLandscape(document),
      'Download Landscape PDF',
    )
  }

  const handleDownloadMobile = () => {
    handlePDFOperation(
      () => downloadMobileOptimized(document),
      'Download Mobile Optimized PDF',
    )
  }

  /**
   * Custom PDF with specific options
   */
  const handleCustomPDF = () => {
    handlePDFOperation(
      () =>
        EnhancedPDFGenerator.downloadPDF(document, undefined, {
          format: 'Letter',
          orientation: 'portrait',
          includeBackground: true,
          margin: {
            top: '25px',
            right: '25px',
            bottom: '25px',
            left: '25px',
          },
        }),
      'Download Custom PDF',
    )
  }

  /**
   * Render loading button
   */
  const renderButton = (
    onClick: () => void,
    text: string,
    icon: string,
    operationName: string,
    buttonVariant: 'text' | 'outlined' | 'contained' = 'outlined',
  ) => (
    <Button
      variant={buttonVariant}
      onClick={onClick}
      disabled={loading !== null}
      startIcon={
        loading === operationName ? (
          <CircularProgress size={20} />
        ) : (
          <Icon icon={icon} />
        )
      }
      fullWidth={variant === 'compact'}
      sx={{
        mb: variant === 'compact' ? 1 : 0,
        minHeight: { xs: 44, sm: 'auto' },
      }}
    >
      {loading === operationName ? 'Processing...' : text}
    </Button>
  )

  if (variant === 'compact') {
    return (
      <Card>
        <CardContent sx={{ pb: 2 }}>
          <Typography variant="h6" gutterBottom>
            PDF Actions
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Grid container spacing={1}>
            <Grid item xs={12}>
              {renderButton(
                handleDownload,
                'Download',
                'mdi:download',
                'Download PDF',
                'contained',
              )}
            </Grid>
            <Grid item xs={6}>
              {renderButton(handleOpen, 'View', 'mdi:eye-outline', 'Open PDF')}
            </Grid>
            <Grid item xs={6}>
              {renderButton(
                handlePrint,
                'Print',
                'mdi:printer-outline',
                'Print PDF',
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            PDF Generation Options
          </Typography>
          <Chip
            label="Server-Side"
            color="primary"
            size="small"
            icon={<Icon icon="mdi:server" />}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Document: <strong>{document.tipoDocumento}</strong> -{' '}
          {document.noPedidoStr}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Basic Operations */}
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Basic Operations
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            {renderButton(
              handleDownload,
              'Download PDF',
              'mdi:download',
              'Download PDF',
              'contained',
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            {renderButton(
              handleOpen,
              'View PDF',
              'mdi:eye-outline',
              'Open PDF',
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            {renderButton(
              handlePrint,
              'Print PDF',
              'mdi:printer-outline',
              'Print PDF',
            )}
          </Grid>
        </Grid>

        {/* Advanced Options */}
        {variant === 'detailed' && (
          <>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Quality & Format Options
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                {renderButton(
                  handleDownloadHighQuality,
                  'High Quality',
                  'mdi:quality-high',
                  'Download High Quality PDF',
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {renderButton(
                  handleDownloadLandscape,
                  'Landscape',
                  'mdi:rotate-90-degrees-ccw',
                  'Download Landscape PDF',
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {renderButton(
                  handleDownloadMobile,
                  'Mobile Optimized',
                  'mdi:cellphone',
                  'Download Mobile Optimized PDF',
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {renderButton(
                  handleCustomPDF,
                  'Custom Format',
                  'mdi:cog-outline',
                  'Download Custom PDF',
                )}
              </Grid>
            </Grid>

            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Additional Options
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderButton(
                  handleDownloadCustomName,
                  'Custom Filename',
                  'mdi:rename-outline',
                  'Download PDF with Custom Name',
                )}
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default PDFActionsCard

/**
 * Usage Examples:
 *
 * // Basic usage
 * <PDFActionsCard document={documentData} />
 *
 * // Compact version
 * <PDFActionsCard document={documentData} variant="compact" />
 *
 * // Detailed version with all options
 * <PDFActionsCard document={documentData} variant="detailed" />
 */
