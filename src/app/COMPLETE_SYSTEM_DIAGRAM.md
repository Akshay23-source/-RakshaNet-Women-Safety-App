# 🗺️ RakshaNet Complete System Architecture

**Last Updated**: November 8, 2025

---

## 🎯 SYSTEM OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                        RakshaNet PWA                             │
│                  (React + TypeScript + Tailwind)                │
└─────────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
            ▼                 ▼                 ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │   Browser    │  │   Supabase   │  │    Twilio    │
    │     APIs     │  │   Backend    │  │   SMS API    │
    └──────────────┘  └──────────────┘  └──────────────┘
```

---

## 🚨 SOS FLOW DIAGRAM

```
User Presses SOS Button
        │
        ▼
┌───────────────────┐
│ Request Location  │ ← Browser Geolocation API
│   Permission      │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Get GPS Coords    │ ← navigator.geolocation.getCurrentPosition()
│ (lat, lng)        │
└───────────────────┘
        │
        ├─────────────────────────────────┐
        │                                 │
        ▼                                 ▼
┌───────────────────┐           ┌───────────────────┐
│ Create Tracking   │           │ Start Location    │
│ Session in DB     │           │ Updates (10s)     │
└───────────────────┘           └───────────────────┘
        │                                 │
        ▼                                 ▼
┌───────────────────┐           ┌───────────────────┐
│ Generate Tracking │           │ Save to           │
│ Link              │           │ location_updates  │
└───────────────────┘           └───────────────────┘
        │                                 │
        ▼                                 │
┌───────────────────┐                    │
│ Send SMS to       │                    │
│ Emergency         │                    │
│ Contacts          │                    │
└───────────────────┘                    │
        │                                 │
        └─────────────┬───────────────────┘
                      │
                      ▼
            ┌─────────────────┐
            │ Contacts Receive│
            │ SMS with Link   │
            └─────────────────┘
                      │
                      ▼
            ┌─────────────────┐
            │ Click Link →    │
            │ View Live Map   │
            └─────────────────┘
```

---

## 📊 DATABASE SCHEMA

```sql
┌────────────────────────────────────────┐
│      live_tracking_sessions            │
├────────────────────────────────────────┤
│ id              UUID PRIMARY KEY       │
│ sos_id          TEXT UNIQUE           │  ← Links to location_updates
│ user_id         TEXT                  │
│ user_name       TEXT                  │
│ started_at      TIMESTAMPTZ           │
│ last_update_at  TIMESTAMPTZ           │
│ is_active       BOOLEAN               │
│ total_updates   INTEGER               │
└────────────────────────────────────────┘
                  │
                  │ 1:N relationship
                  │
                  ▼
┌────────────────────────────────────────┐
│         location_updates               │
├────────────────────────────────────────┤
│ id              UUID PRIMARY KEY       │
│ sos_id          TEXT                  │  ← Foreign key to session
│ user_id         TEXT                  │
│ latitude        DOUBLE PRECISION      │
│ longitude       DOUBLE PRECISION      │
│ accuracy        DOUBLE PRECISION      │
│ speed           DOUBLE PRECISION      │
│ heading         DOUBLE PRECISION      │
│ address         TEXT                  │
│ timestamp       TIMESTAMPTZ           │
│ created_at      TIMESTAMPTZ           │
└────────────────────────────────────────┘
```

---

## 🔐 AUTHENTICATION FLOW

```
User Opens App
      │
      ▼
┌─────────────────┐
│ Check if Logged │ ← supabase.auth.getSession()
│      In?        │
└─────────────────┘
      │
      ├─── Yes ──→ Dashboard
      │
      └─── No ───→ Login Screen
                        │
                        ▼
                  ┌─────────────────┐
                  │ Enter Phone     │
                  │ Number          │
                  └─────────────────┘
                        │
                        ▼
                  ┌─────────────────┐
                  │ Supabase sends  │
                  │ OTP via Twilio  │
                  └─────────────────┘
                        │
                        ▼
                  ┌─────────────────┐
                  │ User receives   │
                  │ SMS with code   │
                  └─────────────────┘
                        │
                        ▼
                  ┌─────────────────┐
                  │ Enter OTP       │
                  │ in app          │
                  └─────────────────┘
                        │
                        ▼
                  ┌─────────────────┐
                  │ Verify OTP      │ ← supabase.auth.verifyOtp()
                  └─────────────────┘
                        │
                        ├─── Valid ──→ Dashboard
                        │
                        └─── Invalid → Try Again
```

---

## 📡 SMS SENDING FLOW

```
SOS Triggered
      │
      ▼
