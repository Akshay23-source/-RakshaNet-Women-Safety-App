import React from 'react'
import { AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'

interface TwilioTrialErrorBannerProps {
  phoneNumber: string
  error: string
}

export function TwilioTrialErrorBanner({ phoneNumber, error }: TwilioTrialErrorBannerProps) {
  const isTwilioTrialError = 
    error?.includes('Short Code') ||
    error?.includes('21265') ||
    error?.includes('cannot be a Short Code')

  if (!isTwilioTrialError) {
    return null
  }

  return (
    <Card className="mb-6 p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-300 shadow-lg">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-orange-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📱</span>
            <h3 className="text-xl text-orange-900" style={{ fontWeight: 700 }}>
              Twilio Trial Account Limitation
            </h3>
          </div>
          <p className="text-base text-orange-800 leading-relaxed">
            Your phone number <strong className="text-orange-900">{phoneNumber}</strong> needs to be <strong>verified in Twilio Console</strong> before you can receive SMS.
          </p>
        </div>
      </div>

      {/* What's Happening */}
      <div className="mb-4 p-4 bg-white border-2 border-orange-200 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">ℹ️</span>
          <h4 className="text-base text-gray-900" style={{ fontWeight: 600 }}>
            What's Happening?
          </h4>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          Twilio <strong>trial accounts</strong> can only send SMS to phone numbers that you've verified first. 
          This is a security feature to prevent spam. It's quick and free to fix!
        </p>
      </div>

      {/* Quick Fix Steps */}
      <div className="mb-4 p-4 bg-white border-2 border-green-200 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚡</span>
          <h4 className="text-base text-green-900" style={{ fontWeight: 600 }}>
            Quick Fix (5 minutes):
          </h4>
        </div>
        
        <ol className="space-y-3">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs text-green-700" style={{ fontWeight: 600 }}>
              1
            </span>
            <div className="flex-1 text-sm">
              <p className="text-gray-800 mb-1">
                <strong>Open Twilio Console</strong>
              </p>
              <a 
                href="https://console.twilio.com/us1/develop/phone-numbers/manage/verified"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-orange-700 hover:text-orange-800 underline"
                style={{ fontWeight: 600 }}
              >
                Go to Verified Caller IDs
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </li>

          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs text-green-700" style={{ fontWeight: 600 }}>
              2
            </span>
            <div className="flex-1 text-sm text-gray-800">
              Click <strong className="text-orange-700">"+ Add new Caller ID"</strong>
            </div>
          </li>

          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs text-green-700" style={{ fontWeight: 600 }}>
              3
            </span>
            <div className="flex-1">
              <p className="text-sm text-gray-800 mb-1">
                Enter your phone number:
              </p>
              <div className="p-2 bg-gray-100 rounded border border-gray-300 text-sm font-mono text-gray-900">
                {phoneNumber}
              </div>
            </div>
          </li>

          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs text-green-700" style={{ fontWeight: 600 }}>
              4
            </span>
            <div className="flex-1 text-sm text-gray-800">
              Click <strong className="text-orange-700">"Verify"</strong> and answer the call from Twilio
            </div>
          </li>

          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs text-green-700" style={{ fontWeight: 600 }}>
              5
            </span>
            <div className="flex-1 text-sm text-gray-800">
              Come back and try signing up again with the <strong>same number</strong>
            </div>
          </li>
        </ol>
      </div>

      {/* Alternative Solution */}
      <div className="mb-4 p-4 bg-white border-2 border-blue-200 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">💡</span>
          <h4 className="text-base text-blue-900" style={{ fontWeight: 600 }}>
            Alternative: Upgrade to Paid Account
          </h4>
        </div>
        <p className="text-sm text-gray-700 mb-2 leading-relaxed">
          If you don't want to verify each phone number, upgrade your Twilio account to paid (still free $15 credit). 
          This removes all restrictions and allows SMS to any phone number.
        </p>
        <ul className="space-y-1 text-xs text-gray-600 ml-4">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            Send to ANY phone number
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            Keep your $15 free credit
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            Only ~$0.01 per SMS
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
          onClick={() => window.open('https://console.twilio.com/us1/develop/phone-numbers/manage/verified', '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Verify Phone in Twilio
        </Button>
        <Button
          variant="outline"
          className="border-orange-300 text-orange-700 hover:bg-orange-50"
          onClick={() => window.open('/FIX_SMS_ERROR_NOW.md', '_blank')}
        >
          View Full Guide
        </Button>
      </div>

      {/* Help Link */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-600">
          <strong>Need more help?</strong>{' '}
          <a 
            href="/TWILIO_TRIAL_FIX.md"
            target="_blank"
            className="text-orange-700 underline hover:text-orange-800"
          >
            Read detailed troubleshooting guide
          </a>
        </p>
      </div>
    </Card>
  )
}
