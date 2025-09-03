# Deploy Firestore Security Rules

## Problem
Your Firebase application is showing "Missing or insufficient permissions" errors because the default Firestore security rules deny all access.

## Solution
You need to deploy the firestore.rules file to your Firebase project. Follow these steps:

### Option 1: Using Firebase CLI (Recommended)

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase project** (if not already done):
   ```bash
   firebase init firestore
   ```
   - Select your existing project: `e-generation-87f93`
   - Use existing `firestore.rules` file
   - Use existing `firestore.indexes.json` or create a new one

4. **Deploy the rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option 2: Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project `e-generation-87f93`
3. Navigate to **Firestore Database**
4. Click on **Rules** tab
5. Replace the existing rules with the content from `firestore.rules`
6. Click **Publish**

## Current Rules Explanation

The firestore.rules file allows:
- **Public read/write access** to `user_accounts` and `user_progress` collections
- **No access** to other collections (security by default)

This is necessary because your app doesn't use Firebase Authentication - it uses a simple username-based system.

## Security Note

⚠️ **Important**: These rules allow public access to user data. For production use, consider:
1. Implementing proper Firebase Authentication
2. Adding server-side validation
3. Using more restrictive rules based on authenticated users

## After Deployment

Once the rules are deployed:
1. Refresh your application
2. Try logging in with username "admin" 
3. Check the browser console for success messages
4. The "Missing or insufficient permissions" errors should be resolved