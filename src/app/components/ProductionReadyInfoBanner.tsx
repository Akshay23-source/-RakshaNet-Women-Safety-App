/**
 * Production Ready Info Banner with Image
 * 
 * Shows the visual banner encouraging Twilio setup
 * Uses the imported Figma asset
 */

import React, { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { ExternalLink, X, FileText } from 'lucide-react'
import bannerImage from 'figma:asset/80e1d7087f45bd635c4907367922e15159713d0b.png'
import { ProductionSMSSetup } from './ProductionSMSSetup'

interface ProductionReadyInfoBannerProps {
  onDismiss?: () => void
  showDismissButton?: boolean
}

export function ProductionReadyInfoBanner({ 
  onDismiss, 
  showDismissButton = true 
}: ProductionReadyInfoBannerProps) {
  const [showSetup, setShowSetup] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  if (isDismissed) return null

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          {/* Banner Image */}
          <div 
            className="w-full bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center p-8 cursor-pointer"
            onClick={() => setShowSetup(true)}
          >
            <img 
              src={bannerImage} 
              alt="Ready for production? Configure Twilio in Supabase Dashboard to enable real SMS delivery"
              className="max-w-full h-auto rounded-lg shadow-sm"
            />
          </div>

          {/* Dismiss Button */}
          {showDismissButton && (
            <Button
              onClick={handleDismiss}
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t flex flex-wrap gap-2">
          <Button
            onClick={() => setShowSetup(true)}
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Setup Guide (10 min)
          </Button>
          
          <Button
            onClick={() => window.open('https://app.supabase.com/project/fjkuvwebluihzsoayxqj/auth/providers', '_blank')}
            size="sm"
            variant="outline"
            className="flex-1"
          >
            Supabase Dashboard
            <ExternalLink className="w-3 h-3 ml-2" />
          </Button>

          <Button
            onClick={() => window.open('/PRODUCTION_SMS_SETUP.md', '_blank')}
            size="sm"
            variant="outline"
          >
            <FileText className="w-3 h-3 mr-2" />
            Documentation
          </Button>
        </div>

        {/* Quick Info */}
        <div className="px-4 pb-4 grid grid-cols-3 gap-2 text-center text-xs text-gray-600">
          <div>
            <div className="text-lg text-blue-600">10-15</div>
            <div>minutes</div>
          </div>
          <div>
            <div className="text-lg text-green-600">$15</div>
            <div>free trial</div>
          </div>
          <div>
            <div className="text-lg text-purple-600">$0.01</div>
            <div>per SMS</div>
          </div>
        </div>
      </Card>

      {/* Setup Wizard */}
      {showSetup && (
        <ProductionSMSSetup onClose={() => setShowSetup(false)} />
      )}
    </>
  )
}
