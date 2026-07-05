import React from 'react'
import { ArrowLeft, BookOpen, Clock, Tag } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'

interface SafetyArticleDetailProps {
  article: {
    id: number
    title: string
    category: string
    readTime: string
  }
  onBack: () => void
}

const articleContent: Record<number, { sections: { heading: string; content: string[] }[] }> = {
  1: {
    sections: [
      {
        heading: 'Before You Travel',
        content: [
          'Share your travel details with trusted contacts including route, estimated arrival time, and mode of transport',
          'Fully charge your phone and carry a power bank',
          'Keep emergency numbers saved and easily accessible',
          'Dress appropriately and avoid wearing expensive jewelry',
          'Research your route and identify safe landmarks along the way'
        ]
      },
      {
        heading: 'During Night Travel',
        content: [
          'Choose well-lit and populated routes whenever possible',
          'Stay alert and avoid using headphones or getting distracted by your phone',
          'Sit near the driver or in well-lit areas in public transport',
          'Keep your belongings close and valuables hidden',
          'Trust your instincts - if something feels wrong, take action',
          'Use ride-tracking apps and share your live location with trusted contacts'
        ]
      },
      {
        heading: 'Transportation Safety',
        content: [
          'Use registered and verified taxi/ride-sharing services',
          'Check vehicle number matches the app before getting in',
          'Sit in the back seat and keep doors locked',
          'Have fake phone conversations if you feel unsafe',
          'Know the route and watch for deviations',
          'Have emergency SOS ready to activate if needed'
        ]
      },
      {
        heading: 'Emergency Preparedness',
        content: [
          'Keep pepper spray or safety alarm accessible',
          'Know how to use emergency features on your phone',
          'Memorize important emergency numbers (112, 100, 1091)',
          'Have offline maps downloaded for your area',
          'Keep some cash for emergencies',
          'Identify safe spaces like police stations, hospitals, and 24-hour establishments along your route'
        ]
      }
    ]
  },
  2: {
    sections: [
      {
        heading: 'Password Security',
        content: [
          'Use strong, unique passwords for each account (minimum 12 characters)',
          'Enable two-factor authentication (2FA) wherever available',
          'Never share passwords with anyone',
          'Use a password manager to securely store credentials',
          'Change passwords immediately if you suspect a breach',
          'Avoid using personal information in passwords'
        ]
      },
      {
        heading: 'Social Media Safety',
        content: [
          'Review and restrict privacy settings on all platforms',
          'Be cautious about sharing location information',
          'Don\'t accept friend requests from unknown people',
          'Avoid posting real-time updates about your location',
          'Be selective about what personal information you share publicly',
          'Report and block suspicious or harassing accounts immediately'
        ]
      },
      {
        heading: 'Online Harassment Protection',
        content: [
          'Document all harassment (screenshots, messages, emails)',
          'Block and report abusive users immediately',
          'Don\'t engage with trolls or harassers',
          'Report serious threats to platform administrators and police',
          'Inform trusted friends and family about the situation',
          'Consider temporarily deactivating accounts if harassment escalates'
        ]
      },
      {
        heading: 'Safe Browsing Practices',
        content: [
          'Only visit HTTPS websites (look for the padlock icon)',
          'Be wary of suspicious links and emails (phishing attempts)',
          'Keep software and apps updated with latest security patches',
          'Use VPN when on public Wi-Fi networks',
          'Install reputable antivirus software',
          'Clear browsing history and cookies regularly',
          'Be cautious when downloading files or apps'
        ]
      }
    ]
  },
  3: {
    sections: [
      {
        heading: 'Before Booking',
        content: [
          'Use only verified ride-sharing apps (Uber, Ola, Rapido)',
          'Check driver ratings and reviews before accepting ride',
          'Verify driver photo, name, and vehicle details match the app',
          'Share trip details with emergency contacts automatically',
          'Note the vehicle registration number',
          'Check estimated fare before confirming booking'
        ]
      },
      {
        heading: 'During the Ride',
        content: [
          'Always sit in the back seat',
          'Wear your seatbelt',
          'Keep car doors locked during the ride',
          'Track your route on the app and watch for deviations',
          'Avoid sharing personal information with the driver',
          'Stay alert - don\'t sleep or get distracted',
          'If driver makes you uncomfortable, ask them to stop in a safe, public area'
        ]
      },
      {
        heading: 'Safety Features to Use',
        content: [
          'Enable live location sharing in the app',
          'Use in-app emergency button if available',
          'Share OTP only after verifying vehicle details',
          'Rate and review drivers honestly after each ride',
          'Report any inappropriate behavior immediately',
          'Use "Share My Ride" feature with trusted contacts'
        ]
      },
      {
        heading: 'Red Flags to Watch For',
        content: [
          'Driver asks you to cancel the ride or pay cash',
          'Vehicle doesn\'t match app details',
          'Driver is aggressive or makes inappropriate comments',
          'Route deviates significantly without explanation',
          'Driver has additional passengers without your consent',
          'Driver refuses to use air conditioning and keeps windows closed',
          'Multiple calls from driver before pickup asking personal questions'
        ]
      }
    ]
  },
  4: {
    sections: [
      {
        heading: 'Environmental Awareness',
        content: [
          'Pay attention to your surroundings and people around you',
          'Identify emergency exits and safe spaces wherever you go',
          'Notice unusual behavior or suspicious activities',
          'Be aware of isolated areas and poorly lit spaces',
          'Trust your gut feeling - if something feels off, it probably is',
          'Keep mental notes of landmarks and safe locations'
        ]
      },
      {
        heading: 'Behavioral Red Flags',
        content: [
          'Someone following you for an extended period',
          'Unwanted persistent attention despite clear rejection',
          'Groups of people blocking your path',
          'Someone trying to isolate you from public spaces',
          'Aggressive or threatening body language',
          'Someone asking inappropriate personal questions',
          'People loitering near your residence or workplace without reason'
        ]
      },
      {
        heading: 'Situation Assessment',
        content: [
          'Evaluate the number of people around you',
          'Assess potential escape routes',
          'Identify people who might help if needed',
          'Consider your communication options (phone signal, people nearby)',
          'Check distance to safe locations (police station, hospital, shops)',
          'Be aware of time of day and lighting conditions',
          'Note any security cameras or well-lit areas'
        ]
      },
      {
        heading: 'Taking Action',
        content: [
          'Move to crowded, well-lit areas immediately if you feel unsafe',
          'Call a trusted contact and describe your location and situation',
          'Use confident body language - walk with purpose',
          'Make noise and attract attention if threatened',
          'Enter nearest shop, restaurant, or public building',
          'Don\'t hesitate to call police (100 or 112) if genuinely threatened',
          'Use emergency SOS features on your phone',
          'Trust your instincts - it\'s better to be overcautious'
        ]
      }
    ]
  }
}

export function SafetyArticleDetail({ article, onBack }: SafetyArticleDetailProps) {
  const content = articleContent[article.id] || { sections: [] }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Articles
      </Button>

      <Card className="p-6 md:p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4 border-b pb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Tag className="w-4 h-4" />
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                {article.category}
              </span>
              <Clock className="w-4 h-4 ml-2" />
              <span>{article.readTime} read</span>
            </div>
            
            <h1 className="text-red-600">{article.title}</h1>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BookOpen className="w-4 h-4" />
              <span>Comprehensive Safety Guide</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {content.sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  {section.heading}
                </h2>
                <ul className="space-y-3 ml-10">
                  {section.content.map((point, pointIdx) => (
                    <li key={pointIdx} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t pt-6 mt-8">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm">
                <strong className="text-orange-900">Remember:</strong>
                <span className="text-orange-800"> Your safety is paramount. These guidelines are meant to help you stay safe, but always trust your instincts and don't hesitate to seek help when needed. In case of emergency, call 112 (Emergency Services) or 100 (Police) immediately.</span>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
