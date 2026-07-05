import React, { useState } from 'react'
import { Heart, AlertCircle, Thermometer, Pill, Zap, Brain, Activity } from 'lucide-react'
import { Card } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Alert, AlertDescription } from './ui/alert'

const firstAidTopics = [
  {
    id: 'cpr',
    title: 'CPR & Choking',
    icon: Heart,
    color: 'red',
    emergency: true,
    guides: [
      {
        name: 'CPR (Cardiopulmonary Resuscitation)',
        steps: [
          'Call emergency services (112) immediately',
          'Check if the person is responsive - tap shoulders and shout',
          'If unresponsive and not breathing normally, begin CPR',
          'Place hands in center of chest, interlock fingers',
          'Push hard and fast - at least 2 inches deep, 100-120 compressions per minute',
          'Give 30 compressions, then 2 rescue breaths (if trained)',
          'Continue until help arrives or person starts breathing'
        ],
        warnings: [
          'Only perform if you are trained',
          'Don\'t stop CPR until professional help arrives',
          'If available, use an AED (Automated External Defibrillator)'
        ]
      },
      {
        name: 'Choking Relief (Heimlich Maneuver)',
        steps: [
          'Ask "Are you choking?" - if they can\'t speak or cough, act immediately',
          'Stand behind the person and wrap arms around waist',
          'Make a fist with one hand, place above navel',
          'Grasp fist with other hand',
          'Give quick, upward thrusts into abdomen',
          'Repeat until object is expelled or person becomes unconscious',
          'If person loses consciousness, call 112 and begin CPR'
        ],
        warnings: [
          'Don\'t interfere if person is coughing forcefully',
          'For pregnant women or obese persons, use chest thrusts',
          'Seek medical attention even after successful removal'
        ]
      }
    ]
  },
  {
    id: 'bleeding',
    title: 'Bleeding & Wounds',
    icon: AlertCircle,
    color: 'orange',
    emergency: true,
    guides: [
      {
        name: 'Severe Bleeding Control',
        steps: [
          'Call emergency services if bleeding is severe',
          'Apply direct pressure with clean cloth or bandage',
          'Maintain firm, continuous pressure for 10-15 minutes',
          'Don\'t remove cloth if blood soaks through - add more layers',
          'Elevate the injured area above heart level if possible',
          'Apply pressure to nearest pressure point if bleeding continues',
          'Once bleeding stops, secure bandage and keep area still'
        ],
        warnings: [
          'Wear gloves or use barrier if available',
          'Don\'t remove embedded objects - stabilize them',
          'Watch for signs of shock - pale, clammy skin, rapid pulse'
        ]
      },
      {
        name: 'Minor Cuts and Scrapes',
        steps: [
          'Wash your hands thoroughly',
          'Stop bleeding by applying gentle pressure',
          'Clean wound with clean water',
          'Apply antibiotic ointment if available',
          'Cover with sterile bandage or gauze',
          'Change dressing daily and watch for infection',
          'Seek medical care if signs of infection appear'
        ],
        warnings: [
          'Watch for signs of infection: redness, swelling, pus, fever',
          'Update tetanus shot if needed (every 10 years)',
          'Deep cuts may need stitches - seek medical care'
        ]
      }
    ]
  },
  {
    id: 'burns',
    title: 'Burns & Scalds',
    icon: Zap,
    color: 'yellow',
    emergency: true,
    guides: [
      {
        name: 'Thermal Burns',
        steps: [
          'Remove person from heat source immediately',
          'Cool the burn with cool (not cold) running water for 10-20 minutes',
          'Remove jewelry, watches, or tight clothing before swelling starts',
          'Cover burn with sterile, non-stick bandage or clean cloth',
          'Take over-the-counter pain reliever if needed',
          'Keep burned area elevated above heart level',
          'Seek medical attention for severe burns'
        ],
        warnings: [
          'NEVER use ice, butter, or ointments on burns',
          'Don\'t break blisters',
          'Seek immediate care for burns on face, hands, feet, or genitals',
          'Large burns or third-degree burns need emergency care'
        ]
      },
      {
        name: 'Chemical Burns',
        steps: [
          'Remove contaminated clothing carefully',
          'Brush off dry chemicals before rinsing',
          'Rinse affected area with running water for 20+ minutes',
          'Call poison control or emergency services',
          'Cover with sterile bandage',
          'Keep chemical container for medical personnel'
        ],
        warnings: [
          'Don\'t try to neutralize chemical with another substance',
          'Protect yourself while helping',
          'Eye burns require immediate emergency care'
        ]
      }
    ]
  },
  {
    id: 'fractures',
    title: 'Fractures & Sprains',
    icon: Activity,
    color: 'blue',
    emergency: false,
    guides: [
      {
        name: 'Suspected Fracture',
        steps: [
          'Don\'t move the injured area',
          'Immobilize the area using splints or padding',
          'Apply ice packs (wrapped in cloth) for 15-20 minutes',
          'Elevate the injured limb if possible',
          'Call emergency services for severe fractures',
          'Watch for signs of shock',
          'Don\'t try to realign the bone'
        ],
        warnings: [
          'Never move someone with suspected spine injury',
          'Open fractures (bone through skin) need immediate emergency care',
          'Watch for numbness, tingling, or color changes'
        ]
      },
      {
        name: 'Sprains and Strains (RICE Method)',
        steps: [
          'Rest: Stop activity and rest the injured area',
          'Ice: Apply ice for 15-20 minutes every 2-3 hours',
          'Compression: Use elastic bandage (not too tight)',
          'Elevation: Keep injured area above heart level',
          'Take pain reliever if needed',
          'Avoid using injured area for 48-72 hours',
          'Seek medical care if severe pain, swelling, or can\'t bear weight'
        ],
        warnings: [
          'Don\'t apply ice directly to skin',
          'If symptoms worsen, seek medical attention',
          'Severe sprains may be fractures - get X-ray if uncertain'
        ]
      }
    ]
  },
  {
    id: 'medical',
    title: 'Medical Emergencies',
    icon: Brain,
    color: 'purple',
    emergency: true,
    guides: [
      {
        name: 'Stroke Recognition (FAST)',
        steps: [
          'Face: Ask person to smile - is one side drooping?',
          'Arms: Ask to raise both arms - does one drift down?',
          'Speech: Ask to repeat simple phrase - is speech slurred?',
          'Time: If any signs present, call emergency immediately',
          'Note the time symptoms started',
          'Keep person calm and comfortable',
          'Don\'t give food, drink, or medication'
        ],
        warnings: [
          'Time is critical - every minute counts',
          'Don\'t let person drive themselves',
          'Even if symptoms resolve, seek immediate medical care'
        ]
      },
      {
        name: 'Heart Attack',
        steps: [
          'Call emergency services immediately',
          'Have person sit or lie down comfortably',
          'Loosen tight clothing',
          'If they have prescribed nitroglycerin, help them take it',
          'Give aspirin if not allergic (chew, don\'t swallow)',
          'Monitor breathing and pulse',
          'Be ready to perform CPR if needed'
        ],
        warnings: [
          'Symptoms may differ in women: nausea, jaw pain, back pain',
          'Don\'t delay calling emergency services',
          'Stay with person until help arrives'
        ]
      },
      {
        name: 'Diabetic Emergency',
        steps: [
          'If conscious and can swallow: give sugar (juice, candy, glucose tablets)',
          'If unconscious: call emergency services immediately',
          'Place in recovery position if breathing',
          'Monitor breathing and consciousness',
          'Don\'t give insulin without medical guidance',
          'Keep person warm and comfortable'
        ],
        warnings: [
          'Never give food/drink to unconscious person',
          'Check for medical alert bracelet',
          'Both high and low blood sugar are serious'
        ]
      }
    ]
  },
  {
    id: 'poisoning',
    title: 'Poisoning & Allergies',
    icon: Pill,
    color: 'green',
    emergency: true,
    guides: [
      {
        name: 'Poisoning',
        steps: [
          'Call poison control center or emergency services',
          'Try to identify the poison - keep container',
          'If person is conscious, keep them calm',
          'Don\'t induce vomiting unless instructed',
          'If poison on skin, remove clothing and rinse for 15-20 minutes',
          'If poison in eyes, flush with water for 15-20 minutes',
          'Follow poison control instructions exactly'
        ],
        warnings: [
          'Never give anything by mouth unless instructed',
          'Don\'t rely on package instructions - call experts',
          'Save vomit sample if it occurs'
        ]
      },
      {
        name: 'Severe Allergic Reaction (Anaphylaxis)',
        steps: [
          'Call emergency services immediately',
          'Use epinephrine auto-injector (EpiPen) if available',
          'Have person lie flat and elevate legs',
          'Keep person warm and comfortable',
          'Monitor breathing and pulse',
          'Be prepared to perform CPR if needed',
          'Second injection may be needed after 5-15 minutes'
        ],
        warnings: [
          'Anaphylaxis can be fatal - act quickly',
          'Even after epinephrine, emergency care is needed',
          'Symptoms can return hours later'
        ]
      }
    ]
  },
  {
    id: 'heat',
    title: 'Heat & Cold',
    icon: Thermometer,
    color: 'pink',
    emergency: false,
    guides: [
      {
        name: 'Heat Stroke',
        steps: [
          'Call emergency services immediately',
          'Move person to cool, shaded area',
          'Remove excess clothing',
          'Cool person rapidly with cool water or ice packs',
          'Focus on neck, armpits, and groin',
          'Fan the person while misting with water',
          'Monitor temperature and consciousness'
        ],
        warnings: [
          'Heat stroke is life-threatening',
          'Don\'t give fever-reducing medication',
          'Don\'t give fluids if person is unconscious'
        ]
      },
      {
        name: 'Hypothermia',
        steps: [
          'Call emergency services for severe cases',
          'Move person to warm area gently',
          'Remove wet clothing carefully',
          'Warm person gradually with blankets',
          'Give warm (not hot) beverages if conscious',
          'Use body heat or warm compresses on core areas',
          'Handle person gently - rough movement can trigger cardiac arrest'
        ],
        warnings: [
          'Don\'t warm too quickly',
          'Don\'t give alcohol',
          'Don\'t massage or rub extremities'
        ]
      }
    ]
  }
]

