// ** Template Configuration Service
// ** Provides utilities to fetch configured templates for document generation

import restClient from 'src/configs/restClient'
import { TipoDocumentoEnum } from 'src/types/apps/documentTypes'
import { TipoDocumentoNumerico } from 'src/types/apps/templateConfigTypes'

/**
 * Map document type enum to TipoDocumentoNumerico
 */
export const mapDocumentTypeToNumerico = (
  tipoDocumento: TipoDocumentoEnum | string,
): TipoDocumentoNumerico | null => {
  const mapping: Record<TipoDocumentoEnum, TipoDocumentoNumerico> = {
    [TipoDocumentoEnum.ORDER]: TipoDocumentoNumerico.Pedido,
    [TipoDocumentoEnum.INVOICE]: TipoDocumentoNumerico.Factura,
    [TipoDocumentoEnum.QUOTE]: TipoDocumentoNumerico.Cotizacion,
    [TipoDocumentoEnum.BUY]: TipoDocumentoNumerico.OrdenCompra,
    [TipoDocumentoEnum.RECEIPT]: TipoDocumentoNumerico.Recibo,
    [TipoDocumentoEnum.CREDIT_NOTE]: TipoDocumentoNumerico.NotaCredito,
    [TipoDocumentoEnum.DEBIT_NOTE]: TipoDocumentoNumerico.NotaDebito,
    [TipoDocumentoEnum.RETURN_ORDER]: TipoDocumentoNumerico.Devolucion,
    [TipoDocumentoEnum.DELIVERY_NOTE]: TipoDocumentoNumerico.Pedido, // Fallback to Pedido
    [TipoDocumentoEnum.INVOICE_TRANSPORT]: TipoDocumentoNumerico.Factura, // Fallback to Factura
  }

  return mapping[tipoDocumento as TipoDocumentoEnum] || null
}

/**
 * Get the configured template ID for a document type
 * Returns null if no configuration exists (will fall back to default)
 */
export const getConfiguredTemplateId = async (
  tipoDocumento: TipoDocumentoNumerico,
): Promise<number | null> => {
  try {
    const response = await restClient.get(
      `/api/portal/PlantillaReporte/configuration/${tipoDocumento}`,
    )

    if (response.data?.success && response.data?.data) {
      return response.data.data.plantillaId
    }

    return null
  } catch (error: any) {
    // 404 means no configuration exists - this is expected
    if (error.response?.status === 404) {
      return null
    }

    console.error('Error fetching template configuration:', error)
    return null
  }
}

/**
 * Get template content by ID
 */
export const getTemplateById = async (
  templateId: number,
): Promise<string | null> => {
  try {
    const response = await restClient.get(
      `/api/portal/PlantillaReporte/${templateId}`,
    )

    if (response.data?.data) {
      return response.data.data.contenidoScriban
    }

    return null
  } catch (error) {
    console.error('Error fetching template:', error)
    return null
  }
}

/**
 * Get available templates for a document type
 */
export const getAvailableTemplatesForDocumentType = async (
  tipoDocumento: TipoDocumentoNumerico,
  idioma: string = 'es',
) => {
  try {
    const response = await restClient.get(
      `/api/portal/PlantillaReporte/by-module/${tipoDocumento}`,
      {
        params: {
          idioma,
          includeInactive: false,
        },
      },
    )

    return response.data?.data || []
  } catch (error) {
    console.error('Error fetching available templates:', error)
    return []
  }
}
