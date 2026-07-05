# Implementation Plan - Women Safety Application Enhancements

This document outlines the changes implemented in the **Women Safety Application** codebase to address package dependency errors, replace OTP verification, integrate Leaflet interactive maps, set up Firebase backend services, and implement a mesh network propagation visualizer.

## Feature and Functionality Diagrams

### 1. Overall System Architecture & Data Storage
```mermaid
graph TD
    UserDevice[User Web Application - Vite/React]
    FirebaseProject[Firebase Project: women-safety-application-96a91]
    Firestore[(Firestore Database)]
    CloudStorage[(Firebase Cloud Storage)]

    UserDevice -->|Auth & Token| FirebaseProject
    UserDevice -->|Contacts & SOS Docs| Firestore
    UserDevice -->|Media Recordings| CloudStorage
    
    subgraph Offline / Fallback Mode
        LocalStorage[(Browser LocalStorage)]
        UserDevice -->|Mock Data Fallback| LocalStorage
    end
```

### 2. User Onboarding & Instant Authentication Flow
```mermaid
stateDiagram-v2
    [*] --> WelcomeScreen : App Opened
    WelcomeScreen --> PermissionsScreen : Click Get Started
    PermissionsScreen --> ProfileSetup : Grant GPS/Camera permissions
    ProfileSetup --> LoginScreen : Complete Profile details
    LoginScreen --> DirectLogin : Enter Email / Name
    DirectLogin --> AppDashboard : Complete (Saved to localStorage)
```

### 3. Safe Route Planning & Navigation Flow
```mermaid
graph TD
    A[Start: Route Planner Opened] --> B[Enter Destination]
    B --> C[Fetch Current GPS Coordinates]
    C --> D[AI Safety Analysis Calculation]
    D --> E[Query Nearby Safe Havens / Police / Hospitals]
    E --> F[Render Leaflet Interactive Map Canvas]
    F --> G[Draw Zig-Zag Route Polyline & Markers]
```

### 4. SOS Emergency Trigger & Evidence Relaying
```mermaid
graph TD
    Trigger[SOS Activated: Shake / Watch / Button] --> Alarm[Play Loud Alert Sirens]
    Trigger --> SMS[Auto-send SMS to trusted contacts]
    Trigger --> Live[Start GPS Live Location Tracker]
    Trigger --> Mesh[Propaginate peer-to-peer Mesh Relays]
    Trigger --> Evidence[Record Video/Audio Evidence Blobs]
    Evidence --> Storage[Upload Evidence to Firebase Storage]
```

### 5. Mesh Network SOS Hopping Relay Sequence
```mermaid
sequenceDiagram
    autonumber
    actor User as SOS Origin (You)
    participant NodeA as Priya Sharma (Node A)
    participant NodeB as Anita Desai (Node B)
    participant NodeC as Kavya Reddy (Node C)
    actor Responder as Emergency Responder

    User->>NodeA: Broadcast SOS Beacon (0.5 km)
    Note over NodeA: Node A is Busy / On Call
    NodeA-->>User: Route Declined

    User->>NodeB: Hop to Next Peer (0.8 km)
    Note over NodeB: Node B Offline / Device Inactive
    NodeB-->>User: Hop Timeout

    User->>NodeC: Hop to Next Peer (1.2 km)
    NodeC->>Responder: Relay SOS Signal (2.5 km)
    Responder-->>NodeC: Accept & Dispatch Help (ETA 4m)
    NodeC-->>User: Connected! Aid Dispatched
```

### 6. Offline Mode & Local Synchronization Flow
```mermaid
graph TD
    NetworkTest[Perform API Connection Check] -->|Online| LiveDb[Write/Read directly from Firebase Firestore]
    NetworkTest -->|Offline| OfflineMode[Enable isDemoMode & OfflineManager]
    OfflineMode --> Cache[Save Contacts/SOS updates to Browser LocalStorage]
    Cache --> Reconnect[Network Connection Restored]
    Reconnect --> Sync[Sync queued data to Firebase Firestore]
```

### 7. AI Safety Assistant Situation-Aware Chat Flow
```mermaid
sequenceDiagram
    autonumber
    actor User as User Chat Interface
    participant AI as AI Assistant API
    participant Location as Geolocation API
    participant LLM as Safety Response Generator

    User->>AI: Send Safety Query (e.g. "I'm being followed")
    AI->>Location: Retrieve Current Location Context
    Location-->>AI: Location coordinates
    AI->>LLM: Send Message + SITUATION CONTEXT
    Note over LLM: Evaluates closest police station, safe stay coordinates & self defense guides
    LLM-->>AI: Custom response text
    AI-->>User: Render guidance + safety route maps
```

### 8. Device Shake Detection SOS Activation Logic
```mermaid
graph TD
    A[Start: devicemotion Event Listener] --> B[Read Acceleration X, Y, Z]
    B --> C{Delta > Threshold 15?}
    C -->|No| B
    C -->|Yes| D{Time Diff > 3s?}
    D -->|Yes| E[Reset Shake Count to 1]
    D -->|No| F[Increment Shake Count]
    E --> G{Shake Count >= 4?}
    F --> G
    G -->|No| B
    G -->|Yes| H[Trigger SOS Activation]
```

### 9. Evidence Recording Streams Capture Flow
```mermaid
graph TD
    A[Start Evidence Recording] --> B{Verify Secure Context & MediaDevices}
    B -->|Fail| C[Show Permissions Policy Error]
    B -->|Pass| D[Request User Permission for Camera/Microphone]
    D -->|Denied| E[Display Access Denied Toast]
    D -->|Granted| F[Initialize MediaRecorder with WebM mimeType]
    F --> G[Collect recorded chunks in array]
    G --> H[Stop: Generate local blob / upload to Storage]
```

