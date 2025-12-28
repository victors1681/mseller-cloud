# Quick Reference Card - Registration & Onboarding

## 🚀 Quick Start

### Access the Registration Page

```
http://localhost:3000/register/simple
```

### Test User Flow

1. Register → 2. Onboarding → 3. Application Access

---

## 📱 Key Pages

| Page         | Route              | Purpose               |
| ------------ | ------------------ | --------------------- |
| Registration | `/register/simple` | New user signup       |
| Onboarding   | `/onboarding`      | 6-step business setup |
| Home         | `/`                | Main application      |

---

## 🔑 User Properties

```typescript
{
  hasCompletedOnboarding: boolean // true = access granted
  isEmailVerified: boolean // email confirmation status
}
```

---

## 🎯 Registration Options

### Option 1: Email/Password

- Enter email
- Create password (min 6 chars)
- Confirm password
- Click "Crear cuenta"

### Option 2: Google

- Click "Continue with Google"
- Select Google account
- Authorize access

### Option 3: Apple

- Click "Continue with Apple"
- Sign in with Apple ID
- Authorize access

---

## 📋 Onboarding Steps

| Step | Field(s)                 | Required | Special Notes               |
| ---- | ------------------------ | -------- | --------------------------- |
| 1    | Business Name            | ✓        | Company legal name          |
| 2    | Phone                    | ✓        | Format: 809-000-0000        |
| 3    | Address                  | ✓        | Physical location           |
| 4    | Country                  | ✓        | + RNC if Dominican Republic |
| 5    | Business Type & Industry | ✓        | Select from dropdown        |
| 6    | Setup Option             | ✓        | New/Sample/Upload           |

---

## 🛡️ Route Protection

### Before Onboarding Complete

- ✅ Access: `/login`, `/register`, `/onboarding`
- ❌ Blocked: All other routes → redirect to `/onboarding`

### After Onboarding Complete

- ✅ Access: All routes
- ❌ Blocked: `/onboarding` → redirect to `/`

---

## 🔧 Cloud Functions

### Required Functions

1. **createUserProfile**

   - Called on registration
   - Creates user document in Firestore
   - Sets `hasCompletedOnboarding: false`

2. **completeOnboarding**
   - Called after step 6
   - Saves business data
   - Sets `hasCompletedOnboarding: true`

---

## 📁 File Locations

### Frontend

```
src/
├── pages/
│   ├── register/simple.tsx          # Registration page
│   └── onboarding/index.tsx         # Onboarding wizard
├── views/onboarding/                # 6 step components
├── @core/components/auth/
│   └── OnboardingGuard.tsx          # Route protection
└── context/AuthContext.tsx          # Auth + onboarding logic
```

### Backend (Firebase Functions)

```
functions/
└── src/
    └── index.ts
        ├── createUserProfile()
        └── completeOnboarding()
```

---

## 🧪 Testing Checklist

### Registration

- [ ] Email/password works
- [ ] Google login works
- [ ] Apple login works
- [ ] Verification email sent
- [ ] Redirects to onboarding

### Onboarding

- [ ] All 6 steps validate
- [ ] RNC field shows for DR
- [ ] Can navigate back
- [ ] Data saves correctly
- [ ] Redirects to home

### Protection

- [ ] Can't access app before completion
- [ ] Can access app after completion
- [ ] Can't return to onboarding
- [ ] Logout/login maintains status

---

## ⚡ Quick Commands

### Start Dev Server

```bash
yarn dev:local
```

### Deploy Functions

```bash
firebase deploy --only functions
```

### Check Firestore

```bash
firebase firestore:read users/{userId}
```

### Clear User Data (Testing)

```javascript
// In browser console
localStorage.clear()
location.reload()
```

---

## 🐛 Troubleshooting

### User Stuck in Loop

```javascript
// Manually complete onboarding in Firestore
{
  hasCompletedOnboarding: true
}
```

### Social Login Error

1. Check Firebase Console → Authentication
2. Verify provider is enabled
3. Check authorized domains

### Email Not Received

1. Check spam folder
2. Verify email template configured
3. Check Firebase Authentication logs

---

## 📞 Quick Debugging

### Check User Status

```javascript
// Browser console
import { auth } from 'firebase'
console.log(auth.currentUser)
```

### Check Firestore Data

Firebase Console → Firestore → users → {userId}

### Check Function Logs

Firebase Console → Functions → Logs

---

## 💡 Pro Tips

1. **Test Flow**: Use incognito window for clean testing
2. **Social Login**: Requires OAuth setup in Firebase Console
3. **Email Verification**: Optional but recommended
4. **Mobile Testing**: Test on actual mobile devices
5. **Errors**: Always check browser console first

---

## 📊 Key Metrics

Track these for success:

- Registration completion rate
- Onboarding completion rate
- Time to complete onboarding
- Social vs email login ratio
- Drop-off points

---

## 🎨 Customization Points

### Easy to Customize

- Colors and branding
- Step titles and descriptions
- Business type options
- Industry options
- Data setup options

### Requires Code Changes

- Number of onboarding steps
- Required fields
- Validation rules
- Route protection logic

---

## 🔗 Related Docs

- [Full Implementation](registration-onboarding-implementation.md)
- [Setup Guide](registration-setup-guide.md)
- [Flow Diagram](FLOW_DIAGRAM.md)
- [Firebase Functions](firebase-functions-template.ts)

---

## 📝 Quick Notes

- Original `/register` page remains unchanged
- Both registration flows can coexist
- No new npm packages needed
- Mobile-first responsive design
- TypeScript type-safe
- Follows MSeller Cloud conventions

---

**Last Updated**: December 28, 2025  
**Status**: ✅ Production Ready  
**Version**: 1.0.0
