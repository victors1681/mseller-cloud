// ** Report Templates
// Templates for various types of reports and analytics documents

import {
  ReportDocument,
  TemplateContext,
} from '../../../types/apps/pdfTemplateTypes'
import { formatCurrency } from '../../../utils/formatCurrency'
import formatDate from '../../../utils/formatDate'
import { BasePDFTemplate } from '../base'

// ============================================
// Generic Report Template
// ============================================

/**
 * Generic Report Template
 * Flexible template for various types of reports
 */
export class GenericReportTemplate extends BasePDFTemplate {
  templateId = 'generic-report'
  templateName = 'Generic Report Template'
  documentTypes = ['report', 'analytics', 'summary']
  version = '1.0.0'

  render(context: TemplateContext): string {
    const doc = context.document as ReportDocument
    const title = `${doc.reportTitle || 'Reporte'}`

    const content = `
      ${this.renderComponent('BusinessHeader', context)}
      ${this.renderReportHeader(context)}
      ${this.renderReportFilters(context)}
      ${this.renderReportSummary(context)}
      ${this.renderReportData(context)}
      ${this.renderComponent('Footer', context)}
    `

    return this.createHTMLDocument(title, content)
  }

  private renderReportHeader(context: TemplateContext): string {
    const doc = context.document as ReportDocument

    return `
      <div class="document-header" style="background: #f8fafc; border-color: #e2e8f0;">
        <div class="document-info">
          <div class="document-title" style="color: #1e40af;">${
            doc.reportTitle || 'REPORTE'
          }</div>
          <div class="document-number">Tipo: ${
            doc.reportType || 'General'
          }</div>
        </div>
        <div class="document-date">
          <div class="label">Fecha de Generación:</div>
          <div class="value">${formatDate(doc.generatedDate)}</div>
          ${
            doc.dateRange
              ? `
            <div class="label" style="margin-top: 8px;">Período:</div>
            <div class="value">${formatDate(doc.dateRange.from)} - ${formatDate(
                  doc.dateRange.to,
                )}</div>
          `
              : ''
          }
        </div>
      </div>
    `
  }

  private renderReportFilters(context: TemplateContext): string {
    const doc = context.document as ReportDocument
    if (!doc.filters || Object.keys(doc.filters).length === 0) return ''

    return `
      <div class="customer-section">
        <h3>Filtros Aplicados</h3>
        <div class="customer-info">
          ${Object.entries(doc.filters)
            .map(
              ([key, value]) => `
            <div><strong>${this.formatFilterName(key)}:</strong> ${value}</div>
          `,
            )
            .join('')}
        </div>
      </div>
    `
  }

  private renderReportSummary(context: TemplateContext): string {
    const doc = context.document as ReportDocument
    if (!doc.summary || Object.keys(doc.summary).length === 0) return ''

    return `
      <div class="customer-section">
        <h3>Resumen</h3>
        <div class="totals-section">
          <table class="totals-table">
            ${Object.entries(doc.summary)
              .map(
                ([key, value]) => `
              <tr>
                <td class="label">${this.formatSummaryName(key)}:</td>
                <td class="amount">${this.formatSummaryValue(key, value)}</td>
              </tr>
            `,
              )
              .join('')}
          </table>
        </div>
      </div>
    `
  }

  private renderReportData(context: TemplateContext): string {
    const doc = context.document as ReportDocument
    if (!doc.data) return ''

    // Handle different data types
    if (Array.isArray(doc.data)) {
      return this.renderTableData(doc.data)
    } else if (typeof doc.data === 'object') {
      return this.renderObjectData(doc.data)
    } else {
      return `<div class="customer-section"><pre>${JSON.stringify(
        doc.data,
        null,
        2,
      )}</pre></div>`
    }
  }

