/**
 * Extracts error message from various error response structures
 *
 * This utility function helps standardize error message extraction across the application.
 * It checks multiple possible locations where error messages might be stored in different
 * API response structures and error objects.
 *
 * @param error - The error object from API response or catch block
 * @param fallbackMessage - Default message if no specific error message is found
 * @returns Extracted error message or fallback message
 *
 * @example
 * ```typescript
 * try {
 *   await apiCall()
 * } catch (error) {
 *   const message = extractErrorMessage(error, 'Operation failed')
 *   toast.error(message)
 * }
 * ```
 */
export const extractErrorMessage = (
  error: any,
  fallbackMessage: string = 'Error inesperado',
): string => {
  // Handle Redux Toolkit rejectWithValue errors first
  // These come from .unwrap() calls and have the structure { message: "error message" }
  // This is the most common pattern in this codebase

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    !error.response
  ) {
    return error.message
  }

  // Handle Axios error responses - these are the most common for direct API calls
  if (error?.response?.data) {
    // Check for message in response data
    if (error.response.data.message) {
      return error.response.data.message
    }
    // Check for error property in response data
    if (error.response.data.error) {
      return error.response.data.error
    }
    // If response data is a string, return it
    if (typeof error.response.data === 'string') {
      return error.response.data
    }
  }

  // Check for direct data.message (non-Axios responses)
  if (error?.data?.message) {
    return error.data.message
  }

  // Check for direct message property (but avoid generic Axios messages)
  if (
    error?.message &&
    !error.message.includes('Request failed with status code')
  ) {
    return error.message
  }

  // Check for string error
  if (typeof error === 'string') {
    return error
  }

  // Return fallback message if no error message found
  return fallbackMessage
}

/**
 * Extracts error message specifically for document operations
 *
 * @param error - The error object from API response or catch block
 * @param operation - The operation being performed (create, update, delete, etc.)
 * @returns Extracted error message with operation-specific fallback
 *
 * @example
 * ```typescript
 * try {
 *   await createDocument(data)
 * } catch (error) {
 *   const message = extractDocumentErrorMessage(error, 'create')
 *   toast.error(message)
 * }
 * ```
 */
export const extractDocumentErrorMessage = (
  error: any,
  operation: 'create' | 'update' | 'delete' | 'fetch' = 'create',
): string => {
  const fallbackMessages = {
    create: 'Error inesperado al crear el documento',
    update: 'Error inesperado al actualizar el documento',
    delete: 'Error inesperado al eliminar el documento',
    fetch: 'Error inesperado al obtener el documento',
  }

  return extractErrorMessage(error, fallbackMessages[operation])
}

/**
 * Generic error message extractor for any resource type
 *
 * @param error - The error object from API response or catch block
 * @param resourceType - The type of resource (producto, cliente, etc.)
 * @param operation - The operation being performed
 * @returns Extracted error message with resource and operation-specific fallback
 *
 * @example
 * ```typescript
 * try {
 *   await updateProduct(data)
 * } catch (error) {
 *   const message = extractResourceErrorMessage(error, 'producto', 'update')
 *   toast.error(message)
 * }
 * ```
 */
export const extractResourceErrorMessage = (
  error: any,
  resourceType: string,
  operation: 'create' | 'update' | 'delete' | 'fetch' = 'create',
): string => {
  const operationMessages = {
    create: `Error inesperado al crear ${resourceType}`,
    update: `Error inesperado al actualizar ${resourceType}`,
    delete: `Error inesperado al eliminar ${resourceType}`,
    fetch: `Error inesperado al obtener ${resourceType}`,
  }

  return extractErrorMessage(error, operationMessages[operation])
}
