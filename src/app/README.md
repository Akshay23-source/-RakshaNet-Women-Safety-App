# 🛡️ RakshaNet - Women Safety Application

> Comprehensive cross-platform safety application with instant SOS, evidence capture, AI guidance, and multi-network safety mesh system.

---

## 🎯 Quick Start

### Option 1: Test Now (Development Mode) ✅
**Perfect for testing features immediately**

The app works out of the box! Phone OTP codes appear in browser console.

1. Run the application
2. Sign up with any phone number
3. Press **F12** to open browser console
4. Copy the OTP code (displayed in green)
5. Paste in the app
6. ✅ Start testing!

**No setup required** • **Free** • **Works immediately**

---

### Option 2: Enable Real SMS (Production) 🚀
**Required for real users and deployment**

Configure Twilio to send actual SMS messages to users' phones.

**📖 Complete Guide**: [PRODUCTION_SMS_SETUP.md](./PRODUCTION_SMS_SETUP.md)

- ⏱️ Setup time: 10-15 minutes
- 💰 Cost: Free trial ($15 credit) then ~$0.01 per SMS
- 📱 Result: Real SMS delivery to phones

**Quick links**:
- [Interactive Setup Wizard](./PRODUCTION_SMS_SETUP.md) - Step-by-step with all details ⭐
- [Printable Checklist](./TWILIO_SETUP_CHECKLIST.md) - Track your progress
- [Quick Reference](./QUICK_START_SMS.md) - For experienced users

---

## 📲 SMS Authentication Setup

### Current Status: Development Mode

Your app currently shows OTP codes in the browser console. This is perfect for:
- ✅ Testing features
- ✅ Development
- ✅ Local debugging
- ✅ No cost, no setup

### Ready for Production?

To send real SMS messages to users' phones:

<div align="center">
<img src="figma:asset/80e1d7087f45bd635c4907367922e15159713d0b.png" alt="Ready for production? Configure Twilio in Supabase Dashboard to enable real SMS delivery" width="600"/>
</div>

**👉 [Start Production Setup](./PRODUCTION_SMS_SETUP.md)** (10-15 minutes)

---

## 📚 Documentation

### SMS Setup Guides

| Guide | Best For | Time |
|-------|----------|------|
| **[PRODUCTION_SMS_SETUP.md](./PRODUCTION_SMS_SETUP.md)** ⭐ | First-time setup | 15 min |
| [TWILIO_SETUP_CHECKLIST.md](./TWILIO_SETUP_CHECKLIST.md) | Following along | 10 min |
| [QUICK_START_SMS.md](./QUICK_START_SMS.md) | Quick reference | 3 min |
| [README_SMS_SETUP.md](./README_SMS_SETUP.md) | Complete overview | 12 min |
| [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) | Find any doc | 5 min |

### Understanding the System

| Guide | Purpose | Time |
|-------|---------|------|
| [START_HERE.md](./START_HERE.md) | Dev vs Prod modes | 3 min |
| [DEV_MODE_QUICK_START.md](./DEV_MODE_QUICK_START.md) | Test without setup | 1 min |
| [NOT_AN_ERROR.md](./NOT_AN_ERROR.md) | "Error" messages explained | 2 min |
| [WHATS_CHANGED.md](./WHATS_CHANGED.md) | Demo → Real SMS | 10 min |

**📖 [View Full Documentation Index](./DOCUMENTATION_INDEX.md)**

---

## 🎬 Features

### Core Safety Modules

1. **Emergency SOS** - One-tap activation with auto-location sharing
2. **Nearby Helper Detection** - Auto-detect helpers in proximity
3. **Evidence Documentation** - Photo/video capture with timestamps
4. **AI Safety Assistant** - Real-time guidance and support
5. **Safety Resources Hub** - Emergency contacts and resources
6. **Emergency Contacts** - Quick-access trusted contacts
7. **Advanced Protection** - Multi-network safety mesh

### Authentication

- **📱 Phone OTP**: SMS-based verification via Supabase
- **✉️ Email OTP**: Email-based verification
- **🔐 Secure**: Real authentication, encrypted data
- **🌐 Production-ready**: Twilio SMS integration available

### Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **SMS Provider**: Twilio
- **Deployment**: PWA-ready
- **Offline**: Core features work offline

---

## 🔧 Configuration

### Project Details

- **Supabase Project ID**: `fjkuvwebluihzsoayxqj`
- **Authentication**: Phone OTP (SMS) + Email OTP
- **SMS Provider**: Twilio (optional, for production)
- **Color Palette**: Dark blue & red, accessibility-first

### Environment

