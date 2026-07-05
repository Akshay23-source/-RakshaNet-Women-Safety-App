import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyFakeKeyPlaceholder12345",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "women-safety-application-96a91.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "women-safety-application-96a91",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "women-safety-application-96a91.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
