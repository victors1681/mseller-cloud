// ** React Imports
import { useEffect, useState } from 'react'

// ** Services
import { getConfiguredTemplateId } from 'src/services/templateConfigService'

// ** Types
import { TipoDocumentoNumerico } from 'src/types/apps/templateConfigTypes'

/**
 * Hook to get the configured template ID for a document type
 * Automatically fetches on mount and provides loading state
 */
export const useConfiguredTemplate = (
  tipoDocumento: TipoDocumentoNumerico | null,
) => {
  const [templateId, setTemplateId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (tipoDocumento === null) return

    const fetchTemplateId = async () => {
      setLoading(true)
      setError(null)

      try {
        const id = await getConfiguredTemplateId(tipoDocumento)
        setTemplateId(id)
      } catch (err) {
        console.error('Error fetching configured template:', err)
        setError('Error al cargar la configuración de plantilla')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplateId()
  }, [tipoDocumento])

  return { templateId, loading, error }
}

/**
 * Hook to manually fetch template ID on demand
 */
export const useTemplateIdFetcher = () => {
  const [loading, setLoading] = useState(false)

  const fetchTemplateId = async (
    tipoDocumento: TipoDocumentoNumerico,
  ): Promise<number | null> => {
    setLoading(true)
    try {
      const id = await getConfiguredTemplateId(tipoDocumento)
      return id
    } catch (error) {
      console.error('Error fetching template ID:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { fetchTemplateId, loading }
}
