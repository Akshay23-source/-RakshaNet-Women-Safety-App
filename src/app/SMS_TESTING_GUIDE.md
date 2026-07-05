# 📱 SMS OTP Testing Guide - RakshaNet

## ✅ Complete SMS Testing Checklist

### Step 1: Verify Supabase Configuration

1. **Open Supabase Dashboard**: https://supabase.com/dashboard
2. **Select Your Project**: `fjkuvwebluihzsoayxqj`
3. **Navigate to**: Authentication → Providers → Phone
4. **Verify These Settings**:
   - ✅ Phone Auth is **ENABLED** (toggle should be ON)
   - ✅ Provider selected: **Twilio**
   - ✅ All 3 fields filled:
     - Twilio Account SID (starts with `AC...`)
     - Twilio Auth Token
     - Twilio Phone Number (format: `+1234567890`)

### Step 2: Verify Twilio Configuration

1. **Login to Twilio Console**: https://console.twilio.com
2. **Check Account Status**:
   - ✅ Account is active (not suspended)
   - ✅ You have available credits
3. **Verify Phone Number**:
   - ✅ Your Twilio phone number is active
   - ✅ SMS capability is enabled for that number
4. **If Using Trial Account**:
   - ✅ Your recipient phone number must be verified in Twilio
   - Go to: Phone Numbers → Verified Caller IDs
   - Add and verify your phone number

### Step 3: Test SMS Flow

1. **Open Browser Console**:
   - Press F12 or Right-click → Inspect → Console tab
   - Keep this open during testing

2. **Clear Console** (for clean logs):
   - Click the 🚫 icon or type `clear()`

3. **Start Sign Up Process**:
   - Enter your name
   - Select **Phone** method
   - Enter phone number in E.164 format:
     - ✅ Correct: `+919876543210` (India)
     - ✅ Correct: `+14155552671` (USA)
     - ✅ Correct: `+447700900000` (UK)
     - ❌ Wrong: `9876543210` (no +)
     - ❌ Wrong: `+91 98765 43210` (has spaces)

4. **Click "Sign Up"**

### Step 4: Watch Console Logs

You should see these logs in sequence:

```
✅ Phone number validated: +919876543210
📱 Proceeding to OTP verification with phone: +919876543210
🔧 Initializing Supabase Client
📍 Supabase URL: https://fjkuvwebluihzsoayxqj.supabase.co
🔑 Has Anon Key: true
🚀 OTPVerification mounted
📱 Phone: +919876543210
📧 Email: undefined
Sending SMS OTP to: +919876543210
```

### Step 5: Expected Outcomes

#### ✅ SUCCESS - SMS Sent:
- **Console Log**: `✓ SMS OTP sent successfully!`
- **Toast Notification**: Green toast "✓ SMS Sent Successfully!"
- **Screen**: Blue info box appears
- **Your Phone**: SMS arrives within 5-30 seconds

#### ❌ ERROR - SMS Provider Not Configured:
- **Console Log**: Error with SMS provider details
- **Toast Notification**: Red error toast
- **Screen**: Red configuration error box appears
- **Action**: Double-check Supabase/Twilio configuration

#### ❌ ERROR - Invalid Phone Number:
- **Console Log**: Error about phone format
- **Toast Notification**: "Failed to Send SMS"
- **Action**: Fix phone number format (must start with +)

### Step 6: Verify OTP Code

1. **Check Your Phone**: SMS should arrive with 6-digit code
2. **Message Format**: 
   ```
   Your RakshaNet verification code is: 123456
   ```
3. **Enter Code**: Type the 6-digit code in the app
4. **Auto-Verification**: Code verifies automatically when complete
5. **Success**: Green toast "✓ Phone Verified Successfully!"

## 🔍 Troubleshooting

### Problem: No SMS Received

**Check These:**

1. **Phone Signal**: Ensure your phone has network signal
2. **Spam Folder**: Some carriers filter automated SMS
3. **Twilio Trial Limits**: 
   - Trial accounts can only send to verified numbers
   - Check https://console.twilio.com/us1/develop/phone-numbers/manage/verified
4. **Delivery Status**:
   - Go to Twilio Console → Messaging → Logs
   - Check if SMS was sent and delivery status
5. **Number Format**: Must be E.164 (starts with +)
6. **Wait Time**: Can take up to 30 seconds

### Problem: "SMS Provider Not Configured" Error

**Solutions:**

1. **Verify Phone Auth is ON** in Supabase
2. **Check Twilio Credentials** are correct:
   - No extra spaces
   - Complete SID and Token
   - Phone number with + prefix
3. **Save and Wait**: After configuring, wait 30 seconds
4. **Clear Browser Cache**: Ctrl+Shift+R (hard refresh)
5. **Try Again**: Click "Back to signup" and retry

### Problem: "Invalid OTP" Error

**Solutions:**

1. **Correct Code**: Enter the exact 6-digit code from SMS
2. **Timing**: Code expires in 60 seconds
3. **Fresh Code**: Click "Resend OTP" to get new code
4. **No Spaces**: Enter digits without spaces

## 📊 Console Debug Commands

While testing, you can run these in browser console:

```javascript
// Check Supabase connection
console.log('Supabase:', window.localStorage)

// Clear all RakshaNet data
localStorage.clear()

// Check temp storage
console.log('Temp Phone:', localStorage.getItem('rakshanet_temp_phone'))
```

## ✅ Final Verification

After successful OTP verification:

1. **Console Log**: `✓ Phone Verified Successfully!`
2. **Screen Changes**: Moves to main app dashboard
3. **Persistent Login**: Phone number saved in localStorage
4. **Session**: User is authenticated with Supabase

## 📞 Support

If issues persist:

1. **Export Console Logs**:
   - Right-click in Console → Save as...
   - Send to developer

2. **Check Twilio Logs**:
   - https://console.twilio.com/us1/monitor/logs/sms
   - Look for your phone number
   - Check error messages

3. **Supabase Auth Logs**:
   - Supabase Dashboard → Authentication → Logs
   - Filter by phone authentication
   - Check for errors

## 🎯 Quick Test Checklist

- [ ] Supabase Phone Auth enabled
- [ ] Twilio credentials configured
- [ ] Phone number in E.164 format (+country code)
- [ ] Trial account: recipient number verified in Twilio
- [ ] Browser console open
- [ ] No previous errors in console
- [ ] Network connection stable
- [ ] Clicked "Sign Up" button
- [ ] Saw "SMS Sent Successfully" toast
- [ ] Received SMS on phone within 30 seconds
- [ ] Entered correct 6-digit OTP
- [ ] Phone verified successfully
- [ ] Logged into app

---

**Last Updated**: November 6, 2025
**App Version**: RakshaNet v1.0
**SMS Provider**: Twilio via Supabase
