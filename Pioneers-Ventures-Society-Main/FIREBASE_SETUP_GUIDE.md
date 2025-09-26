# 🔥 Firebase Configuration Setup Guide

You're getting Firebase connection errors because your `.env` file still has placeholder values. Here's how to get your actual Firebase configuration:

## 🚀 **Step 1: Get Your Firebase Configuration**

### **Option A: From Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **"pioneer-ventures-society"**
3. Click the **gear icon** (Settings) → **Project settings**
4. Scroll down to **"Your apps"** section
5. Click on your web app (or create one if none exists)
6. Copy the configuration object

### **Option B: From Firebase CLI**
```bash
firebase projects:list
firebase use pioneer-ventures-society
firebase apps:list
firebase apps:sdkconfig web
```

## 📝 **Step 2: Update Your .env File**

Your configuration should look something like this:

```env
# Firebase Configuration - REPLACE WITH YOUR ACTUAL VALUES
VITE_FIREBASE_API_KEY="AIzaSyC..."
VITE_FIREBASE_AUTH_DOMAIN="pioneer-ventures-society.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="pioneer-ventures-society"
VITE_FIREBASE_STORAGE_BUCKET="pioneer-ventures-society.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef123456"
VITE_FIREBASE_MEASUREMENT_ID="G-ABCDEF1234"

# EmailJS Configuration (leave empty for now)
VITE_EMAILJS_SERVICE_ID=""
VITE_EMAILJS_TEMPLATE_ID=""
VITE_EMAILJS_PUBLIC_KEY=""

# Admin Email Configuration
VITE_ADMIN_NOTIFICATION_EMAILS="admin@pioneer-ventures-society.org,finance@pioneer-ventures-society.org"
VITE_PRIMARY_ADMIN_EMAIL="admin@pioneer-ventures-society.org"
VITE_FINANCE_EMAIL="finance@pioneer-ventures-society.org"

# Optional: Admin WhatsApp number
VITE_ADMIN_WHATSAPP="26774421107"
```

## 🔍 **Step 3: Verify Your Configuration**

After updating your `.env` file:

1. **Restart your development server:**
   ```bash
   npm run dev:main
   ```

2. **Check browser console** - you should see Firebase connecting properly

3. **Test donation submission** - it should work without the connection errors

## 🚨 **Common Issues & Solutions**

### **Issue: "your-project-id" in URLs**
- **Problem:** Environment variables not loaded
- **Solution:** Make sure `.env` file is in the root directory and restart dev server

### **Issue: 400 Bad Request errors**
- **Problem:** Invalid Firebase configuration
- **Solution:** Double-check all configuration values are correct

### **Issue: Permission denied**
- **Problem:** Firestore security rules
- **Solution:** Update Firestore rules to allow donations collection

## 🔒 **Step 4: Update Firestore Security Rules**

In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow donations to be created by anyone
    match /donations/{document} {
      allow create: if true;
      allow read, update: if request.auth != null;
    }
    
    // Allow payment methods to be read by anyone
    match /paymentMethods/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Other collections require authentication
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🧪 **Step 5: Test the Fix**

1. **Update `.env` with real Firebase config**
2. **Restart development server**
3. **Try submitting a donation**
4. **Check browser console** - should see successful Firebase connection
5. **Check Firebase Console** - should see new donation in Firestore

## 📋 **Quick Checklist**

- [ ] Got Firebase configuration from console
- [ ] Updated `.env` file with real values
- [ ] Restarted development server
- [ ] Updated Firestore security rules
- [ ] Tested donation submission
- [ ] Verified data appears in Firebase Console

## 🆘 **Still Having Issues?**

If you're still getting errors:

1. **Check Firebase Console** for any project issues
2. **Verify billing** is enabled (required for some features)
3. **Check browser network tab** for specific error details
4. **Try creating a test document** directly in Firestore Console

Once you update your `.env` file with the correct Firebase configuration, the donation system should work perfectly! 🎉