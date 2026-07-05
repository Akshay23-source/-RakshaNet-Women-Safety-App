# 🔧 Supabase Edge Function Setup - Fix SMS Error

## ❌ Error You're Seeing:
```
Failed to send SMS to Adi: FunctionsFetchError: 
Failed to send a request to the Edge Function
```

## 🎯 Root Cause

Your Supabase Edge Function `send-emergency-sms` is either:
1. **Not deployed** to Supabase
2. **Not configured** with Twilio credentials
3. **Not publicly accessible**

---

## ✅ Solution: Deploy & Configure Edge Function

### Prerequisites:
- Supabase CLI installed
- Twilio Account SID, Auth Token, and Phone Number
- Your Supabase project ID: `fjkuvwebluihzsoayxqj`

---

## 🚀 Option 1: Deploy via Supabase CLI (Recommended)

### Step 1: Install Supabase CLI

**Windows:**
```powershell
# Using Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or using NPM
npm install -g supabase
```

**Mac:**
```bash
brew install supabase/tap/supabase
```

**Linux:**
```bash
npm install -g supabase
```

### Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate.

### Step 3: Link Your Project

```bash
# Navigate to your project directory
cd /path/to/rakshanet

# Link to your Supabase project
supabase link --project-ref fjkuvwebluihzsoayxqj
```

### Step 4: Set Twilio Environment Variables

```bash
# Set Twilio credentials as secrets
supabase secrets set TWILIO_ACCOUNT_SID=your_account_sid_here
supabase secrets set TWILIO_AUTH_TOKEN=your_auth_token_here
supabase secrets set TWILIO_PHONE_NUMBER=+1234567890
```

**Get these values from:**
- Twilio Console: https://console.twilio.com
- Account SID and Auth Token are on the main dashboard
- Phone Number is from Phone Numbers → Manage → Active Numbers

### Step 5: Deploy the Edge Function

```bash
# Deploy the send-emergency-sms function
supabase functions deploy send-emergency-sms

# Verify deployment
supabase functions list
```

### Step 6: Test the Function

```bash
# Test with sample data
supabase functions invoke send-emergency-sms \
  --body '{"to":"+919876543210","message":"Test message"}' \
  --method POST
```

---

## 🌐 Option 2: Deploy via Supabase Dashboard

If you don't want to use CLI:

### Step 1: Go to Edge Functions

1. Visit: https://app.supabase.com/project/fjkuvwebluihzsoayxqj
2. Click **"Edge Functions"** in left sidebar
3. Click **"Create a new function"**

### Step 2: Create Function

1. **Function Name**: `send-emergency-sms`
2. **Editor**: Copy the code from `/supabase/functions/send-emergency-sms/index.ts`
3. Click **"Deploy function"**

### Step 3: Set Environment Variables

1. In the function page, click **"Settings"**
2. Scroll to **"Environment Variables"**
3. Add these secrets:
   ```
   TWILIO_ACCOUNT_SID = ACxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN = your_auth_token
   TWILIO_PHONE_NUMBER = +1234567890
   ```
4. Click **"Save"**

### Step 4: Make Function Public (If Needed)

1. In function settings, find **"Security"**
2. Enable **"Invoke with anon key"** (for emergency use)
3. Save changes

---

## 🔍 Verify Edge Function is Working

### Test 1: Check Function Exists

Visit: https://fjkuvwebluihzsoayxqj.supabase.co/functions/v1/send-emergency-sms

You should see an error (that's good! It means function exists):
```json
{"error": "Missing required fields: to, message"}
```

If you get 404, the function isn't deployed.

### Test 2: Send Test SMS

Open browser console on your site and run:

```javascript
const { createClient } = await import('./components/utils/supabase/client')
const supabase = createClient()

const { data, error } = await supabase.functions.invoke('send-emergency-sms', {
  body: { 
    to: '+919876543210',  // YOUR verified phone number
    message: 'Test SMS from RakshaNet Edge Function' 
  }
})

console.log('Result:', { data, error })
```

### Test 3: Check Logs

1. Go to: https://app.supabase.com/project/fjkuvwebluihzsoayxqj/logs/edge-functions
2. Select **"send-emergency-sms"**
3. Look for recent invocations
4. Check for errors

---

## 📊 Common Edge Function Errors

### Error: "Function not found"
**Solution**: Deploy the function using steps above

### Error: "Twilio not configured"
**Solution**: Set environment variables (Step 4 in Option 1)

### Error: "Authentication required"
**Solution**: Make function publicly accessible or pass auth token

### Error: "Invalid phone number"
**Solution**: Ensure phone is in E.164 format (+country code)

---

## 🔧 Edge Function Code

The function code is located at:
```
/supabase/functions/send-emergency-sms/index.ts
```

It does:
1. Receives phone number and message
2. Validates inputs
3. Calls Twilio API
4. Returns success/failure

**No changes needed to the code** - just deploy it!

---

## 🎯 Quick Verification Checklist

After deployment, verify:

- [ ] Function appears in Supabase Dashboard → Edge Functions
- [ ] Status shows "Deployed" (green)
- [ ] Environment variables are set (TWILIO_*)
- [ ] Function URL is accessible
- [ ] Test SMS sends successfully
- [ ] Logs show successful invocations

---

## 🚨 Emergency Alternative: Use Twilio Directly

If Edge Functions are not working, you can temporarily use Twilio directly from client:

**Note**: This exposes your Twilio credentials, so it's NOT recommended for production!

```typescript
// Temporary workaround - DON'T use in production
async function sendSMSDirect(to: string, message: string) {
  const TWILIO_ACCOUNT_SID = 'ACxxxxxxx'  // From Twilio Console
  const TWILIO_AUTH_TOKEN = 'your_token'   // From Twilio Console
  const TWILIO_PHONE = '+1234567890'       // Your Twilio number
  
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: TWILIO_PHONE,
        Body: message
      })
    }
  )
  
  return await response.json()
}
```

**Only use this for testing! Deploy Edge Function for production.**

---

## 📚 Useful Links

- **Supabase Edge Functions Docs**: https://supabase.com/docs/guides/functions
- **Supabase CLI**: https://supabase.com/docs/reference/cli/introduction
- **Your Project**: https://app.supabase.com/project/fjkuvwebluihzsoayxqj
- **Edge Functions Page**: https://app.supabase.com/project/fjkuvwebluihzsoayxqj/functions
- **Twilio Console**: https://console.twilio.com

---

## ✅ Success Indicators

Once fixed, you'll see:

```
✅ SMS sent successfully to Adi
✅ Edge function invoked successfully
✅ Twilio delivered message
```

Instead of:
```
❌ Failed to send SMS: FunctionsFetchError
```

---

## 🆘 Still Having Issues?

1. Check Supabase logs: Functions → send-emergency-sms → Logs
2. Check Twilio logs: https://console.twilio.com/monitor/logs/sms
3. Verify environment variables are set correctly
4. Ensure Twilio account has credit
5. Confirm phone number is verified (if using trial account)

---

**Next**: After fixing Edge Function, run the database setup to fix table errors!

See: `/SUPABASE_TABLES_SETUP.sql`
