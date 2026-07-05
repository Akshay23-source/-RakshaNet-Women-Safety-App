import React, { useState } from 'react'
import { Scale, FileText, Shield, AlertTriangle, Book, Phone, Building } from 'lucide-react'
import { Card } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Alert, AlertDescription } from './ui/alert'

const legalRightsCategories = [
  {
    id: 'workplace',
    title: 'Workplace Rights',
    icon: Building,
    color: 'blue',
    rights: [
      {
        law: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013',
        description: 'Comprehensive law to prevent and address sexual harassment at workplace',
        keyPoints: [
          'Every workplace must have an Internal Complaints Committee (ICC)',
          'Workplace includes any place visited during employment',
          'Harassment can be physical, verbal, or non-verbal',
          'Employers must display rights and complaint process',
          'Confidentiality of complainant must be maintained',
          'False complaints can lead to action against complainant',
          'Interim relief can be provided during investigation'
        ],
        yourRights: [
          'Right to file complaint within 3 months (extendable to 6 months)',
          'Right to confidentiality throughout process',
          'Right to not be victimized or discriminated against',
          'Right to safe working environment',
          'Right to compensation if harassment proved',
          'Right to appeal against committee decision'
        ]
      },
      {
        law: 'Equal Remuneration Act, 1976',
        description: 'Ensures equal pay for equal work regardless of gender',
        keyPoints: [
          'No discrimination in recruitment on basis of sex',
          'Equal pay for same or similar work',
          'Applies to all establishments employing people',
          'Penalty for violations',
          'Can file complaint with labor inspector'
        ],
        yourRights: [
          'Right to equal wages for equal work',
          'Right to same working conditions',
          'Right to non-discrimination in hiring',
          'Right to file complaint for pay disparity',
          'Right to legal recourse'
        ]
      },
      {
        law: 'Maternity Benefit Act, 1961 (Amended 2017)',
        description: 'Protects employment and provides benefits during maternity',
        keyPoints: [
          '26 weeks paid maternity leave (increased from 12 weeks)',
          '12 weeks for women with 2 or more children',
          'Work from home option for certain roles',
          'Crèche facilities for establishments with 50+ employees',
          'Cannot be dismissed during maternity leave',
          'Option to work from home after maternity leave period'
        ],
        yourRights: [
          'Right to 26 weeks paid maternity leave',
          'Right to work from home option',
          'Right to nursing breaks',
          'Right to not be dismissed due to pregnancy',
          'Right to crèche facility',
          'Right to medical bonus'
        ]
      }
    ]
  },
  {
    id: 'violence',
    title: 'Violence & Safety',
    icon: Shield,
    color: 'red',
    rights: [
      {
        law: 'Protection of Women from Domestic Violence Act, 2005',
        description: 'Provides protection from domestic violence and abuse',
        keyPoints: [
          'Covers physical, sexual, verbal, emotional, and economic abuse',
          'Applies to women in any domestic relationship',
          'Can get protection orders, residence orders, monetary relief',
          'Breach of protection order is punishable',
          'Protection Officers appointed in each area',
          'Can file complaint at any time, no limitation period'
        ],
        yourRights: [
          'Right to live in shared household',
          'Right to protection order against abuser',
          'Right to monetary relief and compensation',
          'Right to custody of children',
          'Right to free legal aid',
          'Right to emergency shelter',
          'Right to medical examination'
        ]
      },
      {
        law: 'IPC Section 354 - Assault or Criminal Force to Woman with Intent to Outrage her Modesty',
        description: 'Punishes assault or use of criminal force on women',
        keyPoints: [
          'Imprisonment up to 5 years and/or fine',
          'Cognizable and non-bailable offense',
          'Covers physical contact and advances',
          'Intent to outrage modesty must be present'
        ],
        yourRights: [
          'Right to file FIR at any police station',
          'Right to female police officer recording statement',
          'Right to medical examination',
          'Right to legal representation',
          'Right to compensation from accused'
        ]
      },
      {
        law: 'IPC Section 509 - Word, Gesture or Act Intended to Insult the Modesty of a Woman',
        description: 'Punishes words, gestures, or acts insulting women\'s modesty',
        keyPoints: [
          'Covers verbal harassment and gestures',
          'Imprisonment up to 3 years and/or fine',
          'Includes stalking and voyeurism',
          'Electronic communication also covered'
        ],
        yourRights: [
          'Right to file complaint for verbal harassment',
          'Right to privacy',
          'Right to dignity',
          'Right to move freely without harassment'
        ]
      },
      {
        law: 'IPC Section 376 - Rape',
        description: 'Punishes rape and sexual assault',
        keyPoints: [
          'Minimum 7 years imprisonment, can extend to life',
          'Death penalty in certain aggravated cases',
          'Marital rape exception (contested)',
          'Special provisions for gang rape',
          'Identity of victim protected',
          'In-camera trial available'
        ],
        yourRights: [
          'Right to file FIR immediately',
          'Right to medical examination within 24 hours',
          'Right to female doctor for examination',
          'Right to anonymity',
          'Right to free legal aid',
          'Right to compensation',
          'Right to victim support services'
        ]
      }
    ]
  },
  {
    id: 'marriage',
    title: 'Marriage & Family',
    icon: FileText,
    color: 'purple',
    rights: [
      {
        law: 'Prohibition of Child Marriage Act, 2006',
        description: 'Prohibits child marriage and protects minors',
        keyPoints: [
          'Legal marriage age: 21 for men, 18 for women',
          'Child marriages are voidable',
          'Punishment for promoting child marriage',
          'Child Marriage Prohibition Officers appointed',
          'Can file petition to nullify marriage until age 20'
        ],
        yourRights: [
          'Right to void child marriage',
          'Right to maintenance from spouse',
          'Right to custody of children',
          'Right to residence until nullification',
          'Right to legal protection'
        ]
      },
      {
        law: 'Dowry Prohibition Act, 1961',
        description: 'Prohibits giving or taking dowry',
        keyPoints: [
          'Both giving and taking dowry are crimes',
          'Punishment: imprisonment up to 5 years and fine of ₹15,000+',
          'Dowry includes property or valuable security',
          'Gifts given voluntarily not covered',
          'List of gifts should be maintained'
        ],
        yourRights: [
          'Right to report dowry demands',
          'Right to all gifts given to you',
          'Right to protection from harassment',
          'Right to file complaint within 5 years',
          'Right to legal recourse'
        ]
      },
      {
        law: 'IPC Section 498A - Cruelty by Husband or Relatives',
        description: 'Punishes cruelty towards married women',
        keyPoints: [
          'Covers physical and mental cruelty',
          'Harassment for dowry covered',
          'Imprisonment up to 3 years and fine',
          'Cognizable, non-bailable, and non-compoundable',
          'Can be filed by woman or relative on her behalf'
        ],
        yourRights: [
          'Right to file complaint against husband/in-laws',
          'Right to protection from harassment',
          'Right to stay in matrimonial home',
          'Right to maintenance',
          'Right to legal aid'
        ]
      },
      {
        law: 'Hindu Marriage Act / Special Marriage Act - Divorce Rights',
        description: 'Provides grounds for divorce and separation',
        keyPoints: [
          'Mutual consent divorce possible',
          'Cruelty, adultery, desertion are grounds',
          'Maintenance rights for wife',
          'Custody rights for children',
          'Alimony provisions',
          'Domestic violence is valid ground'
        ],
        yourRights: [
          'Right to file for divorce',
          'Right to maintenance (alimony)',
          'Right to child custody',
          'Right to share in marital property',
          'Right to residence',
          'Right to remarry after divorce'
        ]
      }
    ]
  },
  {
    id: 'property',
    title: 'Property Rights',
    icon: Building,
    color: 'green',
    rights: [
      {
        law: 'Hindu Succession (Amendment) Act, 2005',
        description: 'Equal rights in ancestral property',
        keyPoints: [
          'Daughters have equal rights as sons in ancestral property',
          'Daughter is coparcener by birth',
          'Rights apply even if father died before 2005',
          'Cannot be deprived of rights',
          'Right to demand partition',
          'Can dispose property by will'
        ],
        yourRights: [
          'Right to equal share in ancestral property',
          'Right to demand partition',
          'Right to sell or transfer your share',
          'Right to live in ancestral property',
          'Right to income from property',
          'Right to inherit father\'s property equally with brothers'
        ]
      },
      {
        law: 'Right to Residence',
        description: 'Right to reside in shared household',
        keyPoints: [
          'Cannot be evicted from shared household',
          'Right continues even after separation',
          'Includes house owned or rented by husband',
          'Can claim alternate accommodation',
          'Applies under DV Act 2005'
        ],
        yourRights: [
          'Right to live in matrimonial home',
          'Right to not be evicted',
          'Right to alternate accommodation',
          'Right to household goods',
          'Right to seek residence orders'
        ]
      }
    ]
  },
  {
    id: 'cyber',
    title: 'Cyber & Digital',
    icon: Shield,
    color: 'orange',
    rights: [
      {
        law: 'IT Act Section 66E - Privacy Violation',
        description: 'Punishes violation of privacy through digital means',
        keyPoints: [
          'Publishing private images without consent is crime',
          'Punishment: imprisonment up to 3 years and fine',
          'Covers photographs and videos',
          'Intentional violation required',
          'Can file cyber crime complaint'
        ],
        yourRights: [
          'Right to privacy in digital space',
          'Right to file complaint for privacy violation',
          'Right to have content removed',
          'Right to compensation',
          'Right to anonymity during investigation'
        ]
      },
      {
        law: 'IT Act Section 67 - Obscene Material',
        description: 'Punishes publication of obscene material online',
        keyPoints: [
          'Publishing/transmitting obscene content is offense',
          'Includes revenge porn',
          'Punishment: imprisonment up to 5 years',
          'ISPs must remove content on order',
          'Can report to cyber cell'
        ],
        yourRights: [
          'Right to report obscene content',
          'Right to have intimate images removed',
          'Right to legal action against offenders',
          'Right to digital dignity',
          'Right to cyber cell assistance'
        ]
      },
      {
        law: 'IPC Section 354C - Voyeurism',
        description: 'Punishes watching or capturing private acts',
        keyPoints: [
          'Watching/photographing private acts without consent',
          'Imprisonment: 1-3 years for first offense, 3-7 for repeat',
          'Includes hidden cameras',
          'Disseminating images also punishable',
          'Gender-specific offense (protecting women)'
        ],
        yourRights: [
          'Right to privacy in private spaces',
          'Right to file complaint',
          'Right to have recordings destroyed',
          'Right to compensation',
          'Right to protection from distribution'
        ]
      }
    ]
  }
]

