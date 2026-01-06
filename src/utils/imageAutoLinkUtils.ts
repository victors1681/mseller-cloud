/**
 * Image Auto-Link Utilities
 * Parses filenames to extract product codes and variants
 */

export interface ParsedImageFilename {
  originalFilename: string
  productCode: string | null
  variant: string | null
  isValid: boolean
  isPrimary: boolean
  error?: string
}

/**
 * Supported naming patterns:
 * 1. {codigo}_main.jpg → Primary image
 * 2. {codigo}_principal.jpg → Primary image (Spanish)
 * 3. {codigo}_1.jpg → Secondary image (numbered)
 * 4. {codigo}_angle1.jpg → Named variant
 * 5. {codigo}.jpg → Primary image (simple)
 * 6. {codigo}-variant.jpg → Dash separator
 */
export const NAMING_PATTERNS = [
  // Pattern 1: codigo_variant.ext (primary)
  {
    regex: /^([A-Za-z0-9\-]+)_(main|principal|primary)\.([a-z0-9]+)$/i,
    isPrimary: true,
  },
  // Pattern 2: codigo_variant.ext (secondary) - allows underscores in variant
  {
    regex: /^([A-Za-z0-9\-]+)_([a-z0-9\-_]+)\.([a-z0-9]+)$/i,
    isPrimary: false,
  },
  // Pattern 3: codigo-variant.ext (primary)
  {
    regex: /^([A-Za-z0-9\-]+)-(main|principal|primary)\.([a-z0-9]+)$/i,
    isPrimary: true,
  },
  // Pattern 4: codigo-variant.ext (secondary) - allows underscores in variant
  {
    regex: /^([A-Za-z0-9\-]+)-([a-z0-9\-_]+)\.([a-z0-9]+)$/i,
    isPrimary: false,
  },
  // Pattern 5: codigo.ext (primary by default)
  {
    regex: /^([A-Za-z0-9\-]+)\.([a-z0-9]+)$/i,
    isPrimary: true,
  },
]

/**
 * Parse a filename to extract product code and variant
 */
export function parseImageFilename(filename: string): ParsedImageFilename {
  const result: ParsedImageFilename = {
    originalFilename: filename,
    productCode: null,
    variant: null,
    isValid: false,
    isPrimary: false,
  }

  // Remove path if present
  const basename = filename.split('/').pop() || filename

  // Try each pattern
  for (const pattern of NAMING_PATTERNS) {
    const match = basename.match(pattern.regex)
    if (match) {
      result.productCode = match[1].toUpperCase()
      result.variant = match[2] || null
      result.isValid = true
      result.isPrimary = pattern.isPrimary

      // Check if variant indicates primary
      if (result.variant) {
        const variantLower = result.variant.toLowerCase()
        if (
          ['main', 'principal', 'primary', '1', '01'].includes(variantLower)
        ) {
          result.isPrimary = true
        }
      }

      return result
    }
  }

  result.error = 'Filename does not match any supported pattern'
  return result
}

/**
 * Batch parse multiple filenames
 */
export function parseMultipleFilenames(
  filenames: string[],
): ParsedImageFilename[] {
  return filenames.map(parseImageFilename)
}

/**
 * Group parsed filenames by product code
 */
export function groupByProductCode(
  parsed: ParsedImageFilename[],
): Map<string, ParsedImageFilename[]> {
  const grouped = new Map<string, ParsedImageFilename[]>()

  parsed.forEach((item) => {
    if (item.isValid && item.productCode) {
      const existing = grouped.get(item.productCode) || []
      existing.push(item)
      grouped.set(item.productCode, existing)
    }
  })

  return grouped
}

/**
 * Get validation report for bulk upload
 */
export interface ValidationReport {
  total: number
  valid: number
  invalid: number
  byProduct: Map<string, number>
  errors: Array<{ filename: string; error: string }>
}

export function getValidationReport(
  parsed: ParsedImageFilename[],
): ValidationReport {
  const report: ValidationReport = {
    total: parsed.length,
    valid: 0,
    invalid: 0,
    byProduct: new Map(),
    errors: [],
  }

  parsed.forEach((item) => {
    if (item.isValid && item.productCode) {
      report.valid++
      const count = report.byProduct.get(item.productCode) || 0
      report.byProduct.set(item.productCode, count + 1)
    } else {
      report.invalid++
      report.errors.push({
        filename: item.originalFilename,
        error: item.error || 'Unknown error',
      })
    }
  })

  return report
}

/**
 * Generate example filenames for documentation
 */
export function generateExampleFilenames(productCode: string): string[] {
  return [
    `${productCode}_main.jpg`,
    `${productCode}_principal.png`,
    `${productCode}_angle1.jpg`,
    `${productCode}-main.jpg`,
    `${productCode}.jpg`,
  ]
}

/**
 * Validate product code format
 */
export function isValidProductCode(code: string): boolean {
  // Adjust regex based on your product code format
  // Current: allows alphanumeric and hyphens, 3-20 chars
  return /^[A-Za-z0-9\-]{3,20}$/.test(code)
}
