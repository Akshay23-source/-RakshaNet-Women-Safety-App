import React, { useState } from 'react'
import { Car, MapPin, Phone, MessageCircle, AlertTriangle, Shield, Navigation, Clock, Loader2 } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { getCurrentLocation } from '../utils/location'
import { createTrackingSession, generateLiveTrackingLink } from '../utils/supabase/location-tracking'
import { startEmergencyLiveTracking } from '../utils/live-location-tracker'

const rideServices = [
  {
    name: 'Uber',
    logo: '🚗',
    color: 'black',
    bgColor: 'bg-black',
    hoverColor: 'hover:bg-gray-800',
    url: 'https://www.uber.com',
    description: 'Book Uber rides instantly'
  },
  {
    name: 'Ola',
    logo: '🚖',
    color: 'green',
    bgColor: 'bg-green-600',
    hoverColor: 'hover:bg-green-700',
    url: 'https://www.olacabs.com',
    description: 'Quick Ola cab booking'
  },
  {
    name: 'Rapido',
    logo: '🏍️',
    color: 'yellow',
    bgColor: 'bg-yellow-500',
    hoverColor: 'hover:bg-yellow-600',
    url: 'https://www.rapido.bike',
    description: 'Fast bike taxi service'
  }
]

const safetyGuidelines = [
  {
    title: 'Before Booking',
    points: [
      'Always check driver ratings and reviews',
      'Verify vehicle number matches the app',
      'Share trip details with emergency contacts',
      'Enable location sharing',
      'Check estimated arrival time'
    ]
  },
  {
    title: 'During the Ride',
    points: [
      'Sit in the back seat',
      'Keep doors locked',
      'Follow your route on GPS',
      'Stay alert and avoid sleeping',
      'Have emergency contacts ready',
      'Trust your instincts - ask to stop if uncomfortable'
    ]
  },
  {
    title: 'Emergency Situations',
    points: [
      'Call 112 immediately if threatened',
      'Use in-app emergency button',
      'Share live location with trusted contacts',
      'Note down vehicle details',
      'Ask driver to stop in crowded area',
      'Exit vehicle if feeling unsafe'
    ]
  }
]

