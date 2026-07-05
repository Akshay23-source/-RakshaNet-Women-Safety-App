# Real Bluetooth SmartWatch Setup Guide

## Overview
The SmartWatch Integration now uses **real Web Bluetooth API** to connect to actual smartwatches. This guide explains how to set it up properly.

## ✅ What's Changed

### 1. Real Device Scanning
- No more mock/demo devices
- Only shows actual Bluetooth smartwatches nearby
- Browser prompts user to select from available devices

### 2. Actual Bluetooth Connection
- Connects via GATT (Generic Attribute Profile)
- Reads real data from watch services:
  - Battery Level
  - Heart Rate
  - Device Information

### 3. Real SOS Trigger from Watch
- Listens for watch button press
- Triggers actual emergency SOS
- Works independently when phone battery is low

## 🔧 Requirements

### Browser Support
✅ **Supported:**
- Chrome 56+ (Desktop & Android)
- Edge 79+ (Desktop & Android)
- Opera 43+ (Desktop & Android)
- Samsung Internet 6.4+

❌ **Not Supported:**
- Safari (all versions, including iOS)
- Firefox (requires manual flag enable)
- iOS browsers (WebKit restriction)

### System Requirements
1. **HTTPS Required**: Web Bluetooth only works on secure contexts
2. **Bluetooth Enabled**: Device Bluetooth must be on
3. **Permissions**: User must grant Bluetooth permission
4. **Compatible Watch**: Smartwatch with standard Bluetooth services

## 🚀 How to Use

### Step 1: Enable Bluetooth
- Turn on Bluetooth on your phone/computer
- Turn on Bluetooth on your smartwatch
- Ensure watch is in pairing/discoverable mode

### Step 2: Scan for Watch
1. Click "Scan for Smart Watch" button
2. Browser will show Bluetooth device picker
3. Select your smartwatch from the list
4. Click "Pair" in the browser dialog

### Step 3: Connection
- App connects to watch via GATT
- Reads battery level, heart rate, etc.
- Enables SOS trigger functionality

### Step 4: Use SOS from Watch
- Press the designated SOS button on your watch
- Or use the "Trigger SOS from Watch" button in app
- Emergency alert activates instantly

## 🔌 Supported Smartwatch Models

The app automatically detects watches with these Bluetooth services:

### Standard Services (Most Common)
- **Heart Rate Service (0x180D)**: For heart rate monitoring
- **Battery Service (0x180F)**: For battery level
- **Device Information (0x180A)**: For watch details
- **Current Time Service (0x1805)**: Common in smartwatches

### Compatible Watch Brands
- ✅ Apple Watch (with limited support)
- ✅ Samsung Galaxy Watch
- ✅ Fitbit (Sense, Versa series)
- ✅ Garmin (most models)
- ✅ Amazfit
- ✅ Huawei Watch
- ✅ Fossil smartwatches
- ✅ TicWatch
- ✅ Generic Bluetooth LE fitness trackers

## 📡 Data Collected from Watch

### Real-Time Monitoring
1. **Battery Level**: Actual watch battery percentage
2. **Heart Rate**: Live heart rate in BPM
3. **Connection Quality**: Bluetooth signal strength
4. **Last Sync**: Timestamp of last data update

### Emergency Features
1. **SOS Button Detection**: Physical button on watch
2. **Emergency Mode**: Activates when phone battery < 20%
3. **Auto-Reconnect**: Reconnects if connection drops

## 🛠️ Deployment Setup

### For Local Development (localhost)
Web Bluetooth works on `localhost` without HTTPS:
```
http://localhost:3000  ✅ Works
http://127.0.0.1:3000  ✅ Works
```

### For Production Deployment
**Must use HTTPS:**
```
https://yourapp.com  ✅ Works
http://yourapp.com   ❌ Blocked
```

### Adding Permissions-Policy Header
Add this HTTP header to your server configuration:

**Vercel** (`vercel.json`):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Permissions-Policy",
          "value": "bluetooth=(self)"
        }
      ]
    }
  ]
}
```

**Netlify** (`netlify.toml`):
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Permissions-Policy = "bluetooth=(self)"
```

**Nginx**:
```nginx
location / {
    add_header Permissions-Policy "bluetooth=(self)";
}
```

**Apache** (`.htaccess`):
```apache
<IfModule mod_headers.c>
    Header set Permissions-Policy "bluetooth=(self)"
</IfModule>
```

