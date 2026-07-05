/**
 * Supabase Live Location Tracking
 * 
 * Stores and retrieves real-time GPS location updates for active SOS alerts.
 * Provides shareable tracking links for emergency contacts.
 */

import { createClient } from '../../components/utils/supabase/client'
import type { Location } from '../types'

export interface LocationUpdate {
  id?: string
  sos_id: string
  user_id: string
  latitude: number
  longitude: number
  accuracy?: number
  speed?: number
  heading?: number
  address?: string
  timestamp: string
  created_at?: string
}

export interface LiveTrackingSession {
  id: string
  sos_id: string
  user_id: string
  user_name: string
  started_at: string
  last_update_at: string
  is_active: boolean
  total_updates: number
}

/**
 * Create a new live tracking session when SOS is triggered
 */
export async function createTrackingSession(
  sosId: string,
  userId: string,
  userName: string
): Promise<LiveTrackingSession | null> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('live_tracking_sessions')
      .insert({
        sos_id: sosId,
        user_id: userId,
        user_name: userName,
        started_at: new Date().toISOString(),
        last_update_at: new Date().toISOString(),
        is_active: true,
        total_updates: 0
      })
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error creating tracking session:', error)
      return null
    }
    
    console.log('✅ Created tracking session:', data.id)
    return data as LiveTrackingSession
  } catch (error) {
    console.error('❌ Exception creating tracking session:', error)
    return null
  }
}

/**
 * Store a location update in Supabase
 */
export async function storeLocationUpdate(
  sosId: string,
  userId: string,
  location: Location
): Promise<LocationUpdate | null> {
  try {
    const supabase = createClient()
    
    const locationData: Omit<LocationUpdate, 'id' | 'created_at'> = {
      sos_id: sosId,
      user_id: userId,
      latitude: location.latitude || location.lat,
      longitude: location.longitude || location.lng,
      accuracy: location.accuracy,
      speed: location.speed,
      heading: location.heading,
      address: location.address,
      timestamp: location.timestamp || new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('location_updates')
      .insert(locationData)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error storing location update:', error)
      return null
    }
    
    // Update the tracking session's last update time and count
    await supabase
      .from('live_tracking_sessions')
      .update({
        last_update_at: new Date().toISOString(),
        total_updates: supabase.rpc('increment', { row_id: sosId })
      })
      .eq('sos_id', sosId)
    
    console.log(`✅ Stored location update in Supabase for SOS: ${sosId}`)
    return data as LocationUpdate
  } catch (error) {
    console.error('❌ Exception storing location update:', error)
    return null
  }
}

/**
 * Get the latest location for an SOS
 */
export async function getLatestLocation(sosId: string): Promise<LocationUpdate | null> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('location_updates')
      .select('*')
      .eq('sos_id', sosId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single()
    
    if (error) {
      console.error('❌ Error fetching latest location:', error)
      return null
    }
    
    return data as LocationUpdate
  } catch (error) {
    console.error('❌ Exception fetching latest location:', error)
    return null
  }
}

/**
 * Get all location updates for an SOS (for tracking history)
 */
export async function getLocationHistory(
  sosId: string,
  limit: number = 50
): Promise<LocationUpdate[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('location_updates')
      .select('*')
      .eq('sos_id', sosId)
      .order('timestamp', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('❌ Error fetching location history:', error)
      return []
    }
    
    return (data as LocationUpdate[]) || []
  } catch (error) {
    console.error('❌ Exception fetching location history:', error)
    return []
  }
}

/**
 * Get tracking session info
 */
export async function getTrackingSession(sosId: string): Promise<LiveTrackingSession | null> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('live_tracking_sessions')
      .select('*')
      .eq('sos_id', sosId)
      .single()
    
    if (error) {
      console.error('❌ Error fetching tracking session:', error)
      return null
    }
    
    return data as LiveTrackingSession
  } catch (error) {
    console.error('❌ Exception fetching tracking session:', error)
    return null
  }
}

/**
 * End a tracking session
 */
export async function endTrackingSession(sosId: string): Promise<boolean> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('live_tracking_sessions')
      .update({
        is_active: false,
        last_update_at: new Date().toISOString()
      })
      .eq('sos_id', sosId)
    
    if (error) {
      console.error('❌ Error ending tracking session:', error)
      return false
    }
    
    console.log(`✅ Ended tracking session for SOS: ${sosId}`)
    return true
  } catch (error) {
    console.error('❌ Exception ending tracking session:', error)
    return false
  }
}

