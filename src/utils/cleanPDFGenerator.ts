/**
 * CLEAN & SIMPLE PDF GENERATOR
 * No React components, no complex configurations, just basic PDF generation
 */

import { DocumentType } from 'src/types/apps/documentTypes'

/**
 * Simple PDF generation using window.print() - most reliable method
 */
export const generatePDFUsingPrint = (documentData: DocumentType): void => {
  try {
    // Open a new window with the document content
    const printWindow = window.open('', '_blank', 'width=800,height=600')

    if (!printWindow) {
      throw new Error('Popup blocked - please allow popups for PDF generation')
    }

    const htmlContent = createPrintableHTML(documentData)

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }
  } catch (error) {
    console.error('Print PDF generation failed:', error)
    throw error
  }
}

/**
 * PDF generation using jsPDF library (simpler than html2pdf)
 */
export const generatePDFUsingJsPDF = async (
  documentData: DocumentType,
): Promise<void> => {
  try {
    // Dynamic import of jsPDF
    const { jsPDF } = await import('jspdf')

    const doc = new jsPDF()

    // Add content directly to PDF
    let yPosition = 20

    // Header
    doc.setFontSize(20)
    doc.text(documentData.tipoDocumento.toUpperCase(), 20, yPosition)
    yPosition += 15

    doc.setFontSize(16)
    doc.text(`# ${documentData.noPedidoStr}`, 20, yPosition)
    yPosition += 20

    // Document info
    doc.setFontSize(12)
    doc.text('INFORMACIÓN DEL DOCUMENTO', 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.text(
      `Fecha: ${new Date(documentData.fecha).toLocaleDateString()}`,
      20,
      yPosition,
    )
    yPosition += 8
    doc.text(
      `Vendedor: ${
        documentData.vendedor?.nombre || documentData.codigoVendedor
      }`,
      20,
      yPosition,
    )
    yPosition += 15

    // Client info
    doc.setFontSize(12)
    doc.text('CLIENTE', 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.text(`Código: ${documentData.codigoCliente}`, 20, yPosition)
    yPosition += 8
    doc.text(`Nombre: ${documentData.nombreCliente}`, 20, yPosition)
    yPosition += 15

    // Details
    if (documentData.detalle && documentData.detalle.length > 0) {
      doc.setFontSize(12)
      doc.text('DETALLES', 20, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      documentData.detalle.forEach((item: any) => {
        const line = `${item.descripcion || 'Item'} - Cant: ${
          item.cantidad || 0
        } - $${(item.precio || 0).toFixed(2)}`
        doc.text(line, 20, yPosition)
        yPosition += 8

        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }
      })
      yPosition += 10
    }

    // Totals
    doc.setFontSize(12)
    doc.text(`TOTAL: $${documentData.total.toFixed(2)}`, 20, yPosition)

    // Save the PDF
    doc.save(`documento-${documentData.noPedidoStr}.pdf`)
  } catch (error) {
    console.error('jsPDF generation failed:', error)
    throw error
  }
}

/**
 * Creates HTML content for printing
 */
const createPrintableHTML = (data: DocumentType): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Documento ${data.noPedidoStr}</title>
      <style>
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: black;
          background: white;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid black;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-weight: bold;
          border-bottom: 1px solid black;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f0f0f0;
        }
        .total {
          font-size: 18px;
          font-weight: bold;
          text-align: right;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${data.tipoDocumento.toUpperCase()}</h1>
        <h2># ${data.noPedidoStr}</h2>
      </div>
      
      <div class="section">
        <div class="section-title">INFORMACIÓN DEL DOCUMENTO</div>
        <p><strong>Fecha:</strong> ${new Date(
          data.fecha,
        ).toLocaleDateString()}</p>
        <p><strong>Vendedor:</strong> ${
          data.vendedor?.nombre || data.codigoVendedor
        }</p>
      </div>
      
      <div class="section">
        <div class="section-title">CLIENTE</div>
        <p><strong>Código:</strong> ${data.codigoCliente}</p>
        <p><strong>Nombre:</strong> ${data.nombreCliente}</p>
      </div>
      
      ${
        data.detalle && data.detalle.length > 0
          ? `
      <div class="section">
        <div class="section-title">DETALLES</div>
        <table>
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.detalle
              .map(
                (item: any) => `
              <tr>
                <td>${item.descripcion || 'N/A'}</td>
                <td>${item.cantidad || 0}</td>
                <td>$${(item.precio || 0).toFixed(2)}</td>
                <td>$${((item.cantidad || 0) * (item.precio || 0)).toFixed(
                  2,
                )}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      </div>
      `
          : ''
      }
      
      <div class="total">
        TOTAL: $${data.total.toFixed(2)}
      </div>
      
      <div class="no-print" style="margin-top: 30px; text-align: center;">
        <button onclick="window.print()">Imprimir / Guardar como PDF</button>
        <button onclick="window.close()">Cerrar</button>
      </div>
      
      <script>
        // Auto-print when page loads
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 1000);
        }
      </script>
    </body>
    </html>
  `
}

/**
 * Check if we're on client side
 */
export const isClientSide = (): boolean => {
  return typeof window !== 'undefined'
}

/**
 * Main PDF generation function - tries multiple methods
 */
export const generateDocumentPDF = async (
  documentData: DocumentType,
): Promise<void> => {
  if (!isClientSide()) {
    throw new Error('PDF generation only works on client side')
  }

  try {
    // Try jsPDF first (most reliable)
    await generatePDFUsingJsPDF(documentData)
  } catch (jsPDFError) {
    console.warn('jsPDF failed, falling back to print method:', jsPDFError)

    try {
      // Fallback to print method
      generatePDFUsingPrint(documentData)
    } catch (printError) {
      console.error('All PDF methods failed:', printError)
      throw new Error(
        "PDF generation failed. Please try using your browser's print function.",
      )
    }
  }
}

export default {
  generateDocumentPDF,
  generatePDFUsingJsPDF,
  generatePDFUsingPrint,
  isClientSide,
}
