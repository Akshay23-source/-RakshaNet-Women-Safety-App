import { projectId, publicAnonKey } from './supabase/info'
import type { EmergencyContact, SOS, Helper, AdminStats, Location, CommunityMember, UserActivity, RegisteredUser, SOSHop } from './types'
import { db, storage } from './firebase'
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, addDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server`

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`
}

// Demo mode flag (set to true when backend is unavailable)
let isDemoMode = false

// Connection check to verify API availability
export const checkAPIConnection = async (): Promise<boolean> => {
  const isFirebaseEnabled = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== "AIzaSyFakeKeyPlaceholder12345";
  if (isFirebaseEnabled) {
    console.log('🔥 Firebase is configured and enabled for database and storage.');
    isDemoMode = false
    return true
  }
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, { 
      headers,
      signal: AbortSignal.timeout(8000) // 8 second timeout for initial check
    })
    if (res.ok) {
      isDemoMode = false
      return true
    }
    isDemoMode = true
    return false
  } catch (error) {
    isDemoMode = true
    return false
  }
}

// Helper function to safely parse JSON responses
async function safeParse(res: Response) {
  const text = await res.text()
  
  // Check if response is JSON
  if (!text || text.trim().length === 0) {
    throw new Error('Empty response from server')
  }
  
  // Check if it looks like HTML (common error response)
  if (text.trim().startsWith('<')) {
    throw new Error('Server returned HTML instead of JSON - API may not be deployed')
  }
  
  try {
    return JSON.parse(text)
  } catch (e) {
    console.error('Failed to parse response:', text.substring(0, 200))
    throw new Error('Invalid JSON response from server')
  }
}

// Auth API
export const authAPI = {
  signup: async (email: string, password: string, name: string, phone: string) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password, name, phone })
    })
    return res.json()
  }
}

const isFirebaseActive = () => {
  return import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== "AIzaSyFakeKeyPlaceholder12345";
}

// Demo contacts storage (in-memory for demo mode)
let demoContacts: EmergencyContact[] = []

