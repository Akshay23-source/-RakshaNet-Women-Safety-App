import React, { useState, useEffect } from 'react'
import { Wifi, ShieldAlert, ArrowDown, CheckCircle, Clock, Ban, Loader2, Signal } from 'lucide-react'
import type { SOS } from '../utils/types'

interface MeshNetworkHopsProps {
  sos: SOS | null
}

interface HopNode {
  name: string
  distance: string
  status: 'pending' | 'connecting' | 'declined' | 'accepted'
  reason?: string
}

export function MeshNetworkHops({ sos }: MeshNetworkHopsProps) {
  const [currentHop, setCurrentHop] = useState(0)
  const [hops, setHops] = useState<HopNode[]>([
    { name: 'Priya Sharma (Peer Node A)', distance: '0.5 km', status: 'pending' },
    { name: 'Anita Desai (Peer Node B)', distance: '0.8 km', status: 'pending' },
    { name: 'Kavya Reddy (Peer Node C)', distance: '1.2 km', status: 'pending' },
    { name: 'Police Station Dispatcher (Relayed)', distance: '2.5 km', status: 'pending' }
  ])

  useEffect(() => {
    if (!sos || sos.status !== 'ACTIVE') {
      setCurrentHop(0)
      return
    }

    // Reset hops on new SOS
    setHops([
      { name: 'Priya Sharma (Peer Node A)', distance: '0.5 km', status: 'connecting' },
      { name: 'Anita Desai (Peer Node B)', distance: '0.8 km', status: 'pending' },
      { name: 'Kavya Reddy (Peer Node C)', distance: '1.2 km', status: 'pending' },
      { name: 'Police Station Dispatcher (Relayed)', distance: '2.5 km', status: 'pending' }
    ])
    setCurrentHop(0)

    // Simulate hopping propagation
    const interval = setInterval(() => {
      setCurrentHop((prev) => {
        const next = prev + 1
        if (next >= 4) {
          clearInterval(interval)
          return prev
        }
        return next
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [sos])

  useEffect(() => {
    if (currentHop === 0) return

    setHops((prevHops) => {
      return prevHops.map((hop, idx) => {
        if (idx < currentHop) {
          // Previous hops were either declined or accepted (the last one)
          if (idx === 2) {
            return { ...hop, status: 'accepted' }
          }
          return {
            ...hop,
            status: 'declined',
            reason: idx === 0 ? 'Busy (on call)' : 'No answer (Device inactive)'
          }
        } else if (idx === currentHop) {
          return { ...hop, status: 'connecting' }
        }
        return hop
      })
    })
  }, [currentHop])

  if (!sos) return null

  const activeHopNode = hops.find(h => h.status === 'connecting' || h.status === 'accepted')
  const completed = currentHop >= 2

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-red-100">
      <div className="flex items-center justify-between mb-4 border-b pb-3">
        <h3 className="flex items-center gap-2 text-red-600 font-bold">
          <Wifi className="w-5 h-5 animate-pulse" />
          Mesh Network Propagation
        </h3>
        <Badge status={completed ? 'success' : 'alert'} />
      </div>

      <div className="p-3 bg-red-50 text-red-800 text-xs rounded-lg mb-4 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <strong>Mesh Network Active:</strong> Relaying SOS signal peer-to-peer (device-to-device) bypassing cellular network congestion.
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
        {/* Origin Node */}
        <div className="relative">
          <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Your Device (SOS Origin)</p>
            <p className="text-xs text-gray-500">Broadcasting emergency beacon</p>
          </div>
        </div>

        {/* Hops */}
        {hops.map((hop, index) => {
          let markerColor = 'bg-gray-200'
          let textColor = 'text-gray-400'
          let statusText = 'Waiting...'

          if (hop.status === 'connecting') {
            markerColor = 'bg-blue-500 animate-pulse'
            textColor = 'text-blue-900 font-semibold'
            statusText = 'Rerouting / Pinging Node...'
          } else if (hop.status === 'declined') {
            markerColor = 'bg-red-500'
            textColor = 'text-red-800 line-through'
            statusText = `Rerouted: ${hop.reason}`
          } else if (hop.status === 'accepted') {
            markerColor = 'bg-green-500'
            textColor = 'text-green-900 font-bold'
            statusText = 'Connected! Dispatching aid.'
          }

          return (
            <div key={index} className="relative transition-all duration-500">
              <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white shadow flex items-center justify-center ${markerColor}`}>
                {hop.status === 'accepted' && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                {hop.status === 'declined' && <Ban className="w-3.5 h-3.5 text-white" />}
                {hop.status === 'connecting' && <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />}
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm ${textColor}`}>{hop.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{statusText}</span>
                  </p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                  {hop.distance}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Signal className="w-3.5 h-3.5 text-green-600" />
          Multi-hop relay active
        </span>
        <span>Hops: {currentHop + 1}/4</span>
      </div>
    </div>
  )
}

function Badge({ status }: { status: 'success' | 'alert' }) {
  if (status === 'success') {
    return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-semibold">Help Found</span>
  }
  return <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-semibold animate-pulse">Hopping Network</span>
}
