import { useEffect, useRef } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'

const DEBOUNCE_MS = 1500

export function useProgressSync(courseId) {
  const pendingRef = useRef({})
  const timerRef = useRef(null)
  const loadedRef = useRef(false)

  // Load from Firestore on mount, restore to localStorage
  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true

    const uid = auth.currentUser?.uid
    if (!uid) return

    const ref = doc(db, 'users', uid, 'progress', courseId)
    getDoc(ref).then(snap => {
      if (!snap.exists()) return
      const data = snap.data()
      try {
        Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v))
      } catch {}
      // Trigger re-render in consuming components by dispatching a storage event
      window.dispatchEvent(new Event('progress-loaded'))
    }).catch(() => {})
  }, [courseId])

  // Debounced Firestore write
  const syncKey = (key, value) => {
    try { localStorage.setItem(key, value) } catch {}

    const uid = auth.currentUser?.uid
    if (!uid) return

    pendingRef.current[key] = value

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const batch = { ...pendingRef.current }
      pendingRef.current = {}
      const ref = doc(db, 'users', uid, 'progress', courseId)
      setDoc(ref, batch, { merge: true }).catch(() => {})
    }, DEBOUNCE_MS)
  }

  return { syncKey }
}
