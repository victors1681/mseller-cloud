// ** React Imports
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'

// ** MUI Imports
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'

// ** Theme
import { createTheme } from '@mui/material/styles'
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { DocumentType } from 'src/types/apps/documentTypes'

// ** Component
import PreviewCard from 'src/views/apps/documents/preview/PreviewCard'

// ** PDF Configuration
import {
  createHighQualityPDFOptions,
  createLandscapePDFOptions,
  createMobilePDFOptions,
  createPDFOptions,
  getOptimalPDFOptions,
  isMobileEnvironment,
  type PDFConfigOptions,
} from './pdfConfig'

// ** Debug utilities
import { debugPDFRendering, testSimplePDF } from './pdfDebug'

/**
 * Creates an HTML template for PDF generation when React rendering fails
 */
const createHTMLTemplate = (documentData: DocumentType): string => {
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString()

  return `
    <div style="font-family: Arial, sans-serif; color: #000; background: #fff; padding: 20px; line-height: 1.4;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
        <h1 style="margin: 0; color: #333; font-size: 28px;">${documentData.tipoDocumento.toUpperCase()}</h1>
        <h2 style="margin: 10px 0 0 0; color: #666; font-size: 18px;">${
          documentData.noPedidoStr
        }</h2>
      </div>

      <!-- Document Info -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div style="flex: 1;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Información del Documento</h3>
          <p style="margin: 5px 0;"><strong>Número:</strong> ${
            documentData.noPedidoStr
          }</p>
          <p style="margin: 5px 0;"><strong>Fecha:</strong> ${formatDate(
            documentData.fecha,
          )}</p>
          <p style="margin: 5px 0;"><strong>Vendedor:</strong> ${
            documentData.vendedor?.nombre || documentData.codigoVendedor
          }</p>
          <p style="margin: 5px 0;"><strong>Condición:</strong> ${
            documentData.condicion?.descripcion || documentData.condicionPago
          }</p>
        </div>
        
        <div style="flex: 1; margin-left: 40px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Cliente</h3>
          <p style="margin: 5px 0;"><strong>Código:</strong> ${
            documentData.codigoCliente
          }</p>
          <p style="margin: 5px 0;"><strong>Nombre:</strong> ${
            documentData.nombreCliente
          }</p>
          <p style="margin: 5px 0;"><strong>Dirección:</strong> ${
            documentData.cliente?.direccion || 'N/A'
          }</p>
          <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${
            documentData.cliente?.telefono1 || 'N/A'
          }</p>
        </div>
      </div>

      <!-- Details Table -->
      <div style="margin-bottom: 30px;">
        <h3 style="margin: 0 0 15px 0; color: #333;">Detalles</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd; font-weight: bold;">Código</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd; font-weight: bold;">Descripción</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd; font-weight: bold;">Cant.</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd; font-weight: bold;">Precio</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd; font-weight: bold;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${
              documentData.detalle
                ?.map(
                  (item: any) => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${
                  item.codigo || 'N/A'
                }</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${
                  item.descripcion || 'N/A'
                }</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${
                  item.cantidad || 0
                }</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(
                  item.precio || 0,
                )}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(
                  (item.cantidad || 0) * (item.precio || 0),
                )}</td>
              </tr>
            `,
                )
                .join('') ||
              '<tr><td colspan="5" style="padding: 20px; text-align: center; border: 1px solid #ddd;">No hay detalles disponibles</td></tr>'
            }
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div style="display: flex; justify-content: flex-end;">
        <div style="width: 300px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 10px; text-align: right; font-weight: bold; border-top: 1px solid #ddd;">Subtotal:</td>
              <td style="padding: 5px 10px; text-align: right; border-top: 1px solid #ddd;">${formatCurrency(
                documentData.subTotal || 0,
              )}</td>
            </tr>
            ${
              documentData.descuento > 0
                ? `
            <tr>
              <td style="padding: 5px 10px; text-align: right; font-weight: bold;">Descuento:</td>
              <td style="padding: 5px 10px; text-align: right;">${formatCurrency(
                documentData.descuento,
              )}</td>
            </tr>
            `
                : ''
            }
            ${
              documentData.impuesto > 0
                ? `
            <tr>
              <td style="padding: 5px 10px; text-align: right; font-weight: bold;">Impuesto:</td>
              <td style="padding: 5px 10px; text-align: right;">${formatCurrency(
                documentData.impuesto,
              )}</td>
            </tr>
            `
                : ''
            }
            <tr>
              <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px; border-top: 2px solid #333;">TOTAL:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px; border-top: 2px solid #333;">${formatCurrency(
                documentData.total || 0,
              )}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Footer -->
      ${
        documentData.nota
          ? `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        <h4 style="margin: 0 0 10px 0; color: #333;">Notas:</h4>
        <p style="margin: 0; color: #666;">${documentData.nota}</p>
      </div>
      `
          : ''
      }
      
      <div style="margin-top: 40px; text-align: center; color: #999; font-size: 12px;">
        <p style="margin: 0;">Generado por MSeller Cloud - ${new Date().toLocaleDateString()}</p>
      </div>
    </div>
  `
}

// ** Create MUI theme for PDF generation
const pdfTheme = createTheme({
  ...themeConfig,
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
})

interface GeneratePDFOptions extends Omit<PDFConfigOptions, 'documentData'> {
  documentData: DocumentType
  onProgress?: (progress: number) => void
  onSuccess?: () => void
  onError?: (error: Error) => void
  useOptimalSettings?: boolean
}

/**
 * Generates a PDF from document data using html2pdf.js
 *
 * **IMPORTANT**: This function only works on the client-side due to browser API dependencies.
 * It includes automatic SSR protection and will throw an error if called on the server.
 *
 * @param options - PDF generation options including document data and callbacks
 * @returns Promise that resolves when PDF is generated and shared/downloaded
 * @throws Error if called on server-side (SSR)
 */
export const generateDocumentPDF = async ({
  documentData,
  filename,
  customMargin,
  imageQuality,
  scale,
  windowDimensions,
  orientation,
  format,
  useOptimalSettings = true,
  onProgress,
  onSuccess,
  onError,
}: GeneratePDFOptions): Promise<void> => {
  try {
    // Check if running on client side
    if (typeof window === 'undefined') {
      throw new Error('PDF generation can only run on the client side')
    }

    // Dynamic import of html2pdf to avoid SSR issues
    const html2pdf = (await import('html2pdf.js')).default

    // Create a temporary container for rendering
    const tempContainer = window.document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '0'
    tempContainer.style.width = '210mm' // A4 width
    tempContainer.style.minHeight = '297mm' // A4 height
    tempContainer.style.backgroundColor = 'white'
    tempContainer.style.fontFamily = 'Arial, sans-serif'
    tempContainer.style.padding = '20px'
    tempContainer.style.boxSizing = 'border-box'
    tempContainer.style.overflow = 'visible'
    tempContainer.style.zIndex = '9999'
    window.document.body.appendChild(tempContainer)

    // Try to render with React first, fallback to HTML if it fails
    let renderSuccess = false
    let root: any = null

    try {
      // Create React root and render component
      root = createRoot(tempContainer)

      const component = createElement(
        ThemeProvider,
        { theme: pdfTheme },
        createElement(CssBaseline),
        createElement(PreviewCard, { data: documentData }),
      )

      // Render component and wait for it to be fully rendered
      await new Promise<void>((resolve) => {
        root.render(component)
        // Use a longer timeout and check if content is actually rendered
        setTimeout(() => {
          // Force a reflow to ensure all styles are applied
          tempContainer.offsetHeight

          // Check if React component actually rendered content
          const hasReactContent =
            tempContainer.querySelector('[data-reactroot]') ||
            tempContainer.children.length > 0

          if (hasReactContent) {
            renderSuccess = true
          }

          resolve()
        }, 3000) // Increased timeout even more
      })

      // Clean up React if it didn't render properly
      if (!renderSuccess) {
        root.unmount()
        tempContainer.innerHTML = '' // Clear any partial content
      }
    } catch (reactError) {
      console.warn(
        'React rendering failed, falling back to HTML template:',
        reactError,
      )
      renderSuccess = false
      tempContainer.innerHTML = '' // Clear any partial content
    }

    // Fallback: Use HTML template if React rendering failed
    if (!renderSuccess) {
      console.log('Using HTML fallback template for PDF generation')
      tempContainer.innerHTML = createHTMLTemplate(documentData)
      // Wait a bit for any CSS to apply
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    // Additional check to ensure content is rendered
    if (
      tempContainer.scrollHeight === 0 ||
      tempContainer.innerHTML.trim() === ''
    ) {
      console.error('PDF Generation Debug Info:', {
        scrollHeight: tempContainer.scrollHeight,
        offsetHeight: tempContainer.offsetHeight,
        innerHTML: tempContainer.innerHTML.substring(0, 200) + '...',
        hasChildren: tempContainer.children.length > 0,
      })
      throw new Error('Component failed to render - no content generated')
    }

    // Debug logging (can be removed in production)
    console.log('PDF Generation Debug:', {
      containerDimensions: {
        scrollHeight: tempContainer.scrollHeight,
        scrollWidth: tempContainer.scrollWidth,
        offsetHeight: tempContainer.offsetHeight,
        offsetWidth: tempContainer.offsetWidth,
      },
      documentData: {
        noPedidoStr: documentData.noPedidoStr,
        tipoDocumento: documentData.tipoDocumento,
      },
    })

    // Get PDF configuration using the utility function
    const options = useOptimalSettings
      ? getOptimalPDFOptions(documentData, filename)
      : createPDFOptions({
          documentData,
          filename,
          customMargin,
          imageQuality,
          scale,
          windowDimensions,
          orientation,
          format,
        })

    // Add dynamic dimensions from rendered container
    const containerHeight = Math.max(
      tempContainer.scrollHeight,
      tempContainer.offsetHeight,
      800,
    )
    const containerWidth = Math.max(
      tempContainer.scrollWidth,
      tempContainer.offsetWidth,
      600,
    )

    options.html2canvas.height = containerHeight
    options.html2canvas.width = containerWidth

    // Enhanced html2canvas options for better rendering
    options.html2canvas = {
      ...options.html2canvas,
      logging: false, // Disable logging for cleaner output
      letterRendering: true, // Better text rendering
      foreignObjectRendering: true, // Better compatibility
      imageTimeout: 15000, // Longer timeout for images
      removeContainer: false, // Keep container for debugging
      onclone: (clonedDoc: Document, element: HTMLElement) => {
        // Ensure all styles are applied in the cloned document
        const style = clonedDoc.createElement('style')
        style.textContent = `
          * { 
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body { margin: 0; padding: 0; }
        `
        clonedDoc.head.appendChild(style)
      },
    }

    // Progress callback wrapper
    const progressCallback = (progress: number) => {
      if (onProgress) {
        onProgress(Math.round(progress * 100))
      }
    }

    // Generate PDF
    const pdfDataUri = await html2pdf()
      .set(options)
      .from(tempContainer)
      .outputPdf('datauristring')

    // Check if PDF is blank (too small data URI indicates empty PDF)
    if (!pdfDataUri || pdfDataUri.length < 1000) {
      console.error('Generated PDF appears to be blank or too small:', {
        dataUriLength: pdfDataUri?.length || 0,
        containerContent: tempContainer.innerHTML.substring(0, 500),
      })

      // Try debug rendering to help identify the issue
      console.log('Running debug rendering to help identify the issue...')
      await debugPDFRendering(documentData)

      throw new Error(
        'Generated PDF is blank or invalid. Check browser console for debug information.',
      )
    }

    // Clean up React components (only if React was used)
    if (root && renderSuccess) {
      root.unmount()
    }
    window.document.body.removeChild(tempContainer)

    // Handle mobile sharing
    if (navigator.share && navigator.canShare) {
      // Convert data URI to blob for native sharing
      const byteCharacters = atob(pdfDataUri.split(',')[1])
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })

      const file = new File([blob], options.filename, {
        type: 'application/pdf',
      })

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Documento ${documentData.noPedidoStr}`,
          text: `Documento ${documentData.tipoDocumento} - ${documentData.noPedidoStr}`,
          files: [file],
        })
        return
      }
    }

    // Fallback: Download the PDF
    const link = window.document.createElement('a')
    link.href = pdfDataUri
    link.download = options.filename
    link.style.display = 'none'
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)

    if (onSuccess) {
      onSuccess()
    }
  } catch (error) {
    console.error('Error generating PDF:', error)
    if (onError) {
      onError(
        error instanceof Error ? error : new Error('Failed to generate PDF'),
      )
    }
  }
}

