import { useCallback, useState } from 'react'
import {
  CODE_PATTERNS,
  CODE_PRESETS,
  CodeGeneratorOptions,
  formatCode,
  generateCustomerCode,
  generateProductCode,
  generateSequentialCode,
  validateCode,
} from 'src/utils/codeGenerator'

/**
 * Custom hook for code generation and validation
 */
export const useCodeGenerator = () => {
  const [lastGeneratedCode, setLastGeneratedCode] = useState<string>('')

  /**
   * Generate a customer code
   */
  const generateCustomer = useCallback(
    (customerName?: string, options?: CodeGeneratorOptions) => {
      const code = generateCustomerCode(customerName, options)
      setLastGeneratedCode(code)
      return code
    },
    [],
  )

  /**
   * Generate a product code
   */
  const generateProduct = useCallback(
    (
      productName?: string,
      category?: string,
      options?: CodeGeneratorOptions,
    ) => {
      const code = generateProductCode(productName, category, options)
      setLastGeneratedCode(code)
      return code
    },
    [],
  )

  /**
   * Generate a sequential code
   */
  const generateSequential = useCallback(
    (
      prefix: string,
      sequence: number,
      options?: Partial<CodeGeneratorOptions>,
    ) => {
      const code = generateSequentialCode(prefix, sequence, options)
      setLastGeneratedCode(code)
      return code
    },
    [],
  )

  /**
   * Validate a code
   */
  const validate = useCallback((code: string, pattern?: RegExp) => {
    return validateCode(code, pattern)
  }, [])

  /**
   * Format a code
   */
  const format = useCallback(
    (code: string, options?: Partial<CodeGeneratorOptions>) => {
      return formatCode(code, options)
    },
    [],
  )

  /**
   * Generate a code with auto-incrementing sequence
   */
  const generateWithAutoSequence = useCallback(
    (
      prefix: string,
      lastSequence: number = 0,
      options?: Partial<CodeGeneratorOptions>,
    ) => {
      const newSequence = lastSequence + 1
      return generateSequential(prefix, newSequence, options)
    },
    [generateSequential],
  )

  return {
    generateCustomer,
    generateProduct,
    generateSequential,
    generateWithAutoSequence,
    validate,
    format,
    lastGeneratedCode,
    patterns: CODE_PATTERNS,
    presets: CODE_PRESETS,
  }
}

export default useCodeGenerator
