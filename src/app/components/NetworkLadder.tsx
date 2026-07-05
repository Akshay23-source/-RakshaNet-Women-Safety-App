import React from 'react'
import { Phone, Wifi, Radio, Satellite, CheckCircle, Circle, Loader2 } from 'lucide-react'
import type { SOS } from '../utils/types'

interface NetworkLadderProps {
  sos: SOS | null
}

const stages = [
  { id: 'CONTACT', label: 'Emergency Contacts', icon: Phone, color: 'text-blue-500' },
  { id: 'MESH', label: 'Nearby Helpers (Mesh)', icon: Wifi, color: 'text-green-500' },
  { id: 'ESP', label: 'ESP Network', icon: Radio, color: 'text-purple-500' },
  { id: 'LORA', label: 'LoRa Network', icon: Radio, color: 'text-orange-500' },
  { id: 'SATELLITE', label: 'Satellite Backup', icon: Satellite, color: 'text-red-500' },
]

export function NetworkLadder({ sos }: NetworkLadderProps) {
  if (!sos) return null
  
  const currentStageIndex = stages.findIndex(s => s.id === sos.networkStage)
  
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
      <h3 className="mb-4 text-center">Network Status</h3>
      
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const Icon = stage.icon
          const isComplete = index < currentStageIndex || sos.networkStage === 'DELIVERED'
          const isCurrent = index === currentStageIndex && sos.status === 'ACTIVE'
          const isPending = index > currentStageIndex
          
          return (
            <div
              key={stage.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                isComplete
                  ? 'bg-green-50 border border-green-200'
                  : isCurrent
                  ? 'bg-blue-50 border border-blue-300 animate-pulse'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className={`flex-shrink-0 ${stage.color}`}>
                {isComplete ? (
                  <CheckCircle className="w-6 h-6" />
                ) : isCurrent ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Circle className="w-6 h-6 opacity-30" />
                )}
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${stage.color}`} />
                  <span className={isComplete || isCurrent ? '' : 'text-gray-400'}>
                    {stage.label}
                  </span>
                </div>
                {isCurrent && (
                  <p className="text-xs text-blue-600 mt-1">Connecting...</p>
                )}
                {isComplete && (
                  <p className="text-xs text-green-600 mt-1">Connected ✓</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {sos.status === 'ACTIVE' && sos.networkStage === 'DELIVERED' && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-center">
          <p className="text-green-800">✓ SOS Successfully Delivered</p>
          {sos.respondedBy && (
            <p className="text-sm text-green-700 mt-1">Helper responding</p>
          )}
        </div>
      )}
    </div>
  )
}
