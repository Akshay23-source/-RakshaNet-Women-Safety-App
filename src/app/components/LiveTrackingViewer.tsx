/**
 * Live Tracking Viewer Component
 * 
 * Public page that emergency contacts can access to view real-time location
 * updates when someone triggers SOS. Updates automatically every 20 seconds.
 */

import React, { useState, useEffect } from 'react'
import { MapPin, Clock, Navigation, Activity, AlertCircle } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { 
  getTrackingSession, 
  getLocationHistory, 
  subscribeToLocationUpdates,
  type LocationUpdate,
  type LiveTrackingSession 
} from '../utils/supabase/location-tracking'

interface LiveTrackingViewerProps {
  sosId: string
}

export function LiveTrackingViewer({ sosId }: LiveTrackingViewerProps) {
  const [session, setSession] = useState<LiveTrackingSession | null>(null)
  const [locations, setLocations] = useState<LocationUpdate[]>([])
  const [latestLocation, setLatestLocation] = useState<LocationUpdate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTrackingData()
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToLocationUpdates(
      sosId,
      (location) => {
        console.log('📍 Received real-time location update:', location)
        setLatestLocation(location)
        setLocations(prev => [location, ...prev].slice(0, 50))
      },
      (err) => {
        console.error('Subscription error:', err)
        setError('Failed to subscribe to location updates')
      }
    )

    return () => {
      unsubscribe()
    }
  }, [sosId])

  const loadTrackingData = async () => {
    try {
      setIsLoading(true)
      
      // Load tracking session info
      const sessionData = await getTrackingSession(sosId)
      if (!sessionData) {
        setError('Tracking session not found')
        return
      }
      setSession(sessionData)
      
      // Load location history
      const history = await getLocationHistory(sosId, 50)
      setLocations(history)
      
      if (history.length > 0) {
        setLatestLocation(history[0])
      }
      
      setIsLoading(false)
    } catch (err) {
      console.error('Error loading tracking data:', err)
      setError('Failed to load tracking data')
      setIsLoading(false)
    }
  }

  const openInMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  const formatTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
        <Card className="p-8 max-w-md w-full bg-white/10 backdrop-blur-lg border-white/20">
          <div className="text-center">
            <Activity className="w-12 h-12 text-blue-400 animate-pulse mx-auto mb-4" />
            <p className="text-white">Loading live tracking data...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
        <Card className="p-8 max-w-md w-full bg-white/10 backdrop-blur-lg border-white/20">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl text-white mb-2">Tracking Not Available</h2>
            <p className="text-gray-300">{error || 'Unable to load tracking data'}</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500/20 rounded-full">
              <MapPin className="w-8 h-8 text-red-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl text-white">Live Emergency Tracking</h1>
              <p className="text-gray-300">{session.user_name}</p>
            </div>
            <Badge 
              variant={session.is_active ? "default" : "secondary"}
              className={session.is_active ? "bg-red-500" : ""}
            >
              {session.is_active ? (
                <>
                  <span className="animate-pulse mr-2">🔴</span>
                  ACTIVE
                </>
              ) : (
                'ENDED'
              )}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Started</p>
              <p className="text-white">{formatTime(session.started_at)}</p>
            </div>
            <div>
              <p className="text-gray-400">Last Update</p>
              <p className="text-white">{formatTimeAgo(session.last_update_at)}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Updates</p>
              <p className="text-white">{session.total_updates}</p>
            </div>
            <div>
              <p className="text-gray-400">SOS ID</p>
              <p className="text-white text-xs">{session.sos_id}</p>
            </div>
          </div>
        </Card>

        {/* Latest Location */}
        {latestLocation && (
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
            <div className="flex items-start gap-3 mb-4">
              <Navigation className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-xl text-white mb-1">Current Location</h2>
                <p className="text-gray-300 text-sm">
                  {latestLocation.address || 'Address unavailable'}
                </p>
              </div>
              <button
                onClick={() => openInMaps(latestLocation.latitude, latestLocation.longitude)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Open in Maps
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-gray-400 mb-1">Latitude</p>
                <p className="text-white">{latestLocation.latitude.toFixed(6)}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-gray-400 mb-1">Longitude</p>
                <p className="text-white">{latestLocation.longitude.toFixed(6)}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-gray-400 mb-1">Accuracy</p>
                <p className="text-white">
                  {latestLocation.accuracy ? `±${latestLocation.accuracy.toFixed(0)}m` : 'N/A'}
                </p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-gray-400 mb-1">Speed</p>
                <p className="text-white">
                  {latestLocation.speed 
                    ? `${(latestLocation.speed * 3.6).toFixed(1)} km/h` 
                    : 'Stationary'}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-300">
              <Clock className="w-4 h-4" />
              <span>Last updated: {formatTime(latestLocation.timestamp)}</span>
            </div>
          </Card>
        )}

        {/* Location History */}
        <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
          <h2 className="text-xl text-white mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6" />
            Location History ({locations.length})
          </h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {locations.map((location, index) => (
              <div
                key={location.id || index}
                className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => openInMaps(location.latitude, location.longitude)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-white mb-1">
                      {location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{formatTime(location.timestamp)}</span>
                      {location.accuracy && (
                        <span>±{location.accuracy.toFixed(0)}m</span>
                      )}
                      {location.speed && location.speed > 0 && (
                        <span>{(location.speed * 3.6).toFixed(1)} km/h</span>
                      )}
                    </div>
                  </div>
                  <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Auto-refresh notice */}
        {session.is_active && (
          <div className="text-center text-sm text-gray-400 pb-6">
            <Activity className="w-4 h-4 inline-block animate-pulse mr-2" />
            Location updates automatically every 20 seconds
          </div>
        )}
      </div>
    </div>
  )
}
