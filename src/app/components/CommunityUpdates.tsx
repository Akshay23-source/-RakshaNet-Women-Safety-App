import React, { useState, useEffect } from 'react'
import { Bell, MapPin, Info, Eye, RefreshCw, Plus, AlertCircle, Sparkles, Shield, AlertTriangle, Car, Cloud, X, Navigation, Users, User, Heart, CheckCircle, Phone, Video, Share2 } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Alert, AlertDescription } from './ui/alert'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { toast } from 'sonner@2.0.3'
import { getCurrentLocation } from '../utils/location'

interface CommunityUpdate {
  id: string
  type: 'security' | 'traffic' | 'construction' | 'weather' | 'safety'
  icon: React.ReactNode
  title: string
  description: string
  location: string
  area: string
  coordinates: string
  impactLevel: string
  source: string
  timestamp: string
  timeAgo: string
  verified: boolean
  severity: 'low' | 'medium' | 'high'
}

const generateUpdates = (): CommunityUpdate[] => {
  const now = new Date()
  return [
    {
      id: '1',
      type: 'security',
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      title: 'Safety Alert: Increased security patrols in downtown area today. Stay safe!',
      description: 'Local police have increased patrolling in the downtown business district. Enhanced security measures include additional patrol units, increased CCTV monitoring, and emergency response teams on standby. This is part of a proactive safety initiative.',
      location: 'Downtown Area',
      area: 'Downtown Business District, Koramangala, Bangalore',
      coordinates: '12.9352, 77.6245',
      impactLevel: 'Significant improvement in area safety rating (+40%)',
      source: 'RakshaNet Team',
      timestamp: '24/10/2025, 22:21:49',
      timeAgo: '7 mins ago',
      verified: true,
      severity: 'medium'
    },
    {
      id: '2',
      type: 'weather',
      icon: <Cloud className="w-5 h-5 text-blue-600" />,
      title: 'Weather alert: Heavy rain expected in next 2 hours. Plan indoor activities and avoid waterlogged...',
      description: 'The India Meteorological Department has issued a weather advisory for heavy to very heavy rainfall in the next 2 hours. Residents are advised to avoid waterlogged areas, stay indoors if possible, and exercise caution while traveling. Emergency services are on high alert.',
      location: 'Citywide',
      area: 'Bangalore City, Karnataka',
      coordinates: '12.9716, 77.5946',
      impactLevel: 'High - Potential flooding in low-lying areas',
      source: 'IMD Weather Services',
      timestamp: '24/10/2025, 22:00:00',
      timeAgo: '31 mins ago',
      verified: true,
      severity: 'high'
    },
    {
      id: '3',
      type: 'traffic',
      icon: <Car className="w-5 h-5 text-orange-600" />,
      title: 'Traffic Update: Road construction on MG Road causing delays',
      description: 'Ongoing road construction and maintenance work on MG Road is causing significant traffic delays. The work is expected to continue for the next 3 days. Commuters are advised to use alternate routes via Brigade Road or Residency Road.',
      location: 'MG Road',
      area: 'Mahatma Gandhi Road, Central Bangalore',
      coordinates: '12.9756, 77.6077',
      impactLevel: 'Medium - 30-45 minute delays expected',
      source: 'Bangalore Traffic Police',
      timestamp: '24/10/2025, 21:45:00',
      timeAgo: '1 hour ago',
      verified: true,
      severity: 'medium'
    },
    {
      id: '4',
      type: 'safety',
      icon: <Shield className="w-5 h-5 text-green-600" />,
      title: 'New Women Safety Initiative in Koramangala',
      description: 'Local police have launched a new women safety initiative including installation of emergency call boxes, increased patrolling, and safety awareness programs. The initiative covers all major areas in Koramangala.',
      location: 'Koramangala',
      area: 'Koramangala 5th Block, Bangalore',
      coordinates: '12.9343, 77.6194',
      impactLevel: 'Positive - Enhanced safety infrastructure',
      source: 'Bangalore Police',
      timestamp: '24/10/2025, 20:30:00',
      timeAgo: '2 hours ago',
      verified: true,
      severity: 'low'
    }
  ]
}

