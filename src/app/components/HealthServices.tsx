import React, { useState } from 'react'
import { Heart, AlertCircle, Thermometer, Activity, HeartPulse, Brain, Droplet, Wind, Phone } from 'lucide-react'
import { Card } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

const healthConditions = [
  {
    id: 'fever',
    title: 'Fever & Flu',
    icon: Thermometer,
    color: 'red',
    severity: 'moderate',
    conditions: [
      {
        name: 'High Fever (Above 101°F)',
        symptoms: ['Body temperature above 101°F', 'Chills and shivering', 'Sweating', 'Headache', 'Body aches', 'Weakness'],
        homeCare: [
          'Rest completely and avoid physical activity',
          'Drink plenty of fluids - water, ORS, coconut water, clear soups',
          'Take paracetamol (500mg) for adults - follow dosage instructions',
          'Use cold compress on forehead and armpits',
          'Wear light, breathable clothing',
          'Keep room temperature comfortable',
          'Monitor temperature every 4-6 hours'
        ],
        whenToSeekHelp: [
          'Fever above 103°F or lasting more than 3 days',
          'Severe headache or stiff neck',
          'Difficulty breathing',
          'Persistent vomiting',
          'Confusion or altered consciousness',
          'Rash accompanying fever',
          'Pregnant women should consult doctor immediately'
        ],
        emergency: false
      },
      {
        name: 'Common Cold & Flu',
        symptoms: ['Running nose', 'Sneezing', 'Sore throat', 'Mild fever', 'Cough', 'Body aches'],
        homeCare: [
          'Get plenty of rest (7-8 hours sleep)',
          'Drink warm fluids - ginger tea, tulsi tea, warm water with honey',
          'Gargle with warm salt water 3-4 times daily',
          'Use steam inhalation to clear congestion',
          'Take vitamin C rich foods - citrus fruits, amla',
          'Avoid cold foods and beverages',
          'Use saline nasal drops for congestion',
          'Keep yourself warm'
        ],
        whenToSeekHelp: [
          'Symptoms worsen after 7 days',
          'High fever develops',
          'Severe chest pain or breathing difficulty',
          'Persistent headache or facial pain'
        ],
        emergency: false
      }
    ]
  },
  {
    id: 'digestive',
    title: 'Digestive Issues',
    icon: Activity,
    color: 'orange',
    severity: 'moderate',
    conditions: [
      {
        name: 'Nausea & Vomiting',
        symptoms: ['Feeling of wanting to vomit', 'Stomach discomfort', 'Weakness', 'Dizziness'],
        homeCare: [
          'Stop eating solid food for few hours',
          'Sip small amounts of clear fluids - water, ORS, ginger tea',
          'Once vomiting stops, start with bland foods - toast, rice, banana',
          'Ginger tea or peppermint tea can help reduce nausea',
          'Rest in a comfortable position',
          'Avoid strong smells and greasy foods',
          'Keep a bowl nearby in case of emergency',
          'Rinse mouth after each episode'
        ],
        whenToSeekHelp: [
          'Vomiting blood or coffee-ground material',
          'Severe abdominal pain',
          'Signs of dehydration - dark urine, no urination for 8+ hours',
          'Vomiting lasting more than 24 hours',
          'Pregnant women should consult doctor',
          'Accompanied by high fever or severe headache'
        ],
        emergency: false
      },
      {
        name: 'Diarrhea',
        symptoms: ['Loose, watery stools', 'Abdominal cramps', 'Urgency', 'Weakness'],
        homeCare: [
          'Drink plenty of ORS (Oral Rehydration Solution) - essential!',
          'Stay hydrated with water, buttermilk, coconut water',
          'Eat bland foods - rice, banana, toast, boiled potatoes',
          'Avoid dairy products, spicy food, caffeine',
          'Rest and avoid strenuous activity',
          'Maintain hygiene - wash hands frequently',
          'Take probiotics like curd (after initial phase)',
          'Zinc supplements can help recovery'
        ],
        whenToSeekHelp: [
          'Blood in stools',
          'Severe dehydration signs',
          'High fever (above 102°F)',
          'Severe abdominal pain',
          'Diarrhea lasting more than 2 days',
          'No improvement with home care',
          'Elderly or pregnant women should seek earlier care'
        ],
        emergency: false
      },
      {
        name: 'Stomach Pain & Cramps',
        symptoms: ['Abdominal discomfort', 'Cramping', 'Bloating', 'Gas'],
        homeCare: [
          'Apply warm compress on stomach',
          'Drink warm water or herbal tea - ajwain water, jeera water',
          'Avoid heavy meals - eat small, frequent meals',
          'Try gentle abdominal massage',
          'Take antacid if acidity is suspected',
          'Avoid gas-producing foods',
          'Rest in comfortable position',
          'Avoid lying down immediately after eating'
        ],
        whenToSeekHelp: [
          'Severe, sudden abdominal pain',
          'Pain with fever and vomiting',
          'Blood in vomit or stool',
          'Rigid, board-like abdomen',
          'Pain localized to right lower abdomen (appendicitis concern)',
          'Pregnant women with abdominal pain',
          'Pain lasting more than 24 hours'
        ],
        emergency: false
      }
    ]
  },
  {
    id: 'menstrual',
    title: 'Menstrual Health',
    icon: Droplet,
    color: 'pink',
    severity: 'moderate',
    conditions: [
      {
        name: 'Severe Menstrual Cramps',
        symptoms: ['Intense lower abdominal pain', 'Back pain', 'Nausea', 'Headache'],
        homeCare: [
          'Apply heating pad or hot water bottle on lower abdomen',
          'Take pain reliever - ibuprofen or mefenamic acid (as prescribed)',
          'Drink warm fluids - ginger tea, warm water',
          'Gentle exercise or yoga stretches can help',
          'Massage lower abdomen gently',
          'Take warm bath',
          'Rest in comfortable position',
          'Avoid caffeine and salty foods'
        ],
        whenToSeekHelp: [
          'Pain is unbearable despite medication',
          'Heavy bleeding (soaking pad every hour)',
          'Pain with fever',
          'Fainting or severe dizziness',
          'Sudden change in menstrual pattern',
          'Pain interfering with daily activities'
        ],
        emergency: false
      },
      {
        name: 'Heavy Menstrual Bleeding',
        symptoms: ['Soaking through pads quickly', 'Large clots', 'Prolonged periods', 'Fatigue'],
        homeCare: [
          'Rest and avoid strenuous activity',
          'Stay hydrated - drink plenty of fluids',
          'Eat iron-rich foods - spinach, dates, jaggery, beetroot',
          'Take iron supplements if recommended by doctor',
          'Use appropriate menstrual products',
          'Keep track of bleeding pattern',
          'Cold compress may help reduce flow',
          'Avoid blood thinners like aspirin'
        ],
        whenToSeekHelp: [
          'Soaking through pad every 1-2 hours',
          'Periods lasting more than 7 days',
          'Passing clots larger than a coin',
          'Signs of anemia - extreme fatigue, shortness of breath',
          'Dizziness or fainting',
          'Bleeding between periods'
        ],
        emergency: false
      }
    ]
  },
  {
    id: 'respiratory',
    title: 'Breathing Issues',
    icon: Wind,
    color: 'blue',
    severity: 'high',
    conditions: [
      {
        name: 'Asthma Attack (Mild)',
        symptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness', 'Coughing'],
        homeCare: [
          'Sit upright - don\'t lie down',
          'Stay calm and breathe slowly',
          'Use prescribed inhaler as directed',
          'Loosen tight clothing',
          'Sip warm water slowly',
          'Remove from trigger source (smoke, allergens)',
          'Use steam inhalation if it helps',
          'Practice breathing exercises between attacks'
        ],
        whenToSeekHelp: [
          'No improvement after inhaler use',
          'Difficulty speaking or walking',
          'Blue lips or fingernails',
          'Rapid breathing or heart rate',
          'Severe anxiety or confusion',
          'This is the first time experiencing these symptoms'
        ],
        emergency: true
      },
      {
        name: 'Breathlessness',
        symptoms: ['Difficulty breathing', 'Rapid breathing', 'Feeling of air hunger'],
        homeCare: [
          'Sit in comfortable position - try forward-leaning',
          'Open windows for fresh air',
          'Loosen tight clothing',
          'Breathe slowly through nose, out through mouth',
          'Use fan to create air circulation',
          'Stay calm - anxiety worsens breathing',
          'Sip water slowly if able',
          'If due to altitude, rest and acclimatize'
        ],
        whenToSeekHelp: [
          'Sudden onset of severe breathlessness',
          'Chest pain with breathing difficulty',
          'Blue discoloration of lips or fingers',
          'Confusion or drowsiness',
          'Breathing difficulty while lying down',
          'Swelling in legs along with breathlessness',
          'History of heart or lung disease'
        ],
        emergency: true
      }
    ]
  },
  {
    id: 'headache',
    title: 'Headaches',
    icon: Brain,
    color: 'purple',
    severity: 'moderate',
    conditions: [
      {
        name: 'Tension Headache',
        symptoms: ['Dull, aching head pain', 'Pressure around forehead', 'Tenderness on scalp', 'Neck stiffness'],
        homeCare: [
          'Rest in quiet, dark room',
          'Apply cold or warm compress on forehead',
          'Take pain reliever - paracetamol or ibuprofen',
          'Massage temples, neck, and shoulders gently',
          'Practice deep breathing exercises',
          'Stay hydrated - drink water',
          'Avoid screen time',
          'Try relaxation techniques',
          'Maintain good posture'
        ],
        whenToSeekHelp: [
          'Worst headache ever experienced',
          'Headache with fever, stiff neck, confusion',
          'Vision changes or difficulty speaking',
          'Headache after head injury',
          'Sudden, severe headache',
          'Headache that worsens despite medication'
        ],
        emergency: false
      },
      {
        name: 'Migraine',
        symptoms: ['Intense throbbing pain', 'Nausea/vomiting', 'Light/sound sensitivity', 'Visual disturbances'],
        homeCare: [
          'Rest in dark, quiet room immediately',
          'Take migraine medication as prescribed early',
          'Apply cold compress on forehead and neck',
          'Drink plenty of water',
          'Try caffeine (in small amounts) if it usually helps',
          'Avoid triggers - bright lights, loud sounds, strong smells',
          'Try to sleep if possible',
          'Gentle pressure on temples may help'
        ],
        whenToSeekHelp: [
          'First-time severe headache',
          'Headache with neurological symptoms',
          'Migraine lasting more than 72 hours',
          'Migraine patterns suddenly change',
          'Medication not providing relief',
          'Accompanied by high fever or stiff neck'
        ],
        emergency: false
      }
    ]
  },
  {
    id: 'cardiovascular',
    title: 'Heart & BP',
    icon: HeartPulse,
    color: 'red',
    severity: 'high',
    conditions: [
      {
        name: 'Low Blood Pressure',
        symptoms: ['Dizziness', 'Fainting', 'Blurred vision', 'Weakness', 'Nausea'],
        homeCare: [
          'Lie down immediately with legs elevated',
          'Drink water or fluids with salt/sugar',
          'Eat something salty if available',
          'Move slowly when getting up',
          'Avoid standing for long periods',
          'Wear compression stockings if recommended',
          'Stay hydrated throughout the day',
          'Eat small, frequent meals'
        ],
        whenToSeekHelp: [
          'Fainting episode',
          'Severe chest pain',
          'Shortness of breath',
          'Irregular heartbeat',
          'Confusion or difficulty concentrating',
          'Cold, clammy skin',
          'Pregnant women should consult doctor'
        ],
        emergency: true
      },
      {
        name: 'Palpitations',
        symptoms: ['Awareness of heartbeat', 'Racing heart', 'Fluttering sensation', 'Skipped beats'],
        homeCare: [
          'Sit down and rest',
          'Breathe slowly and deeply',
          'Try Valsalva maneuver (bearing down gently)',
          'Splash cold water on face',
          'Avoid caffeine, alcohol, tobacco',
          'Stay hydrated',
          'Practice relaxation techniques',
          'Avoid triggers if known'
        ],
        whenToSeekHelp: [
          'Palpitations with chest pain',
          'Severe shortness of breath',
          'Fainting or near-fainting',
          'Palpitations lasting more than a few minutes',
          'History of heart disease',
          'New onset of palpitations'
        ],
        emergency: true
      }
    ]
  }
]

