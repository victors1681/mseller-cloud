// ** Standard Business Document Templates
// Templates for orders, invoices, quotes, and similar business documents

import { TipoDocumentoEnum } from '../../../types/apps/documentTypes'
import { TemplateContext } from '../../../types/apps/pdfTemplateTypes'
import { BasePDFTemplate } from '../base'

// ** Utility Functions
import { formatCurrency } from '../../../utils/formatCurrency'
import formatDate from '../../../utils/formatDate'

// ============================================
// Standard Business Document Template
// ============================================

/**
 * Standard Business Document Template
 * Used for orders, invoices, quotes, and similar documents
 */
export class StandardBusinessDocumentTemplate extends BasePDFTemplate {
  templateId = 'standard-business-document'
  templateName = 'Standard Business Document'
  documentTypes = [
    TipoDocumentoEnum.ORDER,
    TipoDocumentoEnum.BUY,
    TipoDocumentoEnum.DELIVERY_NOTE,
  ]
  version = '1.0.0'

  render(context: TemplateContext): string {
    const doc = context.document as any
    const title = `${doc.tipoDocumento || 'Documento'} - ${
      doc.noPedidoStr || doc.noDocumento || ''
    }`

    const content = `
      ${this.renderComponent('BusinessHeader', context)}
      ${this.renderComponent('DocumentHeader', context)}
      ${this.renderComponent('CustomerInfo', context)}
      ${this.renderComponent('DocumentDetails', context)}
      ${this.renderComponent('EnhancedItemsTable', context)}
      ${this.renderComponent('TotalsSummary', context)}
      ${this.renderComponent('Notes', context)}
      ${this.renderComponent('Footer', context)}
    `

    return this.createHTMLDocument(title, content)
  }

  validate(context: TemplateContext): boolean {
    const doc = context.document as any
    if (!doc) return false

    // For business documents, we need at least a document type and some identifier
    const hasDocumentType = doc.tipoDocumento || doc.documentType || doc.type
    const hasIdentifier =
      doc.noPedidoStr || doc.noDocumento || doc.id || doc.numero

    // Always return true for basic validation - let the components handle missing data gracefully
    return !!hasDocumentType || !!hasIdentifier
  }
}

// ============================================
// Invoice Template (Enhanced)
// ============================================

/**
 * Enhanced Invoice Template
 * Specialized template for invoices with additional tax and payment information
 */
export class InvoiceTemplate extends BasePDFTemplate {
  templateId = 'enhanced-invoice'
  templateName = 'Enhanced Invoice Template'
  documentTypes = [TipoDocumentoEnum.INVOICE]
  version = '1.0.0'

  render(context: TemplateContext): string {
    const doc = context.document as any
    const title = `Factura - ${doc.noPedidoStr || doc.noFactura || ''}`

    const content = `
      ${this.renderComponent('BusinessHeader', context)}
      ${this.renderInvoiceHeader(context)}
      ${this.renderComponent('CustomerInfo', context)}
      ${this.renderInvoiceDetails(context)}
      ${this.renderComponent('EnhancedItemsTable', context)}
      ${this.renderComponent('TotalsSummary', context)}
      ${this.renderPaymentInfo(context)}
      ${this.renderComponent('Notes', context)}
      ${this.renderComponent('Footer', context)}
    `

    return this.createHTMLDocument(title, content)
  }

  private renderInvoiceHeader(context: TemplateContext): string {
    const doc = context.document as any

    return `
      <div class="document-header">
        <div class="document-info">
          <div class="document-title">FACTURA${
            doc.condicion?.dias && doc.condicion.dias > 0 ? ' CRÉDITO' : ''
          }</div>
          <div class="document-number">${
            doc.noPedidoStr || doc.noFactura || ''
          }</div>
        </div>
        <div class="document-date" style="text-align: right;">
          <div class="label">Fecha de Emisión:</div>
          <div class="value">${formatDate(
            doc.fechaPedido || doc.fechaFactura || new Date().toISOString(),
          )}</div>
          ${
            doc.secuenciaDocumento || doc.secuencia
              ? `
            <div style="margin-top: 8px;">
              <span class="label">Secuencia No.: </span>
              <span class="value">${
                doc.secuenciaDocumento || doc.secuencia
              }</span>
            </div>
          `
              : ''
          }
          ${
            doc.fechaVencimiento ||
            (doc.condicion?.dias && doc.condicion.dias > 0)
              ? `
            <div class="label" style="margin-top: 8px;">Fecha de Vencimiento:</div>
            <div class="value">${
              doc.fechaVencimiento
                ? formatDate(doc.fechaVencimiento)
                : (() => {
                    // Calculate due date based on invoice date + payment terms
                    const invoiceDate = new Date(
                      doc.fechaPedido || doc.fechaFactura || new Date(),
                    )
                    const dueDate = new Date(invoiceDate)
                    dueDate.setDate(
                      dueDate.getDate() + (doc.condicion?.dias || 0),
                    )
                    return formatDate(dueDate.toISOString())
                  })()
            }</div>
          `
              : ''
          }
        </div>
      </div>
    `
  }

