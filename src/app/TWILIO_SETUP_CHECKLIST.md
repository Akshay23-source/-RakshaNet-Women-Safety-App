# ✅ Twilio Setup Checklist

**Quick reference card for enabling real SMS delivery**

---

## Before You Start

- [ ] I have a Supabase account (already connected)
- [ ] I have 10-15 minutes available
- [ ] I have my mobile phone with me for testing

**Project ID**: `fjkuvwebluihzsoayxqj`

---

## Step 1: Create Twilio Account ⏱️ 5 min

- [ ] Visit https://www.twilio.com/try-twilio
- [ ] Sign up with email
- [ ] Verify email address
- [ ] Verify phone number
- [ ] Claim $15 free trial credit ✅

**Link**: https://www.twilio.com/try-twilio

---

## Step 2: Get Credentials ⏱️ 2 min

Login to https://console.twilio.com and copy:

- [ ] **Account SID**: AC________________________________
- [ ] **Auth Token**: ________________________________
- [ ] Keep these safe for Step 4!

**Link**: https://console.twilio.com

---

## Step 3: Buy Phone Number ⏱️ 1 min

- [ ] In Twilio Console → Phone Numbers → Buy a number
- [ ] Select country (e.g., India, USA)
- [ ] Check "SMS" capability
- [ ] Buy any available number
- [ ] **Copy number with + prefix**: +__________________

**Link**: https://console.twilio.com/us1/develop/phone-numbers/manage/search

---

## Step 4: Configure Supabase ⏱️ 3 min

- [ ] Open https://app.supabase.com
- [ ] Select project: `fjkuvwebluihzsoayxqj`
- [ ] Go to Authentication → Providers
- [ ] Enable "Phone" provider (toggle ON)
- [ ] Select "Twilio" from dropdown
- [ ] Paste Account SID: ________________________
- [ ] Paste Auth Token: ________________________
- [ ] Paste Twilio Number: +____________________
- [ ] Click **Save**
- [ ] Wait 1-2 minutes for changes to apply ⏳

**Link**: https://app.supabase.com/project/fjkuvwebluihzsoayxqj/auth/providers

---

## Step 5: Test Real SMS ⏱️ 2 min

### For Twilio Trial Users (Important!)
- [ ] In Twilio Console → Phone Numbers → Verified Caller IDs
- [ ] Add your mobile number and verify it
- [ ] Trial accounts can only send to verified numbers

### Test in RakshaNet:
- [ ] Open RakshaNet app
- [ ] Click "Sign Up"
- [ ] Select "Phone" method
- [ ] Enter phone number in E.164 format:
  ```
  India:     +919876543210 ✅
  USA:       +14155551234 ✅
  UK:        +447911123456 ✅
  ```
- [ ] Click "Sign Up"
- [ ] **Check phone for SMS** (arrives in 5-30 seconds)
- [ ] Enter 6-digit code
- [ ] Verify login successful ✅

---

## Verification ✅

### You're in Production Mode When:

- [ ] Real SMS received on phone
- [ ] No "Development Mode" banner in app
- [ ] No OTP in browser console
- [ ] Clean, professional UI

### Check Logs:

- [ ] Supabase Dashboard → Logs → Auth (no errors)
- [ ] Twilio Console → Monitor → Messaging (shows delivered)

---

## Common Issues

### ❌ SMS not received?

1. **Wait 30 seconds** (international can take longer)
2. **Check phone number format** (must be E.164: +country code + number)
3. **Twilio trial?** Verify recipient number in Twilio Console first
4. **Check phone signal** (call it to verify it works)
5. **Check Twilio balance** (trial should have $15)
6. **Review logs** (Supabase + Twilio for error messages)

### ❌ Still showing "Development Mode"?

1. Verify Supabase configuration was saved
2. Wait 2-3 minutes for propagation
3. Hard refresh page (Ctrl+Shift+R)
4. Try sending OTP again
5. Check browser console for errors

### ❌ "Unsupported phone provider" in console?

- This means Phone Auth is not configured in Supabase
- Go back to Step 4 and verify all settings
- Make sure Phone provider is toggled ON
- Make sure "Twilio" is selected in dropdown
- Click Save and wait 2 minutes

---

## Cost Reference

### Twilio Free Trial:
- **$15 credit** (no credit card needed)
- ~1,500 SMS in India (~₹0.82 each)
- ~2,000 SMS in USA (~$0.0075 each)

### After Trial:
| Region | Cost per SMS |
|--------|-------------|
| 🇮🇳 India | $0.01 (₹0.82) |
| 🇺🇸 USA | $0.0075 |
| 🇬🇧 UK | $0.04 |
| 🇦🇺 Australia | $0.08 |

### Monthly Estimates:
- 100 users: ~$1
- 500 users: ~$5
- 1,000 users: ~$10
- 10,000 users: ~$100

---

## After Setup

- [ ] Test with 3-5 different phone numbers
- [ ] Set up billing alerts in Twilio ($5, $10, $25)
- [ ] Monitor usage in Twilio Dashboard
- [ ] Document credentials securely
- [ ] Share with team if needed

---

## Need Help?

### Documentation:
- **Complete Guide**: `/PRODUCTION_SMS_SETUP.md` ⭐
- **Quick Start**: `/QUICK_START_SMS.md`
- **Detailed Setup**: `/SMS_SETUP_GUIDE.md`
- **What Changed**: `/WHATS_CHANGED.md`

### Official Docs:
- Supabase Phone Auth: https://supabase.com/docs/guides/auth/phone-login
- Twilio SMS: https://www.twilio.com/docs/sms
- Twilio Trial: https://www.twilio.com/docs/usage/tutorials/how-to-use-your-free-trial-account

---

## Summary

**Total Time**: 10-15 minutes  
**Total Cost**: $0 (uses free trial)  
**Result**: Real SMS delivery to users' phones ✅

---

**✨ Once all boxes are checked, your RakshaNet app is production-ready for SMS authentication!**

Print this checklist and follow along step-by-step for easiest setup.
