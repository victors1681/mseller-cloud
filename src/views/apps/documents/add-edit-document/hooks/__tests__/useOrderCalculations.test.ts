/**
 * Manual Test Suite for useOrderCalculations Hook
 *
 * This file contains test cases that can be run manually to verify
 * the useOrderCalculations hook functionality.
 *
 * To run these tests:
 * 1. Import and use the test functions in a React component
 * 2. Check console output for test results
 * 3. Set up Jest/Vitest later for automated testing
 */

import { renderHook } from '@testing-library/react'
import { useOrderCalculations } from '../useOrderCalculations'
import { DocumentTypeDetail } from 'src/types/apps/documentTypes'

// Mock data factory for creating test details
const createMockDetail = (
  overrides: Partial<DocumentTypeDetail> = {},
): DocumentTypeDetail => ({
  id: '1',
  noPedidoStr: 'ORD-001',
  noPedido: 1,
  codigoVendedor: 'V001',
  codigoProducto: 'PROD-001',
  cantidad: 1,
  precio: 100,
  descripcion: 'Test Product',
  impuesto: 0,
  porcientoImpuesto: 0,
  descuento: 0,
  porcientoDescuento: 0,
  factor: 1,
  factorOriginal: 1,
  isc: 0,
  adv: 0,
  subTotal: 100,
  editar: 1,
  productoRef: '',
  idArea: 0,
  grupoId: '',
  area: '',
  unidad: 'UN',
  tipoImpuesto: '',
  cantidadOriginal: 1,
  promocion: false,
  ...overrides,
})

// Test case interface
interface TestCase {
  name: string
  details: DocumentTypeDetail[]
  options?: {
    includeLineLevelCalculations?: boolean
  }
  expected: {
    subtotal: number
    descuentoTotal: number
    impuestoTotal: number
    total: number
    cantidadItems: number
    iscTotal?: number
    advTotal?: number
    netAmount?: number
  }
}

// Test cases
export const testCases: TestCase[] = [
  {
    name: 'should return zero values for empty details array',
    details: [],
    expected: {
      subtotal: 0,
      descuentoTotal: 0,
      impuestoTotal: 0,
      total: 0,
      cantidadItems: 0,
      iscTotal: 0,
      advTotal: 0,
      netAmount: 0,
    },
  },
  {
    name: 'should return zero values for null/undefined details',
    details: null as any,
    expected: {
      subtotal: 0,
      descuentoTotal: 0,
      impuestoTotal: 0,
      total: 0,
      cantidadItems: 0,
      iscTotal: 0,
      advTotal: 0,
      netAmount: 0,
    },
  },
]

describe('Basic calculations', () => {
  it('should calculate basic subtotal and total for single item without taxes or discounts', () => {
    const details = [
      createMockDetail({
        cantidad: 2,
        precio: 50,
        factor: 1,
      }),
    ]

    const { result } = renderHook(() =>
      useOrderCalculations({
        details,
      }),
    )

    expect(result.current.subtotal).toBe(100) // 2 * 1 * 50
    expect(result.current.cantidadItems).toBe(2)
    expect(result.current.descuentoTotal).toBe(0)
    expect(result.current.impuestoTotal).toBe(0)
    expect(result.current.netAmount).toBe(100)
    expect(result.current.total).toBe(100)
  })

  it('should calculate subtotal with factor applied', () => {
    const details = [
      createMockDetail({
        cantidad: 2,
        precio: 50,
        factor: 1.5,
      }),
    ]

    const { result } = renderHook(() =>
      useOrderCalculations({
        details,
      }),
    )

    expect(result.current.subtotal).toBe(150) // 2 * 1.5 * 50
    expect(result.current.cantidadItems).toBe(2)
    expect(result.current.total).toBe(150)
  })
})

describe('Multiple items calculations', () => {
  it('should calculate totals for multiple items', () => {
    const details = [
      createMockDetail({
        id: '1',
        cantidad: 2,
        precio: 50,
        factor: 1,
      }),
      createMockDetail({
        id: '2',
        cantidad: 3,
        precio: 30,
        factor: 1,
      }),
    ]

    const { result } = renderHook(() =>
      useOrderCalculations({
        details,
      }),
    )

    expect(result.current.subtotal).toBe(190) // (2*1*50) + (3*1*30) = 100 + 90
    expect(result.current.cantidadItems).toBe(5) // 2 + 3
    expect(result.current.total).toBe(190)
  })
})