const legalResources = [
  {
    name: 'National Commission for Women (NCW)',
    phone: '7827-170-170',
    email: 'ncw@nic.in',
    description: 'Statutory body for women\'s rights and safeguards'
  },
  {
    name: 'Women Helpline',
    phone: '1091 / 181',
    description: '24x7 helpline for women in distress'
  },
  {
    name: 'National Legal Services Authority',
    phone: '011-23385878',
    description: 'Free legal aid for women'
  },
  {
    name: 'Cyber Crime Reporting',
    phone: '1930',
    website: 'cybercrime.gov.in',
    description: 'Report cyber crimes and harassment'
  }
]

export function LegalRights() {
  const [selectedCategory, setSelectedCategory] = useState<string>('workplace')

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Scale className="w-6 h-6 text-red-600" />
          <h2 className="text-red-600">Legal Rights for Women Safety</h2>
        </div>
        <p className="text-sm text-gray-600">
          Know your legal rights and protections under Indian law
        </p>
      </div>

      {/* Important Notice */}
      <Alert className="border-blue-500 bg-blue-50">
        <Book className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-800">
          <strong>Legal Information:</strong> This guide provides general information about 
          legal rights. For specific legal advice, consult a qualified lawyer. Free legal aid 
          is available for women through National Legal Services Authority.
        </AlertDescription>
      </Alert>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
          {legalRightsCategories.map((category) => {
            const Icon = category.icon
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex flex-col items-center gap-1 py-3"
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{category.title}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {legalRightsCategories.map((category) => {
          const Icon = category.icon
          return (
            <TabsContent key={category.id} value={category.id} className="space-y-4 mt-6">
              {/* Category Header */}
              <Card className={`bg-gradient-to-r from-${category.color}-50 to-${category.color}-100 border-${category.color}-200`}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 bg-${category.color}-600 rounded-full flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3>{category.title}</h3>
                  </div>
                  <p className="text-sm text-gray-700">
                    Legal protections and rights related to {category.title.toLowerCase()}
                  </p>
                </div>
              </Card>

              {/* Laws and Rights */}
              <div className="space-y-4">
                {category.rights.map((right, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
                      <div className="flex items-start gap-3">
                        <Badge className="mt-1">{index + 1}</Badge>
                        <div>
                          <h4 className="mb-1">{right.law}</h4>
                          <p className="text-sm text-gray-600">{right.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      {/* Key Points */}
                      <div>
                        <p className="text-sm mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <strong>Key Points of the Law:</strong>
                        </p>
                        <ul className="space-y-2 bg-blue-50 rounded-lg p-4">
                          {right.keyPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-blue-600 flex-shrink-0">•</span>
                              <span className="flex-1">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Your Rights */}
                      <div>
                        <p className="text-sm mb-3 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <strong>Your Rights:</strong>
                        </p>
                        <ul className="space-y-2 bg-green-50 rounded-lg p-4">
                          {right.yourRights.map((userRight, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-green-600 flex-shrink-0">✓</span>
                              <span className="flex-1">{userRight}</span>
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

      {/* Legal Resources */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-purple-600" />
          <h3>Legal Help & Resources</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {legalResources.map((resource, index) => (
            <Card key={index} className="p-5 border-purple-200 bg-purple-50">
              <div className="space-y-2">
                <p>{resource.name}</p>
                <p className="text-sm text-gray-600">{resource.description}</p>
                <div className="space-y-1">
                  {resource.phone && (
                    <p className="text-sm">
                      <strong>Phone:</strong>{' '}
                      <a href={`tel:${resource.phone}`} className="text-purple-600 hover:underline">
                        {resource.phone}
                      </a>
                    </p>
                  )}
                  {resource.email && (
                    <p className="text-sm">
                      <strong>Email:</strong>{' '}
                      <a href={`mailto:${resource.email}`} className="text-purple-600 hover:underline">
                        {resource.email}
                      </a>
                    </p>
                  )}
                  {resource.website && (
                    <p className="text-sm">
                      <strong>Website:</strong>{' '}
                      <a 
                        href={`https://${resource.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
                      >
                        {resource.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* How to File Complaint */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="text-orange-900">How to File a Complaint</h3>
          </div>
          <ol className="space-y-3">
            {[
              'You can file an FIR at ANY police station, not just in your jurisdiction',
              'Police MUST register your FIR - it is your right',
              'You can give your statement to a female police officer (upon request)',
              'Zero FIR can be filed and will be transferred to appropriate station',
              'You have the right to get a copy of the FIR',
              'Free legal aid is available - contact NALSA or State Legal Services',
              'You can approach women\'s commission if police don\'t cooperate',
              'Keep all evidence: messages, photos, medical reports, witnesses'
            ].map((step, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <span className="flex-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </Card>

      {/* Emergency Contacts */}
      <Card className="bg-red-600 text-white">
        <div className="p-6">
          <h3 className="mb-4 text-white">Emergency Legal Helplines</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Police', number: '100' },
              { name: 'Women Helpline', number: '1091' },
              { name: 'NCW Helpline', number: '7827-170-170' },
              { name: 'Legal Aid', number: '15100' }
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
