// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import toast from 'react-hot-toast'
import restClient from 'src/configs/restClient'

// ** Types
import { SetupOption } from 'src/types/apps/onboardingTypes'

export interface OnboardingConfigRequest {
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

export interface OnboardingConfigResponse {
  success: boolean
  message: string
  data?: any
}

interface OnboardingState {
  loading: boolean
  error: string | null
  configuring: boolean
  configurationComplete: boolean
}

const initialState: OnboardingState = {
  loading: false,
  error: null,
  configuring: false,
  configurationComplete: false,
}

// ** Configure Onboarding
export const configureOnboarding = createAsyncThunk(
  'onboarding/configure',
  async (data: OnboardingConfigRequest, { rejectWithValue }) => {
    try {
      const response = await restClient.post<OnboardingConfigResponse>(
        '/api/portal/onboarding/configure',
        data,
      )

      return response.data
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Error configuring onboarding'
      return rejectWithValue(message)
    }
  },
)

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    resetOnboarding: (state) => {
      state.loading = false
      state.error = null
      state.configuring = false
      state.configurationComplete = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(configureOnboarding.pending, (state) => {
        state.loading = true
        state.configuring = true
        state.error = null
      })
      .addCase(configureOnboarding.fulfilled, (state, action) => {
        state.loading = false
        state.configuring = false
        state.configurationComplete = true
        state.error = null
      })
      .addCase(configureOnboarding.rejected, (state, action) => {
        state.loading = false
        state.configuring = false
        state.error = action.payload as string
        toast.error(action.payload as string)
      })
  },
})

export const { resetOnboarding } = onboardingSlice.actions

export default onboardingSlice.reducer