describe('Discount calculations', () => {
  it('should calculate line-level discounts correctly', () => {
    const details = [
      createMockDetail({
        cantidad: 2,
        precio: 100,
        factor: 1,
        porcientoDescuento: 10, // 10% discount
      }),
    ]

    const { result } = renderHook(() =>
      useOrderCalculations({
        details,
      }),
    )

    expect(result.current.subtotal).toBe(200) // 2 * 1 * 100
    expect(result.current.descuentoTotal).toBe(20) // 200 * 0.10
    expect(result.current.netAmount).toBe(180) // 200 - 20
    expect(result.current.total).toBe(180)
  })

  it('should calculate discounts for multiple items with different discount percentages', () => {
    const details = [
      createMockDetail({
        id: '1',
        cantidad: 1,
        precio: 100,
        factor: 1,
        porcientoDescuento: 10, // 10% discount
      }),
      createMockDetail({
        id: '2',
        cantidad: 1,
        precio: 200,
        factor: 1,
        porcientoDescuento: 20, // 20% discount
      }),
    ]

    const { result } = renderHook(() =>
      useOrderCalculations({
        details,
      }),
    )

    expect(result.current.subtotal).toBe(300) // 100 + 200
    expect(result.current.descuentoTotal).toBe(50) // (100*0.10) + (200*0.20) = 10 + 40
    expect(result.current.netAmount).toBe(250) // 300 - 50
    expect(result.current.total).toBe(250)
  })
})

describe('Tax calculations', () => {
  it('should calculate line-level taxes correctly', () => {
    const details = [
      createMockDetail({
        cantidad: 1,
        precio: 100,
        factor: 1,
        porcientoImpuesto: 18, // 18% tax
      }),
    ]

    const { result } = renderHook(() =>
      useOrderCalculations({
        details,
      }),
    )

    expect(result.current.subtotal).toBe(100)
    expect(result.current.impuestoTotal).toBe(18) // 100 * 0.18
    expect(result.current.netAmount).toBe(100)
    expect(result.current.total).toBe(118) // 100 + 18
  })

  it('should calculate taxes after discounts are applied', () => {
    const details = [
      createMockDetail({
        cantidad: 1,
        precio: 100,
        factor: 1,
        porcientoDescuento: 10, // 10% discount
        porcientoImpuesto: 18, // 18% tax
      }),
    ]

    const { result } = renderHook(() =>
      useOrderCalculations({
        details,
      }),
    )

    expect(result.current.subtotal).toBe(100)
    expect(result.current.descuentoTotal).toBe(10) // 100 * 0.10
    expect(result.current.netAmount).toBe(90) // 100 - 10
    expect(result.current.impuestoTotal).toBe(16.2) // (100 - 10) * 0.18
    expect(result.current.total).toBe(106.2) // 90 + 16.2
  })
})

describe('ISC and ADV calculations', () => {
  it('should include ISC and ADV in total calculations', () => {
    const details = [
      createMockDetail({
        cantidad: 1,
        precio: 100,
        factor: 1,
        isc: 5,
        adv: 3,
      }),
    ]

    const { result } = renderHook(() =>
      useOrderCalculations({
        details,
      }),
    )

    expect(result.current.subtotal).toBe(100)
    expect(result.current.iscTotal).toBe(5)
    expect(result.current.advTotal).toBe(3)
    expect(result.current.netAmount).toBe(100)
    expect(result.current.total).toBe(108) // 100 + 5 + 3
  })

  it('should sum ISC and ADV from multiple items', () => {
    const details = [
      createMockDetail({
        id: '1',
        cantidad: 1,
        precio: 100,
        factor: 1,
        isc: 5,
        adv: 3,
      }),
      createMockDetail({
        id: '2',
        cantidad: 1,
        precio: 50,
        factor: 1,
        isc: 2,
        adv: 1,
      }),
    ]

    const { result } = renderHook(() =>
      useOrderCalculations({
        details,
      }),
    )

    expect(result.current.subtotal).toBe(150)
    expect(result.current.iscTotal).toBe(7) // 5 + 2
    expect(result.current.advTotal).toBe(4) // 3 + 1
    expect(result.current.total).toBe(161) // 150 + 7 + 4
  })
})

