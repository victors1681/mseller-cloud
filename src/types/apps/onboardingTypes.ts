/**
 * Onboarding Types
 *
 * Types related to the user onboarding process
 */

// Setup Option Type - represents different ways to initialize the system
export type SetupOption = 'new' | 'sample' | 'upload' | 'advanced'

// Onboarding data structure
export interface OnboardingData {
  businessName: string
  phone: string
  street: string
  city: string
  country: string
  rnc?: string
  businessType: string
  industry: string
  setupOption: SetupOption | null
}
