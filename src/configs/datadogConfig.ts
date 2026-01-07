// ** Datadog RUM Imports
import { datadogRum } from '@datadog/browser-rum'

// ** Types
import { UserTypes } from 'src/types/apps/userTypes'

let isInitialized = false

export const initializeDatadog = () => {
  // Only initialize once and only in browser (Next.js SSR check)
  if (isInitialized) {
    console.log('⚠️ Datadog already initialized, skipping')
    return
  }

  if (typeof window === 'undefined') {
    console.log(
      '⚠️ Not in browser environment, skipping Datadog initialization',
    )
    return
  }

  // Skip initialization during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('⚠️ Build phase detected, skipping Datadog initialization')
    return
  }

  // Verify required env vars
  const appId = process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID
  const clientToken = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN

  if (!appId || !clientToken) {
    console.error('❌ Datadog credentials missing!', {
      hasAppId: !!appId,
      hasClientToken: !!clientToken,
    })
    return
  }

  const config = {
    applicationId: appId,
    clientToken: clientToken,
    site: process.env.NEXT_PUBLIC_DATADOG_SITE || 'datadoghq.com',
    service: process.env.NEXT_PUBLIC_DATADOG_SERVICE || 'mseller-cloud',
    env: process.env.NEXT_PUBLIC_DATADOG_ENV || 'prod',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    trackFrustrations: true,
    trackViewsManually: false, // Let Datadog auto-track views
    enableExperimentalFeatures: ['clickmap'] as any,
    defaultPrivacyLevel: 'mask-user-input' as const,
    allowedTracingUrls: [
      /https:\/\/.*\.firebaseapp\.com/,
      /https:\/\/.*\.cloudfunctions\.net/,
      window.location.origin,
      `${window.location.origin}/api`,
    ],
    excludedActivityUrls: [
      /_next\/static/,
      /_next\/webpack/,
      /webpack-hmr/,
      /__nextjs_original-stack-frame/,
    ],
  }

  console.log('🐶 Initializing Datadog RUM...', {
    applicationId: config.applicationId,
    service: config.service,
    env: config.env,
    version: config.version,
    origin: window.location.origin,
  })

  try {
    datadogRum.init(config)

    // Start session replay
    datadogRum.startSessionReplayRecording()

    // Add Next.js specific context
    datadogRum.setGlobalContextProperty('app_platform', 'web')
    datadogRum.setGlobalContextProperty('app_framework', 'nextjs')
    datadogRum.setGlobalContextProperty('deployment_type', 'cloud')
    datadogRum.setGlobalContextProperty('nextjs_version', '14')

    // Send a test action to confirm RUM is working
    datadogRum.addAction('datadog_rum_initialized', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      referrer: document.referrer,
      origin: window.location.origin,
    })

    console.log('✅ Datadog RUM initialized successfully')
    isInitialized = true
  } catch (error) {
    console.error('❌ Failed to initialize Datadog RUM:', error)
  }
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
      business_status: user.business?.status ? 'active' : 'inactive',
      // User details
      user_type: user.type,
      seller_code: user.sellerCode,
      warehouse: user.warehouse,
      user_level: user.userLevel,
      // Subscription info
      subscription_status: user.business?.subscriptionStatus,
      subscription_id: user.business?.subscriptionId,
      // Feature flags
      test_mode: user.testMode,
      edit_price: user.editPrice,
      filter_clients: user.filterClients,
      only_my_clients: user.onlyMyClients,
    })

    // Set additional global context
    datadogRum.setGlobalContextProperty('business_id', user.businessId)
    datadogRum.setGlobalContextProperty(
      'business_tier',
      user.business?.tier || 'unknown',
    )
    datadogRum.setGlobalContextProperty('user_type', user.type)
    datadogRum.setGlobalContextProperty('warehouse', user.warehouse)

    console.log('👤 Datadog user context updated:', user.userId)
  } else {
    // Clear user context on logout
    datadogRum.clearUser()
    datadogRum.removeGlobalContextProperty('business_id')
    datadogRum.removeGlobalContextProperty('business_tier')
    datadogRum.removeGlobalContextProperty('user_type')
    datadogRum.removeGlobalContextProperty('warehouse')
    console.log('🚪 Datadog user context cleared')
  }
}