export function CommunityUpdates() {
  const [expanded, setExpanded] = useState(false)
  const [selectedUpdate, setSelectedUpdate] = useState<CommunityUpdate | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<string>('Detecting location...')
  const [updates, setUpdates] = useState<CommunityUpdate[]>(generateUpdates())
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [activeTab, setActiveTab] = useState('details')
  
  // Report form state
  const [reportType, setReportType] = useState('safety')
  const [reportTitle, setReportTitle] = useState('')
  const [reportDescription, setReportDescription] = useState('')
  const [reportLocation, setReportLocation] = useState('')
  const [reportSeverity, setReportSeverity] = useState<'low' | 'medium' | 'high'>('medium')
  
  // Reaction reviews state
  const [showReviewsDialog, setShowReviewsDialog] = useState(false)
  const [selectedReactionType, setSelectedReactionType] = useState<'helpful' | 'verified' | 'important'>('helpful')
  
  // User reactions state - tracks which reactions the user has clicked
  const [userReactions, setUserReactions] = useState<{
    helpful: boolean
    verified: boolean
    important: boolean
  }>({
    helpful: false,
    verified: false,
    important: false
  })
  
  // Reaction counts state
  const [reactionCounts, setReactionCounts] = useState({
    helpful: 24,
    verified: 18,
    important: 12
  })

  useEffect(() => {
    // Get location and load location-specific updates
    const loadLocation = async () => {
      try {
        const location = await getCurrentLocation()
        setCurrentLocation('Bangalore, Karnataka')
        loadLocationBasedUpdates(location.lat, location.lng)
      } catch (error) {
        setCurrentLocation('Location unavailable - showing general updates')
      }
    }
    
    loadLocation()

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      setUpdates(generateUpdates())
      setLastRefresh(new Date())
      toast.info('Community updates refreshed')
    }, 300000) // 5 minutes = 300000ms

    return () => clearInterval(interval)
  }, [])

  const loadLocationBasedUpdates = (lat: number, lng: number) => {
    // In real app, fetch updates based on user location
    // For now, just add location-aware messaging
    toast.success('Loaded updates for your area')
  }

  const handleViewDetails = (update: CommunityUpdate) => {
    setSelectedUpdate(update)
    setShowDetailsDialog(true)
    setActiveTab('details')
  }

  const handleReactionClick = (reactionType: 'helpful' | 'verified' | 'important') => {
    const isAlreadyReacted = userReactions[reactionType]
    
    // Toggle the reaction
    setUserReactions(prev => ({
      ...prev,
      [reactionType]: !prev[reactionType]
    }))
    
    // Update the count
    setReactionCounts(prev => ({
      ...prev,
      [reactionType]: isAlreadyReacted ? prev[reactionType] - 1 : prev[reactionType] + 1
    }))
    
    // Show toast feedback
    if (!isAlreadyReacted) {
      toast.success(`Marked as ${reactionType}! Thank you for your feedback.`)
    } else {
      toast.info(`Removed ${reactionType} reaction`)
    }
  }

  const refreshUpdates = () => {
    setUpdates(generateUpdates())
    setLastRefresh(new Date())
    toast.success('Updates refreshed successfully')
  }

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'bg-red-600'
      case 'medium': return 'bg-orange-600'
      case 'low': return 'bg-green-600'
      default: return 'bg-blue-600'
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch(severity) {
      case 'high': return 'Urgent'
      case 'medium': return 'Important'
      case 'low': return 'Info'
      default: return 'Update'
    }
  }

  const handleSubmitReport = () => {
    if (!reportTitle || !reportDescription || !reportLocation) {
      toast.error('Please fill in all required fields')
      return
    }

    const newUpdate: CommunityUpdate = {
      id: Date.now().toString(),
      type: reportType as any,
      icon: reportType === 'security' ? <AlertTriangle className="w-5 h-5 text-red-600" /> : 
            reportType === 'weather' ? <Cloud className="w-5 h-5 text-blue-600" /> :
            reportType === 'traffic' ? <Car className="w-5 h-5 text-orange-600" /> :
            <Shield className="w-5 h-5 text-green-600" />,
      title: reportTitle,
      description: reportDescription,
      location: reportLocation,
      area: reportLocation + ', Bangalore',
      coordinates: '12.9716, 77.5946',
      impactLevel: 'User reported update',
      source: 'Community Member',
      timestamp: new Date().toLocaleString('en-IN'),
      timeAgo: 'Just now',
      verified: false,
      severity: reportSeverity
    }

    setUpdates([newUpdate, ...updates])
    setShowReportDialog(false)
    
    // Reset form
    setReportTitle('')
    setReportDescription('')
    setReportLocation('')
    setReportType('safety')
    setReportSeverity('medium')
    
    toast.success('Safety update reported successfully! Thank you for keeping the community informed.')
  }

  if (!expanded) {
    return (
      <Card 
        className="backdrop-blur-md bg-white/10 border-2 border-gray-200 hover:shadow-xl transition-all cursor-pointer"
        onClick={() => setExpanded(true)}
      >
        <div className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-gray-900">Live Community Safety Updates</h4>
                <p className="text-xs text-gray-600">Click to view all updates</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <Badge className="bg-green-600 text-white flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                LIVE
              </Badge>
              <Button size="sm" variant="ghost" className="text-xs whitespace-nowrap flex-1 sm:flex-none" onClick={(e) => {
                e.stopPropagation()
                setExpanded(true)
              }}>
                📍 View all
              </Button>
              <RefreshCw className="w-4 h-4 text-gray-600 flex-shrink-0" />
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="backdrop-blur-md bg-white/10 border-2 border-purple-200 shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-gray-900">Live Community Updates</h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600 text-white flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                LIVE
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(false)}
              >
                ×
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Real-time safety information from the community and authorities
          </p>

          {/* Last Refresh Info */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <p className="text-xs text-gray-500">
              Last refreshed: {lastRefresh.toLocaleTimeString('en-IN')} • Auto-refresh every 5 minutes
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshUpdates}
              className="h-6 px-2 text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh Now
            </Button>
          </div>

          {/* Updates List */}
          <div className="space-y-3">
            {updates.map((update) => (
              <Card 
                key={update.id}
                className="p-4 border-2 border-l-4 hover:shadow-md transition-all cursor-pointer bg-gradient-to-r from-white to-gray-50"
                style={{ borderLeftColor: update.severity === 'high' ? '#dc2626' : update.severity === 'medium' ? '#ea580c' : '#16a34a' }}
                onClick={() => handleViewDetails(update)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {update.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {update.verified && (
                            <Badge className="bg-green-600 text-white text-xs px-2 py-0">
                              ✓ Verified
                            </Badge>
                          )}
                          <Badge className={`${getSeverityColor(update.severity)} text-white text-xs px-2 py-0`}>
                            {getSeverityBadge(update.severity)}
                          </Badge>
                        </div>
                        <h4 className="text-sm text-gray-900 mb-1">{update.title}</h4>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {update.location}
                      </span>
                      <span>•</span>
                      <span>{update.timeAgo}</span>
                    </div>
                    
                    <p className="text-xs text-purple-600 mt-2">
                      👁️ Tap for comprehensive details, location & safety measures
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full border-purple-300 text-white bg-purple-600 hover:bg-purple-700" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setShowReportDialog(true)
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Report Safety Update
            </Button>
          </div>
        </div>
      </Card>

      {/* Enhanced Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                {selectedUpdate?.icon}
                <span>Enhanced Security Measures - {selectedUpdate?.location}</span>
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowDetailsDialog(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <DialogDescription className="sr-only">
              Detailed information about this community safety update
            </DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-green-600 text-white">
                ✓ Active Security Enhancement
              </Badge>
              <Badge className="bg-blue-600 text-white">
                Alert
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              🕐 {selectedUpdate?.timestamp} &nbsp;&nbsp; 👤 By {selectedUpdate?.source}
            </p>
          </DialogHeader>

          {selectedUpdate && (
            <div className="space-y-4 mt-4">
              {/* Tabs for Details, Location, Community */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="community">Community</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  {/* Original Message */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="text-green-900">Original Message:</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      {selectedUpdate.icon} {selectedUpdate.title}
                    </p>
                  </div>

                  {/* Alert Time Information */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="flex items-center gap-2 mb-3 text-blue-900">
                      <AlertCircle className="w-4 h-4" />
                      Alert Time Information
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">Alert Time:</p>
                        <p className="text-gray-900">{selectedUpdate.timestamp}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Time Ago:</p>
                        <p className="text-gray-900">{selectedUpdate.timeAgo}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-600">Status:</p>
                        <p className="text-green-600 flex items-center gap-1">
                          ✓ Active Security Enhancement
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="mb-2 text-sm">Full Description</h4>
                    <p className="text-sm text-gray-700">{selectedUpdate.description}</p>
                  </div>
                </TabsContent>

                <TabsContent value="location" className="space-y-4 mt-4">
                  {/* Location Details */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="flex items-center gap-2 mb-3 text-blue-900">
                      <MapPin className="w-4 h-4" />
                      Location Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-600">Area:</p>
                        <p className="text-gray-900">{selectedUpdate.area}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Coordinates:</p>
                        <p className="text-gray-900">{selectedUpdate.coordinates}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Impact Level:</p>
                        <p className="text-green-600">{selectedUpdate.impactLevel}</p>
                      </div>
                    </div>
                  </div>

                  {/* Map with Community Members */}
                  <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                        <p className="text-gray-700">Map View</p>
                        <p className="text-xs text-gray-500 mt-1">{selectedUpdate.area}</p>
                      </div>
                    </div>
                    
                    {/* Community Members Indicators */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                      <p className="text-xs text-gray-600 flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span>12 Community Members Nearby</span>
                      </p>
                    </div>
                    
                    {/* Simulated member markers */}
                    <div className="absolute top-20 left-20 w-8 h-8 bg-purple-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute top-32 right-24 w-8 h-8 bg-green-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse" style={{animationDelay: '0.2s'}}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute bottom-20 left-32 w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse" style={{animationDelay: '0.4s'}}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute top-28 left-48 w-8 h-8 bg-orange-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse" style={{animationDelay: '0.6s'}}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        const coords = selectedUpdate.coordinates.split(',').map(c => c.trim())
                        window.open(`https://www.google.com/maps?q=${coords[0]},${coords[1]}`, '_blank')
                        toast.success('Opening Google Maps...')
                      }}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Open in Maps
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={async () => {
                        try {
                          const userLoc = await getCurrentLocation()
                          const destCoords = selectedUpdate.coordinates.split(',').map(c => c.trim())
                          
                          // Calculate approximate distance (simple haversine formula)
                          const R = 6371 // Earth's radius in km
                          const dLat = (parseFloat(destCoords[0]) - userLoc.lat) * Math.PI / 180
                          const dLon = (parseFloat(destCoords[1]) - userLoc.lng) * Math.PI / 180
                          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                                    Math.cos(userLoc.lat * Math.PI / 180) * Math.cos(parseFloat(destCoords[0]) * Math.PI / 180) *
                                    Math.sin(dLon/2) * Math.sin(dLon/2)
                          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
                          const distance = (R * c).toFixed(2)
                          
                          toast.success(`Distance: ${distance} km`, {
                            description: 'Opening directions in Google Maps...',
                            duration: 3000
                          })
                          
                          window.open(`https://www.google.com/maps/dir/?api=1&origin=${userLoc.lat},${userLoc.lng}&destination=${destCoords[0]},${destCoords[1]}`, '_blank')
                        } catch (error) {
                          toast.error('Unable to get your location for directions')
                        }
                      }}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="community" className="space-y-4 mt-4">
                  {/* Additional Safety Measures & Community Info */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="flex items-center gap-2 mb-3 text-green-900">
                      <Shield className="w-4 h-4" />
                      Additional Safety Measures & Community Info
                    </h4>
                    
                    {/* Safety Measures in Place */}
                    <div className="mb-4">
                      <h5 className="flex items-center gap-2 text-sm mb-3 text-blue-900">
                        <Info className="w-4 h-4" />
                        Safety Measures in Place:
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 p-2 bg-green-100 rounded text-sm text-green-800">
                          <Car className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Enhanced police patrolling every 15 minutes</span>
                        </div>
                        <div className="flex items-start gap-2 p-2 bg-green-100 rounded text-sm text-green-800">
                          <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>8 new emergency call boxes with direct police connection</span>
                        </div>
                        <div className="flex items-start gap-2 p-2 bg-green-100 rounded text-sm text-green-800">
                          <Video className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Real-time CCTV monitoring with instant response</span>
                        </div>
                      </div>
                    </div>

                    {/* Community Safety Tips */}
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h5 className="flex items-center gap-2 text-sm mb-2 text-yellow-900">
                        <AlertTriangle className="w-4 h-4" />
                        Community Safety Tips
                      </h5>
                      <ul className="space-y-1.5 text-sm text-yellow-800">
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-600">•</span>
                          <span>Stay alert and aware of your surroundings</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-600">•</span>
                          <span>Share your location with trusted contacts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-600">•</span>
                          <span>Report any suspicious activity immediately</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-600">•</span>
                          <span>Use well-lit and populated routes</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Community Reactions */}
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h5 className="flex items-center gap-2 text-sm mb-3 text-purple-900">
                      <Users className="w-4 h-4" />
                      Community Reactions - Click to React!
                    </h5>
                    <div className="space-y-3">
                      {/* Helpful Button */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant={userReactions.helpful ? "default" : "outline"}
                          className={`flex-1 flex items-center justify-between gap-2 transition-all ${
                            userReactions.helpful 
                              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-red-500' 
                              : 'bg-white hover:bg-red-50 border-red-300'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleReactionClick('helpful')
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Heart className={`w-4 h-4 ${userReactions.helpful ? 'text-white fill-white' : 'text-red-500'}`} />
                            <span className={userReactions.helpful ? 'text-white' : 'text-gray-900'}>Helpful</span>
                          </div>
                          <Badge className={`${userReactions.helpful ? 'bg-white text-red-600' : 'bg-red-500 text-white'}`}>
                            {reactionCounts.helpful}
                          </Badge>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-purple-600 hover:text-purple-800"
                          onClick={() => {
                            setSelectedReactionType('helpful')
                            setShowReviewsDialog(true)
                          }}
                        >
                          View
                        </Button>
                      </div>

                      {/* Verified Button */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant={userReactions.verified ? "default" : "outline"}
                          className={`flex-1 flex items-center justify-between gap-2 transition-all ${
                            userReactions.verified 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-green-500' 
                              : 'bg-white hover:bg-green-50 border-green-300'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleReactionClick('verified')
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className={`w-4 h-4 ${userReactions.verified ? 'text-white fill-white' : 'text-green-600'}`} />
                            <span className={userReactions.verified ? 'text-white' : 'text-gray-900'}>Verified</span>
                          </div>
                          <Badge className={`${userReactions.verified ? 'bg-white text-green-600' : 'bg-green-600 text-white'}`}>
                            {reactionCounts.verified}
                          </Badge>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-purple-600 hover:text-purple-800"
                          onClick={() => {
                            setSelectedReactionType('verified')
                            setShowReviewsDialog(true)
                          }}
                        >
                          View
                        </Button>
                      </div>

                      {/* Important Button */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant={userReactions.important ? "default" : "outline"}
                          className={`flex-1 flex items-center justify-between gap-2 transition-all ${
                            userReactions.important 
                              ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white border-orange-500' 
                              : 'bg-white hover:bg-orange-50 border-orange-300'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleReactionClick('important')
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <AlertTriangle className={`w-4 h-4 ${userReactions.important ? 'text-white fill-white' : 'text-orange-600'}`} />
                            <span className={userReactions.important ? 'text-white' : 'text-gray-900'}>Important</span>
                          </div>
                          <Badge className={`${userReactions.important ? 'bg-white text-orange-600' : 'bg-orange-600 text-white'}`}>
                            {reactionCounts.important}
                          </Badge>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-purple-600 hover:text-purple-800"
                          onClick={() => {
                            setSelectedReactionType('important')
                            setShowReviewsDialog(true)
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      {userReactions.helpful || userReactions.verified || userReactions.important 
                        ? '✓ Thank you for your feedback!' 
                        : 'Click a button to share your feedback'}
                    </p>
                  </div>

                  {/* Community Statistics */}
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h5 className="mb-3 text-sm text-purple-900">Community Statistics</h5>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <p className="text-3xl text-purple-600">
                          {reactionCounts.helpful + reactionCounts.verified + reactionCounts.important}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Total Reactions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl text-purple-600">156</p>
                        <p className="text-xs text-gray-600 mt-1">Views</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl text-purple-600">23</p>
                        <p className="text-xs text-gray-600 mt-1">Shares</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Community Comments */}
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 className="mb-3 text-sm text-gray-900">Recent Community Comments</h5>
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <p className="text-sm mb-1">
                          <span className="text-gray-900">Priya S.:</span>
                          <span className="text-gray-700 ml-1">"Very helpful update! Used the alternative route and saved 20 minutes."</span>
                        </p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <p className="text-sm mb-1">
                          <span className="text-gray-900">Anonymous:</span>
                          <span className="text-gray-700 ml-1">"Can confirm - saw increased patrols today. Feeling much safer!"</span>
                        </p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <p className="text-sm mb-1">
                          <span className="text-gray-900">Anjali M.:</span>
                          <span className="text-gray-700 ml-1">"Thanks for the timely update. Shared with my friends in the area."</span>
                        </p>
                        <p className="text-xs text-gray-500">6 hours ago</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share with Community
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Safety Update Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Safety Update</DialogTitle>
            <DialogDescription>
              Help keep the community informed by reporting safety updates in your area
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="report-type">Update Type *</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safety">Safety Initiative</SelectItem>
                  <SelectItem value="security">Security Alert</SelectItem>
                  <SelectItem value="weather">Weather Warning</SelectItem>
                  <SelectItem value="traffic">Traffic Update</SelectItem>
                  <SelectItem value="construction">Construction Notice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="severity">Severity Level *</Label>
              <Select value={reportSeverity} onValueChange={(val) => setReportSeverity(val as any)}>
                <SelectTrigger id="severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Informational</SelectItem>
                  <SelectItem value="medium">Medium - Important</SelectItem>
                  <SelectItem value="high">High - Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title"
                placeholder="Brief description of the update"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input 
                id="location"
                placeholder="e.g., Koramangala, MG Road, etc."
                value={reportLocation}
                onChange={(e) => setReportLocation(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea 
                id="description"
                placeholder="Provide detailed information about this safety update"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowReportDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitReport}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Submit Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Community Reactions Reviews Dialog */}
      <Dialog open={showReviewsDialog} onOpenChange={setShowReviewsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedReactionType === 'helpful' && (
                <>
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Helpful Reviews ({reactionCounts.helpful})</span>
                </>
              )}
              {selectedReactionType === 'verified' && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Verified Reviews ({reactionCounts.verified})</span>
                </>
              )}
              {selectedReactionType === 'important' && (
                <>
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span>Important Reviews ({reactionCounts.important})</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Community members who found this update {selectedReactionType}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 mt-4">
            {selectedReactionType === 'helpful' && (
              <>
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                      PS
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm text-gray-900">Priya Sharma</h4>
                        <span className="text-xs text-gray-500">2 hours ago</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        "This update was incredibly helpful! I was planning to take my usual route through downtown, 
                        but seeing the increased security patrols made me feel much safer. Thank you RakshaNet team!"
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Verified User</Badge>
                        <Badge variant="outline" className="text-xs">Active Member</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white">
                      AM
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm text-gray-900">Anjali Mehta</h4>
                        <span className="text-xs text-gray-500">4 hours ago</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        "Very useful information. I shared this with my office colleagues who commute through this area. 
                        The emergency call box locations are especially helpful to know!"
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Verified User</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white">
                      RK
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm text-gray-900">Radha Krishnan</h4>
                        <span className="text-xs text-gray-500">6 hours ago</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        "Great initiative by the local authorities. I've noticed the difference already. 
                        More apps should have this kind of real-time community safety feature."
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedReactionType === 'verified' && (
              <>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm text-gray-900">Local Police Station - Koramangala</h4>
                        <span className="text-xs text-gray-500">1 hour ago</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        "We can confirm this update. Enhanced patrolling schedule is active from 6 AM to 10 PM daily. 
                        Citizens can approach any patrol officer for assistance."
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-600 text-white text-xs">Official Authority</Badge>
                        <Badge variant="outline" className="text-xs">Government Verified</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                      SK
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm text-gray-900">Sneha Kumar</h4>
                        <span className="text-xs text-gray-500">3 hours ago</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        "Can confirm - I personally saw 3 patrol cars and several officers on foot patrol during my 
                        evening walk. Feel much more secure now."
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Eyewitness</Badge>
                        <Badge variant="outline" className="text-xs">Verified User</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white">
                      DM
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm text-gray-900">Deepak Mishra - Security Guard</h4>
                        <span className="text-xs text-gray-500">5 hours ago</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        "I work in the area and can verify this. The new emergency call boxes are installed and 
                        functional. Tested one myself - direct connection to control room."
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Local Professional</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedReactionType === 'important' && (
              <>
                <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white">
                      MG
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm text-gray-900">Meera Gupta</h4>
                        <span className="text-xs text-gray-500">1 hour ago</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        "This is crucial information for all women working late hours in the area. Please share widely! 
                        The enhanced security gives us peace of mind."
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Night Shift Worker</Badge>
                        <Badge className="bg-orange-600 text-white text-xs">High Impact</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                      VA
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm text-gray-900">Vidya Anand - College Student</h4>
                        <span className="text-xs text-gray-500">3 hours ago</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        "As someone who often returns from college late, this update is extremely important. 
                        Knowing about CCTV monitoring and patrol schedules helps me plan my route better."
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Student</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white">
                      NG
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm text-gray-900">Neha Goyal - Parent</h4>
                        <span className="text-xs text-gray-500">5 hours ago</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        "As a parent, this information is vital. My daughter takes tuition classes in this area. 
                        Forwarded this to all parents in our community group."
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Parent Community</Badge>
                        <Badge className="bg-orange-600 text-white text-xs">Widely Shared</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowReviewsDialog(false)}
              >
                Close Reviews
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
