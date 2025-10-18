// ** Payment Receipt Templates
// Templates for payment receipts, credit notes, and financial documents

import { TipoDocumentoEnum } from '../../../types/apps/documentTypes'
import {
  CreditDebitNoteDocument,
  PaymentReceiptDocument,
  TemplateContext,
} from '../../../types/apps/pdfTemplateTypes'
import { formatCurrency } from '../../../utils/formatCurrency'
import formatDate from '../../../utils/formatDate'
import { BasePDFTemplate } from '../base'

// ============================================
// Payment Receipt Template
// ============================================

/**
 * Payment Receipt Template
 * Specialized template for payment receipts
 */
export class PaymentReceiptTemplate extends BasePDFTemplate {
  templateId = 'payment-receipt'
  templateName = 'Payment Receipt Template'
  documentTypes = [TipoDocumentoEnum.RECEIPT]
  version = '1.0.0'

  render(context: TemplateContext): string {
    const doc = context.document as PaymentReceiptDocument
    const title = `Recibo de Pago - ${doc.receiptNumber || ''}`

    const content = `
      ${this.renderComponent('BusinessHeader', context)}
      ${this.renderReceiptHeader(context)}
      ${this.renderPaymentDetails(context)}
      ${this.renderAppliedInvoices(context)}
      ${this.renderComponent('Notes', context)}
      ${this.renderComponent('Footer', context)}
    `

    return this.createHTMLDocument(title, content)
  }

  private renderReceiptHeader(context: TemplateContext): string {
    const doc = context.document as PaymentReceiptDocument

    return `
      <div class="document-header">
        <div class="document-info">
          <div class="document-title">RECIBO DE PAGO</div>
          <div class="document-number">${doc.receiptNumber || ''}</div>
        </div>
        <div class="document-date">
          <div class="label">Fecha de Pago:</div>
          <div class="value">${formatDate(doc.paymentDate)}</div>
        </div>
      </div>
    `
  }

  private renderPaymentDetails(context: TemplateContext): string {
    const doc = context.document as PaymentReceiptDocument

    return `
      <div class="customer-section">
        <h3>Detalles del Pago</h3>
        <div class="customer-info">
          <div><strong>Cliente:</strong> ${doc.customer?.name || ''}</div>
          ${
            doc.customer?.id
              ? `<div><strong>ID Cliente:</strong> ${doc.customer.id}</div>`
              : ''
          }
          ${
            doc.customer?.taxId
              ? `<div><strong>RNC/Cédula:</strong> ${doc.customer.taxId}</div>`
              : ''
          }
          ${
            doc.customer?.address
              ? `<div><strong>Dirección:</strong> ${doc.customer.address}</div>`
              : ''
          }
        </div>
      </div>

      <div class="customer-section">
        <h3>Información del Pago</h3>
        <div class="customer-info">
          <div><strong>Método de Pago:</strong> ${doc.paymentMethod || ''}</div>
          <div><strong>Monto:</strong> ${formatCurrency(doc.amount)}</div>
          ${
            doc.reference
              ? `<div><strong>Referencia:</strong> ${doc.reference}</div>`
              : ''
          }
          ${
            doc.description
              ? `<div><strong>Descripción:</strong> ${doc.description}</div>`
              : ''
          }
        </div>
      </div>
    `
  }