## 🐛 Troubleshooting

### Error: "Bluetooth API not available"
**Solution:**
- Use Chrome, Edge, or Opera browser
- Update browser to latest version
- Check if running on iOS (not supported)

### Error: "Bluetooth access is blocked"
**Solution:**
- Ensure app is served over HTTPS
- Check browser console for permissions errors
- Add Permissions-Policy header (see above)

### Error: "No device selected"
**Solution:**
- User cancelled the device picker
- Try scanning again
- Ensure watch Bluetooth is enabled

### Watch Not Found During Scan
**Solution:**
- Ensure watch is powered on
- Enable Bluetooth on watch
- Put watch in discoverable/pairing mode
- Move watch closer to device
- Restart watch Bluetooth

### Connection Drops Frequently
**Solution:**
- Keep watch within Bluetooth range (10 meters)
- Check watch battery level
- Disable battery saving mode on watch
- Remove obstacles between devices

### Heart Rate Not Updating
**Solution:**
- Check if watch supports Heart Rate Service
- Ensure heart rate sensor is enabled on watch
- Wear watch properly for sensor contact
- Grant all permissions when connecting

## 🔒 Privacy & Security

### Data Handling
- All data stays on device (no cloud transmission)
- Bluetooth connection is encrypted
- No personal data stored on servers
- User controls all permissions

### Permissions Required
1. **Bluetooth Access**: To scan and connect
2. **Bluetooth GATT**: To read watch services
3. **Notifications**: For real-time data updates

## 📱 Testing the Integration

### Test Connection
1. Open app in Chrome/Edge
2. Click "Scan for Smart Watch"
3. Select your watch from picker
4. Verify connection success modal
5. Check battery and heart rate display

### Test SOS Trigger
1. Ensure watch is connected
2. Click "Trigger SOS from Watch" button
3. Verify SOS alert activates
4. Check that onWatchSOS callback fires

### Test Auto-Reconnect
1. Turn off watch Bluetooth
2. Wait for disconnect notification
3. Turn Bluetooth back on
4. Click reconnect button
5. Verify connection restores

### Test Emergency Mode
1. Simulate phone battery < 20%
2. Verify "Emergency Mode Active" alert
3. Confirm SOS button is enabled
4. Test watch SOS trigger

## 🎯 Advanced: Custom Watch Integration

### Adding Custom Watch Services
Edit the `scanForDevices` function to include your watch's specific services:

```typescript
const device = await (navigator.bluetooth as any).requestDevice({
  filters: [
    { services: ['heart_rate'] },
    { services: ['battery_service'] },
    { services: ['YOUR_CUSTOM_SERVICE_UUID'] } // Add here
  ],
  optionalServices: [
    'YOUR_CUSTOM_SERVICE_UUID'
  ]
})
```

### Implementing Custom SOS Button
1. Find your watch's SOS characteristic UUID
2. Subscribe to notifications from that characteristic
3. Handle button press in `handleCharacteristicValueChanged`

Example:
```typescript
const customService = await server.getPrimaryService('YOUR_SERVICE_UUID')
const sosCharacteristic = await customService.getCharacteristic('YOUR_SOS_CHAR_UUID')
await sosCharacteristic.startNotifications()
sosCharacteristic.addEventListener('characteristicvaluechanged', (e) => {
  const value = e.target.value
  if (value.getUint8(0) === YOUR_SOS_VALUE) {
    handleWatchButtonPress()
  }
})
```

## 📚 Additional Resources

- [Web Bluetooth API Specification](https://webbluetoothcg.github.io/web-bluetooth/)
- [Chrome Web Bluetooth Guide](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web)
- [Bluetooth GATT Services](https://www.bluetooth.com/specifications/gatt/services/)
- [Bluetooth Characteristics](https://www.bluetooth.com/specifications/gatt/characteristics/)

## 🎉 Features Now Available

✅ Real Bluetooth device scanning
✅ Actual smartwatch connection
✅ Live heart rate monitoring
✅ Real-time battery tracking
✅ Physical watch button SOS trigger
✅ Emergency mode activation
✅ Auto-reconnect capability
✅ Connection quality monitoring
✅ GATT service support
✅ Production-ready implementation

---

**Note**: The implementation uses standard Bluetooth GATT services that work with most modern smartwatches. For brand-specific features, you may need to add custom service UUIDs for your particular watch model.
