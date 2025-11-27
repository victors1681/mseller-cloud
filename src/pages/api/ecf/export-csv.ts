import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next/types'
import { EcfDocumentoFilters } from 'src/types/apps/ecfDocumentoTypes'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { filters, token, baseURL, xUrl } = req.body as {
      filters: EcfDocumentoFilters
      token: string
      baseURL?: string
      xUrl?: string
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized - No token provided' })
    }

    // Build the full URL
    const apiBaseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || ''
    const headers: any = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
    }

    // Add X-URL header if provided (for test/sandbox mode)
    if (xUrl) {
      headers['X-URL'] = xUrl
    }

    // Fetch data from the existing API using the provided token
    const response = await axios.get(
      `${apiBaseURL}/portal/ConfiguracionFacturacionElectronica/ecf-documentos`,
      {
        params: filters,
        headers,
      },
    )
    console.log('Fetched ECF documents for CSV export:', response.data)
    const data = response.data.items || []

    // Generate CSV content
    const csvHeaders = [
      'ID Documento',
      'Tipo ECF',
      'Cliente',
      'NCF',
      'Estado ECF',
      'Job Status',
      'Fecha Creación',
      'Fecha Documento',
      'Vendedor',
      'Localidad',
    ]

    const csvRows = data.map((item: any) => {
      return [
        item.documentoId || '',
        item.tipoDocumentoEcf || '',
        item.codigoCliente || '',
        item.ncf || '',
        item.statusEcf || '',
        item.jobStatus !== null && item.jobStatus !== undefined
          ? item.jobStatus
          : '',
        item.fechaCreacion || '',
        item.fechaDocumento || '',
        item.codigoVendedor || '',
        item.localidadId || '',
      ]
    })

    // Convert to CSV format
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map((row: any[]) =>
        row
          .map((cell: any) => {
            // Escape cells that contain commas, quotes, or newlines
            const cellStr = String(cell)
            if (
              cellStr.includes(',') ||
              cellStr.includes('"') ||
              cellStr.includes('\n')
            ) {
              return `"${cellStr.replace(/"/g, '""')}"`
            }
            return cellStr
          })
          .join(','),
      ),
    ].join('\n')

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="auditoria-ecf-${Date.now()}.csv"`,
    )

    // Add UTF-8 BOM for proper Excel encoding
    res.write('\uFEFF')
    res.write(csvContent)
    res.end()
  } catch (error: any) {
    console.error('Error generating CSV:', error)
    res.status(500).json({
      message: error.response?.data?.message || 'Error generating CSV export',
    })
  }
}
