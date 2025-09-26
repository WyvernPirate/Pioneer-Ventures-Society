// Firebase connection testing utility
import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Test Firebase connection
export const testFirebaseConnection = async (): Promise<void> => {
  console.log('🔥 Testing Firebase connection...');
  
  try {
    // Test 1: Check if we can read from a collection
    console.log('📖 Testing Firestore read access...');
    const testQuery = await getDocs(collection(db, 'donations'));
    console.log(`✅ Successfully connected to Firestore. Found ${testQuery.size} donations.`);
    
    // Test 2: Check if we can write to Firestore (test document)
    console.log('✍️ Testing Firestore write access...');
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Firebase connection test',
      timestamp: new Date().toISOString(),
      type: 'connection_test'
    });
    console.log(`✅ Successfully wrote test document: ${testDoc.id}`);
    
    console.log('🎉 Firebase connection test completed successfully!');
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    
    // Provide specific error guidance
    if (error instanceof Error) {
      if (error.message.includes('your-project-id')) {
        console.error('🚨 ISSUE: Firebase configuration still has placeholder values');
        console.error('💡 SOLUTION: Update your .env file with actual Firebase config');
      } else if (error.message.includes('permission-denied')) {
        console.error('🚨 ISSUE: Firestore security rules are blocking access');
        console.error('💡 SOLUTION: Update Firestore rules to allow donations collection');
      } else if (error.message.includes('not-found')) {
        console.error('🚨 ISSUE: Firebase project not found');
        console.error('💡 SOLUTION: Check your project ID in .env file');
      }
    }
  }
};

// Check Firebase configuration
export const checkFirebaseConfig = (): void => {
  console.log('🔍 Checking Firebase configuration...');
  
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  console.log('Firebase Configuration:');
  Object.entries(config).forEach(([key, value]) => {
    if (!value) {
      console.error(`❌ ${key}: Missing`);
    } else if (value.includes('your-') || value.includes('example')) {
      console.error(`❌ ${key}: Still has placeholder value`);
    } else {
      console.log(`✅ ${key}: Configured`);
    }
  });

  // Check for common issues
  const issues = [];
  if (!config.projectId) issues.push('Missing project ID');
  if (config.projectId?.includes('your-project-id')) issues.push('Project ID is placeholder');
  if (!config.apiKey) issues.push('Missing API key');
  if (!config.authDomain) issues.push('Missing auth domain');

  if (issues.length > 0) {
    console.error('🚨 Configuration Issues Found:');
    issues.forEach(issue => console.error(`   - ${issue}`));
    console.error('💡 Please update your .env file with correct Firebase configuration');
  } else {
    console.log('✅ Firebase configuration looks good!');
  }
};

// Development helper - call this in browser console
if (typeof window !== 'undefined') {
  (window as any).testFirebase = {
    checkConfig: checkFirebaseConfig,
    testConnection: testFirebaseConnection
  };
  
  console.log('🔥 Firebase testing utilities loaded. Use in console:');
  console.log('- testFirebase.checkConfig() - Check configuration');
  console.log('- testFirebase.testConnection() - Test connection');
}