import { db } from '../config/firebaseAdmin.js'

export async function getAnalytics(req, res, next) {
  try {
    const usersSnap = await db.collection('users').count().get()
    const activeAlertsSnap = await db.collection('publicAlerts').where('status', '==', 'active').count().get()

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const sosSnap = await db
      .collectionGroup('recentAlerts')
      .where('type', '==', 'sos')
      .where('createdAt', '>=', thirtyDaysAgo)
      .count()
      .get()

    res.json({
      totalUsers: usersSnap.data().count,
      activeAlerts: activeAlertsSnap.data().count,
      sosLast30Days: sosSnap.data().count
    })
  } catch (err) {
    next(err)
  }
}

export async function listPendingHospitals(req, res, next) {
  try {
    const snap = await db.collection('hospitals').where('verificationStatus', '==', 'pending').get()
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  } catch (err) {
    next(err)
  }
}

export async function approveHospital(req, res, next) {
  try {
    await db.collection('hospitals').doc(req.params.id).update({ verificationStatus: 'approved' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

export async function rejectHospital(req, res, next) {
  try {
    await db.collection('hospitals').doc(req.params.id).update({ verificationStatus: 'rejected' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}
