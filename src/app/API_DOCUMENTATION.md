# 🔌 RakshaNet API Documentation

Complete API reference for the RakshaNet Women Safety Network backend.

## Base URL

```
https://{projectId}.supabase.co/functions/v1/make-server-4c768538
```

## Authentication

All requests require the following header:

```http
Authorization: Bearer {publicAnonKey}
```

For protected routes, use the user's access token instead of the public anon key.

## Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message description"
}
```

---

## 🔐 Authentication Endpoints

### Sign Up

Create a new user account.

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "Jane Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "user_metadata": {
      "name": "Jane Doe",
      "phone": "+1234567890"
    }
  },
  "message": "Signup successful"
}
```

**Error Codes:**
- `400` - Invalid input or user already exists
- `500` - Server error

---

## 📞 Emergency Contacts Endpoints

### Get All Contacts

Retrieve all emergency contacts for a user.

**Endpoint:** `GET /contacts/:userId`

**URL Parameters:**
- `userId` (string) - User's unique identifier

**Response:**
```json
{
  "contacts": [
    {
      "id": "contact_1234567890_abc123",
      "name": "Mom",
      "phone": "+1234567890",
      "relationship": "family",
      "priority": 1
    }
  ]
}
```

### Add Contact

Add a new emergency contact.

**Endpoint:** `POST /contacts/:userId`

**URL Parameters:**
- `userId` (string) - User's unique identifier

**Request Body:**
```json
{
  "name": "Mom",
  "phone": "+1234567890",
  "relationship": "family",
  "priority": 1
}
```

**Response:**
```json
{
  "contact": {
    "id": "contact_1234567890_abc123",
    "name": "Mom",
    "phone": "+1234567890",
    "relationship": "family",
    "priority": 1
  },
  "message": "Contact added"
}
```

### Delete Contact

Remove an emergency contact.

**Endpoint:** `DELETE /contacts/:userId/:contactId`

**URL Parameters:**
- `userId` (string) - User's unique identifier
- `contactId` (string) - Contact's unique identifier

**Response:**
```json
{
  "message": "Contact deleted"
}
```

---

## 🆘 SOS Endpoints

### Trigger SOS

Create and activate an emergency SOS.

**Endpoint:** `POST /sos/trigger`

**Request Body:**
```json
{
  "userId": "user-uuid",
  "location": {
    "lat": 12.9716,
    "lng": 77.5946
  },
  "type": "EMERGENCY"
}
```

**Type Options:**
- `EMERGENCY` - General emergency
- `ATTACK` - Physical attack
- `HARASSMENT` - Harassment situation
- `ACCIDENT` - Accident occurred
- `MEDICAL` - Medical emergency

**Response:**
```json
{
  "sosId": "SOS_1729598400000_abc123",
  "message": "SOS triggered successfully",
  "sos": {
    "id": "SOS_1729598400000_abc123",
    "userId": "user-uuid",
    "type": "EMERGENCY",
    "timestamp": "2025-10-22T10:00:00.000Z",
    "location": {
      "lat": 12.9716,
      "lng": 77.5946
    },
    "depth_m": 0,
    "confidence": 0.95,
    "status": "ACTIVE",
    "networkStage": "CONTACT",
    "networkUsed": null,
    "helpersAlerted": 0,
    "respondedBy": null,
    "evidence": [],
    "escalationLog": []
  }
}
```

### Get SOS Details

Retrieve details of a specific SOS event.

**Endpoint:** `GET /sos/:sosId`

**URL Parameters:**
- `sosId` (string) - SOS event identifier

**Response:**
```json
{
  "sos": {
    "id": "SOS_1729598400000_abc123",
    "userId": "user-uuid",
    "type": "EMERGENCY",
    "status": "ACTIVE",
    "location": { ... },
    ...
  }
}
```

### Update SOS

Update SOS status or details.

**Endpoint:** `POST /sos/:sosId/update`

**URL Parameters:**
- `sosId` (string) - SOS event identifier

**Request Body:**
```json
{
  "networkStage": "MESH",
  "helpersAlerted": 3,
  "escalationLog": [
    {
      "stage": "MESH",
      "timestamp": "2025-10-22T10:00:02.000Z",
      "status": "SUCCESS",
      "message": "Connected via MESH"
    }
  ]
}
```

