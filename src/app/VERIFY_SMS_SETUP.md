# Verify SMS Setup - Complete Checklist

## 🎯 Quick Verification

Run through this checklist to ensure live location SMS is properly configured.

---

## ✅ Step 1: Verify Supabase Edge Function

### Check if Function Exists
```bash
supabase functions list
```

**Expected Output:**
```
┌────────────────────────┬────────┬─────────────────────┐
│ Function Name          │ Status │ Last Deployed       │
├────────────────────────┼────────┼─────────────────────┤
│ send-emergency-sms     │ Active │ 2025-11-08 14:30:00 │
└────────────────────────┴────────┴─────────────────────┘
```

### If Function Missing - Deploy It
```bash
# Navigate to functions directory
cd supabase/functions

# Deploy the function
supabase functions deploy send-emergency-sms

# Verify deployment
supabase functions list
```

---

## ✅ Step 2: Verify Twilio Credentials

### Check Environment Variables in Supabase

1. Go to **Supabase Dashboard**
2. Select your project
3. Go to **Project Settings → Edge Functions**
4. Check **Environment Variables** section

**Required Variables:**
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

### Get Twilio Credentials

If you don't have them:

1. Go to [Twilio Console](https://console.twilio.com/)
2. From Dashboard, copy:
   - **Account SID** → `TWILIO_ACCOUNT_SID`
   - **Auth Token** → `TWILIO_AUTH_TOKEN`
3. From **Phone Numbers → Manage → Active numbers**:
   - Copy your Twilio phone number → `TWILIO_PHONE_NUMBER`
   - Format: E.164 (e.g., +14155551234)

### Set Environment Variables

**Method 1: Via Supabase Dashboard**
1. Supabase Dashboard → Project Settings → Edge Functions
2. Add each variable with its value
3. Save changes
4. Redeploy function: `supabase functions deploy send-emergency-sms`

**Method 2: Via CLI**
```bash
# Create .env file in supabase/functions/send-emergency-sms/
echo "TWILIO_ACCOUNT_SID=ACxxxxxx" >> .env
echo "TWILIO_AUTH_TOKEN=xxxxxx" >> .env
echo "TWILIO_PHONE_NUMBER=+1234567890" >> .env

# Deploy with environment variables
supabase functions deploy send-emergency-sms --env-file .env
```

---

## ✅ Step 3: Test Edge Function

### Test via Supabase Dashboard

1. Go to **Database → Functions**
2. Select `send-emergency-sms`
3. Click **Invoke**
4. Use test payload:
```json
{
  "to": "+919876543210",
  "message": "Test SMS from RakshaNet - Live Location Tracking"
}
```
5. Click **Invoke**

**Expected Response:**
```json
{
  "success": true,
  "message": "SMS sent successfully",
  "sid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "status": "queued",
  "to": "+919876543210"
}
```

### Test via cURL

```bash
# Replace with your project details
PROJECT_URL="https://YOUR_PROJECT.supabase.co"
ANON_KEY="your-anon-key"
PHONE_NUMBER="+919876543210"

curl -X POST "$PROJECT_URL/functions/v1/send-emergency-sms" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "'"$PHONE_NUMBER"'",
    "message": "Test SMS from RakshaNet"
  }'
```

### Test via JavaScript Console

Open browser console on your app and run:

```javascript
// Test the edge function
const supabase = window.supabase || (await import('./components/utils/supabase/client.tsx')).createClient()

const { data, error } = await supabase.functions.invoke('send-emergency-sms', {
  body: {
    to: '+919876543210', // Replace with your number
    message: 'Test SMS from RakshaNet - If you receive this, SMS is working!'
  }
})

console.log('Result:', { data, error })
```

---

## ✅ Step 4: Verify Emergency Contact Format

### Check Contact Phone Numbers

1. Go to **Emergency Contacts** tab in app
2. For each contact, verify phone format:

**✅ Correct:**
```
+919876543210  (India)
+14155551234   (USA)
+447911123456  (UK)
+61412345678   (Australia)
```

**❌ Wrong:**
```
9876543210     (missing country code)
+91 9876543210 (has space)
+91-9876543210 (has dash)
09876543210    (leading zero)
```

### Fix Invalid Numbers

If you find invalid numbers:

1. Click **Edit** on the contact
2. Update phone to E.164 format
3. Click **Save**

---

## ✅ Step 5: Test Live Location Flow

### Full Integration Test

1. **Open Browser Console** (F12)
2. **Add yourself as emergency contact** with your phone number
3. **Press SOS Button**
4. **Monitor Console Output**

**Expected Console Output:**
```
🚨 SOS Activated!
📱 Sending SOS to [Your Name] (+919876543210)
✅ SMS sent successfully to [Your Name]

🚨 Live location tracking started
📍 SMS updates every 20 seconds
👥 Tracking for 1 contacts

📍 Location Update #1: {lat: ..., lng: ..., accuracy: ...}
📍 Location Update #2: {lat: ..., lng: ..., accuracy: ...}

[After 20 seconds]
📱 Sending live location update #1 to 1 contacts
✅ Live location sent to [Your Name]

[After 40 seconds]
📱 Sending live location update #2 to 1 contacts
✅ Live location sent to [Your Name]
```

**Expected Phone Messages:**

**Message 1 (Immediate):**
```
🚨 EMERGENCY SOS ALERT from [Name]!
TYPE: EMERGENCY
TIME: [Timestamp]
LOCATION: [Address]
MAP: https://www.google.com/maps?q=...
```

**Message 2 (After 20s):**
```
🚨 LIVE LOCATION UPDATE #1 from [Name]
📍 Current Location: [Address]
🗺️ MAP: https://www.google.com/maps?q=...
⏰ Time: [Timestamp]
```

**Message 3 (After 40s):**
```
🚨 LIVE LOCATION UPDATE #2 from [Name]
📍 Current Location: [Address]
🗺️ MAP: https://www.google.com/maps?q=...
⏰ Time: [Timestamp]
```

---

## ❌ Common Errors & Solutions

### Error: "FunctionsRelayError: Edge function not found"

**Cause:** Function not deployed

**Solution:**
```bash
supabase functions deploy send-emergency-sms
```

---

### Error: "Twilio not configured"

**Cause:** Environment variables not set

**Solution:**
1. Set all three Twilio env vars in Supabase Dashboard
2. Redeploy function: `supabase functions deploy send-emergency-sms`

---

### Error: "Invalid phone number format"

**Cause:** Phone number not in E.164 format

**Solution:**
- Add country code prefix (e.g., +1 for USA, +91 for India)
- Remove spaces, dashes, and parentheses
- Example: `9876543210` → `+919876543210`

---

### Error: "The 'To' number is not a valid phone number"

**Cause:** Invalid recipient number

**Solution:**
- Verify number exists and is active
- Check country code is correct
- For Twilio trial accounts: Verify the number in Twilio console first

---

### Error: "Insufficient credits"

**Cause:** Twilio account has no balance

**Solution:**
1. Go to Twilio Console
2. Add credits to your account
3. Try sending SMS again

---

## 🔍 Debugging Tools

### 1. Check Supabase Edge Function Logs

```bash
# View real-time logs
supabase functions serve send-emergency-sms

# Or check logs in Supabase Dashboard
# Dashboard → Edge Functions → send-emergency-sms → Logs
```

### 2. Check Twilio Delivery Logs

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Monitor → Logs → Messaging**
3. Look for your sent messages
4. Check delivery status and errors

### 3. Browser Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Press SOS button
4. Look for requests to `functions/v1/send-emergency-sms`
5. Check request/response details

---

## 📊 Verification Checklist

### Before Going Live

- [ ] Edge function `send-emergency-sms` deployed
- [ ] All Twilio env vars set in Supabase
- [ ] Test SMS sent successfully via edge function
- [ ] Emergency contacts added with E.164 phone numbers
- [ ] Browser location permission granted
- [ ] SOS button triggers initial SMS
- [ ] Live tracking starts automatically
- [ ] SMS updates sent every 20 seconds
- [ ] Phone receives all messages
- [ ] Google Maps links work correctly
- [ ] No errors in browser console
- [ ] Twilio logs show successful delivery

---

## 🎉 Success Indicators

### You'll Know Everything Works When:

✅ **Console Output is Clean**
```
✅ SMS sent successfully to [Name]
🚨 Live location tracking started
📱 Sending live location update #1
✅ Live location sent to [Name]
```

✅ **Phone Receives Messages**
- Initial SOS alert arrives within 3 seconds
- Live location updates arrive every 20 seconds
- All Google Maps links open correctly

✅ **No Errors**
- No red errors in browser console
- No failed requests in Network tab
- Twilio console shows "Delivered" status

---

## 🚀 Ready for Production

Once all checks pass:

1. ✅ Add real emergency contacts
2. ✅ Test with multiple contacts
3. ✅ Test in different locations
4. ✅ Test with different network conditions
5. ✅ Monitor Twilio usage and costs
6. ✅ Set up alerts for failed deliveries

---

## 📞 Still Having Issues?

### Check These Files:

1. **Edge Function:** `/supabase/functions/send-emergency-sms/index.ts`
2. **SMS Alert Utility:** `/utils/sms-alert.ts`
3. **Live Tracker:** `/utils/live-location-tracker.ts`
4. **Implementation Guide:** `/LIVE_LOCATION_SMS_FIX.md`
5. **Test Guide:** `/TEST_LIVE_LOCATION_SMS.md`

### Debug Steps:

1. Check all environment variables
2. Test edge function in isolation
3. Verify phone number format
4. Check Twilio account status
5. Review browser console errors
6. Check Supabase function logs
7. Verify Twilio delivery logs

---

**Last Updated:** November 8, 2025  
**Status:** ✅ Ready for Deployment  
**Version:** 2.0 - Production Ready SMS
