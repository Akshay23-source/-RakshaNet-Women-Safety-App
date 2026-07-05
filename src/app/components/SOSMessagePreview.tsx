import React, { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { MessageCircle, MapPin, Copy, Check, Eye } from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { generateSOSMessage, generateLocationLink } from '../utils/sms-alert'
import type { Location } from '../utils/types'

interface SOSMessagePreviewProps {
  userName?: string
  location?: Location | null
}

export function SOSMessagePreview({ userName = 'Your Name', location }: SOSMessagePreviewProps) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  
  // Use provided location or demo location
  const demoLocation: Location = location || {
    latitude: 28.7041,
    longitude: 77.1025,
    address: '123 Main Street, Connaught Place, New Delhi, India'
  }
  
  // Generate the SMS message
  const messageData = {
    userName,
    location: demoLocation,
    timestamp: new Date().toISOString(),
    emergencyType: 'EMERGENCY'
  }
  
  const message = generateSOSMessage(messageData)
  const mapLink = generateLocationLink(demoLocation)
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      toast.success('Message copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy message')
    }
  }
  
  const handleOpenMap = () => {
    window.open(mapLink, '_blank')
    toast.success('Opening location in Google Maps')
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700">
          <Eye className="w-4 h-4 mr-2" />
          Preview SMS Message
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            SOS Message Preview
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Info Banner */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              This is what your emergency contacts will receive when you activate SOS.
            </p>
          </div>
          
          {/* Phone Message Preview */}
          <div className="relative">
            {/* Phone Frame */}
            <div className="border-4 border-gray-800 rounded-3xl p-4 bg-white shadow-xl">
              {/* Phone Status Bar */}
              <div className="flex items-center justify-between mb-3 text-xs text-gray-600">
                <span>9:41 AM</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-3 bg-gray-400 rounded-sm"></div>
                  <div className="w-4 h-3 bg-gray-400 rounded-sm"></div>
                  <div className="w-4 h-3 bg-gray-400 rounded-sm"></div>
                </div>
              </div>
              
              {/* SMS Header */}
              <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">
                  🚨
                </div>
                <div>
                  <p className="text-sm">RakshaNet Safety Alert</p>
                  <p className="text-xs text-gray-500">Emergency Contact</p>
                </div>
              </div>
              
              {/* Message Bubble */}
              <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4">
                <div className="space-y-2">
                  {/* Emergency Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-red-600 hover:bg-red-600">
                      EMERGENCY ALERT
                    </Badge>
                  </div>
                  
                  {/* Message Content */}
                  <pre className="text-sm text-gray-900 whitespace-pre-wrap font-sans">
                    {message}
                  </pre>
                </div>
                
                {/* Time */}
                <p className="text-xs text-gray-500 text-right mt-2">
                  Just now
                </p>
              </div>
              
              {/* iMessage Actions */}
              <div className="flex gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 text-xs"
                  onClick={handleOpenMap}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  View Map
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 text-xs"
                  onClick={() => {
                    toast.success('In real scenario, this would open phone dialer')
                  }}
                >
                  📞 Call
                </Button>
              </div>
            </div>
          </div>
          
          {/* Location Details */}
          <Card className="p-3 bg-green-50 border-green-200">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-green-900">Location Included</p>
                <p className="text-xs text-green-700 truncate">
                  {demoLocation.address || `${demoLocation.latitude}, ${demoLocation.longitude}`}
                </p>
                <a 
                  href={mapLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-green-600 hover:underline inline-flex items-center gap-1 mt-1"
                >
                  <MapPin className="w-3 h-3" />
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="flex-1"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Message
                </>
              )}
            </Button>
            
            <Button
              onClick={handleOpenMap}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Open Location
            </Button>
          </div>
          
          {/* Info Note */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              💡 <strong>Note:</strong> This preview uses {location ? 'your current' : 'demo'} location data. 
              The actual message will include your real-time GPS coordinates when SOS is triggered.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
