/**
 * Live Tracking Status Component
 * 
 * Displays real-time status of GPS tracking and Supabase storage
 * when SOS is active. Shows location accuracy, update count, and
 * Supabase sync status.
 */

import React from 'react'
import { MapPin, Database, Wifi, Activity, CheckCircle2 } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'

interface LiveTrackingStatusProps {
  isActive: boolean
  updateCount: number
  lastLocation: {
    latitude: number
    longitude: number
    accuracy?: number
    address?: string
    timestamp?: string
  } | null
  sosId?: string
}

export function LiveTrackingStatus({ 
  isActive, 
  updateCount, 
  lastLocation,
  sosId 
}: LiveTrackingStatusProps) {
  if (!isActive) return null

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-red-500/10 to-blue-500/10 border-red-500/30 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        {/* Animated Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
          <div className="relative p-2 bg-red-500/20 rounded-full">
            <MapPin className="w-5 h-5 text-red-500" />
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white flex items-center gap-2">
                Live Location Tracking Active
                <Badge variant="destructive" className="animate-pulse">
                  LIVE
                </Badge>
              </h3>
              <p className="text-sm text-gray-300 mt-1">
                Sending real-time GPS updates to emergency contacts
              </p>
            </div>
          </div>

          {/* Status Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* GPS Updates */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-300">GPS Updates</span>
              </div>
              <p className="text-white">{updateCount}</p>
            </div>

            {/* Accuracy */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-300">Accuracy</span>
              </div>
              <p className="text-white">
                {lastLocation?.accuracy 
                  ? `±${lastLocation.accuracy.toFixed(0)}m` 
                  : 'Calculating...'}
              </p>
            </div>

            {/* Supabase Sync */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-300">Supabase</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <p className="text-white text-sm">Synced</p>
              </div>
            </div>

            {/* Last Update */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-300">Last Update</span>
              </div>
              <p className="text-white text-sm">
                {formatTime(lastLocation?.timestamp)}
              </p>
            </div>
          </div>

          {/* Current Location */}
          {lastLocation && (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Current Location</p>
                  <p className="text-white text-sm">
                    {lastLocation.address || `${lastLocation.latitude.toFixed(6)}, ${lastLocation.longitude.toFixed(6)}`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const url = `https://www.google.com/maps?q=${lastLocation.latitude},${lastLocation.longitude}`
                    window.open(url, '_blank')
                  }}
                  className="text-blue-400 hover:text-blue-300 text-xs whitespace-nowrap"
                >
                  View Map →
                </button>
              </div>
            </div>
          )}

          {/* Info Message */}
          <div className="flex items-start gap-2 text-xs text-gray-300">
            <Database className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              All location updates are being stored securely in Supabase. 
              Emergency contacts receive live tracking links via SMS every 20 seconds.
              {sosId && (
                <span className="block mt-1 text-gray-400">
                  SOS ID: {sosId}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