// Emergency Contacts API
export const contactsAPI = {
  getAll: async (userId: string): Promise<EmergencyContact[]> => {
    if (isFirebaseActive()) {
      try {
        const q = query(collection(db, `users/${userId}/contacts`))
        const snapshot = await getDocs(q)
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as EmergencyContact))
      } catch (error) {
        console.error('Firebase Error in contacts.getAll:', error)
      }
    }
    try {
      const res = await fetch(`${API_BASE}/contacts/${userId}`, { 
        headers,
        signal: AbortSignal.timeout(10000)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      return data.contacts || []
    } catch (error) {
      // Silently use demo mode
      isDemoMode = true
      return demoContacts
    }
  },
  
  add: async (userId: string, contact: Omit<EmergencyContact, 'id'>) => {
    if (isFirebaseActive()) {
      try {
        const docRef = await addDoc(collection(db, `users/${userId}/contacts`), contact)
        const newContact: EmergencyContact = { id: docRef.id, userId, ...contact }
        return { contact: newContact, message: 'Contact added successfully (Firebase)' }
      } catch (error) {
        console.error('Firebase Error in contacts.add:', error)
      }
    }
    try {
      const res = await fetch(`${API_BASE}/contacts/${userId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(contact),
        signal: AbortSignal.timeout(10000)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    } catch (error) {
      // Silently use demo mode
      const newContact: EmergencyContact = {
        id: `demo_contact_${Date.now()}`,
        userId,
        ...contact
      }
      demoContacts.push(newContact)
      return { contact: newContact, message: 'Contact added successfully (DEMO MODE)' }
    }
  },
  
  delete: async (userId: string, contactId: string) => {
    if (isFirebaseActive()) {
      try {
        await deleteDoc(doc(db, `users/${userId}/contacts`, contactId))
        return { message: 'Contact deleted successfully (Firebase)' }
      } catch (error) {
        console.error('Firebase Error in contacts.delete:', error)
      }
    }
    try {
      const res = await fetch(`${API_BASE}/contacts/${userId}/${contactId}`, {
        method: 'DELETE',
        headers,
        signal: AbortSignal.timeout(10000)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    } catch (error) {
      // Silently use demo mode
      demoContacts = demoContacts.filter(c => c.id !== contactId)
      return { message: 'Contact deleted successfully (DEMO MODE)' }
    }
  }
}

// SOS API
export const sosAPI = {
  trigger: async (userId: string, location: Location, type: string = 'EMERGENCY') => {
    if (isFirebaseActive()) {
      try {
        const sosId = `SOS_FB_${Date.now()}`
        const sosData: SOS = {
          id: sosId,
          userId,
          type,
          timestamp: new Date().toISOString(),
          location,
          confidence: 95,
          status: 'ACTIVE',
          networkStage: 'CONTACT',
          networkUsed: 'PRIMARY',
          helpersAlerted: 5,
          respondedBy: null,
          evidence: [],
          escalationLog: []
        }
        await setDoc(doc(db, 'sos', sosId), sosData)
        return { sosId, message: 'SOS triggered successfully (Firebase)', sos: sosData }
      } catch (error) {
        console.error('Firebase error in sos.trigger:', error)
      }
    }
    try {
      const res = await fetch(`${API_BASE}/sos/trigger`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ userId, location, type }),
        signal: AbortSignal.timeout(10000)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    } catch (error) {
      // Silently use demo mode
      isDemoMode = true
      const sosId = `SOS_DEMO_${Date.now()}`
      return {
        sosId,
        message: 'SOS triggered successfully (DEMO MODE)',
        sos: {
          id: sosId,
          userId,
          type,
          timestamp: new Date().toISOString(),
          location,
          confidence: 95,
          status: 'ACTIVE',
          networkStage: 'CONTACT',
          networkUsed: 'PRIMARY',
          helpersAlerted: 5,
          respondedBy: null,
          evidence: [],
          escalationLog: []
        }
      }
    }
  },
  
  get: async (sosId: string): Promise<SOS> => {
    if (isFirebaseActive()) {
      try {
        const docRef = doc(db, 'sos', sosId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          return docSnap.data() as SOS
        }
      } catch (error) {
        console.error('Firebase error in sos.get:', error)
      }
    }
    try {
      const res = await fetch(`${API_BASE}/sos/${sosId}`, { 
        headers,
        signal: AbortSignal.timeout(5000)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      return data.sos
    } catch (error) {
      // Silently use demo mode
      throw new Error('SOS not found in demo mode')
    }
  },
  
  update: async (sosId: string, updates: Partial<SOS>) => {
    if (isFirebaseActive()) {
      try {
        const docRef = doc(db, 'sos', sosId)
        await updateDoc(docRef, updates)
        return { message: 'SOS updated successfully (Firebase)', sos: { id: sosId, ...updates } }
      } catch (error) {
        console.error('Firebase error in sos.update:', error)
      }
    }
    try {
      const res = await fetch(`${API_BASE}/sos/${sosId}/update`, {
        method: 'POST',
        headers,
        body: JSON.stringify(updates),
        signal: AbortSignal.timeout(5000)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    } catch (error) {
      // Silently use demo mode
      isDemoMode = true
      return {
        message: 'SOS updated successfully (DEMO MODE)',
        sos: {
          id: sosId,
          ...updates
        }
      }
    }
  },
  
  resolve: async (sosId: string, resolvedBy: string) => {
    const resolvedAt = new Date().toISOString()
    if (isFirebaseActive()) {
      try {
        const docRef = doc(db, 'sos', sosId)
        await updateDoc(docRef, { status: 'RESOLVED', resolvedAt, resolvedBy })
        return { message: 'SOS resolved successfully (Firebase)' }
      } catch (error) {
        console.error('Firebase error in sos.resolve:', error)
      }
    }
    try {
      const res = await fetch(`${API_BASE}/sos/${sosId}/resolve`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ resolvedBy }),
        signal: AbortSignal.timeout(5000)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    } catch (error) {
      // Silently use demo mode
      isDemoMode = true
      return {
        message: 'SOS resolved successfully (DEMO MODE)',
        sos: {
          id: sosId,
          status: 'RESOLVED',
          resolvedAt: new Date().toISOString(),
          resolvedBy
        }
      }
    }
  },
  
  getUserSOS: async (userId: string): Promise<SOS[]> => {
    if (isFirebaseActive()) {
      try {
        const q = query(collection(db, 'sos'), where('userId', '==', userId))
        const snapshot = await getDocs(q)
        return snapshot.docs.map(d => d.data() as SOS)
      } catch (error) {
        console.error('Firebase error in sos.getUserSOS:', error)
      }
    }
    try {
      const res = await fetch(`${API_BASE}/sos/user/${userId}`, { 
        headers,
        signal: AbortSignal.timeout(5000)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      return data.sosList || []
    } catch (error) {
      // Silently use demo mode
      return []
    }
  }
}

// Demo helpers storage (in-memory for demo mode)
let demoHelpers: Helper[] = []
let isHelperRegistered = false

// Helpers API
export const helpersAPI = {
  register: async (userId: string, location: Location, availability: boolean = true) => {
    try {
      const res = await fetch(`${API_BASE}/helpers/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ userId, location, availability }),
        signal: AbortSignal.timeout(5000)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    } catch (error) {
      // Silently use demo mode
      isDemoMode = true
      isHelperRegistered = availability
      return { 
        message: 'Helper registered successfully (DEMO MODE)',
        helper: {
          id: `helper_${userId}`,
          userId,
          location,
          availability,
          registeredAt: new Date().toISOString()
        }
      }
    }
  },
  
  findNearby: async (location: Location, radius: number = 1): Promise<Helper[]> => {
    try {
      const res = await fetch(`${API_BASE}/helpers/nearby`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ location, radius }),
        signal: AbortSignal.timeout(5000)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      return data.helpers || []
    } catch (error) {
      // Silently use demo mode
      return [
        {
          id: 'helper_1',
          userId: 'user_helper_1',
          name: 'Priya Sharma',
          phone: '+91 98765 43210',
          location: { lat: location.lat + 0.005, lng: location.lng + 0.005 },
          distance: 0.5,
          availability: true,
          rating: 4.8,
          responseTime: '2 min',
          helpedCount: 23
        },
        {
          id: 'helper_2',
          userId: 'user_helper_2',
          name: 'Anita Desai',
          phone: '+91 98765 43211',
          location: { lat: location.lat - 0.008, lng: location.lng + 0.003 },
          distance: 0.8,
          availability: true,
          rating: 4.9,
          responseTime: '3 min',
          helpedCount: 31
        },
        {
          id: 'helper_3',
          userId: 'user_helper_3',
          name: 'Kavya Reddy',
          phone: '+91 98765 43212',
          location: { lat: location.lat + 0.01, lng: location.lng - 0.006 },
          distance: 1.2,
          availability: true,
          rating: 4.7,
          responseTime: '4 min',
          helpedCount: 18
        }
      ]
    }
  },
  
  respond: async (sosId: string, helperId: string, eta: string) => {
    try {
      const res = await fetch(`${API_BASE}/helpers/respond`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ sosId, helperId, eta }),
        signal: AbortSignal.timeout(5000)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    } catch (error) {
      // Silently use demo mode
      return {
        message: 'Response recorded (DEMO MODE)',
        response: {
          sosId,
          helperId,
          eta,
          timestamp: new Date().toISOString()
        }
      }
    }
  }
}

