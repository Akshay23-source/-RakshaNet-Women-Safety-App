/**
 * SMS Setup Summary Card
 * 
 * Quick visual summary of what's needed for production SMS
 * Can be shown on admin dashboard or settings page
 */

import React, { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Rocket, 
  CheckCircle2, 
  ExternalLink,
  Clock,
  DollarSign,
  Phone,
  FileText,
  PlayCircle
} from 'lucide-react'
import { ProductionSMSSetup } from './ProductionSMSSetup'

export function SMSSetupSummary() {
  const [showWizard, setShowWizard] = useState(false)

  return (
    <>
      <Card className="overflow-hidden">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Rocket className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl mb-1">Ready for Production?</h3>
              <p className="text-blue-100 text-sm">
                Configure Twilio to send real SMS messages to users' phones
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl text-blue-600 mb-1">10-15</div>
              <div className="text-xs text-gray-600">minutes setup</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl text-green-600 mb-1">$15</div>
              <div className="text-xs text-gray-600">free trial credit</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Phone className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl text-purple-600 mb-1">$0.01</div>
              <div className="text-xs text-gray-600">per SMS after</div>
            </div>
          </div>

          {/* Setup Steps Preview */}
          <div className="space-y-2">
            <h4 className="text-sm text-gray-500 mb-3">5 Simple Steps:</h4>
            <div className="space-y-2">
              {[
                { step: 1, title: 'Create Twilio Account', time: '5 min' },
                { step: 2, title: 'Get Credentials', time: '2 min' },
                { step: 3, title: 'Buy Phone Number', time: '1 min' },
                { step: 4, title: 'Configure Supabase', time: '3 min' },
                { step: 5, title: 'Test Real SMS', time: '2 min' }
              ].map((item) => (
                <div 
                  key={item.step}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1 text-sm text-gray-700">
                    {item.title}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.time}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t">
            <Button
              onClick={() => setShowWizard(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Start Interactive Setup Wizard
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => window.open('/PRODUCTION_SMS_SETUP.md', '_blank')}
                className="text-sm"
              >
                <FileText className="w-3 h-3 mr-2" />
                Full Guide
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('/TWILIO_SETUP_CHECKLIST.md', '_blank')}
                className="text-sm"
              >
                <CheckCircle2 className="w-3 h-3 mr-2" />
                Checklist
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => window.open('https://app.supabase.com/project/fjkuvwebluihzsoayxqj/auth/providers', '_blank')}
              className="w-full text-sm text-gray-600"
            >
              Open Supabase Dashboard
              <ExternalLink className="w-3 h-3 ml-2" />
            </Button>
          </div>

          {/* Benefits */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm text-green-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Benefits of Real SMS:
            </h4>
            <ul className="space-y-1 text-xs text-green-800 ml-6 list-disc">
              <li>Professional user experience</li>
              <li>Secure phone verification</li>
              <li>Works on any mobile device</li>
              <li>No console access needed</li>
              <li>Production-ready authentication</li>
            </ul>
          </div>

          {/* Current Status */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-sm text-amber-900 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Current Status:
            </h4>
            <p className="text-xs text-amber-800">
              Development Mode - OTP codes appear in browser console. Perfect for testing, 
              but configure Twilio before deploying to real users.
            </p>
          </div>
        </div>
      </Card>

      {/* Setup Wizard Modal */}
      {showWizard && (
        <ProductionSMSSetup onClose={() => setShowWizard(false)} />
      )}
    </>
  )
}
