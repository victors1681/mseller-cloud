// ** Datadog RUM Imports
import { datadogRum } from '@datadog/browser-rum'
import { reactPlugin } from '@datadog/browser-rum-react'

// ** Types
import { UserTypes } from 'src/types/apps/userTypes'

let isInitialized = false

export const initializeDatadog = () => {
  // Only initialize once and only in browser
  if (isInitialized || typeof window === 'undefined') {
    return
  }

  datadogRum.init({
    applicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID || '',
    clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN || '',
    site: process.env.NEXT_PUBLIC_DATADOG_SITE || 'datadoghq.com',
    service: process.env.NEXT_PUBLIC_DATADOG_SERVICE || 'mseller-cloud',
    env: process.env.NEXT_PUBLIC_DATADOG_ENV || 'prod',

    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    plugins: [reactPlugin({ router: true })],
  })

  isInitialized = true
}

export const setDatadogUser = (user: UserTypes | null) => {
  if (!isInitialized || typeof window === 'undefined') {
    return
  }

  if (user) {
    datadogRum.setUser({
      id: user.userId,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      // Business information
      business_id: user.businessId,
      business_name: user.business?.name,
      business_rnc: user.business?.rnc,
      business_phone: user.business?.phone,
      business_tier: user.business?.tier,
      // User details
      user_type: user.type,
      seller_code: user.sellerCode,
      warehouse: user.warehouse,
      // Subscription info
      subscription_status: user.business?.subscriptionStatus,
    })
  } else {
    // Clear user context on logout
    datadogRum.clearUser()
  }
}

export const datadogLogger = {
  info: (message: string, context?: Record<string, any>) => {
    if (isInitialized) {
      datadogRum.addAction(message, context)
    }
  },
  error: (message: string, error?: Error, context?: Record<string, any>) => {
    if (isInitialized) {
      datadogRum.addError(error || new Error(message), {
        ...context,
        message,
      })
    }
  },
}