  private renderAppliedInvoices(context: TemplateContext): string {
    const doc = context.document as PaymentReceiptDocument
    if (!doc.appliedToInvoices || doc.appliedToInvoices.length === 0) return ''

    return `
      <div class="customer-section">
        <h3>Aplicado a Facturas</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>No. Factura</th>
              <th style="width: 150px; text-align: right;">Monto Aplicado</th>
            </tr>
          </thead>
          <tbody>
            ${doc.appliedToInvoices
              .map(
                (invoice) => `
              <tr>
                <td>${invoice.invoiceNumber}</td>
                <td style="text-align: right; font-weight: 600;">${formatCurrency(
                  invoice.amount,
                )}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `
  }

  validate(context: TemplateContext): boolean {
    const doc = context.document as PaymentReceiptDocument
    if (!doc) return false

    const hasReceiptNumber = !!doc.receiptNumber
    const hasAmount = typeof doc.amount === 'number' && doc.amount > 0
    const hasCustomer = !!doc.customer?.name
    const hasPaymentMethod = !!doc.paymentMethod

    return hasReceiptNumber && hasAmount && hasCustomer && hasPaymentMethod
  }
}

// ============================================
// Credit Note Template
// ============================================

/**
 * Credit Note Template
 * Specialized template for credit and debit notes
 */
export class CreditDebitNoteTemplate extends BasePDFTemplate {
  templateId = 'credit-debit-note'
  templateName = 'Credit/Debit Note Template'
  documentTypes = [TipoDocumentoEnum.CREDIT_NOTE, TipoDocumentoEnum.DEBIT_NOTE]
  version = '1.0.0'

  render(context: TemplateContext): string {
    const doc = context.document as CreditDebitNoteDocument
    const isCredit = doc.noteType === 'credit'
    const title = `${isCredit ? 'Nota de Crédito' : 'Nota de Débito'} - ${
      doc.noPedidoStr || ''
    }`

    const content = `
      ${this.renderComponent('BusinessHeader', context)}
      ${this.renderNoteHeader(context)}
      ${this.renderComponent('CustomerInfo', context)}
      ${this.renderNoteDetails(context)}
      ${this.renderComponent('ItemsTable', context)}
      ${this.renderComponent('TotalsSummary', context)}
      ${this.renderComponent('Notes', context)}
      ${this.renderComponent('Footer', context)}
    `

    return this.createHTMLDocument(title, content)
  }

  private renderNoteHeader(context: TemplateContext): string {
    const doc = context.document as CreditDebitNoteDocument
    const isCredit = doc.noteType === 'credit'

    return `
      <div class="document-header" style="background: ${
        isCredit ? '#f0fdf4' : '#fef2f2'
      }; border-color: ${isCredit ? '#22c55e' : '#ef4444'};">
        <div class="document-info">
          <div class="document-title" style="color: ${
            isCredit ? '#15803d' : '#dc2626'
          };">
            ${isCredit ? 'NOTA DE CRÉDITO' : 'NOTA DE DÉBITO'}
          </div>
          <div class="document-number">${doc.noPedidoStr || ''}</div>
          ${
            doc.status
              ? `<div class="status-badge status-${doc.status.toLowerCase()}">${
                  doc.status
                }</div>`
              : ''
          }
        </div>
        <div class="document-date">
          <div class="label">Fecha de Emisión:</div>
          <div class="value">${formatDate(
            (doc as any).fechaPedido || new Date().toISOString(),
          )}</div>
        </div>
      </div>
    `
  }

  private renderNoteDetails(context: TemplateContext): string {
    const doc = context.document as CreditDebitNoteDocument

    return `
      <div class="customer-section">
        <h3>Detalles de la Nota</h3>
        <div class="customer-info">
          <div><strong>Factura Original:</strong> ${
            doc.originalInvoiceNumber
          }</div>
          <div><strong>Motivo:</strong> ${doc.reason}</div>
          <div><strong>Monto de Ajuste:</strong> ${formatCurrency(
            doc.adjustmentAmount,
          )}</div>
        </div>
      </div>
    `
  }

  validate(context: TemplateContext): boolean {
    const doc = context.document as CreditDebitNoteDocument
    if (!doc) return false

    const hasNoteType = doc.noteType === 'credit' || doc.noteType === 'debit'
    const hasOriginalInvoice = !!doc.originalInvoiceNumber
    const hasReason = !!doc.reason
    const hasAdjustmentAmount = typeof doc.adjustmentAmount === 'number'

    return hasNoteType && hasOriginalInvoice && hasReason && hasAdjustmentAmount
  }
}

// ============================================
// Return Order Template
// ============================================

/**
 * Return Order Template
 * Specialized template for return orders/devolutions
 */
export class ReturnOrderTemplate extends BasePDFTemplate {
  templateId = 'return-order'
  templateName = 'Return Order Template'
  documentTypes = [TipoDocumentoEnum.RETURN_ORDER]
  version = '1.0.0'

  render(context: TemplateContext): string {
    const doc = context.document as any
    const title = `Orden de Devolución - ${doc.noPedidoStr || ''}`

    const content = `
      ${this.renderComponent('BusinessHeader', context)}
      ${this.renderReturnHeader(context)}
      ${this.renderComponent('CustomerInfo', context)}
      ${this.renderReturnReason(context)}
      ${this.renderComponent('ItemsTable', context)}
      ${this.renderComponent('TotalsSummary', context)}
      ${this.renderComponent('Notes', context)}
      ${this.renderComponent('Footer', context)}
    `

    return this.createHTMLDocument(title, content)
  }

  private renderReturnHeader(context: TemplateContext): string {
    const doc = context.document as any

    return `
      <div class="document-header" style="background: #fffbeb; border-color: #f59e0b;">
        <div class="document-info">
          <div class="document-title" style="color: #92400e;">ORDEN DE DEVOLUCIÓN</div>
          <div class="document-number">${doc.noPedidoStr || ''}</div>
          ${
            doc.status
              ? `<div class="status-badge status-${doc.status.toLowerCase()}">${
                  doc.status
                }</div>`
              : ''
          }
        </div>
        <div class="document-date">
          <div class="label">Fecha de Devolución:</div>
          <div class="value">${formatDate(
            doc.fechaPedido || new Date().toISOString(),
          )}</div>
          ${
            doc.originalOrderNumber
              ? `
            <div class="label" style="margin-top: 8px;">Orden Original:</div>
            <div class="value">${doc.originalOrderNumber}</div>
          `
              : ''
          }
        </div>
      </div>
    `
  }

  private renderReturnReason(context: TemplateContext): string {
    const doc = context.document as any
    if (!doc.returnReason && !doc.motivoDevolucion) return ''

    const reason = doc.returnReason || doc.motivoDevolucion

    return `
      <div class="notes-section" style="background: #fef3c7; border-color: #f59e0b;">
        <h4 style="color: #92400e;">Motivo de Devolución:</h4>
        <p style="color: #78350f;">${reason}</p>
      </div>
    `
  }

  validate(context: TemplateContext): boolean {
    const doc = context.document as any
    if (!doc) return false

    const hasItems = doc.productos || doc.items || doc.details
    const hasReason = doc.returnReason || doc.motivoDevolucion

    return !!hasItems && !!hasReason
  }
}