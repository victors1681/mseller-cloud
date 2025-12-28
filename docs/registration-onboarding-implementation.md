# Registration & Onboarding Flow Implementation

## Overview

This implementation provides a comprehensive registration and onboarding system with Firebase authentication, including email/password and social login (Google & Apple), followed by a multi-step onboarding process that must be completed before accessing the application.

## Features

### 1. Registration Page (`/register/simple`)

- **Email/Password Registration**: Traditional registration with validation
- **Social Login Integration**:
  - Continue with Google
  - Continue with Apple
- **Email Verification**: Automatic verification email sent on registration
- **Modern UI**: Clean, professional design with proper button styling

### 2. Multi-Step Onboarding Flow (`/onboarding`)

Six-step onboarding process:

1. **Business Name**: Enter the name of the business
2. **Phone Number**: Enter contact phone with auto-formatting
3. **Address**: Enter business physical address
4. **Country**: Select country with conditional RNC field for Dominican Republic
5. **Business Type & Industry**: Select business category and industry
6. **Data Setup Options**: Choose initial configuration:
   - Start new configuration (clean setup)
   - Start from sample data (demo data)
   - Upload my information (import existing data)
   - Option to change mind and start from scratch

### 3. User Tracking

Two new fields added to user profile:

- `hasCompletedOnboarding`: Boolean flag to track onboarding completion
- `isEmailVerified`: Boolean flag to track email verification status

### 4. Route Protection

- **OnboardingGuard**: Protects all routes and redirects users to onboarding if not completed
- **Automatic Redirection**: Users cannot access the application until onboarding is complete
- **Smart Routing**: Once onboarding is complete, users cannot return to onboarding page

## File Structure

```
src/
├── pages/
│   ├── register/
│   │   └── simple.tsx                    # New simplified registration page
│   └── onboarding/
│       └── index.tsx                     # Main onboarding page with stepper
├── views/
│   └── onboarding/
│       ├── BusinessNameStep.tsx          # Step 1: Business name
│       ├── PhoneStep.tsx                 # Step 2: Phone number
│       ├── AddressStep.tsx               # Step 3: Business address
│       ├── CountryStep.tsx               # Step 4: Country & RNC
│       ├── BusinessTypeStep.tsx          # Step 5: Business type & industry
│       └── DataSetupStep.tsx             # Step 6: Setup options
├── @core/
│   └── components/
│       └── auth/
│           └── OnboardingGuard.tsx       # Route guard for onboarding
├── types/
│   └── apps/
│       └── userTypes.ts                  # Updated with onboarding fields
└── context/
    └── AuthContext.tsx                   # Updated with onboarding logic
```

## Implementation Details

### Registration Flow

#### Email/Password Registration

```typescript
// Creates user in Firebase Auth
const userCredential = await createUserWithEmailAndPassword(
  auth,
  email,
  password,
)

// Sends verification email
await sendEmailVerification(userCredential.user)

// Creates user profile via Cloud Function
const createUserProfile = httpsCallable(functions, 'createUserProfile')
await createUserProfile({
  userId: userCredential.user.uid,
  email: data.email,
  hasCompletedOnboarding: false,
  isEmailVerified: false,
})

// Redirects to onboarding
router.push('/onboarding')
```

#### Social Login (Google/Apple)

```typescript
// Initialize provider
const provider = new GoogleAuthProvider() // or OAuthProvider('apple.com')

// Sign in with popup
const result = await signInWithPopup(auth, provider)

// Create user profile
await createUserProfile({
  userId: result.user.uid,
  email: result.user.email,
  photoURL: result.user.photoURL,
  hasCompletedOnboarding: false,
  isEmailVerified: result.user.emailVerified,
})

// Redirects to onboarding
router.push('/onboarding')
```

### Onboarding Flow

The onboarding process uses Material-UI Stepper component with validation at each step:

```typescript
interface OnboardingData {
  businessName: string
  phone: string
  address: string
  country: string
  rnc?: string // Only for Dominican Republic
  businessType: string
  industry: string
  setupOption: 'new' | 'sample' | 'upload' | null
}
```

### Route Protection

The `OnboardingGuard` component wraps the entire application in `_app.tsx`:

```typescript
<Guard authGuard={authGuard} guestGuard={guestGuard}>
  <OnboardingGuard fallback={<Spinner />}>
    <AclGuard ...>
      {getLayout(<Component {...pageProps} />)}
    </AclGuard>
  </OnboardingGuard>
</Guard>
```

Logic:

