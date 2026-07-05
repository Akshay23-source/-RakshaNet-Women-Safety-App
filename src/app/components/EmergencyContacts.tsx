import React, { useState, useEffect } from 'react'
import { Phone, Plus, Trash2, UserPlus, ShieldAlert, Heart, AlertTriangle, Home, Bell } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog'
import { Card } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Alert, AlertDescription } from './ui/alert'
import { SOSMessagePreview } from './SOSMessagePreview'
import { BackButton } from './BackButton'
import type { EmergencyContact } from '../utils/types'
import { contactsAPI } from '../utils/api'
import { toast } from 'sonner@2.0.3'

interface EmergencyContactsProps {
  userId: string
  onBack?: () => void
}

export function EmergencyContacts({ userId, onBack }: EmergencyContactsProps) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: 'family',
    priority: 1
  })
  
  const emergencyServices = [
    { 
      name: 'Women Helpline', 
      number: '1091', 
      icon: ShieldAlert, 
      color: 'bg-red-100 text-red-600',
      description: '24x7 Women Safety Helpline'
    },
    { 
      name: 'Police', 
      number: '100', 
      icon: ShieldAlert, 
      color: 'bg-blue-100 text-blue-600',
      description: 'Emergency Police Services'
    },
    { 
      name: 'Medical Emergency', 
      number: '108', 
      icon: Heart, 
      color: 'bg-green-100 text-green-600',
      description: 'Ambulance & Medical Help'
    },
    { 
      name: 'Fire Emergency', 
      number: '101', 
      icon: AlertTriangle, 
      color: 'bg-orange-100 text-orange-600',
      description: 'Fire Department'
    },
    { 
      name: 'Safe Accommodation', 
      number: '181', 
      icon: Home, 
      color: 'bg-purple-100 text-purple-600',
      description: 'Women Shelter Helpline'
    }
  ]
  
  const makeCall = (number: string, name: string) => {
    window.location.href = `tel:${number}`
    toast.success(`Calling ${name}...`)
  }
  
  const loadContacts = async () => {
    try {
      const data = await contactsAPI.getAll(userId)
      setContacts(data)
    } catch (error) {
      console.error('Error loading contacts:', error)
      // Don't show error toast - just use empty array
      setContacts([])
    }
  }
  
  useEffect(() => {
    loadContacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])
  
  const handleAdd = async () => {
    try {
      await contactsAPI.add(userId, newContact)
      toast.success(`${newContact.name} added to emergency contacts`)
      setNewContact({ name: '', phone: '', relationship: 'family', priority: 1 })
      setIsOpen(false)
      loadContacts()
    } catch (error) {
      console.error('Error adding contact:', error)
      toast.error('Failed to add contact. Please try again.')
    }
  }
  
  const handleDelete = async (contactId: string) => {
    try {
      await contactsAPI.delete(userId, contactId)
      toast.success('Contact removed successfully')
      loadContacts()
    } catch (error) {
      console.error('Error deleting contact:', error)
      toast.error('Failed to delete contact. Please try again.')
    }
  }
  
  return (
    <div className="w-full max-w-4xl">
      {onBack && <BackButton onClick={onBack} />}
      <h2 className="flex items-center gap-2 mb-6">
        <Phone className="w-6 h-6 text-red-500" />
        Emergency Contacts
      </h2>
      
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services">Emergency Services</TabsTrigger>
          <TabsTrigger value="personal">Trusted Contacts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {emergencyServices.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.number} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full ${service.color} flex items-center justify-center`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      <p className="text-sm mt-1">{service.number}</p>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    onClick={() => makeCall(service.number, service.name)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </Card>
              )
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="personal" className="space-y-4 mt-6">
          <Alert className="mb-4 border-blue-200 bg-blue-50">
            <Bell className="w-5 h-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Auto SOS Alert:</strong> When you activate the SOS buzzer, all your trusted contacts will automatically receive an emergency SMS with your real-time location link.
            </AlertDescription>
          </Alert>
          
          {/* Message Preview */}
          <SOSMessagePreview userName="Your Name" />
          
          <div className="flex justify-end mb-4">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Trusted Contact
                </Button>
              </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
              <DialogDescription>
                Add a trusted contact who will be notified during emergencies
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="Enter contact name"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>
              
              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <Select
                  value={newContact.relationship}
                  onValueChange={(value) => setNewContact({ ...newContact, relationship: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="colleague">Colleague</SelectItem>
                    <SelectItem value="neighbor">Neighbor</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priority">Priority (1-5)</Label>
                <Select
                  value={newContact.priority.toString()}
                  onValueChange={(value) => setNewContact({ ...newContact, priority: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Highest</SelectItem>
                    <SelectItem value="2">2 - High</SelectItem>
                    <SelectItem value="3">3 - Medium</SelectItem>
                    <SelectItem value="4">4 - Low</SelectItem>
                    <SelectItem value="5">5 - Lowest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={handleAdd}
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={!newContact.name || !newContact.phone}
              >
                Add Contact
              </Button>
            </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="space-y-3">
          {contacts.length === 0 ? (
            <Card className="p-8 text-center bg-gray-50">
              <UserPlus className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 mb-2">No trusted contacts added yet</p>
              <p className="text-sm text-gray-500">
                Add trusted contacts who will be notified in case of emergency
              </p>
            </Card>
          ) : (
            contacts
              .sort((a, b) => a.priority - b.priority)
              .map((contact) => (
                <Card key={contact.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Phone className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p>{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {contact.relationship}
                          </span>
                          <span className="text-xs text-gray-500">Priority {contact.priority}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => makeCall(contact.phone, contact.name)}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
          )}
        </div>
      </TabsContent>
    </Tabs>
    </div>
  )
}