# Live Location SMS - Quick Test Guide

## ✅ What to Test

### Prerequisites
1. **Supabase Edge Function Deployed**
   - Function name: `send-emergency-sms`
   - Status: Deployed and active

2. **Twilio Credentials Configured**
   - `TWILIO_ACCOUNT_SID` set in Supabase environment variables
   - `TWILIO_AUTH_TOKEN` set in Supabase environment variables
   - `TWILIO_PHONE_NUMBER` set in E.164 format (e.g., +1234567890)

3. **Emergency Contact Added**
   - Phone number in E.164 format (e.g., +919876543210)
   - Priority set
   - Saved in system

---

## 🧪 Test Steps

### Test 1: Add Emergency Contact
1. Go to **Emergency Contacts** tab
2. Click **Add Contact**
3. Enter:
   - Name: "Test Contact"
   - Phone: YOUR_PHONE_NUMBER (with country code, e.g., +919876543210)
   - Relationship: "Friend"
   - Priority: 1
4. Click **Save Contact**
5. ✅ Contact should appear in the list

### Test 2: Trigger SOS and Monitor Console
1. **Open Browser Console** (Press F12 → Console tab)
2. Click the big red **SOS Button**
3. **Watch Console Output** - You should see:

```
✅ Step 1: SOS Activation
🚨 SOS Activated! Alerting emergency contacts...
📱 Sending SOS to Test Contact (+919876543210)
Message preview: 🚨 EMERGENCY SOS ALERT from ...
✅ SMS sent successfully to Test Contact

✅ Step 2: Live Tracking Started
🚨 Live location tracking started
📍 SMS updates every 20 seconds
👥 Tracking for 1 contacts

✅ Step 3: GPS Location Updates (continuous)
📍 Location Update #1: {lat: 12.971600, lng: 77.594600, accuracy: 15m}
📍 Location Update #2: {lat: 12.971605, lng: 77.594605, accuracy: 12m}
📍 Location Update #3: {lat: 12.971610, lng: 77.594610, accuracy: 10m}
...

✅ Step 4: SMS Updates (every 20 seconds)
📱 Sending live location update #1 to 1 contacts
✅ Live location sent to Test Contact
📱 Sent scheduled live location update #1 to 1 contacts

[Wait 20 seconds...]

📱 Sending live location update #2 to 1 contacts
✅ Live location sent to Test Contact
📱 Sent scheduled live location update #2 to 1 contacts

[Wait 20 seconds...]

📱 Sending live location update #3 to 1 contacts
✅ Live location sent to Test Contact
📱 Sent scheduled live location update #3 to 1 contacts
```

### Test 3: Check Your Phone
**Timeline of messages you should receive:**

**T=0s (Immediate):**
```
🚨 EMERGENCY SOS ALERT from [Your Name]!

TYPE: EMERGENCY
TIME: 11/8/2025, 2:45:30 PM

LOCATION: [Your Address or GPS Coordinates]
MAP: https://www.google.com/maps?q=12.9716,77.5946

Please respond immediately or call emergency services.

- Sent via RakshaNet Safety App
```

**T=20s (After 20 seconds):**
```
🚨 LIVE LOCATION UPDATE #1 from [Your Name]

📍 Current Location: [Address] (±15m)
🗺️ MAP: https://www.google.com/maps?q=12.9716,77.5946
⏰ Time: 2:45:50 PM

This is an active emergency. Location updates every 20 seconds.

- RakshaNet Live Tracking
```

**T=40s (After 40 seconds):**
```
🚨 LIVE LOCATION UPDATE #2 from [Your Name]

📍 Current Location: [Address] (±12m)
🗺️ MAP: https://www.google.com/maps?q=12.9716,77.5946
⏰ Time: 2:46:10 PM

This is an active emergency. Location updates every 20 seconds.

- RakshaNet Live Tracking
```

**Continues every 20 seconds until SOS is stopped...**

---

## ❌ Troubleshooting

### Problem: Console shows "SMS sent successfully" but no SMS received

#### Solution 1: Check Twilio Account
```bash
# Go to Twilio Console → Messaging → Logs
# Check if messages are being sent
# Look for errors or delivery status
```

**Common Twilio Issues:**
- ❌ **Trial Account:** Phone number not verified
- ❌ **Insufficient Credits:** Twilio account has no balance
- ❌ **Geographic Restrictions:** Country not supported on trial
- ❌ **Invalid Sender Number:** Twilio phone number not configured correctly

#### Solution 2: Test Edge Function Directly
```bash
# Test the Supabase Edge Function
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/send-emergency-sms \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+919876543210",
    "message": "Test SMS from RakshaNet"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "SMS sent successfully",
  "sid": "SM...",
  "status": "queued",
  "to": "+919876543210"
}
```

