// Direct Firestore reads/writes for data that doesn't need server-side
// logic (contacts, recent alerts log). Keeping these client-side keeps
// the SOS flow fast and working even if the Express API is briefly down,
// as long as Firestore's own offline cache has the data.
import {
  addDoc, collection, deleteDoc, doc, onSnapshot, orderBy,
  query, serverTimestamp, updateDoc, where, limit
} from 'firebase/firestore'
import { db } from '../firebase.js'

// --- Emergency Contacts -----------------------------------------------

export function subscribeToContacts(uid, callback) {
  const q = query(collection(db, 'users', uid, 'contacts'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

export function addContact(uid, contact) {
  return addDoc(collection(db, 'users', uid, 'contacts'), {
    ...contact,
    createdAt: serverTimestamp()
  })
}

export function updateContact(uid, contactId, updates) {
  return updateDoc(doc(db, 'users', uid, 'contacts', contactId), updates)
}

export function deleteContact(uid, contactId) {
  return deleteDoc(doc(db, 'users', uid, 'contacts', contactId))
}

// --- Recent Alerts (SOS presses, shares) -------------------------------

export function subscribeToRecentAlerts(uid, callback, count = 10) {
  const q = query(
    collection(db, 'users', uid, 'recentAlerts'),
    orderBy('createdAt', 'desc'),
    limit(count)
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

export function logAlert(uid, alert) {
  return addDoc(collection(db, 'users', uid, 'recentAlerts'), {
    ...alert,
    createdAt: serverTimestamp()
  })
}

// --- Public community alerts (missing persons / blood donation) --------

export function subscribeToPublicAlerts(category, callback) {
  const q = query(
    collection(db, 'publicAlerts'),
    where('category', '==', category),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

export function createPublicAlert(uid, alert) {
  return addDoc(collection(db, 'publicAlerts'), {
    ...alert,
    createdBy: uid,
    status: 'active',
    createdAt: serverTimestamp()
  })
}
