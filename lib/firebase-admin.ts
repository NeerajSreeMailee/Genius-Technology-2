import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"

// Initialize Firebase Admin if not already initialized
export const initFirebaseAdmin = () => {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    })
  }
}

// Initialize Firebase Admin
initFirebaseAdmin()

// Export both the original names and aliases for backward compatibility
export const adminDb = getFirestore()
export const adminAuth = getAuth()

// Export with commonly expected names
export const db = adminDb
export const auth = adminAuth

export default { db, adminDb, auth, adminAuth, initFirebaseAdmin }
