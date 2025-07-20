import { useCallback, useEffect, useState } from 'react'
import { openDB, IDBPDatabase } from 'idb'
import { ProductType } from '@/types/apps/productTypes'
import { CustomerType } from '@/types/apps/customerType'
import { POSCustomer } from '@/types/apps/posTypes'

// Types
export interface POSCart {
  id: string
  cart: POSCartItem[]
  customer: POSCustomer | null
  createdAt: number
  status: 'active' | 'held' | 'pending-sync' | 'synced'
}

export interface POSProductCache {
  products: any[]
  updatedAt: number
}

export interface POSOrder {
  id: string
  cart: POSCartItem[]
  customer: POSCustomer
  createdAt: number
  status: 'pending-sync' | 'synced'
}

export interface POSCartItem {
  id: string
  producto: ProductType
  cantidad: number
  precio: number
  descuento: number
  impuesto: number
  subtotal: number
}

const DB_NAME = 'mseller-pos'
const DB_VERSION = 1
const CART_STORE = 'carts'
const PRODUCT_STORE = 'products'
const ORDER_STORE = 'orders'

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(CART_STORE)) {
        db.createObjectStore(CART_STORE, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(PRODUCT_STORE)) {
        db.createObjectStore(PRODUCT_STORE, { keyPath: 'updatedAt' })
      }
      if (!db.objectStoreNames.contains(ORDER_STORE)) {
        db.createObjectStore(ORDER_STORE, { keyPath: 'id' })
      }
    },
  })
}

export function usePOSPersistence() {
  const [heldCarts, setHeldCarts] = useState<POSCart[]>([])
  const [pendingOrders, setPendingOrders] = useState<POSOrder[]>([])
  const [cachedProducts, setCachedProducts] = useState<POSProductCache | null>(
    null,
  )

  // Load held carts from IndexedDB
  const loadHeldCarts = useCallback(async () => {
    const db = await getDB()
    const carts = await db.getAll(CART_STORE)
    setHeldCarts(carts.filter((c: POSCart) => c.status === 'held'))
  }, [])

  // Save cart for later (hold)
  const holdCart = useCallback(
    async (cart: any[], customer: any) => {
      const db = await getDB()
      const id = `cart_${Date.now()}`
      const heldCart: POSCart = {
        id,
        cart,
        customer,
        createdAt: Date.now(),
        status: 'held',
      }
      await db.put(CART_STORE, heldCart)
      await loadHeldCarts()
      return id
    },
    [loadHeldCarts],
  )

  // Resume a held cart
  const resumeCart = useCallback(async (id: string) => {
    const db = await getDB()
    const cart = await db.get(CART_STORE, id)
    return cart as POSCart | undefined
  }, [])

  // Remove a held cart
  const removeHeldCart = useCallback(
    async (id: string) => {
      const db = await getDB()
      await db.delete(CART_STORE, id)
      await loadHeldCarts()
    },
    [loadHeldCarts],
  )

  // Save products cache
  const cacheProducts = useCallback(async (products: any[]) => {
    const db = await getDB()
    const cache: POSProductCache = {
      products,
      updatedAt: Date.now(),
    }
    await db.put(PRODUCT_STORE, cache)
    setCachedProducts(cache)
  }, [])

  // Load products cache
  const loadProductCache = useCallback(async () => {
    const db = await getDB()
    const caches = await db.getAll(PRODUCT_STORE)
    if (caches.length > 0) {
      setCachedProducts(caches[caches.length - 1])
    }
  }, [])

  // Save order locally if offline
  const savePendingOrder = useCallback(async (cart: any[], customer: any) => {
    const db = await getDB()
    const id = `order_${Date.now()}`
    const order: POSOrder = {
      id,
      cart,
      customer,
      createdAt: Date.now(),
      status: 'pending-sync',
    }
    await db.put(ORDER_STORE, order)
    await loadPendingOrders()
    return id
  }, [])

  // Load pending orders
  const loadPendingOrders = useCallback(async () => {
    const db = await getDB()
    const orders = await db.getAll(ORDER_STORE)
    setPendingOrders(
      orders.filter((o: POSOrder) => o.status === 'pending-sync'),
    )
  }, [])

  // Mark order as synced
  const markOrderSynced = useCallback(
    async (id: string) => {
      const db = await getDB()
      const order = await db.get(ORDER_STORE, id)
      if (order) {
        order.status = 'synced'
        await db.put(ORDER_STORE, order)
        await loadPendingOrders()
      }
    },
    [loadPendingOrders],
  )

  // Sync pending orders when online
  const syncPendingOrders = useCallback(
    async (syncFn: (order: POSOrder) => Promise<void>) => {
      for (const order of pendingOrders) {
        try {
          await syncFn(order)
          await markOrderSynced(order.id)
        } catch (err) {
          // If sync fails, keep as pending
        }
      }
    },
    [pendingOrders, markOrderSynced],
  )

  useEffect(() => {
    loadHeldCarts()
    loadPendingOrders()
    loadProductCache()
  }, [loadHeldCarts, loadPendingOrders, loadProductCache])

  return {
    heldCarts,
    holdCart,
    resumeCart,
    removeHeldCart,
    cachedProducts,
    cacheProducts,
    loadProductCache,
    pendingOrders,
    savePendingOrder,
    syncPendingOrders,
  }
}
