// ** Base PDF Template Components
// Reusable components for PDF generation

import {
  BusinessHeaderData,
  CustomerInfoData,
  DocumentHeaderData,
  FooterData,
  ItemsTableData,
  PDFTemplateComponent,
  TemplateContext,
  TotalsSummaryData,
} from '../../types/apps/pdfTemplateTypes'

// Import document type utilities
import { getTipoDocumentoSpanishName } from '../../types/apps/documentTypes'

// ============================================
// Utility Functions
// ============================================

// Import existing utility functions
import { formatCurrency } from '../../utils/formatCurrency'
import formatDate from '../../utils/formatDate'
import formattedNumber from '../../utils/formattedNumber'

// ============================================
// Status Labels and Constants
// ============================================

/**
 * Document status labels mapping
 */
const orderStatusLabels: { [key: string]: string } = {
  '': 'Ninguno',
  '0': 'Pendiente',
  '1': 'Procesado',
  '3': 'Retenido',
  '5': 'Pendiente Imprimir',
  '6': 'Condición de Crédito',
  '7': 'Backorder',
  '8': 'Error de Integración',
  '9': 'Listo Para Integrar',
  '10': 'Enviado al ERP',
}

/**
 * Get status label for document status
 */
const getStatusLabel = (status: number | string): string => {
  return orderStatusLabels[status.toString()] || 'Desconocido'
}

/**
 * Get logo as base64 data URL
 */
export const getLogoBase64 = (logoUrl?: string): string => {
  // If user has a custom logo URL, use it directly
  if (logoUrl && logoUrl.startsWith('http')) {
    return logoUrl
  }

  // Fallback to a simple placeholder if logo not found
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTUwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMzMzIiByeD0iNCIvPgo8dGV4dCB4PSI3NSIgeT0iMzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NU2VsbGVyPC90ZXh0Pgo8L3N2Zz4K'
}

// ============================================
// Base Template Components
// ============================================

/**
 * Base Styles Component
 * Contains all CSS styles used across templates
 */
export class BaseStylesComponent implements PDFTemplateComponent {
  name = 'BaseStyles'

  render(): string {
    return `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          color: #000;
          background: #fff;
          padding: 20px;
          line-height: 1.4;
          font-size: 12px;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .business-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #ddd;
          min-height: 60px;
        }
        
        .business-info {
          flex: 1;
        }
        
        .business-info:empty {
          display: none;
        }
        
        .business-logo {
          flex-shrink: 0;
          margin-left: 20px;
        }
        
        .business-logo img {
          max-height: 60px;
          max-width: 150px;
          object-fit: contain;
        }
        
        .business-name {
          font-size: 18px;
          font-weight: bold;
          color: #1e3a8a;
          margin-bottom: 5px;
        }
        
        .business-details {
          font-size: 11px;
          color: #6b7280;
          line-height: 1.3;
        }
        
        .document-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 15px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        
        .document-title {
          font-size: 20px;
          font-weight: bold;
          color: #1e3a8a;
        }
        
        .document-number {
          font-size: 14px;
          color: #475569;
          margin-top: 2px;
        }
        
        .document-date {
          text-align: right;
        }
        
        .document-date .label {
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 2px;
        }
        
        .document-date .value {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }
        
        .customer-section {
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #fefefe;
        }
        
        .customer-section h3 {
          font-size: 14px;
          font-weight: bold;
          color: #374151;
          margin-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 5px;
        }
        
        .customer-info {
          font-size: 12px;
          line-height: 1.4;
          color: #4b5563;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .items-table th {
          background: #f1f5f9;
          color: #374151;
          font-weight: 600;
          padding: 12px 8px;
          text-align: left;
          font-size: 11px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .items-table td {
          padding: 10px 8px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 11px;
          color: #4b5563;
        }
        
        .items-table tr:hover {
          background: #f8fafc;
        }
        
        .items-table .quantity,
        .items-table .unit-price,
        .items-table .total {
          text-align: right;
          font-weight: 500;
        }
        
        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 20px;
        }
        
        .totals-table {
          width: 300px;
          border-collapse: collapse;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .totals-table td {
          padding: 8px 12px;
          font-size: 12px;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .totals-table .label {
          font-weight: 500;
          color: #374151;
          text-align: left;
        }
        
        .totals-table .amount {
          text-align: right;
          font-weight: 600;
          color: #1f2937;
        }
        
        .totals-table .total-row {
          background: #f1f5f9;
          font-size: 14px;
        }
        
        .totals-table .total-row .label {
          font-weight: bold;
          color: #1e3a8a;
        }
        
        .totals-table .total-row .amount {
          font-weight: bold;
          color: #1e3a8a;
        }
        
        .notes-section {
          margin-bottom: 20px;
          padding: 15px;
          background: #fffbeb;
          border: 1px solid #fbbf24;
          border-radius: 8px;
        }
        
        .notes-section h4 {
          font-size: 13px;
          color: #92400e;
          margin-bottom: 8px;
          font-weight: 600;
        }
        
        .notes-section p {
          font-size: 12px;
          color: #78350f;
          line-height: 1.4;
        }
        
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          font-size: 10px;
          color: #6b7280;
        }
        
        .footer p {
          margin-bottom: 3px;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status-paid {
          background: #dcfce7;
          color: #166534;
        }
        
        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }
        
        .status-cancelled {
          background: #fee2e2;
          color: #991b1b;
        }
        
        @media print {
          body {
            padding: 0;
          }
          
          .container {
            max-width: none;
          }
        }
      </style>
    `
  }
}

