/**
 * Utility functions for downloading files and opening print windows
 */

/**
 * Downloads a file from a given URL
 * @param url - The URL to download from
 * @param filename - The filename to save as
 */
export const downloadFromUrl = (url: string, filename: string): void => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Downloads a blob as a file
 * @param blob - The blob to download
 * @param filename - The filename to save as
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob)
  downloadFromUrl(url, filename)
  window.URL.revokeObjectURL(url)
}

/**
 * Opens a new window for printing with query parameters
 * @param path - The path to open (e.g., '/apps/ecf/audit/print')
 * @param params - Object containing query parameters
 */
export const openPrintWindow = (
  path: string,
  params: Record<string, any>,
): void => {
  const queryString = Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== '',
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&')

  const url = queryString ? `${path}?${queryString}` : path
  window.open(url, '_blank')
}
