# 🚀 RakshaNet - Setup Guide

## Quick Start

Your RakshaNet Women Safety Application is ready to use! Here's how to get started:

## ✅ What's Already Configured

### Backend (Supabase)
- ✅ Supabase project connected
- ✅ Edge Functions server running
- ✅ KV Store for data persistence
- ✅ Storage bucket for evidence files
- ✅ Authentication system ready

### Frontend
- ✅ React + TypeScript application
- ✅ Tailwind CSS styling
- ✅ Shadcn/ui components
- ✅ PWA manifest configured
- ✅ All 12 core modules implemented

## 🎯 First Steps

### 1. Test the Application

1. **Open the app** - It should load automatically
2. **Grant permissions** when prompted:
   - Location access (for GPS tracking)
   - Notifications (for alerts)
   - Device motion (for shake detection)

### 2. Create Your Profile

1. Click **Login** in the top-right header
2. Choose **Sign Up**
3. Fill in:
   - Name
   - Phone number
   - Email
   - Password
4. Click **Sign Up**

Note: For quick testing, you can use demo mode (already active by default)

### 3. Add Emergency Contacts

1. Navigate to **Contacts** tab
2. Click **Add Contact**
3. Enter contact details:
   - Name
   - Phone number
   - Relationship
   - Priority (1-5, where 1 is highest)
4. Click **Add Contact**

**Recommended**: Add at least 2-3 emergency contacts

### 4. Test SOS System

⚠️ **IMPORTANT**: This will trigger alarms and notifications

1. Stay on the **Home** tab
2. Click the large red **SOS** button
3. Observe the system:
   - ✅ Alarm sound plays
   - ✅ GPS location captured
   - ✅ Network ladder escalation begins
   - ✅ Nearby helpers searched
4. Click **Mark as Safe & Resolve** when done testing

### 5. Explore Features

#### Enable Helper Mode
- Toggle **Become a Helper** in Quick Settings
- You'll be notified of emergencies near you

#### Try AI Assistant
- Navigate to **AI Assistant** tab
- Ask questions like:
  - "Nearest police station"
  - "Find safe route"
  - "Emergency tips"

#### Browse Resources
- Navigate to **Resources** tab
- Explore:
  - Self-defense training videos
  - Safety articles
  - Emergency helplines
  - Safe accommodation finder

#### Enable Shake Detection
- Toggle **Shake Detection** in Quick Settings
- Shake your device forcefully to test
- SOS will auto-trigger

### 6. Admin Dashboard

- Navigate to **Admin** tab
- View real-time statistics:
  - Total users
  - Active helpers
  - SOS events (active & resolved)
  - Response metrics

## 🔧 Advanced Configuration

### Enable Voice Commands (Optional)

The app supports voice activation but requires permission:

```javascript
// In browser console, run:
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => console.log('Microphone access granted'))
```

Then say: "Help me" or "Emergency" to trigger SOS

### PWA Installation

#### On Android
1. Open in Chrome/Edge
2. Tap menu (⋮) → "Add to Home Screen"

#### On iOS
1. Open in Safari
2. Tap Share (↑) → "Add to Home Screen"

### Customize Settings

Edit `/App.tsx` to customize:
- SOS button behavior
- Network escalation timing (default: 2s per stage)
- Shake detection sensitivity (default: 15)
- Helper search radius (default: 2km)
- Alarm duration (default: 5s)

## 📱 Mobile Testing

For best experience on mobile:

1. Open browser Developer Tools
2. Toggle device toolbar (Ctrl+Shift+M or Cmd+Shift+M)
3. Select a mobile device (e.g., iPhone 12, Pixel 5)
4. Reload the page

## 🧪 Testing Different Scenarios

### Test 1: Complete SOS Flow
1. Trigger SOS
2. Watch network ladder progression
3. Observe nearby helpers search
4. Check Admin dashboard for event log
5. Resolve SOS

### Test 2: Multi-User Simulation
1. Open app in two browser windows
2. Window 1: Enable helper mode
3. Window 2: Trigger SOS
4. Window 1: Should see SOS on nearby helpers map
5. Window 1: Click "Respond"

### Test 3: Offline Mode
1. Open browser DevTools
2. Go to Application/Service Workers
3. Check "Offline"
4. Test core features (note: network calls will fail gracefully)

## 🐛 Troubleshooting

### SOS Not Activating
- **Check**: Location permissions granted?
- **Check**: Console for errors (F12 → Console tab)
- **Fix**: Reload page and grant permissions

### Location Not Working
- **Check**: HTTPS connection (required for geolocation)
- **Check**: Location services enabled on device
- **Fix**: Allow location in browser settings

### Nearby Helpers Not Showing
- **Check**: At least one user registered as helper
- **Check**: Helper location within 2km radius
- **Fix**: Register as helper in Quick Settings

### Backend Errors
- **Check**: Network tab in DevTools (F12 → Network)
- **Check**: Supabase project is active
- **Fix**: Check console logs for detailed error messages

## 📊 Data Management

### View Stored Data

All data is stored in Supabase KV store:

- **Users**: `user:{userId}`
- **Contacts**: `contacts:{userId}`
- **SOS Events**: `sos:{sosId}`
- **Helpers**: `helper:{userId}`

### Clear Test Data (Optional)

To reset the application:
1. Go to Admin dashboard
2. Note down any important data
3. Clear browser storage (DevTools → Application → Clear storage)

## 🔐 Security Checklist

Before using in a real scenario:

- [ ] HTTPS enabled
- [ ] Strong passwords set
- [ ] Emergency contacts verified
- [ ] Location permissions granted
- [ ] Notifications enabled
- [ ] Device charged and accessible
- [ ] Trusted helpers added to network

## 🆘 Emergency Information

### Always Available Numbers

Even if the app fails, these numbers work:

- **India Emergency**: 112
- **Police**: 100
- **Women Helpline**: 1091
- **Ambulance**: 108

### Backup Plan

1. Keep phone charged
2. Share live location with trusted contacts
3. Know nearest police station address
4. Have alternate communication method

## 📞 Support

### Getting Help

For issues or questions:
1. Check console logs (F12 → Console)
2. Review this setup guide
3. Check README.md for detailed documentation
4. Test with demo mode first

## 🎓 Training

### Recommended Practice

1. **Week 1**: Familiarize with interface, add contacts
2. **Week 2**: Test SOS in safe environment
3. **Week 3**: Enable all features, practice scenarios
4. **Week 4**: Train trusted contacts on helper mode

### Safety Tips

- Test the app in safe environments first
- Inform trusted contacts about the system
- Keep app easily accessible (home screen)
- Practice triggering SOS without panic
- Update emergency contacts regularly

## ✨ Next Steps

Now that you're set up:

1. ✅ Add emergency contacts
2. ✅ Test SOS system
3. ✅ Enable helper mode (if willing)
4. ✅ Explore safety resources
5. ✅ Install as PWA on mobile
6. ✅ Share with friends and family

## 🎯 Production Deployment (For Developers)

If deploying to production:

1. **Security**:
   - Enable E2E encryption
   - Add rate limiting
   - Implement biometric auth
   - Set up monitoring

2. **Compliance**:
   - Privacy policy
   - Terms of service
   - GDPR compliance
   - Age verification

3. **Integration**:
   - Partner with local authorities
   - SMS gateway for alerts
   - Email notifications
   - Real emergency services API

4. **Testing**:
   - E2E tests
   - Load testing
   - Security audit
   - User acceptance testing

---

**You're all set! Stay safe with RakshaNet 🛡️**