// Helper function for email sharing with PDF attachment
export const shareDocumentByEmail = async (
  documentData: DocumentType,
  recipientEmail?: string,
): Promise<void> => {
  try {
    // Check if running on client side
    if (typeof window === 'undefined') {
      throw new Error('Email sharing can only run on the client side')
    }
    const subject = `Documento ${documentData.tipoDocumento} - ${documentData.noPedidoStr}`
    const body = `
Estimado cliente,

Adjunto encontrará el documento ${documentData.tipoDocumento} #${
      documentData.noPedidoStr
    }.

Detalles del documento:
- Tipo: ${documentData.tipoDocumento}
- Número: ${documentData.noPedidoStr}
- Fecha: ${new Date(documentData.fecha).toLocaleDateString()}
- Total: $${documentData.total.toFixed(2)}

Gracias por su preferencia.

---
Este documento fue generado por MSeller Cloud
    `.trim()

    if (navigator.share && typeof navigator.share === 'function') {
      // Generate PDF and share via native sharing
      await generateDocumentPDF({
        documentData,
        filename: `documento-${documentData.noPedidoStr}.pdf`,
      })
    } else {
      // Fallback: Open email client with pre-filled content
      const emailParams = new URLSearchParams({
        subject,
        body,
        ...(recipientEmail && { to: recipientEmail }),
      })

      const mailtoUrl = `mailto:${
        recipientEmail || ''
      }?${emailParams.toString()}`
      window.open(mailtoUrl, '_blank')
    }
  } catch (error) {
    console.error('Error sharing document by email:', error)
    throw error
  }
}

