import React, { useState } from 'react'
import { FileText, Send, Shield, History, Bot, BookOpen, AlertCircle, CheckCircle, Clock, Phone as PhoneIcon, Eye, ShieldAlert } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { BackButton } from './BackButton'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Alert, AlertDescription } from './ui/alert'
import { toast } from 'sonner@2.0.3'

interface PoliceComplaintsProps {
  onBack?: () => void
}

interface ComplaintExample {
  title: string
  severity: 'High' | 'Critical' | 'Medium'
  category: string
  description: string
  template: string
  actionRequired: string
}

const complaintExamples: ComplaintExample[] = [
  {
    title: 'Workplace Sexual Harassment',
    severity: 'High',
    category: 'Sexual Harassment',
    description: 'I am filing this complaint against my supervisor [Name] for repeated sexual harassment at my workplace [Company Name], l...',
    template: 'I am filing this complaint against my supervisor [Name] for repeated sexual harassment at my workplace [Company Name], located at [Address]. The incidents occurred on [Date] when [describe specific incidents]. I have evidence including [emails/messages/witnesses]. I request immediate action and protection.',
    actionRequired: 'Immediate Action Required'
  },
  {
    title: 'Domestic Violence Case',
    severity: 'Critical',
    category: 'Domestic Violence',
    description: 'I am filing a complaint against my husband [Name] for domestic violence and abuse at our residence [Address]. INCIDENT ...',
    template: 'I am filing a complaint against my husband [Name] for domestic violence and abuse at our residence [Address]. The incident occurred on [Date/Time] when [describe the incident]. I have sustained injuries [describe injuries] and have medical evidence. I request immediate protection and legal action.',
    actionRequired: 'Emergency Response Required'
  },
  {
    title: 'Online Harassment and Cyberbullying',
    severity: 'High',
    category: 'Cyber Crime',
    description: 'I am filing a complaint regarding online harassment and cyberbullying by [Name/Username] across multiple social media pl...',
    template: 'I am filing a complaint regarding online harassment and cyberbullying by [Name/Username] across multiple social media platforms. The harassment includes [threatening messages/stalking/defamation]. Screenshots and evidence are attached. Profile links: [URLs]. I request investigation and action.',
    actionRequired: 'Investigation Required'
  },
  {
    title: 'Eve Teasing and Street Harassment',
    severity: 'Medium',
    category: 'Public Harassment',
    description: 'I am filing a complaint regarding repeated harassment I face while commuting to work on [Route/Area]. INCIDENT DETAILS:...',
    template: 'I am filing a complaint regarding repeated harassment I face while commuting to work on [Route/Area]. The incident occurred on [Date/Time] near [Location]. The perpetrators [describe individuals] made inappropriate comments and gestures. I request preventive action and increased patrol in this area.',
    actionRequired: 'Preventive Action Required'
  }
]

const complaintTypes = [
  'Sexual Harassment',
  'Domestic Violence',
  'Stalking',
  'Cyber Crime',
  'Public Harassment',
  'Workplace Harassment',
  'Threatening Behavior',
  'Physical Assault',
  'Other'
]

interface ComplaintStatus {
  referenceNumber: string
  status: 'Submitted' | 'Under Review' | 'Investigation' | 'Action Taken' | 'Closed'
  submittedDate: string
  lastUpdated: string
  type: string
  location: string
  assignedOfficer?: string
  updates: Array<{
    date: string
    status: string
    description: string
  }>
}

