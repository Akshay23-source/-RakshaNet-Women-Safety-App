import React, { useState, useEffect } from 'react'
import { Home, MapPin, Star, Shield, Phone, Navigation, Loader2, AlertCircle } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { getCurrentLocation } from '../utils/location'

interface Accommodation {
  id: number
  name: string
  type: string
  address: string
  distance: number
  rating: number
  reviews: number
  price: number
  verified: boolean
  features: string[]
  phone: string
  emergencyContact: boolean
  femaleStaff: boolean
}

export function SafeStays() {
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt')
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const requestLocation = async () => {
    setLoading(true)
    
    try {
      const location = await getCurrentLocation()
      setCurrentLocation({
        lat: location.lat,
        lng: location.lng
      })
      setLocationPermission('granted')
      loadNearbyAccommodations(location.lat, location.lng)
    } catch (error) {
      console.error('Location error:', error)
      setLocationPermission('denied')
    } finally {
      setLoading(false)
    }
  }

  const loadNearbyAccommodations = (lat: number, lng: number) => {
    // Mock accommodations based on location
    const mockAccommodations: Accommodation[] = [
      {
        id: 1,
        name: 'SafeStay Women Hostel',
        type: 'Women-only Hostel',
        address: 'Indiranagar, Bangalore',
        distance: 0.8,
        rating: 4.8,
        reviews: 234,
        price: 800,
        verified: true,
        features: ['24/7 Security', 'CCTV', 'Female Staff', 'Emergency Alarm'],
        phone: '+91-9876543210',
        emergencyContact: true,
        femaleStaff: true
      },
      {
        id: 2,
        name: 'Guardian Women PG',
        type: 'Paying Guest',
        address: 'Koramangala, Bangalore',
        distance: 1.2,
        rating: 4.7,
        reviews: 189,
        price: 1200,
        verified: true,
        features: ['Biometric Access', 'Security Guard', 'CCTV', 'Panic Button'],
        phone: '+91-9876543211',
        emergencyContact: true,
        femaleStaff: true
      },
      {
        id: 3,
        name: 'WomenFirst Accommodation',
        type: 'Service Apartment',
        address: 'Whitefield, Bangalore',
        distance: 2.5,
        rating: 4.9,
        reviews: 312,
        price: 2500,
        verified: true,
        features: ['Smart Locks', 'Video Doorbell', 'Security Personnel', 'Medical Alert'],
        phone: '+91-9876543212',
        emergencyContact: true,
        femaleStaff: true
      },
      {
        id: 4,
        name: 'Secure Haven Hostel',
        type: 'Women-only Hostel',
        address: 'HSR Layout, Bangalore',
        distance: 1.8,
        rating: 4.6,
        reviews: 156,
        price: 900,
        verified: true,
        features: ['24/7 Warden', 'Fire Safety', 'Medical Room', 'Emergency Contact'],
        phone: '+91-9876543213',
        emergencyContact: true,
        femaleStaff: true
      },
      {
        id: 5,
        name: 'SheSafe Residency',
        type: 'Paying Guest',
        address: 'BTM Layout, Bangalore',
        distance: 3.1,
        rating: 4.5,
        reviews: 98,
        price: 1000,
        verified: true,
        features: ['Secure Parking', 'Guest Verification', 'CCTV', 'Night Security'],
        phone: '+91-9876543214',
        emergencyContact: true,
        femaleStaff: true
      }
    ]
    
    setAccommodations(mockAccommodations)
  }

  const filteredAccommodations = accommodations.filter(acc =>
    acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openInMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank')
  }

  if (locationPermission === 'prompt') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Home className="w-10 h-10 text-red-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-red-600">Verified Safe Accommodation</h2>
              <p className="text-gray-600">
                We need your location to find verified safe stays near you. Your location will only be used to show nearby accommodations.
              </p>
            </div>

            <Alert className="text-left bg-blue-50 border-blue-200">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-800">
                <strong>Privacy Protected:</strong> Your location is not stored or shared. It's only used to find safe accommodations near you.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button
                onClick={requestLocation}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 mr-2" />
                    Allow Location Access
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500">
                By allowing location access, you agree to help us find the best safe accommodations near you
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (locationPermission === 'denied') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-orange-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-orange-600">Location Access Denied</h2>
              <p className="text-gray-600">
                We need your location permission to show you nearby safe accommodations. Please enable location access in your browser settings and try again.
              </p>
            </div>

            <Button
              onClick={requestLocation}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Home className="w-6 h-6 text-red-600" />
          <h2 className="text-red-600">Verified Safe Accommodation</h2>
        </div>

        {currentLocation && (
          <Alert className="bg-green-50 border-green-200">
            <MapPin className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-800">
              <strong>Location Detected:</strong> Showing verified safe stays near your current location
            </AlertDescription>
          </Alert>
        )}

        <Input
          placeholder="Search by name, location, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Accommodations List */}
      <div className="space-y-4">
        <h3>Nearby Safety Locations</h3>
        {filteredAccommodations.map((acc) => (
          <Card key={acc.id} className="p-5 hover:shadow-lg transition-shadow bg-white border border-gray-200">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                acc.type.includes('Hostel') ? 'bg-green-600' : 
                acc.type.includes('Paying Guest') ? 'bg-blue-600' : 
                'bg-purple-600'
              }`}>
                <Home className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title and Badges */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <h4 className="mb-1">{acc.name}</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      {acc.verified && (
                        <Badge className="bg-green-600 text-white text-xs px-2 py-0.5">
                          Verified
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        24x7
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Address and Distance */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{acc.address}</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600">
                    <Navigation className="w-4 h-4 flex-shrink-0" />
                    <span>{acc.distance} km</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.open(`tel:${acc.phone}`, '_self')}
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    <Phone className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => openInMaps(acc.address)}
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    <Navigation className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => openInMaps(acc.address)}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-8"
                  >
                    View on Map
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredAccommodations.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No accommodations found matching your search</p>
        </Card>
      )}

      {/* Safety Tips */}
      <Card className="bg-orange-50 border-orange-200 p-6">
        <h3 className="mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-orange-600" />
          Safety Tips for Accommodation
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-orange-600">•</span>
            <span>Always verify the accommodation before booking</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600">•</span>
            <span>Check reviews and ratings from other women travelers</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600">•</span>
            <span>Ensure the place has 24/7 security and CCTV surveillance</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600">•</span>
            <span>Share accommodation details with family and friends</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600">•</span>
            <span>Keep emergency numbers saved and easily accessible</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
