# 📱 SMS OTP Setup Guide for RakshaNet

## Overview
This guide will help you configure **real SMS OTP authentication** using Twilio and Supabase for your RakshaNet safety application.

---

## ⚠️ IMPORTANT: Development Mode Removed

The development mode that displayed OTP in the browser console has been **completely removed**. You must configure a real SMS provider to receive OTP messages on your phone.

---

## 🚀 Quick Setup (5 Steps)

### Step 1: Create a Twilio Account

1. Go to [Twilio Sign Up](https://www.twilio.com/try-twilio)
2. Create a free account (you'll get $15 in trial credit)
3. Verify your email and phone number

### Step 2: Get Your Twilio Credentials

Once logged in to Twilio Console:

1. Go to your [Twilio Console Dashboard](https://console.twilio.com/)
2. Find and copy these credentials:
   - **Account SID** (starts with "AC...")
   - **Auth Token** (click to reveal and copy)

### Step 3: Get a Twilio Phone Number

1. In Twilio Console, go to **Phone Numbers → Manage → Buy a number**
2. Select your country
3. Check the **SMS** capability
4. Choose a phone number and complete the purchase
5. Copy your **Twilio Phone Number** (format: +1234567890)

> **Note**: Trial accounts can only send SMS to verified phone numbers. To send to any number, upgrade your account.

### Step 4: Configure Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **RakshaNet** (Project ID: `fjkuvwebluihzsoayxqj`)
3. Navigate to **Authentication** (left sidebar)
4. Click **Providers** tab
5. Scroll down and click **Phone** to expand it
6. Toggle **Enable Phone Sign-up** to ON
7. Under **SMS Provider**, select **Twilio**
8. Enter your credentials:
   - **Twilio Account SID**: Paste from Step 2
   - **Twilio Auth Token**: Paste from Step 2  
   - **Twilio Phone Number**: Paste from Step 3 (include country code, e.g., +1234567890)
9. Click **Save**

### Step 5: Test Your Setup

1. Go back to your RakshaNet app
2. Try to sign up with your phone number
3. You should receive a real SMS with a 6-digit OTP code
4. Enter the code to complete verification

---

## 🔧 Configuration Details

### Phone Number Format

When users enter their phone number in RakshaNet, it must include:
- **Country code** (e.g., +91 for India, +1 for USA)
- **No spaces or dashes**

Examples:
- ✅ Correct: `+919876543210` (India)
- ✅ Correct: `+14155552671` (USA)
- ❌ Wrong: `9876543210` (missing country code)
- ❌ Wrong: `+91 98765 43210` (has spaces)

### Trial Account Limitations

Twilio trial accounts have restrictions:
- Can only send SMS to **verified phone numbers**
- Messages include "[Sent from a Twilio Trial Account]" prefix
- Limited to $15 in trial credit

**To verify additional phone numbers (trial account):**
1. Go to Twilio Console → Phone Numbers → Manage → Verified Caller IDs
2. Click "+" to add a new number
3. Enter the phone number and verify via SMS

**To remove restrictions:**
- Upgrade to a paid Twilio account
- Add billing information in Twilio Console

### Costs (Paid Account)

- **Phone number rental**: ~$1/month
- **SMS costs**: $0.0075 - $0.10 per message (varies by country)
- See [Twilio Pricing](https://www.twilio.com/sms/pricing) for your country

---

## 🐛 Troubleshooting

### "SMS Provider Not Configured" Error

**Symptoms**: Red error box appears instead of OTP being sent

**Solutions**:
1. Verify you completed Step 4 above
2. Check that you selected "Twilio" as the SMS Provider
3. Ensure all credentials are entered correctly (no extra spaces)
4. Click "Save" in Supabase Dashboard after entering credentials
5. Wait 30 seconds and try again

### "Invalid Phone Number" Error

**Solutions**:
- Ensure phone number includes country code (e.g., +91...)
- Remove any spaces, dashes, or parentheses
- Format: `+[country code][phone number]`

### OTP Not Received

**Solutions**:
1. Check phone has good signal/connection
2. Wait up to 60 seconds for delivery
3. Check spam/junk messages
4. Verify the phone number is correct
5. For trial accounts: Ensure the phone number is verified in Twilio
6. Check Twilio Console → Monitor → Logs for delivery status

### "Unable to create record: Invalid credentials"

**Solutions**:
- Double-check your Twilio Account SID and Auth Token
- Ensure you didn't swap the SID and Token
- Copy credentials directly from Twilio (avoid manual typing)
- Regenerate Auth Token in Twilio if needed

---

## 📚 Alternative SMS Providers

Supabase also supports these SMS providers if you prefer:

### MessageBird
- Website: https://messagebird.com/
- Setup: Similar to Twilio
- Pricing: Competitive with Twilio

### Vonage (formerly Nexmo)
- Website: https://www.vonage.com/
- Setup: Similar to Twilio
- Pricing: Pay-as-you-go model

To use these instead of Twilio, select them in Supabase → Authentication → Phone → SMS Provider dropdown.

---

## 🔐 Security Best Practices

1. **Never commit credentials to Git**
   - Twilio credentials are configured in Supabase Dashboard only
   - RakshaNet app retrieves them securely via Supabase

2. **Rotate credentials regularly**
   - Generate new Auth Tokens every 3-6 months
   - Update in Supabase Dashboard when rotated

3. **Monitor usage**
   - Check Twilio Console → Monitor for suspicious activity
   - Set up billing alerts in Twilio

4. **Rate limiting**
   - Supabase automatically rate-limits OTP requests
   - Default: Max 4 OTP requests per hour per phone number

---

## 📖 Additional Resources

- [Supabase Phone Auth Documentation](https://supabase.com/docs/guides/auth/phone-login)
- [Twilio SMS Quickstart](https://www.twilio.com/docs/sms/quickstart)
- [Supabase + Twilio Integration Guide](https://supabase.com/docs/guides/auth/phone-login/twilio)

---

## ✅ Success Indicators

You'll know SMS OTP is working correctly when:

1. ✅ No "SMS Provider Not Configured" error appears
2. ✅ Blue info box says "Check your phone!"
3. ✅ You receive a real SMS with 6-digit code
4. ✅ Toast notification says "OTP Sent Successfully!"
5. ✅ You can verify the OTP and access the app

---

## 🆘 Need Help?

If you're still having issues:

1. Check Supabase Project Logs:
   - Supabase Dashboard → Logs → Auth Logs
   
2. Check Twilio Logs:
   - Twilio Console → Monitor → Logs → SMS Logs

3. Review Supabase Authentication settings:
   - Ensure Phone Auth is enabled
   - Verify Twilio provider is selected and saved

4. Contact Support:
   - Supabase Support: https://supabase.com/dashboard/support/new
   - Twilio Support: https://www.twilio.com/help/contact

---

## 🎉 You're All Set!

Once configured, your RakshaNet app will send real SMS OTP to users worldwide, providing secure authentication for your women's safety application.

**Test thoroughly with different phone numbers to ensure everything works as expected!**
