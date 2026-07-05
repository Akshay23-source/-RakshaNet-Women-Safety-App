import React from 'react'
import { Shield, Heart, Users, Phone } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'

export function EmergencyServices() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-gray-900">Find Nearest Police & Medical Help</h2>
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

      {/* Additional Emergency Numbers */}
      <Card className="p-6 bg-gray-50 border-2 border-gray-200">
        <h3 className="mb-4 text-gray-900">Other Emergency Numbers</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: 'Emergency Services', number: '112', description: 'All emergencies' },
            { name: 'Fire', number: '101', description: 'Fire department' },
            { name: 'Child Helpline', number: '1098', description: 'Children in need' },
            { name: 'Senior Citizen Helpline', number: '14567', description: 'For senior citizens' },
            { name: 'National Commission for Women', number: '7827170170', description: 'Women rights issues' },
            { name: 'Domestic Violence Helpline', number: '181', description: 'Domestic abuse support' }
          ].map((service) => (
            <div
              key={service.number}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer"
              onClick={() => window.open(`tel:${service.number}`, '_self')}
            >
              <div>
                <p className="text-gray-900">{service.name}</p>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
              <div className="text-right">
                <p className="text-red-600">{service.number}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
