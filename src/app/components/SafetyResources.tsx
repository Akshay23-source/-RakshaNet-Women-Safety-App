import React, { useState } from 'react'
import { Shield, BookOpen, Video, Home, MapPin, Phone, Users, Heart } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { BackButton } from './BackButton'
import { SelfDefense } from './SelfDefense'
import { SafetyArticleDetail } from './SafetyArticleDetail'
import { SafeStays } from './SafeStays'

interface SafetyResourcesProps {
  onBack?: () => void
}

const selfDefenseVideos = [
  { id: 1, title: 'Basic Self-Defense Techniques', duration: '8:45', level: 'Beginner' },
  { id: 2, title: 'Situational Awareness Tips', duration: '6:30', level: 'All' },
  { id: 3, title: 'Pepper Spray Usage Guide', duration: '5:20', level: 'Beginner' },
  { id: 4, title: 'Escape from Grab Attacks', duration: '10:15', level: 'Intermediate' }
]

const safetyArticles = [
  { id: 1, title: 'Night Travel Safety Checklist', category: 'Travel', readTime: '5 min' },
  { id: 2, title: 'Digital Safety and Privacy', category: 'Online', readTime: '7 min' },
  { id: 3, title: 'Safe Ride-Sharing Practices', category: 'Transport', readTime: '4 min' },
  { id: 4, title: 'How to Identify Unsafe Situations', category: 'Awareness', readTime: '6 min' }
]

const emergencyNumbers = [
  { name: 'Emergency Services', number: '112', description: 'All emergencies' },
  { name: 'Police', number: '100', description: 'Law enforcement' },
  { name: 'Women Helpline', number: '1091', description: '24/7 support for women' },
  { name: 'Ambulance', number: '108', description: 'Medical emergency' },
  { name: 'National Commission for Women', number: '7827-170-170', description: 'Women rights' }
]

export function SafetyResources({ onBack }: SafetyResourcesProps = {}) {
  const [selectedArticle, setSelectedArticle] = useState<{id: number, title: string, category: string, readTime: string} | null>(null)

  if (selectedArticle) {
    return <SafetyArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />
  }

  return (
    <div className="w-full max-w-4xl">
      {onBack && <BackButton onClick={onBack} />}
      <h2 className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6 text-red-500" />
        Safety Resources
      </h2>
      
      <Tabs defaultValue="emergency" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="helplines">Helplines</TabsTrigger>
          <TabsTrigger value="safe-stays">Safe Stays</TabsTrigger>
        </TabsList>
        
        <TabsContent value="emergency" className="space-y-6 mt-4">
          <div className="space-y-2">
            <h3 className="text-gray-900">Find Nearest Police & Medical Help</h3>
            <p className="text-sm text-gray-600">
              Quick access to emergency services with direct calling options
            </p>
          </div>

          {/* Emergency Service Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Police Station */}
            <Card className="p-8 bg-red-50 border-2 border-red-200 hover:shadow-xl transition-all">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                
                <div className="space-y-1">
                  <p className="text-red-600">Police Station</p>
                  <p className="text-sm text-red-700">Emergency police assistance and FIR filing</p>
                </div>

                <Button
                  onClick={() => window.open('tel:100', '_self')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Police: 100
                </Button>
              </div>
            </Card>

            {/* Medical Help */}
            <Card className="p-8 bg-blue-50 border-2 border-blue-200 hover:shadow-xl transition-all">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                
                <div className="space-y-1">
                  <p className="text-blue-600">Medical Help</p>
                  <p className="text-sm text-blue-700">Emergency medical assistance and ambulance</p>
                </div>

                <Button
                  onClick={() => window.open('tel:108', '_self')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Medical: 108
                </Button>
              </div>
            </Card>
          </div>

          {/* Women Helpline - Full Width */}
          <Card className="p-8 bg-pink-50 border-2 border-pink-200 hover:shadow-xl transition-all">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              
              <div className="space-y-1">
                <p className="text-pink-600">Women Helpline</p>
                <p className="text-sm text-pink-700">24/7 support for women in distress</p>
              </div>

              <div className="max-w-md mx-auto">
                <Button
                  onClick={() => window.open('tel:1091', '_self')}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                  size="lg"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Women Helpline: 1091
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="training" className="mt-4">
          <SelfDefense />
        </TabsContent>
        
        <TabsContent value="articles" className="space-y-3 mt-4">
          {safetyArticles.map((article) => (
            <Card 
              key={article.id} 
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-grow">
                  <h3 className="mb-1">{article.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {article.category}
                    </span>
                    <span>{article.readTime} read</span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedArticle(article)
                  }}
                >
                  Read →
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="helplines" className="space-y-3 mt-4">
          {emergencyNumbers.map((helpline) => (
            <Card key={helpline.number} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p>{helpline.name}</p>
                    <p className="text-sm text-gray-600">{helpline.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-600">{helpline.number}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={() => window.open(`tel:${helpline.number}`, '_self')}
                  >
                    Call Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="safe-stays" className="mt-4">
          <SafeStays />
        </TabsContent>
      </Tabs>
    </div>
  )
}