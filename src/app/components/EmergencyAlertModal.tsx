import React from 'react'
import { X, Bell, MessageCircle, Mail, Camera, Users, Share2, Check, Phone } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { toast } from 'sonner@2.0.3'
import { copyToClipboard } from '../utils/clipboard'

interface EmergencyAlertModalProps {
  open: boolean
  onClose: () => void
  userLocation?: { lat: number; lng: number } | null
  userName?: string
}

export function EmergencyAlertModal({ open, onClose, userLocation, userName = 'User' }: EmergencyAlertModalProps) {
  const generateEmergencyMessage = () => {
    const locationStr = userLocation 
      ? `Location: https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`
      : 'Location: Not available'
    
    return `🚨 EMERGENCY ALERT from ${userName}!\n\nI need immediate help!\n${locationStr}\n\nPlease respond or contact authorities.\n\n- Sent via RakshaNet Safety App`
  }

  const canUseWebShare = (data: ShareData): boolean => {
    try {
      // Check if Web Share API is available
      if (!navigator.share) return false
      
      // Check if canShare is available (not all browsers support it)
      if (navigator.canShare) {
        return navigator.canShare(data)
      }
      
      // If canShare is not available, assume share is supported if navigator.share exists
      return true
    } catch (err) {
      return false
    }
  }

  const handleShare = (platform: string) => {
    const message = generateEmergencyMessage()
    const encodedMessage = encodeURIComponent(message)
    
    let url = ''
    
    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedMessage}`
        toast.success('Opening WhatsApp...')
        break
      case 'sms':
        url = `sms:?body=${encodedMessage}`
        toast.success('Opening SMS...')
        break
      case 'email':
        url = `mailto:?subject=${encodeURIComponent('🚨 EMERGENCY ALERT!')}&body=${encodedMessage}`
        toast.success('Opening Email...')
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedMessage}`
        toast.success('Opening Facebook...')
        break
      case 'instagram':
        // Instagram doesn't have direct web share, copy to clipboard instead
        copyToClipboard(message).then((success) => {
          if (success) {
            toast.success('Emergency message copied! Open Instagram to share.')
          } else {
            toast.error('Failed to copy message. Please try manually.')
          }
        })
        return
      case 'contacts':
        // Trigger native share if available
        if (canUseWebShare({ title: '🚨 EMERGENCY ALERT', text: message })) {
          navigator.share({
            title: '🚨 EMERGENCY ALERT',
            text: message
          }).then(() => {
            toast.success('Shared successfully!')
          }).catch((err) => {
            // Silently handle permission errors and user cancellations
            // Only show error if it's not a user abort
            if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
              copyToClipboard(message).then((success) => {
                if (success) {
                  toast.success('Emergency message copied to clipboard!')
                }
              })
            } else if (err.name === 'NotAllowedError') {
              // Permission denied, fall back to clipboard
              copyToClipboard(message).then((success) => {
                if (success) {
                  toast.success('Emergency message copied to clipboard!')
                }
              })
            }
          })
        } else {
          copyToClipboard(message).then((success) => {
            if (success) {
              toast.success('Emergency message copied to clipboard!')
            } else {
              toast.error('Failed to copy message. Please try manually.')
            }
          })
        }
        return
      case 'more':
        // Use native share sheet if available
        if (canUseWebShare({ title: '🚨 EMERGENCY ALERT', text: message })) {
          navigator.share({
            title: '🚨 EMERGENCY ALERT',
            text: message
          }).then(() => {
            toast.success('Shared successfully!')
          }).catch((err) => {
            // Silently handle permission errors and user cancellations
            // Only show error if it's not a user abort
            if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
              copyToClipboard(message).then((success) => {
                if (success) {
                  toast.success('Emergency message copied! You can share it anywhere.')
                }
              })
            } else if (err.name === 'NotAllowedError') {
              // Permission denied, fall back to clipboard
              copyToClipboard(message).then((success) => {
                if (success) {
                  toast.success('Emergency message copied! You can share it anywhere.')
                }
              })
            }
          })
        } else {
          copyToClipboard(message).then((success) => {
            if (success) {
              toast.success('Emergency message copied! You can share it anywhere.')
            } else {
              toast.error('Failed to copy message. Please try manually.')
            }
          })
        }
        return
    }
    
    if (url) {
      window.open(url, '_blank')
    }
  }

  const shareOptions = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      color: 'text-green-600'
    },
    {
      id: 'sms',
      label: 'SMS',
      icon: <MessageCircle className="w-8 h-8" />,
      color: 'text-blue-600'
    },
    {
      id: 'email',
      label: 'Email',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      ),
      color: 'text-cyan-600'
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'text-blue-700'
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: <Camera className="w-8 h-8" />,
      color: 'text-pink-600'
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: <Users className="w-8 h-8" />,
      color: 'text-blue-600'
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600">
            <Bell className="w-6 h-6" />
            <DialogTitle className="text-red-600">Emergency Alert Contacts</DialogTitle>
          </div>
          <DialogDescription>
            Share your emergency alert through your preferred communication channel
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-700 text-sm">
            Choose how to share your emergency alert:
          </p>

          {/* Share Options Grid */}
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleShare(option.id)}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all border border-gray-200 hover:border-gray-300"
              >
                <div className={option.color}>
                  {option.icon}
                </div>
                <span className="text-sm text-gray-900">{option.label}</span>
              </button>
            ))}
          </div>

          {/* More Sharing Options */}
          <Button
            onClick={() => handleShare('more')}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            <Share2 className="w-4 h-4 mr-2" />
            More Sharing Options
          </Button>

          {/* Confirmation Message */}
          <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  SOS EMERGENCY ACTIVATED!
                </p>
                <p className="text-xs text-green-700 mt-1">
                  All emergency systems activated: Buzzer, GPS, and Contact Alerts!
                </p>
              </div>
            </div>
          </div>
          
          {/* Auto SMS Alert Info */}
          <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-800 font-medium">
                  📱 Auto SMS Alerts Sent!
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Your trusted contacts are receiving SMS with your location automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
