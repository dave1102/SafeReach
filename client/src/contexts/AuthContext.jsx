import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null) // Firestore /users/{uid} doc, includes role
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const ref = doc(db, 'users', firebaseUser.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setProfile(snap.data())
        } else {
          // First sign-in: create the user profile doc used for roles,
          // accessibility prefs, and admin approval status.
          const newProfile = {
            name: firebaseUser.displayName || 'Overflow AI User',
            email: firebaseUser.email,
            role: 'user',
            createdAt: serverTimestamp(),
            preferences: { darkMode: false, largeText: false, voiceEnabled: false }
          }
          await setDoc(ref, newProfile)
          setProfile(newProfile)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const signup = async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    await setDoc(doc(db, 'users', cred.user.uid), {
      name, email, role: 'user', createdAt: serverTimestamp(),
      preferences: { darkMode: false, largeText: false, voiceEnabled: false }
    })
    return cred.user
  }

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password)
  const loginWithGoogle = () => signInWithPopup(auth, googleProvider)
  const logout = () => signOut(auth)

  const value = {
    user, profile, loading,
    isAdmin: profile?.role === 'admin',
    signup, login, loginWithGoogle, logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
