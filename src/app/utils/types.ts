export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: 'user' | 'admin'
  isHelper: boolean
  createdAt: string
}

export interface EmergencyContact {
  id: string
  userId?: string
  name: string
  phone: string
  relationship: string
  priority: number
}

export interface Location {
  lat: number
  lng: number
  latitude?: number  // Alias for compatibility
  longitude?: number // Alias for compatibility
  address?: string
  accuracy?: number
  speed?: number
  heading?: number
  timestamp?: string
}

export interface SOS {
  id: string
  userId: string
  type: 'EMERGENCY' | 'ATTACK' | 'HARASSMENT' | 'ACCIDENT' | 'MEDICAL'
  timestamp: string
  location: Location
  depth_m?: number
  confidence: number
  status: 'ACTIVE' | 'RESOLVED' | 'CANCELLED'
  networkStage: 'CONTACT' | 'MESH' | 'ESP' | 'LORA' | 'SATELLITE' | 'DELIVERED'
  networkUsed: string | null
  helpersAlerted: number
  respondedBy: string | null
  responderETA?: string
  responseTime?: string
  evidence: Evidence[]
  escalationLog: EscalationLog[]
  responders?: Responder[]
  resolvedAt?: string
  resolvedBy?: string
}

export interface Evidence {
  sosId: string
  filePath: string
  fileType: 'audio' | 'video' | 'image'
  duration?: number
  uploadedAt: string
}

export interface EscalationLog {
  stage: string
  timestamp: string
  status: 'SUCCESS' | 'FAILED' | 'TIMEOUT'
  message: string
}

export interface Helper {
  id: string
  userId: string
  name?: string
  phone?: string
  location: Location
  availability: boolean
  registeredAt?: string
  sosResponded?: number
  rating: number
  distance?: number | string
  responseTime?: string
  helpedCount?: number
}

export interface Responder {
  helperId: string
  eta: string
  respondedAt: string
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalHelpers: number
  totalSOS: number
  activeSOS: number
  resolvedSOS: number
  resolvedToday: number
  averageResponseTime: string
  avgResponseTime: string
  timestamp: string
}

export interface CommunityMember {
  id: string
  name: string
  phone: string
  location: Location
  distance?: number
  isOnline: boolean
  lastSeen: string
  isHelper: boolean
}

export interface UserActivity {
  id: string
  userId: string
  userName: string
  type: 'sos_trigger' | 'login' | 'profile_update' | 'helper_register' | 'helper_response' | 'sos_resolve' | 'contact_add' | 'evidence_upload'
  message: string
  timestamp: string
  metadata?: any
}

export interface RegisteredUser {
  id: string
  name: string
  email: string
  phone: string
  registeredAt: string
  isHelper: boolean
  isOnline: boolean
  sosCount: number
}

export interface SOSHop {
  id: string
  sosId: string
  recipientId: string
  recipientName: string
  recipientType: 'community' | 'police' | 'trusted_contact'
  sentAt: string
  openedAt?: string
  respondedAt?: string
  status: 'sent' | 'delivered' | 'opened' | 'responded'
}