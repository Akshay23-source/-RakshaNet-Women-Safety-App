/**
 * Live Location Tracker for Emergency SOS
 * 
 * Continuously tracks and shares location with emergency contacts, helpers, and police
 * while SOS is active. Updates every 20 seconds (configurable).
 * All location data is stored in Supabase for real-time tracking.
 */

import type { Location, EmergencyContact } from './types'
import { sendSOSToContact, generateLocationLink } from './sms-alert'
import { storeLocationUpdate, createTrackingSession, endTrackingSession, generateLiveTrackingLink } from './supabase/location-tracking'

export interface LiveLocationConfig {
  updateIntervalMs: number  // Default: 20000 (20 seconds)
  enableHighAccuracy: boolean
  timeout: number
  maximumAge: number
}

export interface LocationUpdate {
  location: Location
  timestamp: string
  speed?: number
  accuracy?: number
  heading?: number
}

const DEFAULT_CONFIG: LiveLocationConfig = {
  updateIntervalMs: 20000, // 20 seconds between updates
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
}

export class LiveLocationTracker {
  private watchId: number | null = null
  private updateTimer: NodeJS.Timeout | null = null
  private isTracking: boolean = false
  private config: LiveLocationConfig
  private lastLocation: Location | null = null
  private updateCount: number = 0
  private smsCount: number = 0
  private lastSMSTime: number = 0
  private onLocationUpdateCallback?: (update: LocationUpdate) => void
  private onErrorCallback?: (error: string) => void
  private contacts: EmergencyContact[] = []
  private userName: string = ''
  private sosId: string = ''
  private userId: string = ''

  constructor(config: Partial<LiveLocationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Start live location tracking
   */
  async startTracking(
    sosId: string,
    userId: string,
    contacts: EmergencyContact[],
    userName: string,
    onUpdate?: (update: LocationUpdate) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    if (this.isTracking) {
      console.log('Live location tracking already active')
      return
    }

    this.onLocationUpdateCallback = onUpdate
    this.onErrorCallback = onError
    this.contacts = contacts
    this.userName = userName
    this.sosId = sosId
    this.userId = userId

    if (!navigator.geolocation) {
      const error = 'Geolocation not supported by this browser'
      this.onErrorCallback?.(error)
      throw new Error(error)
    }

    try {
      // Create tracking session in Supabase
      const session = await createTrackingSession(sosId, userId, userName)
      if (session) {
        console.log('✅ Supabase tracking session created:', session.id)
      }

      // Start continuous location watching
      this.watchId = navigator.geolocation.watchPosition(
        (position) => this.handleLocationUpdate(position, contacts, userName),
        (error) => this.handleLocationError(error),
        {
          enableHighAccuracy: this.config.enableHighAccuracy,
          timeout: this.config.timeout,
          maximumAge: this.config.maximumAge
        }
      )

      this.isTracking = true
      this.updateCount = 0
      this.smsCount = 0
      this.lastSMSTime = Date.now()

      // Set up timer to send SMS updates every N seconds
      this.updateTimer = setInterval(() => {
        if (this.lastLocation && this.isTracking) {
          this.sendScheduledLocationUpdate()
        }
      }, this.config.updateIntervalMs)

      console.log('🚨 Live location tracking started')
      console.log(`📍 SMS updates every ${this.config.updateIntervalMs / 1000} seconds`)
      console.log(`👥 Tracking for ${contacts.length} contacts`)
      console.log(`📊 Storing updates in Supabase for SOS: ${sosId}`)

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      this.onErrorCallback?.(errorMsg)
      throw error
    }
  }

  /**
   * Handle location update from GPS
   */
  private async handleLocationUpdate(
    position: GeolocationPosition,
    contacts: EmergencyContact[],
    userName: string
  ): Promise<void> {
    const location: Location = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date(position.timestamp).toISOString()
    }

    // Try to get address (reverse geocoding)
    try {
      const address = await this.reverseGeocode(location.latitude, location.longitude)
      if (address) {
        location.address = address
      }
    } catch (error) {
      console.log('Could not get address:', error)
    }

    // Store location in Supabase
    if (this.sosId && this.userId) {
      const stored = await storeLocationUpdate(this.sosId, this.userId, location)
      if (stored) {
        console.log('✅ Location stored in Supabase:', stored.id)
      }
    }

    this.lastLocation = location
    this.updateCount++

    const update: LocationUpdate = {
      location,
      timestamp: location.timestamp || new Date().toISOString(),
      speed: position.coords.speed || undefined,
      accuracy: position.coords.accuracy,
      heading: position.coords.heading || undefined
    }

    // Callback for UI update
    this.onLocationUpdateCallback?.(update)

    console.log(`📍 Location Update #${this.updateCount}:`, {
      lat: location.latitude!.toFixed(6),
      lng: location.longitude!.toFixed(6),
      accuracy: `${location.accuracy?.toFixed(0)}m`,
      speed: position.coords.speed ? `${position.coords.speed.toFixed(1)} m/s` : 'N/A'
    })
  }

