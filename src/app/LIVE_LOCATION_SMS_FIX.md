# Live Location SMS Fix - Complete Implementation Guide

## 🔧 What Was Fixed

### Issue
Trusted contacts were not receiving live location SMS updates when the SOS buzzer was pressed.

### Root Cause
The `sendSOSToContact` function in `/utils/sms-alert.ts` was only logging to console but **not actually sending SMS messages**. It had commented-out code instead of real Twilio integration.

### Solution Implemented
1. **Updated SMS Sending Function** - Now uses the Supabase Edge Function `send-emergency-sms` to send real SMS via Twilio
2. **Fixed Live Location Tracker** - Refactored to use timer-based SMS sending instead of GPS update counting
3. **Added Type Support** - Extended Location interface to support both naming conventions

---

## ✅ Changes Made

### 1. `/utils/sms-alert.ts` - Real SMS Integration
```typescript
// BEFORE: Only logged to console
console.log(`✅ SMS queued for ${contact.name}`)

// AFTER: Actually sends SMS via Twilio
const { data, error } = await supabase.functions.invoke('send-emergency-sms', {
  body: { 
    to: contact.phone, 
    message: message 
  }
})
```

### 2. `/utils/live-location-tracker.ts` - Timer-Based Sending
**Previous Issue:**
- Relied on GPS update count (every 20th update)
- If GPS updated slowly (e.g., every 5 seconds), it took 100 seconds instead of 20 seconds

**New Implementation:**
- Uses `setInterval` with 20-second timer
- Sends SMS updates exactly every 20 seconds regardless of GPS update frequency
- Added `smsCount` and `lastSMSTime` tracking

### 3. `/utils/types.ts` - Extended Location Interface
Added support for both naming conventions:
```typescript
export interface Location {
  lat: number
  lng: number
  latitude?: number  // For GPS API compatibility
  longitude?: number // For GPS API compatibility
  address?: string
  accuracy?: number
  speed?: number
  heading?: number
  timestamp?: string
}
```

---

## 🚀 How It Works Now

### When SOS Button is Pressed:

1. **Initial SOS Alert** (`App.tsx` → `handleSOSActivation()`)
   - Sends immediate SOS SMS to all emergency contacts
   - Message includes current location with Google Maps link
   - Starts live location tracking automatically

2. **Live Location Tracking Starts** (`live-location-tracker.ts`)
   - GPS tracking begins with `watchPosition`
   - Timer starts with 20-second interval
   - Location data collected continuously

3. **SMS Updates Sent Every 20 Seconds**
   - Timer triggers `sendScheduledLocationUpdate()`
   - Gets latest GPS location
   - Sends SMS to all contacts with:
     - Current GPS coordinates
     - Google Maps link
     - Address (via reverse geocoding)
     - Accuracy, speed, heading (if available)
     - Update count and timestamp

4. **Message Format:**
```
🚨 LIVE LOCATION UPDATE #2 from Sarah Kumar

📍 Current Location: 123 Main St, Bangalore, India (±15m) Moving at 12.5 km/h.
🗺️ MAP: https://www.google.com/maps?q=12.9716,77.5946
⏰ Time: 2:45:30 PM

This is an active emergency. Location updates every 20 seconds.

- RakshaNet Live Tracking
```

---

## 🔍 Debugging & Testing

### Check if SMS is Actually Being Sent

1. **Open Browser Console** (F12)
2. **Press SOS Button**
3. **Look for these logs:**

```
✅ Initial SOS Alert:
📱 Sending SOS to John Doe (+919876543210)
Message preview: 🚨 EMERGENCY SOS ALERT from ...
✅ SMS sent successfully to John Doe

✅ Live Location Tracking Started:
🚨 Live location tracking started
📍 SMS updates every 20 seconds
👥 Tracking for 2 contacts

✅ Location Updates (GPS):
📍 Location Update #1: {lat: 12.971600, lng: 77.594600, accuracy: 15m}
📍 Location Update #2: {lat: 12.971605, lng: 77.594605, accuracy: 12m}

✅ SMS Updates (Every 20 seconds):
📱 Sending live location update #1 to 2 contacts
✅ Live location sent to John Doe
✅ Live location sent to Jane Smith
📱 Sent scheduled live location update #1 to 2 contacts

📱 Sending live location update #2 to 2 contacts
✅ Live location sent to John Doe
✅ Live location sent to Jane Smith
📱 Sent scheduled live location update #2 to 2 contacts
```

### If No SMS Received - Troubleshooting Steps

#### Step 1: Check Supabase Edge Function Deployment
```bash
# Verify the edge function exists and is deployed
supabase functions list
# Should show: send-emergency-sms

# Test the function directly
supabase functions invoke send-emergency-sms --data '{
  "to": "+919876543210",
  "message": "Test SMS from RakshaNet"
}'
```

#### Step 2: Verify Twilio Credentials in Supabase
Go to: **Supabase Dashboard → Project Settings → Edge Functions → Environment Variables**

