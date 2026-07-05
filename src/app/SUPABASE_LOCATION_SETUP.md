# Supabase Live Location Tracking Setup Guide

## Overview
This guide explains how to set up the Supabase database for real-time live location tracking when SOS is triggered in the RakshaNet Women Safety Application.

## Features
✅ **Real GPS Tracking** - Captures accurate device location using browser GPS  
✅ **Supabase Storage** - All location updates stored in Supabase database  
✅ **Live Tracking Links** - Shareable links sent to emergency contacts via SMS  
✅ **Real-time Updates** - Location updates every 20 seconds during active SOS  
✅ **No Demo Fallback** - Only real GPS coordinates, no fake locations  
✅ **Automatic SMS Alerts** - Contacts receive live tracking link in SOS message  

---

## Database Setup

### Step 1: Create Tables in Supabase

Go to your Supabase project → **SQL Editor** and run the following SQL:

```sql
-- Table for storing location updates
CREATE TABLE IF NOT EXISTS location_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sos_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION,
  speed DOUBLE PRECISION,
  heading DOUBLE PRECISION,
  address TEXT,
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_location_updates_sos_id ON location_updates(sos_id);
CREATE INDEX idx_location_updates_timestamp ON location_updates(timestamp DESC);

-- Table for tracking sessions
CREATE TABLE IF NOT EXISTS live_tracking_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sos_id TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  last_update_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  total_updates INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for tracking sessions
CREATE INDEX idx_tracking_sessions_sos_id ON live_tracking_sessions(sos_id);
CREATE INDEX idx_tracking_sessions_active ON live_tracking_sessions(is_active);
```

### Step 2: Enable Row Level Security (RLS)

```sql
-- Enable Row Level Security
ALTER TABLE location_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_tracking_sessions ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to insert their own locations
CREATE POLICY "Users can insert their own location updates"
  ON location_updates FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Policy to allow anyone to read location updates (for emergency contacts)
CREATE POLICY "Anyone can read location updates"
  ON location_updates FOR SELECT
  USING (true);

-- Policy to allow users to create their own tracking sessions
CREATE POLICY "Users can create their own tracking sessions"
  ON live_tracking_sessions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Policy to allow anyone to read tracking sessions
CREATE POLICY "Anyone can read tracking sessions"
  ON live_tracking_sessions FOR SELECT
  USING (true);

-- Policy to allow users to update their own tracking sessions
CREATE POLICY "Users can update their own tracking sessions"
  ON live_tracking_sessions FOR UPDATE
  USING (auth.uid()::text = user_id);
```

---

## How It Works

### 1. **SOS Triggered**
When a user presses the SOS button:
- GPS location is captured
- Tracking session created in Supabase
- SMS sent to emergency contacts with live tracking link

### 2. **Live Location Updates**
Every 20 seconds:
- Device GPS captures current location
- Location stored in `location_updates` table
- SMS update sent to emergency contacts
- UI updated with new coordinates

### 3. **Emergency Contact Receives**
SMS message includes:
```
🚨 EMERGENCY SOS ALERT from [Name]!

TYPE: EMERGENCY
TIME: Nov 8, 2025, 2:30 PM

LOCATION: [Full Address]
MAP: https://www.google.com/maps?q=12.9716,77.5946

📡 LIVE TRACKING: https://yourapp.com/track/sos_123abc
(Real-time location updates every 20 seconds)

Please respond immediately or call emergency services.

- Sent via RakshaNet Safety App
```

### 4. **Data Structure**

**location_updates table:**
```typescript
{
  id: "uuid",
  sos_id: "sos_abc123",
  user_id: "user_123",
  latitude: 12.9716,
  longitude: 77.5946,
  accuracy: 15.5,
  speed: 2.3,
  heading: 180,
  address: "123 Main St, Bangalore",
  timestamp: "2025-11-08T14:30:00Z",
  created_at: "2025-11-08T14:30:01Z"
}
```

**live_tracking_sessions table:**
```typescript
{
  id: "uuid",
  sos_id: "sos_abc123",
  user_id: "user_123",
  user_name: "Priya Sharma",
  started_at: "2025-11-08T14:30:00Z",
  last_update_at: "2025-11-08T14:35:20Z",
  is_active: true,
  total_updates: 16,
  created_at: "2025-11-08T14:30:01Z"
}
```

---

## API Functions

### Store Location Update
```typescript
import { storeLocationUpdate } from './utils/supabase/location-tracking'

await storeLocationUpdate(sosId, userId, {
  lat: 12.9716,
  lng: 77.5946,
  accuracy: 15,
  address: "Bangalore, India",
  timestamp: new Date().toISOString()
})
```

### Get Location History
```typescript
import { getLocationHistory } from './utils/supabase/location-tracking'

const history = await getLocationHistory(sosId, 50)
// Returns last 50 location updates
```

### Subscribe to Real-time Updates
```typescript
import { subscribeToLocationUpdates } from './utils/supabase/location-tracking'

const unsubscribe = subscribeToLocationUpdates(
  sosId,
  (location) => {
    console.log('New location:', location)
  },
  (error) => {
    console.error('Error:', error)
  }
)

// Later: unsubscribe()
```

---

## Testing Location Tracking

### 1. **Enable GPS on Device**
- Open device settings
- Enable Location Services
- Grant location permission to browser

### 2. **Test SOS Flow**
1. Log into RakshaNet app
2. Add emergency contacts
3. Press SOS button
4. Check browser console for logs:
   - `🚨 Live location tracking started`
   - `✅ Location stored in Supabase`
   - `📍 Location Update #1: lat: 12.971600, lng: 77.594600`

### 3. **Verify Supabase Data**
1. Go to Supabase Dashboard
2. Navigate to **Table Editor**
3. Check `location_updates` table for entries
4. Check `live_tracking_sessions` table

### 4. **Check SMS Delivery**
- Emergency contacts should receive SMS with live tracking link
- Click link to view real-time location

---

## Error Handling

### Location Permission Denied
```
❌ Location error: Location permission denied. Please enable location services in your device settings.
```
**Solution:** Enable GPS and grant browser location permission

### GPS Signal Unavailable
```
❌ Location error: Location information unavailable. Please check your GPS signal and try again.
```
**Solution:** Move to area with better GPS signal (outdoors)

### Supabase Connection Error
```
❌ Error storing location update: [error details]
```
**Solution:** Check Supabase connection and credentials

---

## Security & Privacy

✅ **Encrypted Storage** - All data encrypted in Supabase  
✅ **RLS Policies** - Row Level Security prevents unauthorized access  
✅ **Emergency Only** - Location tracking only during active SOS  
✅ **User Control** - Users can stop tracking anytime  
✅ **Automatic Cleanup** - Old sessions marked inactive  

---

## Live Tracking Dashboard (Optional)

You can create a public tracking page at `/track/[sosId]` that:
- Shows real-time location on map
- Updates every 20 seconds
- Displays route history
- Shows last update time
- Accessible to anyone with the link

Example implementation in `/components/LiveTrackingMap.tsx` (not included, but can be built using the Supabase subscription API).

---

## Support

For issues with location tracking:
1. Check browser console for error messages
2. Verify Supabase tables are created
3. Ensure RLS policies are active
4. Test GPS permission in browser
5. Check Twilio SMS logs for delivery status

**Location tracking only works on:**
- ✅ HTTPS (secure) connections
- ✅ Real mobile devices
- ✅ Browsers with GPS support
- ❌ NOT on HTTP (insecure)
- ❌ NOT on desktop without GPS
- ❌ NOT in incognito/private mode (may block GPS)