┌──────────────────────────┐
│ Get Emergency Contacts   │ ← From user profile
│ from Supabase            │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ For each contact:        │
│ - Format message         │
│ - Add location           │
│ - Add tracking link      │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Call Supabase Edge       │
│ Function:                │
│ send-emergency-sms       │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Edge Function calls      │
│ Twilio API with:         │
│ - Account SID            │ ← From secrets
│ - Auth Token             │ ← From secrets
│ - From Number            │ ← From secrets
│ - To Number              │
│ - Message Body           │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Twilio sends SMS         │
│ to recipient phone       │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Recipient receives:      │
│ 🚨 EMERGENCY ALERT 🚨    │
│ [Name] needs help!       │
│ Location: [Address]      │
│ Tracking: [Link]         │
└──────────────────────────┘
```

---

## 🌐 LIVE TRACKING FLOW

```
Contact Clicks SMS Link
      │
      ▼
┌──────────────────────────┐
│ Open Tracking URL        │
│ /track/:sosId            │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Fetch Session from DB    │ ← live_tracking_sessions
│ using sosId              │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Subscribe to Realtime    │ ← Supabase Realtime
│ location_updates         │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Display Map with:        │
│ - Initial location       │
│ - Tracking start time    │
│ - Update count           │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Every 10 seconds:        │
│ - New location arrives   │ ← Realtime subscription
│ - Update map marker      │
│ - Update timestamp       │
│ - Smooth transition      │
└──────────────────────────┘
```

---

## 🔧 TECHNOLOGY STACK

```
┌─────────────────────────────────────────────────────────┐
│                       Frontend                          │
├─────────────────────────────────────────────────────────┤
│ • React 18 + TypeScript                                 │
│ • Tailwind CSS v4                                       │
│ • ShadCN UI Components                                  │
│ • Vite Build Tool                                       │
│ • PWA (Service Worker)                                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Browser APIs                         │
├─────────────────────────────────────────────────────────┤
│ • Geolocation API (GPS tracking)                        │
│ • Web Bluetooth API (SmartWatch)                        │
│ • Service Worker (offline support)                      │
│ • Notifications API                                     │
│ • Camera/Microphone (evidence capture)                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                       Backend                           │
├─────────────────────────────────────────────────────────┤
│ • Supabase (PostgreSQL)                                 │
│ • Supabase Auth (Phone OTP)                             │
│ • Supabase Realtime (WebSockets)                        │
│ • Supabase Storage                                      │
│ • Edge Functions (Deno)                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  External Services                      │
├─────────────────────────────────────────────────────────┤
│ • Twilio (SMS OTP & Alerts)                             │
│ • OpenStreetMap (Maps)                                  │
│ • Nominatim (Geocoding)                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Deployment                           │
├─────────────────────────────────────────────────────────┤
│ • Netlify / Vercel (Frontend)                           │
│ • Supabase Cloud (Backend)                              │
│ • PWA (Installable)                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🔒 SECURITY LAYERS

```
┌─────────────────────────────────────────────────────────┐
│                  Application Level                      │
├─────────────────────────────────────────────────────────┤
│ ✅ Phone OTP Authentication                             │
│ ✅ Session Management                                   │
│ ✅ Input Validation                                     │
│ ✅ XSS Protection                                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Database Level                       │
├─────────────────────────────────────────────────────────┤
│ ✅ Row Level Security (RLS)                             │
│ ✅ Authenticated User Policies                          │
│ ✅ Anonymous Emergency Access                           │
│ ✅ Service Role Isolation                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   Transport Level                       │
├─────────────────────────────────────────────────────────┤
│ ✅ HTTPS Only                                           │
│ ✅ Secure WebSocket (WSS)                               │
│ ✅ API Key Rotation                                     │
│ ✅ CORS Configuration                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   Privacy & Compliance                  │
├─────────────────────────────────────────────────────────┤
│ ✅ Location data encrypted                              │
│ ✅ Auto cleanup old data (30 days)                      │
│ ✅ User consent for tracking                            │
│ ✅ Emergency contacts managed by user                   │
└─────────────────────────────────────────────────────────┘
```

---

## 📍 LOCATION TRACKING DETAIL

```
┌─────────────────────────────────────────────────────────┐
│           Location Update Cycle (Every 10s)             │
└─────────────────────────────────────────────────────────┘

1. Get Position
   ↓
   navigator.geolocation.getCurrentPosition({
     enableHighAccuracy: true,
     timeout: 5000,
     maximumAge: 0
   })
   
2. Extract Data
   ↓
   {
     latitude: 28.6139,
     longitude: 77.2090,
     accuracy: 10 (meters),
     speed: 0 (m/s),
     heading: null,
     timestamp: ISO string
   }

3. Reverse Geocode (Optional)
   ↓
   Nominatim API: coords → address
   "Connaught Place, New Delhi, India"

4. Save to Database
   ↓
   INSERT INTO location_updates (
     sos_id, user_id, latitude, longitude,
     accuracy, speed, heading, address, timestamp
   )

5. Trigger Realtime
   ↓
   Supabase broadcasts to all subscribers
   (Emergency contacts viewing tracking link)

6. Update Session
   ↓
   UPDATE live_tracking_sessions
   SET total_updates = total_updates + 1,
       last_update_at = NOW()

7. Wait 10 seconds
   ↓
   setTimeout(updateLocation, 10000)
   
8. Repeat from step 1
```

---

## 🎨 UI COMPONENT HIERARCHY

