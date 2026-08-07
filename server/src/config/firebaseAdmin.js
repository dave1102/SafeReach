// Firebase Admin SDK init, used to verify ID tokens sent from the
// client and to read/write Firestore for admin-only operations.
import admin from 'firebase-admin'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

if (!admin.apps.length) {
  let credential
  try {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
      ? process.env.FIREBASE_SERVICE_ACCOUNT_JSON
      : fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json', 'utf8')
    credential = admin.credential.cert(JSON.parse(raw))
  } catch (err) {
    console.warn(
      '[firebaseAdmin] No valid service account found — auth-protected and Firestore-backed ' +
      'routes will fail until FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON is set.'
    )
  }
  admin.initializeApp(credential ? { credential } : {})
}

export const auth = admin.auth()
export const db = admin.firestore()
export default admin
