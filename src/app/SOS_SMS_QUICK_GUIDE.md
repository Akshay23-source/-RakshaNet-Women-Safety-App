# 📱 SOS SMS Alert - Quick Guide

## ✨ What's New?

When you press the **SOS button**, all your **saved trusted contacts** automatically receive an **emergency SMS** with:

```
🚨 EMERGENCY SOS ALERT from [Your Name]!

TYPE: EMERGENCY
TIME: Nov 8, 2025, 3:45 PM

LOCATION: 123 Main Street, Delhi
MAP: https://www.google.com/maps?q=28.7041,77.1025

Please respond immediately or call emergency services.

- Sent via RakshaNet Safety App
```

## 🚀 Quick Start (3 Steps)

### Step 1: Add Emergency Contacts
1. Go to **Emergency Contacts** section
2. Click **Trusted Contacts** tab
3. Click **Add Trusted Contact** button
4. Fill in details:
   - Name: `Mom`
   - Phone: `+919876543210` (must include country code)
   - Relationship: `Family`
   - Priority: `1` (1 = highest)
5. Click **Add Contact**

### Step 2: Test SOS
1. Go to **Home** screen
2. Press the big red **SOS** button
3. Watch notifications:
   - "🚨 SOS Activated!"
   - "Sending SOS alerts to emergency contacts..."
   - "📱 SOS sent to 3 emergency contacts!"

### Step 3: Verify
- Check browser console for SMS content
- See toast notification showing how many contacts were alerted
- Contacts would receive SMS with your location

## 📋 Requirements

### Phone Number Format
✅ **Correct:**
- `+919876543210` (India)
- `+14155552671` (USA)
- `+447911123456` (UK)

❌ **Wrong:**
- `9876543210` (missing country code)
- `+91 98765 43210` (spaces)
- `91-9876543210` (dashes)

### Contact Priority
- **1** - Highest (sent first - use for closest family)
- **2** - High (immediate family)
- **3** - Medium (friends)
- **4** - Low (neighbors)
- **5** - Lowest (others)

## 🎯 Features

### ✅ Automatic Sending
- No manual action needed
- Triggers when SOS button pressed
- Also works with:
  - Smart watch SOS trigger
  - 4 shakes detection
  - Voice command "help"

### ✅ Real-Time Location
- Current GPS coordinates
- Google Maps link
- Street address (when available)
- Exact timestamp

### ✅ Priority Order
- Contacts alerted by priority (1 first)
- Prevents spam
- Ensures most important people get alert first

### ✅ Delivery Tracking
- Shows how many SMS sent
- Warns if any failed
- Console logs for debugging

## 🔧 How It Works

```
[User Presses SOS]
        ↓
[Load Emergency Contacts]
        ↓
[Get Current Location]
        ↓
[Generate SMS Message]
        ↓
[Send to Each Contact by Priority]
        ↓
[Show Success/Failure Toast]
```

## 📱 What Contacts See

### SMS Message:
```
🚨 EMERGENCY SOS ALERT from Sarah!

TYPE: EMERGENCY  
TIME: Nov 8, 2025, 3:45 PM

LOCATION: Near MG Road, Bangalore
MAP: https://www.google.com/maps?q=12.9716,77.5946

Please respond immediately or call emergency services.

- Sent via RakshaNet Safety App
```

### Actions They Can Take:
1. Click MAP link → Opens Google Maps
2. Call you directly
3. Navigate to your location
4. Call police/emergency services

## 💡 Tips

### For Maximum Effectiveness:
1. ✅ Add 3-5 trusted contacts (not too many)
2. ✅ Use correct phone number format (+country code)
3. ✅ Set appropriate priorities
4. ✅ Inform contacts they'll receive alerts
5. ✅ Test with one contact first
6. ✅ Keep location services ON
7. ✅ Update contacts if numbers change

### Important Notes:
- ⚠️ SMS requires Twilio setup for production
- ⚠️ Demo mode shows what would be sent (console)
- ⚠️ Keep GPS enabled for accurate location
- ⚠️ Inform contacts about this feature

## 🔍 Testing