  private renderTableData(data: any[]): string {
    if (data.length === 0)
      return '<div class="customer-section"><p>No hay datos para mostrar.</p></div>'

    // Get column headers from first object
    const headers = Object.keys(data[0])

    return `
      <div class="customer-section">
        <h3>Datos del Reporte</h3>
        <table class="items-table">
          <thead>
            <tr>
              ${headers
                .map((header) => `<th>${this.formatColumnName(header)}</th>`)
                .join('')}
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (row) => `
              <tr>
                ${headers
                  .map(
                    (header) =>
                      `<td>${this.formatCellValue(header, row[header])}</td>`,
                  )
                  .join('')}
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `
  }

  private renderObjectData(data: Record<string, any>): string {
    return `
      <div class="customer-section">
        <h3>Datos del Reporte</h3>
        <div class="customer-info">
          ${Object.entries(data)
            .map(
              ([key, value]) => `
            <div><strong>${this.formatColumnName(
              key,
            )}:</strong> ${this.formatCellValue(key, value)}</div>
          `,
            )
            .join('')}
        </div>
      </div>
    `
  }

  private formatFilterName(key: string): string {
    const translations: Record<string, string> = {
      startDate: 'Fecha Inicio',
      endDate: 'Fecha Fin',
      vendedorId: 'Vendedor',
      localidadId: 'Localidad',
      distribuidorId: 'Distribuidor',
      status: 'Estado',
      category: 'Categoría',
      type: 'Tipo',
    }
    return translations[key] || key.charAt(0).toUpperCase() + key.slice(1)
  }

  private formatSummaryName(key: string): string {
    const translations: Record<string, string> = {
      total: 'Total',
      count: 'Cantidad',
      average: 'Promedio',
      sum: 'Suma',
      max: 'Máximo',
      min: 'Mínimo',
      totalVentas: 'Total Ventas',
      totalPedidos: 'Total Pedidos',
      promedioVenta: 'Promedio por Venta',
    }
    return translations[key] || key.charAt(0).toUpperCase() + key.slice(1)
  }

  private formatSummaryValue(key: string, value: any): string {
    // Format monetary values
    if (
      key.toLowerCase().includes('total') ||
      key.toLowerCase().includes('precio') ||
      key.toLowerCase().includes('amount')
    ) {
      return formatCurrency(Number(value) || 0)
    }

    // Format dates
    if (
      key.toLowerCase().includes('fecha') ||
      key.toLowerCase().includes('date')
    ) {
      return formatDate(value)
    }

    // Format numbers
    if (typeof value === 'number') {
      return value.toLocaleString()
    }

    return String(value)
  }

  private formatColumnName(key: string): string {
    const translations: Record<string, string> = {
      id: 'ID',
      nombre: 'Nombre',
      fecha: 'Fecha',
      total: 'Total',
      cantidad: 'Cantidad',
      precio: 'Precio',
      status: 'Estado',
      cliente: 'Cliente',
      vendedor: 'Vendedor',
      producto: 'Producto',
    }
    return translations[key] || key.charAt(0).toUpperCase() + key.slice(1)
  }

  private formatCellValue(key: string, value: any): string {
    if (value === null || value === undefined) return '-'

    // Format monetary columns
    if (
      key.toLowerCase().includes('total') ||
      key.toLowerCase().includes('precio') ||
      key.toLowerCase().includes('amount')
    ) {
      return formatCurrency(Number(value) || 0)
    }

    // Format date columns
    if (
      key.toLowerCase().includes('fecha') ||
      key.toLowerCase().includes('date')
    ) {
      return formatDate(value)
    }

    // Format numbers
    if (typeof value === 'number') {
      return value.toLocaleString()
    }

    return String(value)
  }

  validate(context: TemplateContext): boolean {
    const doc = context.document as ReportDocument
    if (!doc) return false

    const hasTitle = !!doc.reportTitle
    const hasType = !!doc.reportType
    const hasGeneratedDate = !!doc.generatedDate

    return hasTitle && hasType && hasGeneratedDate
  }
}

// ============================================
// Sales Report Template
// ============================================

/**
 * Sales Report Template
 * Specialized template for sales reports with charts and metrics
 */
export class SalesReportTemplate extends BasePDFTemplate {
  templateId = 'sales-report'
  templateName = 'Sales Report Template'
  documentTypes = ['sales-report', 'ventas-reporte']
  version = '1.0.0'

  render(context: TemplateContext): string {
    const doc = context.document as ReportDocument
    const title = `Reporte de Ventas`

    const content = `
      ${this.renderComponent('BusinessHeader', context)}
      ${this.renderSalesHeader(context)}
      ${this.renderSalesMetrics(context)}
      ${this.renderTopProducts(context)}
      ${this.renderSalesData(context)}
      ${this.renderComponent('Footer', context)}
    `

    return this.createHTMLDocument(title, content)
  }

  private renderSalesHeader(context: TemplateContext): string {
    const doc = context.document as ReportDocument

    return `
      <div class="document-header" style="background: #f0fdf4; border-color: #22c55e;">
        <div class="document-info">
          <div class="document-title" style="color: #15803d;">REPORTE DE VENTAS</div>
          <div class="document-number">Período: ${
            doc.dateRange
              ? `${formatDate(doc.dateRange.from)} - ${formatDate(
                  doc.dateRange.to,
                )}`
              : 'Todos los períodos'
          }</div>
        </div>
        <div class="document-date">
          <div class="label">Generado:</div>
          <div class="value">${formatDate(doc.generatedDate)}</div>
        </div>
      </div>
    `
  }

  private renderSalesMetrics(context: TemplateContext): string {
    const doc = context.document as ReportDocument
    const metrics = doc.summary || {}

    return `
      <div class="customer-section">
        <h3>Métricas de Ventas</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
          ${Object.entries(metrics)
            .map(
              ([key, value]) => `
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #1e40af; margin-bottom: 5px;">
                ${this.formatMetricValue(key, value)}
              </div>
              <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">
                ${this.formatSummaryName(key)}
              </div>
            </div>
          `,
            )
            .join('')}
        </div>
      </div>
    `
  }

  private renderTopProducts(context: TemplateContext): string {
    const doc = context.document as ReportDocument
    const data = Array.isArray(doc.data) ? doc.data : []

    // Get top 5 products by sales
    const topProducts = data
      .sort((a, b) => (b.total || 0) - (a.total || 0))
      .slice(0, 5)

    if (topProducts.length === 0) return ''

    return `
      <div class="customer-section">
        <h3>Top 5 Productos</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th style="width: 100px; text-align: right;">Cantidad</th>
              <th style="width: 120px; text-align: right;">Total Ventas</th>
            </tr>
          </thead>
          <tbody>
            ${topProducts
              .map(
                (product) => `
              <tr>
                <td>${product.nombre || product.name || 'N/A'}</td>
                <td style="text-align: right;">${
                  product.cantidad || product.quantity || 0
                }</td>
                <td style="text-align: right; font-weight: 600;">${formatCurrency(
                  product.total || 0,
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

  private renderSalesData(context: TemplateContext): string {
    const doc = context.document as ReportDocument
    const data = Array.isArray(doc.data) ? doc.data : []

    if (data.length === 0)
      return '<div class="customer-section"><p>No hay datos de ventas para mostrar.</p></div>'

    return `
      <div class="customer-section">
        <h3>Detalle de Ventas</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th style="width: 80px; text-align: right;">Cant.</th>
              <th style="width: 100px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (sale) => `
              <tr>
                <td>${formatDate(sale.fecha || sale.date || new Date())}</td>
                <td>${sale.cliente || sale.customer || 'N/A'}</td>
                <td>${
                  sale.producto ||
                  sale.product ||
                  sale.nombre ||
                  sale.name ||
                  'N/A'
                }</td>
                <td style="text-align: right;">${
                  sale.cantidad || sale.quantity || 0
                }</td>
                <td style="text-align: right; font-weight: 600;">${formatCurrency(
                  sale.total || 0,
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

  private formatMetricValue(key: string, value: any): string {
    if (
      key.toLowerCase().includes('total') ||
      key.toLowerCase().includes('amount')
    ) {
      return formatCurrency(Number(value) || 0)
    }

    if (typeof value === 'number') {
      return value.toLocaleString()
    }

    return String(value)
  }

  private formatSummaryName(key: string): string {
    const translations: Record<string, string> = {
      totalVentas: 'Total Ventas',
      totalPedidos: 'Total Pedidos',
      promedioVenta: 'Promedio Venta',
      totalClientes: 'Total Clientes',
      totalProductos: 'Total Productos',
    }
    return translations[key] || key.charAt(0).toUpperCase() + key.slice(1)
  }
}