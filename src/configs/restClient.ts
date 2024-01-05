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
  //restClient.defaults.baseURL = publicRuntimeConfig.INV_MGMT_API_ENDPOINT;
  restClient.interceptors.request.use((config: any) => {
    const newConfig = { ...getExceptions(config, baseURL) }

    const storedToken = window.localStorage.getItem(
      authConfig.storageTokenKeyName,
    )
    if (storedToken) {
      newConfig.headers.Authorization = `Bearer ${storedToken}`
    }

    return newConfig
  })
}

export const setBaseURLofRestClient = (baseURL?: string): void => {
  restClient.defaults.baseURL = baseURL
}

export default restClient
