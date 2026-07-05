import React, { useState, useEffect, useRef } from 'react'
import { Route, Navigation, MapPin, X, Loader2, AlertCircle, Shield } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Alert, AlertDescription } from './ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { getCurrentLocation } from '../utils/location'
import L from 'leaflet'

interface RouteAnalysis {
  isSafe: boolean
  safetyScore: number
  alerts: string[]
  nearbyPoliceStations: number
  nearbyHospitals: number
  recommendedRoute: 'fastest' | 'safest' | 'balanced'
}

interface RoutePlanningProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface LeafletRouteMapProps {
  start: { lat: number; lng: number }
  end: { lat: number; lng: number }
}

function LeafletRouteMap({ start, end }: LeafletRouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    const startIcon = L.divIcon({
      html: `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:#22c55e;border-radius:50%;border:4px solid white;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);color:white;"><svg style="width:16px;height:16px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg></div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })

    const endIcon = L.divIcon({
      html: `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:#e11d48;border-radius:50%;border:4px solid white;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);color:white;"><svg style="width:16px;height:16px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg></div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    })

    const policeIcon = L.divIcon({
      html: `<div style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;background:#2563eb;border-radius:50%;border:2px solid white;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);color:white;"><svg style="width:14px;height:14px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></div>`,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })

    const hospitalIcon = L.divIcon({
      html: `<div style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;background:#ef4444;border-radius:50%;border:2px solid white;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);color:white;"><svg style="width:14px;height:14px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg></div>`,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })

    const map = L.map(mapContainerRef.current).setView([start.lat, start.lng], 13)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    L.marker([start.lat, start.lng], { icon: startIcon }).addTo(map).bindPopup('<b>Starting Point</b><br>Your detected location.').openPopup()
    L.marker([end.lat, end.lng], { icon: endIcon }).addTo(map).bindPopup('<b>Destination</b>')

    const latDiff = end.lat - start.lat
    const lngDiff = end.lng - start.lng
    const pathPoints: [number, number][] = [
      [start.lat, start.lng],
      [start.lat + latDiff * 0.3, start.lng + lngDiff * 0.15],
      [start.lat + latDiff * 0.55, start.lng + lngDiff * 0.6],
      [start.lat + latDiff * 0.8, start.lng + lngDiff * 0.75],
      [end.lat, end.lng]
    ]

    L.polyline(pathPoints, {
      color: '#e11d48',
      weight: 5,
      opacity: 0.8,
      dashArray: '5, 10'
    }).addTo(map)

    const policeStations: [number, number][] = [
      [start.lat + latDiff * 0.3, start.lng + lngDiff * 0.15],
      [start.lat + latDiff * 0.8, start.lng + lngDiff * 0.75]
    ]
    policeStations.forEach((pos, idx) => {
      L.marker(pos, { icon: policeIcon }).addTo(map).bindPopup(`<b>Police Station ${idx + 1}</b><br>Emergency Help Point`)
    })

    const hospitalPos: [number, number] = [start.lat + latDiff * 0.55, start.lng + lngDiff * 0.6]
    L.marker(hospitalPos, { icon: hospitalIcon }).addTo(map).bindPopup('<b>Hospital Emergency Room</b><br>Available 24/7')

    const bounds = L.latLngBounds([
      [start.lat, start.lng],
      [end.lat, end.lng],
      ...policeStations,
      hospitalPos
    ])
    map.fitBounds(bounds, { padding: [30, 30] })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [start, end])

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200 shadow-md">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  )
}

export function RoutePlanning({ open: controlledOpen, onOpenChange }: RoutePlanningProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [routeAnalysis, setRouteAnalysis] = useState<RouteAnalysis | null>(null)
  const [startCoords, setStartCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [endCoords, setEndCoords] = useState<{ lat: number; lng: number } | null>(null)

  const handleGetRoute = async () => {
    if (!destination.trim()) {
      setError('Please enter a destination address')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      // Get current location
      const location = await getCurrentLocation()
      
      // Simulate route analysis (in real app, this would call an API)
      setTimeout(() => {
        const analysis: RouteAnalysis = {
          isSafe: true,
          safetyScore: 85,
          alerts: [
            'Well-lit route recommended',
            '2 police stations along the way',
            'Moderate traffic expected'
          ],
          nearbyPoliceStations: 2,
          nearbyHospitals: 3,
          recommendedRoute: 'safest'
        }
        
        setStartCoords(location)
        setEndCoords({
          lat: location.lat + 0.012,
          lng: location.lng + 0.016
        })
        setRouteAnalysis(analysis)
        setLoading(false)
      }, 1500)
      
    } catch (err) {
      console.error('Route planning error:', err)
      setError('Unable to get your location. Please enable location access.')
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setDestination('')
    setError('')
    setRouteAnalysis(null)
    setStartCoords(null)
    setEndCoords(null)
    setIsOpen(false)
  }

  return (
    <>
      {controlledOpen === undefined && (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          <Route className="w-4 h-4 mr-2" />
          Plan Safe Route
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Route className="w-5 h-5" />
              Plan Safe Route
            </DialogTitle>
            <DialogDescription>
              Plan your journey with AI-powered safety analysis
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Your Current Location Info */}
            <Alert className="bg-blue-50 border-blue-200">
              <MapPin className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-800">
                <strong>Starting Point:</strong> Your current location will be detected automatically
              </AlertDescription>
            </Alert>

            {/* Destination Input */}
            <div className="space-y-2">
              <label className="text-sm">Your Destination</label>
              <Input
                placeholder="Enter destination address..."
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value)
                  setError('')
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleGetRoute()
                  }
                }}
                className="text-base"
                disabled={loading}
              />
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Route Map (if available) */}
            {startCoords && endCoords && (
              <LeafletRouteMap start={startCoords} end={endCoords} />
            )}

            {/* Route Analysis (if available) */}
            {routeAnalysis && (
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h4 className="text-green-900">Route Safety Analysis</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600 text-xs mb-1">Safety Score</p>
                      <p className="text-green-600">{routeAnalysis.safetyScore}%</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600 text-xs mb-1">Recommended</p>
                      <p className="text-green-600 capitalize">{routeAnalysis.recommendedRoute} Route</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600 text-xs mb-1">Police Stations</p>
                      <p className="text-blue-600">{routeAnalysis.nearbyPoliceStations} nearby</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600 text-xs mb-1">Hospitals</p>
                      <p className="text-red-600">{routeAnalysis.nearbyHospitals} nearby</p>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2">Safety Alerts</p>
                    <ul className="space-y-1">
                      {routeAnalysis.alerts.map((alert, index) => (
                        <li key={index} className="text-xs text-gray-700 flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          <span>{alert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleGetRoute}
                disabled={loading || !destination.trim()}
                className="flex-1 bg-black hover:bg-gray-800 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Getting Route...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Route
                  </>
                )}
              </Button>
            </div>

            {/* Privacy Notice */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Privacy Protected:</strong> Your location is only used for route planning and is not stored or shared with anyone.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
