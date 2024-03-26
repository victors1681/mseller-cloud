import { ICloudModules, UserTypes } from 'src/types/apps/userTypes'

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
  returnSecureToken?: boolean
}

// export type UserTypes = {
//   id: number
//   role: string
//   email: string
//   fullName: string
//   username: string
//   password: string
//   avatar?: string | null
// }

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserTypes | null
  setLoading: (value: boolean) => void
  setUser: (value: UserTypes | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  loadingForm: boolean
  accessControl?: ICloudModules
}
