/**
 * SMS Quick Test Component
 * Use this to quickly verify Supabase + Twilio SMS setup
 */

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { toast } from 'sonner@2.0.3'
import { Phone, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { createClient } from './utils/supabase/client'

export function SMSQuickTest() {
  const [phoneNumber, setPhoneNumber] = useState('+91')
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const supabase = createClient()

  const runTest = async () => {
    console.log('🧪 Starting SMS Test...')
    console.log('📱 Phone Number:', phoneNumber)
    
    setTestStatus('testing')
    setErrorMessage('')

    // Validate phone format
    const phoneRegex = /^\+[1-9]\d{1,14}$/
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      setTestStatus('error')
      setErrorMessage('Invalid phone format. Use: +[country code][number]')
      toast.error('Invalid Phone Format', {
        description: 'Example: +919876543210'
      })
      return
    }

    try {
      // Test SMS send
      console.log('📤 Attempting to send SMS OTP...')
      
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
        options: {
          channel: 'sms',
        }
      })

      if (error) {
        console.error('❌ SMS Test Failed:', error)
        setTestStatus('error')
        setErrorMessage(error.message)
        
        toast.error('SMS Test Failed', {
          description: error.message,
          duration: 10000
        })
        return
      }

      console.log('✅ SMS Test Successful!', data)
      setTestStatus('success')
      
      toast.success('✅ SMS Test Passed!', {
        description: `OTP sent to ${phoneNumber}. Check your phone!`,
        duration: 8000
      })

    } catch (error: any) {
      console.error('❌ Test Error:', error)
      setTestStatus('error')
      setErrorMessage(error.message || 'Unknown error')
      
      toast.error('Test Failed', {
        description: error.message || 'Please check console for details'
      })
    }
  }

  const resetTest = () => {
    setTestStatus('idle')
    setErrorMessage('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Phone className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl mb-2">SMS Quick Test</h1>
          <p className="text-sm text-gray-600">
            Verify your Supabase + Twilio SMS configuration
          </p>
        </div>

        {/* Phone Input */}
        <div className="space-y-2 mb-6">
          <label className="text-sm text-gray-700">Test Phone Number</label>
          <Input
            type="tel"
            placeholder="+919876543210"
            value={phoneNumber}
            onChange={(e) => {
              let value = e.target.value
              if (!value.startsWith('+')) {
                value = '+' + value.replace(/\+/g, '')
              }
              value = '+' + value.slice(1).replace(/\D/g, '')
              setPhoneNumber(value)
            }}
            className="bg-gray-50"
            maxLength={15}
            disabled={testStatus === 'testing'}
          />
          <p className="text-xs text-gray-500">
            E.164 format: +[country code][number]
          </p>
        </div>

        {/* Test Button */}
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-4"
          onClick={runTest}
          disabled={testStatus === 'testing'}
        >
          {testStatus === 'testing' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing SMS...
            </>
          ) : (
            <>
              <Phone className="w-4 h-4 mr-2" />
              Send Test SMS
            </>
          )}
        </Button>

        {/* Status Display */}
        {testStatus === 'success' && (
          <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-green-900 mb-1" style={{ fontWeight: 600 }}>
                  ✅ SMS Test Passed!
                </h3>
                <p className="text-sm text-green-700 mb-2">
                  OTP has been sent to {phoneNumber}
                </p>
                <p className="text-xs text-green-600">
                  Check your phone for the verification code. This confirms your Supabase + Twilio integration is working correctly!
                </p>
                <Button
                  onClick={resetTest}
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3"
                >
                  Test Another Number
                </Button>
              </div>
            </div>
          </div>
        )}

        {testStatus === 'error' && (
          <div className="p-4 bg-red-50 border-2 border-red-400 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-900 mb-1" style={{ fontWeight: 600 }}>
                  ❌ SMS Test Failed
                </h3>
                <p className="text-sm text-red-700 mb-2">
                  {errorMessage}
                </p>
                <div className="text-xs text-red-600 space-y-1">
                  <p><strong>Common Issues:</strong></p>
                  <ul className="list-disc ml-4 space-y-1">
                    <li>Phone Auth not enabled in Supabase</li>
                    <li>Twilio credentials incorrect</li>
                    <li>Trial account: phone not verified in Twilio</li>
                    <li>Invalid phone number format</li>
                  </ul>
                </div>
                <Button
                  onClick={resetTest}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm text-blue-900 mb-2" style={{ fontWeight: 600 }}>
            📋 Test Instructions:
          </h4>
          <ol className="text-xs text-blue-800 space-y-1 ml-4 list-decimal">
            <li>Open browser console (F12 → Console)</li>
            <li>Enter your phone number with + prefix</li>
            <li>Click "Send Test SMS"</li>
            <li>Check console for detailed logs</li>
            <li>Verify SMS arrives on your phone</li>
          </ol>
        </div>

        {/* Configuration Links */}
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-xs text-gray-700 mb-2" style={{ fontWeight: 600 }}>
            🔧 Configuration:
          </h4>
          <div className="space-y-2">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-blue-600 hover:text-blue-700 hover:underline"
            >
              → Supabase Dashboard
            </a>
            <a
              href="https://console.twilio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-blue-600 hover:text-blue-700 hover:underline"
            >
              → Twilio Console
            </a>
            <a
              href="/SMS_TESTING_GUIDE.md"
              target="_blank"
              className="block text-xs text-blue-600 hover:text-blue-700 hover:underline"
            >
              → Complete Testing Guide
            </a>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-xs text-yellow-800">
            <strong>💡 Tip:</strong> Keep browser console open during test to see detailed logs and error messages.
          </p>
        </div>
      </Card>
    </div>
  )
}
