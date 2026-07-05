import React, { useState } from 'react'
import { Phone, Mail, Lock, UserPlus } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { toast } from 'sonner@2.0.3'
import { OTPVerification } from './OTPVerification'
import logoImage from 'figma:asset/56c91d45e639ee0da799f256ab5397998752922c.png'

interface LoginScreenProps {
  onComplete: () => void
}

export function LoginScreen({ onComplete }: LoginScreenProps) {
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('email')
  const [phoneNumber, setPhoneNumber] = useState('+91')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = () => {
    // Validate name
    if (!name || name.trim().length < 2) {
      toast.error('Please enter your name')
      return
    }

    // Validate phone or email
    if (loginMethod === 'phone') {
      // Remove all spaces and dashes from phone number
      const cleanPhone = phoneNumber.replace(/[\s-]/g, '')
      
      // Validate E.164 format: +[country code][number]
      const phoneRegex = /^\+[1-9]\d{1,14}$/
      
      if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
        toast.error('Invalid phone number format', {
          description: 'Use format: +[country code][number] (e.g., +919876543210)'
        })
        return
      }
      
      // Special validation for Indian numbers (+91 followed by 10 digits)
      if (cleanPhone.startsWith('+91')) {
        if (cleanPhone.length !== 13) {
          toast.error('Invalid Indian phone number', {
            description: 'Indian numbers must be +91 followed by exactly 10 digits (e.g., +919876543210)'
          })
          return
        }
      }
      
      // Update state with cleaned phone number
      setPhoneNumber(cleanPhone)
      
      console.log('✅ Phone number validated:', cleanPhone)
    } else {
      if (!email || !email.includes('@')) {
        toast.error('Please enter a valid email address')
        return
      }
      
      console.log('✅ Email validated:', email)
    }

    setIsLoading(true)

    // Simulate signup process and complete directly (bypassing OTP)
    setTimeout(() => {
      setIsLoading(false)
      
      localStorage.setItem('rakshanet_user_name', name)
      localStorage.setItem('rakshanet_login_method', loginMethod)
      
      if (loginMethod === 'phone') {
        const cleanPhone = phoneNumber.replace(/[\s-]/g, '')
        localStorage.setItem('rakshanet_phone', cleanPhone)
      } else {
        localStorage.setItem('rakshanet_email', email)
      }
      
      toast.success('Sign up successful!')
      onComplete()
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSignup()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="p-8 shadow-xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={logoImage} alt="RakshaNet Logo" className="w-20 h-20" />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl text-red-600 mb-2">Join RakshaNet</h1>
            <p className="text-gray-600">Create your safety account</p>
          </div>

          {/* Name Input */}
          <div className="space-y-2 mb-4">
            <label className="text-sm text-gray-700">Your Name</label>
            <Input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-gray-50"
              autoFocus
            />
          </div>

          {/* Login Method Toggle */}
          <div className="flex gap-2 mb-6">
            <Button
              className={`flex-1 ${
                loginMethod === 'phone'
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setLoginMethod('phone')}
            >
              <Phone className="w-4 h-4 mr-2" />
              Phone
            </Button>
            <Button
              className={`flex-1 ${
                loginMethod === 'email'
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setLoginMethod('email')}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>

          {/* Contact Input */}
          <div className="space-y-2 mb-6">
            {loginMethod === 'phone' ? (
              <>
                <label className="text-sm text-gray-700">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="+919876543210"
                  value={phoneNumber}
                  onChange={(e) => {
                    let value = e.target.value
                    // Ensure it starts with +
                    if (!value.startsWith('+')) {
                      value = '+' + value.replace(/\+/g, '')
                    }
                    // Remove any non-digit characters except +
                    value = '+' + value.slice(1).replace(/\D/g, '')
                    setPhoneNumber(value)
                  }}
                  onKeyPress={handleKeyPress}
                  className="bg-gray-50"
                  maxLength={15}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: +[country code][number] (e.g., +919876543210 for India)
                </p>
              </>
            ) : (
              <>
                <label className="text-sm text-gray-700">Email Address</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-gray-50"
                />
              </>
            )}
          </div>

          {/* Signup Button */}
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={handleSignup}
            disabled={isLoading}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          {/* Security Note */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <Lock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800">
              <p className="mb-2">
                <strong>🔒 Instant Secure Sign Up</strong>
              </p>
              <p>
                {loginMethod === 'phone' 
                  ? 'Your safety account will be linked instantly to your phone number.'
                  : 'Your safety account will be linked instantly to your email address.'}
              </p>
            </div>
          </div>

          {/* Terms */}
          <p className="text-xs text-center text-gray-500 mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </Card>
      </div>
    </div>
  )
}