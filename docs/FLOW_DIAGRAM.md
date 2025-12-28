# Registration & Onboarding Flow Diagram

## User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Visits Application                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  Authenticated? │
                    └────────┬───────┘
                             │
                ┌────────────┴────────────┐
                │                         │
               No                        Yes
                │                         │
                ▼                         ▼
    ┌──────────────────────┐    ┌─────────────────────┐
    │  Guest Pages Only    │    │ Check Onboarding    │
    │  - /login            │    │      Status         │
    │  - /register/simple  │    └─────────┬───────────┘
    │  - /forgot-password  │              │
    └──────────┬───────────┘              │
               │                ┌─────────┴──────────┐
               │                │                    │
               │           Completed          Not Completed
               │                │                    │
               │                ▼                    ▼
               │    ┌─────────────────────┐  ┌──────────────┐
               │    │   Access Granted    │  │  Redirect to │
               │    │   to Application    │  │  Onboarding  │
               │    └─────────────────────┘  └──────┬───────┘
               │                                     │
               │                                     │
               └────────────────────────────────────►│
                                                     │
                                                     ▼
                                         ┌───────────────────┐
                                         │ /register/simple  │
                                         └────────┬──────────┘
                                                  │
                                    ┌─────────────┴─────────────┐
                                    │                           │
                                    ▼                           ▼
                        ┌────────────────────┐    ┌────────────────────┐
                        │  Email/Password    │    │   Social Login     │
                        │   Registration     │    │  (Google/Apple)    │
                        └────────┬───────────┘    └─────────┬──────────┘
                                 │                           │
                                 │  ┌────────────────────────┘
                                 │  │
                                 ▼  ▼
                        ┌─────────────────────┐
                        │  Create User Profile│
                        │   in Firebase       │
                        │ hasCompletedOnboard │
                        │   ing: false        │
                        └──────────┬──────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │   Send Verification │
                        │      Email          │
                        └──────────┬──────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │   Redirect to       │
                        │   /onboarding       │
                        └──────────┬──────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │    Onboarding Flow (6 Steps) │
                    └───────────┬──────────────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
                    ▼           ▼           ▼
            ┌──────────┐  ┌─────────┐  ┌──────────┐
            │  Step 1  │  │ Step 2  │  │  Step 3  │
            │ Business │  │  Phone  │  │ Address  │
            │   Name   │  │ Number  │  │          │
            └──────────┘  └─────────┘  └──────────┘
                    │           │           │
                    └───────────┼───────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
                    ▼           ▼           ▼
            ┌──────────┐  ┌─────────┐  ┌──────────┐
            │  Step 4  │  │ Step 5  │  │  Step 6  │
            │ Country  │  │Business │  │   Data   │
            │  & RNC   │  │  Type   │  │  Setup   │
            └──────────┘  └─────────┘  └──────────┘
                                             │
                                             ▼
                                  ┌──────────────────┐
                                  │ Save to Firebase │
                                  │ hasCompletedOnb  │
                                  │ oarding: true    │
                                  └────────┬─────────┘
                                           │
                                           ▼
                                  ┌──────────────────┐
                                  │  Redirect to /   │
                                  │   (Home Page)    │
                                  └────────┬─────────┘
                                           │
                                           ▼
                                  ┌──────────────────┐
                                  │ Access Granted   │
                                  │  to Application  │
                                  └──────────────────┘
