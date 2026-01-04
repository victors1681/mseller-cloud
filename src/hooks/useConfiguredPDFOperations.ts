// ** React Imports
import { useCallback } from 'react'

// ** PDF Client
import {
  EnhancedPDFGenerator,
  PDFGenerationOptions,
} from 'src/services/pdf/client'

// ** Services
import {
  getConfiguredTemplateId,
  mapDocumentTypeToNumerico,
} from 'src/services/templateConfigService'

// ** Types
import { DocumentType } from 'src/types/apps/documentTypes'

/**
 * Enhanced PDF Operations Hook with automatic template configuration
 * This hook automatically fetches the configured template for a document type
 * and passes it to the PDF generation functions
 */
export const useConfiguredPDFOperations = () => {
  /**
   * Get template ID for a document
   */
  const getTemplateForDocument = useCallback(
    async (document: DocumentType): Promise<number | null> => {
      const tipoDocumentoNumerico = mapDocumentTypeToNumerico(
        document.tipoDocumento,
      )
      if (!tipoDocumentoNumerico) {
        console.warn(
          `No template mapping found for document type: ${document.tipoDocumento}`,
        )
        return null
      }

      try {
        const templateId = await getConfiguredTemplateId(tipoDocumentoNumerico)
        return templateId
      } catch (error) {
        console.error('Error fetching configured template:', error)
        return null
      }
    },
    [],
  )

  /**
   * Download PDF with configured template
   */
  const downloadPDF = useCallback(
    async (
      document: DocumentType,
      filename?: string,
      options?: PDFGenerationOptions,
    ) => {
      const templateId = await getTemplateForDocument(document)

      return EnhancedPDFGenerator.downloadPDF(document, filename, {
        ...options,
        templateId: templateId?.toString() || options?.templateId,
        documentType: document.tipoDocumento,
      })
    },
    [getTemplateForDocument],
  )

  /**
   * Open PDF with configured template
   */
  const openPDF = useCallback(
    async (document: DocumentType, options?: PDFGenerationOptions) => {
      const templateId = await getTemplateForDocument(document)

      return EnhancedPDFGenerator.openPDF(document, {
        ...options,
        templateId: templateId?.toString() || options?.templateId,
        documentType: document.tipoDocumento,
      })
    },
    [getTemplateForDocument],
  )

  /**
   * Print PDF with configured template
   */
  const printPDF = useCallback(
    async (document: DocumentType, options?: PDFGenerationOptions) => {
      const templateId = await getTemplateForDocument(document)

      return EnhancedPDFGenerator.printPDF(document, {
        ...options,
        templateId: templateId?.toString() || options?.templateId,
        documentType: document.tipoDocumento,
      })
    },
    [getTemplateForDocument],
  )

  /**
   * Generate PDF blob with configured template
   */
  const generateBlob = useCallback(
    async (document: DocumentType, options?: PDFGenerationOptions) => {
      const templateId = await getTemplateForDocument(document)

      return EnhancedPDFGenerator.generatePDF(document, {
        ...options,
        templateId: templateId?.toString() || options?.templateId,
        documentType: document.tipoDocumento,
      })
    },
    [getTemplateForDocument],
  )

  /**
   * Download high quality PDF with configured template
   */
  const downloadHighQuality = useCallback(
    async (
      document: DocumentType,
      filename?: string,
      options?: PDFGenerationOptions,
    ) => {
      const templateId = await getTemplateForDocument(document)

      return EnhancedPDFGenerator.downloadPDF(document, filename, {
        ...options,
        templateId: templateId?.toString() || options?.templateId,
        documentType: document.tipoDocumento,
        format: 'A4',
        includeBackground: true,
        margin: {
          top: '15px',
          right: '15px',
          bottom: '15px',
          left: '15px',
        },
      })
    },
    [getTemplateForDocument],
  )

  /**
   * Download landscape PDF with configured template
   */
  const downloadLandscape = useCallback(
    async (
      document: DocumentType,
      filename?: string,
      options?: PDFGenerationOptions,
    ) => {
      const templateId = await getTemplateForDocument(document)

      return EnhancedPDFGenerator.downloadPDF(document, filename, {
        ...options,
        templateId: templateId?.toString() || options?.templateId,
        documentType: document.tipoDocumento,
        orientation: 'landscape',
        format: 'A4',
      })
    },
    [getTemplateForDocument],
  )

  /**
   * Download mobile optimized PDF with configured template
   */
  const downloadMobileOptimized = useCallback(
    async (
      document: DocumentType,
      filename?: string,
      options?: PDFGenerationOptions,
    ) => {
      const templateId = await getTemplateForDocument(document)

      return EnhancedPDFGenerator.downloadPDF(document, filename, {
        ...options,
        templateId: templateId?.toString() || options?.templateId,
        documentType: document.tipoDocumento,
        format: 'A4',
        margin: {
          top: '10px',
          right: '10px',
          bottom: '10px',
          left: '10px',
        },
      })
    },
    [getTemplateForDocument],
  )

  return {
    downloadPDF,
    openPDF,
    printPDF,
    generateBlob,
    downloadHighQuality,
    downloadLandscape,
    downloadMobileOptimized,
    getTemplateForDocument,
  }
}
