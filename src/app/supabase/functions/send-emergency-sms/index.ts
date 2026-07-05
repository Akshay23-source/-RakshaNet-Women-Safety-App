/**
 * Supabase Edge Function: Send Emergency SMS
 * 
 * This function sends SMS messages to emergency contacts using Twilio
 * 
 * Environment Variables Required:
 * - TWILIO_ACCOUNT_SID: Your Twilio Account SID
 * - TWILIO_AUTH_TOKEN: Your Twilio Auth Token
 * - TWILIO_PHONE_NUMBER: Your Twilio phone number
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

interface RequestBody {
  to: string           // Recipient phone number in E.164 format
  message: string      // SMS message content
}

interface TwilioResponse {
  sid: string
  status: string
  to: string
  from: string
  body: string
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { to, message }: RequestBody = await req.json()

    // Validate inputs
    if (!to || !message) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: to, message' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate phone number format (E.164)
    const e164Regex = /^\+[1-9]\d{1,14}$/
    if (!e164Regex.test(to)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid phone number format. Must be E.164 format (e.g., +919876543210)' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get Twilio credentials from environment
    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
    const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER')

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      console.error('Missing Twilio configuration in environment variables')
      return new Response(
        JSON.stringify({ 
          error: 'Twilio not configured. Please contact administrator.' 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Prepare Twilio API request
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`
    
    const params = new URLSearchParams()
    params.append('To', to)
    params.append('From', TWILIO_PHONE_NUMBER)
    params.append('Body', message)

    // Send SMS via Twilio
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Twilio API error:', errorData)
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send SMS',
          details: errorData 
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const data: TwilioResponse = await response.json()

    console.log('SMS sent successfully:', {
      sid: data.sid,
      to: data.to,
      status: data.status
    })

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'SMS sent successfully',
        sid: data.sid,
        status: data.status,
        to: data.to
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in send-emergency-sms function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
