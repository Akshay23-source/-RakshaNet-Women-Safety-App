# Location Handling in RakshaNet

## Overview
RakshaNet uses geolocation services to provide location-based safety features. The app is designed to work gracefully in all environments, including restricted contexts like iframes and preview modes.

## How Location Works

### 1. **Production Mode (Real Device)**
- Requests user's real-time GPS location
- Tracks location changes for accurate helper proximity
- Shows nearby emergency services based on actual coordinates

### 2. **Demo/Preview Mode (Restricted Environment)**
- Automatically falls back to Bangalore, India (12.9716, 77.5946)
- All location-based features work with demo data
- No errors shown to user - seamless experience

## Implementation Details

### Fallback Strategy
The app uses a multi-layer fallback approach:

```typescript
1. Try to get real GPS location (3-second timeout)
2. If blocked by permissions policy → Use demo location
3. If timeout occurs → Use demo location
4. If geolocation unavailable → Use demo location
```

### Error Suppression
- Permissions policy errors are handled silently
- Console logs are informative, not alarming
- User sees friendly "demo mode" message instead of errors

### Features That Work in Demo Mode
✅ SOS button activation
✅ Nearby helpers simulation
✅ Emergency contacts
✅ Safety location finder
✅ Community updates
✅ All UI interactions

### Testing Location Features

**On Real Device:**
1. Open app in mobile browser (Chrome/Safari)
2. Grant location permission when prompted
3. App uses real GPS coordinates

**In Preview/Development:**
1. App automatically uses Bangalore demo location
2. All features work with simulated data
3. No permission prompts or errors

## Common Issues

### "Geolocation has been disabled by permissions policy"
**What it means:** The browser environment (iframe/preview) blocks location access

**Solution:** This is handled automatically! The app:
- Uses demo location (Bangalore)
- Shows "Running in demo mode" message
- All features continue working normally

### No Location Updates
**Cause:** Location watching may not work in restricted environments

**Impact:** Minimal - most features use point-in-time location
**Workaround:** Use manual location refresh if needed

## For Developers

### Testing Location Features Locally
```bash
# Test with real location (requires HTTPS or localhost)
npm run dev

# Access at https://localhost:5173
# Grant location permission when prompted
```

### Customizing Demo Location
Edit `/utils/location.ts`:
```typescript
// Change default location coordinates
resolve({
  lat: YOUR_LATITUDE,
  lng: YOUR_LONGITUDE
})
```

### Adding Location-Based Features
Always handle both real and demo locations:
```typescript
const location = await getCurrentLocation()
// location will always resolve (never rejects)
// May be real GPS or demo fallback
```

## User Experience

### With Location Access
- ✅ Real-time GPS tracking
- ✅ Accurate nearby helpers
- ✅ Precise emergency services
- ✅ Live location sharing

### Without Location Access (Demo Mode)
- ✅ All features work with Bangalore data
- ✅ Can test complete user flow
- ✅ No errors or broken experiences
- ✅ Smooth demonstration of capabilities

## Security & Privacy

- Location is never stored without consent
- Permission requests are explicit
- Fallback location doesn't expose user data
- No tracking in demo mode

## Future Enhancements

1. **Manual Location Entry:** Let users type their city/area
2. **Location History:** Optional feature for frequent travelers
3. **Offline Maps:** Cache maps for no-network scenarios
4. **IP-based Approximation:** Use IP geolocation as another fallback

---

**Note:** The app is designed to provide maximum safety features regardless of location availability. Demo mode ensures full functionality during development, testing, and in restricted environments.