  private renderInvoiceDetails(context: TemplateContext): string {
    const doc = context.document as any

    return `
      <div class="document-details" style="margin: 20px 0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <!-- Invoice Details Section -->
          <div>
            <h3 style="margin: 0 0 12px 0; color: #0066cc; font-size: 16px; font-weight: bold;">DETALLES DE FACTURACIÓN</h3>
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; font-size: 14px;">
              ${
                doc.cliente?.telefono1
                  ? `
                <span style="font-weight: 600;">Teléfono:</span>
                <span>${doc.cliente.telefono1}</span>
              `
                  : ''
              }
              ${
                doc.condicion?.dias && doc.condicion.dias > 0
                  ? `
                <span style="font-weight: 600;">Condición de Pago:</span>
                <span>${doc.condicion.dias} días</span>
              `
                  : ''
              }
              ${
                doc.localidad?.nombre
                  ? `
                <span style="font-weight: 600;">Localidad:</span>
                <span>${doc.localidad.nombre}</span>
              `
                  : ''
              }
              ${
                doc.tipoFactura || doc.tipoPedido
                  ? `
                <span style="font-weight: 600;">Tipo de Factura:</span>
                <span>${doc.tipoFactura || doc.tipoPedido}</span>
              `
                  : ''
              }
              ${
                doc.confirmado
                  ? `
                <span style="font-weight: 600;">Estado:</span>
                <span style="color: #28a745; font-weight: 600;">Confirmado</span>
              `
                  : ''
              }
            </div>
          </div>

          <!-- Additional Information Section -->
          <div>
            <h3 style="margin: 0 0 12px 0; color: #0066cc; font-size: 16px; font-weight: bold;">INFORMACIÓN ADICIONAL</h3>
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; font-size: 14px;">
              ${
                doc.vendedor?.nombre
                  ? `
                <span style="font-weight: 600;">Vendedor:</span>
                <span>${doc.vendedor.nombre}</span>
              `
                  : ''
              }
              ${
                doc.vendedor?.email
                  ? `
                <span style="font-weight: 600;">Email Vendedor:</span>
                <span>${doc.vendedor.email}</span>
              `
                  : ''
              }
              ${
                doc.codigoVendedor
                  ? `
                <span style="font-weight: 600;">Código Vendedor:</span>
                <span>${doc.codigoVendedor}</span>
              `
                  : ''
              }
            </div>
            
            ${
              doc.nota
                ? `
              <div style="margin-top: 16px;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #666;">Notas:</h4>
                <div style="background-color: #f8f9fa; padding: 12px; border-radius: 4px; font-size: 14px; line-height: 1.4;">
                  ${doc.nota}
                </div>
              </div>
            `
                : ''
            }
          </div>
        </div>
      </div>
    `
  }

  private renderPaymentInfo(context: TemplateContext): string {
    const doc = context.document as any
    if (!doc.metodoPago && !doc.terminosPago) return ''

    return `
      <div class="customer-section" style="margin-top: 20px;">
        <h3>Información de Pago</h3>
        <div class="customer-info">
          ${
            doc.metodoPago
              ? `<div><strong>Método de Pago:</strong> ${doc.metodoPago}</div>`
              : ''
          }
          ${
            doc.terminosPago
              ? `<div><strong>Términos de Pago:</strong> ${doc.terminosPago}</div>`
              : ''
          }
          ${
            doc.cuentaBanco
              ? `<div><strong>Cuenta Bancaria:</strong> ${doc.cuentaBanco}</div>`
              : ''
          }
        </div>
      </div>
    `
  }

  validate(context: TemplateContext): boolean {
    const doc = context.document as any
    if (!doc) return false

    // For invoices, we need at least a document type and some identifier
    const hasDocumentType = doc.tipoDocumento || doc.documentType || doc.type
    const hasIdentifier =
      doc.noPedidoStr ||
      doc.noFactura ||
      doc.noDocumento ||
      doc.id ||
      doc.numero

    // Always return true for basic validation - let the components handle missing data gracefully
    return !!hasDocumentType || !!hasIdentifier
  }
}

// ============================================
// Quote Template
// ============================================

/**
 * Quote Template
 * Specialized template for quotes/estimates
 */
export class QuoteTemplate extends BasePDFTemplate {
  templateId = 'quote-template'
  templateName = 'Quote/Estimate Template'
  documentTypes = [TipoDocumentoEnum.QUOTE]
  version = '1.0.0'

