import React, { useState } from 'react'
import { AlertTriangle, Radio } from 'lucide-react'
import { Button } from './ui/button'

interface SOSButtonProps {
  onActivate: () => void
  isActive: boolean
}

export function SOSButton({ onActivate, isActive }: SOSButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        className={`relative w-64 h-64 rounded-full transition-all duration-300 ${
          isActive
            ? 'bg-red-600 scale-110 animate-pulse'
            : 'bg-gradient-to-br from-red-500 to-red-700 hover:scale-105 active:scale-95'
        } shadow-2xl`}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onClick={onActivate}
        disabled={isActive}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          {isActive ? (
            <>
              <Radio className="w-16 h-16 mb-3 animate-spin" />
              <span className="text-2xl">SOS ACTIVE</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-20 h-20 mb-3" />
              <span className="text-3xl">SOS</span>
              <span className="text-sm mt-2 opacity-80">Press to activate</span>
            </>
          )}
        </div>
        
        {/* Ripple effect */}
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-500 opacity-50 animate-ping"></div>
            <div className="absolute inset-0 rounded-full bg-red-500 opacity-30 animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </>
        )}
      </button>
      
      <p className="text-center text-gray-600 max-w-xs">
        {isActive
          ? 'Emergency services alerted. Help is on the way.'
          : 'Tap to send instant SOS alert to emergency contacts and nearby helpers'}
      </p>
    </div>
  )
}
