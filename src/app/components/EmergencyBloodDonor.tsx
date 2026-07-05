import React, { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { toast } from 'sonner@2.0.3'
import { 
  Droplet, Phone, Mail, MapPin, Calendar as CalendarIcon, 
  CreditCard, FileText, Heart, AlertCircle, CheckCircle2, 
  ArrowLeft, Save, User, Shield
} from 'lucide-react'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Alert, AlertDescription } from './ui/alert'

interface BloodDonorProfile {
  fullName: string
  bloodGroup: string
  phoneNumber: string
  email: string
  dateOfBirth: Date | undefined
  address: string
  pincode: string
  govtIdType: string
  govtIdNumber: string
  emergencyContact: string
  medicalHistory: {
    allergies: string
    medications: string
    chronicDiseases: string
    previousDonations: string
    lastDonationDate: string
    weight: string
    bloodPressure: string
    hemoglobin: string
  }
  availability: string
  consentGiven: boolean
}

interface EmergencyBloodDonorProps {
  onBack: () => void
}

export function EmergencyBloodDonor({ onBack }: EmergencyBloodDonorProps) {
  const [step, setStep] = useState<'form' | 'review' | 'success'>('form')
  const [profile, setProfile] = useState<BloodDonorProfile>({
    fullName: '',
    bloodGroup: '',
    phoneNumber: '+91',
    email: '',
    dateOfBirth: undefined,
    address: '',
    pincode: '',
    govtIdType: '',
    govtIdNumber: '',
    emergencyContact: '',
    medicalHistory: {
      allergies: '',
      medications: '',
      chronicDiseases: '',
      previousDonations: '',
      lastDonationDate: '',
      weight: '',
      bloodPressure: '',
      hemoglobin: ''
    },
    availability: 'available',
    consentGiven: false
  })

  const [savedProfiles, setSavedProfiles] = useState<BloodDonorProfile[]>([])
  const [showCalendar, setShowCalendar] = useState(false)

  // Load saved profiles
  useEffect(() => {
    const saved = localStorage.getItem('rakshanet_blood_donor_profiles')
    if (saved) {
      const profiles = JSON.parse(saved)
      setSavedProfiles(profiles)
    }
  }, [])

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  
  const govtIdTypes = [
    'Aadhaar Card',
    'PAN Card',
    'Voter ID',
    'Driving License',
    'Passport'
  ]

  const handleInputChange = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMedicalHistoryChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: value
      }
    }))
  }

  const validateForm = () => {
    if (!profile.fullName.trim()) {
      toast.error('Please enter your full name')
      return false
    }
    if (!profile.bloodGroup) {
      toast.error('Please select your blood group')
      return false
    }
    if (!profile.phoneNumber || profile.phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number')
      return false
    }
    if (!profile.email || !profile.email.includes('@')) {
      toast.error('Please enter a valid email address')
      return false
    }
    if (!profile.dateOfBirth) {
      toast.error('Please select your date of birth')
      return false
    }
    if (!profile.address.trim()) {
      toast.error('Please enter your address')
      return false
    }
    if (!profile.pincode || profile.pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode')
      return false
    }
    if (!profile.govtIdType) {
      toast.error('Please select a government ID type')
      return false
    }
    if (!profile.govtIdNumber.trim()) {
      toast.error('Please enter your government ID number')
      return false
    }
    if (!profile.consentGiven) {
      toast.error('Please provide consent to share your information for emergency blood donation')
      return false
    }
    
    // Check age (must be 18+)
    const age = new Date().getFullYear() - (profile.dateOfBirth?.getFullYear() || 0)
    if (age < 18) {
      toast.error('You must be at least 18 years old to register as a blood donor')
      return false
    }
    
    return true
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    setStep('review')
  }

  const handleConfirmAndSave = () => {
    // Save to local storage
    const newProfiles = [...savedProfiles, profile]
    localStorage.setItem('rakshanet_blood_donor_profiles', JSON.stringify(newProfiles))
    setSavedProfiles(newProfiles)

    // In production, this would also sync to Supabase
    toast.success('Blood donor profile registered successfully!', {
      description: 'Your information will be used to help save lives in emergencies',
      duration: 5000
    })

    setStep('success')
  }

  const handleRegisterAnother = () => {
    setProfile({
      fullName: '',
      bloodGroup: '',
      phoneNumber: '+91',
      email: '',
      dateOfBirth: undefined,
      address: '',
      pincode: '',
      govtIdType: '',
      govtIdNumber: '',
      emergencyContact: '',
      medicalHistory: {
        allergies: '',
        medications: '',
        chronicDiseases: '',
        previousDonations: '',
        lastDonationDate: '',
        weight: '',
        bloodPressure: '',
        hemoglobin: ''
      },
      availability: 'available',
      consentGiven: false
    })
    setStep('form')
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return ''
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 backdrop-blur-md bg-white/95">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            
            <h2 className="text-3xl mb-4 text-green-600">Registration Successful!</h2>
            
            <p className="text-lg text-gray-700 mb-6">
              Thank you for registering as an emergency blood donor. Your noble act can save lives!
            </p>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Droplet className="w-8 h-8 text-red-600" />
                <div className="text-left">
                  <p className="text-gray-900" style={{ fontWeight: 600 }}>
                    {profile.fullName}
                  </p>
                  <p className="text-gray-600">
                    Blood Group: <span className="text-red-600" style={{ fontWeight: 600 }}>{profile.bloodGroup}</span>
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4" />
                  {profile.phoneNumber}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </div>
              </div>
            </div>

            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>What's Next?</strong><br />
                You'll be contacted when there's an emergency need for {profile.bloodGroup} blood in your area.
                Please keep your phone accessible and ensure your contact information stays up to date.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button
                onClick={handleRegisterAnother}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
              >
                <User className="w-5 h-5 mr-2" />
                Register Another Person
              </Button>
              
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Reports
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (step === 'review') {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 backdrop-blur-md bg-white/95">
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-500" />
              Review Your Information
            </h2>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              Ready to Submit
            </Badge>
          </div>

          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Please review all information carefully. This data will be used in emergencies to contact you for blood donation.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-red-500" />
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Full Name</p>
                  <p className="text-gray-900" style={{ fontWeight: 600 }}>{profile.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Blood Group</p>
                  <p className="text-red-600" style={{ fontWeight: 600 }}>{profile.bloodGroup}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date of Birth</p>
                  <p className="text-gray-900">{formatDate(profile.dateOfBirth)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Age</p>
                  <p className="text-gray-900">
                    {profile.dateOfBirth ? new Date().getFullYear() - profile.dateOfBirth.getFullYear() : '-'} years
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div>
              <h3 className="text-lg mb-3 flex items-center gap-2">
                <Phone className="w-5 h-5 text-red-500" />
                Contact Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Phone Number</p>
                  <p className="text-gray-900">{profile.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-500">Emergency Contact</p>
                  <p className="text-gray-900">{profile.emergencyContact || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Address */}
            <div>
              <h3 className="text-lg mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                Address
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="md:col-span-2">
                  <p className="text-gray-500">Full Address</p>
                  <p className="text-gray-900">{profile.address}</p>
                </div>
                <div>
                  <p className="text-gray-500">Pincode</p>
                  <p className="text-gray-900">{profile.pincode}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Government ID */}
            <div>
              <h3 className="text-lg mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-red-500" />
                Government Identification
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">ID Type</p>
                  <p className="text-gray-900">{profile.govtIdType}</p>
                </div>
                <div>
                  <p className="text-gray-500">ID Number</p>
                  <p className="text-gray-900">{profile.govtIdNumber}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Medical History */}
            <div>
              <h3 className="text-lg mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Medical Information
              </h3>
              <div className="space-y-3 text-sm">
                {profile.medicalHistory.allergies && (
                  <div>
                    <p className="text-gray-500">Allergies</p>
                    <p className="text-gray-900">{profile.medicalHistory.allergies}</p>
                  </div>
                )}
                {profile.medicalHistory.medications && (
                  <div>
                    <p className="text-gray-500">Current Medications</p>
                    <p className="text-gray-900">{profile.medicalHistory.medications}</p>
                  </div>
                )}
                {profile.medicalHistory.chronicDiseases && (
                  <div>
                    <p className="text-gray-500">Chronic Diseases</p>
                    <p className="text-gray-900">{profile.medicalHistory.chronicDiseases}</p>
                  </div>
                )}
                {profile.medicalHistory.previousDonations && (
                  <div>
                    <p className="text-gray-500">Previous Donations</p>
                    <p className="text-gray-900">{profile.medicalHistory.previousDonations}</p>
                  </div>
                )}
                {profile.medicalHistory.lastDonationDate && (
                  <div>
                    <p className="text-gray-500">Last Donation Date</p>
                    <p className="text-gray-900">{profile.medicalHistory.lastDonationDate}</p>
                  </div>
                )}
                {profile.medicalHistory.weight && (
                  <div>
                    <p className="text-gray-500">Weight</p>
                    <p className="text-gray-900">{profile.medicalHistory.weight} kg</p>
                  </div>
                )}
                {profile.medicalHistory.bloodPressure && (
                  <div>
                    <p className="text-gray-500">Blood Pressure</p>
                    <p className="text-gray-900">{profile.medicalHistory.bloodPressure}</p>
                  </div>
                )}
                {profile.medicalHistory.hemoglobin && (
                  <div>
                    <p className="text-gray-500">Hemoglobin Level</p>
                    <p className="text-gray-900">{profile.medicalHistory.hemoglobin} g/dL</p>
                  </div>
                )}
                {!profile.medicalHistory.allergies && 
                 !profile.medicalHistory.medications &&
                 !profile.medicalHistory.chronicDiseases &&
                 !profile.medicalHistory.previousDonations &&
                 !profile.medicalHistory.lastDonationDate &&
                 !profile.medicalHistory.weight &&
                 !profile.medicalHistory.bloodPressure &&
                 !profile.medicalHistory.hemoglobin && (
                  <p className="text-gray-500 italic">No additional medical information provided</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Button
              onClick={handleConfirmAndSave}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
              size="lg"
            >
              <Save className="w-5 h-5 mr-2" />
              Confirm & Register
            </Button>
            
            <Button
              onClick={() => setStep('form')}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Edit Information
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 backdrop-blur-md bg-white/95">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <Droplet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl">Emergency Blood Donor Registration</h2>
              <p className="text-gray-600">
                Register to help save lives in emergency situations
              </p>
            </div>
          </div>

          <Alert className="border-red-200 bg-red-50">
            <Heart className="w-5 h-5 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Important:</strong> Your information will only be used to contact you during blood donation emergencies. 
              All data is kept confidential and secure.
            </AlertDescription>
          </Alert>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-red-500" />
              Personal Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bloodGroup">Blood Group *</Label>
                <Select
                  value={profile.bloodGroup}
                  onValueChange={(value) => handleInputChange('bloodGroup', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map(group => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Date of Birth *</Label>
                <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left mt-1"
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {profile.dateOfBirth ? formatDate(profile.dateOfBirth) : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={profile.dateOfBirth}
                      onSelect={(date) => {
                        handleInputChange('dateOfBirth', date)
                        setShowCalendar(false)
                      }}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-red-500" />
              Contact Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={(e) => {
                    let value = e.target.value
                    if (!value.startsWith('+')) {
                      value = '+' + value.replace(/\+/g, '')
                    }
                    handleInputChange('phoneNumber', value)
                  }}
                  placeholder="+919876543210"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Format: +[country code][number]</p>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="emergencyContact">Emergency Contact (Optional)</Label>
                <Input
                  id="emergencyContact"
                  type="tel"
                  value={profile.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="+919876543210"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Address */}
          <div>
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              Address Details
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Full Address *</Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="House/Flat No., Street, Area, City, State"
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={profile.pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                      handleInputChange('pincode', value)
                    }}
                    placeholder="123456"
                    maxLength={6}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Government ID */}
          <div>
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-red-500" />
              Government Identification
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="govtIdType">ID Type *</Label>
                <Select
                  value={profile.govtIdType}
                  onValueChange={(value) => handleInputChange('govtIdType', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    {govtIdTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="govtIdNumber">ID Number *</Label>
                <Input
                  id="govtIdNumber"
                  value={profile.govtIdNumber}
                  onChange={(e) => handleInputChange('govtIdNumber', e.target.value.toUpperCase())}
                  placeholder="Enter ID number"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Medical History */}
          <div>
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Medical Information (Optional but Recommended)
            </h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    value={profile.medicalHistory.weight}
                    onChange={(e) => handleMedicalHistoryChange('weight', e.target.value)}
                    placeholder="65"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="bloodPressure">Blood Pressure</Label>
                  <Input
                    id="bloodPressure"
                    value={profile.medicalHistory.bloodPressure}
                    onChange={(e) => handleMedicalHistoryChange('bloodPressure', e.target.value)}
                    placeholder="120/80"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="hemoglobin">Hemoglobin Level (g/dL)</Label>
                  <Input
                    id="hemoglobin"
                    value={profile.medicalHistory.hemoglobin}
                    onChange={(e) => handleMedicalHistoryChange('hemoglobin', e.target.value)}
                    placeholder="13.5"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="lastDonationDate">Last Donation Date</Label>
                  <Input
                    id="lastDonationDate"
                    value={profile.medicalHistory.lastDonationDate}
                    onChange={(e) => handleMedicalHistoryChange('lastDonationDate', e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={profile.medicalHistory.allergies}
                  onChange={(e) => handleMedicalHistoryChange('allergies', e.target.value)}
                  placeholder="List any known allergies (e.g., medications, food)"
                  rows={2}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  value={profile.medicalHistory.medications}
                  onChange={(e) => handleMedicalHistoryChange('medications', e.target.value)}
                  placeholder="List any medications you are currently taking"
                  rows={2}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="chronicDiseases">Chronic Diseases</Label>
                <Textarea
                  id="chronicDiseases"
                  value={profile.medicalHistory.chronicDiseases}
                  onChange={(e) => handleMedicalHistoryChange('chronicDiseases', e.target.value)}
                  placeholder="List any chronic conditions (e.g., diabetes, hypertension)"
                  rows={2}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="previousDonations">Previous Donation History</Label>
                <Textarea
                  id="previousDonations"
                  value={profile.medicalHistory.previousDonations}
                  onChange={(e) => handleMedicalHistoryChange('previousDonations', e.target.value)}
                  placeholder="Number of times donated, any complications, etc."
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Consent */}
          <div>
            <Alert className="border-blue-200 bg-blue-50">
              <FileText className="w-5 h-5 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="space-y-2">
                  <p><strong>Consent & Privacy Policy</strong></p>
                  <ul className="text-sm space-y-1 ml-4 list-disc">
                    <li>I voluntarily provide this information for emergency blood donation purposes</li>
                    <li>I understand my data will be kept confidential and used only for contacting me during blood emergencies</li>
                    <li>I consent to being contacted via phone, SMS, or email when there's an urgent need for my blood group</li>
                    <li>I am above 18 years of age and medically fit to donate blood</li>
                    <li>I can update or remove my information at any time</li>
                  </ul>
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={profile.consentGiven}
                      onChange={(e) => handleInputChange('consentGiven', e.target.checked)}
                      className="w-4 h-4 accent-red-600"
                    />
                    <label htmlFor="consent" className="text-sm cursor-pointer">
                      <strong>I agree to the above terms and conditions *</strong>
                    </label>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
              size="lg"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Review & Submit
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
