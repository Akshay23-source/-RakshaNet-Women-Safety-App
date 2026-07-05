# 🔍 SMS OTP Debugging Checklist

## ✅ CODE UPDATED - Using Simplified Supabase Auth

The authentication code has been updated to use the exact patterns recommended by Supabase:

### Phone OTP (SMS)
```typescript
// Step 1: Send OTP
const { data, error } = await supabase.auth.signInWithOtp({
  phone: phone,
})

// Step 2: Verify OTP
const { data, error } = await supabase.auth.verifyOtp({
  phone: phone,
  token: otp,
  type: 'sms'
})
```

### Email OTP
```typescript
// Step 1: Send OTP
const { data, error } = await supabase.auth.signInWithOtp({
  email: email,
})

// Step 2: Verify OTP
const { data, error } = await supabase.auth.verifyOtp({
  email: email,
  token: otp,
  type: 'email'
})
```

---

## 🔍 Step-by-Step Debugging Guide

### Step 1: Verify Supabase Project Setup

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: RakshaNet or your project name
3. **Check Project URL and Keys**:
   - Go to **Settings** → **API**
   - Verify you have:
     - ✅ Project URL (e.g., `https://xxxxx.supabase.co`)
     - ✅ Anon/Public Key
   - Make sure these match your local configuration

### Step 2: Enable Phone Authentication

1. **Navigate to Authentication**:
   - Go to **Authentication** → **Providers**
   - Find **Phone** in the list of providers

2. **Enable Phone Auth**:
   - Toggle **Enable Phone Sign-In** to ON
   - This must be enabled for SMS OTP to work

### Step 3: Configure SMS Provider (Twilio)

This is the MOST CRITICAL step where issues typically occur:

1. **In Supabase Dashboard**:
   - Go to **Authentication** → **Providers** → **Phone**
   - Scroll down to **SMS Provider**
   - Select **Twilio** from dropdown

2. **Enter Twilio Credentials**:
   You need THREE pieces of information from Twilio:
   
   ```
   ✅ Twilio Account SID     (starts with AC...)
   ✅ Twilio Auth Token      (32-character string)
   ✅ Twilio Phone Number    (format: +1234567890)
   ```

3. **Get These from Twilio**:
   - Go to https://console.twilio.com
   - **Account SID** and **Auth Token** are on the Dashboard home page
   - **Phone Number**: Go to Phone Numbers → Manage → Active numbers
     - MUST be SMS-capable
     - MUST be verified for your trial account

4. **Save Configuration**:
   - Click **Save** in Supabase Dashboard
   - Wait 5-10 seconds for changes to propagate

### Step 4: Verify Twilio Account Status

Common issues with Twilio:

1. **Trial Account Limitations**:
   - ⚠️ Trial accounts can ONLY send SMS to **verified phone numbers**
   - To verify a phone number:
     - Go to https://console.twilio.com
     - Navigate to **Phone Numbers** → **Manage** → **Verified Caller IDs**
     - Click **Add a new Caller ID**
     - Enter your phone number and verify it

2. **Geographic Permissions**:
   - Go to https://console.twilio.com
   - Navigate to **Messaging** → **Settings** → **Geo Permissions**
   - Ensure your country is enabled for SMS

3. **Account Balance**:
   - Trial accounts come with free credits
   - Check you have sufficient balance
   - Go to **Console Home** → Check balance

### Step 5: Test Configuration in Browser Console

1. **Open Browser DevTools**: Press F12
2. **Check Console Logs** when you click "Sign Up":

   Look for these logs:
   ```
   📤 Sending SMS OTP to: +919876543210
   🔧 Supabase Client Ready: true
   📊 Supabase Response: { data: {...}, error: null }
   ✅ SMS OTP sent successfully!
   ```

3. **If you see errors**:
   
   **Error: "Unsupported phone provider"**
   ```
   ❌ Cause: Twilio not configured in Supabase
   ✅ Fix: Follow Step 3 above
   ```

   **Error: "Invalid phone number"**
   ```
   ❌ Cause: Phone number format incorrect
   ✅ Fix: Use E.164 format: +[country code][number]
         Example: +919876543210 (India)
                  +14155552671 (USA)
   ```

   **Error: "Phone number not verified"**
   ```
   ❌ Cause: Twilio trial - number not verified
   ✅ Fix: Verify your phone in Twilio console (Step 4)
   ```

   **Error: "SMS failed to send"**
   ```
   ❌ Cause: Twilio credentials incorrect or permissions issue
   ✅ Fix: 
      1. Double-check Account SID, Auth Token in Supabase
      2. Verify phone number has SMS capability in Twilio
      3. Check Geo Permissions in Twilio
   ```

### Step 6: Verify Phone Number Format

The phone number MUST be in E.164 format:

```
❌ Wrong: 9876543210
❌ Wrong: 09876543210
❌ Wrong: +91 98765 43210
❌ Wrong: +91-9876543210

✅ Correct: +919876543210
```

**Format Rules**:
- Must start with `+`
- Country code immediately after `+` (no space)
- No spaces, dashes, or parentheses
- No leading zeros after country code

