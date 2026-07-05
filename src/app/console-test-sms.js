/**
 * SMS OTP Console Test Script
 * 
 * How to use:
 * 1. Open your app in browser
 * 2. Press F12 to open DevTools
 * 3. Go to Console tab
 * 4. Copy and paste this entire file
 * 5. Run: await testSMSOTP('+919876543210')  // Use your phone number
 * 6. Check results and your phone for SMS
 */

async function testSMSOTP(phoneNumber) {
  console.log('🧪 Starting SMS OTP Test...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  try {
    // Import Supabase client
    const { createClient } = await import('@supabase/supabase-js')
    
    // Your Supabase configuration
    const projectId = 'fjkuvwebluihzsoayxqj'
    const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqa3V2d2VibHVpaHpzb2F5eHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNjQwMTAsImV4cCI6MjA3Nzg0MDAxMH0.axvCnSLYMyLWGAtyyWBjVtglX_iW4Z1iubtAoN-jJZQ'
    const supabaseUrl = `https://${projectId}.supabase.co`
    
    console.log('📋 Configuration:')
    console.log('   Supabase URL:', supabaseUrl)
    console.log('   Phone Number:', phoneNumber)
    console.log('')
    
    // Create client
    console.log('🔧 Creating Supabase client...')
    const supabase = createClient(supabaseUrl, publicAnonKey)
    console.log('✅ Client created')
    console.log('')
    
    // Validate phone format
    console.log('🔍 Validating phone number format...')
    const phoneRegex = /^\+[1-9]\d{1,14}$/
    if (!phoneRegex.test(phoneNumber)) {
      console.error('❌ Invalid phone number format!')
      console.log('   Expected: +[country code][number]')
      console.log('   Example: +919876543210 (India)')
      console.log('   Example: +14155552671 (USA)')
      return
    }
    console.log('✅ Phone format valid')
    console.log('')
    
    // Send OTP
    console.log('📤 Sending SMS OTP...')
    console.log('   Method: supabase.auth.signInWithOtp({ phone })')
    
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    })
    
    console.log('')
    console.log('📊 Response:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    if (error) {
      console.error('❌ ERROR OCCURRED:')
      console.error('')
      console.error('Error Message:', error.message)
      console.error('Error Status:', error.status)
      console.error('Error Name:', error.name)
      console.error('')
      console.error('Full Error Object:', error)
      console.error('')
      
      // Diagnose common errors
      console.log('🔍 Diagnosis:')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      
      const errorMsg = error.message?.toLowerCase() || ''
      
      if (errorMsg.includes('unsupported') && errorMsg.includes('provider')) {
        console.log('❌ ISSUE: SMS Provider Not Configured')
        console.log('')
        console.log('✅ SOLUTION:')
        console.log('   1. Go to: https://supabase.com/dashboard/project/fjkuvwebluihzsoayxqj')
        console.log('   2. Navigate to: Authentication → Providers → Phone')
        console.log('   3. Enable Phone Sign-in')
        console.log('   4. Select Twilio as SMS Provider')
        console.log('   5. Enter Twilio credentials:')
        console.log('      - Account SID')
        console.log('      - Auth Token')
        console.log('      - Phone Number (E.164 format)')
        console.log('   6. Click Save')
        console.log('')
        console.log('📖 Guide: See /TWILIO_QUICK_START.md')
      }
      else if (errorMsg.includes('invalid') && errorMsg.includes('phone')) {
        console.log('❌ ISSUE: Invalid Phone Number Format')
        console.log('')
        console.log('✅ SOLUTION:')
        console.log('   Use E.164 format: +[country code][number]')
        console.log('   Examples:')
        console.log('   - India: +919876543210')
        console.log('   - USA: +14155552671')
        console.log('   - UK: +447911123456')
      }
      else if (errorMsg.includes('not verified')) {
        console.log('❌ ISSUE: Phone Number Not Verified (Twilio Trial)')
        console.log('')
        console.log('✅ SOLUTION:')
        console.log('   1. Go to: https://console.twilio.com')
        console.log('   2. Navigate to: Phone Numbers → Manage → Verified Caller IDs')
        console.log('   3. Click: Add a new Caller ID')
        console.log('   4. Enter and verify your phone number')
      }
      else if (errorMsg.includes('disabled')) {
        console.log('❌ ISSUE: Phone Authentication Disabled')
        console.log('')
        console.log('✅ SOLUTION:')
        console.log('   1. Go to: https://supabase.com/dashboard/project/fjkuvwebluihzsoayxqj')
        console.log('   2. Navigate to: Authentication → Providers → Phone')
        console.log('   3. Toggle ON: Enable Phone Sign-in')
      }
      else {
        console.log('❓ Unknown error - Check error message above')
        console.log('')
        console.log('📋 Checklist:')
        console.log('   [ ] Supabase Phone Auth enabled?')
        console.log('   [ ] Twilio configured in Supabase?')
        console.log('   [ ] Twilio credentials correct?')
        console.log('   [ ] Phone number verified in Twilio (if trial)?')
        console.log('   [ ] Phone format is E.164?')
      }
      
    } else {
      console.log('✅ SUCCESS!')
      console.log('')
      console.log('Response Data:', data)
      console.log('')
      console.log('📱 CHECK YOUR PHONE!')
      console.log('   An SMS with a 6-digit OTP code should arrive within 5-30 seconds')
      console.log('')
      console.log('📝 Next Steps:')
      console.log('   1. Wait for SMS to arrive')
      console.log('   2. Copy the 6-digit code')
      console.log('   3. Test verification with:')
      console.log(`      await verifySMSOTP('${phoneNumber}', '123456')`)
      console.log('')
      console.log('💡 If SMS doesn\'t arrive:')
      console.log('   - Wait up to 60 seconds')
      console.log('   - Check Twilio logs: https://console.twilio.com/monitor/logs/sms')
      console.log('   - Verify phone number is correct')
      console.log('   - Check phone has signal')
    }
    
  } catch (err) {
    console.error('💥 UNEXPECTED ERROR:')
    console.error(err)
    console.error('')
    console.error('This might be a configuration or import issue.')
    console.error('Make sure you\'re running this in the RakshaNet app.')
  }
  
  console.log('')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🧪 Test Complete')
}

