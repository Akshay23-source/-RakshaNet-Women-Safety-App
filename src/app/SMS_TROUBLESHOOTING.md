# 🔧 SMS OTP Troubleshooting Guide

## Quick Diagnosis

### Issue 1: Red Error Box - "SMS Provider Not Configured"

```
┌─────────────────────────────────────────┐
│ ⚠️ SMS Provider Not Configured          │
│ To receive SMS OTP, you need to         │
│ configure Twilio in Supabase Dashboard  │
└─────────────────────────────────────────┘
```

**This means:** Twilio is not configured in Supabase

**Fix (5 steps):**

1. **Go to Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Select project: RakshaNet

2. **Navigate to Phone Auth**
   - Click: Authentication (left sidebar)
   - Click: Providers tab
   - Scroll to: Phone section
   - Click to expand it

3. **Enable Phone Sign-up**
   - Toggle: "Enable Phone Sign-up" → ON
   - Select: "Twilio" from dropdown

4. **Enter Twilio Credentials**
   - Get from: https://console.twilio.com/
   - Account SID: `AC...` (32 characters)
   - Auth Token: Click "show" to reveal (32 characters)
   - Phone Number: Your Twilio number with `+` (e.g., `+14155552671`)

5. **Save and Test**
   - Click: "Save" button
   - Wait: 30 seconds
   - Try signup again

---

### Issue 2: "Invalid Phone Number Format"

**Error Toast:**
```
❌ Invalid phone number format
Please use format: +[country code][number]
```

**This means:** Phone number missing country code or has invalid format

**Fix:**

✅ **Correct formats:**
```
+919876543210    (India)
+14155552671     (USA)
+447911123456    (UK)
+61412345678     (Australia)
```

❌ **Wrong formats:**
```
9876543210           ← Missing country code
+91 98765 43210      ← Has spaces
+91-98765-43210      ← Has dashes
(91) 98765 43210     ← Has parentheses
```

**Rules:**
- Start with `+`
- Include country code
- No spaces, dashes, or other characters
- Only digits after `+`

---

### Issue 3: No SMS Received (Configured Correctly)

**You see:**
```
✓ OTP Sent Successfully!
A 6-digit verification code has been sent to +919876543210
```

**But:** No SMS received after 60 seconds

**Diagnosis Steps:**

#### Step 1: Check Your Phone
- [ ] Phone has signal/connection
- [ ] Not in airplane mode
- [ ] SMS not blocked by carrier
- [ ] Check spam/junk messages folder

#### Step 2: Verify Number Format
- [ ] Number includes country code: `+91...`
- [ ] Number is your actual phone number
- [ ] No typos in the number

#### Step 3: Check Twilio Trial Limits

**For trial accounts:**

Go to Twilio Console → Phone Numbers → Verified Caller IDs

**Is your phone number verified?**

- ✅ **Yes** → Skip to Step 4
- ❌ **No** → Click "+" and verify it:
  1. Enter your phone number
  2. Receive verification SMS
  3. Enter code
  4. Try RakshaNet signup again

#### Step 4: Check Twilio Logs

1. Go to: https://console.twilio.com/
2. Click: Monitor → Logs → SMS Logs
3. Find: Your recent send attempt
4. Check status:

| Status | Meaning | Fix |
|--------|---------|-----|
| `Delivered` | SMS sent successfully | Wait 2 min, check phone |
| `Sent` | In transit | Wait 2 min |
| `Failed` | Delivery failed | Check phone number format |
| `Undelivered` | Carrier rejected | Number may be invalid |
| `Not found` | Not sent from Twilio | Check Supabase config |

#### Step 5: Check Supabase Logs

1. Go to: Supabase Dashboard
2. Click: Logs (left sidebar)
3. Select: Auth Logs
4. Filter: Last 1 hour
5. Look for: Phone sign-in attempts
6. Check: Error messages

**Common errors:**
- `Invalid credentials` → Re-check Twilio Account SID/Token
- `Phone provider not enabled` → Enable Phone Auth in Supabase
- `Invalid phone number` → Fix number format

---

### Issue 4: "Invalid OTP" When Entering Code

**Error:**
```
❌ Invalid OTP
Please enter the correct OTP or request a new one
```

**Causes & Fixes:**

| Cause | How to Check | Fix |
|-------|--------------|-----|
| **Typed wrong code** | Look at SMS | Re-enter carefully |
| **Code expired** | Check timestamp | Click "Resend OTP" |
| **Old code** | Multiple SMS received | Use latest SMS |
| **Network delay** | Supabase verifying | Wait 3 sec, try again |

**OTP expires in:** 60 seconds from send time

---

### Issue 5: Cannot Resend OTP

**You see:**
```
Resend in 45s
```

**This is normal:** Countdown must reach 0

**Wait until you see:**
```
Resend OTP  ← Clickable
```

**If "Configure SMS to continue" shows:**
- Twilio configuration was lost
- Re-configure Twilio in Supabase (see Issue 1)

---

## Advanced Troubleshooting

### Check Twilio Balance

**Trial accounts:**
- Start with: $15 credit
- SMS cost: ~$0.0075-$0.10 per message
- Messages sent: Check Console → Monitor → Usage

**If balance is $0:**
- Add billing information
- Or create new trial account

