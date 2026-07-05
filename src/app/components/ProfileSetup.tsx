import React, { useState } from 'react'
import { Camera, User, ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card } from './ui/card'
import profileImage from 'figma:asset/3420a71eda58414f8b6bc233cce003e3e803f161.png'

interface ProfileSetupProps {
  onComplete: (profileData: any) => void
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [profile, setProfile] = useState({
    fullName: '',
    age: '',
    address: '',
    bloodGroup: '',
    medicalConditions: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    profilePicture: null as string | null
  })
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, profilePicture: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleSubmit = () => {
    if (profile.fullName && profile.emergencyContactName && profile.emergencyContactPhone) {
      onComplete(profile)
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 flex items-center justify-center p-4">
      <Card className="max-w-xl w-full p-8 shadow-xl">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl text-gray-900">Complete Your Profile</h2>
          <p className="text-gray-600">Help us personalize your safety experience</p>
        </div>
        
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <p className="text-sm text-gray-600 mt-2">Upload your profile picture</p>
          </div>
          
          {/* Personal Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Your full name"
                value={profile.fullName}
                onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                className="mt-1"
              />
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={profile.age}
                onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Your current address"
              value={profile.address}
              onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Input
                id="bloodGroup"
                placeholder="A+"
                value={profile.bloodGroup}
                onChange={(e) => setProfile(prev => ({ ...prev, bloodGroup: e.target.value }))}
                className="mt-1"
              />
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="medicalConditions">Medical Conditions</Label>
              <Input
                id="medicalConditions"
                placeholder="Any conditions"
                value={profile.medicalConditions}
                onChange={(e) => setProfile(prev => ({ ...prev, medicalConditions: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
          
          {/* Emergency Contact */}
          <div className="pt-4 border-t">
            <h3 className="text-red-600 mb-4">Emergency Contact *</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  placeholder="Primary contact"
                  value={profile.emergencyContactName}
                  onChange={(e) => setProfile(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+91 XXXXXXXXXX"
                  value={profile.emergencyContactPhone}
                  onChange={(e) => setProfile(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <Button
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 h-12"
            onClick={handleSubmit}
            disabled={!profile.fullName || !profile.emergencyContactName || !profile.emergencyContactPhone}
          >
            Complete Profile
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
