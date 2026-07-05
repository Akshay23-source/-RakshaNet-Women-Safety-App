/**
 * OTP Verification Component - REAL SMS/Email OTP ONLY
 * 
 * This component sends REAL OTP messages via:
 * - SMS: Using Supabase Phone Auth with Twilio/MessageBird/Vonage
 * - Email: Using Supabase Email Auth
 * 
 * IMPORTANT: Development mode has been REMOVED.
 * Users MUST configure SMS provider in Supabase to receive OTP.
 * 
 * Setup Required:
 * 1. Go to Supabase Dashboard → Authentication → Phone Auth
 * 2. Enable Phone Auth and configure Twilio credentials
 * 3. Add your Twilio Account SID, Auth Token, and Phone Number
 * 
 * Changes:
 * ❌ Removed: Development mode fallback
 * ❌ Removed: Console OTP display
 * ❌ Removed: Mock OTP generation
 * ✅ Production only: Real Supabase SMS/Email authentication
 * ✅ Clear errors: Guides users to configure SMS provider
 */

import React, { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp'
import { toast } from 'sonner@2.0.3'
import { Shield, CheckCircle2, Phone, AlertCircle } from 'lucide-react'
import { createClient } from './utils/supabase/client'
import { TwilioTrialErrorBanner } from './TwilioTrialErrorBanner'

interface OTPVerificationProps {
  phone?: string
  email?: string
  onVerified: () => void
  onBack: () => void
}

export function OTPVerification({ phone, email, onVerified, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [smsConfigError, setSmsConfigError] = useState(false)
  const [lastError, setLastError] = useState<string>('')
  const [isVerified, setIsVerified] = useState(false) // Prevent double verification

  // Initialize Supabase client
  const supabase = createClient()

  // Send OTP on component mount
  useEffect(() => {
    console.log('🚀 OTPVerification mounted')
    console.log('📱 Phone:', phone)
    console.log('📧 Email:', email)
    sendOTP()
  }, [])

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const sendOTP = async () => {
    try {
      setIsLoading(true)
      setSmsConfigError(false)

      if (phone) {
        // Clean and validate phone number format
        const cleanPhone = phone.replace(/[\s-]/g, '')
        
        // Log the phone number being sent
        console.log('📤 Sending SMS OTP to:', cleanPhone)
        console.log('🔧 Phone validation:')
        console.log('   - Original:', phone)
        console.log('   - Cleaned:', cleanPhone)
        console.log('   - Length:', cleanPhone.length)
        console.log('   - Starts with +:', cleanPhone.startsWith('+'))
        console.log('🔧 Supabase Client Ready:', !!supabase)
        
        // Validate phone format before sending
        if (!cleanPhone.startsWith('+')) {
          toast.error('Invalid phone format', {
            description: 'Phone must start with + and country code'
          })
          setIsLoading(false)
          return
        }
        
        // Special validation for Indian numbers
        if (cleanPhone.startsWith('+91') && cleanPhone.length !== 13) {
          toast.error('Invalid Indian phone number', {
            description: 'Must be +91 followed by exactly 10 digits (e.g., +919876543210)'
          })
          setIsLoading(false)
          return
        }
        
        // Step 1: Request OTP via SMS using Supabase Phone Auth
        // Using simplified signInWithOtp without extra options
        const { data, error } = await supabase.auth.signInWithOtp({
          phone: cleanPhone,
        })

        console.log('📊 Supabase Response:', { data, error })

        if (error) {
          console.error('❌ Supabase SMS Error:', {
            message: error.message,
            status: error.status,
            name: error.name,
            fullError: error
          })
          
          // Check if error is Twilio trial account restriction (Error 21265)
          const isTwilioTrialError = 
            error.message?.includes('Short Code') ||
            error.message?.includes('21265') ||
            error.message?.includes('cannot be a Short Code')
          
          // Check if error is specifically about SMS provider configuration
          const isSMSConfigError = 
            error.message?.toLowerCase().includes('sms') ||
            error.message?.toLowerCase().includes('phone') && error.message?.toLowerCase().includes('not enabled') ||
            error.message?.toLowerCase().includes('provider') && error.message?.toLowerCase().includes('not configured') ||
            error.message?.includes('Unsupported phone provider')
          
          if (isTwilioTrialError) {
            // Twilio Trial Account - unverified number
            setSmsConfigError(true)
            toast.error('Twilio Trial: Phone Not Verified', {
              description: `Your phone needs verification in Twilio Console. See FIX_SMS_ERROR_NOW.md for instructions.`,
              duration: 10000,
              icon: <AlertCircle className="w-5 h-5 text-orange-600" />
            })
          } else if (isSMSConfigError) {
            setSmsConfigError(true)
            toast.error('SMS Provider Not Configured', {
              description: error.message,
              duration: 8000,
              icon: <AlertCircle className="w-5 h-5 text-red-600" />
            })
          } else {
            // Other errors (like invalid phone format, etc.)
            toast.error('Failed to Send SMS', {
              description: error.message || 'Please check your phone number and try again',
              duration: 6000
            })
          }
          setIsLoading(false)
          setLastError(error.message)
          return
        }

        // Success! SMS sent
        console.log('✅ SMS OTP sent successfully!', data)
        toast.success('✓ SMS Sent Successfully!', {
          description: `A 6-digit verification code has been sent to ${phone}`,
          duration: 5000,
          icon: <Phone className="w-5 h-5 text-green-600" />
        })

      } else if (email) {
        console.log('📤 Sending Email OTP to:', email)
        console.log('🔧 Supabase Client Ready:', !!supabase)
        
        // Step 1: Request OTP via Email using Supabase Email Auth
        // Using simplified signInWithOtp without extra options
        const { data, error } = await supabase.auth.signInWithOtp({
          email: email,
        })

        console.log('📊 Supabase Email Response:', { data, error })

        if (error) {
          console.error('❌ Email OTP Error:', {
            message: error.message,
            status: error.status,
            name: error.name,
            fullError: error
          })
          toast.error('Failed to send Email OTP', {
            description: error.message || 'Please try again'
          })
          setIsLoading(false)
          setLastError(error.message)
          return
        }

        // Real email sent successfully
        console.log('✅ Email OTP sent successfully!', data)
        toast.success('✓ Email Sent Successfully!', {
          description: `A 6-digit verification code has been sent to ${email}`,
          duration: 5000,
          icon: <CheckCircle2 className="w-5 h-5 text-green-600" />
        })
      }

      // Reset countdown
      setCountdown(60)
      setCanResend(false)
    } catch (error: any) {
      console.error('💥 Error in sendOTP:', error)
      toast.error('Failed to send OTP', {
        description: error.message || 'Please check your connection and try again'
      })
      setLastError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = () => {
    if (!canResend || isLoading) return
    
    setOtp('')
    setIsVerified(false) // Reset verification status
    setSmsConfigError(false) // Reset error status
    sendOTP()
    toast.info('Sending new OTP...')
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter complete 6-digit OTP')
      return
    }

    if (isVerified) {
      console.log('⚠️ Already verified, skipping')
      return
    }

    setIsVerifying(true)

    try {
      // Step 2: Verify OTP with Supabase
      if (phone) {
        console.log('🔍 Verifying phone OTP:', { phone, otp })
        
        // Verify phone OTP
        const { data, error } = await supabase.auth.verifyOtp({
          phone: phone,
          token: otp,
          type: 'sms'
        })

        console.log('📊 Verification Response:', { data, error })

        if (error) {
          console.error('❌ OTP Verification Error:', {
            message: error.message,
            status: error.status,
            name: error.name,
            fullError: error
          })
          
          // Check if token expired
          if (error.message?.toLowerCase().includes('expired') || 
              error.message?.toLowerCase().includes('invalid')) {
            toast.error('OTP Expired or Invalid', {
              description: 'Please request a new OTP code',
              duration: 4000
            })
            setOtp('')
          } else {
            toast.error('Invalid OTP', {
              description: error.message || 'Please enter the correct OTP or request a new one'
            })
            setOtp('')
          }
          setIsVerifying(false)
          return
        }

        if (data.user) {
          console.log('✅ User Signed In:', data.user)
          setIsVerified(true) // Mark as verified to prevent double verification
          
          toast.success('✓ Phone Verified Successfully!', {
            description: 'Your phone number has been verified',
            duration: 2000
          })
          
          setTimeout(() => {
            onVerified()
          }, 500)
        }
      } else if (email) {
        console.log('🔍 Verifying email OTP:', { email, otp })
        
        // Verify email OTP
        const { data, error } = await supabase.auth.verifyOtp({
          email: email,
          token: otp,
          type: 'email'
        })

        console.log('📊 Verification Response:', { data, error })

        if (error) {
          console.error('❌ OTP Verification Error:', {
            message: error.message,
            status: error.status,
            name: error.name,
            fullError: error
          })
          
          // Check if token expired
          if (error.message?.toLowerCase().includes('expired') || 
              error.message?.toLowerCase().includes('invalid')) {
            toast.error('OTP Expired or Invalid', {
              description: 'Please request a new OTP code',
              duration: 4000
            })
            setOtp('')
          } else {
            toast.error('Invalid OTP', {
              description: error.message || 'Please enter the correct OTP or request a new one'
            })
            setOtp('')
          }
          setIsVerifying(false)
          return
        }

        if (data.user) {
          console.log('✅ User Signed In:', data.user)
          setIsVerified(true) // Mark as verified to prevent double verification
          
          toast.success('✓ Email Verified Successfully!', {
            description: 'Your email has been verified',
            duration: 2000
          })
          
          setTimeout(() => {
            onVerified()
          }, 500)
        }
      }
    } catch (error: any) {
      console.error('💥 Verification error:', error)
      toast.error('Verification failed', {
        description: 'Please try again'
      })
      setOtp('')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleOTPChange = (value: string) => {
    setOtp(value)
    
    // Auto-verify when 6 digits are entered
    if (value.length === 6 && !isVerified && !isVerifying) {
      // Use immediate verification without timeout to prevent expiration
      (async () => {
        setIsVerifying(true)
        
        try {
          if (phone) {
            console.log('🔄 Auto-verifying phone OTP:', { phone, value })
            
            const { data, error } = await supabase.auth.verifyOtp({
              phone: phone,
              token: value,
              type: 'sms'
            })

            console.log('📊 Auto-verify Response:', { data, error })

            if (error) {
              console.error('❌ Auto-verification failed:', error)
              
              // Better error handling for expired/invalid tokens
              if (error.message?.toLowerCase().includes('expired')) {
                toast.error('OTP Expired', {
                  description: 'The code has expired. Please request a new one.',
                  duration: 4000
                })
                setOtp('')
              } else if (error.message?.toLowerCase().includes('invalid')) {
                toast.error('Invalid OTP', {
                  description: 'Please check the code and try again',
                  duration: 3000
                })
                setOtp('')
              } else {
                toast.error('Verification Failed', {
                  description: error.message || 'Please try again'
                })
                setOtp('')
              }
            } else if (data.user) {
              console.log('✅ User Signed In (Auto):', data.user)
              setIsVerified(true) // Mark as verified
              
              toast.success('✓ Phone Verified Successfully!', {
                description: 'Your phone number has been verified',
                duration: 2000
              })
              
              setTimeout(() => {
                onVerified()
              }, 500)
            }
          } else if (email) {
            console.log('🔄 Auto-verifying email OTP:', { email, value })
            
            const { data, error } = await supabase.auth.verifyOtp({
              email: email,
              token: value,
              type: 'email'
            })

            console.log('📊 Auto-verify Response:', { data, error })

            if (error) {
              console.error('❌ Auto-verification failed:', error)
              
              // Better error handling for expired/invalid tokens
              if (error.message?.toLowerCase().includes('expired')) {
                toast.error('OTP Expired', {
                  description: 'The code has expired. Please request a new one.',
                  duration: 4000
                })
                setOtp('')
              } else if (error.message?.toLowerCase().includes('invalid')) {
                toast.error('Invalid OTP', {
                  description: 'Please check the code and try again',
                  duration: 3000
                })
                setOtp('')
              } else {
                toast.error('Verification Failed', {
                  description: error.message || 'Please try again'
                })
                setOtp('')
              }
            } else if (data.user) {
              console.log('✅ User Signed In (Auto):', data.user)
              setIsVerified(true) // Mark as verified
              
              toast.success('✓ Email Verified Successfully!', {
                description: 'Your email has been verified',
                duration: 2000
              })
              
              setTimeout(() => {
                onVerified()
              }, 500)
            }
          }
        } catch (error: any) {
          console.error('💥 Auto-verification error:', error)
          toast.error('Verification failed', {
            description: error.message || 'Please try again'
          })
          setOtp('')
        } finally {
          setIsVerifying(false)
        }
      })()
    }
  }

  const contact = phone || email || ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="p-8 shadow-xl">
          {/* Header */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl mb-2">Verify OTP</h1>
            <p className="text-sm text-gray-600">
              Enter the 6-digit code sent to{' '}
              <span className="text-gray-900">{contact}</span>
            </p>
          </div>

          {/* Twilio Trial Error Banner */}
          {smsConfigError && phone && (lastError?.includes('Short Code') || lastError?.includes('21265')) ? (
            <TwilioTrialErrorBanner phoneNumber={phone} error={lastError} />
          ) : null}

          {/* SMS Configuration Error */}
          {smsConfigError && phone && !lastError?.includes('Short Code') && !lastError?.includes('21265') ? (
            <div className="mb-6 p-6 bg-red-50 border-2 border-red-400 rounded-2xl">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">⚠️</span>
                    <h3 className="text-lg text-red-900" style={{ fontWeight: 600 }}>
                      SMS Provider Not Configured
                    </h3>
                  </div>
                  <p className="text-red-700">
                    To receive SMS OTP, you need to configure Twilio in your Supabase Dashboard.
                  </p>
                </div>
              </div>
              
              <div className="bg-white border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">📋</span>
                  <h4 className="text-base text-gray-900" style={{ fontWeight: 600 }}>
                    Setup Steps:
                  </h4>
                </div>
                
                <ol className="space-y-2 ml-1">
                  <li className="text-sm text-gray-800">
                    <span className="text-gray-700">1. Go to </span>
                    <a 
                      href="https://supabase.com/dashboard" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-red-700 underline hover:text-red-800"
                      style={{ fontWeight: 600 }}
                    >
                      Supabase Dashboard
                    </a>
                  </li>
                  
                  <li className="text-sm text-gray-800">
                    <span className="text-gray-700">2. Navigate to </span>
                    <span className="text-red-700" style={{ fontWeight: 600 }}>Authentication</span>
                    <span className="text-gray-700"> → </span>
                    <span className="text-red-700" style={{ fontWeight: 600 }}>Phone Auth</span>
                  </li>
                  
                  <li className="text-sm text-gray-800">
                    <span className="text-gray-700">3. Enable Phone Auth and select </span>
                    <span className="text-red-700" style={{ fontWeight: 600 }}>Twilio</span>
                  </li>
                  
                  <li className="text-sm text-gray-700">
                    4. Enter your Twilio credentials (Account SID, Auth Token, Phone Number)
                  </li>
                  
                  <li className="text-sm text-gray-700">
                    5. Save and try again
                  </li>
                </ol>
              </div>

              <div className="mt-4 text-sm">
                <span className="text-red-900" style={{ fontWeight: 600 }}>Need help?</span>
                <span className="text-gray-700"> See </span>
                <a 
                  href="/TWILIO_QUICK_START.md" 
                  target="_blank"
                  className="text-red-700 underline hover:text-red-800"
                  style={{ fontWeight: 600 }}
                >
                  Twilio SMS Guide
                </a>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg">
              <div className="flex items-start gap-2">
                <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800 mb-1">
                    <strong>Check your {phone ? 'phone' : 'email'}!</strong>
                  </p>
                  <p className="text-xs text-blue-700">
                    {phone 
                      ? 'A real SMS with your 6-digit verification code has been sent to your phone number.'
                      : 'An email with your verification code has been sent to your email address.'}
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    ⏱️ Code expires in {countdown} seconds
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* OTP Input */}
          <div className="space-y-2 mb-6">
            <label className="text-sm text-gray-700">Enter OTP Code</label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={handleOTPChange}
                disabled={isVerifying || smsConfigError}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          {/* Verify Button */}
          <Button
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white mb-4"
            onClick={handleVerify}
            disabled={isVerifying || otp.length !== 6 || smsConfigError}
          >
            {isVerifying ? 'Verifying...' : 'Verify OTP'}
          </Button>

          {/* Resend Timer */}
          <div className="text-center">
            {canResend && !smsConfigError ? (
              <button
                onClick={handleResend}
                className="text-sm text-red-600 hover:text-red-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                {smsConfigError ? 'Configure SMS to continue' : `Resend in ${countdown}s`}
              </p>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
            >
              ← Back to signup
            </button>
          </div>

          {/* Info */}
          {!smsConfigError && (
            <>
              <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-800 text-center">
                  <strong>🔒 Secure Authentication:</strong> Real {phone ? 'SMS' : 'Email'} OTP verification powered by Supabase. Your data is encrypted and secure.
                </p>
              </div>

              {/* Troubleshooting */}
              {phone && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>Didn't receive SMS?</strong>
                  </p>
                  <ul className="text-xs text-yellow-700 mt-1 space-y-1 ml-4 list-disc">
                    <li>Check your phone has signal</li>
                    <li>Wait up to 30 seconds for delivery</li>
                    <li>Check spam/junk messages</li>
                    <li>Verify phone number is correct</li>
                    <li>Use "Resend OTP" after timer expires</li>
                  </ul>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  )
}