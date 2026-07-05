# 🚀 Twilio SMS OTP - Quick Start

## ✅ What Changed

**Development mode has been REMOVED.** The app now **requires real SMS configuration** to send OTP codes.

❌ **Removed**: Blue box with console instructions  
✅ **Added**: Real SMS delivery to your phone  
⚠️ **Required**: Twilio configuration in Supabase  

---

## ⚡ Quick Setup (3 Minutes)

### 1️⃣ Get Twilio Credentials (Free Trial)

Visit: https://www.twilio.com/try-twilio

**Copy these 3 values:**
- Account SID (starts with `AC...`)
- Auth Token (click "show" to reveal)
- Phone Number (buy one, format: `+1234567890`)

### 2️⃣ Configure Supabase

1. Go to: https://supabase.com/dashboard
2. Select project: **RakshaNet** (`fjkuvwebluihzsoayxqj`)
3. Click: **Authentication** → **Providers** → **Phone**
4. Enable: **Phone Sign-up** toggle
5. Select: **Twilio** from SMS Provider dropdown
6. Paste:
   - **Account SID** → from step 1
   - **Auth Token** → from step 1
   - **Phone Number** → from step 1 (with + sign)
7. Click: **Save**

### 3️⃣ Test It

1. Open your RakshaNet app
2. Sign up with your phone number (include country code: `+91...`)
3. Check your phone for SMS
4. Enter the 6-digit OTP code

**✅ Done! SMS OTP is working.**

---

## 📱 Phone Number Format

Users must enter phone numbers with country code:

| Country | Format Example |
|---------|---------------|
| 🇮🇳 India | `+919876543210` |
| 🇺🇸 USA | `+14155552671` |
| 🇬🇧 UK | `+447911123456` |
| 🇦🇺 Australia | `+61412345678` |

---

## 🆓 Twilio Trial Limitations

**Trial accounts ($15 free credit):**
- ✅ Can send SMS to **verified numbers only**
- ❌ Cannot send to unverified numbers
- ℹ️ Messages include "Sent from Twilio Trial Account" prefix

**To verify your phone (trial):**
1. Twilio Console → Phone Numbers → Verified Caller IDs
2. Click "+" and verify your number via SMS

**To remove limitations:**
- Upgrade to paid account (add billing info)
- Costs: ~$1/month for number + $0.0075/SMS

---

## 🐛 Common Issues

### "SMS Provider Not Configured"

**Fix:**
1. Complete Step 2 above
2. Ensure "Phone Sign-up" toggle is ON
3. Click "Save" in Supabase
4. Wait 30 seconds and retry

### "Invalid Phone Number"

**Fix:**
- Add country code: `+91` before number
- Remove spaces and dashes
- Correct: `+919876543210`
- Wrong: `9876543210` or `+91 98765 43210`

### No SMS Received

**Fix:**
1. Wait up to 60 seconds
2. Check Twilio trial limits (verified numbers only)
3. Verify number in Twilio Console if needed
4. Check Twilio Console → Monitor → Logs for errors

---

## 📚 Full Documentation

See `/SMS_SETUP_GUIDE.md` for:
- Detailed step-by-step instructions
- Alternative SMS providers (MessageBird, Vonage)
- Security best practices
- Troubleshooting guide
- Pricing information

---

## 🆘 Support Resources

- **Supabase Phone Auth Docs**: https://supabase.com/docs/guides/auth/phone-login/twilio
- **Twilio SMS Quickstart**: https://www.twilio.com/docs/sms/quickstart
- **Twilio Console**: https://console.twilio.com/
- **Supabase Dashboard**: https://supabase.com/dashboard/project/fjkuvwebluihzsoayxqj

---

## 💡 Pro Tips

1. **Test with your own number first** (verify it in Twilio for trial)
2. **Check Twilio logs** if SMS doesn't arrive (Console → Monitor → Logs)
3. **Monitor costs** by setting up billing alerts in Twilio
4. **Use environment-based pricing** - Twilio has different rates per country

---

**🎉 You're ready to send real SMS OTP!**

Questions? Check `/SMS_SETUP_GUIDE.md` for detailed help.
