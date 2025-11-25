import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import Router from 'next/router'
import toast from 'react-hot-toast'
import authConfig from 'src/configs/auth'
import { refreshAccessToken } from 'src/firebase'
import { IConfig } from 'src/types/apps/userTypes'

export enum NetworkStatus {
  INITIAL = 0,
  LOADING = 1,
  SUCCESS = 2,
  ERROR = 3,
}

// Flag to prevent multiple simultaneous session expiration redirects
let isHandlingSessionExpiration = false
// Flag to prevent infinite retry loops
let isRefreshingToken = false

const restClient = axios.create({
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
})
export const getExceptions = (config: AxiosRequestConfig, baseURL?: string) => {
  if (baseURL) {
    config.baseURL = baseURL
  }

  return config
}

export const axiosSetClientUrl = (config?: IConfig, userTestMode?: boolean) => {
  if (config?.serverUrl) {
    if (config.testMode || userTestMode) {
      restClient.defaults.headers[
        'X-URL'
      ] = `${config.portalSandboxUrl}:${config.portalSandboxPort}`
    } else {
      restClient.defaults.headers[
        'X-URL'
      ] = `${config.portalServerUrl}:${config.portalServerPort}`
    }
  }
}
export const configureRestClient = (baseURL?: string): void => {
  // Base API path
  restClient.interceptors.request.use((config) => {
    const newConfig = { ...getExceptions(config, baseURL) } as any

    const storedToken = window.localStorage.getItem(
      authConfig.storageTokenKeyName,
    )
    if (storedToken) {
      newConfig.headers.Authorization = `Bearer ${storedToken}`
    }

    return newConfig
  })
}

restClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.error(
        'StatusCode:',
        error.response.status,
        error.response.statusText,
      )

      // Only handle session expiration once to prevent redirect loops
      if (typeof window !== 'undefined' && !isHandlingSessionExpiration) {
        isHandlingSessionExpiration = true

        // Try to refresh the token first
        if (!isRefreshingToken) {
          isRefreshingToken = true

          try {
            console.log('🔄 Attempting to refresh Firebase token...')
            const newToken = await refreshAccessToken()

            if (newToken) {
              console.log('✅ Token refreshed successfully')
              // Update the token in localStorage
              window.localStorage.setItem(
                authConfig.storageTokenKeyName,
                newToken,
              )

              // Update the failed request with new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              originalRequest._retry = true

              // Reset flags
              isRefreshingToken = false
              isHandlingSessionExpiration = false

              // Retry the original request
              return restClient(originalRequest)
            }
          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError)
            isRefreshingToken = false
          }
        }

        // If token refresh failed or wasn't attempted, log out
        console.log('🚪 Logging out user - token refresh failed or unavailable')
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.')

        // Clear auth data
        window.localStorage.removeItem('userData')
        window.localStorage.removeItem(authConfig.storageTokenKeyName)

        // Get current path to save as returnUrl
        const currentPath = Router.asPath
        const guestPages = ['/login', '/register', '/forgot-password']
        const isOnGuestPage = guestPages.some((page) =>
          currentPath.startsWith(page),
        )

        // Redirect to login with returnUrl (if not already on a guest page)
        if (!isOnGuestPage) {
          Router.replace({
            pathname: '/login',
            query: currentPath !== '/' ? { returnUrl: currentPath } : undefined,
          }).finally(() => {
            // Reset flag after navigation completes
            setTimeout(() => {
              isHandlingSessionExpiration = false
            }, 1000)
          })
        } else {
          // Reset flag immediately if already on guest page
          isHandlingSessionExpiration = false
        }
      }
    }

    return Promise.reject(error)
  },
)

export const setBaseURLofRestClient = (baseURL?: string): void => {
  restClient.defaults.baseURL = baseURL
}

export default restClient
