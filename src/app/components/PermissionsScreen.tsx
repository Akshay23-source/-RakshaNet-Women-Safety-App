import React, { useState } from 'react'
import { MapPin, Navigation, AlertTriangle, Bell, Check } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import mainImage from 'figma:asset/3e3f7c46789cbccec24b728dfe7beb21c85fbcc0.png'
import { requestLocationPermission } from '../utils/location'

interface PermissionsScreenProps {
  onComplete: () => void
}

export function PermissionsScreen({ onComplete }: PermissionsScreenProps) {
  const [permissions, setPermissions] = useState({
    location: false,
    gpsTracking: false,
    safetyPlaces: false,
    alerts: false
  })
  
  const permissionItems = [
    {
      id: 'location',
      icon: MapPin,
      title: 'Enable Location Services',
      description: 'Access your location for emergency response',
      color: 'bg-purple-500'
    },
    {
      id: 'gpsTracking',
      icon: Navigation,
      title: 'Real-time GPS Tracking',
      description: 'Track your location during emergencies',
      color: 'bg-blue-500'
    },
    {
      id: 'safetyPlaces',
      icon: AlertTriangle,
      title: 'Nearby Safety Places',
      description: 'Find police stations and safe zones',
      color: 'bg-green-500'
    },
    {
      id: 'alerts',
      icon: Bell,
      title: 'Emergency Alerts',
      description: 'Receive and send emergency notifications',
      color: 'bg-red-500'
    }
  ]
  
  const requestPermission = async (id: string) => {
    if (id === 'location') {
      // Try to request location permission using centralized utility
      await requestLocationPermission()
      // Always set to true - app works in demo mode if location is restricted
      setPermissions(prev => ({ ...prev, [id]: true }))
    } else {
      // Other permissions are just UI toggles
      setPermissions(prev => ({ ...prev, [id]: true }))
    }
  }
  
  const allGranted = Object.values(permissions).every(p => p)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center space-y-4">
          <img 
            src={mainImage} 
            alt="Permissions" 
            className="w-64 h-64 mx-auto object-contain"
          />
          <h2 className="text-3xl text-red-600">Permission Required</h2>
          <p className="text-gray-600">Enable these features for complete safety protection</p>
        </div>
        
        <div className="grid gap-4">
          {permissionItems.map((item) => {
            const Icon = item.icon
            const isGranted = permissions[item.id as keyof typeof permissions]
            
            return (
              <Card 
                key={item.id}
                className={`p-4 transition-all ${
                  isGranted 
                    ? 'bg-green-50 border-green-300' 
                    : 'hover:shadow-md cursor-pointer'
                }`}
                onClick={() => !isGranted && requestPermission(item.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center relative`}>
                    <Icon className="w-6 h-6 text-white" />
                    {isGranted && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  {!isGranted && (
                    <Button 
                      size="sm" 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        requestPermission(item.id)
                      }}
                    >
                      Allow
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
        
        <Button
          className="w-full bg-red-600 hover:bg-red-700 h-12"
          onClick={onComplete}
          disabled={!allGranted}
        >
          {allGranted ? 'Continue to Setup' : 'Grant All Permissions to Continue'}
        </Button>
        
        <button
          className="w-full text-sm text-gray-500 hover:text-gray-700"
          onClick={onComplete}
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
