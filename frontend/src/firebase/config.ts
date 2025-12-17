import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Firebase client config for Smart ServiceHub
// Note: These values are client-safe and provided by you.
export const firebaseConfig = {
  apiKey: "AIzaSyCGhixEmoKX9fAz9HONiG14VmHA7Z0dEpM",
  authDomain: "smart-servisehub.firebaseapp.com",
  projectId: "smart-servisehub",
  storageBucket: "smart-servisehub.firebasestorage.app",
  messagingSenderId: "189234830590",
  appId: "1:189234830590:web:354a93a8547f14f100d9af"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Type assertion to resolve type conflicts
const firebaseApp = app as any

export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)
export { app }
