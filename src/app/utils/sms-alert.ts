/**
 * SMS Alert Utility for RakshaNet Emergency System
 * 
 * Handles SMS message generation and sending via Twilio for:
 * - Initial SOS alerts with live tracking link
 * - Live location tracking updates
 * - Emergency notifications
 */

import { createClient } from '../components/utils/supabase/client'
import type { Location, EmergencyContact } from './types'
import { generateLiveTrackingLink } from './supabase/location-tracking'

/**
 * Data structure for SOS messages
 */
export interface SOSMessageData {
  userName: string
  location?: Location | null
  timestamp?: string
  emergencyType?: string
  additionalInfo?: string
  sosId?: string  // Added for live tracking link
}

/**
 * Result of SMS sending operations
 */
export interface SMSSendResult {
  success: boolean
  contact: EmergencyContact
  error?: string
}

export interface SMSBatchResult {
  totalSent: number
  totalFailed: number
  results: SMSSendResult[]
}

/**
 * Generate Google Maps link from coordinates
 */
export function generateLocationLink(location: Location): string {
  const lat = location.latitude || location.lat
  const lng = location.longitude || location.lng
  return `https://www.google.com/maps?q=${lat},${lng}`
}

/**
 * Generate formatted SOS message text
 */
export function generateSOSMessage(data: SOSMessageData): string {
  const { userName, location, timestamp, emergencyType = 'EMERGENCY', additionalInfo, sosId } = data
  
  const timeStr = timestamp 
    ? new Date(timestamp).toLocaleString('en-IN', { 
        dateStyle: 'medium', 
        timeStyle: 'short' 
      })
    : new Date().toLocaleString('en-IN', { 
        dateStyle: 'medium', 
        timeStyle: 'short' 
      })
  
  let message = `🚨 EMERGENCY SOS ALERT from ${userName}!\n\n`
  message += `TYPE: ${emergencyType}\n`
  message += `TIME: ${timeStr}\n`
  
  if (location) {
    const address = location.address || 'Location coordinates'
    const mapLink = generateLocationLink(location)
    message += `\nLOCATION: ${address}\n`
    message += `MAP: ${mapLink}\n`
    
    // Add live tracking link if SOS ID is provided
    if (sosId) {
      const trackingLink = generateLiveTrackingLink(sosId, '')
      message += `\n📡 LIVE TRACKING: ${trackingLink}\n`
      message += `(Real-time location updates every 20 seconds)\n`
    }
  }
  
  if (additionalInfo) {
    message += `\nINFO: ${additionalInfo}\n`
  }
  
  message += `\nPlease respond immediately or call emergency services.`
  message += `\n\n- Sent via RakshaNet Safety App`
  
  return message
}

/**
 * Send SMS to a single emergency contact via Supabase Edge Function
 */
export async function sendSOSToContact(
  contact: EmergencyContact, 
  data: SOSMessageData
): Promise<SMSSendResult> {
  try {
    const message = generateSOSMessage(data)
    
    console.log(`📱 Sending SOS to ${contact.name} (${contact.phone})`)
    console.log(`Message preview: ${message.substring(0, 100)}...`)
    
    // Call Supabase Edge Function to send SMS via Twilio
    const { data: responseData, error } = await createClient().functions.invoke('send-emergency-sms', {
      body: { 
        to: contact.phone, 
        message: message 
      }
    })
    
    if (error) {
      console.error(`❌ Failed to send SMS to ${contact.name}:`, error)
      return {
        success: false,
        contact,
        error: error.message || 'Failed to send SMS'
      }
    }
    
    console.log(`✅ SMS sent successfully to ${contact.name}`)
    
    return {
      success: true,
      contact
    }
  } catch (error) {
    console.error(`❌ Exception sending SMS to ${contact.name}:`, error)
    return {
      success: false,
      contact,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Send SOS alerts to all emergency contacts with priority ordering
 */
export async function sendSOSToAllContacts(
  contacts: EmergencyContact[],
  data: SOSMessageData
): Promise<SMSBatchResult> {
  const results: SMSSendResult[] = []
  
  // Sort contacts by priority (1 = highest priority)
  const sortedContacts = [...contacts].sort((a, b) => a.priority - b.priority)
  
  console.log(`📱 Sending SOS to ${sortedContacts.length} emergency contacts...`)
  
  for (const contact of sortedContacts) {
    const result = await sendSOSToContact(contact, data)
    results.push(result)
    
    // Small delay to avoid rate limiting (100ms between messages)
    if (sortedContacts.indexOf(contact) < sortedContacts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  const totalSent = results.filter(r => r.success).length
  const totalFailed = results.filter(r => !r.success).length
  
  console.log(`📊 SMS Results: ${totalSent} sent, ${totalFailed} failed`)
  
  return {
    totalSent,
    totalFailed,
    results
  }
}

/**
 * Send custom SMS message to a contact
 * (For live location updates and other custom notifications)
 */
export async function sendCustomSMS(
  phone: string,
  message: string,
  contactName?: string
): Promise<boolean> {
  try {
    console.log(`📱 Sending custom SMS to ${contactName || phone}`)
    
    const { data, error } = await createClient().functions.invoke('send-emergency-sms', {
      body: { 
        to: phone, 
        message: message 
      }
    })
    
    if (error) {
      console.error(`❌ Failed to send custom SMS:`, error)
      return false
    }
    
    console.log(`✅ Custom SMS sent successfully`)
    return true
  } catch (error) {
    console.error(`❌ Exception sending custom SMS:`, error)
    return false
  }
}