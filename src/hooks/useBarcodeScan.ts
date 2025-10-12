import { useEffect } from 'react'
import { ProductType } from 'src/types/apps/productTypes'

interface UseBarcodeScanOptions {
  products: ProductType[]
  onProductFound: (product: ProductType) => void
  minBarcodeLength?: number
}

export function useBarcodeScan({
  products,
  onProductFound,
  minBarcodeLength = 6,
}: UseBarcodeScanOptions) {
  useEffect(() => {
    let barcodeBuffer = ''
    let lastKeyTime = Date.now()
    const maxInterval = 50 // ms between keystrokes for barcode

    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now()
      // If time between keys is too long, reset buffer
      if (now - lastKeyTime > 200) barcodeBuffer = ''
      lastKeyTime = now

      // Ignore modifier keys
      if (e.ctrlKey || e.altKey || e.metaKey) return

      // If Enter is pressed, process barcode
      if (e.key === 'Enter' && barcodeBuffer.length >= minBarcodeLength) {
        const code = barcodeBuffer.trim()
        const foundProduct = products.find(
          (product: ProductType) =>
            product.codigoBarra &&
            product.codigoBarra.toLowerCase() === code.toLowerCase(),
        )
        if (foundProduct) {
          onProductFound(foundProduct)
        }
        barcodeBuffer = ''
      } else if (/^[a-zA-Z0-9]$/.test(e.key)) {
        barcodeBuffer += e.key
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [products, onProductFound, minBarcodeLength])
}