// Evidence API
export const evidenceAPI = {
  uploadFile: async (sosId: string, file: Blob, fileName: string) => {
    if (isFirebaseActive()) {
      try {
        const fileRef = storageRef(storage, `evidence/${sosId}/${fileName}`)
        const snapshot = await uploadBytes(fileRef, file)
        const downloadUrl = await getDownloadURL(snapshot.ref)
        
        // Save metadata to Firestore under the SOS document
        const sosRef = doc(db, 'sos', sosId)
        const sosSnap = await getDoc(sosRef)
        if (sosSnap.exists()) {
          const data = sosSnap.data()
          const evidence = data.evidence || []
          evidence.push({
            name: fileName,
            url: downloadUrl,
            uploadedAt: new Date().toISOString()
          })
          await updateDoc(sosRef, { evidence })
        }
        
        return { downloadUrl, message: 'Evidence uploaded successfully (Firebase)' }
      } catch (error) {
        console.error('Firebase Storage upload error:', error)
        throw error
      }
    }
    return { downloadUrl: 'DEMO_MODE', message: 'Evidence uploaded successfully (Demo Mode)' }
  },

  getUploadUrl: async (sosId: string, fileName: string, fileType: string) => {
    try {
      const res = await fetch(`${API_BASE}/evidence/upload-url`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ sosId, fileName, fileType }),
        signal: AbortSignal.timeout(5000)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    } catch (error) {
      // Silently use demo mode
      isDemoMode = true
      return {
        uploadUrl: 'DEMO_MODE',
        message: 'Evidence upload running in demo mode'
      }
    }
  },
  
  saveMetadata: async (sosId: string, filePath: string, fileType: string, duration?: number) => {
    try {
      const res = await fetch(`${API_BASE}/evidence/save-metadata`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ sosId, filePath, fileType, duration }),
        signal: AbortSignal.timeout(5000)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    } catch (error) {
      // Silently use demo mode
      return {
        message: 'Evidence metadata saved (DEMO MODE)'
      }
    }
  },
  
  getDownloadUrl: async (sosId: string, fileName: string) => {
    if (isFirebaseActive()) {
      try {
        const fileRef = storageRef(storage, `evidence/${sosId}/${fileName}`)
        const downloadUrl = await getDownloadURL(fileRef)
        return { downloadUrl, message: 'Download URL retrieved successfully (Firebase)' }
      } catch (error) {
        console.error('Firebase error retrieving download URL:', error)
      }
    }
    try {
      const res = await fetch(`${API_BASE}/evidence/${sosId}/${fileName}`, { 
        headers,
        signal: AbortSignal.timeout(5000)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    } catch (error) {
      // Silently use demo mode
      return {
        downloadUrl: 'DEMO_MODE',
        message: 'Evidence download running in demo mode'
      }
    }
  }
}

// AI Assistant API
export const aiAPI = {
  chat: async (message: string, context?: any) => {
    try {
      const res = await fetch(`${API_BASE}/ai/safety-assistant`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message, context }),
        signal: AbortSignal.timeout(5000)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    } catch (error) {
      // Silently use demo mode
      isDemoMode = true
      return {
        response: "I'm here to help! I'm currently running in demo mode. In a live deployment, I would provide personalized safety advice based on your situation.",
        message: 'AI Assistant running in demo mode'
      }
    }
  }
}

