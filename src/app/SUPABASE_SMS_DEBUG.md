# 🔍 Supabase SMS Debug Guide

## Current Status

Your app is now ready to send real SMS OTP codes. Let's debug why you're not receiving them.

## Step 1: Open Browser Console

**IMPORTANT**: Before testing, open the browser console to see detailed logs:

1. Press **F12** (or Right-click → Inspect)
2. Click **Console** tab
3. Keep it open while testing

## Step 2: Clear Previous Data

In the console, run:
```javascript
localStorage.clear()
location.reload()
```

## Step 3: Test SMS Flow

1. Fill signup form:
   - Name: Your name
   - Method: **Phone**
   - Number: Your actual phone with country code (e.g., `+919876543210`)

2. Click **Sign Up**

3. **Watch Console Logs** - You should see:

```
✅ Phone number validated: +919876543210
📱 Proceeding to OTP verification with phone: +919876543210
🔧 Initializing Supabase Client
📍 Supabase URL: https://fjkuvwebluihzsoayxqj.supabase.co
🔑 Has Anon Key: true
🚀 OTPVerification mounted
📱 Phone: +919876543210
📤 Sending SMS OTP to: +919876543210
🔧 Supabase Client Ready: true
📊 Supabase Response: { data: {...}, error: null }
✅ SMS OTP sent successfully!
```

## Step 4: Check for Errors

### ❌ ERROR: "SMS provider not configured" or "Phone provider not enabled"

**This means Supabase Phone Auth is NOT enabled.**

**Fix:**
1. Go to https://supabase.com/dashboard
2. Select your project: `fjkuvwebluihzsoayxqj`
3. Navigate: **Authentication** → **Providers**
4. Scroll to **Phone**
5. **Toggle ON** the Phone provider
6. Select **Twilio** from dropdown
7. Enter your Twilio credentials:
   - Account SID (from Twilio console)
   - Auth Token (from Twilio console)
   - Phone Number (from Twilio, e.g., +14155552671)
8. Click **Save**
9. Wait 30 seconds
10. Try again

### ❌ ERROR: "Invalid phone number"

**Fix:**
- Phone must start with `+`
- Include country code (e.g., `+91` for India, `+1` for USA)
- No spaces or dashes
- Example: `+919876543210` ✅
- Wrong: `9876543210` ❌

### ❌ ERROR: "Twilio error" or "Failed to send"

**Possible causes:**

1. **Twilio Trial Account Limitation**
   - Trial accounts can ONLY send to verified numbers
   - Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
   - Click **Add a new Caller ID**
   - Verify YOUR phone number
   - Try again

2. **Insufficient Twilio Credits**
   - Check: https://console.twilio.com/billing
   - Add credits if needed

3. **Wrong Twilio Credentials**
   - Double-check SID and Auth Token in Supabase
   - No extra spaces or characters

4. **Twilio Phone Number Not Active**
   - Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/active
   - Verify your number is active
   - Check SMS capability is enabled

### ✅ SUCCESS: "SMS OTP sent successfully!"

**If you see this but NO SMS arrives:**

1. **Wait 30 seconds** - SMS can be delayed
2. **Check Twilio Logs**:
   - Go to: https://console.twilio.com/us1/monitor/logs/sms
   - Look for your phone number
   - Check delivery status
   - Read any error messages

3. **Phone Network Issues**:
   - Ensure your phone has signal
   - Check spam/junk messages
   - Try airplane mode on/off

4. **Country Restrictions**:
   - Some countries block automated SMS
   - Check Twilio's country restrictions

## Step 5: Email OTP (Alternative)

If SMS is not working, try Email OTP:

1. Click **Back to signup**
2. Select **Email** method
3. Enter your email
4. Check your inbox for OTP code
5. Check spam folder if not in inbox

## Step 6: Verify Twilio Setup

### Check Twilio Console:

1. Login: https://console.twilio.com
2. Account Status: Active (not suspended)
3. Balance: Has credits
4. Phone Number: Active with SMS capability
5. For Trial: Your phone verified in Caller IDs

### Check Supabase Setup:

1. Login: https://supabase.com/dashboard
2. Project: `fjkuvwebluihzsoayxqj`
3. Authentication → Providers → Phone:
   - ✅ Enabled (toggle is ON)
   - ✅ Provider: Twilio selected
   - ✅ Account SID: Filled (starts with AC...)
   - ✅ Auth Token: Filled
   - ✅ Phone Number: Filled (starts with +)

## Console Commands for Debugging

Run these in browser console:

```javascript
// Check Supabase config
console.log('Project ID:', 'fjkuvwebluihzsoayxqj')
console.log('Has Anon Key:', !!localStorage.getItem('supabase.auth.token'))

// Check stored phone
console.log('Temp Phone:', localStorage.getItem('rakshanet_temp_phone'))

// Clear everything and start fresh
localStorage.clear()
location.reload()
```

## Common Error Messages Explained

| Error Message | Meaning | Solution |
|---------------|---------|----------|
| "Phone provider not enabled" | Supabase Phone Auth is OFF | Enable in Dashboard |
| "Unsupported phone provider" | Twilio not configured | Add Twilio credentials |
| "Invalid phone number" | Wrong format | Use +[country][number] |
| "Phone not verified" | Trial account limitation | Verify phone in Twilio |
| "Insufficient funds" | No Twilio credits | Add credits to Twilio |
| "Invalid credentials" | Wrong SID/Token | Update in Supabase |

## Expected Timeline

After clicking "Sign Up":
- **1 second**: Loading state
- **2-5 seconds**: Supabase processes request
- **5-10 seconds**: Twilio sends SMS
- **10-30 seconds**: SMS arrives on phone
- **Total**: Up to 30 seconds maximum

## Still Not Working?

### Export Console Logs:

1. Open Console (F12)
2. Right-click in console
3. **Save as...** → save to file
4. Review all errors

### Check Network Tab:

1. Open DevTools (F12)
2. Click **Network** tab
3. Click "Sign Up"
4. Look for requests to `supabase.co`
5. Check response codes (should be 200)
6. Click on request → Preview tab → see error details

### Verify Request is Sent:

In Network tab, look for:
- URL: `https://fjkuvwebluihzsoayxqj.supabase.co/auth/v1/otp`
- Method: POST
- Status: 200 OK
- Response: Should have no error

If Status is **400 or 401**: Configuration issue
If Status is **500**: Supabase/Twilio server issue

## Quick Checklist

- [ ] Browser console is open
- [ ] Phone number format: `+[country][number]`
- [ ] Supabase Phone Auth: ENABLED
- [ ] Twilio provider: SELECTED
- [ ] Twilio credentials: ENTERED
- [ ] Twilio account: ACTIVE
- [ ] Twilio balance: HAS CREDITS
- [ ] Trial account: PHONE VERIFIED
- [ ] Console shows: "SMS OTP sent successfully"
- [ ] No errors in console
- [ ] Waited 30 seconds
- [ ] Checked spam messages
- [ ] Checked Twilio logs

---

**Still stuck?** Share your console logs for more specific help!
