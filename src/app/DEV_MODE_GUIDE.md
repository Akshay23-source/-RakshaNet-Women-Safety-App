# 🔧 Development Mode Guide

## Overview

RakshaNet now automatically detects when SMS provider is not configured and switches to **Development Mode**. This allows you to test the OTP flow without setting up Twilio/SMS provider.

---

## What is Development Mode?

When Supabase SMS provider is not configured, the app automatically:
- ✅ Generates a random 6-digit OTP
- ✅ Logs the OTP to browser console
- ✅ Allows verification with the console OTP
- ✅ Shows clear UI indicators that it's in dev mode
- ⚠️ **Does NOT send real SMS messages**

---

## How to Use Development Mode

### Step 1: Sign Up Normally
1. Open the app
2. Enter your name
3. Select "Phone" or "Email"
4. Enter any phone number (e.g., +919876543210)
5. Click "Sign Up"

### Step 2: Check Browser Console
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Look for the OTP code:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 DEVELOPMENT MODE - OTP Code:
📱 Phone: +919876543210
🔑 OTP: 123456
⏱️  Valid for 60 seconds
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 3: Enter OTP
1. Copy the 6-digit code from console
2. Enter it in the OTP input field
3. Verification will succeed! ✅

---

## Visual Indicators

### In Production Mode (SMS Configured):
```
┌─────────────────────────────────┐
│ 📱 Check your phone!           │
│ A real SMS has been sent       │
│ ⏱️ Expires in 60 seconds        │
└─────────────────────────────────┘
```

### In Development Mode (No SMS):
```
┌─────────────────────────────────┐
│ 🔧 Development Mode Active     │
│ SMS provider not configured.   │
│ Your OTP is in browser console │
│                                │
│ To see OTP: Press F12          │
│ ⏱️ Expires in 60 seconds        │
│ 💡 Configure Twilio for prod   │
└─────────────────────────────────┘
```

---

## Error Message That Triggers Dev Mode

The following errors automatically switch to development mode:

1. `"Unsupported phone provider"`
2. `"SMS provider not configured"`
3. `"Phone provider not enabled"`
4. Any error containing "provider" or "not enabled"

---

## When to Use Development Mode

### ✅ Good For:
- Local development
- Testing OTP flow
- UI/UX testing
- Feature development
- Quick prototyping
- Demo purposes (internal)

### ❌ NOT for:
- Production deployment
- User-facing demos
- Security testing
- Real user authentication
- Public releases

---

## Switching to Production Mode

To enable real SMS and disable dev mode:

### Quick Setup (5 minutes):

1. **Sign up for Twilio**
   - https://www.twilio.com/try-twilio
   - Get Account SID, Auth Token, Phone Number

2. **Configure in Supabase**
   - Dashboard → Authentication → Providers
   - Enable "Phone" provider
   - Select "Twilio"
   - Add credentials
   - Save

3. **Test**
   - Sign up with YOUR real phone
   - Should receive actual SMS
   - Dev mode banner should disappear

**Detailed instructions:** See [QUICK_START_SMS.md](./QUICK_START_SMS.md)

---

## Differences: Dev vs Production

| Feature | Development Mode | Production Mode |
|---------|-----------------|-----------------|
| SMS Sent | ❌ No | ✅ Yes |
| OTP Location | Browser Console | User's Phone |
| Security | ⚠️ Low | ✅ High |
| Cost | Free | ~$0.01 per SMS |
| Setup Required | None | Twilio config |
| User Access | Must have console | Just phone |
| Production Ready | ❌ No | ✅ Yes |

---

## Troubleshooting

### Can't See Console OTP?

**Solution:**
1. Open browser (Chrome/Firefox/Edge)
2. Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
3. Click "Console" tab
4. Look for the bordered box with OTP

### Still Shows Production Mode?

**Check:**
- Refresh the page after making Supabase changes
- Wait 1-2 minutes for config to propagate
- Clear browser cache
- Check Supabase logs for errors

### OTP Not Working?

**Verify:**
- Entered correct 6-digit code from console
- Within 60 seconds of generation
- No typos (copy-paste recommended)
- Check console for any error messages

---

## Console Commands

### Quick Test (Paste in Console):

```javascript
// Check if in dev mode
console.log('Current mode:', window.location.href)

// Manually trigger OTP generation (if needed)
// This is just for reference - the app handles it automatically
```

---

## Security Note

⚠️ **Development mode is NOT secure!**

- OTP is visible to anyone with console access
- Should NEVER be used in production
- Only for local development and testing
- Automatically disabled when SMS provider is configured

**Always configure real SMS before deploying to users!**

---

## Benefits of Dev Mode

1. **No Setup Required**: Test immediately without Twilio
2. **Zero Cost**: No SMS charges during development
3. **Fast Iteration**: No waiting for SMS delivery
4. **Offline Testing**: Works without internet for SMS
5. **Clear Debugging**: See OTP and errors in console
6. **Automatic Fallback**: No code changes needed

---

## FAQ

### Q: Is dev mode automatic?
**A:** Yes! If SMS provider isn't configured, dev mode activates automatically.

### Q: Can I disable dev mode?
**A:** Configure SMS provider in Supabase - it will automatically switch to production mode.

### Q: Is my app broken if I see dev mode?
**A:** No! Your app works fine. Dev mode is for testing. Configure SMS for production.

### Q: Will users see dev mode in production?
**A:** Only if you haven't configured SMS provider. Configure Twilio before deploying.

### Q: Can I use dev mode for demos?
**A:** For internal demos, yes. For client/user demos, configure real SMS.

---

## Summary

Development mode allows you to:
- ✅ Test OTP flow without SMS setup
- ✅ See OTP in browser console
- ✅ Verify with console OTP
- ✅ Work offline
- ✅ Develop without costs

**Remember:**
- 🔧 Dev mode = Console OTP (for testing)
- 📱 Production mode = Real SMS (for users)
- ⚙️ Switch by configuring Twilio in Supabase

---

## Next Steps

### For Development:
1. ✅ Use dev mode freely
2. ✅ Check console for OTP
3. ✅ Test all features

### For Production:
1. 📖 Read [QUICK_START_SMS.md](./QUICK_START_SMS.md)
2. ⚙️ Configure Twilio
3. 🧪 Test with real phone
4. 🚀 Deploy!

---

**Need help?** See documentation files or check browser console for details.

**Ready for production?** Follow [QUICK_START_SMS.md](./QUICK_START_SMS.md) to enable real SMS!
