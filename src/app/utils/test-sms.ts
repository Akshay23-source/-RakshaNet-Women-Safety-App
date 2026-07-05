/**
 * SMS OTP Test Utility
 * 
 * Use this to test if your Supabase SMS provider is configured correctly
 */

import { createClient } from '../components/utils/supabase/client'

export async function testSMSSetup(phoneNumber: string): Promise<{
  success: boolean
  message: string
  error?: any
}> {
  try {
    const supabase = createClient()

    console.log(`🧪 Testing SMS setup with phone: ${phoneNumber}`)

    // Validate phone number format (E.164)
    const phoneRegex = /^\+[1-9]\d{1,14}$/
    if (!phoneRegex.test(phoneNumber)) {
      return {
        success: false,
        message: 'Invalid phone number format. Must be E.164 format (e.g., +919876543210)'
      }
    }

    // Attempt to send OTP
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
      options: {
        channel: 'sms',
      }
    })

    if (error) {
      console.error('❌ SMS Test Failed:', error)
      
      // Provide helpful error messages
      if (error.message?.includes('not enabled')) {
        return {
          success: false,
          message: 'Phone auth provider is not enabled in Supabase. Please enable it in Authentication → Providers.',
          error
        }
      }
      
      if (error.message?.includes('SMS provider')) {
        return {
          success: false,
          message: 'SMS provider not configured. Please configure Twilio, MessageBird, or Vonage in Supabase.',
          error
        }
      }

      return {
        success: false,
        message: `SMS test failed: ${error.message}`,
        error
      }
    }

    console.log('✅ SMS Test Successful!')
    console.log('📱 Check your phone for the OTP message')
    
    return {
      success: true,
      message: `SMS sent successfully to ${phoneNumber}! Check your phone for the OTP.`
    }
  } catch (error: any) {
    console.error('❌ Unexpected error during SMS test:', error)
    return {
      success: false,
      message: `Unexpected error: ${error.message}`,
      error
    }
  }
}

/**
 * Quick test function - call this from browser console
 * 
 * Example usage:
 * ```
 * import { quickSMSTest } from './utils/test-sms'
 * await quickSMSTest('+919876543210')
 * ```
 */
export async function quickSMSTest(phoneNumber: string) {
  const result = await testSMSSetup(phoneNumber)
  
  if (result.success) {
    console.log('✅ SUCCESS:', result.message)
  } else {
    console.log('❌ FAILED:', result.message)
    if (result.error) {
      console.log('Error details:', result.error)
    }
  }
  
  return result
}

/**
 * Validate phone number without sending SMS
 */
export function validatePhoneNumber(phoneNumber: string): {
  valid: boolean
  message: string
  formatted?: string
} {
  // E.164 format: +[country code][number]
  const phoneRegex = /^\+[1-9]\d{1,14}$/

  if (!phoneNumber) {
    return {
      valid: false,
      message: 'Phone number is required'
    }
  }

  if (!phoneNumber.startsWith('+')) {
    return {
      valid: false,
      message: 'Phone number must start with + (e.g., +919876543210)'
    }
  }

  if (!phoneRegex.test(phoneNumber)) {
    return {
      valid: false,
      message: 'Invalid phone number format. Use E.164 format: +[country code][number]'
    }
  }

  if (phoneNumber.length < 10) {
    return {
      valid: false,
      message: 'Phone number too short'
    }
  }

  if (phoneNumber.length > 16) {
    return {
      valid: false,
      message: 'Phone number too long'
    }
  }

  return {
    valid: true,
    message: 'Valid phone number',
    formatted: phoneNumber
  }
}

/**
 * Common country codes for reference
 */
export const COUNTRY_CODES = {
  India: '+91',
  USA: '+1',
  UK: '+44',
  Australia: '+61',
  Canada: '+1',
  Germany: '+49',
  France: '+33',
  Japan: '+81',
  China: '+86',
  Brazil: '+55',
  Mexico: '+52',
  Spain: '+34',
  Italy: '+39',
  Russia: '+7',
  SouthAfrica: '+27',
}

/**
 * Format phone number to E.164
 * 
 * Example:
 * formatPhoneNumber('9876543210', 'India') => '+919876543210'
 */
export function formatPhoneNumber(number: string, country: keyof typeof COUNTRY_CODES): string {
  // Remove all non-digit characters
  const digits = number.replace(/\D/g, '')
  
  // Get country code
  const countryCode = COUNTRY_CODES[country]
  
  // If number already has country code, return as is
  if (number.startsWith(countryCode)) {
    return `+${digits}`
  }
  
  // Add country code
  return `${countryCode}${digits}`
}
