import { useState, useCallback } from 'react'
import { ProductType } from 'src/types/apps/productTypes'
import {
  POSCartItem,
  POSCustomer,
  POSPaymentMethod,
} from 'src/types/apps/posTypes'

interface POSStore {
  cart: POSCartItem[]
  customer: POSCustomer | null
  selectedArea: string | null
  searchQuery: string
  paymentMethod: POSPaymentMethod | null
  isProcessing: boolean
}

interface POSTotals {
  subtotal: number
  descuentoTotal: number
  impuestoTotal: number
  total: number
}

export const usePOSStore = () => {
  const [store, setStore] = useState<POSStore>({
    cart: [],
    customer: null,
    selectedArea: null,
    searchQuery: '',
    paymentMethod: null,
    isProcessing: false,
  })

  const addToCart = useCallback(
    (product: ProductType, quantity: number, precio: number) => {
      setStore((prev) => {
        const existingItemIndex = prev.cart.findIndex(
          (item) => item.producto.codigo === product.codigo,
        )

        if (existingItemIndex >= 0) {
          // Update existing item
          const updatedCart = [...prev.cart]
          const existingItem = updatedCart[existingItemIndex]
          updatedCart[existingItemIndex] = {
            ...existingItem,
            cantidad: existingItem.cantidad + quantity,
            subtotal: (existingItem.cantidad + quantity) * precio,
          }
          return { ...prev, cart: updatedCart }
        } else {
          // Add new item
          const newItem: POSCartItem = {
            id: `${product.codigo}-${Date.now()}`,
            producto: product,
            cantidad: quantity,
            precio: precio,
            subtotal: quantity * precio,
            descuento: 0,
            impuesto: product.impuesto,
          }
          return { ...prev, cart: [...prev.cart, newItem] }
        }
      })
    },
    [],
  )

  const updateCartItem = useCallback(
    (itemId: string, updates: Partial<POSCartItem>) => {
      setStore((prev) => ({
        ...prev,
        cart: prev.cart.map((item) => {
          if (item.id === itemId) {
            const updatedItem = { ...item, ...updates }
            updatedItem.subtotal = updatedItem.cantidad * updatedItem.precio
            return updatedItem
          }
          return item
        }),
      }))
    },
    [],
  )

  const removeFromCart = useCallback((itemId: string) => {
    setStore((prev) => ({
      ...prev,
      cart: prev.cart.filter((item) => item.id !== itemId),
    }))
  }, [])

  const clearCart = useCallback(() => {
    setStore((prev) => ({
      ...prev,
      cart: [],
    }))
  }, [])

  const setCustomer = useCallback((customer: POSCustomer | null) => {
    setStore((prev) => ({
      ...prev,
      customer,
    }))
  }, [])

  const setSelectedArea = useCallback((area: string | null) => {
    setStore((prev) => ({
      ...prev,
      selectedArea: area,
    }))
  }, [])

  const setSearchQuery = useCallback((query: string) => {
    setStore((prev) => ({
      ...prev,
      searchQuery: query,
    }))
  }, [])

  const setPaymentMethod = useCallback((method: POSPaymentMethod | null) => {
    setStore((prev) => ({
      ...prev,
      paymentMethod: method,
    }))
  }, [])

  const setIsProcessing = useCallback((processing: boolean) => {
    setStore((prev) => ({
      ...prev,
      isProcessing: processing,
    }))
  }, [])

  const getTotals = useCallback((): POSTotals => {
    const subtotal = store.cart.reduce((sum, item) => sum + item.subtotal, 0)
    const descuentoTotal = store.cart.reduce(
      (sum, item) => sum + (item.descuento || 0),
      0,
    )
    const impuestoTotal = store.cart.reduce((sum, item) => {
      const itemSubtotal = item.subtotal - (item.descuento || 0)
      return sum + itemSubtotal * (item.impuesto / 100)
    }, 0)
    const total = subtotal - descuentoTotal + impuestoTotal

    return {
      subtotal,
      descuentoTotal,
      impuestoTotal,
      total,
    }
  }, [store.cart])

  return {
    ...store,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    setCustomer,
    setSelectedArea,
    setSearchQuery,
    setPaymentMethod,
    setIsProcessing,
    getTotals,
  }
}
