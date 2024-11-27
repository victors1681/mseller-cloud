import {
  SignUpRequest,
  SignUpType,
  TriggerForgotPasswordProps,
  TriggerForgotPasswordType,
  UpdatePasswordRequest,
  UpdatePasswordType,
} from 'src/firebase'
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
  signUp: (
    value: SignUpRequest,
  ) => Promise<SignUpType | { error: string } | undefined>
  updatePassword: (
    value: UpdatePasswordRequest,
  ) => Promise<UpdatePasswordType | { error: string } | undefined>
  triggerForgotPassword: (
    value: TriggerForgotPasswordProps,
  ) => Promise<TriggerForgotPasswordType | { error: string } | undefined>
}