describe('Complex scenarios', () => {
  it('should handle complex calculation with discounts, taxes, ISC, and ADV', () => {
    const details = [
      createMockDetail({
        cantidad: 2,
        precio: 100,
        factor: 1.2,
        porcientoDescuento: 15, // 15% discount
        porcientoImpuesto: 18, // 18% tax
        isc: 10,
        adv: 5,
      }),
    ]

    const { result } = renderHook(() =>
      useOrderCalculations({
        details,
      }),
    )

    const expectedSubtotal = 240 // 2 * 100 * 1.2
    const expectedDiscount = 36 // 240 * 0.15
    const expectedNetAmount = 204 // 240 - 36
    const expectedTax = 36.72 // (240 - 36) * 0.18
    const expectedTotal = 255.72 // 204 + 36.72 + 10 + 5

    expect(result.current.subtotal).toBe(expectedSubtotal)
    expect(result.current.descuentoTotal).toBe(expectedDiscount)
    expect(result.current.netAmount).toBe(expectedNetAmount)
    expect(result.current.impuestoTotal).toBe(expectedTax)
    expect(result.current.iscTotal).toBe(10)
    expect(result.current.advTotal).toBe(5)
    expect(result.current.total).toBe(expectedTotal)
  })

  it('should handle real-world order with multiple items and varying rates', () => {
    const details = [
      createMockDetail({
        id: '1',
        cantidad: 3,
        precio: 50,
        factor: 1,
        porcientoDescuento: 5,
        porcientoImpuesto: 18,
        isc: 2,
        adv: 1,
      }),
      createMockDetail({
        id: '2',
        cantidad: 1,
        precio: 200,
        factor: 1.1,
        porcientoDescuento: 10,
        porcientoImpuesto: 18,
        isc: 5,
        adv: 0,
      }),
      createMockDetail({
        id: '3',
        cantidad: 2,
        precio: 75,
        factor: 1,
        porcientoDescuento: 0,
        porcientoImpuesto: 12,
        isc: 0,
        adv: 2,
      }),
    ]

    const { result } = renderHook(() =>
      useOrderCalculations({
        details,
      }),
    )

    // Item 1: 3 * 50 * 1 = 150, discount: 7.5, tax on (150-7.5): 25.65
    // Item 2: 1 * 200 * 1.1 = 220, discount: 22, tax on (220-22): 35.64
    // Item 3: 2 * 75 * 1 = 150, discount: 0, tax on 150: 18

    const expectedSubtotal = 520 // 150 + 220 + 150
    const expectedDiscounts = 29.5 // 7.5 + 22 + 0
    const expectedTaxes = 79.29 // 25.65 + 35.64 + 18
    const expectedISC = 7 // 2 + 5 + 0
    const expectedADV = 3 // 1 + 0 + 2

    expect(result.current.subtotal).toBe(expectedSubtotal)
    expect(result.current.cantidadItems).toBe(6) // 3 + 1 + 2
    expect(result.current.descuentoTotal).toBe(expectedDiscounts)
    expect(result.current.impuestoTotal).toBe(expectedTaxes)
    expect(result.current.iscTotal).toBe(expectedISC)
    expect(result.current.advTotal).toBe(expectedADV)
    expect(result.current.netAmount).toBe(490.5) // 520 - 29.5
    expect(result.current.total).toBe(579.79) // 490.5 + 79.29 + 7 + 3
  })
})

describe('Configuration options', () => {
  it('should skip line-level calculations when includeLineLevelCalculations is false', () => {
    const details = [
      createMockDetail({
        cantidad: 1,
        precio: 100,
        factor: 1,
        porcientoDescuento: 10,
        porcientoImpuesto: 18,
        isc: 5,
        adv: 3,
      }),
    ]

    const { result } = renderHook(() =>
      useOrderCalculations({
        details,
        includeLineLevelCalculations: false,
      }),
    )

    expect(result.current.subtotal).toBe(100)
    expect(result.current.descuentoTotal).toBe(0) // Line discounts ignored
    expect(result.current.impuestoTotal).toBe(0) // Line taxes ignored
    expect(result.current.iscTotal).toBe(0) // ISC ignored
    expect(result.current.advTotal).toBe(0) // ADV ignored
    expect(result.current.netAmount).toBe(100)
    expect(result.current.total).toBe(100)
  })
})

