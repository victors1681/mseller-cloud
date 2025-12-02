/**
 * Convert date filters to ISO 8601 format
 * Handles YYYY-MM-DD format dates and converts them to ISO 8601 timestamps
 */

/**
 * Converts a date string or Date object to ISO 8601 format
 * @param dateValue - Date string in YYYY-MM-DD format or Date object
 * @param endOfDay - If true, sets time to 23:59:59.999, otherwise 00:00:00
 * @returns ISO 8601 formatted date string or undefined if invalid
 */
export const convertToISO8601 = (
  dateValue: string | Date | undefined | null,
  endOfDay = false,
): string | undefined => {
  if (!dateValue) return undefined

  // If already in ISO format (contains 'T'), return as is
  if (typeof dateValue === 'string' && dateValue.includes('T')) {
    return dateValue
  }

  // Build date string with time component
  const dateStr =
    typeof dateValue === 'string'
      ? endOfDay
        ? `${dateValue}T23:59:59.999`
        : `${dateValue}T00:00:00`
      : dateValue.toISOString()

  const date = new Date(dateStr)

  // Validate date
  if (isNaN(date.getTime())) {
    return undefined
  }

  return date.toISOString()
}

/**
 * Converts date filter fields in an object to ISO 8601 format
 * Specifically handles fechaCreacion and fechaDocumento date ranges
 * @param filters - Object containing date filter fields
 * @returns New object with converted date fields
 */
export const convertDateFiltersToISO = <T extends Record<string, any>>(
  filters: T,
): T => {
  const converted = { ...filters } as any

  // Convert fechaCreacionDesde to ISO 8601 (start of day)
  if ('fechaCreacionDesde' in converted && converted.fechaCreacionDesde) {
    converted.fechaCreacionDesde = convertToISO8601(
      converted.fechaCreacionDesde,
      false,
    )
  }

  // Convert fechaCreacionHasta to ISO 8601 (end of day)
  if ('fechaCreacionHasta' in converted && converted.fechaCreacionHasta) {
    converted.fechaCreacionHasta = convertToISO8601(
      converted.fechaCreacionHasta,
      true,
    )
  }

  // Convert fechaDocumentoDesde to ISO 8601 (start of day)
  if ('fechaDocumentoDesde' in converted && converted.fechaDocumentoDesde) {
    converted.fechaDocumentoDesde = convertToISO8601(
      converted.fechaDocumentoDesde,
      false,
    )
  }

  // Convert fechaDocumentoHasta to ISO 8601 (end of day)
  if ('fechaDocumentoHasta' in converted && converted.fechaDocumentoHasta) {
    converted.fechaDocumentoHasta = convertToISO8601(
      converted.fechaDocumentoHasta,
      true,
    )
  }

  return converted as T
}