**Response:**
```json
{
  "sos": { ... },
  "message": "SOS updated"
}
```

### Resolve SOS

Mark an SOS as resolved.

**Endpoint:** `POST /sos/:sosId/resolve`

**URL Parameters:**
- `sosId` (string) - SOS event identifier

**Request Body:**
```json
{
  "resolvedBy": "user-uuid"
}
```

**Response:**
```json
{
  "sos": {
    "id": "SOS_1729598400000_abc123",
    "status": "RESOLVED",
    "resolvedAt": "2025-10-22T10:15:00.000Z",
    "resolvedBy": "user-uuid",
    ...
  },
  "message": "SOS resolved"
}
```

### Get User's SOS History

Retrieve all SOS events for a user.

**Endpoint:** `GET /sos/user/:userId`

**URL Parameters:**
- `userId` (string) - User's unique identifier

**Response:**
```json
{
  "sosList": [
    {
      "id": "SOS_1729598400000_abc123",
      "type": "EMERGENCY",
      "status": "RESOLVED",
      ...
    }
  ]
}
```

---

## 👥 Helper Network Endpoints

### Register as Helper

Register a user as available helper.

**Endpoint:** `POST /helpers/register`

**Request Body:**
```json
{
  "userId": "user-uuid",
  "location": {
    "lat": 12.9716,
    "lng": 77.5946
  },
  "availability": true
}
```

**Response:**
```json
{
  "helper": {
    "userId": "user-uuid",
    "location": { ... },
    "availability": true,
    "registeredAt": "2025-10-22T10:00:00.000Z",
    "sosResponded": 0,
    "rating": 5.0
  },
  "message": "Registered as helper"
}
```

### Find Nearby Helpers

Locate helpers within specified radius.

**Endpoint:** `POST /helpers/nearby`

**Request Body:**
```json
{
  "location": {
    "lat": 12.9716,
    "lng": 77.5946
  },
  "radius": 2
}
```

**Radius:** Distance in kilometers (default: 1km)

**Response:**
```json
{
  "helpers": [
    {
      "userId": "helper-uuid",
      "location": { ... },
      "availability": true,
      "registeredAt": "2025-10-22T09:00:00.000Z",
      "sosResponded": 5,
      "rating": 4.8,
      "distance": "0.45"
    }
  ],
  "count": 3
}
```

### Respond to SOS

Helper responds to an active SOS.

**Endpoint:** `POST /helpers/respond`

**Request Body:**
```json
{
  "sosId": "SOS_1729598400000_abc123",
  "helperId": "helper-uuid",
  "eta": "5 min"
}
```

**Response:**
```json
{
  "message": "Response recorded",
  "sos": {
    "id": "SOS_1729598400000_abc123",
    "respondedBy": "helper-uuid",
    "responderETA": "5 min",
    "responseTime": "2025-10-22T10:00:30.000Z",
    "responders": [
      {
        "helperId": "helper-uuid",
        "eta": "5 min",
        "respondedAt": "2025-10-22T10:00:30.000Z"
      }
    ],
    ...
  }
}
```

---

## 🎥 Evidence Management Endpoints

### Get Upload URL

Generate signed URL for evidence upload.

**Endpoint:** `POST /evidence/upload-url`

**Request Body:**
```json
{
  "sosId": "SOS_1729598400000_abc123",
  "fileName": "audio_recording.webm",
  "fileType": "audio"
}
```

**File Types:**
- `audio` - Audio recording
- `video` - Video recording
- `image` - Photo/screenshot

**Response:**
```json
{
  "uploadUrl": "https://...",
  "filePath": "SOS_1729598400000_abc123/1729598460000_audio_recording.webm",
  "message": "Upload URL generated"
}
```

**Note:** Upload URL is valid for 60 minutes. Upload directly to this URL using PUT request.

### Save Evidence Metadata

Save evidence file metadata after upload.

**Endpoint:** `POST /evidence/save-metadata`

**Request Body:**
```json
{
  "sosId": "SOS_1729598400000_abc123",
  "filePath": "SOS_1729598400000_abc123/1729598460000_audio_recording.webm",
  "fileType": "audio",
  "duration": 120
}
```