// Track page views with custom context
export const trackPageView = (
  pageName: string,
  properties?: Record<string, any>,
) => {
  if (!isInitialized) {
    console.warn('Datadog not initialized, skipping page view tracking')
    return
  }

  try {
    // Use startView for proper page tracking
    datadogRum.startView({
      name: pageName,
    })

    // Add additional context as action
    if (properties && Object.keys(properties).length > 0) {
      datadogRum.addAction('page_view_context', {
        page_name: pageName,
        timestamp: new Date().toISOString(),
        ...properties,
      })
    }

    console.log('📄 Page view tracked:', pageName)
  } catch (error) {
    console.error('Failed to track page view:', error)
  }
}

// Track business events
export const trackBusinessEvent = (
  eventName: string,
  category:
    | 'order'
    | 'payment'
    | 'customer'
    | 'inventory'
    | 'transport'
    | 'user'
    | 'system',
  properties?: Record<string, any>,
) => {
  if (!isInitialized) return

  datadogRum.addAction(eventName, {
    category,
    timestamp: new Date().toISOString(),
    ...properties,
  })
}

// Track API calls
export const trackApiCall = (
  endpoint: string,
  method: string,
  status: number,
  duration: number,
  error?: string,
) => {
  if (!isInitialized) return

  const isError = status >= 400
  const context = {
    endpoint,
    method,
    status,
    duration_ms: duration,
    is_error: isError,
    ...(error && { error_message: error }),
  }

  if (isError) {
    datadogRum.addError(new Error(`API Error: ${method} ${endpoint}`), {
      ...context,
      type: 'api_error',
    })
  } else {
    datadogRum.addAction('api_call', context)
  }
}

// Track performance metrics
export const trackPerformanceMetric = (
  metricName: string,
  value: number,
  unit: 'ms' | 'bytes' | 'count',
  tags?: Record<string, any>,
) => {
  if (!isInitialized) return

  datadogRum.addAction(`performance_${metricName}`, {
    metric_name: metricName,
    value,
    unit,
    timestamp: new Date().toISOString(),
    ...tags,
  })
}

// Enhanced logger with more context
export const datadogLogger = {
  info: (message: string, context?: Record<string, any>) => {
    if (isInitialized) {
      datadogRum.addAction(message, {
        level: 'info',
        timestamp: new Date().toISOString(),
        ...context,
      })
    }
  },
  warn: (message: string, context?: Record<string, any>) => {
    if (isInitialized) {
      datadogRum.addAction(message, {
        level: 'warn',
        timestamp: new Date().toISOString(),
        ...context,
      })
    }
  },
  error: (message: string, error?: Error, context?: Record<string, any>) => {
    if (isInitialized) {
      datadogRum.addError(error || new Error(message), {
        level: 'error',
        timestamp: new Date().toISOString(),
        ...context,
        message,
        stack: error?.stack,
      })
    }
  },
  debug: (message: string, context?: Record<string, any>) => {
    if (isInitialized && process.env.NODE_ENV === 'development') {
      datadogRum.addAction(message, {
        level: 'debug',
        timestamp: new Date().toISOString(),
        ...context,
      })
    }
  },
}

// Track React errors
export const trackReactError = (
  error: Error,
  errorInfo: any,
  componentStack?: string,
) => {
  if (!isInitialized) return

  datadogRum.addError(error, {
    type: 'react_error',
    component_stack: componentStack || errorInfo?.componentStack,
    timestamp: new Date().toISOString(),
    error_boundary: true,
  })
}

// Track user interactions
export const trackUserInteraction = (
  actionName: string,
  target: string,
  properties?: Record<string, any>,
) => {
  if (!isInitialized) return

  datadogRum.addAction(actionName, {
    interaction_type: 'user_action',
    target,
    timestamp: new Date().toISOString(),
    ...properties,
  })
}