  /**
   * Send scheduled location update to contacts
   */
  private async sendScheduledLocationUpdate(): Promise<void> {
    if (!this.lastLocation) return

    const location = this.lastLocation
    const update: LocationUpdate = {
      location,
      timestamp: location.timestamp || new Date().toISOString(),
      speed: location.speed,
      accuracy: location.accuracy,
      heading: location.heading
    }

    // Send location update to contacts
    await this.sendLocationToContacts(this.contacts, this.userName, location, update)

    this.lastSMSTime = Date.now()

    console.log(`📱 Sent scheduled live location update #${this.smsCount} to ${this.contacts.length} contacts`)
  }

  /**
   * Send live location update to all contacts
   */
  private async sendLocationToContacts(
    contacts: EmergencyContact[],
    userName: string,
    location: Location,
    update: LocationUpdate
  ): Promise<void> {
    const locationLink = generateLocationLink(location)
    const address = location.address || `${location.latitude!.toFixed(6)}, ${location.longitude!.toFixed(6)}`
    
    // Increment SMS count before sending
    this.smsCount++
    
    const message = this.generateLiveLocationMessage(userName, address, locationLink, update, this.smsCount)

    console.log(`📱 Sending live location update #${this.smsCount} to ${contacts.length} contacts`)

    // Send to each contact
    for (const contact of contacts.sort((a, b) => a.priority - b.priority)) {
      try {
        await sendSOSToContact(contact, {
          userName,
          location,
          timestamp: update.timestamp,
          emergencyType: 'LIVE LOCATION UPDATE'
        })
        
        console.log(`✅ Live location sent to ${contact.name}`)
      } catch (error) {
        console.error(`❌ Failed to send location to ${contact.name}:`, error)
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  /**
   * Generate live location SMS message
   */
  private generateLiveLocationMessage(
    userName: string,
    address: string,
    mapLink: string,
    update: LocationUpdate,
    updateNumber: number
  ): string {
    const speed = update.speed ? ` Moving at ${(update.speed * 3.6).toFixed(1)} km/h.` : ''
    const accuracy = update.accuracy ? ` (±${update.accuracy.toFixed(0)}m)` : ''
    
    return `🚨 LIVE LOCATION UPDATE #${updateNumber} from ${userName}

📍 Current Location: ${address}${accuracy}${speed}
🗺️ MAP: ${mapLink}
⏰ Time: ${new Date(update.timestamp).toLocaleTimeString()}

This is an active emergency. Location updates every ${this.config.updateIntervalMs / 1000} seconds.

- RakshaNet Live Tracking`
  }

  /**
   * Reverse geocoding to get address from coordinates
   */
  private async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'RakshaNet-Safety-App'
          }
        }
      )

      if (!response.ok) return null

      const data = await response.json()
      return data.display_name || null
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return null
    }
  }

  /**
   * Handle geolocation errors
   */
  private handleLocationError(error: GeolocationPositionError): void {
    let errorMsg = 'Unknown location error'

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMsg = 'Location permission denied. Please enable location services in your device settings.'
        break
      case error.POSITION_UNAVAILABLE:
        errorMsg = 'Location information unavailable. Please check your GPS signal and try again.'
        break
      case error.TIMEOUT:
        errorMsg = 'Location request timed out. Retrying...'
        break
    }

    console.error('❌ Location error:', errorMsg, error.message)
    this.onErrorCallback?.(errorMsg)
    
    // Stop tracking on critical errors
    if (error.code === error.PERMISSION_DENIED) {
      this.stopTracking()
    }
  }

  /**
   * Stop live location tracking
   */
  async stopTracking(): Promise<void> {
    if (!this.isTracking) {
      return
    }

    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }

    if (this.updateTimer !== null) {
      clearInterval(this.updateTimer)
      this.updateTimer = null
    }

    // End tracking session in Supabase
    if (this.sosId) {
      await endTrackingSession(this.sosId)
    }

    this.isTracking = false

    console.log(`✅ Live location tracking stopped after ${this.updateCount} updates`)
  }

  /**
   * Get tracking status
   */
  isActive(): boolean {
    return this.isTracking
  }

  /**
   * Get last known location
   */
  getLastLocation(): Location | null {
    return this.lastLocation
  }

  /**
   * Get update count
   */
  getUpdateCount(): number {
    return this.updateCount
  }

  /**
   * Get SMS count (number of location updates sent via SMS)
   */
  getSMSCount(): number {
    return this.smsCount
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<LiveLocationConfig>): void {
    this.config = { ...this.config, ...config }
    console.log('Live location config updated:', this.config)
  }
}

/**
 * Singleton instance for global access
 */
let trackerInstance: LiveLocationTracker | null = null

export function getLiveLocationTracker(config?: Partial<LiveLocationConfig>): LiveLocationTracker {
  if (!trackerInstance) {
    trackerInstance = new LiveLocationTracker(config)
  }
  return trackerInstance
}

/**
 * Quick start function for emergency use
 */
export async function startEmergencyLiveTracking(
  sosId: string,
  userId: string,
  contacts: EmergencyContact[],
  userName: string,
  onUpdate?: (update: LocationUpdate) => void,
  onError?: (error: string) => void
): Promise<LiveLocationTracker> {
  const tracker = getLiveLocationTracker({
    updateIntervalMs: 20000, // 20 seconds
    enableHighAccuracy: true
  })

  await tracker.startTracking(sosId, userId, contacts, userName, onUpdate, onError)
  return tracker
}

/**
 * Stop emergency tracking
 */
export function stopEmergencyLiveTracking(): void {
  if (trackerInstance) {
    trackerInstance.stopTracking()
  }
}