/**
 * Business Header Component
 * Renders business information and logo
 */
export class BusinessHeaderComponent implements PDFTemplateComponent {
  name = 'BusinessHeader'

  render(context: TemplateContext): string {
    const business = context.userData?.user?.business
    if (!business) return ''

    const businessData: BusinessHeaderData = {
      name: business.name,
      rnc: business.rnc,
      address: business.address?.street
        ? `${business.address.street}${
            business.address.city ? ', ' + business.address.city : ''
          }${business.address.country ? ', ' + business.address.country : ''}`
        : undefined,
      phone: business.phone,
      email: business.email,
      website: business.website,
      logoUrl: business.logoUrl,
    }

    const logoDataUrl = getLogoBase64(businessData.logoUrl)

    return `
      <div class="business-header">
        <div class="business-info">
          ${
            businessData.name
              ? `<div class="business-name">${businessData.name}</div>`
              : ''
          }
          <div class="business-details">
            ${businessData.rnc ? `<div>RNC: ${businessData.rnc}</div>` : ''}
            ${businessData.address ? `<div>${businessData.address}</div>` : ''}
            ${businessData.phone ? `<div>Tel: ${businessData.phone}</div>` : ''}
            ${
              businessData.email
                ? `<div>Email: ${businessData.email}</div>`
                : ''
            }
          </div>
        </div>
        <div class="business-logo">
          <img src="${logoDataUrl}" alt="Logo" />
        </div>
      </div>
    `
  }
}

/**
 * Enhanced Document Header Component
 * Renders document title, number, date, and status with comprehensive details
 */
export class DocumentHeaderComponent implements PDFTemplateComponent {
  name = 'DocumentHeader'

  render(context: TemplateContext): string {
    const doc = context.document as any

    // Get Spanish document type name
    const documentTypeSpanish = getTipoDocumentoSpanishName(
      doc.tipoDocumento || 'order',
    )
    const statusLabel = getStatusLabel(doc.procesado || 0)

    const headerData: DocumentHeaderData = {
      title: documentTypeSpanish,
      documentNumber: doc.noPedidoStr || doc.noDocumento || '',
      date: doc.fechaPedido || doc.fecha || new Date().toISOString(),
      status: statusLabel,
      type: doc.tipoDocumento,
    }

    return `
      <div class="document-header" style="background-color: #f8f9fa; padding: 16px; margin-bottom: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h2 style="margin: 0; color: #0066cc; font-size: 20px; font-weight: bold;">${
                headerData.title
              }</h2>
              <span style="font-size: 16px; font-weight: 600; color: #333;">#${
                headerData.documentNumber
              }</span>
            </div>
          </div>
          <div style="flex-shrink: 0; text-align: right; color: #666; font-size: 14px; margin-left: 20px;">
            <div><strong>Fecha:</strong> ${formatDate(headerData.date)}</div>
            ${
              doc.secuenciaDocumento || doc.secuencia
                ? `<div><strong>SecuenciaDocumento No.:</strong> ${
                    doc.secuenciaDocumento || doc.secuencia
                  }</div>`
                : ''
            }
            ${
              doc.fechaProcesado
                ? `<div><strong>Procesado:</strong> ${formatDate(
                    doc.fechaProcesado,
                  )}</div>`
                : ''
            }
          </div>
        </div>
      </div>
    `
  }
}

