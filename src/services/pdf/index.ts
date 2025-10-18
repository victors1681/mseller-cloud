// ** PDF Templates Index
// Central registry for all PDF templates

// Template Imports
import {
  InvoiceTemplate,
  QuoteTemplate,
  StandardBusinessDocumentTemplate,
} from './templates/businessDocuments'
import {
  CreditDebitNoteTemplate,
  PaymentReceiptTemplate,
  ReturnOrderTemplate,
} from './templates/receiptDocuments'
import {
  GenericReportTemplate,
  SalesReportTemplate,
} from './templates/reportTemplates'

// Base classes and registry
import { templateEngine, templateRegistry } from './base'

// ============================================
// Template Registration
// ============================================

/**
 * Register all available templates
 */
export function registerAllTemplates(): void {
  // Business Document Templates
  templateRegistry.register(new StandardBusinessDocumentTemplate())
  templateRegistry.register(new InvoiceTemplate())
  templateRegistry.register(new QuoteTemplate())

  // Receipt and Financial Document Templates
  templateRegistry.register(new PaymentReceiptTemplate())
  templateRegistry.register(new CreditDebitNoteTemplate())
  templateRegistry.register(new ReturnOrderTemplate())

  // Report Templates
  templateRegistry.register(new GenericReportTemplate())
  templateRegistry.register(new SalesReportTemplate())
}

/**
 * Initialize the PDF template system
 */
export function initializePDFTemplateSystem(): void {
  registerAllTemplates()
  console.log(
    'PDF Template System initialized with',
    templateRegistry.getAvailableTemplates().length,
    'templates',
  )
}

// ============================================
// Template Helper Functions
// ============================================

/**
 * Get available templates for a document type
 */
export function getTemplatesForDocumentType(documentType: string) {
  return templateRegistry.getAvailableTemplates(documentType)
}

/**
 * Get the best template for a document type
 */
export function getBestTemplateForDocument(
  documentType: string,
  templateId?: string,
) {
  return templateRegistry.getTemplate(documentType, templateId)
}

/**
 * Render a document using the template system
 */
export async function renderDocumentPDF(
  documentType: string,
  document: any,
  userData?: any,
  options?: any,
  templateId?: string,
): Promise<string> {
  // Debug: Document rendering started
  console.log('renderDocumentPDF:', documentType)

  const template = templateRegistry.getTemplate(documentType, templateId)
  if (!template) {
    throw new Error(`No template found for document type: ${documentType}`)
  }

  console.log('Using template:', template.templateId)

  const context = {
    document,
    userData,
    options,
    metadata: {
      generatedAt: new Date().toISOString(),
      version: template.version,
      templateId: template.templateId,
    },
  }

  return templateEngine.renderTemplate(template, context)
}

// ============================================
// Exports
// ============================================

// Export everything for external use
export * from './base'
export * from './components'
export * from './templates/businessDocuments'
export * from './templates/receiptDocuments'
export * from './templates/reportTemplates'
export { templateEngine, templateRegistry }

// Export types
export * from '../../types/apps/pdfTemplateTypes'

// Auto-initialize when imported
initializePDFTemplateSystem()