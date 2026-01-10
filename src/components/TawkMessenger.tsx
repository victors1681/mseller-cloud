// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import dynamic from 'next/dynamic'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// Dynamically import TawkMessengerReact with no SSR
const TawkMessengerReact = dynamic(
  () => import('@tawk.to/tawk-messenger-react'),
  { ssr: false },
)

// ** Types
interface TawkUserInfo {
  userId: string
  name: string
  email: string
  business: string
  city: string
  country: string
  street: string
  phone: string
  rnc: string
  tier: string
  fromPortal: boolean
  warehouse: string
  sellerCode: string
}

// Store user info outside component to persist across remounts
let cachedUserInfo: TawkUserInfo | null = null
let hasRendered = false

// Helper to build user info object
const buildUserInfo = (user: any): TawkUserInfo => ({
  userId: user.userId,
  name: `${user.firstName} ${user.lastName}`.trim() || 'User',
  email: user.email || '',
  business: user.business?.name || '',
  city: user.business?.address?.city || '',
  warehouse: user.location?.warehouse || '',
  sellerCode: user.location?.sellerCode || '',
  country: user.business?.address?.country || '',
  street: user.business?.address?.street || '',
  phone: user.business?.phone || '',
  rnc: user.business?.rnc || '',
  tier: user.business?.tier || '',
  fromPortal: user.business?.fromPortal || false,
})

const TawkMessenger = () => {
  const { user } = useAuth()

  // Cache user info and set render flag
  useEffect(() => {
    if (user && !hasRendered) {
      cachedUserInfo = buildUserInfo(user)
      hasRendered = true

      // Setup global Tawk_API onLoad listener
      if (typeof window !== 'undefined') {
        const tawkAPI = (window as any).Tawk_API || {}
        tawkAPI.onLoad = () => {
          const globalTawk = (window as any).Tawk_API
          globalTawk.setAttributes(cachedUserInfo)
        }
        ;(window as any).Tawk_API = tawkAPI
      }
    } else if (user && hasRendered && !cachedUserInfo) {
      // Recache if we have user but lost cache
      cachedUserInfo = buildUserInfo(user)
    }
  }, [user])

  // // Set visitor info once widget is ready
  // useEffect(() => {
  //   if (hasRendered && cachedUserInfo) {
  //     const setVisitorInfo = () => {
  //       const globalTawk = (window as any).Tawk_API
  //       if (globalTawk && typeof globalTawk.setAttributes === 'function') {
  //         globalTawk.setAttributes(cachedUserInfo!)
  //         return true
  //       }
  //       return false
  //     }

  //     // Try immediately and once more after a short delay
  //     if (!setVisitorInfo()) {
  //       const timer = setTimeout(setVisitorInfo, 1000)
  //       return () => clearTimeout(timer)
  //     }
  //   }
  // }, [hasRendered])

  // Don't render until user has logged in
  if (!hasRendered) {
    return null
  }

  return (
    <TawkMessengerReact
      propertyId="696247b67c8bd319796ac4dc"
      widgetId="1jejug80h"
    />
  )
}

export default TawkMessenger