export function PoliceComplaints({ onBack }: PoliceComplaintsProps = {}) {
  const [activeTab, setActiveTab] = useState('new')
  const [complaintType, setComplaintType] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [showAIAssist, setShowAIAssist] = useState(false)
  const [selectedExample, setSelectedExample] = useState<ComplaintExample | null>(null)
  const [showExampleDialog, setShowExampleDialog] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [complaintStatus, setComplaintStatus] = useState<ComplaintStatus | null>(null)
  const [submittedComplaints, setSubmittedComplaints] = useState<Map<string, ComplaintStatus>>(new Map())

  const handleAIAssist = () => {
    if (!complaintType) {
      toast.error('Please select complaint type first')
      return
    }
    
    setShowAIAssist(true)
    
    // Simulate AI generating template based on complaint type
    const templates: { [key: string]: string } = {
      'Sexual Harassment': 'I am filing this complaint regarding sexual harassment that occurred on [Date] at [Location]. The incident involved [describe incident]. I request immediate investigation and action.',
      'Domestic Violence': 'I am filing a complaint regarding domestic violence at [Address] on [Date/Time]. The incident involved [describe incident and injuries]. I request protection and legal action.',
      'Stalking': 'I am filing a complaint regarding stalking by [Name/Description] that has been ongoing since [Date]. The stalking includes [describe behavior]. I request investigation and protection order.',
      'Cyber Crime': 'I am filing a complaint regarding cyber crime/harassment on [Platform] by [Username]. The harassment includes [describe]. Evidence attached. I request investigation.',
      'Other': 'I am filing a complaint regarding [incident type] that occurred on [Date] at [Location]. [Describe incident in detail]. I request appropriate action.'
    }
    
    const template = templates[complaintType] || templates['Other']
    setDescription(template)
    toast.success('AI template loaded! Please fill in the details marked with [brackets]')
  }

  const handleSubmit = () => {
    if (!complaintType || !location || !description || !contactName || !contactPhone) {
      toast.error('Please fill in all required fields')
      return
    }
    
    // Generate reference number
    const refNumber = 'FIR-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    const now = new Date()
    
    // Create complaint status
    const newComplaint: ComplaintStatus = {
      referenceNumber: refNumber,
      status: 'Submitted',
      submittedDate: now.toLocaleString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      lastUpdated: now.toLocaleString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      type: complaintType,
      location: location,
      assignedOfficer: 'Officer ID: ' + Math.floor(Math.random() * 9000 + 1000),
      updates: [
        {
          date: now.toLocaleString('en-IN', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          status: 'Submitted',
          description: 'Complaint received and logged in the system. Initial review in progress.'
        }
      ]
    }
    
    // Store complaint
    setSubmittedComplaints(prev => new Map(prev).set(refNumber, newComplaint))
    
    // Show success message
    toast.success(`Complaint submitted successfully! Reference number: ${refNumber}`)
    
    // Reset form
    setComplaintType('')
    setLocation('')
    setDescription('')
    setContactName('')
    setContactPhone('')
    setShowAIAssist(false)
    
    // Switch to status tab
    setTimeout(() => {
      setActiveTab('status')
      setTrackingNumber(refNumber)
      setComplaintStatus(newComplaint)
    }, 1500)
  }
  
  const handleCheckStatus = () => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a reference number')
      return
    }
    
    // Check if complaint exists in submitted complaints
    const complaint = submittedComplaints.get(trackingNumber.trim())
    
    if (complaint) {
      setComplaintStatus(complaint)
      toast.success('Complaint status found!')
    } else {
      // Show mock status for demo purposes
      const mockStatuses: ComplaintStatus[] = [
        {
          referenceNumber: trackingNumber.trim(),
          status: 'Under Review',
          submittedDate: '15 Oct 2024, 10:30 AM',
          lastUpdated: '20 Oct 2024, 02:15 PM',
          type: 'Sexual Harassment',
          location: 'Koramangala, Bangalore',
          assignedOfficer: 'Officer ID: 5421',
          updates: [
            {
              date: '15 Oct 2024, 10:30 AM',
              status: 'Submitted',
              description: 'Complaint received and logged in the system.'
            },
            {
              date: '16 Oct 2024, 03:45 PM',
              status: 'Under Review',
              description: 'Case assigned to investigating officer. Initial assessment in progress.'
            },
            {
              date: '20 Oct 2024, 02:15 PM',
              status: 'Investigation',
              description: 'Evidence collection and witness statements being recorded.'
            }
          ]
        }
      ]
      
      setComplaintStatus(mockStatuses[0])
      toast.success('Complaint status found!')
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'Investigation':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'Action Taken':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'Closed':
        return 'bg-green-100 text-green-700 border-green-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const handleCopyExample = (example: ComplaintExample) => {
    setDescription(example.template)
    setComplaintType(example.category)
    setActiveTab('new')
    toast.success('Example template copied! Please customize the details.')
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {onBack && <BackButton onClick={onBack} />}
      <Card className="w-full max-w-4xl mx-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2>Police Complaints Portal</h2>
              <p className="text-sm text-gray-600">File complaints online with AI assistance</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
            </TabsList>

            <TabsContent value="new" className="space-y-6">
              {/* AI Assistant Banner */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-blue-900 mb-1">AI Complaint Assistant Available</h4>
                    <p className="text-sm text-blue-700">
                      Select your complaint type and click "AI Assist" for guided templates and suggestions to help you write a comprehensive complaint.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Complaint Form */}
              <Card className="p-6 border-2">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-5 h-5" />
                  <h3>File Online Complaint</h3>
                </div>

                <div className="space-y-4">
                  {/* Complaint Type */}
                  <div>
                    <Label htmlFor="complaint-type">Complaint Type *</Label>
                    <Select value={complaintType} onValueChange={setComplaintType}>
                      <SelectTrigger id="complaint-type" className="mt-1">
                        <SelectValue placeholder="Select complaint type" />
                      </SelectTrigger>
                      <SelectContent>
                        {complaintTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="Enter incident location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Incident Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label htmlFor="description">Incident Description *</Label>
                      <div className="flex items-center gap-2">
                        {complaintType && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAIAssist}
                            className="text-xs"
                          >
                            <AlertCircle className="w-3 h-3 mr-1" />
                            AI Help
                          </Button>
                        )}
                        {!complaintType && (
                          <span className="text-xs text-orange-600">Select type first</span>
                        )}
                      </div>
                    </div>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed description of the incident... (Use AI Assist for guided template)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 min-h-[150px]"
                    />
                    {showAIAssist && (
                      <p className="text-xs text-blue-600 mt-1">
                        ✓ AI template loaded. Please replace text in [brackets] with actual details.
                      </p>
                    )}
                  </div>

                  {/* Contact Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-name">Contact Name</Label>
                      <Input
                        id="contact-name"
                        placeholder="Your name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-phone">Contact Phone</Label>
                      <Input
                        id="contact-phone"
                        placeholder="Your phone number"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Info Box */}
                  <Card className="p-3 bg-gray-50 border-gray-200">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-gray-600 mt-0.5" />
                      <p className="text-xs text-gray-700">
                        This complaint will be sent directly to the nearest police station. You will receive a reference number for tracking. Check the Examples tab for formatting guidance.
                      </p>
                    </div>
                  </Card>

                  {/* Submit Button */}
                  <Button onClick={handleSubmit} className="w-full bg-gray-900 hover:bg-gray-800">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Complaint
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="examples" className="space-y-6">
              <Card className="p-4 border-2">
                <h3 className="mb-2">Example Complaint Formats</h3>
                <p className="text-sm text-gray-600 mb-6">
                  View detailed examples of how to structure different types of complaints for better processing
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {complaintExamples.map((example, index) => (
                    <Card key={index} className="p-4 border hover:shadow-lg transition-shadow">
                      <div className="space-y-3">
                        <div>
                          <h4 className="mb-2">{example.title}</h4>
                          <div className="flex gap-2">
                            <Badge 
                              className={
                                example.severity === 'Critical' 
                                  ? 'bg-red-100 text-red-700 border-red-300' 
                                  : example.severity === 'High'
                                  ? 'bg-orange-100 text-orange-700 border-orange-300'
                                  : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                              }
                            >
                              {example.severity}
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                              {example.category}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-3">
                          {example.description}
                        </p>

                        <p className="text-xs text-gray-500">
                          {example.actionRequired}
                        </p>

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setSelectedExample(example)
                            setShowExampleDialog(true)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Example
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>

              {/* Emergency Contact */}
              <Card className="p-4 bg-red-50 border-red-200">
                <h4 className="text-red-900 mb-3">Need Immediate Help?</h4>
                <p className="text-sm text-red-700 mb-4">
                  Call emergency services directly
                </p>
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={() => window.location.href = 'tel:100'}
                  >
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    Police (100)
                  </Button>
                  <Button
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    onClick={() => window.location.href = 'tel:1091'}
                  >
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    Women (1091)
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="status">
              <Card className="p-8">
                <div className="text-center mb-6">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="mb-2">Track Your Complaints</h3>
                  <p className="text-gray-600 mb-4">
                    Enter your complaint reference number to track status
                  </p>
                </div>
                
                <div className="max-w-md mx-auto mb-6">
                  <Input 
                    placeholder="FIR-PS756NXGA" 
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="mb-3" 
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCheckStatus()
                      }
                    }}
                  />
                  <Button className="w-full" onClick={handleCheckStatus}>
                    Check Status
                  </Button>
                </div>

                {/* Complaint Status Display */}
                {complaintStatus && (
                  <div className="mt-8 space-y-4">
                    <div className="border-t-2 pt-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="mb-1">Complaint Details</h3>
                          <p className="text-sm text-gray-600">Reference: {complaintStatus.referenceNumber}</p>
                        </div>
                        <Badge className={getStatusColor(complaintStatus.status)}>
                          {complaintStatus.status}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <Card className="p-4 bg-gray-50">
                          <p className="text-xs text-gray-600 mb-1">Complaint Type</p>
                          <p className="text-sm">{complaintStatus.type}</p>
                        </Card>
                        <Card className="p-4 bg-gray-50">
                          <p className="text-xs text-gray-600 mb-1">Location</p>
                          <p className="text-sm">{complaintStatus.location}</p>
                        </Card>
                        <Card className="p-4 bg-gray-50">
                          <p className="text-xs text-gray-600 mb-1">Submitted Date</p>
                          <p className="text-sm">{complaintStatus.submittedDate}</p>
                        </Card>
                        <Card className="p-4 bg-gray-50">
                          <p className="text-xs text-gray-600 mb-1">Last Updated</p>
                          <p className="text-sm">{complaintStatus.lastUpdated}</p>
                        </Card>
                        {complaintStatus.assignedOfficer && (
                          <Card className="p-4 bg-gray-50 md:col-span-2">
                            <p className="text-xs text-gray-600 mb-1">Assigned Officer</p>
                            <p className="text-sm">{complaintStatus.assignedOfficer}</p>
                          </Card>
                        )}
                      </div>

                      {/* Status Timeline */}
                      <div className="mb-6">
                        <h4 className="mb-4">Status Timeline</h4>
                        <div className="space-y-3">
                          {complaintStatus.updates.map((update, index) => (
                            <div key={index} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full ${
                                  index === 0 ? 'bg-blue-600' : 'bg-gray-400'
                                }`}></div>
                                {index < complaintStatus.updates.length - 1 && (
                                  <div className="w-0.5 h-full bg-gray-300 my-1"></div>
                                )}
                              </div>
                              <div className="flex-1 pb-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={getStatusColor(update.status)} variant="outline">
                                    {update.status}
                                  </Badge>
                                  <p className="text-xs text-gray-500">{update.date}</p>
                                </div>
                                <p className="text-sm text-gray-700">{update.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            setComplaintStatus(null)
                            setTrackingNumber('')
                          }}
                        >
                          Check Another
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => window.open(`tel:100`, '_self')}
                        >
                          <PhoneIcon className="w-4 h-4 mr-2" />
                          Contact Police
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Example Dialog */}
        <Dialog open={showExampleDialog} onOpenChange={setShowExampleDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedExample?.title}</DialogTitle>
              <DialogDescription>
                Example complaint format - Click "Copy to Complaint" to use this template
              </DialogDescription>
            </DialogHeader>
            
            {selectedExample && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge 
                    className={
                      selectedExample.severity === 'Critical' 
                        ? 'bg-red-100 text-red-700' 
                        : selectedExample.severity === 'High'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }
                  >
                    {selectedExample.severity}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700">
                    {selectedExample.category}
                  </Badge>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm whitespace-pre-line">
                    {selectedExample.template}
                  </p>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>Note:</strong> Replace text in [brackets] with your actual details. Be specific with dates, times, locations, and descriptions.
                  </p>
                </div>

                <Button 
                  onClick={() => {
                    handleCopyExample(selectedExample)
                    setShowExampleDialog(false)
                  }}
                  className="w-full"
                >
                  Copy to Complaint Form
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  )
}