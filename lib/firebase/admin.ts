import 'server-only'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Only initialize if not already initialized
if (!getApps().length) {
  try {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
    )
    
    initializeApp({
      credential: cert(serviceAccount)
    })
  } catch (error) {
    console.error('Firebase Admin initialization error:', error)
  }
}

export const adminDb = getFirestore()