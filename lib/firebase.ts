import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCgqn-CvykkqTk51zvKYxaZRUWoDwOL110",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "e-generation-87f93.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "e-generation-87f93",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "e-generation-87f93.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "784504103488",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:784504103488:web:d7c168e8a932d6dcde35a5",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-C9DHV4ST72"
}

// デバッグ用ログ（本番環境でも確認するため）
console.log('Firebase Config Check:', {
  apiKey: firebaseConfig.apiKey ? 'SET' : 'MISSING',
  authDomain: firebaseConfig.authDomain ? 'SET' : 'MISSING',
  projectId: firebaseConfig.projectId ? 'SET' : 'MISSING',
  storageBucket: firebaseConfig.storageBucket ? 'SET' : 'MISSING',
  messagingSenderId: firebaseConfig.messagingSenderId ? 'SET' : 'MISSING',
  appId: firebaseConfig.appId ? 'SET' : 'MISSING'
})

let app: any
let db: any

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig)
  console.log('✅ Firebase app initialized successfully')
  
  // Initialize Firestore
  db = getFirestore(app)
  console.log('✅ Firestore initialized successfully')
  
  // Connect to emulator if in development mode
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080)
      console.log('🧪 Connected to Firestore emulator')
    } catch (error) {
      console.warn('⚠️ Firestore emulator connection failed:', error)
    }
  }
  
} catch (error) {
  console.error('❌ Firebase initialization failed:', error)
  throw error
}

export { db }

// Initialize Analytics (only in browser)
export const getAnalyticsInstance = () => {
  if (typeof window !== 'undefined') {
    return getAnalytics(app)
  }
  return null
}

export default app