**Response:**
```json
{
  "evidence": {
    "sosId": "SOS_1729598400000_abc123",
    "filePath": "SOS_1729598400000_abc123/1729598460000_audio_recording.webm",
    "fileType": "audio",
    "duration": 120,
    "uploadedAt": "2025-10-22T10:01:00.000Z"
  },
  "message": "Evidence metadata saved"
}
```

### Get Download URL

Generate signed URL for evidence download.

**Endpoint:** `GET /evidence/:sosId/:fileName`

**URL Parameters:**
- `sosId` (string) - SOS event identifier
- `fileName` (string) - File name (with timestamp prefix)

**Response:**
```json
{
  "downloadUrl": "https://..."
}
```

**Note:** Download URL is valid for 1 hour.

---

## 🤖 AI Assistant Endpoint

### Chat with AI

Send message to AI safety assistant.

**Endpoint:** `POST /ai/safety-assistant`

**Request Body:**
```json
{
  "message": "nearest police station",
  "context": {
    "location": {
      "lat": 12.9716,
      "lng": 77.5946
    }
  }
}
```

**Response:**
```json
{
  "reply": "The nearest police station is 800m away at Main Street. Dial 100 for emergency.",
  "timestamp": "2025-10-22T10:00:00.000Z"
}
```

**Supported Queries:**
- "nearest police" - Find nearby police station
- "safe route" - Get route recommendation
- "what to do" - Emergency guidance
- "help" - General help

---

## 📊 Admin Endpoints

### Get Dashboard Statistics

Retrieve system-wide statistics.

**Endpoint:** `GET /admin/stats`

**Response:**
```json
{
  "stats": {
    "totalUsers": 150,
    "totalHelpers": 45,
    "totalSOS": 23,
    "activeSOS": 2,
    "resolvedSOS": 21,
    "averageResponseTime": "2.3 min",
    "timestamp": "2025-10-22T10:00:00.000Z"
  }
}
```

### Get Recent SOS Events

Retrieve recent SOS events.

**Endpoint:** `GET /admin/recent-sos`

**Response:**
```json
{
  "sosList": [
    {
      "id": "SOS_1729598400000_abc123",
      "userId": "user-uuid",
      "type": "EMERGENCY",
      "status": "ACTIVE",
      "timestamp": "2025-10-22T10:00:00.000Z",
      "location": { ... },
      ...
    }
  ]
}
```

**Note:** Returns up to 20 most recent SOS events.

---

## 🔄 Network Stages

SOS events progress through these network stages:

1. **CONTACT** - Initial alert to emergency contacts
2. **MESH** - Nearby helpers via proximity network
3. **ESP** - Extended mesh network (simulated)
4. **LORA** - Long-range network (simulated)
5. **SATELLITE** - Satellite backup (simulated)
6. **DELIVERED** - Successfully delivered

---

## 📈 Rate Limits

Currently no rate limits are enforced on the development server.

**Recommended for Production:**
- Authentication: 5 requests/minute
- SOS Trigger: 10 requests/minute
- Other endpoints: 60 requests/minute

---

## 🛡️ Security Best Practices

1. **Never expose Service Role Key** - Use only in backend
2. **Use Access Tokens** - For user-specific operations
3. **Validate Input** - Always validate on server-side
4. **HTTPS Only** - Never use HTTP in production
5. **Signed URLs** - Use for file uploads/downloads
6. **Token Expiry** - Refresh tokens regularly

---

## 🧪 Testing Examples

### Using cURL

```bash
# Trigger SOS
curl -X POST https://{projectId}.supabase.co/functions/v1/make-server-4c768538/sos/trigger \
  -H "Authorization: Bearer {publicAnonKey}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "location": {"lat": 12.9716, "lng": 77.5946},
    "type": "EMERGENCY"
  }'
```

### Using JavaScript (Fetch)

```javascript
const response = await fetch(
  'https://{projectId}.supabase.co/functions/v1/make-server-4c768538/sos/trigger',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: 'test-user-123',
      location: { lat: 12.9716, lng: 77.5946 },
      type: 'EMERGENCY'
    })
  }
)

const data = await response.json()
console.log(data)
```

---

## 📞 Support

For API issues or questions, check:
1. Server logs in Supabase dashboard
2. Browser console for frontend errors
3. Network tab in DevTools for request/response

---

**API Version:** 1.0  
**Last Updated:** October 2025  
**Status:** Production Ready