/**
 * Generate a shareable live tracking link
 */
export function generateLiveTrackingLink(sosId: string, projectId: string): string {
  // This would be a public page on your domain that shows the live tracking map
  // For now, we'll use the Supabase project URL with the SOS ID
  return `${window.location.origin}/track/${sosId}`
}

/**
 * Subscribe to real-time location updates for an SOS
 */
export function subscribeToLocationUpdates(
  sosId: string,
  onUpdate: (location: LocationUpdate) => void,
  onError?: (error: Error) => void
) {
  const supabase = createClient()
  
  const channel = supabase
    .channel(`location-updates-${sosId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'location_updates',
        filter: `sos_id=eq.${sosId}`
      },
      (payload) => {
        console.log('📍 Real-time location update received:', payload)
        onUpdate(payload.new as LocationUpdate)
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`✅ Subscribed to live location updates for SOS: ${sosId}`)
      } else if (status === 'CHANNEL_ERROR') {
        const error = new Error('Failed to subscribe to location updates')
        console.error('❌ Subscription error:', error)
        onError?.(error)
      }
    })
  
  // Return unsubscribe function
  return () => {
    console.log(`🔌 Unsubscribing from location updates for SOS: ${sosId}`)
    supabase.removeChannel(channel)
  }
}

/**
 * Database Schema SQL for Supabase
 * 
 * Run this in your Supabase SQL Editor:
 * 
 * -- Table for storing location updates
 * CREATE TABLE IF NOT EXISTS location_updates (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   sos_id TEXT NOT NULL,
 *   user_id TEXT NOT NULL,
 *   latitude DOUBLE PRECISION NOT NULL,
 *   longitude DOUBLE PRECISION NOT NULL,
 *   accuracy DOUBLE PRECISION,
 *   speed DOUBLE PRECISION,
 *   heading DOUBLE PRECISION,
 *   address TEXT,
 *   timestamp TIMESTAMPTZ NOT NULL,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- Index for faster queries
 * CREATE INDEX idx_location_updates_sos_id ON location_updates(sos_id);
 * CREATE INDEX idx_location_updates_timestamp ON location_updates(timestamp DESC);
 * 
 * -- Table for tracking sessions
 * CREATE TABLE IF NOT EXISTS live_tracking_sessions (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   sos_id TEXT UNIQUE NOT NULL,
 *   user_id TEXT NOT NULL,
 *   user_name TEXT NOT NULL,
 *   started_at TIMESTAMPTZ NOT NULL,
 *   last_update_at TIMESTAMPTZ NOT NULL,
 *   is_active BOOLEAN DEFAULT true,
 *   total_updates INTEGER DEFAULT 0,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- Index for tracking sessions
 * CREATE INDEX idx_tracking_sessions_sos_id ON live_tracking_sessions(sos_id);
 * CREATE INDEX idx_tracking_sessions_active ON live_tracking_sessions(is_active);
 * 
 * -- Enable Row Level Security (RLS)
 * ALTER TABLE location_updates ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE live_tracking_sessions ENABLE ROW LEVEL SECURITY;
 * 
 * -- Policy to allow authenticated users to insert their own locations
 * CREATE POLICY "Users can insert their own location updates"
 *   ON location_updates FOR INSERT
 *   WITH CHECK (auth.uid()::text = user_id);
 * 
 * -- Policy to allow anyone to read location updates (for emergency contacts)
 * CREATE POLICY "Anyone can read location updates"
 *   ON location_updates FOR SELECT
 *   USING (true);
 * 
 * -- Policy to allow users to create their own tracking sessions
 * CREATE POLICY "Users can create their own tracking sessions"
 *   ON live_tracking_sessions FOR INSERT
 *   WITH CHECK (auth.uid()::text = user_id);
 * 
 * -- Policy to allow anyone to read tracking sessions
 * CREATE POLICY "Anyone can read tracking sessions"
 *   ON live_tracking_sessions FOR SELECT
 *   USING (true);
 * 
 * -- Policy to allow users to update their own tracking sessions
 * CREATE POLICY "Users can update their own tracking sessions"
 *   ON live_tracking_sessions FOR UPDATE
 *   USING (auth.uid()::text = user_id);
 */