describe('Precision and rounding', () => {
  it('should round results to 2 decimal places', () => {
    const details = [
      createMockDetail({
        cantidad: 3,
        precio: 33.33,
        factor: 1,
        porcientoImpuesto: 18,
      }),
    ]

    const { result } = renderHook(() =>
      useOrderCalculations({
        details,
      }),
    )

    expect(result.current.subtotal).toBe(99.99) // Should be rounded properly
    expect(result.current.impuestoTotal).toBe(18) // Should be rounded properly
    expect(result.current.total).toBe(117.99) // Should be rounded properly
  })

  it('should handle very small numbers correctly', () => {
    const details = [
      createMockDetail({
        cantidad: 1,
        precio: 0.01,
        factor: 1,
        porcientoImpuesto: 1,
      }),
    ]

    const { result } = renderHook(() =>
      useOrderCalculations({
        details,
      }),
    )

    expect(result.current.subtotal).toBe(0.01)
    expect(result.current.impuestoTotal).toBe(0) // 0.01 * 0.01 = 0.0001, rounds to 0
    expect(result.current.total).toBe(0.01)
  })
})

describe('Edge cases', () => {
  it('should handle zero quantities', () => {
    const details = [
      createMockDetail({
        cantidad: 0,
        precio: 100,
        factor: 1,
      }),
    ]

    const { result } = renderHook(() =>
      useOrderCalculations({
        details,
      }),
    )

    expect(result.current.subtotal).toBe(0)
    expect(result.current.cantidadItems).toBe(0)
    expect(result.current.total).toBe(0)
  })

  it('should handle zero prices', () => {
    const details = [
      createMockDetail({
        cantidad: 5,
        precio: 0,
        factor: 1,
      }),
    ]

    const { result } = renderHook(() =>
      useOrderCalculations({
        details,
      }),
    )

    expect(result.current.subtotal).toBe(0)
    expect(result.current.cantidadItems).toBe(5)
    expect(result.current.total).toBe(0)
  })

  it('should handle missing optional fields', () => {
    const details = [
      createMockDetail({
        cantidad: 1,
        precio: 100,
        factor: 1,
        porcientoDescuento: undefined,
        porcientoImpuesto: undefined,
        isc: undefined,
        adv: undefined,
      }),
    ]

    const { result } = renderHook(() =>
      useOrderCalculations({
        details,
      }),
    )

    expect(result.current.subtotal).toBe(100)
    expect(result.current.descuentoTotal).toBe(0)
    expect(result.current.impuestoTotal).toBe(0)
    expect(result.current.iscTotal).toBe(0)
    expect(result.current.advTotal).toBe(0)
    expect(result.current.total).toBe(100)
  })
})

describe('Hook reactivity', () => {
  it('should recalculate when details change', () => {
    const initialDetails = [
      createMockDetail({
        cantidad: 1,
        precio: 100,
        factor: 1,
      }),
    ]

    const { result, rerender } = renderHook(
      ({ details }) => useOrderCalculations({ details }),
      {
        initialProps: { details: initialDetails },
      },
    )

    expect(result.current.total).toBe(100)

    // Add another item
    const updatedDetails = [
      ...initialDetails,
      createMockDetail({
        id: '2',
        cantidad: 1,
        precio: 50,
        factor: 1,
      }),
    ]

    rerender({ details: updatedDetails })

    expect(result.current.total).toBe(150)
  })

  it('should recalculate when configuration changes', () => {
    const details = [
      createMockDetail({
        cantidad: 1,
        precio: 100,
        factor: 1,
        porcientoImpuesto: 18,
      }),
    ]

    const { result, rerender } = renderHook(
      ({ includeLineLevelCalculations }) =>
        useOrderCalculations({ details, includeLineLevelCalculations }),
      {
        initialProps: { includeLineLevelCalculations: true },
      },
    )

    expect(result.current.impuestoTotal).toBe(18)

    rerender({ includeLineLevelCalculations: false })

    expect(result.current.impuestoTotal).toBe(0)
  })
})
