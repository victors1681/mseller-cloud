// ** Client-side PDF Generation Utility
// ** This is a lightweight client that calls the server-side PDF API

// ** Types
import { AuthValuesType } from 'src/context/types'
import { DocumentType } from 'src/types/apps/documentTypes'

/**
 * PDF Generation Options
 */
export interface PDFGenerationOptions {
  format?: 'A4' | 'Letter' | 'Legal'
  orientation?: 'portrait' | 'landscape'
  includeBackground?: boolean
  margin?: {
    top?: string
    right?: string
    bottom?: string
    left?: string
  }
  userData?: AuthValuesType
  documentType?: string
  templateId?: string
}

/**
 * Simple client-side PDF utility that calls the server API
 */
export class EnhancedPDFGenerator {
  /**
   * Generate PDF blob by calling the server API
   */
  static async generatePDF(
    documentData: DocumentType,
    options: PDFGenerationOptions = {},
  ): Promise<Blob> {
    try {
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document: documentData,
          documentType: options.documentType,
          templateId: options.templateId,
          options: {
            format: options.format || 'A4',
            orientation: options.orientation || 'portrait',
            includeBackground: options.includeBackground ?? true,
            margin: options.margin || {
              top: '20px',
              right: '20px',
              bottom: '20px',
              left: '20px',
            },
          },
          userData: options.userData,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`PDF generation failed: ${errorText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'PDF generation failed')
      }

      // Convert base64 to blob
      const binaryString = atob(result.pdfBase64)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      return new Blob([bytes], { type: 'application/pdf' })
    } catch (error) {
      console.error('PDF generation error:', error)
      throw error
    }
  }

  /**
   * Download PDF
   */
  static async downloadPDF(
    documentData: DocumentType,
    filename?: string,
    options: PDFGenerationOptions = {},
  ): Promise<void> {
    try {
      const pdfBlob = await this.generatePDF(documentData, options)

      // Create download link
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || `document-${Date.now()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF download error:', error)
      throw error
    }
  }

  /**
   * Open PDF in new tab
   */
  static async openPDF(
    documentData: DocumentType,
    options: PDFGenerationOptions = {},
  ): Promise<void> {
    try {
      const pdfBlob = await this.generatePDF(documentData, options)

      // Open in new tab
      const url = URL.createObjectURL(pdfBlob)
      const newWindow = window.open(url, '_blank')

      if (!newWindow) {
        throw new Error('Unable to open PDF in new tab. Check popup blocker.')
      }

      // Clean up URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (error) {
      console.error('PDF open error:', error)
      throw error
    }
  }

  /**
   * Print PDF
   */
  static async printPDF(
    documentData: DocumentType,
    options: PDFGenerationOptions = {},
  ): Promise<void> {
    try {
      const pdfBlob = await this.generatePDF(documentData, options)

      // Create object URL and open print dialog
      const url = URL.createObjectURL(pdfBlob)
      const printWindow = window.open(url, '_blank')

      if (!printWindow) {
        throw new Error('Unable to open print dialog. Check popup blocker.')
      }

      // Wait for load and trigger print
      printWindow.onload = () => {
        printWindow.print()
      }

      // Clean up URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 2000)
    } catch (error) {
      console.error('PDF print error:', error)
      throw error
    }
  }
}

/**
 * React Hook for PDF operations
 */
export const usePDFOperations = () => {
  const downloadPDF = async (
    documentData: DocumentType,
    filename?: string,
    options?: PDFGenerationOptions,
  ) => {
    return EnhancedPDFGenerator.downloadPDF(documentData, filename, options)
  }

  const openPDF = async (
    documentData: DocumentType,
    options?: PDFGenerationOptions,
  ) => {
    return EnhancedPDFGenerator.openPDF(documentData, options)
  }

  const printPDF = async (
    documentData: DocumentType,
    options?: PDFGenerationOptions,
  ) => {
    return EnhancedPDFGenerator.printPDF(documentData, options)
  }

  const generateBlob = async (
    documentData: DocumentType,
    options?: PDFGenerationOptions,
  ) => {
    return EnhancedPDFGenerator.generatePDF(documentData, options)
  }

  // Convenience methods for different PDF formats
  const downloadHighQuality = async (
    documentData: DocumentType,
    filename?: string,
    options?: PDFGenerationOptions,
  ) => {
    return EnhancedPDFGenerator.downloadPDF(documentData, filename, {
      ...options,
      format: 'A4',
      includeBackground: true,
      margin: {
        top: '15px',
        right: '15px',
        bottom: '15px',
        left: '15px',
      },
    })
  }

  const downloadLandscape = async (
    documentData: DocumentType,
    filename?: string,
    options?: PDFGenerationOptions,
  ) => {
    return EnhancedPDFGenerator.downloadPDF(documentData, filename, {
      ...options,
      orientation: 'landscape',
      format: 'A4',
    })
  }

  const downloadMobileOptimized = async (
    documentData: DocumentType,
    filename?: string,
    options?: PDFGenerationOptions,
  ) => {
    return EnhancedPDFGenerator.downloadPDF(documentData, filename, {
      ...options,
      format: 'A4',
      margin: {
        top: '10px',
        right: '10px',
        bottom: '10px',
        left: '10px',
      },
    })
  }

  return {
    downloadPDF,
    openPDF,
    printPDF,
    generateBlob,
    downloadHighQuality,
    downloadLandscape,
    downloadMobileOptimized,
  }
}

// Default export for backward compatibility
export default EnhancedPDFGenerator