**Common Country Codes**:
- 🇮🇳 India: +91
- 🇺🇸 USA: +1
- 🇬🇧 UK: +44
- 🇦🇺 Australia: +61
- 🇨🇦 Canada: +1

### Step 7: Check Supabase Logs

1. **Go to Supabase Dashboard**
2. **Navigate to**: **Logs** → **Auth Logs**
3. **Look for**:
   - OTP send requests
   - Any error messages
   - Success confirmations

### Step 8: Test with Email First

If SMS is not working, test with EMAIL to verify the auth flow:

1. **Switch to Email** in the login screen
2. **Enter your email**: your@email.com
3. **Check your email inbox** for OTP code
4. **If email works**: The issue is specifically with SMS/Twilio configuration
5. **If email also fails**: The issue is with Supabase auth setup

---

## 🎯 Most Common Issues & Solutions

### Issue 1: "SMS Provider Not Configured" Error
```
❌ Problem: Phone auth enabled but no SMS provider configured
✅ Solution:
   1. Supabase Dashboard → Authentication → Providers → Phone
   2. Select Twilio as SMS Provider
   3. Enter credentials (SID, Token, Phone Number)
   4. Save
```

### Issue 2: SMS Not Received (No Error)
```
❌ Problem: Code runs but no SMS arrives
✅ Solution:
   1. Check you're using a Twilio VERIFIED phone number (trial accounts)
   2. Wait up to 60 seconds for delivery
   3. Check Twilio logs: https://console.twilio.com/monitor/logs/sms
   4. Verify Geo Permissions enabled for your country
```

### Issue 3: "Invalid Phone Number" Error
```
❌ Problem: Phone number format rejected
✅ Solution:
   1. Use E.164 format: +[country][number]
   2. Example: +919876543210
   3. No spaces, dashes, or special characters
   4. Must start with +
```

### Issue 4: Twilio "Permission Denied" Error
```
❌ Problem: Twilio can't send to your number
✅ Solution:
   1. Verify phone number in Twilio Console
   2. Check Geo Permissions
   3. Upgrade to paid account if needed
```

---

## 📋 Quick Checklist

Before testing SMS OTP, verify:

- [ ] Supabase Phone Auth is **ENABLED**
- [ ] Twilio is selected as SMS Provider
- [ ] Twilio Account SID is entered correctly
- [ ] Twilio Auth Token is entered correctly
- [ ] Twilio Phone Number is entered correctly (E.164 format)
- [ ] Your test phone number is VERIFIED in Twilio (if trial account)
- [ ] Your country has Geo Permissions enabled in Twilio
- [ ] Phone number format is E.164: +[country][number]
- [ ] Supabase credentials in `/utils/supabase/info.tsx` are correct
- [ ] Browser console is open to see detailed logs

---

## 🔧 Testing Steps

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Enter your information**:
   - Name: Test User
   - Phone: +919876543210 (or your verified number)
4. **Click "Sign Up"**
5. **Watch console for logs**:
   ```
   ✅ Phone number validated: +919876543210
   📱 Proceeding to OTP verification with phone: +919876543210
   📤 Sending SMS OTP to: +919876543210
   🔧 Supabase Client Ready: true
   📊 Supabase Response: ...
   ```
6. **Look for errors** in red text
7. **Check your phone** for SMS
8. **Check Twilio SMS logs** if no message arrives

---

## 🆘 Still Not Working?

### Check These Files:

1. **Supabase Client Configuration**: `/utils/supabase/info.tsx`
   ```typescript
   export const projectId = 'your-project-id'
   export const publicAnonKey = 'your-anon-key'
   ```

2. **Verify imports in OTPVerification.tsx**:
   ```typescript
   import { createClient } from './utils/supabase/client'
   ```

### Manual Test in Browser Console:

```javascript
// Test 1: Check Supabase client
const supabase = window.supabase // Should be defined

// Test 2: Send OTP
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+919876543210' // Use your verified number
})
console.log('Result:', { data, error })

// If error, read error.message carefully
```

---

## 📞 Get Help

If you're still stuck after trying everything:

1. **Copy the error message** from browser console
2. **Copy Supabase Dashboard logs** (if any)
3. **Check Twilio SMS logs**: https://console.twilio.com/monitor/logs/sms
4. **Share**:
   - Exact error message
   - Phone number format you used
   - Whether you're on Twilio trial or paid
   - Whether your number is verified in Twilio

---

## ✅ Success Indicators

You'll know it's working when you see:

1. **Browser Console**:
   ```
   ✅ SMS OTP sent successfully!
   ```

2. **Toast Notification**:
   ```
   ✓ SMS Sent Successfully!
   A 6-digit verification code has been sent to +919876543210
   ```

3. **Your Phone**:
   ```
   Your RakshaNet verification code is: 123456
   ```

4. **Twilio Logs** (optional):
   - Status: "delivered"
   - No errors

---

**Last Updated**: Code simplified to use recommended Supabase auth patterns
**Next Steps**: Follow this guide step-by-step to identify and resolve the SMS configuration issue