  render(context: TemplateContext): string {
    const doc = context.document as any
    const title = `Cotización - ${doc.noPedidoStr || doc.noCotizacion || ''}`

    const content = `
      ${this.renderComponent('BusinessHeader', context)}
      ${this.renderQuoteHeader(context)}
      ${this.renderComponent('CustomerInfo', context)}
      ${this.renderComponent('EnhancedItemsTable', context)}
      ${this.renderQuoteTotalsSummary(context)}
      ${this.renderComponent('Notes', context)}
      ${this.renderComponent('Footer', context)}
    `

    return this.createHTMLDocument(title, content)
  }

  private renderQuoteHeader(context: TemplateContext): string {
    const doc = context.document as any

    return `
      <div class="document-header">
        <div class="document-info">
          <div class="document-title">COTIZACIÓN</div>
          <div class="document-number">${
            doc.noPedidoStr || doc.noCotizacion || ''
          }</div>
        </div>
        <div class="document-date" style="text-align: right;">
          <div class="label">Fecha de Cotización:</div>
          <div class="value">${formatDate(
            doc.fechaPedido || doc.fechaCotizacion || new Date().toISOString(),
          )}</div>
          ${
            doc.secuenciaDocumento || doc.secuencia
              ? `
            <div style="margin-top: 8px;">
              <span class="label">Secuencia No.: </span>
              <span class="value">${
                doc.secuenciaDocumento || doc.secuencia
              }</span>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `
  }

  private renderQuoteTotalsSummary(context: TemplateContext): string {
    const doc = context.document as any

    // Calculate totals
    let subtotal = 0
    let totalDescuento = 0
    let totalImpuestos = 0
    let total = 0

    const items = doc.detalle || doc.productos || doc.items || []
    if (Array.isArray(items)) {
      items.forEach((item) => {
        const cantidad = Number(item.cantidad || 0)
        const precio = Number(item.precio || item.precioUnitario || 0)
        const descuentoPorcentaje = Number(item.descuentoPorcentaje || 0)
        const impuesto = Number(item.impuesto || 0)
        const itemSubtotal = cantidad * precio

        subtotal += itemSubtotal
        totalDescuento += (itemSubtotal * descuentoPorcentaje) / 100
        totalImpuestos += impuesto
      })
    }

    total = subtotal - totalDescuento + totalImpuestos

    // Use document total if available, otherwise use calculated
    const finalTotal = Number(doc.total || total)

    return `
      <div style="display: flex; gap: 20px; margin: 20px 0;">
        <!-- Sales Details Section (without Condición for quotes) -->
        <div style="flex: 1;">
          <div>
            <h3 style="margin: 0 0 12px 0; color: #0066cc; font-size: 16px; font-weight: bold;">DETALLES DE COTIZACIÓN</h3>
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; font-size: 14px;">
              ${
                doc.cliente?.telefono1
                  ? `
                <span style="font-weight: 600;">Teléfono:</span>
                <span>${doc.cliente.telefono1}</span>
              `
                  : ''
              }
              ${
                doc.localidad?.nombre
                  ? `
                <span style="font-weight: 600;">Localidad:</span>
                <span>${doc.localidad.nombre}</span>
              `
                  : ''
              }
              ${
                doc.tipoPedido
                  ? `
                <span style="font-weight: 600;">Tipo de Cotización:</span>
                <span>${doc.tipoPedido}</span>
              `
                  : ''
              }
              ${
                doc.vendedor?.nombre
                  ? `
                <span style="font-weight: 600;">Vendedor:</span>
                <span>${doc.vendedor.nombre}</span>
              `
                  : ''
              }
            </div>
          </div>
        </div>

        <!-- Totals Section -->
        <div style="min-width: 280px;">
          <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; border: 1px solid #dee2e6;">
            <h3 style="margin: 0 0 12px 0; color: #0066cc; font-size: 16px; font-weight: bold;">RESUMEN FINANCIERO</h3>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 8px; font-size: 14px;">
              <span>Subtotal:</span>
              <span style="text-align: right; font-weight: 600;">${formatCurrency(
                subtotal,
              )}</span>
              
              ${
                totalDescuento > 0
                  ? `
                <span>Descuento:</span>
                <span style="text-align: right; font-weight: 600; color: #dc3545;">-${formatCurrency(
                  totalDescuento,
                )}</span>
              `
                  : ''
              }
              
              ${
                totalImpuestos > 0
                  ? `
                <span>Impuestos:</span>
                <span style="text-align: right; font-weight: 600;">${formatCurrency(
                  totalImpuestos,
                )}</span>
              `
                  : ''
              }
              
              <div style="border-top: 2px solid #0066cc; margin: 8px 0; grid-column: 1 / -1;"></div>
              
              <span style="font-size: 16px; font-weight: bold; color: #0066cc;">TOTAL:</span>
              <span style="text-align: right; font-size: 18px; font-weight: bold; color: #0066cc;">${formatCurrency(
                finalTotal,
              )}</span>
            </div>
          </div>
        </div>
      </div>
    `
  }
}
