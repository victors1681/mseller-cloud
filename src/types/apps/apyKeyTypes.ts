export interface ApiKeyType {
  id: number
  apiKey: string
  businessId: string
  active: boolean
  description: string | null
  created?: Date
  updated?: Date
  user: null | string
}

export interface ApiKeyPostType {
  active: boolean
  description: string
}
