import axios, { AxiosRequestConfig } from 'axios'
import authConfig from 'src/configs/auth'
import { Config } from 'src/context/types'

export enum NetworkStatus {
  INITIAL = 0,
  LOADING = 1,
  SUCCESS = 2,
  ERROR = 3,
}

const restClient = axios.create()
export const getExceptions = (config: AxiosRequestConfig, baseURL?: string) => {
  if (baseURL) {
    config.baseURL = baseURL
  }

  return config
}

export const axiosSetClientUrl = (config?: Config) => {
  if (config?.serverUrl) {
    restClient.defaults.headers['X-URL'] = config.serverUrl
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
  (error) => {
    if (error.response.status === 401) {
      console.error(
        'StatusCode:',
        error.response.status,
        error.response.statusText,
      )
      if (typeof window !== 'undefined') {
        window?.location.reload()
      }
    }
    return error
  },
)

export const setBaseURLofRestClient = (baseURL?: string): void => {
  restClient.defaults.baseURL = baseURL
}

export default restClient
