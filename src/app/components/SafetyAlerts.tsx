import React, { useState, useEffect } from 'react'
import { AlertTriangle, Cloud, Construction, Car, MapPin, ExternalLink, Camera, Lightbulb, Shield, Users, Eye, ArrowLeft, Home } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { getCurrentLocation } from '../utils/location'
import { toast } from 'sonner@2.0.3'

interface SafetyAlert {
  id: number
  type: 'traffic' | 'construction' | 'weather'
  severity: 'high' | 'medium' | 'low'
  title: string
  location: string
  description: string
  mapLink: string
  timestamp: string
}

interface StreetSafety {
  id: number
  streetName: string
  area: string
  safetyRating: number
  features: {
    streetLights: boolean
    cctv: boolean
    policePatrol: boolean
    emergencyCallBox: boolean
    crowdedArea: boolean
    publicTransport: boolean
  }
  lastUpdated: string
  details: string
}

interface SafetyAlertsProps {
  onBack?: () => void
}

export function SafetyAlerts({ onBack }: SafetyAlertsProps = {}) {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([])
  const [streetSafetyData, setStreetSafetyData] = useState<StreetSafety[]>([])
  const [currentLocation, setCurrentLocation] = useState<string>('Detecting location...')
  const [selectedStreet, setSelectedStreet] = useState<StreetSafety | null>(null)
  const [showStreetDialog, setShowStreetDialog] = useState(false)

  useEffect(() => {
    // Get current location using centralized utility
    const initLocation = async () => {
      const location = await getCurrentLocation()
      // In real app, reverse geocode to get location name
      setCurrentLocation('Bangalore, Karnataka')
      loadAlerts(location.lat, location.lng)
      loadStreetSafetyData()
    }
    
    initLocation()
  }, [])

  const loadAlerts = (lat: number, lng: number) => {
    // Mock alerts based on location - Only one of each type
    const mockAlerts: SafetyAlert[] = [
      {
        id: 1,
        type: 'traffic',
        severity: 'high',
        title: 'Traffic Alert',
        location: 'MG Road, Bangalore',
        description: 'Heavy traffic congestion due to road work',
        mapLink: `https://www.google.com/maps/@12.9756,77.6063,15z`,
        timestamp: new Date().toLocaleString('en-IN')
      },
      {
        id: 2,
        type: 'construction',
        severity: 'medium',
        title: 'Construction Alert',
        location: 'Electronic City',
        description: 'Road construction causing delays',
        mapLink: `https://www.google.com/maps/@12.8458,77.6632,15z`,
        timestamp: new Date().toLocaleString('en-IN')
      },
      {
        id: 3,
        type: 'weather',
        severity: 'medium',
        title: 'Weather Alert',
        location: 'Whitefield',
        description: 'Heavy rain affecting visibility',
        mapLink: `https://www.google.com/maps/@12.9698,77.7499,15z`,
        timestamp: new Date().toLocaleString('en-IN')
      }
    ]
    
    setAlerts(mockAlerts)
  }

  const loadStreetSafetyData = () => {
    const mockStreetData: StreetSafety[] = [
      {
        id: 1,
        streetName: 'MG Road',
        area: 'Central Bangalore',
        safetyRating: 9,
        features: {
          streetLights: true,
          cctv: true,
          policePatrol: true,
          emergencyCallBox: true,
          crowdedArea: true,
          publicTransport: true
        },
        lastUpdated: new Date().toLocaleDateString(),
        details: 'Well-lit main road with 24/7 CCTV surveillance, regular police patrol, and emergency call boxes every 500m. High pedestrian traffic during daytime and evening hours.'
      },
      {
        id: 2,
        streetName: 'Koramangala 5th Block',
        area: 'Koramangala',
        safetyRating: 8,
        features: {
          streetLights: true,
          cctv: true,
          policePatrol: true,
          emergencyCallBox: false,
          crowdedArea: true,
          publicTransport: true
        },
        lastUpdated: new Date().toLocaleDateString(),
        details: 'Residential and commercial area with good street lighting and CCTV coverage. Regular police patrol. Well-populated area with good public transport connectivity.'
      },
      {
        id: 3,
        streetName: 'HSR Layout Sector 1',
        area: 'HSR Layout',
        safetyRating: 7,
        features: {
          streetLights: true,
          cctv: false,
          policePatrol: true,
          emergencyCallBox: false,
          crowdedArea: false,
          publicTransport: true
        },
        lastUpdated: new Date().toLocaleDateString(),
        details: 'Residential area with adequate street lighting. Police patrol available but less frequent. Moderate pedestrian traffic. Public transport available on main roads.'
      },
      {
        id: 4,
        streetName: 'Whitefield Main Road',
        area: 'Whitefield',
        safetyRating: 8,
        features: {
          streetLights: true,
          cctv: true,
          policePatrol: true,
          emergencyCallBox: true,
          crowdedArea: true,
          publicTransport: true
        },
        lastUpdated: new Date().toLocaleDateString(),
        details: 'Major tech corridor with excellent lighting and CCTV coverage. High security presence due to IT parks. Emergency call boxes installed. Heavy pedestrian traffic during office hours.'
      },
      {
        id: 5,
        streetName: 'Indiranagar 100 Feet Road',
        area: 'Indiranagar',
        safetyRating: 9,
        features: {
          streetLights: true,
          cctv: true,
          policePatrol: true,
          emergencyCallBox: true,
          crowdedArea: true,
          publicTransport: true
        },
        lastUpdated: new Date().toLocaleDateString(),
        details: 'Popular commercial street with excellent safety infrastructure. 24/7 CCTV monitoring, well-lit, and constant police presence. High footfall throughout the day.'
      }
    ]
    
    setStreetSafetyData(mockStreetData)
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'traffic':
        return <Car className="w-5 h-5" />
      case 'construction':
        return <Construction className="w-5 h-5" />
      case 'weather':
        return <Cloud className="w-5 h-5" />
      default:
        return <AlertTriangle className="w-5 h-5" />
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          badge: 'bg-red-600',
          icon: 'text-red-600'
        }
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          badge: 'bg-yellow-500',
          icon: 'text-yellow-600'
        }
      case 'low':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          badge: 'bg-blue-600',
          icon: 'text-blue-600'
        }
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          badge: 'bg-gray-600',
          icon: 'text-gray-600'
        }
    }
  }

  const openInGoogleMaps = (alert: SafetyAlert) => {
    let mapsUrl = ''
    const location = encodeURIComponent(alert.location)
    
    if (alert.type === 'traffic') {
      // Open Google Maps with traffic layer enabled (shows red lines for heavy traffic)
      mapsUrl = `https://www.google.com/maps/search/${location}/@12.9716,77.5946,13z/data=!5m1!1e1`
      toast.info('🚗 Opening Google Maps with traffic layer (red lines show congestion)')
    } else if (alert.type === 'construction') {
      // Open Google Maps with construction area marked (yellow markers)
      mapsUrl = `https://www.google.com/maps/search/road+construction+${location}/@12.9716,77.5946,13z`
      toast.info('🚧 Opening Google Maps with construction markers (yellow indicates work zones)')
    } else if (alert.type === 'weather') {
      // Open Google Maps with weather layer overlay
      mapsUrl = `https://www.google.com/maps/@12.9716,77.5946,11z/data=!5m1!1e4`
      toast.info('🌧️ Opening Google Maps with weather overlay (showing rain and wind conditions)')
    } else {
      mapsUrl = alert.mapLink
    }
    
    window.open(mapsUrl, '_blank')
  }

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'traffic':
        return 'Traffic Alert'
      case 'construction':
        return 'Construction Alert'
      case 'weather':
        return 'Weather Alert'
      default:
        return 'Alert'
    }
  }

  const getSafetyRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600'
    if (rating >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSafetyRatingBg = (rating: number) => {
    if (rating >= 8) return 'bg-green-50 border-green-200'
    if (rating >= 6) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Back to Home Button */}
      {onBack && (
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 border-orange-600 text-orange-600 hover:bg-orange-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      )}

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          <h2 className="text-orange-600">Safety Alerts & Street Safety Information</h2>
        </div>
        <p className="text-sm text-gray-600">
          Real-time alerts and street-level safety information for your area
        </p>
      </div>

      {/* Current Location */}
      <Alert className="bg-blue-50 border-blue-200">
        <MapPin className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-800">
          <strong>Current Location:</strong> {currentLocation}
        </AlertDescription>
      </Alert>

      {/* Real-time Alerts */}
      <div className="space-y-4">
        <h3>Active Alerts in Your Area</h3>
        
        {alerts.map((alert) => {
          const colors = getAlertColor(alert.severity)
          return (
            <Card
              key={alert.id}
              className={`p-5 ${colors.bg} ${colors.border} border-2 hover:shadow-lg transition-all`}
            >
              <div className="space-y-3">
                {/* Alert Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 ${colors.badge} rounded-full flex items-center justify-center flex-shrink-0`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={colors.text}>{alert.title}</p>
                        <Badge className={`${colors.badge} text-white text-xs`}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-800 mb-1">{alert.location}</p>
                      <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                      <p className="text-xs text-gray-500">{alert.timestamp}</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2 border-t border-gray-300">
                  <p className="text-xs text-blue-600 mb-2">
                    {alert.type === 'traffic' && '🔴 Click to view in Google Maps with red marking'}
                    {alert.type === 'construction' && '🟡 Click to view in Google Maps with yellow marking'}
                    {alert.type === 'weather' && '🔵 Click to view in Google Maps with blue marking'}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`${colors.text} hover:${colors.bg}`}
                    onClick={() => openInGoogleMaps(alert)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {alert.type === 'traffic' && 'View Traffic Layer (Red Lines)'}
                    {alert.type === 'construction' && 'View Construction Zones (Yellow)'}
                    {alert.type === 'weather' && 'View Weather Conditions (Blue)'}
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Street Safety Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3>Street Safety Information</h3>
        </div>
        <p className="text-sm text-gray-600">
          Detailed safety information for streets in your area, including lighting, CCTV, and other safety measures
        </p>

        <div className="space-y-3">
          {streetSafetyData.map((street) => (
            <Card
              key={street.id}
              className={`p-5 border-2 hover:shadow-lg transition-all cursor-pointer ${getSafetyRatingBg(street.safetyRating)}`}
              onClick={() => {
                setSelectedStreet(street)
                setShowStreetDialog(true)
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-gray-900">{street.streetName}</h4>
                    <Badge className={`${getSafetyRatingColor(street.safetyRating)}`} variant="outline">
                      Safety Rating: {street.safetyRating}/10
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{street.area}</p>
                  <p className="text-xs text-gray-500">Last updated: {street.lastUpdated}</p>
                </div>
              </div>

              {/* Safety Features Grid */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                <div className={`flex flex-col items-center p-2 rounded-lg ${street.features.streetLights ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Lightbulb className={`w-4 h-4 mb-1 ${street.features.streetLights ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="text-xs text-center">{street.features.streetLights ? 'Well-lit' : 'Limited lighting'}</span>
                </div>
                <div className={`flex flex-col items-center p-2 rounded-lg ${street.features.cctv ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Camera className={`w-4 h-4 mb-1 ${street.features.cctv ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="text-xs text-center">{street.features.cctv ? 'CCTV' : 'No CCTV'}</span>
                </div>
                <div className={`flex flex-col items-center p-2 rounded-lg ${street.features.policePatrol ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Shield className={`w-4 h-4 mb-1 ${street.features.policePatrol ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="text-xs text-center">{street.features.policePatrol ? 'Patrol' : 'No patrol'}</span>
                </div>
                <div className={`flex flex-col items-center p-2 rounded-lg ${street.features.emergencyCallBox ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <AlertTriangle className={`w-4 h-4 mb-1 ${street.features.emergencyCallBox ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="text-xs text-center">{street.features.emergencyCallBox ? 'Call Box' : 'No call box'}</span>
                </div>
                <div className={`flex flex-col items-center p-2 rounded-lg ${street.features.crowdedArea ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Users className={`w-4 h-4 mb-1 ${street.features.crowdedArea ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="text-xs text-center">{street.features.crowdedArea ? 'Crowded' : 'Isolated'}</span>
                </div>
                <div className={`flex flex-col items-center p-2 rounded-lg ${street.features.publicTransport ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Car className={`w-4 h-4 mb-1 ${street.features.publicTransport ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="text-xs text-center">{street.features.publicTransport ? 'Transport' : 'No transport'}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-300">
                <Button variant="ghost" size="sm" className="text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  Click for detailed safety information
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Safety Tips */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 p-6">
        <h3 className="mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-purple-600" />
          Safety Tips Based on Alerts
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>Plan alternate routes if there are high-severity traffic or construction alerts on your path</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>Delay travel during severe weather alerts when possible</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>Share your route and ETA with trusted contacts when traveling through alert areas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>Keep emergency numbers handy and stay alert in high-severity alert zones</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>Use public transport or ride-sharing services in adverse conditions</span>
          </li>
        </ul>
      </Card>

      {/* Emergency Contact */}
      <Card className="bg-red-600 text-white p-6">
        <div className="text-center">
          <p className="mb-4">If you're in immediate danger or need emergency assistance</p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => window.open('tel:112', '_self')}
              variant="outline"
              className="bg-white text-red-600 hover:bg-gray-100"
            >
              Call 112 (Emergency)
            </Button>
            <Button
              onClick={() => window.open('tel:100', '_self')}
              variant="outline"
              className="bg-white text-red-600 hover:bg-gray-100"
            >
              Call 100 (Police)
            </Button>
          </div>
        </div>
      </Card>

      {/* Street Safety Details Dialog */}
      <Dialog open={showStreetDialog} onOpenChange={setShowStreetDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              {selectedStreet?.streetName} - Safety Information
            </DialogTitle>
            <DialogDescription>
              Detailed safety measures and infrastructure for this street
            </DialogDescription>
          </DialogHeader>

          {selectedStreet && (
            <div className="space-y-4">
              {/* Overview */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="mb-1">{selectedStreet.streetName}</p>
                  <p className="text-sm text-gray-600">{selectedStreet.area}</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl ${getSafetyRatingColor(selectedStreet.safetyRating)}`}>
                    {selectedStreet.safetyRating}/10
                  </p>
                  <p className="text-xs text-gray-500">Safety Rating</p>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="mb-2 text-blue-900">Street Details</h4>
                <p className="text-sm text-blue-800">{selectedStreet.details}</p>
              </div>

              {/* Safety Features */}
              <div>
                <h4 className="mb-3">Safety Features & Infrastructure</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { key: 'streetLights', label: 'Street Lighting', icon: Lightbulb, desc: 'Well-lit streets with regular maintenance' },
                    { key: 'cctv', label: 'CCTV Surveillance', icon: Camera, desc: '24/7 CCTV monitoring for enhanced security' },
                    { key: 'policePatrol', label: 'Police Patrol', icon: Shield, desc: 'Regular police patrol presence' },
                    { key: 'emergencyCallBox', label: 'Emergency Call Box', icon: AlertTriangle, desc: 'Emergency call boxes for quick assistance' },
                    { key: 'crowdedArea', label: 'Pedestrian Traffic', icon: Users, desc: 'High pedestrian traffic area' },
                    { key: 'publicTransport', label: 'Public Transport', icon: Car, desc: 'Good public transport connectivity' }
                  ].map((feature) => {
                    const Icon = feature.icon
                    const available = selectedStreet.features[feature.key as keyof typeof selectedStreet.features]
                    return (
                      <div key={feature.key} className={`p-3 rounded-lg border-2 ${available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 mt-0.5 ${available ? 'text-green-600' : 'text-gray-400'}`} />
                          <div className="flex-1">
                            <p className={`text-sm mb-1 ${available ? 'text-green-900' : 'text-gray-500'}`}>
                              {feature.label}
                            </p>
                            <p className="text-xs text-gray-600">
                              {available ? feature.desc : 'Not available'}
                            </p>
                          </div>
                          <Badge className={available ? 'bg-green-600' : 'bg-gray-400'}>
                            {available ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setShowStreetDialog(false)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button variant="outline" className="flex-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Report Safety Issue
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
