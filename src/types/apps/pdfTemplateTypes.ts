// ** Base PDF Template System Types and Interfaces

import { DocumentType } from './documentTypes'
import { UserTypes } from './userTypes'

// ============================================
// Core Interfaces
// ============================================

/**
 * PDF Generation Options
 */
export interface PDFOptions {
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

/**
 * Template Context - Data available to all templates
 */
export interface TemplateContext {
  document: DocumentType | any // Support other document types
  userData?: {
    user?: UserTypes | null
  }
  options?: PDFOptions
  metadata?: {
    generatedAt: string
    version: string
    [key: string]: any
  }
}

/**
 * Template Component Interface
 * Represents a reusable component that can be used across templates
 */
export interface PDFTemplateComponent {
  name: string
  render(context: TemplateContext): string
}

/**
 * Base PDF Template Interface
 * All PDF templates must implement this interface
 */
export interface PDFTemplate {
  templateId: string
  templateName: string
  documentTypes: string[]
  version: string

  // Main rendering method
  render(context: TemplateContext): string

  // Template validation
  validate(context: TemplateContext): boolean

  // Template metadata
  getMetadata(): TemplateMetadata
}

/**
 * Template Metadata
 */
export interface TemplateMetadata {
  id: string
  name: string
  description: string
  documentTypes: string[]
  version: string
  author?: string
  createdAt: string
  updatedAt: string
  tags?: string[]
}

/**
 * Template Registry Interface
 */
export interface PDFTemplateRegistry {
  register(template: PDFTemplate): void
  unregister(templateId: string): void
  getTemplate(documentType: string, templateId?: string): PDFTemplate | null
  getAvailableTemplates(documentType?: string): TemplateMetadata[]
  hasTemplate(templateId: string): boolean
  getAllTemplates(): PDFTemplate[]
  getTemplatesByDocumentType(documentType: string): PDFTemplate[]
}

/**
 * Template Engine Interface
 */
export interface PDFTemplateEngine {
  render(templateId: string, context: TemplateContext): Promise<string>
  renderTemplate(
    template: PDFTemplate,
    context: TemplateContext,
  ): Promise<string>
  registerTemplate(template: PDFTemplate): void
  registerComponent(component: PDFTemplateComponent): void
}

// ============================================
// Template Component Types
// ============================================

/**
 * Business Header Component Data
 */
export interface BusinessHeaderData {
  name?: string
  rnc?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  logoUrl?: string
}

/**
 * Document Header Component Data
 */
export interface DocumentHeaderData {
  title: string
  documentNumber: string
  date: string
  status?: string
  type?: string
}

/**
 * Customer Info Component Data
 */
export interface CustomerInfoData {
  name: string
  address?: string
  phone?: string
  email?: string
  id?: string
  taxId?: string
}

/**
 * Items Table Component Data
 */
export interface ItemsTableData {
  items: Array<{
    id?: string
    name: string
    description?: string
    quantity: number
    unitPrice: number
    total: number
    tax?: number
    discount?: number
  }>
  showTax?: boolean
  showDiscount?: boolean
  currency?: string
}

/**
 * Totals Summary Component Data
 */
export interface TotalsSummaryData {
  subtotal?: number
  discount?: number
  tax?: number
  total: number
  currency?: string
}

/**
 * Footer Component Data
 */
export interface FooterData {
  message?: string
  website?: string
  generatedBy?: string
  generatedAt?: string
}

// ============================================
// Document Type Specific Interfaces
// ============================================

/**
 * Payment Receipt Document Interface
 */
export interface PaymentReceiptDocument {
  receiptNumber: string
  paymentDate: string
  paymentMethod: string
  amount: number
  currency: string
  customer: CustomerInfoData
  description?: string
  reference?: string
  notes?: string
  appliedToInvoices?: Array<{
    invoiceNumber: string
    amount: number
  }>
}

/**
 * Report Document Interface
 */
export interface ReportDocument {
  reportTitle: string
  reportType: string
  generatedDate: string
  dateRange?: {
    from: string
    to: string
  }
  filters?: Record<string, any>
  data: any
  summary?: Record<string, any>
  charts?: Array<{
    type: string
    title: string
    data: any
  }>
}

/**
 * Credit/Debit Note Document Interface
 */
export interface CreditDebitNoteDocument extends DocumentType {
  noteType: 'credit' | 'debit'
  originalInvoiceNumber: string
  reason: string
  adjustmentAmount: number
}

// ============================================
// Error Types
// ============================================

export class PDFTemplateError extends Error {
  constructor(
    message: string,
    public templateId?: string,
    public context?: any,
  ) {
    super(message)
    this.name = 'PDFTemplateError'
  }
}

export class TemplateNotFoundError extends PDFTemplateError {
  constructor(templateId: string, documentType?: string) {
    super(
      `Template '${templateId}' not found${
        documentType ? ` for document type '${documentType}'` : ''
      }`,
      templateId,
    )
    this.name = 'TemplateNotFoundError'
  }
}

export class TemplateValidationError extends PDFTemplateError {
  constructor(templateId: string, errors: string[]) {
    super(
      `Template validation failed: ${errors.join(', ')}`,
      templateId,
      errors,
    )
    this.name = 'TemplateValidationError'
  }
}
