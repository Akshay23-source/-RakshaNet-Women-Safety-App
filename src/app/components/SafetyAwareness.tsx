import React, { useState } from 'react'
import { ShieldAlert, AlertTriangle, Eye, Map, Phone, Clock, Users, Home, Shield } from 'lucide-react'
import { Card } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

const safetyTopics = [
  {
    id: 'travel',
    title: 'Travel Safety',
    icon: Map,
    color: 'blue',
    sections: [
      {
        heading: 'Night Travel Precautions',
        content: [
          'Always inform someone about your travel plans and expected arrival time',
          'Use trusted transportation services with verified drivers',
          'Share your live location with family or friends',
          'Keep emergency contacts on speed dial',
          'Avoid isolated areas and dimly lit streets',
          'Trust your instincts - if something feels wrong, it probably is'
        ]
      },
      {
        heading: 'Public Transport Safety',
        content: [
          'Sit near the driver or conductor in buses',
          'Avoid empty compartments in trains',
          'Keep your belongings close and secure',
          'Stay alert and avoid distractions like headphones',
          'Note the vehicle number and driver details',
          'Use women-only compartments when available'
        ]
      },
      {
        heading: 'Ride-Sharing Guidelines',
        content: [
          'Verify driver details match the app before entering',
          'Share trip details with trusted contacts',
          'Sit in the back seat',
          'Keep doors locked during the ride',
          'Follow your route on GPS',
          'Report any suspicious behavior immediately'
        ]
      }
    ]
  },
  {
    id: 'awareness',
    title: 'Situational Awareness',
    icon: Eye,
    color: 'purple',
    sections: [
      {
        heading: 'Environmental Awareness',
        content: [
          'Always be aware of your surroundings',
          'Identify safe spaces and exit routes wherever you go',
          'Notice people around you and their behavior',
          'Avoid using your phone while walking in unfamiliar areas',
          'Walk confidently and purposefully',
          'Make eye contact to show awareness'
        ]
      },
      {
        heading: 'Recognizing Threats',
        content: [
          'Trust your gut feelings about people and situations',
          'Be cautious of people who stand too close or follow you',
          'Watch for unusual behavior or persistent attention',
          'Be alert to people asking suspicious questions',
          'Notice vehicles that slow down or follow you',
          'Be wary of overly friendly strangers'
        ]
      },
      {
        heading: 'Prevention Strategies',
        content: [
          'Vary your daily routines and routes',
          'Avoid sharing personal information with strangers',
          'Keep valuables hidden',
          'Stay in well-lit, populated areas',
          'Walk facing traffic to see approaching vehicles',
          'Carry a personal safety alarm'
        ]
      }
    ]
  },
  {
    id: 'digital',
    title: 'Digital Safety',
    icon: Shield,
    color: 'green',
    sections: [
      {
        heading: 'Online Privacy',
        content: [
          'Use strong, unique passwords for all accounts',
          'Enable two-factor authentication',
          'Be cautious about sharing location on social media',
          'Review privacy settings regularly',
          'Don\'t accept friend requests from unknown people',
          'Be careful about sharing personal details online'
        ]
      },
      {
        heading: 'Cyberstalking Prevention',
        content: [
          'Block and report suspicious accounts immediately',
          'Don\'t engage with trolls or harassers',
          'Keep evidence of harassment (screenshots)',
          'Limit who can see your posts and information',
          'Use separate email for online shopping',
          'Be cautious with dating apps and meet in public places'
        ]
      },
      {
        heading: 'Digital Footprint',
        content: [
          'Google yourself to see what information is public',
          'Remove old posts that reveal too much information',
          'Don\'t post real-time location updates',
          'Be careful with check-ins at regular locations',
          'Review tagged photos and untag if necessary',
          'Use privacy-focused browsers and VPNs when needed'
        ]
      }
    ]
  },
  {
    id: 'home',
    title: 'Home Safety',
    icon: Home,
    color: 'orange',
    sections: [
      {
        heading: 'Door Security',
        content: [
          'Always use peepholes before opening doors',
          'Install chain locks and deadbolts',
          'Verify service personnel identity before allowing entry',
          'Don\'t open doors to strangers when alone',
          'Keep keys secure and don\'t hide them outside',
          'Consider installing a doorbell camera'
        ]
      },
      {
        heading: 'Living Alone Safety',
        content: [
          'Don\'t advertise that you live alone',
          'Keep curtains/blinds closed at night',
          'Install good lighting around entry points',
          'Have emergency numbers easily accessible',
          'Know your neighbors and build a support network',
          'Keep your phone charged and nearby at night'
        ]
      },
      {
        heading: 'Emergency Preparedness',
        content: [
          'Have a safety plan and practice it',
          'Keep emergency supplies accessible',
          'Install smoke detectors and check them regularly',
          'Know your building\'s emergency exits',
          'Have a safe room or escape route planned',
          'Keep important documents in a secure place'
        ]
      }
    ]
  },
  {
    id: 'workplace',
    title: 'Workplace Safety',
    icon: Users,
    color: 'red',
    sections: [
      {
        heading: 'Harassment Prevention',
        content: [
          'Know your company\'s harassment policy',
          'Document any inappropriate behavior',
          'Report incidents to HR or management',
          'Set clear professional boundaries',
          'Don\'t ignore or minimize inappropriate comments',
          'Seek support from colleagues or unions if needed'
        ]
      },
      {
        heading: 'Late Hours Safety',
        content: [
          'Arrange safe transportation if working late',
          'Work in well-lit areas',
          'Inform security when leaving late',
          'Walk with colleagues to parking areas',
          'Keep office doors locked when working alone',
          'Have emergency contacts programmed'
        ]
      },
      {
        heading: 'Professional Boundaries',
        content: [
          'Keep work relationships professional',
          'Avoid one-on-one meetings in isolated areas',
          'Trust your instincts about uncomfortable situations',
          'Don\'t feel pressured to socialize outside comfort zone',
          'Know your rights under workplace safety laws',
          'Maintain documentation of work communications'
        ]
      }
    ]
  }
]

