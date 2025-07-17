import { useMemo } from 'react'
import { DocumentTypeDetail } from 'src/types/apps/documentTypes'

interface OrderCalculations {
  subtotal: number
  descuentoTotal: number
  impuestoTotal: number
  total: number
  cantidadItems: number
  iscTotal: number
  advTotal: number
  netAmount: number // Amount after all discounts but before taxes
}

interface UseOrderCalculationsProps {
  details: DocumentTypeDetail[]
  includeLineLevelCalculations?: boolean
}

export const useOrderCalculations = ({
  details,
  includeLineLevelCalculations = true,
}: UseOrderCalculationsProps): OrderCalculations => {
  return useMemo(() => {
    if (!details || details.length === 0) {
      return {
        subtotal: 0,
        descuentoTotal: 0,
        impuestoTotal: 0,
        total: 0,
        cantidadItems: 0,
        iscTotal: 0,
        advTotal: 0,
        netAmount: 0,
      }
    }

    // Calculate subtotal from all detail lines
    let subtotal = 0
    let cantidadItems = 0
    let lineDiscounts = 0
    let lineTaxes = 0
    let iscTotal = 0
    let advTotal = 0
    let descuentoTotal = 0
    let impuestoTotal = 0
    details.forEach((detail) => {
      const lineSubtotal = detail.cantidad * detail.factor * detail.precio
      subtotal += lineSubtotal
      cantidadItems += detail.cantidad

      if (includeLineLevelCalculations) {
        // Line-level discount
        const lineDiscount =
          (lineSubtotal * (detail.porcientoDescuento || 0)) / 100

        lineDiscounts += lineDiscount

        // Line-level tax (applied after line discount)
        const taxableAmount = lineSubtotal - lineDiscount
        const lineTax = (taxableAmount * (detail.porcientoImpuesto || 0)) / 100
        lineTaxes += lineTax

        // ISC and ADV from detail
        iscTotal += detail.isc || 0
        advTotal += detail.adv || 0
      }
    })

    // Total discount is line discounts + order discount
    descuentoTotal += lineDiscounts

    // Net amount (after all discounts)
    const netAmount = subtotal - descuentoTotal

    // Total tax is line taxes + order tax (but avoid double taxation)
    impuestoTotal += lineTaxes

    // Final total: net amount + taxes + ISC + ADV
    const total = netAmount + impuestoTotal + iscTotal + advTotal

    return {
      subtotal: Number(subtotal.toFixed(2)),
      descuentoTotal: Number(descuentoTotal.toFixed(2)),
      impuestoTotal: Number(impuestoTotal.toFixed(2)),
      total: Number(total.toFixed(2)),
      cantidadItems,
      iscTotal: Number(iscTotal.toFixed(2)),
      advTotal: Number(advTotal.toFixed(2)),
      netAmount: Number(netAmount.toFixed(2)),
    }
  }, [details, includeLineLevelCalculations])
}
