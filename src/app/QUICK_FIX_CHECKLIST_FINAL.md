# ⚡ Quick Fix Checklist - RakshaNet

**Status**: Supabase Connected ✅ | Date: Nov 8, 2025

---

## ✅ ALREADY DONE

- [x] Supabase connection established
- [x] `/public/_headers` file fixed (was directory, now proper config file)
- [x] SQL script ready (`/SUPABASE_TABLES_SETUP.sql`)
- [x] Edge function code ready (`/supabase/functions/send-emergency-sms/`)
- [x] Netlify configuration updated

---

## 🎯 DO THESE 3 THINGS

### 1️⃣ Create Database Tables (5 min)

```
✅ Open: https://app.supabase.com
✅ Go to: SQL Editor → New Query
✅ Copy: All of /SUPABASE_TABLES_SETUP.sql
✅ Paste & Run in SQL Editor
✅ See: "✅ RakshaNet database setup completed successfully!"
```

**Verify**:
```sql
SELECT tablename FROM pg_tables 
WHERE tablename IN ('location_updates', 'live_tracking_sessions');
```

---

### 2️⃣ Deploy SMS Function (10 min)

**Install CLI** (if needed):
```bash
npm install -g supabase
```

**Deploy**:
```bash
# 1. Login
supabase login

# 2. Link (get ref from Supabase → Settings → General)
supabase link --project-ref YOUR_PROJECT_REF

# 3. Set Twilio secrets (get from console.twilio.com)
supabase secrets set TWILIO_ACCOUNT_SID=ACxxxx
supabase secrets set TWILIO_AUTH_TOKEN=your_token
supabase secrets set TWILIO_PHONE_NUMBER=+1234567890

# 4. Deploy
supabase functions deploy send-emergency-sms

# 5. Verify
supabase functions list
```

---

### 3️⃣ Test Everything (5 min)

```
✅ Open app in browser
✅ Click SOS button
✅ Allow location permission
✅ Check console - should see all ✅
✅ Emergency contacts receive SMS
✅ Click tracking link - shows map
```

---

## 📋 VERIFICATION COMMANDS

**Database**:
```sql
SELECT * FROM live_tracking_sessions LIMIT 1;
```

**Edge Function**:
```bash
supabase functions list
# Should show: send-emergency-sms (deployed)
```

**Secrets**:
```bash
supabase secrets list
# Should show: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
```

---

## 🐛 QUICK TROUBLESHOOTING

| Error | Fix |
|-------|-----|
| "Table doesn't exist" | Run Step 1 again |
| "Function not found" | Run Step 2 completely |
| "Twilio auth failed" | Check secrets in Step 2.3 |
| "Location denied" | Clear browser permissions & reload |
| "SMS not received" | Verify phone number in Twilio verified list |

---

## 🎯 SUCCESS INDICATORS

Console shows:
```
✅ Live tracking session created
✅ Location update sent
✅ SMS sent successfully
```

Phone receives:
```
🚨 EMERGENCY ALERT 🚨
[Name] needs help!
Location: [Address]
Live tracking: [URL]
```

Database has data:
```sql
SELECT COUNT(*) FROM live_tracking_sessions;
-- Should return > 0
```

---

## 📚 DETAILED GUIDES

Need more help? Check these:

- `/FIX_ALL_4_ERRORS_NOW.md` - Detailed error fixes
- `/DEPLOYMENT_FIX_COMPLETE_GUIDE.md` - Full deployment guide
- `/SUPABASE_TABLES_SETUP.sql` - Database setup script
- `/PRODUCTION_SMS_SETUP.md` - Twilio configuration

---

## ⏱️ TIME ESTIMATE

- Step 1: 5 minutes
- Step 2: 10 minutes
- Step 3: 5 minutes
- **Total: ~20 minutes**

---

**Ready?** Start with Step 1! 🚀

Open: https://app.supabase.com