export function FirstAidCourses() {
  const [selectedTopic, setSelectedTopic] = useState<string>('cpr')

  const currentTopic = firstAidTopics.find(t => t.id === selectedTopic)

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-600" />
          <h2 className="text-red-600">First Aid Guide</h2>
        </div>
        <p className="text-sm text-gray-600">
          Essential first aid procedures for emergency situations
        </p>
      </div>

      {/* Important Warning */}
      <Alert className="border-orange-500 bg-orange-50">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-sm text-orange-800">
          <strong>Important:</strong> This guide provides basic first aid information. 
          In case of serious emergencies, always call emergency services (112) immediately. 
          Consider taking a certified first aid course for hands-on training.
        </AlertDescription>
      </Alert>

      {/* Topic Tabs */}
      <Tabs value={selectedTopic} onValueChange={setSelectedTopic} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto">
          {firstAidTopics.map((topic) => {
            const Icon = topic.icon
            return (
              <TabsTrigger
                key={topic.id}
                value={topic.id}
                className="flex flex-col items-center gap-1 py-3"
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{topic.title}</span>
                {topic.emergency && (
                  <Badge variant="destructive" className="text-[10px] px-1 py-0">
                    Emergency
                  </Badge>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {firstAidTopics.map((topic) => {
          const Icon = topic.icon
          return (
            <TabsContent key={topic.id} value={topic.id} className="space-y-4 mt-6">
              {/* Topic Header */}
              <Card className={`bg-gradient-to-r from-${topic.color}-50 to-${topic.color}-100 border-${topic.color}-200`}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-${topic.color}-600 rounded-full flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3>{topic.title}</h3>
                    </div>
                    {topic.emergency && (
                      <Badge variant="destructive" className="text-xs">
                        Emergency - Call 112
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">
                    Step-by-step instructions for handling {topic.title.toLowerCase()} emergencies
                  </p>
                </div>
              </Card>

              {/* First Aid Guides */}
              <div className="space-y-4">
                {topic.guides.map((guide, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b">
                      <h4 className="flex items-center gap-2">
                        <Badge>{index + 1}</Badge>
                        {guide.name}
                      </h4>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Steps */}
                      <div>
                        <p className="text-sm mb-3">
                          <strong>Steps to Follow:</strong>
                        </p>
                        <ol className="space-y-3">
                          {guide.steps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                                {idx + 1}
                              </div>
                              <span className="text-sm text-gray-700 flex-1">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Warnings */}
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <strong className="text-red-700">Important Warnings:</strong>
                        </p>
                        <ul className="space-y-2">
                          {guide.warnings.map((warning, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-red-700">
                              <span className="text-red-600">⚠</span>
                              <span className="flex-1">{warning}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>

      {/* First Aid Kit Essentials */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <div className="p-6">
          <h3 className="mb-4 text-blue-900">First Aid Kit Essentials</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                category: 'Basic Supplies',
                items: ['Sterile gauze pads', 'Adhesive bandages', 'Medical tape', 'Elastic bandages', 'Scissors', 'Tweezers']
              },
              {
                category: 'Medications',
                items: ['Pain relievers', 'Antibiotic ointment', 'Antiseptic wipes', 'Burn cream', 'Anti-diarrheal', 'Antihistamines']
              },
              {
                category: 'Emergency Items',
                items: ['Emergency blanket', 'Disposable gloves', 'CPR face shield', 'Instant cold packs', 'Thermometer', 'Emergency numbers list']
              }
            ].map((kit, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <p className="mb-2 text-blue-900">{kit.category}</p>
                <ul className="space-y-1">
                  {kit.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Emergency Numbers */}
      <Card className="bg-red-600 text-white">
        <div className="p-6">
          <h3 className="mb-4 text-white">Emergency Contact Numbers</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Emergency Services', number: '112' },
              { name: 'Ambulance', number: '108' },
              { name: 'Poison Control', number: '1800-11-4434' },
              { name: 'Women Helpline', number: '1091' }
            ].map((contact) => (
              <div key={contact.number} className="text-center p-4 bg-white/20 backdrop-blur rounded-lg">
                <p className="text-sm mb-1">{contact.name}</p>
                <p className="text-xl">{contact.number}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
