import React, { useState, useEffect } from 'react'
import { MapPin, Search, Route, Navigation, Phone, Building2, AlertTriangle, Users, Hospital, Shield, RefreshCw, ExternalLink, Car, Construction, Cloud, Sparkles, MapPinned, ArrowLeft, Home } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { getCurrentLocation, calculateDistance, requestLocationPermission } from '../utils/location'
import { RoutePlanning } from './RoutePlanning'
import { SafeStays } from './SafeStays'
import { toast } from 'sonner@2.0.3'

interface SafeLocation {
  id: number
  name: string
  type: 'accommodation' | 'police' | 'hospital' | 'helpdesk'
  address: string
  lat: number
  lng: number
  distance: number
  phone: string
  available24x7: boolean
  verified: boolean
}

interface SafetyAlertData {
  id: number
  type: 'traffic' | 'construction' | 'weather'
  severity: 'high' | 'medium'
  title: string
  location: string
  description: string
  mapColor: string
  timestamp: string
}

interface CommunityUpdateData {
  id: number
  type: 'initiative' | 'tip' | 'incident'
  icon: 'refresh' | 'shield' | 'warning'
  title: string
  description: string
  location: string
  source: string
  timestamp: string
  verified: boolean
}

interface SafetyLocationsProps {
  onBack?: () => void
}