/**
 * Customer Info Component
 * Renders customer information
 */
export class CustomerInfoComponent implements PDFTemplateComponent {
  name = 'CustomerInfo'

  render(context: TemplateContext): string {
    const doc = context.document as any
    const customer = doc.cliente || doc.customer
    if (!customer) return ''

    const customerData: CustomerInfoData = {
      name: customer.nombre || customer.name || '',
      address: customer.direccion || customer.address || '',
      phone: customer.telefono || customer.phone || '',
      email: customer.email || '',
      id: customer.id || customer.customerId || '',
      taxId: customer.rnc || customer.taxId || '',
    }

    return `
      <div class="customer-section">
        <h3>Cliente</h3>
        <div class="customer-info">
          <div><strong>${customerData.name}</strong></div>
          ${customerData.id ? `<div>ID: ${customerData.id}</div>` : ''}
          ${
            customerData.taxId
              ? `<div>RNC/Cédula: ${customerData.taxId}</div>`
              : ''
          }
          ${customerData.address ? `<div>${customerData.address}</div>` : ''}
          ${customerData.phone ? `<div>Tel: ${customerData.phone}</div>` : ''}
          ${customerData.email ? `<div>Email: ${customerData.email}</div>` : ''}
        </div>
      </div>
    `
  }
}

/**
 * Items Table Component
 * Renders items/products table
 */
export class ItemsTableComponent implements PDFTemplateComponent {
  name = 'ItemsTable'