### 10. Emergency Helpline Dialer Routing Flow
```mermaid
graph TD
    A[User opens Emergency Helplines Screen] --> B[Fetch local helpline numbers database]
    B --> C[Tap Helpline Call Button]
    C --> D{Verify Device Capability}
    D -->|Desktop| E[Show helper details pop-up]
    D -->|Mobile| F[Navigate tel: protocol to launch native Dialer]
```

### 11. Helper Response & Direct Dispatch Flow
```mermaid
graph TD
    A[Firestore SOS document set to ACTIVE] --> B[Nearby Helpers query active documents]
    B --> C[Display active Alert Card on Helper Dashboard]
    C --> D[Helper clicks Respond & selects ETA]
    D --> E[Update SOS Document with respondedBy details]
    E --> F[Trigger direct ETA update toast on victim's screen]
```

---

## Proposed Changes

The following components and files have been modified or added:

### Package Configuration & Tooling
---
#### [MODIFY] [package.json](file:///c:/Users/ASUS/Downloads/Women%20Safety%20Application/package.json)
- Cleaned up malformed versioned duplicate keys in `dependencies`.
- Removed unsupported `@jsr/supabase__supabase-js` package reference.
- Added `leaflet` and dev dependency `@types/leaflet`.
- Added `firebase` SDK to project dependencies.

#### [MODIFY] [vite.config.ts](file:///c:/Users/ASUS/Downloads/Women%20Safety%20Application/vite.config.ts)
- Configured custom regex-based resolve aliases to strip `@version` suffixes (e.g. `@radix-ui/react-label@2.1.2` -> `@radix-ui/react-label`) to resolve Figma export issues.

### Authentication & Signup Flow
---
#### [MODIFY] [LoginScreen.tsx](file:///c:/Users/ASUS/Downloads/Women%20Safety%20Application/src/app/components/LoginScreen.tsx)
- Removed `OTPVerification` modal step.
- Updated `handleSignup` to directly write user info to `localStorage` and trigger `onComplete()`.
- Set default login tab to **Email**.
- Cleaned up security notes to describe instant secure sign-up without OTP validation code.

### Mapping & Navigation (Leaflet Integration)
---
#### [MODIFY] [main.tsx](file:///c:/Users/ASUS/Downloads/Women%20Safety%20Application/src/main.tsx)
- Imported `leaflet/dist/leaflet.css` globally.

#### [MODIFY] [RoutePlanning.tsx](file:///c:/Users/ASUS/Downloads/Women%20Safety%20Application/src/app/components/RoutePlanning.tsx)
- Replaced the external Google Maps redirection with an embedded, interactive Leaflet Map.
- Plotted starting point (user's location), destination point, route path, police stations, and hospitals along the route with custom HTML/CSS divIcons.

#### [MODIFY] [NearbyHelpersMap.tsx](file:///c:/Users/ASUS/Downloads/Women%20Safety%20Application/src/app/components/NearbyHelpersMap.tsx)
- Replaced the mock CSS grid map with a real Leaflet instance displaying active helpers relative to the user's live position.

### Backend & Cloud Storage (Firebase Integration)
---
#### [NEW] [firebase.ts](file:///c:/Users/ASUS/Downloads/Women%20Safety%20Application/src/app/utils/firebase.ts)
- Initialized Firebase client SDK (Auth, Firestore, Storage) pointing to project `women-safety-application-96a91`.
- Enabled configuration using standard Vite environment variables.

#### [MODIFY] [api.ts](file:///c:/Users/ASUS/Downloads/Women%20Safety%20Application/src/app/utils/api.ts)
- Integrated Firestore queries into `contactsAPI` and `sosAPI`.
- Integrated Firebase Storage file upload into `evidenceAPI` to upload recording files.
- Provided fallback handlers to local mock variables when Firebase environment keys are inactive.

### Mesh Network SOS Relay
---
#### [NEW] [MeshNetworkHops.tsx](file:///c:/Users/ASUS/Downloads/Women%20Safety%20Application/src/app/components/MeshNetworkHops.tsx)
- Built a visual timeline demonstrating peer-to-peer hopping:
  - Relays through adjacent nodes.
  - Handles busy/inactive node cases by propagating further.
  - Finalizes when an available responder accepts the call.

#### [MODIFY] [App.tsx](file:///c:/Users/ASUS/Downloads/Women%20Safety%20Application/src/app/App.tsx)
- Added import for `MeshNetworkHops`.
- Arranged active SOS section into a 3-column dashboard consisting of Network Status ladder, Mesh Network Hops visualizer, and Nearby Helpers Leaflet map.

## Verification Plan

### Automated Tests
- Verify successful Vite compiler output: `npm run dev` starting successfully without module resolution errors.

### Manual Verification
1. Launch [http://localhost:5175/](http://localhost:5175/).
2. Submit the Signup form using the Email tab (observe instant login bypass without OTP screen).
3. Open **Plan Safe Route**, type a destination, and confirm that the Leaflet map displays the plotted route correctly.
4. Click **Trigger SOS** and verify that:
   - The 3-column dashboard is rendered.
   - The **Mesh Network Propagation** visualizer plays through the relay hops.
   - The **Nearby Helpers** map plots current positions on a Leaflet map.