- If user is authenticated but hasn't completed onboarding → redirect to `/onboarding`
- If user has completed onboarding and tries to access `/onboarding` → redirect to `/`
- If user hasn't completed onboarding → block access to all protected routes

### AuthContext Updates

The authentication context now checks for onboarding status on login:

```typescript
// Check if user needs to complete onboarding
const needsOnboarding = !userData.hasCompletedOnboarding
const onOnboardingPage = router.pathname === '/onboarding'

// Redirect to onboarding if needed
if (needsOnboarding && !onOnboardingPage) {
  await router.replace('/onboarding')
  return
}

// Redirect away from onboarding if already completed
if (!needsOnboarding && onOnboardingPage) {
  await router.replace('/')
  return
}
```

## Firebase Backend Requirements

You need to implement the following Cloud Functions:

### 1. `createUserProfile`

Creates initial user profile after registration:

```typescript
exports.createUserProfile = functions.https.onCall(async (data, context) => {
  const { userId, email, photoURL, hasCompletedOnboarding, isEmailVerified } =
    data

  // Create user document in Firestore
  await admin
    .firestore()
    .collection('users')
    .doc(userId)
    .set({
      userId,
      email,
      photoURL: photoURL || '',
      hasCompletedOnboarding: hasCompletedOnboarding || false,
      isEmailVerified: isEmailVerified || false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      // ... other default fields
    })

  return { success: true }
})
```

### 2. `completeOnboarding`

Saves onboarding data and marks user as completed:

```typescript
exports.completeOnboarding = functions.https.onCall(async (data, context) => {
  const { userId, onboardingData, hasCompletedOnboarding } = data

  // Update user profile
  await admin
    .firestore()
    .collection('users')
    .doc(userId)
    .update({
      hasCompletedOnboarding: true,
      // Save onboarding data
      business: {
        name: onboardingData.businessName,
        phone: onboardingData.phone,
        address: {
          street: onboardingData.address,
          country: onboardingData.country,
        },
        rnc: onboardingData.rnc || '',
        businessType: onboardingData.businessType,
        industry: onboardingData.industry,
        setupOption: onboardingData.setupOption,
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

  return { success: true }
})
```

## Firebase Configuration

Ensure your Firebase project has:

1. **Authentication Providers Enabled**:

   - Email/Password
   - Google
   - Apple (requires Apple Developer account)

2. **Firestore Security Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. **Email Templates** configured in Firebase Console for verification emails

## Usage

### Accessing the Registration Page

Navigate to: `/register/simple`

This is a standalone, simplified registration page with:

- Email/password registration
- Google sign-in button
- Apple sign-in button

### Testing the Flow

1. **Register a new user** at `/register/simple`
2. User is automatically redirected to `/onboarding`
3. Complete all 6 steps of onboarding
4. On completion, user is redirected to `/` (home)
5. User cannot access `/onboarding` again after completion
6. If user logs out and back in without completing onboarding, they are redirected back to `/onboarding`

## Styling & Responsiveness

All components follow the project's mobile-first design principles:

- Responsive layouts using MUI Grid system
- Mobile-optimized forms and inputs
- Touch-friendly button sizes
- Proper spacing for different screen sizes
- Material Design guidelines

## Future Enhancements

Potential improvements:

1. **Email Verification Check**: Prevent access until email is verified
2. **Progress Persistence**: Save partial onboarding progress
3. **Skip Option**: Allow certain steps to be skipped
4. **Company Logo Upload**: Add file upload in onboarding
5. **Invite Team Members**: Add team invitation step
6. **Payment Setup**: Integrate Stripe for subscription setup
7. **Tutorial/Walkthrough**: Add product tour after onboarding

## Troubleshooting

### User stuck in onboarding loop

- Check `hasCompletedOnboarding` field in Firestore
- Ensure Cloud Function `completeOnboarding` is being called successfully
- Verify no errors in Firebase Functions logs

### Social login not working

- Verify Google/Apple providers are enabled in Firebase Console
- Check OAuth credentials are properly configured
- Ensure redirect URIs are whitelisted

### Verification email not sending

- Check email template is configured in Firebase Console
- Verify Firebase project has email provider enabled
- Check spam folder for verification emails

## Dependencies

No new dependencies were added. Uses existing packages:

- `firebase` (already installed)
- `@mui/material` (already installed)
- `react-hook-form` (already installed)
- `next` (already installed)

## Notes

- The original registration page at `/register` remains unchanged
- Both registration flows can coexist
- Firebase social auth requires proper OAuth configuration in Firebase Console
- Apple Sign In requires additional setup with Apple Developer account