  render(context: TemplateContext): string {
    const doc = context.document as any
    let items = doc.productos || doc.items || doc.details || []

    // Handle case where productos is just a count or not an array
    if (!Array.isArray(items)) {
      // If productos is a number (count), create a placeholder message
      if (typeof items === 'number') {
        return `
          <div class="items-placeholder">
            <p><em>Este documento contiene ${items} producto(s).</em></p>
            <p><em>Los detalles de productos no están disponibles en esta vista.</em></p>
          </div>
        `
      }
      return ''
    }

    if (items.length === 0) return ''

    const tableData: ItemsTableData = {
      items: items.map((item) => ({
        id: item.id || item.productoId,
        name: item.nombre || item.name || item.producto || 'Producto',
        description: item.descripcion || item.description || '',
        quantity: item.cantidad || item.quantity || 0,
        unitPrice: item.precio || item.unitPrice || item.precioUnitario || 0,
        total: item.total || (item.cantidad || 0) * (item.precio || 0),
        tax: item.impuesto || item.tax,
        discount: item.descuento || item.discount,
      })),
      showTax: items.some((item) => (item.impuesto || item.tax || 0) > 0),
      showDiscount: items.some(
        (item) => (item.descuento || item.discount || 0) > 0,
      ),
      currency: doc.moneda || '$',
    }

    return `
      <table class="items-table">
        <thead>
          <tr>
            <th>Descripción</th>
            <th style="width: 80px;">Cant.</th>
            <th style="width: 100px;">Precio Unit.</th>
            ${
              tableData.showDiscount
                ? '<th style="width: 80px;">Desc.</th>'
                : ''
            }
            ${tableData.showTax ? '<th style="width: 80px;">Imp.</th>' : ''}
            <th style="width: 100px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${tableData.items
            .map(
              (item) => `
            <tr>
              <td>
                <div style="font-weight: 500;">${item.name}</div>
                ${
                  item.description
                    ? `<div style="font-size: 10px; color: #6b7280;">${item.description}</div>`
                    : ''
                }
              </td>
              <td class="quantity">${item.quantity}</td>
              <td class="unit-price">${formatCurrency(item.unitPrice)}</td>
              ${
                tableData.showDiscount
                  ? `<td class="text-right">${
                      item.discount ? formatCurrency(item.discount) : '-'
                    }</td>`
                  : ''
              }
              ${
                tableData.showTax
                  ? `<td class="text-right">${
                      item.tax ? formatCurrency(item.tax) : '-'
                    }</td>`
                  : ''
              }
              <td class="total">${formatCurrency(item.total)}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    `
  }
}

/**
 * Enhanced Totals Summary Component
 * Renders comprehensive financial summary matching PreviewCard layout
 */
export class TotalsSummaryComponent implements PDFTemplateComponent {
  name = 'TotalsSummary'

  render(context: TemplateContext): string {
    const doc = context.document as any

    const totalsData: TotalsSummaryData = {
      subtotal: Number(doc.subtotal || doc.subTotal || 0),
      discount: Number(doc.descuento || doc.discount || 0),
      tax: Number(doc.impuesto || doc.tax || 0),
      total: Number(doc.total || doc.totalGeneral || doc.monto || 0),
      currency: doc.moneda || doc.currency || '$',
    }

    // Additional taxes from PreviewCard
    const isc = Number(doc.isc || 0)
    const adv = Number(doc.adv || 0)

    return `
      <div class="enhanced-totals-section" style="margin: 20px 0;">
        <h3 style="margin: 0 0 12px 0; color: #0066cc; font-size: 16px; font-weight: bold;">RESUMEN FINANCIERO</h3>
        <div style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; border: 1px solid #dee2e6;">
          <table style="width: 100%; font-size: 14px;">
            <tr style="border-bottom: 1px solid #dee2e6;">
              <td style="padding: 8px 0; font-weight: 600; color: #666;">Subtotal:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formatCurrency(
                totalsData.subtotal || 0,
              )}</td>
            </tr>
            ${
              (totalsData.discount || 0) > 0
                ? `
            <tr style="border-bottom: 1px solid #dee2e6;">
              <td style="padding: 8px 0; font-weight: 600; color: #666;">Descuento:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #dc3545;">-${formatCurrency(
                totalsData.discount || 0,
              )}</td>
            </tr>
            `
                : ''
            }
            <tr style="border-bottom: 1px solid #dee2e6;">
              <td style="padding: 8px 0; font-weight: 600; color: #666;">Impuesto:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formatCurrency(
                totalsData.tax || 0,
              )}</td>
            </tr>
            ${
              isc > 0
                ? `
            <tr style="border-bottom: 1px solid #dee2e6;">
              <td style="padding: 8px 0; font-weight: 600; color: #666;">ISC:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formatCurrency(
                isc,
              )}</td>
            </tr>
            `
                : ''
            }
            ${
              adv > 0
                ? `
            <tr style="border-bottom: 1px solid #dee2e6;">
              <td style="padding: 8px 0; font-weight: 600; color: #666;">ADV:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formatCurrency(
                adv,
              )}</td>
            </tr>
            `
                : ''
            }
            <tr style="border-top: 2px solid #0066cc; background-color: #ffffff;">
              <td style="padding: 12px 0 8px 0; font-size: 16px; font-weight: bold; color: #0066cc;">TOTAL:</td>
              <td style="padding: 12px 0 8px 0; text-align: right; font-size: 16px; font-weight: bold; color: #0066cc;">${formatCurrency(
                totalsData.total || 0,
              )}</td>
            </tr>
          </table>
        </div>
      </div>
    `
  }
}

/**
 * Notes Component
 * Renders document notes/comments
 */
export class NotesComponent implements PDFTemplateComponent {
  name = 'Notes'

  render(context: TemplateContext): string {
    const doc = context.document as any
    const notes = doc.nota || doc.notes || doc.comments
    if (!notes) return ''

    return `
      <div class="notes-section">
        <h4>Notas:</h4>
        <p>${notes}</p>
      </div>
    `
  }
}

/**
 * Footer Component
 * Renders document footer
 */
export class FooterComponent implements PDFTemplateComponent {
  name = 'Footer'

  render(context: TemplateContext): string {
    const business = context.userData?.user?.business
    const businessName = business?.name
    const footerMessage = business?.footerMessage
    const website = business?.website

    const footerData: FooterData = {
      message: footerMessage,
      website: website,
      generatedBy: businessName || 'MSeller Cloud | www.mseller.app',
      generatedAt: formatDate(new Date().toISOString()),
    }

    return `
      <div class="footer">
        <p>Documento generado por ${footerData.generatedBy} - ${
      footerData.generatedAt
    }</p>
        ${
          footerData.message
            ? `<p>${footerData.message}${
                footerData.website ? ` | ${footerData.website}` : ''
              }</p>`
            : ''
        }
      </div>
    `
  }
}

/**
 * Enhanced Document Details Component
 * Renders comprehensive document and sales information
 */
export class DocumentDetailsComponent implements PDFTemplateComponent {
  name = 'DocumentDetails'

  render(context: TemplateContext): string {
    const doc = context.document as any

    return `
      <div class="document-details" style="margin: 20px 0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <!-- Sales Details Section -->
          <div>
            <h3 style="margin: 0 0 12px 0; color: #0066cc; font-size: 16px; font-weight: bold;">DETALLES DE VENTA</h3>
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
                <span style="font-weight: 600;">Condición:</span>
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
                doc.tipoPedido
                  ? `
                <span style="font-weight: 600;">Tipo de Pedido:</span>
                <span>${doc.tipoPedido}</span>
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
}

/**
 * Enhanced Items Table Component
 * Renders detailed product table matching PreviewCard layout
 */
export class EnhancedItemsTableComponent implements PDFTemplateComponent {
  name = 'EnhancedItemsTable'

  render(context: TemplateContext): string {
    const doc = context.document as any
    let items = doc.detalle || doc.productos || doc.items || doc.details || []

    // Handle case where productos is just a count or not an array
    if (!Array.isArray(items)) {
      if (typeof items === 'number') {
        return `
          <div class="items-placeholder" style="margin: 20px 0; padding: 16px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-style: italic; color: #666;">Este documento contiene ${items} producto(s).</p>
            <p style="margin: 8px 0 0 0; font-style: italic; color: #666;">Los detalles de productos no están disponibles en esta vista.</p>
          </div>
        `
      }
      return ''
    }

    if (items.length === 0) return ''

    const tableRows = items
      .map((item) => {
        const cantidad = Number(item.cantidad || 0)
        const precio = Number(item.precio || item.precioUnitario || 0)
        const descuentoPorcentaje = Number(item.descuentoPorcentaje || 0)
        const impuesto = Number(item.impuesto || 0)
        const subtotal = Number(item.subtotal || cantidad * precio)

        return `
        <tr style="border-bottom: 1px solid #dee2e6;">
          <td style="padding: 8px 6px; text-align: center; font-size: 12px;">${formattedNumber(
            cantidad,
          )}</td>
          <td style="padding: 8px 6px; font-size: 12px;">${
            item.codigo || item.id || ''
          }</td>
          <td style="padding: 8px 6px; font-size: 12px;">${
            item.unidad || 'UND'
          }</td>
          <td style="padding: 8px 6px; font-size: 12px;">
            <div style="font-weight: 500;">${
              item.descripcion || item.description
            }</div>
          </td>
          <td style="padding: 8px 6px; text-align: center; font-size: 12px;">${formattedNumber(
            descuentoPorcentaje,
          )}%</td>
          <td style="padding: 8px 6px; text-align: right; font-size: 12px;">${formatCurrency(
            precio,
          )}</td>
          <td style="padding: 8px 6px; text-align: right; font-size: 12px;">${formatCurrency(
            impuesto,
          )}</td>
          <td style="padding: 8px 6px; text-align: right; font-size: 12px; font-weight: 600;">${formatCurrency(
            subtotal,
          )}</td>
        </tr>
      `
      })
      .join('')

    return `
      <div class="enhanced-items-table" style="margin: 20px 0;">
        <h3 style="margin: 0 0 12px 0; color: #0066cc; font-size: 16px; font-weight: bold;">PRODUCTOS</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #dee2e6; font-size: 12px;">
          <thead style="background-color: #f8f9fa;">
            <tr>
              <th style="padding: 10px 6px; text-align: center; font-weight: bold; border-bottom: 2px solid #dee2e6;">Cant.</th>
              <th style="padding: 10px 6px; text-align: left; font-weight: bold; border-bottom: 2px solid #dee2e6;">Código</th>
              <th style="padding: 10px 6px; text-align: left; font-weight: bold; border-bottom: 2px solid #dee2e6;">Unidad</th>
              <th style="padding: 10px 6px; text-align: left; font-weight: bold; border-bottom: 2px solid #dee2e6;">Descripción</th>
              <th style="padding: 10px 6px; text-align: center; font-weight: bold; border-bottom: 2px solid #dee2e6;">Desc. %</th>
              <th style="padding: 10px 6px; text-align: right; font-weight: bold; border-bottom: 2px solid #dee2e6;">Precio Unit.</th>
              <th style="padding: 10px 6px; text-align: right; font-weight: bold; border-bottom: 2px solid #dee2e6;">Impuesto</th>
              <th style="padding: 10px 6px; text-align: right; font-weight: bold; border-bottom: 2px solid #dee2e6;">SubTotal</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `
  }
}