const emergencyTips = [
  {
    situation: 'Being Followed',
    actions: [
      'Don\'t go home - go to a public, well-lit area',
      'Call the police immediately',
      'Enter a store or restaurant and ask for help',
      'Make noise to attract attention',
      'Take note of the person\'s appearance',
      'Share your location with emergency contacts'
    ]
  },
  {
    situation: 'Uncomfortable Situation',
    actions: [
      'Trust your instincts - leave immediately',
      'Make an excuse to get away',
      'Call someone and speak loudly about where you are',
      'Go to a crowded area',
      'Ask for help from authorities or security',
      'Activate your safety app or panic button'
    ]
  },
  {
    situation: 'Lost or Stranded',
    actions: [
      'Stay in a safe, visible location',
      'Call emergency contacts or police',
      'Don\'t accept help from strangers',
      'Use your phone to share location',
      'Stay near CCTV cameras if possible',
      'Keep your phone charged and accessible'
    ]
  }
]

export function SafetyAwareness() {
  const [selectedTopic, setSelectedTopic] = useState<string>('travel')

  const currentTopic = safetyTopics.find(t => t.id === selectedTopic)

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-red-600" />
          <h2 className="text-red-600">Women Safety Awareness</h2>
        </div>
        <p className="text-sm text-gray-600">
          Essential safety information and awareness tips for women
        </p>
      </div>

      {/* Topic Tabs */}
      <Tabs value={selectedTopic} onValueChange={setSelectedTopic} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 h-auto">
          {safetyTopics.map((topic) => {
            const Icon = topic.icon
            return (
              <TabsTrigger
                key={topic.id}
                value={topic.id}
                className="flex flex-col items-center gap-1 py-3"
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{topic.title}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {safetyTopics.map((topic) => {
          const Icon = topic.icon
          return (
            <TabsContent key={topic.id} value={topic.id} className="space-y-4 mt-6">
              {/* Topic Header */}
              <Card className={`bg-gradient-to-r from-${topic.color}-50 to-${topic.color}-100 border-${topic.color}-200`}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 bg-${topic.color}-600 rounded-full flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3>{topic.title}</h3>
                  </div>
                  <p className="text-sm text-gray-700">
                    Important safety guidelines and awareness tips
                  </p>
                </div>
              </Card>

              {/* Topic Sections */}
              <Accordion type="single" collapsible className="space-y-3">
                {topic.sections.map((section, index) => (
                  <AccordionItem key={index} value={`section-${index}`} className="border rounded-lg">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{index + 1}</Badge>
                        <span>{section.heading}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <ul className="space-y-3">
                        {section.content.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          )
        })}
      </Tabs>

      {/* Emergency Response Tips */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h3>Emergency Response Guide</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {emergencyTips.map((tip, index) => (
            <Card key={index} className="p-4 border-orange-200 bg-orange-50">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-sm">{tip.situation}</h4>
                </div>
                <ul className="space-y-2">
                  {tip.actions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-1 h-1 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Access Numbers */}
      <Card className="bg-red-50 border-red-200">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-red-600" />
            <h3 className="text-red-700">Emergency Numbers</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Emergency', number: '112' },
              { name: 'Police', number: '100' },
              { name: 'Women Helpline', number: '1091' },
              { name: 'NCW', number: '7827-170-170' }
            ].map((contact) => (
              <div key={contact.number} className="text-center p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-600">{contact.name}</p>
                <p className="text-red-600">{contact.number}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Remember Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h4 className="text-purple-900">Remember</h4>
              <p className="text-sm text-purple-800">
                Your safety is paramount. Never hesitate to seek help, trust your instincts, 
                and prioritize your well-being over social niceties. It's always better to be 
                safe than sorry. Stay alert, stay aware, and stay safe!
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