export function SafetyLocations({ onBack }: SafetyLocationsProps = {}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('quick-find')
  const [showSafeStays, setShowSafeStays] = useState(false)
  const [showRoutePlanning, setShowRoutePlanning] = useState(false)
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlertData[]>([])
  const [communityUpdates, setCommunityUpdates] = useState<CommunityUpdateData[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [safeLocations, setSafeLocations] = useState<SafeLocation[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [lastLocationUpdate, setLastLocationUpdate] = useState<Date>(new Date())

  // Request location permission and get initial location
  useEffect(() => {
    requestAndGetLocation()
  }, [])

  // Auto-refresh location and nearby safety locations every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (locationPermission === 'granted') {
        updateUserLocation()
        toast.info('📍 Location and nearby safety locations updated')
      }
    }, 300000) // 5 minutes

    return () => clearInterval(interval)
  }, [locationPermission])

  // Auto-refresh community updates every 5 minutes
  useEffect(() => {
    loadSafetyAlerts()
    loadCommunityUpdates()

    const interval = setInterval(() => {
      loadCommunityUpdates()
      setLastUpdate(new Date())
      toast.info('Community updates refreshed')
    }, 300000) // 5 minutes

    return () => clearInterval(interval)
  }, [])

  // Update safe locations when user location changes
  useEffect(() => {
    if (userLocation) {
      updateSafeLocations(userLocation)
    }
  }, [userLocation])

  const requestAndGetLocation = async () => {
    setIsLoadingLocation(true)
    try {
      const hasPermission = await requestLocationPermission()
      
      if (hasPermission) {
        const location = await getCurrentLocation()
        setUserLocation(location)
        setLocationPermission('granted')
        setLastLocationUpdate(new Date())
        toast.success(`📍 Live Location Enabled! 
Latitude: ${location.lat.toFixed(6)}
Longitude: ${location.lng.toFixed(6)}
Auto-refresh: Every 5 minutes`, {
          duration: 4000
        })
        
        // Show accuracy information
        setTimeout(() => {
          toast.info('🎯 High accuracy location tracking active. Your position will update automatically.', {
            duration: 3000
          })
        }, 1000)
      } else {
        setLocationPermission('denied')
        toast.error('Location permission denied. Please enable location in browser settings.')
        // Use default Bangalore location
        setUserLocation({ lat: 12.9716, lng: 77.5946 })
      }
    } catch (error) {
      console.error('Location error:', error)
      setLocationPermission('denied')
      toast.error('Unable to access location. Using default location.')
      // Use default Bangalore location
      setUserLocation({ lat: 12.9716, lng: 77.5946 })
    } finally {
      setIsLoadingLocation(false)
    }
  }

  const updateUserLocation = async () => {
    setIsLoadingLocation(true)
    try {
      const location = await getCurrentLocation()
      setUserLocation(location)
      setLastLocationUpdate(new Date())
      toast.success(`📍 Location Updated!
Current Position:
Lat: ${location.lat.toFixed(6)}
Lng: ${location.lng.toFixed(6)}
Nearby locations refreshed`, {
        duration: 3000
      })
    } catch (error) {
      console.error('Location update error:', error)
      toast.error('Failed to update location. Please try again.')
    } finally {
      setIsLoadingLocation(false)
    }
  }

  const updateSafeLocations = (currentLocation: { lat: number; lng: number }) => {
    // Base safety locations with coordinates
    const baseLocations: SafeLocation[] = [
      {
        id: 1,
        name: 'SafeStay Women Hostel',
        type: 'accommodation',
        address: 'Indiranagar, Bangalore',
        lat: 12.9716,
        lng: 77.6412,
        distance: 0,
        phone: '+91-9876543210',
        available24x7: true,
        verified: true
      },
      {
        id: 2,
        name: 'Indiranagar Police Station',
        type: 'police',
        address: '100 Feet Road, Indiranagar',
        lat: 12.9784,
        lng: 77.6408,
        distance: 0,
        phone: '080-25212700',
        available24x7: true,
        verified: true
      },
      {
        id: 3,
        name: 'St. Johns Hospital',
        type: 'hospital',
        address: 'Koramangala, Bangalore',
        lat: 12.9352,
        lng: 77.6245,
        distance: 0,
        phone: '080-49467000',
        available24x7: true,
        verified: true
      },
      {
        id: 4,
        name: 'Women Help Desk - HSR',
        type: 'helpdesk',
        address: 'HSR Layout, Bangalore',
        lat: 12.9121,
        lng: 77.6446,
        distance: 0,
        phone: '+91-9480802821',
        available24x7: false,
        verified: true
      },
      {
        id: 5,
        name: 'Koramangala Police Station',
        type: 'police',
        address: '80 Feet Road, Koramangala',
        lat: 12.9279,
        lng: 77.6271,
        distance: 0,
        phone: '080-25532700',
        available24x7: true,
        verified: true
      },
      {
        id: 6,
        name: 'Manipal Hospital',
        type: 'hospital',
        address: 'HAL Airport Road',
        lat: 12.9698,
        lng: 77.6500,
        distance: 0,
        phone: '080-25023344',
        available24x7: true,
        verified: true
      }
    ]

    // Calculate distances based on user location
    const locationsWithDistance = baseLocations.map(location => ({
      ...location,
      distance: parseFloat(calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        location.lat,
        location.lng
      ).toFixed(1))
    }))

    // Sort by distance
    locationsWithDistance.sort((a, b) => a.distance - b.distance)

    setSafeLocations(locationsWithDistance)
  }

  const loadSafetyAlerts = () => {
    const now = new Date()
    const alerts: SafetyAlertData[] = [
      {
        id: 1,
        type: 'traffic',
        severity: 'high',
        title: 'Traffic Alert',
        location: 'MG Road, Bangalore',
        description: 'Heavy traffic congestion due to road work',
        mapColor: 'red',
        timestamp: now.toLocaleString('en-GB', { 
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(',', ',')
      },
      {
        id: 2,
        type: 'construction',
        severity: 'medium',
        title: 'Construction Alert',
        location: 'Electronic City',
        description: 'Road construction causing delays',
        mapColor: 'yellow',
        timestamp: now.toLocaleString('en-GB', { 
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(',', ',')
      },
      {
        id: 3,
        type: 'weather',
        severity: 'medium',
        title: 'Weather Alert',
        location: 'Whitefield',
        description: 'Heavy rain affecting visibility',
        mapColor: 'blue',
        timestamp: now.toLocaleString('en-GB', { 
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(',', ',')
      }
    ]
    setSafetyAlerts(alerts)
  }

  const loadCommunityUpdates = () => {
    const now = new Date()
    const formatTimestamp = (date: Date) => {
      return date.toLocaleString('en-GB', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(',', ',')
    }

    const updates: CommunityUpdateData[] = [
      {
        id: 1,
        type: 'initiative',
        icon: 'refresh',
        title: 'New Women Safety Initiative in Koramangala',
        description: 'Local police have increased patrolling and installed new emergency call boxes',
        location: 'Koramangala, Bangalore',
        source: 'Bangalore Police',
        timestamp: formatTimestamp(now),
        verified: true
      },
      {
        id: 2,
        type: 'tip',
        icon: 'shield',
        title: 'Safety Tip: Late Night Travel',
        description: 'Always share your live location with trusted contacts when traveling late at night',
        location: 'General Safety',
        source: 'SafeGuard Community',
        timestamp: formatTimestamp(now),
        verified: true
      },
      {
        id: 3,
        type: 'incident',
        icon: 'warning',
        title: 'Incident Report: HSR Layout',
        description: 'Reported suspicious activity near HSR Layout metro station. Police have been notified.',
        location: 'HSR Layout, Bangalore',
        source: 'Community User',
        timestamp: formatTimestamp(now),
        verified: false
      }
    ]
    setCommunityUpdates(updates)
  }

  const filteredLocations = safeLocations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'accommodation':
        return <Building2 className="w-5 h-5" />
      case 'police':
        return <Shield className="w-5 h-5" />
      case 'hospital':
        return <Hospital className="w-5 h-5" />
      case 'helpdesk':
        return <Users className="w-5 h-5" />
      default:
        return <MapPin className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'accommodation':
        return 'bg-green-600'
      case 'police':
        return 'bg-blue-600'
      case 'hospital':
        return 'bg-red-600'
      case 'helpdesk':
        return 'bg-purple-600'
      default:
        return 'bg-gray-600'
    }
  }

  const openInMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank')
  }

  const planRoute = async (destination: string) => {
    try {
      const location = await getCurrentLocation()
      const origin = `${location.lat},${location.lng}`
      const dest = encodeURIComponent(destination)
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`, '_blank')
    } catch (error) {
      console.error('Location error:', error)
      // If location fails, just search for the destination
      openInMaps(destination)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Back to Home Button */}
      {onBack && (
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      )}

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h2 className="text-blue-600">AI-Powered Safety Locations</h2>
        </div>
        <p className="text-sm text-gray-600">
          Find safe accommodations, police stations, hospitals, and women help desks with Google Maps integration
        </p>
      </div>

      {/* Quick Action Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto scrollbar-hide pb-2" style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}>
          <TabsList className="inline-flex w-full min-w-max bg-blue-50">
            <TabsTrigger value="quick-find" className="flex items-center gap-2 whitespace-nowrap">
              <Search className="w-4 h-4" />
              Quick Find
            </TabsTrigger>
            <TabsTrigger value="safety-alerts" className="flex items-center gap-2 whitespace-nowrap">
              <AlertTriangle className="w-4 h-4" />
              Safety Alerts
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2 whitespace-nowrap">
              <Users className="w-4 h-4" />
              Community Updates
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2 whitespace-nowrap">
              <Phone className="w-4 h-4" />
              Emergency Services
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Quick Find Tab */}
        <TabsContent value="quick-find" className="space-y-4 mt-6">
          <div className="space-y-4">
            {/* Location Permission Status */}
            {locationPermission === 'denied' && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <AlertDescription className="text-sm text-yellow-800 flex items-center justify-between flex-wrap gap-2">
                  <span>Location access denied. Please enable location permissions to get accurate nearby safety locations.</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 border-yellow-600 text-yellow-700 hover:bg-yellow-100"
                    onClick={requestAndGetLocation}
                    disabled={isLoadingLocation}
                  >
                    {isLoadingLocation ? 'Enabling...' : 'Enable Location'}
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Location Update Status */}
            {locationPermission === 'granted' && userLocation && (
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <MapPinned className="w-5 h-5 text-green-600 animate-pulse" />
                    <div>
                      <p className="text-sm text-green-900">📍 Live Location Active</p>
                      <p className="text-xs text-green-700">
                        Last updated: {lastLocationUpdate.toLocaleTimeString('en-IN')} • Auto-refresh: Every 5 minutes
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={updateUserLocation}
                    disabled={isLoadingLocation}
                    className="h-8 border-green-600 text-green-700 hover:bg-green-100"
                  >
                    <RefreshCw className={`w-4 h-4 mr-1 ${isLoadingLocation ? 'animate-spin' : ''}`} />
                    {isLoadingLocation ? 'Updating...' : 'Refresh Now'}
                  </Button>
                </div>
                <div className="flex items-start gap-2 p-2 bg-white rounded border border-green-200">
                  <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                  <div className="text-xs text-green-800">
                    <p><strong>Current Position:</strong></p>
                    <p>Latitude: {userLocation.lat.toFixed(6)}</p>
                    <p>Longitude: {userLocation.lng.toFixed(6)}</p>
                    <p className="text-green-600 mt-1">🎯 High accuracy GPS tracking enabled</p>
                  </div>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter location to find safety spots (e.g., 'Koramangala, Bangalore')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    const encodedQuery = encodeURIComponent(searchQuery)
                    window.open(`https://www.google.com/maps/search/safe+accommodation+police+station+hospital+${encodedQuery}`, '_blank')
                  }
                }}
              />
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  if (searchQuery.trim()) {
                    const encodedQuery = encodeURIComponent(searchQuery)
                    window.open(`https://www.google.com/maps/search/safe+accommodation+police+station+hospital+${encodedQuery}`, '_blank')
                  } else {
                    alert('Please enter a location to search')
                  }
                }}
              >
                <Search className="w-4 h-4 mr-2" />
                AI Find
              </Button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowRoutePlanning(true)}
              >
                <Route className="w-4 h-4" />
                Plan Safe Route
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={async () => {
                  const location = await getCurrentLocation()
                  window.open(`https://www.google.com/maps/search/police+station/@${location.lat},${location.lng},15z`, '_blank')
                }}
              >
                <Navigation className="w-4 h-4" />
                Near Me
              </Button>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <Card
              className="p-6 text-center cursor-pointer hover:shadow-lg transition-all border-green-200 bg-green-50"
              onClick={() => setShowSafeStays(true)}
            >
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm mb-1">Safe Accommodation</p>
              <p className="text-xs text-gray-600">Women-friendly lodges & hotels</p>
            </Card>

            <Card
              className="p-6 text-center cursor-pointer hover:shadow-lg transition-all border-blue-200 bg-blue-50"
              onClick={() => setShowRoutePlanning(true)}
            >
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Route className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm mb-1">Route Planning</p>
              <p className="text-xs text-gray-600">Safe route recommendations</p>
            </Card>

            <Card
              className="p-6 text-center cursor-pointer hover:shadow-lg transition-all border-purple-200 bg-purple-50"
              onClick={() => {
                setActiveTab('community')
                loadCommunityUpdates()
                toast.success('Loading live community updates...')
              }}
            >
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm mb-1">Safety & Navigation</p>
              <p className="text-xs text-gray-600">Live community safety updates (Auto-refresh: 5 min)</p>
            </Card>

            <Card
              className="p-6 text-center cursor-pointer hover:shadow-lg transition-all border-red-200 bg-red-50"
              onClick={() => setActiveTab('emergency')}
            >
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm mb-1">Emergency Services</p>
              <p className="text-xs text-gray-600">Find nearest police & medical help</p>
            </Card>
          </div>

          {/* Locations List */}
          <div className="space-y-3 mt-6">
            <div className="flex items-center justify-between">
              <h3>Nearby Safety Locations ({filteredLocations.length})</h3>
              {userLocation && (
                <p className="text-xs text-gray-600">
                  Sorted by distance from your location
                </p>
              )}
            </div>
            {filteredLocations.length === 0 && (
              <Card className="p-8 text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  {isLoadingLocation ? 'Loading nearby safety locations...' : 'No safety locations found'}
                </p>
              </Card>
            )}
            {filteredLocations.map((location) => (
              <Card key={location.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${getTypeColor(location.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                    {getTypeIcon(location.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="truncate">{location.name}</p>
                      {location.verified && (
                        <Badge className="bg-green-600 text-xs flex-shrink-0">Verified</Badge>
                      )}
                      {location.available24x7 && (
                        <Badge variant="outline" className="text-xs flex-shrink-0">24x7</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{location.address}</span>
                      </span>
                      <span className="flex items-center gap-1 flex-shrink-0">
                        <Navigation className="w-3 h-3" />
                        {location.distance} km
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`tel:${location.phone}`, '_self')}
                      className="p-2"
                      title="Call"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => planRoute(location.address)}
                      className="p-2"
                      title="Get Directions"
                    >
                      <Route className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 px-3"
                      onClick={() => openInMaps(location.address)}
                    >
                      <span className="hidden sm:inline">View on Map</span>
                      <span className="sm:hidden">Map</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Safety Alerts Tab */}
        <TabsContent value="safety-alerts" className="mt-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-gray-900">Current Safety Alerts</h3>
            <p className="text-sm text-gray-600">
              Real-time traffic, construction, and weather alerts with color-coded Google Maps integration
            </p>
          </div>

          {/* Traffic Alert - Red */}
          {safetyAlerts.filter(a => a.type === 'traffic').map(alert => (
            <Card key={alert.id} className="p-5 bg-red-50 border-2 border-red-200">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p>{alert.title}</p>
                      <Badge className="bg-red-600 text-white text-xs">high</Badge>
                    </div>
                  </div>
                  <p className="text-sm">{alert.location}</p>
                  <p className="text-sm text-gray-700">{alert.description}</p>
                  <p 
                    className="text-xs text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                    onClick={() => {
                      const location = encodeURIComponent(alert.location)
                      window.open(`https://www.google.com/maps/search/${location}/@12.9716,77.5946,13z/data=!5m1!1e1`, '_blank')
                      toast.info('🚗 Opening Google Maps with traffic layer (red lines show congestion)')
                    }}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Click to view in Google Maps with red marking
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {/* Construction Alert - Yellow */}
          {safetyAlerts.filter(a => a.type === 'construction').map(alert => (
            <Card key={alert.id} className="p-5 bg-yellow-50 border-2 border-yellow-200">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p>{alert.title}</p>
                      <Badge className="bg-yellow-600 text-white text-xs">medium</Badge>
                    </div>
                  </div>
                  <p className="text-sm">{alert.location}</p>
                  <p className="text-sm text-gray-700">{alert.description}</p>
                  <p 
                    className="text-xs text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                    onClick={() => {
                      const location = encodeURIComponent(alert.location)
                      window.open(`https://www.google.com/maps/search/road+construction+${location}/@12.9716,77.5946,13z`, '_blank')
                      toast.info('🚧 Opening Google Maps with construction markers (yellow indicates work zones)')
                    }}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Click to view in Google Maps with yellow marking
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {/* Weather Alert - Blue */}
          {safetyAlerts.filter(a => a.type === 'weather').map(alert => (
            <Card key={alert.id} className="p-5 bg-blue-50 border-2 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p>{alert.title}</p>
                      <Badge className="bg-blue-600 text-white text-xs">medium</Badge>
                    </div>
                  </div>
                  <p className="text-sm">{alert.location}</p>
                  <p className="text-sm text-gray-700">{alert.description}</p>
                  <p 
                    className="text-xs text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                    onClick={() => {
                      const location = encodeURIComponent(alert.location)
                      window.open(`https://www.google.com/maps/@12.9716,77.5946,11z/data=!5m1!1e4`, '_blank')
                      toast.info('🌧️ Opening Google Maps with weather overlay (showing rain and wind conditions)')
                    }}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Click to view in Google Maps with blue marking
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {/* Bottom Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <Card
              className="p-6 text-center cursor-pointer hover:shadow-lg transition-all border-green-200 bg-green-50"
              onClick={() => setShowSafeStays(true)}
            >
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm">Safe Accommodation</p>
            </Card>

            <Card
              className="p-6 text-center cursor-pointer hover:shadow-lg transition-all border-blue-200 bg-blue-50"
              onClick={() => setShowRoutePlanning(true)}
            >
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Route className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm">Route Planning</p>
            </Card>

            <Card
              className="p-6 text-center cursor-pointer hover:shadow-lg transition-all border-purple-200 bg-purple-50"
              onClick={() => setActiveTab('community')}
            >
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm">Safety & Navigation</p>
            </Card>

            <Card
              className="p-6 text-center cursor-pointer hover:shadow-lg transition-all border-red-200 bg-red-50"
              onClick={() => setActiveTab('emergency')}
            >
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm">Emergency Services</p>
            </Card>
          </div>
        </TabsContent>

        {/* Community Updates Tab */}
        <TabsContent value="community" className="mt-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-gray-900">Live Community Safety Updates</h3>
            <p className="text-sm text-gray-600">
              Real-time safety information from the community and authorities
            </p>
          </div>

          {/* Auto-refresh indicator */}
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              Last updated: {lastUpdate.toLocaleTimeString('en-IN')} • Auto-refresh every 5 minutes
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                loadCommunityUpdates()
                setLastUpdate(new Date())
                toast.success('Updates refreshed successfully')
              }}
              className="h-7 px-2"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh Now
            </Button>
          </div>

          {/* Community Updates List */}
          <div className="space-y-4">
            {communityUpdates.map(update => {
              const getIcon = () => {
                switch (update.icon) {
                  case 'refresh':
                    return <RefreshCw className="w-5 h-5 text-blue-600" />
                  case 'shield':
                    return <Sparkles className="w-5 h-5 text-green-600" />
                  case 'warning':
                    return <AlertTriangle className="w-5 h-5 text-red-600" />
                }
              }

              return (
                <Card key={update.id} className="p-5 border border-gray-200 hover:shadow-md transition-all bg-white cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getIcon()}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-gray-900">{update.title}</p>
                        {update.verified && (
                          <Badge className="bg-green-600 text-white flex-shrink-0 text-xs">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{update.description}</p>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600">{update.location}</p>
                        <p className="text-xs text-gray-500">By: {update.source}</p>
                      </div>
                      <p className="text-xs text-gray-400">{update.timestamp}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          <Button variant="outline" className="w-full">
            View All Community Updates
          </Button>

          {/* Bottom Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <Card
              className="p-6 text-center cursor-pointer hover:shadow-lg transition-all border-green-200 bg-green-50"
              onClick={() => setShowSafeStays(true)}
            >
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm">Safe Accommodation</p>
            </Card>

            <Card
              className="p-6 text-center cursor-pointer hover:shadow-lg transition-all border-blue-200 bg-blue-50"
              onClick={() => setShowRoutePlanning(true)}
            >
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Route className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm">Route Planning</p>
            </Card>

            <Card
              className="p-6 text-center cursor-pointer hover:shadow-lg transition-all border-purple-200 bg-purple-50"
              onClick={() => setActiveTab('safety-alerts')}
            >
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm">Safety Alerts</p>
            </Card>

            <Card
              className="p-6 text-center cursor-pointer hover:shadow-lg transition-all border-red-200 bg-red-50"
              onClick={() => setActiveTab('emergency')}
            >
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm">Emergency Services</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="mt-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-gray-900">Find Nearest Police & Medical Help</h3>
            <p className="text-sm text-gray-600">
              Quick access to emergency services with direct calling options
            </p>
          </div>

          {/* Emergency Service Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Police Station */}
            <Card className="p-8 bg-red-50 border-2 border-red-200 hover:shadow-xl transition-all">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                
                <div className="space-y-1">
                  <p className="text-red-600">Police Station</p>
                  <p className="text-sm text-red-700">Emergency police assistance and FIR filing</p>
                </div>

                <Button
                  onClick={() => window.open('tel:100', '_self')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Police: 100
                </Button>
              </div>
            </Card>

            {/* Medical Help */}
            <Card className="p-8 bg-blue-50 border-2 border-blue-200 hover:shadow-xl transition-all">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                  <Hospital className="w-8 h-8 text-blue-600" />
                </div>
                
                <div className="space-y-1">
                  <p className="text-blue-600">Medical Help</p>
                  <p className="text-sm text-blue-700">Emergency medical assistance and ambulance</p>
                </div>

                <Button
                  onClick={() => window.open('tel:108', '_self')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Medical: 108
                </Button>
              </div>
            </Card>
          </div>

          {/* Women Helpline - Full Width */}
          <Card className="p-8 bg-pink-50 border-2 border-pink-200 hover:shadow-xl transition-all">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              
              <div className="space-y-1">
                <p className="text-pink-600">Women Helpline</p>
                <p className="text-sm text-pink-700">24/7 support for women in distress</p>
              </div>

              <div className="max-w-md mx-auto">
                <Button
                  onClick={() => window.open('tel:1091', '_self')}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                  size="lg"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Women Helpline: 1091
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Safe Stays Modal */}
      {showSafeStays && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-red-600">Safe Accommodation</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSafeStays(false)}
              >
                <span className="sr-only">Close</span>
                ✕
              </Button>
            </div>
            <div className="p-6">
              <SafeStays />
            </div>
          </div>
        </div>
      )}

      {/* Route Planning Dialog */}
      <RoutePlanning 
        open={showRoutePlanning}
        onOpenChange={setShowRoutePlanning}
      />
    </div>
  )
}