Required variables:
- `TWILIO_ACCOUNT_SID` - Your Twilio Account SID
- `TWILIO_AUTH_TOKEN` - Your Twilio Auth Token  
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number (E.164 format: +1234567890)

#### Step 3: Check Phone Number Format
Emergency contacts **must** be in E.164 format:
- ✅ Correct: `+919876543210` (with country code)
- ❌ Wrong: `9876543210` (missing +91)
- ❌ Wrong: `+91 9876543210` (has space)

#### Step 4: Check Browser Console for Errors
Look for errors like:
```
❌ Failed to send SMS to John Doe: FunctionsRelayError
❌ Failed to send SMS to John Doe: Invalid phone number format
```

#### Step 5: Check Twilio Account
- Verify phone number is verified (if using trial account)
- Check Twilio messaging logs for delivery status
- Ensure you have sufficient Twilio credits

---

## 📱 Testing Guide

### Test 1: Add Emergency Contact
1. Go to **Emergency Contacts** tab
2. Add a contact with valid E.164 phone number
3. Set priority and save

### Test 2: Trigger SOS and Monitor
1. Press the **SOS Button**
2. Open browser console (F12)
3. Watch for:
   - Initial SMS send confirmation
   - Live tracking started message
   - Location updates every few seconds
   - SMS updates every 20 seconds

### Test 3: Check Phone
- Initial SOS alert should arrive immediately
- Live location SMS #1 should arrive within 20 seconds
- Live location SMS #2 should arrive 20 seconds later
- Continue every 20 seconds until SOS is stopped

---

## ⚙️ Configuration

### Change SMS Update Interval
Default is 20 seconds. To change:

In `/App.tsx`, find `startLiveLocationTracking`:
```typescript
await startEmergencyLiveTracking(
  contacts,
  userName,
  onUpdate,
  onError
)
```

Or configure directly in `/utils/live-location-tracker.ts`:
```typescript
const DEFAULT_CONFIG: LiveLocationConfig = {
  updateIntervalMs: 20000, // Change to 30000 for 30 seconds
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
}
```

### Customize SMS Message Format
Edit `/utils/live-location-tracker.ts` → `generateLiveLocationMessage()`:
```typescript
private generateLiveLocationMessage(...): string {
  return `🚨 LIVE LOCATION UPDATE #${updateNumber} from ${userName}

📍 Current Location: ${address}${accuracy}${speed}
🗺️ MAP: ${mapLink}
⏰ Time: ${new Date(update.timestamp).toLocaleTimeString()}

This is an active emergency. Location updates every ${this.config.updateIntervalMs / 1000} seconds.

- RakshaNet Live Tracking`
}
```

---

## 🎯 Expected Behavior

### Scenario: User Presses SOS
1. **T=0s**: SOS activated, buzzer sounds, initial SOS SMS sent
2. **T=0s**: Live location tracking starts
3. **T=20s**: First live location SMS sent to all contacts
4. **T=40s**: Second live location SMS sent
5. **T=60s**: Third live location SMS sent
6. **T=10s**: SOS auto-resolves (buzzer stops after 10 seconds)
7. Live location tracking continues until manually stopped

---

## 🐛 Common Issues & Solutions

### Issue: "SMS queued" but not sent
**Solution:** Update to use real Supabase edge function (already fixed in this update)

### Issue: SMS sent but not received
**Causes:**
- Phone number not in E.164 format
- Twilio credentials not configured
- Twilio trial account - number not verified
- Insufficient Twilio credits

### Issue: Location updates in console but no SMS
**Solution:** Check that `updateTimer` is properly set in live-location-tracker.ts (already fixed)

### Issue: SMS sent too frequently/infrequently
**Solution:** Adjust `updateIntervalMs` in configuration

---

## 📊 Verification Checklist

- [x] SMS sending function updated to use Supabase edge function
- [x] Live location tracker uses timer-based sending
- [x] Location interface supports both lat/lng and latitude/longitude
- [x] generateLocationLink handles both naming conventions
- [x] Console logging for debugging
- [x] Error handling for failed SMS
- [x] Rate limiting (100ms delay between contacts)
- [x] Reverse geocoding for address
- [x] Speed, accuracy, heading included in updates

---

## 🔐 Security Notes

- SMS are sent via Twilio using server-side edge function
- Twilio credentials stored securely in Supabase environment variables
- No API keys exposed in client-side code
- Phone numbers validated before sending

---

## 📞 Support

If contacts still don't receive SMS after these fixes:

1. Check all troubleshooting steps above
2. Verify Twilio account status
3. Test edge function directly
4. Check browser console for errors
5. Verify phone number format

---

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Console shows "SMS sent successfully" for each contact
- ✅ Contacts receive initial SOS alert immediately
- ✅ Contacts receive live location updates every 20 seconds
- ✅ Google Maps links in SMS work correctly
- ✅ No errors in browser console
- ✅ Live Tracking Indicator shows active status with update count

---

**Last Updated:** November 8, 2025  
**Status:** ✅ Production Ready  
**Version:** 2.0 - Real SMS Integration