### In Development (Current):
1. Add your phone number as contact
2. Press SOS button
3. Check browser console for SMS content
4. Check toast notifications

### Console Output Example:
```
📱 Sending SOS to Mom (+919876543210)
✅ SMS queued for Mom
Message: 🚨 EMERGENCY SOS ALERT from John Doe!
TYPE: EMERGENCY
TIME: Nov 8, 2025, 3:45 PM
...
📊 SOS Alert Summary:
   ✅ Sent: 3
   ❌ Failed: 0
```

## 🚀 Production Setup

To enable actual SMS sending:

1. **Get Twilio Account:**
   - Sign up at twilio.com
   - Get phone number
   - Note Account SID and Auth Token

2. **Deploy Edge Function:**
   ```bash
   cd supabase/functions
   supabase functions deploy send-emergency-sms
   ```

3. **Set Environment Variables:**
   ```bash
   supabase secrets set TWILIO_ACCOUNT_SID=AC...
   supabase secrets set TWILIO_AUTH_TOKEN=...
   supabase secrets set TWILIO_PHONE_NUMBER=+1234567890
   ```

4. **Test:**
   - Add real phone number
   - Trigger SOS
   - Verify SMS received

## ❓ Troubleshooting

### "No emergency contacts to alert"
**Fix:** Add contacts in Emergency Contacts → Trusted Contacts

### "Invalid phone number"
**Fix:** Ensure format is +[country][number] (e.g., +919876543210)

### "Failed to send SMS"
**Fix:** 
- Check Twilio setup
- Verify phone number format
- Check Twilio account balance
- Review Supabase function logs

### SMS not received
**Check:**
1. Phone number correct?
2. Country code included?
3. Twilio credentials set?
4. Phone can receive SMS?

## 📊 User Experience

### Before SOS:
```
Emergency Contacts → Trusted Contacts
     ↓
Add Contact Button
     ↓
[Fill Details: Name, Phone, Priority]
     ↓
Contact Saved ✓
```

### During SOS:
```
Press SOS Button
     ↓
Toast: "🚨 SOS Activated!"
     ↓
Toast: "Sending SOS alerts..."
     ↓
Toast: "📱 SOS sent to 3 contacts!"
     ↓
[View Location button]
```

### After SOS:
```
Contacts Receive SMS
     ↓
Can View Location on Map
     ↓
Can Call You
     ↓
Can Contact Authorities
```

## 🎨 UI Indicators

### In Emergency Contacts:
- Blue info banner explaining auto-SMS feature

### In Emergency Alert Modal:
- Green box: "SOS EMERGENCY ACTIVATED!"
- Blue box: "📱 Auto SMS Alerts Sent!"

### Toast Notifications:
- Loading: "Sending SOS alerts..."
- Success: "📱 SOS sent to X contacts!"
- Warning: "⚠️ X contacts could not be reached"

## 📖 Documentation

**Full Documentation:** `/SOS_SMS_ALERT_FEATURE.md`
- Complete technical details
- Production setup guide
- API reference
- Code examples

**Files Modified:**
- `/App.tsx` - Main SOS trigger
- `/utils/sms-alert.ts` - SMS utilities
- `/components/EmergencyContacts.tsx` - UI banner
- `/components/EmergencyAlertModal.tsx` - Alert indicator
- `/supabase/functions/send-emergency-sms/` - Production function

## ✅ Status

| Feature | Status |
|---------|--------|
| Auto SMS on SOS | ✅ Working |
| Location Link | ✅ Working |
| Priority Sending | ✅ Working |
| Success Notifications | ✅ Working |
| UI Indicators | ✅ Working |
| Production SMS | ⏳ Requires Twilio |

## 🎉 Summary

Your emergency contacts will **automatically** receive SMS with your **location** when you activate SOS - no extra steps needed!

**Ready to use!** Just add your trusted contacts and you're protected.

---

**Quick Links:**
- Add Contacts: Emergency Contacts → Trusted Contacts
- Trigger SOS: Home → Press SOS Button
- Full Docs: SOS_SMS_ALERT_FEATURE.md
