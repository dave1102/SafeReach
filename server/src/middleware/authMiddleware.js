import { auth, db } from '../config/firebaseAdmin.js'

// Verifies the Firebase ID token sent as "Authorization: Bearer <token>"
// and attaches the decoded user (plus Firestore profile) to req.user.
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Missing authorization token.' })
  }

  try {
    const decoded = await auth.verifyIdToken(token)
    req.user = { uid: decoded.uid, email: decoded.email }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

// Additionally checks the caller's Firestore /users/{uid}.role === 'admin'.
// Chain after requireAuth: [requireAuth, requireAdmin].
export async function requireAdmin(req, res, next) {
  try {
    const snap = await db.collection('users').doc(req.user.uid).get()
    if (!snap.exists || snap.data().role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required.' })
    }
    next()
  } catch (err) {
    next(err)
  }
}
