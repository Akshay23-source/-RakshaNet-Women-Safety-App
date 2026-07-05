import React, { useState, useEffect } from 'react'
import { Shield, Radio, MapPin, MessageCircle, Phone, BookOpen, WifiOff, FileText, Navigation, Settings } from 'lucide-react'
import { Progress } from './ui/progress'
import { Button } from './ui/button'
import welcomeImage from 'figma:asset/7cf95d2e33596dac7d88f62aa661c6bac386f9a3.png'

interface WelcomeScreenProps {
  onComplete: () => void
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [showTour, setShowTour] = useState(false)
  
  const tourSteps = [
    { 
      icon: Phone, 
      label: 'Emergency Contacts', 
      color: 'text-red-500',
      description: 'Add trusted contacts who will be alerted during emergencies'
    },
    { 
      icon: BookOpen, 
      label: 'Safety Resources', 
      color: 'text-blue-500',
      description: 'Access helplines, safe locations, and emergency services'
    },
    { 
      icon: MessageCircle, 
      label: 'AI Assistant', 
      color: 'text-purple-500',
      description: 'Get instant safety guidance and support 24/7'
    },
    { 
      icon: WifiOff, 
      label: 'Offline Manager', 
      color: 'text-orange-500',
      description: 'Core safety features work even without internet'
    },
    { 
      icon: FileText, 
      label: 'Reports & Evidence', 
      color: 'text-green-500',
      description: 'Document incidents with photos, videos, and audio'
    },
    { 
      icon: BookOpen, 
      label: 'Learning Hub', 
      color: 'text-indigo-500',
      description: 'Self-defense courses, legal rights, and first aid training'
    },
    { 
      icon: Navigation, 
      label: 'Safety Navigation', 
      color: 'text-cyan-500',
      description: 'Plan safe routes and find nearby helpers'
    },
    { 
      icon: Settings, 
      label: 'Admin Dashboard', 
      color: 'text-gray-700',
      description: 'Monitor SOS alerts, active users, and response times'
    }
  ]
  
  useEffect(() => {
    if (!showTour) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setShowTour(true), 300)
            return 100
          }
          return prev + 2
        })
      }, 50)
      
      return () => clearInterval(interval)
    }
  }, [showTour])
  
  useEffect(() => {
    if (showTour && currentStep < tourSteps.length) {
      const stepTimer = setTimeout(() => {
        if (currentStep < tourSteps.length - 1) {
          setCurrentStep(prev => prev + 1)
        }
      }, 2500)
      
      return () => clearTimeout(stepTimer)
    }
  }, [showTour, currentStep, tourSteps.length])
  
  const handleSkipTour = () => {
    onComplete()
  }
  
  const handleNextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete()
    }
  }
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }
  
  if (showTour) {
    const currentTourStep = tourSteps[currentStep]
    const Icon = currentTourStep.icon
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-2">
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {tourSteps.length}
            </div>
            <Progress value={((currentStep + 1) / tourSteps.length) * 100} className="h-2" />
          </div>
          
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-red-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
                <Icon className={`w-14 h-14 ${currentTourStep.color}`} />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 px-6">
            <h2 className="text-3xl text-gray-900">{currentTourStep.label}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {currentTourStep.description}
            </p>
          </div>
          
          <div className="flex gap-3 justify-center px-6 pt-4">
            <Button
              variant="outline"
              onClick={handleSkipTour}
              className="flex-1"
            >
              Skip Tour
            </Button>
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevStep}
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNextStep}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {currentStep < tourSteps.length - 1 ? 'Next' : 'Get Started'}
            </Button>
          </div>
          
          <div className="flex gap-2 justify-center pt-4">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'bg-red-600 w-6' 
                    : index < currentStep 
                    ? 'bg-blue-400' 
                    : 'bg-gray-300'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-md w-full text-center space-y-4 max-h-screen overflow-y-auto py-4">
        <div className="relative">
          <img 
            src={welcomeImage} 
            alt="Welcome illustration" 
            className="w-full max-w-[280px] mx-auto rounded-3xl"
          />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl text-red-600">Welcome to<br />RakshaNet</h1>
          <p className="text-lg text-red-500">Your safety in every step</p>
        </div>
        
        <div className="space-y-3 px-6">
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-gray-600">Loading safety features... {progress}%</p>
        </div>
        
        <div className="space-y-2 px-6">
          {tourSteps.slice(0, 3).map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-white shadow-sm"
              >
                <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-4 h-4 ${feature.color}`} />
                </div>
                <span className="text-sm text-gray-700">
                  {feature.label}
                </span>
              </div>
            )
          })}
          <div className="text-xs text-gray-500 pt-1">
            + {tourSteps.length - 3} more features
          </div>
        </div>
      </div>
    </div>
  )
}