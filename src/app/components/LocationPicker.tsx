import { useState } from 'react'
import { MapPin, Navigation, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import type { Location } from '../utils/types'

interface LocationPickerProps {
  currentLocation: Location
  onLocationChange: (location: Location) => void
}

// Major Indian cities for quick selection
const PRESET_LOCATIONS = [
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
]

export function LocationPicker({ currentLocation, onLocationChange }: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [lat, setLat] = useState(currentLocation.lat.toString())
  const [lng, setLng] = useState(currentLocation.lng.toString())

  const handleSave = () => {
    const newLat = parseFloat(lat)
    const newLng = parseFloat(lng)
    
    if (isNaN(newLat) || isNaN(newLng)) {
      alert('Please enter valid coordinates')
      return
    }
    
    if (newLat < -90 || newLat > 90 || newLng < -180 || newLng > 180) {
      alert('Coordinates out of range. Latitude: -90 to 90, Longitude: -180 to 180')
      return
    }
    
    onLocationChange({ lat: newLat, lng: newLng })
    setIsOpen(false)
  }

  const selectPreset = (location: typeof PRESET_LOCATIONS[0]) => {
    setLat(location.lat.toString())
    setLng(location.lng.toString())
  }

  const isDefaultLocation = currentLocation.lat === 12.9716 && currentLocation.lng === 77.5946

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`gap-2 text-white hover:bg-red-700 ${isDefaultLocation ? 'bg-red-800/50' : ''}`}
        title={isDefaultLocation ? 'GPS unavailable - Click to set location manually' : 'Change location'}
      >
        <MapPin className="h-4 w-4" />
        <span className="hidden sm:inline">
          {isDefaultLocation ? 'Set Location' : 'Location'}
        </span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Set Your Location
            </DialogTitle>
            <DialogDescription>
              Since GPS is unavailable, you can manually set your location or choose a nearby city.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Quick city selection */}
            <div>
              <Label className="mb-2 block">Quick Select City</Label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_LOCATIONS.map((location) => (
                  <Button
                    key={location.name}
                    variant="outline"
                    size="sm"
                    onClick={() => selectPreset(location)}
                    className="justify-start"
                  >
                    <MapPin className="h-3 w-3 mr-2" />
                    {location.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Manual coordinate entry */}
            <div className="space-y-3 border-t pt-4">
              <Label>Or Enter Coordinates Manually</Label>
              
              <div className="space-y-2">
                <div>
                  <Label htmlFor="latitude" className="text-xs">
                    Latitude (-90 to 90)
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="e.g., 12.9716"
                  />
                </div>
                
                <div>
                  <Label htmlFor="longitude" className="text-xs">
                    Longitude (-180 to 180)
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.0001"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="e.g., 77.5946"
                  />
                </div>
              </div>
            </div>

            {/* Current location display */}
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-xs">
              <div className="font-medium mb-1">Current Location:</div>
              <div className="text-gray-600 dark:text-gray-400">
                Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Location
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
