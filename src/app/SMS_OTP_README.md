# 📱 RakshaNet - Real SMS OTP Authentication

## Overview

RakshaNet now uses **production-ready SMS OTP authentication** powered by Twilio and Supabase. Development mode has been removed - all OTP codes are sent via real SMS to users' phones.

---

## 🚀 Quick Start

**Need to set up SMS OTP? Start here:**

1. **Quick Setup (3 minutes):** Read [`/TWILIO_QUICK_START.md`](./TWILIO_QUICK_START.md)
2. **Detailed Guide:** Read [`/SMS_SETUP_GUIDE.md`](./SMS_SETUP_GUIDE.md)
3. **Having issues?** Check [`/SMS_TROUBLESHOOTING.md`](./SMS_TROUBLESHOOTING.md)

---

## 📋 What You Need

### Required Services (Both Free to Start)

1. **Twilio Account** (Free trial with $15 credit)
   - Sign up: https://www.twilio.com/try-twilio
   - Get: Account SID, Auth Token, Phone Number

2. **Supabase Project** (Already configured)
   - Project: RakshaNet
   - Project ID: `fjkuvwebluihzsoayxqj`
   - Dashboard: https://supabase.com/dashboard

### Configuration Steps

```
1. Create Twilio Account → Get credentials
2. Configure in Supabase → Enable Phone Auth
3. Test with your phone → Receive real SMS
```

**Total time:** 3-5 minutes

---

## 📚 Documentation Index

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **TWILIO_QUICK_START.md** | 3-minute setup guide | First time setup |
| **SMS_SETUP_GUIDE.md** | Complete detailed guide | Full documentation |
| **SMS_TROUBLESHOOTING.md** | Fix common issues | When problems occur |
| **SMS_OTP_README.md** | This file - overview | Start here |

---

## ✅ What Changed

### Removed (Development Mode)
- ❌ Blue "Development Mode" box with console instructions
- ❌ OTP display in browser console  
- ❌ Mock OTP generation
- ❌ Development mode fallback

### Added (Production Mode)
- ✅ Real SMS delivery via Twilio
- ✅ Supabase Phone Authentication
- ✅ Clear error messages when SMS not configured
- ✅ Step-by-step setup guidance
- ✅ Production-ready security

---

## 🔐 How It Works

### User Flow

```
1. User enters phone number: +919876543210
   ↓
2. App sends OTP request to Supabase
   ↓
3. Supabase → Twilio → User's Phone
   ↓
4. User receives SMS: "Your code is: 485729"
   ↓
5. User enters 485729 in app
   ↓
6. App verifies with Supabase
   ↓
7. User authenticated ✓
```

### Technical Stack

- **Frontend:** React + TypeScript
- **Backend:** Supabase (Auth + Database)
- **SMS Provider:** Twilio
- **Auth Method:** OTP (One-Time Password)

---

## 🆓 Cost Breakdown

### Free Trial (Perfect for Testing)

**Twilio Trial:**
- Credit: $15 free
- Limitations: Can only send to verified numbers
- Duration: Until credit runs out
- SMS cost: ~$0.0075/message
- Messages available: ~2000 messages

**Supabase Free Tier:**
- SMS: Unlimited (you pay Twilio directly)
- Auth: 50,000 monthly active users
- Database: 500 MB
- Storage: 1 GB

### Production Costs (When Ready)

**Twilio (Paid):**
- Phone number: ~$1/month
- SMS: $0.0075-$0.10/message (varies by country)
- No sending restrictions

**Supabase (Paid - Optional):**
- Free tier often sufficient
- Pro: $25/month (only if you exceed free limits)

**Example monthly cost (100 users, 5 SMS each):**
```
Phone number:    $1.00
500 SMS:         $3.75 (at $0.0075 each)
Supabase:        $0.00 (within free tier)
─────────────────────
Total:           $4.75/month
```

---

## 🚨 Important Notes

### For Trial Accounts

⚠️ **Trial accounts can only send SMS to verified numbers**

**To verify your number:**
1. Go to Twilio Console
2. Phone Numbers → Verified Caller IDs
3. Add your phone number
4. Verify it via SMS
5. Now you can test RakshaNet signup with that number

### Phone Number Format

Users MUST include country code:
```
✅ Correct: +919876543210 (India)
✅ Correct: +14155552671  (USA)
✅ Correct: +447911123456 (UK)

❌ Wrong: 9876543210      (missing country code)
❌ Wrong: +91 98765 43210 (has spaces)
```

### Security

- ✅ OTP codes expire after 60 seconds
- ✅ Rate limited (max 4 requests/hour per number)
- ✅ Credentials stored securely in Supabase (not in code)
- ✅ SMS messages encrypted in transit
- ✅ User sessions managed by Supabase Auth

---

## 🐛 Common Issues & Fixes

### 1. "SMS Provider Not Configured" Error

**Fix:** Configure Twilio in Supabase Dashboard
- See: `/TWILIO_QUICK_START.md` Step 2

### 2. "Invalid Phone Number Format"

**Fix:** Add country code with `+` prefix
- Example: `+919876543210`

### 3. No SMS Received

**Fix Options:**
- Wait up to 60 seconds
- Check phone has signal
- Verify number in Twilio (for trial accounts)
- Check Twilio logs for delivery status

### 4. Full Troubleshooting

**Read:** `/SMS_TROUBLESHOOTING.md` for comprehensive help

---

## 🔗 Useful Links

### Twilio
- **Dashboard:** https://console.twilio.com/
- **Get Free Trial:** https://www.twilio.com/try-twilio
- **SMS Docs:** https://www.twilio.com/docs/sms
- **Pricing:** https://www.twilio.com/sms/pricing

### Supabase
- **Dashboard:** https://supabase.com/dashboard/project/fjkuvwebluihzsoayxqj
- **Phone Auth Docs:** https://supabase.com/docs/guides/auth/phone-login
- **Twilio Integration:** https://supabase.com/docs/guides/auth/phone-login/twilio

### Documentation
- **Quick Start:** `/TWILIO_QUICK_START.md`
- **Full Guide:** `/SMS_SETUP_GUIDE.md`
- **Troubleshooting:** `/SMS_TROUBLESHOOTING.md`

---

## 📞 Support

### Self-Help Resources
1. Check `/SMS_TROUBLESHOOTING.md` first
2. Review Twilio logs in Console
3. Check Supabase Auth logs

### Contact Support
- **Supabase:** https://supabase.com/dashboard/support/new
- **Twilio:** https://www.twilio.com/help/contact

---

## ✅ Testing Checklist

Before deploying to users:

- [ ] Created Twilio account
- [ ] Purchased Twilio phone number
- [ ] Configured Twilio in Supabase Dashboard
- [ ] Clicked "Save" in Supabase
- [ ] Verified your test phone number (trial accounts)
- [ ] Tested signup with your phone number
- [ ] Received real SMS
- [ ] Successfully verified OTP
- [ ] Tested with different phone numbers
- [ ] Set up Twilio billing alerts
- [ ] Documented your configuration

---

## 🎉 You're Ready!

Once configured, your RakshaNet app will:
- ✅ Send real SMS OTP to any phone number (worldwide)
- ✅ Provide secure authentication
- ✅ Work in production with real users
- ✅ Scale automatically with Supabase & Twilio

**Next Steps:**
1. Follow `/TWILIO_QUICK_START.md` to configure Twilio
2. Test with your phone number
3. Deploy with confidence!

---

**Questions?** Start with `/TWILIO_QUICK_START.md` or check `/SMS_TROUBLESHOOTING.md`

**Last Updated:** Production-ready SMS OTP implementation (Development mode removed)