Current mode is detected automatically:
- **Development Mode**: SMS provider not configured → OTP in console
- **Production Mode**: Twilio configured → Real SMS delivery

No code changes needed! The app adapts automatically.

---

## 💰 Cost Breakdown

### Development (Current)
- **Cost**: $0
- **OTP**: Browser console
- **Setup**: None required
- **Perfect for**: Testing, development

### Production (After Twilio Setup)
- **Setup**: $0 (free trial)
- **Free Credit**: $15 (~1,500-2,000 SMS)
- **After Trial**: ~$0.01 per SMS
- **Perfect for**: Real users, deployment

### Cost Examples

| Users/Month | SMS Cost |
|-------------|----------|
| 100 | ~$1 |
| 500 | ~$5 |
| 1,000 | ~$10 |
| 10,000 | ~$100 |

---

## 🚀 Getting Started

### For Testing & Development

```bash
# 1. Run the application
npm start

# 2. Sign up with any phone number
# 3. Press F12 to open console
# 4. Copy the OTP code
# 5. Start testing!
```

**No additional setup needed!**

### For Production Deployment

```bash
# 1. Configure Twilio for real SMS
# Follow: PRODUCTION_SMS_SETUP.md

# 2. Test with your phone
# 3. Deploy
# 4. Monitor costs in Twilio dashboard
```

**📖 [Production Setup Guide](./PRODUCTION_SMS_SETUP.md)**

---

## 📱 Phone Number Format

When testing or using the app, phone numbers must be in **E.164 format**:

```
✅ Correct:
+919876543210    (India)
+14155551234     (USA)
+447911123456    (UK)
+61491570156     (Australia)

❌ Incorrect:
9876543210       (Missing country code)
+91 98765 43210  (Contains spaces)
(415) 555-1234   (Formatted)
```

The app auto-formats numbers for you!

---

## 🆘 Common Questions

### "I see 'Unsupported phone provider' in console"
✅ **This is normal!** It means you're in development mode. OTP codes will appear in console. No action needed for testing.

**To enable real SMS**: Follow [PRODUCTION_SMS_SETUP.md](./PRODUCTION_SMS_SETUP.md)

### "SMS not received on my phone"
You're likely in development mode. Check browser console (F12) for OTP code.

**To send real SMS**: Configure Twilio → [PRODUCTION_SMS_SETUP.md](./PRODUCTION_SMS_SETUP.md)

### "How do I test without Twilio?"
You're already doing it! Development mode works perfectly. Just use console OTP codes.

### "How much does Twilio cost?"
- **Trial**: $15 free credit (no credit card)
- **Production**: ~$0.01 per SMS
- **Perfect for**: 1,500-2,000 free SMS messages

### "Do I need Twilio for testing?"
**No!** Development mode works great for testing. Only set up Twilio when deploying to real users.

---

## 🎯 Next Steps

### If Testing Now:
1. ✅ You're ready! Use development mode
2. Sign up and test features
3. OTP codes in console (F12)
4. Build your prototype

### If Deploying to Users:
1. Read [PRODUCTION_SMS_SETUP.md](./PRODUCTION_SMS_SETUP.md)
2. Create Twilio account (5 min)
3. Configure Supabase (3 min)
4. Test real SMS (2 min)
5. Deploy with confidence!

---

## 📞 Support & Resources

### Documentation
- **Complete Index**: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
- **SMS Setup**: [PRODUCTION_SMS_SETUP.md](./PRODUCTION_SMS_SETUP.md)
- **Quick Start**: [QUICK_START_SMS.md](./QUICK_START_SMS.md)

### External Links
- **Twilio**: https://www.twilio.com/try-twilio
- **Supabase**: https://app.supabase.com/project/fjkuvwebluihzsoayxqj
- **Phone Auth Docs**: https://supabase.com/docs/guides/auth/phone-login

### Support
- **Supabase**: support@supabase.io
- **Twilio**: https://support.twilio.com

---

## ✨ Summary

| Mode | Setup | Cost | OTP Location | Use Case |
|------|-------|------|--------------|----------|
| **Development** | ✅ None | Free | Browser Console | Testing, Dev |
| **Production** | 10-15 min | ~$0.01/SMS | User's Phone | Real Users |

---

## 🎊 Ready to Enable Real SMS?

<div align="center">

### 📖 [Start Production Setup →](./PRODUCTION_SMS_SETUP.md)

**10-15 minutes • Free trial • Real SMS delivery**

</div>

---

**RakshaNet** - Empowering women's safety through technology 🛡️

*Built with React, TypeScript, Supabase, and Twilio*