### Check Supabase Phone Auth Status

**Dashboard → Authentication → Providers → Phone:**

Must show:
```
✓ Phone Sign-up: Enabled
✓ SMS Provider: Twilio
✓ Account SID: AC************************** (visible)
✓ Auth Token: ******************************** (hidden)
✓ Phone Number: +1234567890
```

If any missing:
- Re-enter credentials
- Click "Save"
- Wait 30 seconds

### Test with cURL (Advanced)

Test if Supabase can send SMS:

```bash
curl -X POST 'https://fjkuvwebluihzsoayxqj.supabase.co/auth/v1/otp' \
  -H 'apikey: YOUR_SUPABASE_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "phone": "+919876543210",
    "options": {
      "channel": "sms"
    }
  }'
```

**Response analysis:**
- `200 OK` → SMS sent successfully
- `400 Bad Request` → Invalid phone format
- `500 Server Error` → Twilio config issue

---

## Error Messages Reference

| Error Message | Location | Cause | Fix |
|--------------|----------|-------|-----|
| SMS Provider Not Configured | Red box on OTP screen | Twilio not configured | Configure Twilio in Supabase |
| Invalid phone number format | Toast notification | Missing country code | Add `+` and country code |
| Failed to send OTP | Toast notification | Network/config issue | Check internet & Supabase config |
| Invalid OTP | Toast on verify | Wrong code entered | Check SMS, re-enter code |
| Unable to create record | Supabase logs | Wrong Twilio credentials | Re-enter Account SID/Token |
| Phone provider not enabled | Supabase logs | Phone Auth disabled | Enable in Supabase settings |

---

## Configuration Checklist

Before asking for help, verify:

### Twilio Configuration
- [ ] Created Twilio account
- [ ] Verified email and phone with Twilio
- [ ] Purchased/got a Twilio phone number
- [ ] Phone number has SMS capability
- [ ] Copied Account SID correctly (starts with `AC`)
- [ ] Copied Auth Token correctly (32 characters)
- [ ] Account has credit (trial: $15, paid: >$0)

### Supabase Configuration
- [ ] Logged into Supabase Dashboard
- [ ] Selected correct project (RakshaNet)
- [ ] Navigated to Authentication → Providers → Phone
- [ ] Enabled "Phone Sign-up" toggle
- [ ] Selected "Twilio" from dropdown
- [ ] Entered all 3 credentials (SID, Token, Number)
- [ ] Clicked "Save" button
- [ ] Waited 30+ seconds after saving

### Phone Number Format
- [ ] Starts with `+`
- [ ] Includes country code (+91 for India, +1 for USA, etc.)
- [ ] No spaces, dashes, or parentheses
- [ ] Total length: 10-15 digits after `+`
- [ ] Is your actual working phone number

### Trial Account Verification (if using trial)
- [ ] Phone number verified in Twilio Console
- [ ] Went to: Phone Numbers → Verified Caller IDs
- [ ] Added your number and completed verification
- [ ] Can see your number in verified list

---

## Still Not Working?

### 1. Check Logs

**Twilio Logs:**
- https://console.twilio.com/ → Monitor → Logs → SMS Logs
- Look for delivery status

**Supabase Logs:**
- Supabase Dashboard → Logs → Auth Logs  
- Look for phone sign-in attempts

### 2. Test with Different Number

Try signup with:
- Different phone number
- Email instead (to isolate issue to SMS)

### 3. Review Documentation

- `/SMS_SETUP_GUIDE.md` - Full setup guide
- `/TWILIO_QUICK_START.md` - Quick reference
- Supabase Docs: https://supabase.com/docs/guides/auth/phone-login/twilio

### 4. Contact Support

**If everything above checked and still not working:**

**Supabase Support:**
- URL: https://supabase.com/dashboard/support/new
- Provide: Project ID, error screenshots, logs

**Twilio Support:**  
- URL: https://www.twilio.com/help/contact
- Provide: Account SID, SMS logs, error details

---

## Success Indicators ✅

**You'll know it's working when:**

1. ✅ No red "SMS Provider Not Configured" box
2. ✅ Blue info box: "Check your phone!"
3. ✅ Green toast: "OTP Sent Successfully!"
4. ✅ SMS received on your phone within 60 seconds
5. ✅ 6-digit code in SMS (e.g., `123456`)
6. ✅ Code verifies and logs you in

**Example success flow:**
```
Enter phone: +919876543210
              ↓
Click "Sign Up"
              ↓
Blue box: "Check your phone!"
              ↓
Phone receives SMS: "Your RakshaNet code is: 485729"
              ↓
Enter: 485729
              ↓
Green toast: "Phone Verified Successfully!"
              ↓
Redirected to app
```

---

## Prevention Tips

1. **Save your Twilio credentials securely** (password manager)
2. **Test with your own verified number first** (before sharing with users)
3. **Monitor Twilio usage** (set up billing alerts)
4. **Keep Supabase Dashboard bookmarked** for quick access
5. **Document your setup** (for future reference)

---

**Last Updated:** Based on current RakshaNet implementation with production-only SMS OTP.

**Questions?** Review `/SMS_SETUP_GUIDE.md` or `/TWILIO_QUICK_START.md`