export function HealthServices() {
  const [selectedCondition, setSelectedCondition] = useState<string>('fever')

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-600" />
          <h2 className="text-red-600">Health Services - Home Care Guide</h2>
        </div>
        <p className="text-sm text-gray-600">
          Emergency home care guidance when you're alone and can't reach a hospital
        </p>
      </div>

      {/* Emergency Warning */}
      <Alert className="border-red-500 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-sm text-red-800">
          <strong>IMPORTANT:</strong> This guide is for temporary relief and basic care when immediate 
          medical help is not accessible. For serious emergencies, always call 108 (Ambulance) or 
          112 (Emergency Services). Do not delay seeking professional medical care.
        </AlertDescription>
      </Alert>

      {/* Condition Tabs */}
      <Tabs value={selectedCondition} onValueChange={setSelectedCondition} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto">
          {healthConditions.map((condition) => {
            const Icon = condition.icon
            return (
              <TabsTrigger
                key={condition.id}
                value={condition.id}
                className="flex flex-col items-center gap-1 py-3"
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{condition.title}</span>
                {condition.severity === 'high' && (
                  <Badge variant="destructive" className="text-[10px] px-1 py-0">
                    High Risk
                  </Badge>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {healthConditions.map((condition) => {
          const Icon = condition.icon
          return (
            <TabsContent key={condition.id} value={condition.id} className="space-y-4 mt-6">
              {/* Condition Header */}
              <Card className={`bg-gradient-to-r from-${condition.color}-50 to-${condition.color}-100 border-${condition.color}-200`}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-${condition.color}-600 rounded-full flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3>{condition.title}</h3>
                    </div>
                    {condition.severity === 'high' && (
                      <Badge variant="destructive">
                        High Risk - Monitor Closely
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">
                    Home care guidance for {condition.title.toLowerCase()} related conditions
                  </p>
                </div>
              </Card>

              {/* Specific Conditions */}
              <div className="space-y-4">
                {condition.conditions.map((specific, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <Badge className="mt-1">{index + 1}</Badge>
                          <div>
                            <h4 className="mb-1">{specific.name}</h4>
                            {specific.emergency && (
                              <Badge variant="destructive" className="text-xs">
                                ⚠ Seek immediate help if severe
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      {/* Symptoms */}
                      <div>
                        <p className="text-sm mb-3 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-blue-600" />
                          <strong>Common Symptoms:</strong>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {specific.symptoms.map((symptom, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Home Care Steps */}
                      <div>
                        <p className="text-sm mb-3 flex items-center gap-2">
                          <Heart className="w-4 h-4 text-green-600" />
                          <strong>Home Care Steps:</strong>
                        </p>
                        <ol className="space-y-2 bg-green-50 rounded-lg p-4">
                          {specific.homeCare.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                              <div className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                                {idx + 1}
                              </div>
                              <span className="flex-1">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* When to Seek Help */}
                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                        <p className="text-sm mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <strong className="text-red-700">When to Seek Immediate Medical Help:</strong>
                        </p>
                        <ul className="space-y-2">
                          {specific.whenToSeekHelp.map((warning, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-red-700">
                              <span className="text-red-600 flex-shrink-0">🚨</span>
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

      {/* Emergency Medical Helplines */}
      <Card className="bg-red-600 text-white">
        <div className="p-6">
          <h3 className="text-white mb-4">Emergency Medical Helplines</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { name: 'Ambulance', number: '108', description: 'Free ambulance service' },
              { name: 'Emergency', number: '112', description: 'All emergencies' },
              { name: 'Women Helpline', number: '1091', description: '24/7 women support' },
              { name: 'Poison Control', number: '1800-102-2400', description: 'Poison emergencies' },
              { name: 'Mental Health', number: '08046110007', description: 'Mental health support' },
              { name: 'Childline', number: '1098', description: 'Children emergency' }
            ].map((helpline) => (
              <button
                key={helpline.number}
                onClick={() => window.open(`tel:${helpline.number}`, '_self')}
                className="text-left p-4 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1">{helpline.name}</p>
                    <p className="text-xs text-white/80">{helpline.description}</p>
                  </div>
                  <div className="text-right">
                    <Phone className="w-5 h-5 mb-1 ml-auto" />
                    <p className="text-lg">{helpline.number}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Important Reminders */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div className="space-y-3">
              <h4 className="text-purple-900">Important Reminders for Women Living Alone</h4>
              <ul className="space-y-2 text-sm text-purple-800">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>Always keep emergency contacts saved and easily accessible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>Maintain a basic first aid kit and emergency medicines at home</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>Inform neighbors or friends when you're feeling unwell</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>Keep your phone charged and within reach, especially when sick</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>Don't hesitate to call emergency services - it's better to be safe</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>Keep a list of your medications and allergies visible</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
