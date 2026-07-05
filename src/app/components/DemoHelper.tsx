import React, { useState } from 'react'
import { Info, X, ChevronRight } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

export function DemoHelper() {
  const [isDismissed, setIsDismissed] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  
  const steps = [
    {
      title: "Welcome to RakshaNet",
      description: "Your comprehensive women safety network. Let's take a quick tour!",
      action: "Start Tour"
    },
    {
      title: "Emergency SOS Button",
      description: "Tap the large red button to activate emergency SOS. This will alert your contacts and nearby helpers.",
      action: "Next"
    },
    {
      title: "Add Emergency Contacts",
      description: "Go to Contacts tab and add trusted people who will be notified during emergencies.",
      action: "Next"
    },
    {
      title: "Network Ladder",
      description: "Our multi-layer communication ensures your SOS reaches help through Contact → Mesh → LoRa → Satellite.",
      action: "Next"
    },
    {
      title: "Become a Helper",
      description: "Enable Helper Mode in Quick Settings to assist others nearby during emergencies.",
      action: "Next"
    },
    {
      title: "You're Ready!",
      description: "RakshaNet is active and protecting you. Access AI Assistant, Resources, and more from the navigation.",
      action: "Get Started"
    }
  ]
  
  if (isDismissed) return null
  
  const currentStepData = steps[currentStep]
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsDismissed(true)
    }
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200 shadow-xl">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <Info className="w-5 h-5 text-white" />
              </div>
              <Badge variant="outline" className="text-xs">
                Step {currentStep + 1} of {steps.length}
              </Badge>
            </div>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <h3 className="mb-2">{currentStepData.title}</h3>
          <p className="text-sm text-gray-700 mb-4">
            {currentStepData.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-red-600'
                      : index < currentStep
                      ? 'bg-red-300'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <Button
              size="sm"
              onClick={handleNext}
              className="bg-red-600 hover:bg-red-700"
            >
              {currentStepData.action}
              {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
