// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Component Imports
import PrintTransportInvoice from 'src/views/apps/transports/print/PrintTransportInvoice'

// ** Types
import { DocumentoEntregaType } from 'src/types/apps/transportType'

const PrintInvoicePage = () => {
  const router = useRouter()
  const [documentData, setDocumentData] = useState<DocumentoEntregaType | null>(
    null,
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get document data from sessionStorage
    const storedData = sessionStorage.getItem('printTransportInvoice')

    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        setDocumentData(data)
      } catch (error) {
        console.error('Error parsing document data:', error)
      }
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    // Auto-print when data is loaded
    if (documentData && !loading) {
      // Wait a bit for styles to load, then trigger print
      const timer = setTimeout(() => {
        window.print()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [documentData, loading])

  const handlePrint = () => {
    window.print()
  }

  const handleClose = () => {
    window.close()
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!documentData) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <Icon icon="mdi:alert-circle" fontSize={48} color="error" />
        <Box sx={{ textAlign: 'center' }}>
          No se encontró información del documento.
        </Box>
        <Button variant="contained" onClick={handleClose}>
          Cerrar
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      {/* Print Controls - Hidden during print */}
      <Box
        className="no-print"
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1000,
          display: 'flex',
          gap: 2,
          '@media print': {
            display: 'none',
          },
        }}
      >
        <Button
          variant="contained"
          startIcon={<Icon icon="mdi:printer" />}
          onClick={handlePrint}
          sx={{
            boxShadow: 3,
          }}
        >
          Imprimir
        </Button>
        <Button
          variant="outlined"
          startIcon={<Icon icon="mdi:close" />}
          onClick={handleClose}
          sx={{
            boxShadow: 3,
            backgroundColor: 'background.paper',
          }}
        >
          Cerrar
        </Button>
      </Box>

      {/* Invoice Content */}
      <Box
        sx={{
          maxWidth: '8.5in',
          margin: '0 auto',
          padding: { xs: 2, sm: 3 },
          '@media print': {
            padding: 0,
            maxWidth: '100%',
          },
        }}
      >
        <PrintTransportInvoice data={documentData} />
      </Box>
    </Box>
  )
}

// This page doesn't need a layout
PrintInvoicePage.getLayout = (page: React.ReactElement) => page

export default PrintInvoicePage
