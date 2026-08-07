import { db } from '../config/firebaseAdmin.js'
import admin from '../config/firebaseAdmin.js'

// Public community alerts (missing persons, blood donation). These are
// also written directly from the client (see firestoreService.js) —
// this REST path exists for non-browser clients and for consistent
// server-side validation/moderation hooks later.
export async function listAlerts(req, res, next) {
  try {
    const { category } = req.query
    let ref = db.collection('publicAlerts').where('status', '==', 'active')
    if (category) ref = ref.where('category', '==', category)
    const snap = await ref.orderBy('createdAt', 'desc').limit(50).get()
    res.json({ alerts: snap.docs.map((d) => ({ id: d.id, ...d.data() })) })
  } catch (err) {
    next(err)
  }
}

export async function createAlert(req, res, next) {
  try {
    const { title, description, location, contactPhone, category } = req.body
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'title, description, and category are required.' })
    }
    const doc = await db.collection('publicAlerts').add({
      title, description, location, contactPhone, category,
      status: 'active',
      createdBy: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })
    res.status(201).json({ id: doc.id })
  } catch (err) {
    next(err)
  }
}
