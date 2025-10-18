// ** Enhanced PDF Generation API using Modular Template System
import type { NextApiRequest, NextApiResponse } from 'next/types'
import puppeteer from 'puppeteer'

// ** Types
import { DocumentType } from 'src/types/apps/documentTypes'
import { UserTypes } from 'src/types/apps/userTypes'

// ** PDF Template System
import { getBestTemplateForDocument, renderDocumentPDF } from 'src/services/pdf'

/**
 * PDF Generation Request Interface
 */
interface GeneratePDFRequest {
  document: DocumentType | any // Support other document types
  documentType?: string // Explicit document type
  templateId?: string // Optional specific template ID
  options?: {
    format?: 'A4' | 'Letter' | 'Legal'
    orientation?: 'portrait' | 'landscape'
    includeBackground?: boolean
    margin?: {
      top?: string
      right?: string
      bottom?: string
      left?: string
    }
  }
  userData?: {
    user?: UserTypes | null
  }
}

/**
 * PDF Generation Response Interface
 */
interface GeneratePDFResponse {
  success: boolean
  error?: string
  pdfBase64?: string
  templateUsed?: string
  metadata?: {
    templateId: string
    documentType: string
    generatedAt: string
    version: string
  }
}

/**
 * Generate HTML template using the modular template system
 */
const generateHTMLTemplate = async (
  documentData: any,
  documentType: string,
  userData?: { user?: UserTypes | null },
  options?: any,
  templateId?: string,
): Promise<{ html: string; templateUsed: string }> => {
  // Debug: Template generation started
  console.log('generateHTMLTemplate:', documentType)

  // Use the business documents template system to render the document
  const html = await renderDocumentPDF(
    documentType,
    documentData,
    userData,
    options,
    templateId,
  )

  // Get the template that was used
  const template = getBestTemplateForDocument(documentType, templateId)
  const templateUsed = template?.templateId || 'business-document'

  return { html, templateUsed }
}

/**
 * Main API handler
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeneratePDFResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    })
  }

  try {
    const {
      document: documentData,
      documentType,
      templateId,
      options = {},
      userData,
    }: GeneratePDFRequest = req.body

    // Debug logging
    // Debug logging
    console.log('PDF Generation Request:', {
      hasDocument: !!documentData,
      documentType: documentType || 'auto-detect',
      templateId: templateId || 'auto-select',
    })

    if (!documentData) {
      return res.status(400).json({
        success: false,
        error: 'Document data is required',
      })
    }

    // Determine document type
    const resolvedDocumentType =
      documentType ||
      documentData.tipoDocumento ||
      documentData.type ||
      documentData.documentType ||
      'order'

    // Generate HTML template using the modular system
    const { html: htmlContent, templateUsed } = await generateHTMLTemplate(
      documentData,
      resolvedDocumentType,
      userData,
      options,
      templateId,
    )

    // Launch Puppeteer browser
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
      ],
    })

    try {
      const page = await browser.newPage()

      // Set content
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      })

      // Configure PDF options
      const pdfOptions = {
        format: options.format || ('A4' as const),
        landscape: options.orientation === 'landscape',
        printBackground: options.includeBackground !== false,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
          ...options.margin,
        },
        preferCSSPageSize: true,
      }

      // Generate PDF
      const pdfBuffer = await page.pdf(pdfOptions)

      // Convert to base64
      const pdfBase64 = Buffer.from(pdfBuffer).toString('base64')

      return res.status(200).json({
        success: true,
        pdfBase64,
        templateUsed,
        metadata: {
          templateId: templateUsed,
          documentType: resolvedDocumentType,
          generatedAt: new Date().toISOString(),
          version: '2.0.0',
        },
      })
    } finally {
      await browser.close()
    }
  } catch (error) {
    console.error('PDF Generation Error:', error)

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