```

## Component Architecture

```
_app.tsx (Application Root)
    │
    ├─ AuthProvider (Context)
    │   └─ Manages user authentication state
    │
    ├─ OnboardingGuard (Route Protection)
    │   ├─ Checks hasCompletedOnboarding status
    │   ├─ Redirects to /onboarding if false
    │   └─ Allows access if true
    │
    └─ Pages
        │
        ├─ /register/simple (Guest Page)
        │   ├─ Email/Password Form
        │   ├─ Google Sign In Button
        │   └─ Apple Sign In Button
        │
        ├─ /onboarding (Protected Page)
        │   ├─ Stepper Component
        │   ├─ BusinessNameStep
        │   ├─ PhoneStep
        │   ├─ AddressStep
        │   ├─ CountryStep
        │   ├─ BusinessTypeStep
        │   └─ DataSetupStep
        │
        └─ /* (All Other Pages)
            └─ Protected by OnboardingGuard
```

## Data Flow

```
┌──────────────────────────────────────────────────────────┐
│                    Registration Event                     │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              Firebase Authentication                      │
│  - createUserWithEmailAndPassword()                       │
│  - signInWithPopup(GoogleAuthProvider)                    │
│  - signInWithPopup(OAuthProvider('apple.com'))           │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│           Cloud Function: createUserProfile               │
│                                                           │
│  Input:                                                   │
│    - userId                                               │
│    - email                                                │
│    - photoURL (optional)                                  │
│    - hasCompletedOnboarding: false                        │
│    - isEmailVerified: false/true                          │
│                                                           │
│  Creates Firestore Document:                              │
│    users/{userId}                                         │
│      └─ ... user profile data                            │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              Send Verification Email                      │
│  - sendEmailVerification(user)                            │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│            Redirect to /onboarding                        │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              User Completes Onboarding                    │
│  - Fills 6 steps of information                           │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│        Cloud Function: completeOnboarding                 │
│                                                           │
│  Input:                                                   │
│    - userId                                               │
│    - onboardingData                                       │
│        - businessName                                     │
│        - phone                                            │
│        - address                                          │
│        - country                                          │
│        - rnc (if DR)                                      │
│        - businessType                                     │
│        - industry                                         │
│        - setupOption                                      │
│                                                           │
│  Updates Firestore:                                       │
│    users/{userId}                                         │
│      ├─ hasCompletedOnboarding: true                      │
│      └─ business: { ...onboardingData }                  │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│           Redirect to / (Home Page)                       │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              Application Access Granted                   │
│  - OnboardingGuard allows access                          │
│  - User can use full application                          │
└──────────────────────────────────────────────────────────┘
```

## State Management

```
AuthContext State:
├─ user: UserTypes | null
│   ├─ userId: string
│   ├─ email: string
│   ├─ hasCompletedOnboarding: boolean  ← NEW
│   ├─ isEmailVerified: boolean         ← NEW
│   └─ ... other user properties
│
├─ loading: boolean
│
└─ methods:
    ├─ login()
    ├─ logout()
    └─ signUp()

OnboardingGuard Logic:
├─ If !user → Show loading
├─ If user && !hasCompletedOnboarding && pathname !== '/onboarding'
│   └─ Redirect to /onboarding
├─ If user && hasCompletedOnboarding && pathname === '/onboarding'
│   └─ Redirect to /
└─ Else → Render children
```

## Route Protection Matrix

| Route              | Auth Required | Onboarding Required | Redirect To          |
| ------------------ | ------------- | ------------------- | -------------------- |
| `/login`           | No            | N/A                 | `/` if logged in     |
| `/register/simple` | No            | N/A                 | `/onboarding` after  |
| `/onboarding`      | Yes           | No (in progress)    | `/` if completed     |
| `/` (home)         | Yes           | Yes                 | `/onboarding` if not |
| `/apps/*`          | Yes           | Yes                 | `/onboarding` if not |
| All other pages    | Yes           | Yes                 | `/onboarding` if not |

## Security Flow

```
┌─────────────────────────────────────────┐
│         Firebase Authentication          │
│  - Handles user identity                 │
│  - Manages access tokens                 │
│  - Email verification                    │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│         Firestore Security Rules         │
│  - User can only read/write own profile  │
│  - Enforced server-side                  │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│          Cloud Functions (HTTPS)         │
│  - Validates auth context                │
│  - Verifies userId matches auth.uid      │
│  - Server-side data validation           │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│         Client-Side Guards               │
│  - OnboardingGuard                       │
│  - AuthGuard                             │
│  - GuestGuard                            │
└─────────────────────────────────────────┘
```

---

**Legend:**

- `▼` Flow direction
- `├─` Branch/Child
- `└─` Last branch/child
- `│` Continuation
