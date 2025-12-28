/**
 * JWT Token Utilities
 *
 * Provides utilities for decoding and working with JWT tokens in the application.
 *
 * @example
 * ```typescript
 * import { decodeJWTToken, isAdministratorFromToken } from 'src/utils/jwtUtils'
 *
 * // Decode a token
 * const token = localStorage.getItem('accessToken')
 * const payload = decodeJWTToken(token)
 * console.log(payload.name, payload.type)
 *
 * // Check if user is administrator
 * if (isAdministratorFromToken(token)) {
 *   // Grant full access
 * }
 * ```
 */

// ** JWT Imports
import { jwtDecode } from 'jwt-decode'
import { Tiers, UserType } from 'src/types/apps/userTypes'

// JWT Token Payload Type
export interface JWTTokenPayload {
  name: string
  picture: string
  business: string
  type: UserType
  userLevel: string
  sellerCode: string
  warehouse: string
  tier: Tiers
  email: string
  email_verified: boolean
  auth_time: number
  user_id: string
  firebase: {
    identities: {
      email: string[]
    }
    sign_in_provider: string
  }
  iat: number
  exp: number
  aud: string
  iss: string
  sub: string
}

/**
 * Decode JWT token and extract payload information
 * @param token - JWT token string
 * @returns Decoded token payload or null if invalid
 */
export const decodeJWTToken = (token: string): JWTTokenPayload | null => {
  try {
    const decoded = jwtDecode<JWTTokenPayload>(token)
    return decoded
  } catch (error) {
    console.error('Error decoding JWT token:', error)
    return null
  }
}

/**
 * Check if token is expired
 * @param token - JWT token string
 * @returns true if token is expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeJWTToken(token)
    if (!decoded || !decoded.exp) return true

    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch (error) {
    return true
  }
}

/**
 * Get user type from token
 * @param token - JWT token string
 * @returns User type or null if invalid
 */
export const getUserTypeFromToken = (token: string): UserType | null => {
  const decoded = decodeJWTToken(token)
  return decoded?.type || null
}

/**
 * Check if user is administrator from token
 * @param token - JWT token string
 * @returns true if user is administrator, false otherwise
 */
export const isAdministratorFromToken = (token: string): boolean => {
  const userType = getUserTypeFromToken(token)
  return userType === UserType.Administrator
}
