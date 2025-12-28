# Quick Setup Guide - Registration & Onboarding

## Step 1: Firebase Console Setup

### Enable Authentication Providers

1. Go to Firebase Console → Authentication → Sign-in method
2. Enable **Email/Password**
3. Enable **Google** (follow setup wizard)
4. Enable **Apple** (requires Apple Developer account)
   - Add your Apple Developer Team ID
   - Add your Service ID
   - Upload your private key

### Configure Authorized Domains

Add your domains to Firebase:

- `localhost` (for development)
- Your production domain
- Your staging domain (if applicable)

## Step 2: Deploy Cloud Functions

1. Copy the functions from `docs/firebase-functions-template.ts`
2. Add them to your Firebase Functions project
3. Deploy:
   ```bash
   firebase deploy --only functions
   ```

## Step 3: Update Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow users to read/write their business data
    match /businesses/{businessId} {
      allow read, write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.business.businessId == businessId;
    }
  }
}
```

Deploy rules:

```bash
firebase deploy --only firestore:rules
```

## Step 4: Configure Email Templates

1. Go to Firebase Console → Authentication → Templates
2. Customize the "Email address verification" template
3. Update sender name and email

## Step 5: Test the Flow

### Test Registration

1. Start your dev server:

   ```bash
   yarn dev:local
   ```

2. Navigate to: `http://localhost:3000/register/simple`

3. Test each registration method:
   - Email/Password
   - Google Sign In
   - Apple Sign In

### Test Onboarding

1. After registration, you should be redirected to `/onboarding`
2. Complete all 6 steps
3. Verify redirection to home page
4. Try accessing `/onboarding` again (should redirect to home)

### Test Route Protection

1. Clear your browser cookies
2. Register a new user
3. Close browser before completing onboarding
4. Reopen browser and login
5. Verify you're redirected back to `/onboarding`

## Step 6: Verify Database Structure

After completing onboarding, check Firestore:

```javascript
users/{userId}
  ├── userId: string
  ├── email: string
  ├── hasCompletedOnboarding: true  ✓
  ├── isEmailVerified: true/false
  └── business
      ├── businessId: string
      ├── name: string
      ├── phone: string
      ├── address
      │   ├── street: string
      │   └── country: string
      ├── rnc: string (if Dominican Republic)
      ├── businessType: string
      ├── industry: string
      └── setupOption: string
```

## Common Issues & Solutions

### Issue: Social login returns error

**Solution**:

- Verify OAuth credentials in Firebase Console
- Check authorized domains include your current domain
- Clear browser cache and try again

### Issue: User stuck in onboarding loop

**Solution**:

- Check Cloud Function logs in Firebase Console
- Verify `completeOnboarding` function is being called
- Manually update `hasCompletedOnboarding: true` in Firestore for testing

### Issue: Verification email not received

**Solution**:

- Check spam folder
- Verify email template is configured
- Test with different email provider
- Check Firebase Authentication logs

### Issue: TypeScript errors

**Solution**:

- Run `yarn install` to ensure all dependencies are up to date
- Check that `firebase` package is at least version 9.0.0
- Clear `.next` cache: `rm -rf .next`

## Environment Variables

No new environment variables needed. Existing Firebase config should work:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

## Development Checklist

- [ ] Firebase Authentication providers enabled
- [ ] Cloud Functions deployed
- [ ] Firestore security rules updated
- [ ] Email templates configured
- [ ] Test email/password registration
- [ ] Test Google sign-in
- [ ] Test Apple sign-in (if enabled)
- [ ] Test onboarding flow
- [ ] Test route protection
- [ ] Test with different countries (especially Dominican Republic for RNC field)
- [ ] Test "start from scratch" option
- [ ] Verify database structure
- [ ] Test logout and re-login flow

## Next Steps

After successful setup:

1. **Customize Styling**: Update colors, logos, and branding in registration pages
2. **Add Analytics**: Track registration funnel with Firebase Analytics
3. **Email Templates**: Customize verification email template
4. **Sample Data**: Implement sample data creation in Cloud Functions
5. **Data Import**: Implement data import functionality
6. **Team Invites**: Add ability to invite team members during onboarding
7. **Tour Guide**: Add product tour after onboarding completion

## Support

If you encounter issues:

1. Check Firebase Console logs
2. Check browser console for errors
3. Verify Cloud Functions are deployed correctly
4. Check Firestore security rules allow the operations
5. Ensure user has proper permissions

## Testing Accounts

For development/testing, you can create test accounts:

```
Email: test@example.com
Password: Test123!

Email: test2@example.com
Password: Test123!
```

Remember to delete test accounts after testing!