```
App.tsx
│
├── WelcomeScreen
│   └── Get Started Button
│
├── LoginScreen
│   ├── Phone Input
│   └── Request OTP Button
│
├── OTPVerification
│   ├── OTP Input
│   └── Verify Button
│
├── PermissionsScreen
│   ├── Location Permission
│   ├── Camera Permission
│   ├── Microphone Permission
│   └── Notification Permission
│
├── ProfileSetup
│   ├── Name Input
│   ├── Emergency Contacts
│   └── Save Button
│
└── Dashboard (Main App)
    │
    ├── Header
    │   ├── Logo
    │   ├── Network Status
    │   └── Profile Menu
    │
    ├── SOSButton (Center)
    │   ├── Countdown Animation
    │   └── Active Indicator
    │
    ├── LiveTrackingIndicator
    │   ├── Session Info
    │   ├── Update Count
    │   └── Stop Button
    │
    ├── Quick Actions
    │   ├── Evidence Recording
    │   ├── Emergency Services
    │   ├── Nearby Helpers
    │   └── Safety Resources
    │
    ├── Modules
    │   ├── AI Assistant
    │   ├── Safety Locations
    │   ├── Legal Rights
    │   ├── Emergency Rides
    │   ├── Health Services
    │   ├── Police Complaints
    │   ├── Safety Alerts
    │   ├── Self Defense
    │   ├── First Aid
    │   ├── Blood Donor
    │   ├── Safe Stays
    │   └── Route Planning
    │
    └── Footer
        ├── Navigation
        └── Version Info
```

---

## 🚀 DEPLOYMENT PIPELINE

```
Local Development
      │
      ▼
┌──────────────────┐
│ npm run dev      │ ← Vite dev server (localhost:5173)
└──────────────────┘
      │
      ▼
Make Changes
      │
      ▼
┌──────────────────┐
│ Test Features    │
│ - SOS flow       │
│ - Location       │
│ - SMS (mock)     │
└──────────────────┘
      │
      ▼
┌──────────────────┐
│ Build            │
│ npm run build    │
└──────────────────┘
      │
      ▼
┌──────────────────┐
│ Deploy           │
│ - Push to Git    │
│ - Netlify/Vercel │
│   auto-deploys   │
└──────────────────┘
      │
      ▼
Production
┌──────────────────┐
│ Live URL         │
│ - PWA ready      │
│ - SSL enabled    │
│ - CDN served     │
└──────────────────┘
```

---

## 🔄 DATA FLOW SUMMARY

```
User Action
    ↓
Frontend (React)
    ↓
Browser API (Geolocation/Bluetooth)
    ↓
Supabase Client
    ↓
Supabase Backend
    ├→ PostgreSQL Database
    ├→ Edge Function
    │   └→ Twilio API
    │       └→ SMS Delivery
    └→ Realtime Subscription
        └→ Emergency Contacts
```

---

## 📊 PERFORMANCE METRICS

```
Target Metrics:

┌──────────────────────────────────┬──────────┐
│ Metric                           │ Target   │
├──────────────────────────────────┼──────────┤
│ SOS Button Response Time         │ < 100ms  │
│ Location Acquisition             │ < 3s     │
│ Database Insert                  │ < 500ms  │
│ SMS Delivery                     │ < 10s    │
│ Realtime Update Latency          │ < 1s     │
│ First Contentful Paint           │ < 1.5s   │
│ Time to Interactive              │ < 3s     │
│ Location Update Interval         │ 10s      │
│ Offline Mode Support             │ Yes      │
│ PWA Install Size                 │ < 5MB    │
└──────────────────────────────────┴──────────┘
```

---

## 🎯 FEATURE AVAILABILITY

```
┌────────────────────────────┬─────────┬─────────┬─────────┐
│ Feature                    │ Desktop │ Mobile  │ Offline │
├────────────────────────────┼─────────┼─────────┼─────────┤
│ SOS Button                 │   ✅    │   ✅    │   ✅    │
│ Location Tracking          │   ✅    │   ✅    │   ⚠️    │
│ SMS Alerts                 │   ✅    │   ✅    │   ❌    │
│ Evidence Recording         │   ✅    │   ✅    │   ✅    │
│ SmartWatch (Bluetooth)     │   ⚠️    │   ✅    │   ⚠️    │
│ Voice Assistant            │   ✅    │   ✅    │   ❌    │
│ Safety Resources           │   ✅    │   ✅    │   ✅    │
│ Emergency Contacts         │   ✅    │   ✅    │   ✅    │
│ AI Guidance                │   ✅    │   ✅    │   ❌    │
│ Nearby Helpers             │   ✅    │   ✅    │   ❌    │
│ Live Tracking Viewer       │   ✅    │   ✅    │   ❌    │
└────────────────────────────┴─────────┴─────────┴─────────┘

✅ Fully Supported
⚠️ Limited Support
❌ Requires Network
```

---

**System Status**: Production Ready  
**Last Review**: November 8, 2025  
**Documentation Version**: 2.0
