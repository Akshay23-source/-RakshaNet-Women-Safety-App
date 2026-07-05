import React from 'react'
import { WifiOff, CheckCircle, XCircle, Radio, MapPin, Phone, AlertTriangle } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { BackButton } from './BackButton'

interface OfflineManagerProps {
  onBack?: () => void
}

export function OfflineManager({ onBack }: OfflineManagerProps = {}) {
  const offlineFeatures = [
    {
      name: 'Emergency SOS',
      available: true,
      icon: AlertTriangle,
      description: 'Trigger SOS even without internet'
    },
    {
      name: 'GPS Location',
      available: true,
      icon: MapPin,
      description: 'GPS works without network connection'
    },
    {
      name: 'Emergency Contacts',
      available: true,
      icon: Phone,
      description: 'Call contacts directly via cellular'
    },
    {
      name: 'Mesh Network',
      available: true,
      icon: Radio,
      description: 'Connect via nearby devices'
    },
    {
      name: 'Evidence Recording',
      available: true,
      icon: AlertTriangle,
      description: 'Record audio/video locally'
    },
    {
      name: 'AI Assistant',
      available: false,
      icon: AlertTriangle,
      description: 'Requires internet connection'
    },
    {
      name: 'Nearby Helpers Map',
      available: false,
      icon: MapPin,
      description: 'Requires internet for real-time data'
    },
    {
      name: 'Smart Watch Sync',
      available: true,
      icon: AlertTriangle,
      description: 'Uses Bluetooth (no internet needed)'
    }
  ]
  
  const availableCount = offlineFeatures.filter(f => f.available).length
  const totalCount = offlineFeatures.length
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {onBack && <BackButton onClick={onBack} />}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <WifiOff className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-blue-900">Offline Mode</h2>
            <p className="text-sm text-blue-700">
              {availableCount} of {totalCount} features work without internet
            </p>
          </div>
          <Badge className="bg-green-100 text-green-700 border-green-300">
            {Math.round((availableCount / totalCount) * 100)}% Available
          </Badge>
        </div>
      </Card>
      
      <div className="grid gap-4">
        <h3>Feature Availability</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {offlineFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.name}
                className={`p-4 ${
                  feature.available 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    feature.available ? 'bg-green-100' : 'bg-gray-200'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      feature.available ? 'text-green-600' : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm">{feature.name}</h4>
                      {feature.available ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
      
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm text-yellow-900 mb-1">Offline Safety Tips</h4>
            <ul className="text-xs text-yellow-800 space-y-1 list-disc list-inside">
              <li>Your location is still tracked via GPS without internet</li>
              <li>SOS can be triggered and will sync when connection is restored</li>
              <li>Emergency calls work on cellular network</li>
              <li>Evidence recordings are saved locally and uploaded later</li>
              <li>Mesh network activates automatically in no-signal areas</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}