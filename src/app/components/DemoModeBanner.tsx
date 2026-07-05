import React from 'react'
import { Info, Database } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'

interface DemoModeBannerProps {
  isVisible: boolean
  onDismiss?: () => void
}

export function DemoModeBanner({ isVisible, onDismiss }: DemoModeBannerProps) {
  if (!isVisible) return null
  
  return (
    <Alert className="mb-4 border-blue-300 bg-blue-50">
      <Database className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-800">
            <strong>Demo Mode Active:</strong> Backend API is not connected. All features work with simulated data. Your safety features remain fully functional!
          </span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-blue-600 hover:text-blue-800 text-sm underline ml-4 whitespace-nowrap"
          >
            Dismiss
          </button>
        )}
      </AlertDescription>
    </Alert>
  )
}
