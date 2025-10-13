/**
 * Utility functions for generating user-friendly codes for customers and products
 */

/**
 * Generates a user-friendly customer code
 * @param options Configuration options for code generation
 * @returns A formatted customer code
 */
export interface CodeGeneratorOptions {
  prefix?: string
  length?: number
  includeDate?: boolean
  includeSequence?: boolean
  separator?: string
  useUpperCase?: boolean
}

/**
 * Generates a user-friendly customer code
 * @param customerName Optional customer name to base the code on
 * @param options Configuration options
 * @returns Generated customer code
 */
export const generateCustomerCode = (
  customerName?: string,
  options: CodeGeneratorOptions = {},
): string => {
  const {
    prefix = 'CLI',
    length = 6,
    includeDate = true,
    includeSequence = true,
    separator = '-',
    useUpperCase = true,
  } = options

  let code = prefix

  // Add date component if requested
  if (includeDate) {
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    code += separator + year + month
  }

  // Add customer name initials if available
  if (customerName) {
    const initials = extractInitials(customerName, 2)
    if (initials) {
      code += separator + initials
    }
  }

  // Add sequence number if requested
  if (includeSequence) {
    const sequence = generateSequenceNumber(length)
    code += separator + sequence
  }

  return useUpperCase ? code.toUpperCase() : code
}

/**
 * Generates a user-friendly product code
 * @param productName Optional product name to base the code on
 * @param category Optional product category
 * @param options Configuration options
 * @returns Generated product code
 */
export const generateProductCode = (
  productName?: string,
  category?: string,
  options: CodeGeneratorOptions = {},
): string => {
  const {
    prefix = 'PROD',
    length = 6,
    includeDate = false,
    includeSequence = true,
    separator = '-',
    useUpperCase = true,
  } = options

  let code = prefix

  // Add category abbreviation if available
  if (category) {
    const categoryCode = extractInitials(category, 3)
    if (categoryCode) {
      code += separator + categoryCode
    }
  }

  // Add product name initials if available
  if (productName) {
    const initials = extractInitials(productName, 3)
    if (initials) {
      code += separator + initials
    }
  }

  // Add date component if requested
  if (includeDate) {
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    code += separator + year + month
  }

  // Add sequence number if requested
  if (includeSequence) {
    const sequence = generateSequenceNumber(length)
    code += separator + sequence
  }

  return useUpperCase ? code.toUpperCase() : code
}

/**
 * Generates a simple sequential code
 * @param prefix Code prefix
 * @param sequence Sequence number
 * @param options Configuration options
 * @returns Generated sequential code
 */
export const generateSequentialCode = (
  prefix: string,
  sequence: number,
  options: Partial<CodeGeneratorOptions> = {},
): string => {
  const { length = 6, separator = '-', useUpperCase = true } = options

  const paddedSequence = sequence.toString().padStart(length, '0')
  const code = `${prefix}${separator}${paddedSequence}`

  return useUpperCase ? code.toUpperCase() : code
}

/**
 * Validates if a code follows the expected format
 * @param code Code to validate
 * @param pattern Expected pattern (regex)
 * @returns Whether the code is valid
 */
export const validateCode = (code: string, pattern?: RegExp): boolean => {
  if (!code || code.trim() === '') {
    return false
  }

  // Default pattern: PREFIX-XXXXX format
  const defaultPattern = /^[A-Z]{2,4}-[A-Z0-9]{2,10}$/i

  const validationPattern = pattern || defaultPattern

  return validationPattern.test(code)
}

/**
 * Formats an existing code to ensure consistency
 * @param code Code to format
 * @param options Formatting options
 * @returns Formatted code
 */
export const formatCode = (
  code: string,
  options: Partial<CodeGeneratorOptions> = {},
): string => {
  const { separator = '-', useUpperCase = true } = options

  if (!code) return ''

  // Clean the code
  let cleanCode = code.trim().replace(/\s+/g, '')

  // Replace common separators with the desired one
  cleanCode = cleanCode.replace(/[_\s\.]/g, separator)

  // Apply case formatting
  return useUpperCase ? cleanCode.toUpperCase() : cleanCode.toLowerCase()
}

// Helper functions

/**
 * Extracts initials from a text string
 */
const extractInitials = (text: string, maxLength: number = 3): string => {
  if (!text) return ''

  // Remove special characters and split by spaces
  const words = text
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 0)

  let initials = ''

  // Get first letter of each word
  for (const word of words) {
    if (initials.length >= maxLength) break
    initials += word.charAt(0)
  }

  // If we don't have enough initials, take more characters from the first word
  if (initials.length < maxLength && words.length > 0) {
    const firstWord = words[0]
    const needed = maxLength - initials.length
    const additional = firstWord.slice(1, 1 + needed)
    initials = firstWord.charAt(0) + additional
  }

  return initials.slice(0, maxLength)
}

/**
 * Generates a random sequence number
 */
const generateSequenceNumber = (length: number): string => {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 10000).toString()
  const combined = timestamp + random

  // Take the last digits to ensure we have the requested length
  return combined.slice(-length).padStart(length, '0')
}

/**
 * Common code patterns for validation
 */
export const CODE_PATTERNS = {
  CUSTOMER: /^CLI-[0-9]{4}-[A-Z]{2,3}-[0-9]{6}$/i,
  PRODUCT: /^PROD-[A-Z]{3}-[A-Z]{3}-[0-9]{6}$/i,
  SIMPLE_SEQUENTIAL: /^[A-Z]{2,4}-[0-9]{3,8}$/i,
  ALPHANUMERIC: /^[A-Z0-9]{2,4}-[A-Z0-9]{2,10}$/i,
} as const

/**
 * Preset configurations for common use cases
 */
export const CODE_PRESETS = {
  CUSTOMER_DEFAULT: {
    prefix: 'CLI',
    length: 6,
    includeDate: true,
    includeSequence: true,
    separator: '-',
    useUpperCase: true,
  },
  PRODUCT_DEFAULT: {
    prefix: 'PROD',
    length: 6,
    includeDate: false,
    includeSequence: true,
    separator: '-',
    useUpperCase: true,
  },
  SIMPLE: {
    prefix: 'COD',
    length: 4,
    includeDate: false,
    includeSequence: true,
    separator: '-',
    useUpperCase: true,
  },
} as const
