/**
 * SMS Setup Status Dashboard
 * 
 * Shows current SMS configuration status and guides users
 */

import React, { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  CheckCircle2, 
  AlertCircle, 
  Rocket,
  Settings,
  ExternalLink,
  RefreshCw
} from 'lucide-react'
import { createClient } from './utils/supabase/client'
import { toast } from 'sonner@2.0.3'
import { ProductionSMSSetup } from './ProductionSMSSetup'

export function SMSSetupStatus() {
  const [isProduction, setIsProduction] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [showSetup, setShowSetup] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const checkConfiguration = async () => {
    setIsChecking(true)
    const supabase = createClient()
    
    try {
      // Try to trigger a phone OTP to test if SMS is configured
      // Using an invalid number to avoid actually sending SMS
      const { error } = await supabase.auth.signInWithOtp({
        phone: '+10000000000', // Invalid number for testing
        options: {
          channel: 'sms',
        }
      })

      // If error is about unsupported provider, SMS is not configured
      if (error?.message?.includes('not enabled') || 
          error?.message?.includes('provider') || 
          error?.message?.includes('Unsupported')) {
        setIsProduction(false)
      } else {
        // Any other error means SMS provider IS configured
        // (even if the number is invalid)
        setIsProduction(true)
      }
    } catch (err) {
      console.error('Error checking SMS config:', err)
      setIsProduction(false)
    }
    
    setIsChecking(false)
    setLastCheck(new Date())
  }

  useEffect(() => {
    checkConfiguration()
  }, [])

  return (
    <>
      <Card className="overflow-hidden">
        <div className={`p-4 ${isProduction ? 'bg-green-50' : 'bg-amber-50'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {isProduction ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600" />
              )}
              <h3 className="text-sm">
                SMS Configuration Status
              </h3>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={checkConfiguration}
              disabled={isChecking}
              className="h-8"
            >
              <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {isProduction ? (
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-green-800">
                    <strong>Production Mode Active</strong>
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Twilio SMS provider is configured. Real SMS messages will be sent to users' phones.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-green-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-700">Provider:</span>
                  <Badge variant="outline" className="bg-white border-green-300 text-green-700">
                    Twilio
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-700">Status:</span>
                  <Badge className="bg-green-600 text-white">
                    ✓ Active
                  </Badge>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open('https://console.twilio.com', '_blank')}
                  className="flex-1 text-xs h-8 border-green-300 text-green-700 hover:bg-green-100"
                >
                  Twilio Dashboard
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open('https://app.supabase.com/project/fjkuvwebluihzsoayxqj/auth/providers', '_blank')}
                  className="flex-1 text-xs h-8 border-green-300 text-green-700 hover:bg-green-100"
                >
                  Supabase Config
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-800">
                    <strong>Development Mode</strong>
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    OTP codes appear in browser console. Configure Twilio to send real SMS messages.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-amber-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-700">Provider:</span>
                  <Badge variant="outline" className="bg-white border-amber-300 text-amber-700">
                    Not Configured
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-700">Mode:</span>
                  <Badge className="bg-amber-600 text-white">
                    Development
                  </Badge>
                </div>
              </div>

              <div className="pt-3 flex flex-col gap-2">
                <Button
                  size="sm"
                  onClick={() => setShowSetup(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-8"
                >
                  <Rocket className="w-3 h-3 mr-2" />
                  Setup Twilio (10 min)
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('/PRODUCTION_SMS_SETUP.md', '_blank')}
                    className="text-xs h-8 border-amber-300 text-amber-700 hover:bg-amber-100"
                  >
                    Documentation
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('/TWILIO_SETUP_CHECKLIST.md', '_blank')}
                    className="text-xs h-8 border-amber-300 text-amber-700 hover:bg-amber-100"
                  >
                    Checklist
                  </Button>
                </div>
              </div>
            </div>
          )}

          {lastCheck && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Last checked: {lastCheck.toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
      </Card>

      {showSetup && (
        <ProductionSMSSetup onClose={() => setShowSetup(false)} />
      )}
    </>
  )
}
