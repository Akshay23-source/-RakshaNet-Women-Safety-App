/**
 * Production Ready Banner
 * 
 * Shows when app is in development mode (SMS not configured)
 * Guides users to configure Twilio for real SMS delivery
 */

import React, { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Rocket, ExternalLink, X, MessageCircle, ArrowRight } from 'lucide-react'
import { ProductionSMSSetup } from './ProductionSMSSetup'

interface ProductionReadyBannerProps {
  onDismiss?: () => void
}

export function ProductionReadyBanner({ onDismiss }: ProductionReadyBannerProps) {
  const [showSetupGuide, setShowSetupGuide] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  if (isDismissed) return null

  return (
    <>
      <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-none shadow-lg">
        <div className="p-4 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg">Ready for production?</h3>
                  <Badge className="bg-white/20 text-white border-white/30">
                    Optional
                  </Badge>
                </div>
                
                <p className="text-blue-100 text-sm mb-3">
                  Configure Twilio in Supabase Dashboard to enable real SMS delivery
                </p>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => setShowSetupGuide(true)}
                    size="sm"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Setup Guide (10 min)
                  </Button>
                  
                  <Button
                    onClick={() => window.open('https://app.supabase.com/project/fjkuvwebluihzsoayxqj/auth/providers', '_blank')}
                    size="sm"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Supabase Dashboard
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>

                  <Button
                    onClick={() => window.open('/PRODUCTION_SMS_SETUP.md', '_blank')}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                  >
                    Documentation
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </div>

                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <div className="text-blue-100">Free Trial</div>
                      <div className="text-white">$15 credit</div>
                    </div>
                    <div>
                      <div className="text-blue-100">Setup Time</div>
                      <div className="text-white">10-15 min</div>
                    </div>
                    <div>
                      <div className="text-blue-100">Cost per SMS</div>
                      <div className="text-white">~$0.01</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleDismiss}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/10 h-8 w-8 p-0 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {showSetupGuide && (
        <ProductionSMSSetup onClose={() => setShowSetupGuide(false)} />
      )}
    </>
  )
}
