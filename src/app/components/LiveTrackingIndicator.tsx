import React, { useEffect, useState } from 'react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Navigation, MapPin, Signal, Clock, Users } from 'lucide-react'
import { motion } from 'motion/react'

interface LiveTrackingIndicatorProps {
  isActive: boolean
  updateCount: number
  lastUpdateTime?: string
  contactCount?: number
}

export function LiveTrackingIndicator({ 
  isActive, 
  updateCount, 
  lastUpdateTime,
  contactCount = 0
}: LiveTrackingIndicatorProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    if (!isActive) {
      setElapsedSeconds(0)
      return
    }

    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive])

  if (!isActive) return null

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 shadow-lg">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Navigation className="w-5 h-5 text-green-600" />
            </motion.div>
            <h3 className="text-green-900">Live Location Tracking</h3>
          </div>
          <Badge className="bg-green-600 hover:bg-green-600 animate-pulse">
            ACTIVE
          </Badge>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Update Count */}
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-green-200">
            <Signal className="w-4 h-4 text-green-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Updates Sent</p>
              <p className="text-green-900">{updateCount}</p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-green-200">
            <Clock className="w-4 h-4 text-green-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Duration</p>
              <p className="text-green-900">{formatDuration(elapsedSeconds)}</p>
            </div>
          </div>

          {/* Contacts Notified */}
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-green-200">
            <Users className="w-4 h-4 text-green-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Contacts</p>
              <p className="text-green-900">{contactCount}</p>
            </div>
          </div>

          {/* Next Update */}
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-green-200">
            <MapPin className="w-4 h-4 text-green-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Next Update</p>
              <p className="text-green-900 text-xs">~{20 - (elapsedSeconds % 20)}s</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 p-3 bg-green-100 border border-green-300 rounded-lg">
          <Signal className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1">
            <p className="text-xs text-green-800">
              <strong>Live Tracking Active:</strong> Your emergency contacts are receiving your real-time location every 20 seconds.
            </p>
            {lastUpdateTime && (
              <p className="text-xs text-green-700 mt-1">
                Last update: {new Date(lastUpdateTime).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {/* Pulsing Indicator */}
        <div className="flex items-center justify-center gap-2">
          <motion.div
            className="w-3 h-3 bg-green-600 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <span className="text-xs text-green-700">Sharing live location with helpers and police</span>
        </div>
      </div>
    </Card>
  )
}