// Verification test function
async function verifySMSOTP(phoneNumber, otpCode) {
  console.log('🧪 Starting OTP Verification Test...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  try {
    const { createClient } = await import('@supabase/supabase-js')
    
    const projectId = 'fjkuvwebluihzsoayxqj'
    const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqa3V2d2VibHVpaHpzb2F5eHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNjQwMTAsImV4cCI6MjA3Nzg0MDAxMH0.axvCnSLYMyLWGAtyyWBjVtglX_iW4Z1iubtAoN-jJZQ'
    const supabaseUrl = `https://${projectId}.supabase.co`
    
    console.log('📋 Verification Config:')
    console.log('   Phone:', phoneNumber)
    console.log('   OTP Code:', otpCode)
    console.log('')
    
    const supabase = createClient(supabaseUrl, publicAnonKey)
    
    console.log('🔍 Verifying OTP...')
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otpCode,
      type: 'sms'
    })
    
    console.log('')
    console.log('📊 Verification Response:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    if (error) {
      console.error('❌ VERIFICATION FAILED:')
      console.error('')
      console.error('Error:', error.message)
      console.error('')
      console.log('💡 Common Reasons:')
      console.log('   - OTP code is incorrect')
      console.log('   - OTP has expired (60 seconds)')
      console.log('   - Phone number doesn\'t match')
      console.log('')
      console.log('✅ Try Again:')
      console.log(`   1. Request new OTP: await testSMSOTP('${phoneNumber}')`)
      console.log('   2. Enter correct 6-digit code')
    } else {
      console.log('✅ VERIFICATION SUCCESS!')
      console.log('')
      console.log('User Data:', data.user)
      console.log('')
      console.log('Session:', data.session)
      console.log('')
      console.log('🎉 You are now authenticated!')
      console.log('   Access Token:', data.session?.access_token?.substring(0, 20) + '...')
    }
    
  } catch (err) {
    console.error('💥 UNEXPECTED ERROR:')
    console.error(err)
  }
  
  console.log('')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🧪 Verification Test Complete')
}

// Usage instructions
console.log('╔════════════════════════════════════════════╗')
console.log('║   SMS OTP Console Test Script Loaded      ║')
console.log('╚════════════════════════════════════════════╝')
console.log('')
console.log('📝 Usage:')
console.log('')
console.log('1️⃣ Test SMS Sending:')
console.log('   await testSMSOTP(\'+919876543210\')  // Your phone number')
console.log('')
console.log('2️⃣ Test OTP Verification:')
console.log('   await verifySMSOTP(\'+919876543210\', \'123456\')  // Your OTP')
console.log('')
console.log('📌 Replace with YOUR phone number!')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
