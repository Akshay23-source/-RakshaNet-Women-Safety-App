/**
 * Production SMS Setup Guide Component
 * 
 * Helps users configure Twilio for real SMS delivery
 * Shows step-by-step instructions and verification
 */

import React, { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Rocket, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Phone, 
  MessageCircle,
  DollarSign,
  Shield,
  Clock,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface ProductionSMSSetupProps {
  onClose?: () => void
}

export function ProductionSMSSetup({ onClose }: ProductionSMSSetupProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName)
      toast.success(`Copied ${fieldName}!`)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  const markStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex])
      toast.success('Step completed! 🎉')
    }
    if (stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1)
    }
  }

  const steps = [
    {
      title: 'Create Twilio Account',
      duration: '5 minutes',
      icon: Phone,
      color: 'blue',
      items: [
        'Visit twilio.com/try-twilio',
        'Sign up with your email',
        'Verify your email address',
        'Verify your phone number',
        'Claim $15 free trial credit'
      ],
      action: {
        label: 'Open Twilio Signup',
        url: 'https://www.twilio.com/try-twilio',
        external: true
      }
    },
    {
      title: 'Get Twilio Credentials',
      duration: '2 minutes',
      icon: Shield,
      color: 'purple',
      items: [
        'Login to Twilio Console',
        'Find Account SID (starts with "AC")',
        'Click to reveal Auth Token',
        'Copy both values for Step 3'
      ],
      action: {
        label: 'Open Twilio Console',
        url: 'https://console.twilio.com',
        external: true
      },
      credentials: true
    },
    {
      title: 'Get Phone Number',
      duration: '1 minute',
      icon: MessageCircle,
      color: 'green',
      items: [
        'In Twilio Console → Phone Numbers',
        'Click "Buy a number"',
        'Select country & check "SMS" capability',
        'Choose any available number',
        'Buy number (uses free trial credit)',
        'Copy your Twilio number (with +)'
      ],
      action: {
        label: 'Buy Twilio Number',
        url: 'https://console.twilio.com/us1/develop/phone-numbers/manage/search',
        external: true
      }
    },
    {
      title: 'Configure Supabase',
      duration: '3 minutes',
      icon: Rocket,
      color: 'orange',
      items: [
        'Open Supabase Dashboard',
        'Go to Authentication → Providers',
        'Enable "Phone" provider',
        'Select "Twilio" from dropdown',
        'Paste Account SID, Auth Token, Phone Number',
        'Click Save & wait 1-2 minutes'
      ],
      action: {
        label: 'Open Supabase Dashboard',
        url: 'https://app.supabase.com/project/fjkuvwebluihzsoayxqj/auth/providers',
        external: true
      },
      projectId: 'fjkuvwebluihzsoayxqj'
    },
    {
      title: 'Test Real SMS',
      duration: '2 minutes',
      icon: CheckCircle2,
      color: 'emerald',
      items: [
        'Have your mobile phone ready',
        'For trial: Verify your number in Twilio first',
        'In RakshaNet app, click Sign Up',
        'Select Phone authentication',
        'Enter your number (E.164 format)',
        'Check phone for real SMS within 30 seconds!',
        'Enter OTP code to verify'
      ],
      verification: true
    }
  ]

  const currentStepData = steps[currentStep]
  const StepIcon = currentStepData.icon

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl bg-white shadow-2xl my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Rocket className="w-8 h-8" />
              <div>
                <h2 className="text-2xl">Enable Real SMS Delivery</h2>
                <p className="text-blue-100 text-sm">Configure Twilio for Production</p>
              </div>
            </div>
            {onClose && (
              <Button
                onClick={onClose}
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                ✕
              </Button>
            )}
          </div>
          
          {/* Progress */}
          <div className="flex gap-2">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex-1 h-2 rounded-full transition-all ${
                  completedSteps.includes(index) 
                    ? 'bg-green-400' 
                    : index === currentStep 
                    ? 'bg-white' 
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <div className="mt-2 text-sm text-blue-100">
            Step {currentStep + 1} of {steps.length} • {completedSteps.length} completed
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step Navigation */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  index === currentStep
                    ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500'
                    : completedSteps.includes(index)
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {completedSteps.includes(index) ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                <span className="text-sm">{index + 1}. {step.title}</span>
              </button>
            ))}
          </div>

          {/* Current Step Details */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-3 bg-${currentStepData.color}-100 rounded-lg`}>
                <StepIcon className={`w-8 h-8 text-${currentStepData.color}-600`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl">
                    Step {currentStep + 1}: {currentStepData.title}
                  </h3>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {currentStepData.duration}
                  </Badge>
                </div>
                
                <ul className="space-y-2 mb-4">
                  {currentStepData.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className={`mt-1 w-1.5 h-1.5 rounded-full bg-${currentStepData.color}-500 flex-shrink-0`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Project ID Display */}
                {currentStepData.projectId && (
                  <div className="bg-white rounded-lg p-4 mb-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Your Supabase Project ID:</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(currentStepData.projectId!, 'Project ID')}
                        className="h-6"
                      >
                        {copiedField === 'Project ID' ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    <code className="text-blue-600 bg-blue-50 px-3 py-1 rounded">
                      {currentStepData.projectId}
                    </code>
                  </div>
                )}

                {/* Credentials Reminder */}
                {currentStepData.credentials && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-800">
                        <strong>Keep these safe!</strong> You'll need to paste them in Step 4.
                        <div className="mt-2 space-y-1 font-mono text-xs">
                          <div>• Account SID: AC***************************</div>
                          <div>• Auth Token: ********************************</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Verification Tips */}
                {currentStepData.verification && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-green-800">
                        <strong>Success indicators:</strong>
                        <ul className="mt-2 space-y-1 ml-4 list-disc">
                          <li>Real SMS received on your phone</li>
                          <li>No "Development Mode" banner in app</li>
                          <li>OTP verified successfully</li>
                          <li>Logged in without errors</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {currentStepData.action && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        if (currentStepData.action.external) {
                          window.open(currentStepData.action.url, '_blank')
                        }
                      }}
                      className={`flex-1 bg-${currentStepData.color}-600 hover:bg-${currentStepData.color}-700`}
                    >
                      {currentStepData.action.label}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      onClick={() => markStepComplete(currentStep)}
                      variant="outline"
                      className="px-6"
                    >
                      {completedSteps.includes(currentStep) ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                          Done
                        </>
                      ) : (
                        <>
                          Mark Complete
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <h4 className="text-sm text-blue-900">Free Trial</h4>
              </div>
              <p className="text-2xl text-blue-600 mb-1">$15 Credit</p>
              <p className="text-xs text-blue-700">~1,500-2,000 SMS messages</p>
            </Card>

            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <h4 className="text-sm text-purple-900">Total Time</h4>
              </div>
              <p className="text-2xl text-purple-600 mb-1">10-15 min</p>
              <p className="text-xs text-purple-700">One-time setup</p>
            </Card>

            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <h4 className="text-sm text-green-900">After Setup</h4>
              </div>
              <p className="text-2xl text-green-600 mb-1">~$0.01</p>
              <p className="text-xs text-green-700">per SMS message</p>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              variant="outline"
            >
              ← Previous
            </Button>
            
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
            >
              Next →
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Secure SMS authentication powered by Twilio & Supabase</span>
            </div>
            <Button
              variant="link"
              onClick={() => window.open('/PRODUCTION_SMS_SETUP.md', '_blank')}
              className="text-blue-600 h-auto p-0"
            >
              View Full Guide
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