export function EmergencyRides() {
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropLocation, setDropLocation] = useState('')
  const [emergencyContact, setEmergencyContact] = useState('')
  const [distance, setDistance] = useState<number | null>(null)
  const [calculating, setCalculating] = useState(false)
  const [locationSent, setLocationSent] = useState(false)
  const [sendingLocation, setSendingLocation] = useState(false)
  const [showLocationDialog, setShowLocationDialog] = useState(false)
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number, address?: string} | null>(null)
  const [liveTrackingLink, setLiveTrackingLink] = useState<string | null>(null)

  const requestLocationPermission = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser')
        resolve(false)
        return
      }

      // Request permission by trying to get current position
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationPermissionGranted(true)
          resolve(true)
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            alert('Location permission denied. Please enable location access in your browser settings to use this feature.')
          } else {
            alert('Unable to get your location. Please check your GPS settings.')
          }
          resolve(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  const geocodeLocation = async (locationName: string): Promise<{lat: number, lng: number, displayName: string} | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`,
        {
          headers: {
            'User-Agent': 'RakshaNet-Safety-App'
          }
        }
      )

      if (!response.ok) return null

      const data = await response.json()
      if (data.length === 0) return null

      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      return null
    }
  }

  const calculateHaversineDistance = (
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const calculateDistance = async () => {
    if (!pickupLocation || !dropLocation) {
      alert('Please enter both pickup and drop locations')
      return
    }

    setCalculating(true)
    
    try {
      // Request location permission first
      const permissionGranted = await requestLocationPermission()
      
      if (!permissionGranted) {
        setCalculating(false)
        return
      }

      // Get user's current location
      const location = await getCurrentLocation()
      setCurrentLocation(location)
      
      console.log('✅ Location permission granted')
      console.log('📍 Current location:', location)

      // Show location dialog
      setShowLocationDialog(true)
      
      // Geocode both locations to get coordinates
      console.log('🔍 Geocoding pickup location:', pickupLocation)
      const pickupCoords = await geocodeLocation(pickupLocation)
      
      if (!pickupCoords) {
        alert(`Unable to find pickup location: "${pickupLocation}". Please enter a more specific address.`)
        setCalculating(false)
        setShowLocationDialog(false)
        return
      }

      console.log('🔍 Geocoding drop location:', dropLocation)
      const dropCoords = await geocodeLocation(dropLocation)
      
      if (!dropCoords) {
        alert(`Unable to find drop location: "${dropLocation}". Please enter a more specific address.`)
        setCalculating(false)
        setShowLocationDialog(false)
        return
      }

      console.log('✅ Pickup coordinates:', pickupCoords)
      console.log('✅ Drop coordinates:', dropCoords)
      
      // Calculate actual distance using Haversine formula
      const calculatedDistance = calculateHaversineDistance(
        pickupCoords.lat,
        pickupCoords.lng,
        dropCoords.lat,
        dropCoords.lng
      )
      
      setDistance(parseFloat(calculatedDistance.toFixed(2)))
      
      console.log(`✅ Distance calculated: ${calculatedDistance.toFixed(2)} km`)
      console.log(`📍 From: ${pickupCoords.displayName}`)
      console.log(`📍 To: ${dropCoords.displayName}`)
      console.log(`📍 Using live location: ${location.lat}, ${location.lng}`)
      
    } catch (error) {
      console.error('Error calculating distance:', error)
      alert('Unable to calculate distance. Please try again.')
    } finally {
      setCalculating(false)
      setTimeout(() => setShowLocationDialog(false), 3000)
    }
  }

  const estimateFare = (service: string, distance: number) => {
    // Mock fare calculation
    const baseRates = {
      'Uber': { base: 50, perKm: 12 },
      'Ola': { base: 45, perKm: 11 },
      'Rapido': { base: 25, perKm: 8 }
    }
    
    const rate = baseRates[service as keyof typeof baseRates] || { base: 50, perKm: 10 }
    return Math.round(rate.base + (distance * rate.perKm))
  }

  const handleRideServiceClick = (url: string) => {
    window.open(url, '_blank')
  }

  const sendLocationToContact = async () => {
    if (!emergencyContact) {
      alert('Please enter an emergency contact number first')
      return
    }

    setSendingLocation(true)
    setShowLocationDialog(true)

    try {
      // Request location permission first
      const permissionGranted = await requestLocationPermission()
      
      if (!permissionGranted) {
        setSendingLocation(false)
        setShowLocationDialog(false)
        return
      }

      // Get current location
      const location = await getCurrentLocation()
      setCurrentLocation(location)
      
      console.log('✅ Location permission granted for SMS sharing')
      console.log('📍 Current location:', location)

      // Generate unique SOS ID for this location share
      const sosId = `ride_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const userId = 'emergency_rider' // In production, use actual user ID from auth
      const userName = 'Emergency Rider' // In production, use actual user name

      // Create live tracking session in Supabase
      const session = await createTrackingSession(sosId, userId, userName)
      
      if (session) {
        console.log('✅ Live tracking session created:', session.id)
        
        // Generate live tracking link
        const trackingLink = generateLiveTrackingLink(sosId, 'your-project-id')
        setLiveTrackingLink(trackingLink)
        
        console.log('🔗 Live tracking link:', trackingLink)
        
        // Start live location tracking
        try {
          await startEmergencyLiveTracking(
            sosId,
            userId,
            [],
            userName,
            (update) => {
              console.log('📍 Live location update:', update)
            },
            (error) => {
              console.error('❌ Live tracking error:', error)
            }
          )
          console.log('✅ Live location tracking started')
        } catch (trackingError) {
          console.error('⚠️ Could not start live tracking:', trackingError)
          // Continue with SMS even if live tracking fails
        }

        // Prepare SMS message with live tracking link
        const message = encodeURIComponent(
          `🚨 EMERGENCY LOCATION SHARE\n\n` +
          `I need a ride urgently!\n\n` +
          `📍 Current Location:\n${location.address || `${location.lat}, ${location.lng}`}\n\n` +
          `🗺️ Live Tracking (Real-time):\n${trackingLink}\n\n` +
          `📌 Static Map:\nhttps://www.google.com/maps?q=${location.lat},${location.lng}\n\n` +
          `⏰ ${new Date().toLocaleString()}\n\n` +
          `- Sent from RakshaNet`
        )
        
        const cleanNumber = emergencyContact.replace(/\D/g, '')
        
        // Send SMS with location
        window.open(`sms:${cleanNumber}?body=${message}`, '_self')
        setLocationSent(true)
        
        // Show confirmation
        setTimeout(() => {
          alert(
            `✅ Live location sharing initiated!\n\n` +
            `Contact: ${emergencyContact}\n` +
            `Live Tracking Link: ${trackingLink}\n\n` +
            `Your location will update every 20 seconds.`
          )
        }, 500)
      } else {
        // Fallback to static location if session creation fails
        const staticLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`
        const message = encodeURIComponent(
          `🚨 EMERGENCY LOCATION\n\n` +
          `I need a ride urgently!\n\n` +
          `📍 Location: ${location.address || `${location.lat}, ${location.lng}`}\n\n` +
          `🗺️ Map: ${staticLink}\n\n` +
          `⏰ ${new Date().toLocaleString()}`
        )
        
        const cleanNumber = emergencyContact.replace(/\D/g, '')
        window.open(`sms:${cleanNumber}?body=${message}`, '_self')
        setLocationSent(true)
        
        setTimeout(() => {
          alert(`Location sent to ${emergencyContact}!\nLocation: ${staticLink}`)
        }, 500)
      }
    } catch (error) {
      console.error('Error sending location:', error)
      alert('Failed to send location. Please try again.')
    } finally {
      setSendingLocation(false)
      setTimeout(() => setShowLocationDialog(false), 2000)
    }
  }

  const handleSMSClick = () => {
    if (!emergencyContact) {
      alert('Please enter an emergency contact number first')
      return
    }
    const message = encodeURIComponent('Emergency! I need a ride urgently. Please help.')
    window.open(`sms:${emergencyContact}?body=${message}`, '_self')
  }

  const handleWhatsAppClick = () => {
    if (!emergencyContact) {
      alert('Please enter an emergency contact number first')
      return
    }
    const cleanNumber = emergencyContact.replace(/\D/g, '')
    const message = encodeURIComponent('Emergency! I need a ride urgently. Please help.')
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank')
  }

  const handleCallClick = () => {
    if (!emergencyContact) {
      alert('Please enter an emergency contact number first')
      return
    }
    window.open(`tel:${emergencyContact}`, '_self')
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Location Permission Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Accessing Your Location
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span>Getting your current location...</span>
              </div>
              {currentLocation && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
                  <p className="flex items-center gap-2 text-green-800">
                    <MapPin className="w-4 h-4" />
                    <strong>Location acquired!</strong>
                  </p>
                  <p className="text-sm text-green-700">
                    {currentLocation.address || `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`}
                  </p>
                  {liveTrackingLink && (
                    <p className="text-xs text-green-600 break-all">
                      Live tracking: {liveTrackingLink}
                    </p>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Car className="w-6 h-6 text-red-600" />
          <h2 className="text-red-600">Emergency Ride Booking</h2>
        </div>
        <p className="text-sm text-gray-600">
          Book emergency rides from Rapido, Uber, and Ola for emergency situations
        </p>
      </div>

      {/* Priority Alert */}
      <Alert className="border-orange-500 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-sm text-orange-800">
          <strong>Emergency Mode Active:</strong> Priority booking with safety features enabled. 
          Your ride will be tracked and shared with emergency contacts automatically.
        </AlertDescription>
      </Alert>

      {/* Emergency Ride Booking Section */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-red-900">Emergency Ride Booking</h3>
          </div>
          
          <p className="text-sm text-red-800">
            Priority booking with safety features enabled. Your ride will be tracked and shared with emergency contacts.
          </p>

          {/* Location Inputs */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                Pickup Location
              </label>
              <Input
                placeholder="Enter pickup location..."
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-700 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-red-600" />
                Drop Location
              </label>
              <Input
                placeholder="Enter destination..."
                value={dropLocation}
                onChange={(e) => setDropLocation(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            size="lg"
            onClick={calculateDistance}
            disabled={calculating || !pickupLocation || !dropLocation}
          >
            {calculating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Requesting Location Access...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 mr-2" />
                Calculate Distance & Find Rides
              </>
            )}
          </Button>

          {/* Distance and Fare Display */}
          {distance && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-red-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Estimated Distance:</span>
                  <span className="text-red-600">{distance} km</span>
                </div>
                {currentLocation && (
                  <div className="flex items-start gap-2 text-xs text-gray-600 bg-blue-50 p-2 rounded">
                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>Using your live location: {currentLocation.address || `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`}</span>
                  </div>
                )}
                <div className="border-t pt-3 space-y-2">
                  <p className="text-sm mb-2">Estimated Fares:</p>
                  {rideServices.map((service) => (
                    <div key={service.name} className="flex items-center justify-between text-sm">
                      <span>{service.name}:</span>
                      <span className="text-green-600">₹{estimateFare(service.name, distance)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Emergency Actions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3>Quick Emergency Actions</h3>
        </div>

        {/* Ride Services */}
        <div className="grid md:grid-cols-3 gap-4">
          {rideServices.map((service) => (
            <Card
              key={service.name}
              className="cursor-pointer hover:shadow-lg transition-all"
              onClick={() => handleRideServiceClick(service.url)}
            >
              <div className="p-6 text-center space-y-3">
                <div className={`w-16 h-16 ${service.bgColor} rounded-full flex items-center justify-center mx-auto text-3xl`}>
                  {service.logo}
                </div>
                <div>
                  <p className="mb-1">{service.name}</p>
                  <p className="text-xs text-gray-600">{service.description}</p>
                </div>
                <Button
                  className={`w-full ${service.bgColor} ${service.hoverColor} text-white`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRideServiceClick(service.url)
                  }}
                >
                  Book {service.name}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Emergency Ride Safety Guidelines */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-blue-900">Emergency Ride Safety Guidelines</h3>
          </div>

          <p className="text-sm text-blue-800 mb-4">
            Auto-sends SOS to Nearby OLA Shuttle, OTA Taxis and to emergency contacts.
          </p>

          {/* Emergency Contact Input */}
          <div className="bg-white rounded-lg p-4 space-y-3">
            <label className="text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              Emergency Contact Number
            </label>
            <Input
              type="tel"
              placeholder="Enter phone number (e.g., +919876543210)"
              value={emergencyContact}
              onChange={(e) => {
                setEmergencyContact(e.target.value)
                setLocationSent(false)
                setLiveTrackingLink(null)
              }}
              className="bg-white"
            />
            
            {/* Send Location Button */}
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              onClick={sendLocationToContact}
              disabled={!emergencyContact || sendingLocation}
            >
              {sendingLocation ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Requesting Location Access...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 mr-2" />
                  Send My Location via SMS
                </>
              )}
            </Button>

            {locationSent && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
                <p className="text-sm text-green-800 flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  <strong>Live location sharing started!</strong>
                </p>
                <p className="text-xs text-green-700">
                  SMS sent to {emergencyContact} with live tracking link
                </p>
                {liveTrackingLink && (
                  <p className="text-xs text-green-600 break-all">
                    {liveTrackingLink}
                  </p>
                )}
                <p className="text-xs text-green-600">
                  📍 Location updates every 20 seconds
                </p>
              </div>
            )}
            
            {/* Communication Actions */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-2 py-2"
                onClick={handleSMSClick}
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs">SMS</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 border-green-600 text-green-600 hover:bg-green-50 px-2 py-2"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs">WhatsApp</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 border-red-600 text-red-600 hover:bg-red-50 px-2 py-2"
                onClick={handleCallClick}
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs">Call</span>
              </Button>
            </div>
          </div>

          {/* Auto-send note */}
          <Alert className="bg-green-50 border-green-300">
            <AlertTriangle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-800">
              Auto-sends SOS to current location with trusted contacts using emergency taxi booking.
            </AlertDescription>
          </Alert>
        </div>
      </Card>

      {/* Safety Guidelines Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h3>Safety Guidelines</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {safetyGuidelines.map((guideline, index) => (
            <Card key={index} className="border-orange-200 bg-orange-50">
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-600">{index + 1}</Badge>
                  <h4 className="text-sm">{guideline.title}</h4>
                </div>
                <ul className="space-y-2">
                  {guideline.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-orange-600 flex-shrink-0">•</span>
                      <span className="flex-1">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Emergency Features */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="p-6 space-y-4">
          <h3 className="text-purple-900">Emergency Features Enabled</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-white rounded-lg p-4">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm mb-1">Live Location Tracking</p>
                <p className="text-xs text-gray-600">Your ride is tracked in real-time and shared with emergency contacts</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 bg-white rounded-lg p-4">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm mb-1">Safety Verification</p>
                <p className="text-xs text-gray-600">Driver and vehicle details verified before ride starts</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 bg-white rounded-lg p-4">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm mb-1">SOS Alert System</p>
                <p className="text-xs text-gray-600">One-tap emergency alert to contacts and authorities</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 bg-white rounded-lg p-4">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm mb-1">Expected Arrival Alerts</p>
                <p className="text-xs text-gray-600">Contacts notified if you don't reach destination on time</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Emergency Numbers */}
      <Card className="bg-red-600 text-white">
        <div className="p-6">
          <h3 className="mb-4 text-white">Emergency Contact Numbers</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Police', number: '100' },
              { name: 'Emergency', number: '112' },
              { name: 'Women Helpline', number: '1091' },
              { name: 'Ambulance', number: '108' }
            ].map((contact) => (
              <a
                key={contact.number}
                href={`tel:${contact.number}`}
                className="text-center p-4 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors"
              >
                <p className="text-sm mb-1">{contact.name}</p>
                <p className="text-xl">{contact.number}</p>
              </a>
            ))}
          </div>
        </div>
      </Card>

      {/* Important Note */}
      <Alert className="border-red-500 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-sm text-red-800">
          <strong>Important:</strong> In case of immediate danger, call 112 (Emergency Services) or 100 (Police) directly. 
          The emergency ride feature is to help you reach safety, not a replacement for emergency services.
        </AlertDescription>
      </Alert>
    </div>
  )
}
