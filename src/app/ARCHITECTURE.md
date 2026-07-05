# 🏗️ RakshaNet - Technical Architecture

## System Overview

RakshaNet is a full-stack Progressive Web Application (PWA) implementing a comprehensive women safety platform with multi-layered network communication, real-time emergency response, and AI-powered assistance.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (React PWA)                 │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   SOS    │  │ Contacts │  │   AI     │  │  Admin   │   │
│  │  Module  │  │  Module  │  │ Assistant│  │Dashboard │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Network  │  │  Helper  │  │ Evidence │  │Resources │   │
│  │  Ladder  │  │   Map    │  │ Recorder │  │   Hub    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                         │
│              (Supabase Edge Functions - Hono)                │
├─────────────────────────────────────────────────────────────┤
│  /auth/*  │  /sos/*  │  /helpers/*  │  /evidence/*  │ /ai/* │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND SERVICES                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Supabase   │  │   Supabase   │  │   Supabase   │      │
│  │     Auth     │  │   Storage    │  │   Database   │      │
│  │              │  │  (Evidence)  │  │  (KV Store)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Technologies

| Component | Technology | Purpose |
|-----------|-----------|----------|
| Framework | React 18+ | UI rendering and state management |
| Language | TypeScript | Type-safe development |
| Styling | Tailwind CSS v4 | Utility-first styling |
| UI Components | Shadcn/ui | Pre-built accessible components |
| Icons | Lucide React | Icon library |
| Notifications | Sonner | Toast notifications |
| Routing | React State | Client-side navigation |

### Backend Technologies

| Component | Technology | Purpose |
|-----------|-----------|----------|
| Runtime | Deno | Secure JavaScript/TypeScript runtime |
| Framework | Hono | Lightweight web framework |
| Database | Supabase (PostgreSQL) | Data persistence via KV store |
| Storage | Supabase Storage | File storage for evidence |
| Auth | Supabase Auth | User authentication |
| API Style | REST | HTTP-based API |

### Browser APIs Used

- **Geolocation API**: Real-time GPS tracking
- **DeviceMotion API**: Shake detection
- **Web Audio API**: Emergency alarm sound
- **Web Speech API**: Voice commands (optional)
- **Service Worker API**: Offline functionality
- **Notification API**: Push notifications
- **MediaStream API**: Audio/video recording

## Data Models

### User Model
```typescript
interface User {
  id: string                    // UUID
  email: string                 // User email
  name: string                  // Full name
  phone: string                 // Contact number
  role: 'user' | 'admin'        // User role
  isHelper: boolean             // Helper status
  createdAt: string             // ISO timestamp
}
```

### Emergency Contact Model
```typescript
interface EmergencyContact {
  id: string                    // Unique ID
  name: string                  // Contact name
  phone: string                 // Phone number
  relationship: string          // Relationship type
  priority: number              // 1-5 priority level
}
```

### SOS Model
```typescript
interface SOS {
  id: string                    // SOS_timestamp_random
  userId: string                // User who triggered
  type: 'EMERGENCY' | 'ATTACK' | 'HARASSMENT' | 'ACCIDENT' | 'MEDICAL'
  timestamp: string             // ISO timestamp
  location: {
    lat: number                 // Latitude
    lng: number                 // Longitude
  }
  status: 'ACTIVE' | 'RESOLVED' | 'CANCELLED'
  networkStage: 'CONTACT' | 'MESH' | 'ESP' | 'LORA' | 'SATELLITE' | 'DELIVERED'
  networkUsed: string | null    // Final network used
  helpersAlerted: number        // Count of helpers
  respondedBy: string | null    // Helper who responded
  evidence: Evidence[]          // Attached evidence
  escalationLog: EscalationLog[] // Network escalation history
  resolvedAt?: string           // Resolution timestamp
  resolvedBy?: string           // Who resolved it
}
```

### Helper Model
```typescript
interface Helper {
  userId: string                // User ID
  location: {
    lat: number
    lng: number
  }
  availability: boolean         // Currently available
  registeredAt: string          // Registration time
  sosResponded: number          // Total responses
  rating: number                // 0-5 rating
  distance?: string             // Distance to SOS (calculated)
}
```

## Core Modules

### 1. SOS Emergency System

**Flow:**
```
User Trigger → Location Capture → Create SOS → Alert Contacts
    ↓
Play Alarm → Find Nearby Helpers → Network Escalation
    ↓
Helper Response → Evidence Recording → Resolution
```

**Components:**
- `SOSButton.tsx`: Main trigger component
- `NetworkLadder.tsx`: Escalation visualization
- `NearbyHelpersMap.tsx`: Helper discovery

**Backend Endpoints:**
- `POST /sos/trigger`: Create SOS event
- `POST /sos/:id/update`: Update SOS status
- `POST /sos/:id/resolve`: Resolve SOS
- `GET /sos/user/:userId`: User's SOS history

### 2. Network Ladder System

**Escalation Priority:**
```
1. CONTACT    → Emergency contacts (0s)
2. MESH       → Nearby helpers via proximity (2s)
3. ESP        → Extended mesh network (4s)
4. LORA       → Long-range network (6s)
5. SATELLITE  → Satellite backup (8s)
6. DELIVERED  → Confirmation (10s)
```

**Implementation:**
```typescript
const simulateNetworkEscalation = async (sosId: string) => {
  const stages = ['CONTACT', 'MESH', 'ESP', 'LORA', 'SATELLITE', 'DELIVERED']
  
  for (let i = 0; i < stages.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    await sosAPI.update(sosId, {
      networkStage: stages[i],
      escalationLog: [{
        stage: stages[i],
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        message: `Connected via ${stages[i]}`
      }]
    })
  }
}
```

### 3. Proximity Responder Network

**Algorithm:**
```typescript
function findNearbyHelpers(location: Location, radius: number) {
  1. Get all registered helpers from database
  2. For each helper:
     a. Calculate distance using Haversine formula
     b. Filter by radius (default 2km)
     c. Check availability status
  3. Sort by distance (nearest first)
  4. Return top N helpers
}
```

**Haversine Formula:**
```typescript
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}
```

### 4. Evidence Management

**Storage Architecture:**
```
Supabase Storage Bucket: make-4c768538-evidence (private)
  │
  ├── SOS_timestamp_1/
  │   ├── timestamp_audio.webm
  │   ├── timestamp_video.webm
  │   └── timestamp_image.jpg
  │
  └── SOS_timestamp_2/
      └── ...
```

**Upload Flow:**
```
1. Client requests signed upload URL
2. Server generates signed URL (valid 60 min)
3. Client uploads directly to Supabase Storage
4. Client saves metadata to database
5. Server creates signed download URL (valid 1 hour) on request
```

### 5. AI Safety Assistant

**Current Implementation:**
```typescript
// Rule-based responses
const responses = {
  'nearest police': 'The nearest police station is...',
  'safe route': 'I recommend taking...',
  'what to do': 'Stay calm. Press the SOS button...',
}
```

**Future Enhancement:**
```typescript
// OpenAI/Gemini Integration
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: 'You are a women safety assistant...'
    }, {
      role: 'user',
      content: message
    }]
  })
})
```

## State Management

### Global State (React useState)

```typescript
// App.tsx
const [currentView, setCurrentView] = useState<View>('home')
const [activeSOS, setActiveSOS] = useState<SOS | null>(null)
const [userLocation, setUserLocation] = useState<Location | null>(null)
const [isAuthenticated, setIsAuthenticated] = useState(false)
const [userId, setUserId] = useState<string>('')
```

### Local Storage

```typescript
// Cached data for offline mode
localStorage.setItem('userPreferences', JSON.stringify({
  darkMode: true,
  shakeDetection: true,
  isHelper: false
}))
```

## API Design

### RESTful Endpoints

```
Auth
├── POST /auth/signup                    Create new user
└── POST /auth/login                     User login (future)

Contacts
├── GET  /contacts/:userId               List all contacts
├── POST /contacts/:userId               Add contact
└── DELETE /contacts/:userId/:contactId  Remove contact

SOS
├── POST /sos/trigger                    Trigger emergency
├── GET  /sos/:sosId                     Get SOS details
├── POST /sos/:sosId/update              Update SOS
├── POST /sos/:sosId/resolve             Resolve SOS
└── GET  /sos/user/:userId               User's SOS history

Helpers
├── POST /helpers/register               Register as helper
├── POST /helpers/nearby                 Find nearby helpers
└── POST /helpers/respond                Respond to SOS

Evidence
├── POST /evidence/upload-url            Get upload URL
├── POST /evidence/save-metadata         Save metadata
└── GET  /evidence/:sosId/:fileName      Download evidence

AI
└── POST /ai/safety-assistant            AI chat

Admin
├── GET /admin/stats                     Dashboard stats
└── GET /admin/recent-sos                Recent SOS events
```

### Response Format

```typescript
// Success
{
  "message": "Operation successful",
  "data": { ... }
}

// Error
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Security Architecture

### Authentication Flow

```
1. User Registration
   ├── Client: POST /auth/signup
   ├── Server: Supabase Auth Admin API
   ├── Server: Create user in KV store
   └── Return: User object

2. Protected Routes
   ├── Client: Add Authorization header
   ├── Server: Verify JWT with Supabase
   ├── Server: Extract user ID
   └── Proceed or return 401
```

### Data Encryption

```typescript
// Future implementation
import { AES } from 'crypto-js'

// Encrypt sensitive data
const encrypted = AES.encrypt(
  JSON.stringify(data),
  process.env.ENCRYPTION_KEY
).toString()

// Decrypt
const decrypted = AES.decrypt(
  encrypted,
  process.env.ENCRYPTION_KEY
).toString(CryptoJS.enc.Utf8)
```

### Storage Security

- **Private Buckets**: All evidence stored in private buckets
- **Signed URLs**: Temporary access (1 hour expiry)
- **Row-Level Security**: Database-level access control
- **CORS**: Restricted to allowed origins

## Performance Optimization

### Frontend Optimizations

1. **Code Splitting**: Lazy load components
2. **Memoization**: React.memo for expensive components
3. **Debouncing**: Location updates debounced
4. **Virtual Scrolling**: Large lists virtualized

### Backend Optimizations

1. **Connection Pooling**: Reuse database connections
2. **Caching**: Cache frequent queries
3. **Batch Operations**: Group multiple updates
4. **Indexing**: KV store prefix queries

### Network Optimization

1. **Compression**: Gzip responses
2. **Minimal Payloads**: Only send required data
3. **CDN**: Static assets on CDN
4. **HTTP/2**: Multiplexed connections

## Offline Functionality

### Service Worker Strategy

```typescript
// Cache-first for static assets
// Network-first for API calls with offline fallback

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request)
      })
    )
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request)
      })
    )
  }
})
```

### Offline Data Sync

```typescript
// Queue SOS events when offline
const offlineQueue = []

if (!navigator.onLine) {
  offlineQueue.push({ type: 'SOS', data: sosData })
}

// Sync when back online
window.addEventListener('online', () => {
  offlineQueue.forEach(async (item) => {
    await syncToServer(item)
  })
  offlineQueue = []
})
```

## Monitoring & Logging

### Frontend Logging

```typescript
// Console logs for debugging
console.log('SOS triggered:', sosId)
console.error('Error activating SOS:', error)

// Future: Send to monitoring service
// logToSentry({ level: 'error', message: error })
```

### Backend Logging

```typescript
// Hono logger middleware
app.use('*', logger(console.log))

// Custom logging
console.log(`SOS triggered: ${sosId} by user ${userId}`)
console.log(`Helper ${helperId} responded to SOS ${sosId}`)
```

## Scalability Considerations

### Horizontal Scaling

```
Load Balancer
    │
    ├── Edge Function Instance 1
    ├── Edge Function Instance 2
    └── Edge Function Instance 3
```

### Database Sharding

```typescript
// Future: Partition by user region
const shard = getUserShard(userId)
const db = getShardConnection(shard)
```

### Caching Layer

```typescript
// Future: Redis cache
const cached = await redis.get(`sos:${sosId}`)
if (cached) return JSON.parse(cached)

const data = await database.get(`sos:${sosId}`)
await redis.setex(`sos:${sosId}`, 300, JSON.stringify(data))
```

## Testing Strategy

### Unit Tests
- Component rendering
- API utilities
- Helper functions

### Integration Tests
- SOS flow end-to-end
- Helper response flow
- Contact management

### E2E Tests
- User registration
- SOS activation
- Evidence upload
- Helper network

## Deployment Architecture

```
GitHub Repository
    │
    ├── Push to main
    ↓
Figma Make Platform
    │
    ├── Build React app
    ├── Deploy Edge Functions
    └── Update Supabase
    ↓
Production (PWA accessible via HTTPS)
```

---

## Future Enhancements

1. **Real Hardware Integration**
   - LoRa modules
   - Satellite terminals
   - BLE mesh devices

2. **Advanced AI**
   - GPT-4 integration
   - Computer vision for threat detection
   - Predictive safety routing

3. **Extended Features**
   - Video streaming
   - Live chat with helpers
   - Community safety map
   - ML-based threat detection

4. **Enterprise Features**
   - Multi-tenant support
   - Custom branding
   - API webhooks
   - Advanced analytics

---

**Architecture Version**: 1.0  
**Last Updated**: October 2025  
**Status**: Production-Ready Prototype