**Error Response Examples:**
```json
// Missing credentials
{
  "error": "Twilio not configured. Please contact administrator."
}

// Invalid phone number
{
  "error": "Invalid phone number format. Must be E.164 format"
}
```

#### Solution 3: Check Phone Number Format
✅ **Correct Formats:**
- `+919876543210` (India)
- `+14155551234` (USA)
- `+447911123456` (UK)

❌ **Wrong Formats:**
- `9876543210` (missing country code)
- `+91 9876543210` (has space)
- `+91-9876543210` (has dash)
- `09876543210` (leading zero)

---

### Problem: Console shows errors

#### Error: "FunctionsRelayError"
**Cause:** Edge function not deployed or not accessible

**Solution:**
```bash
# Deploy the edge function
cd supabase/functions
supabase functions deploy send-emergency-sms

# Check deployment status
supabase functions list
```

#### Error: "Invalid phone number format"
**Cause:** Emergency contact phone not in E.164 format

**Solution:**
1. Go to **Emergency Contacts**
2. Edit contact
3. Update phone to E.164 format (e.g., +919876543210)
4. Save and try again

#### Error: "Location permission denied"
**Cause:** Browser blocked location access

**Solution:**
1. Click the lock icon in browser address bar
2. Change "Location" permission to "Allow"
3. Refresh page
4. Try SOS again

---

### Problem: SMS sent but location link doesn't work

#### Check Console Output:
```javascript
📱 Sending live location update #1 to 1 contacts
Message preview: 🚨 LIVE LOCATION UPDATE #1 from ...
🗺️ MAP: https://www.google.com/maps?q=12.9716,77.5946
```

**Solution:**
- Copy the MAP link from console
- Paste in browser to verify it works
- If it works in browser but not from SMS, it's a carrier issue (some carriers block links)

---

### Problem: Updates sent too frequently/infrequently

#### To Change Update Interval:

**Option 1: Temporary (Per Session)**
```typescript
// In App.tsx, update the call to startEmergencyLiveTracking
await startEmergencyLiveTracking(
  contacts,
  userName,
  onUpdate,
  onError
)
```

**Option 2: Permanent (Default)**
```typescript
// In /utils/live-location-tracker.ts
const DEFAULT_CONFIG: LiveLocationConfig = {
  updateIntervalMs: 30000, // Change from 20000 to 30000 for 30 seconds
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
}
```

---

## 🎯 Success Criteria

✅ **Initial SOS SMS sent within 2 seconds**
✅ **Live tracking started message in console**
✅ **GPS location updates every 1-5 seconds in console**
✅ **SMS update #1 sent at T=20s**
✅ **SMS update #2 sent at T=40s**
✅ **SMS update #3 sent at T=60s**
✅ **Google Maps links in SMS open correctly**
✅ **No errors in browser console**
✅ **Phone receives all messages**

---

## 📊 Performance Expectations

| Metric | Expected Value |
|--------|---------------|
| Initial SOS SMS Delivery | < 3 seconds |
| Live Tracking Start | < 1 second |
| GPS Update Frequency | Every 1-5 seconds |
| SMS Update Interval | Exactly 20 seconds |
| SMS Delivery Time | < 10 seconds |
| Location Accuracy | ±10-50 meters |
| Battery Usage | ~1-2% per minute |

---

## 🔍 Debug Checklist

- [ ] Supabase project connected
- [ ] Edge function `send-emergency-sms` deployed
- [ ] Twilio credentials set in Supabase env vars
- [ ] Emergency contact added with E.164 phone number
- [ ] Browser location permission granted
- [ ] Browser console open to monitor
- [ ] SOS button pressed
- [ ] Initial SOS SMS received on phone
- [ ] Console shows "Live tracking started"
- [ ] Console shows location updates
- [ ] Console shows "SMS sent successfully" every 20s
- [ ] Phone receives live location SMS every 20s
- [ ] Google Maps links work when clicked

---

## 💡 Tips

1. **Use Your Own Phone Number First** - Test with your own number before adding others
2. **Keep Console Open** - Essential for debugging
3. **Check Twilio Logs** - Twilio console shows delivery status
4. **Test in Different Locations** - Move around to see location updates
5. **Battery Consideration** - Live tracking uses GPS continuously, drains battery
6. **Network Consideration** - Requires active internet for SMS sending (GPS works offline)

---

## 📞 Need Help?

If issues persist after checking all troubleshooting steps:

1. Copy full console output (from SOS activation)
2. Check Twilio console for error messages
3. Verify Supabase edge function logs
4. Check browser network tab for failed requests
5. Review `/LIVE_LOCATION_SMS_FIX.md` for detailed implementation

---

**Last Updated:** November 8, 2025  
**Status:** ✅ Ready for Testing  
**Version:** 2.0 - Real SMS Integration