// Function to check if native sharing is available
export const isNativeSharingAvailable = (): boolean => {
  if (typeof window === 'undefined') return false
  return !!(
    navigator.share &&
    typeof navigator.share === 'function' &&
    navigator.canShare &&
    typeof navigator.canShare === 'function'
  )
}

/**
 * Checks if PDF generation is available (client-side only)
 *
 * Use this function before calling generateDocumentPDF to ensure
 * you're not trying to generate PDFs during server-side rendering.
 *
 * @returns true if running on client-side, false if on server-side
 */
export const isPDFGenerationAvailable = (): boolean => {
  return typeof window !== 'undefined'
}

// Re-export PDF configuration utilities for convenience
export {
  createHighQualityPDFOptions,
  createLandscapePDFOptions,
  createMobilePDFOptions,
  createPDFOptions,
  getOptimalPDFOptions,
  isMobileEnvironment,
  type PDFConfigOptions,
  type PDFOptions,
} from './pdfConfig'

// Function to get optimal PDF settings for mobile (deprecated - use getOptimalPDFOptions instead)
export const getMobilePDFSettings = () => ({
  pageSize: 'A4',
  margin: 10,
  quality: 0.85,
  scale: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
})

// Export debug utilities
export { debugPDFRendering, testSimplePDF }

export default {
  generateDocumentPDF,
  shareDocumentByEmail,
  isNativeSharingAvailable,
  isPDFGenerationAvailable,
  getMobilePDFSettings,
  // New PDF configuration utilities
  createPDFOptions,
  createMobilePDFOptions,
  createHighQualityPDFOptions,
  createLandscapePDFOptions,
  getOptimalPDFOptions,
  isMobileEnvironment,
  // Debug utilities
  debugPDFRendering,
  testSimplePDF,
}
