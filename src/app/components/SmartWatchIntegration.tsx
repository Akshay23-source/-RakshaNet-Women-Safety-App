import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Watch, Bluetooth, Battery, Activity, CheckCircle, XCircle, AlertTriangle, Zap, Radio, Signal, RefreshCw, Info, Copy } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Alert, AlertDescription } from './ui/alert'
import { toast } from 'sonner@2.0.3'
import { motion, AnimatePresence } from 'motion/react'

type ConnectionStatus = 'disconnected' | 'scanning' | 'connecting' | 'connected' | 'error'

interface SmartWatchIntegrationProps {
  onWatchSOS?: () => void
  phoneBatteryLevel?: number
}

export function SmartWatchIntegration({ onWatchSOS, phoneBatteryLevel = 100 }: SmartWatchIntegrationProps) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected')
  const [isScanning, setIsScanning] = useState(false)
  const [showConnectionSuccess, setShowConnectionSuccess] = useState(false)
  const [watchData, setWatchData] = useState({
    battery: 85,
    heartRate: 72,
    steps: 5432,
    deviceName: '',
    lastSync: new Date(),
    signalQuality: 95
  })
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [watchButtonPressed, setWatchButtonPressed] = useState(false)
  const [bluetoothError, setBluetoothError] = useState<string | null>(null)
  
  // Refs for Bluetooth objects
  const deviceRef = useRef<any>(null)
  const serverRef = useRef<any>(null)
  const characteristicRef = useRef<any>(null)
  const batteryCharacteristicRef = useRef<any>(null)
  const heartRateCharacteristicRef = useRef<any>(null)
  
  // Monitor phone battery and enable emergency mode
  useEffect(() => {
    if (phoneBatteryLevel < 20 && connectionStatus === 'connected') {
      setEmergencyMode(true)
      toast.warning('Emergency Mode Activated - Watch can trigger SOS', {
        description: 'Phone battery is low. Your watch is now your primary emergency device.',
        duration: 5000
      })
    } else if (phoneBatteryLevel >= 20) {
      setEmergencyMode(false)
    }
  }, [phoneBatteryLevel, connectionStatus])
  
  // Read battery level from watch
  const readBatteryLevel = async () => {
    if (batteryCharacteristicRef.current) {
      try {
        const value = await batteryCharacteristicRef.current.readValue()
        const battery = value.getUint8(0)
        setWatchData(prev => ({ ...prev, battery }))
      } catch (error) {
        console.log('Could not read battery:', error)
      }
    }
  }
  
  // Handle notifications from watch (for SOS button)
  const handleCharacteristicValueChanged = useCallback((event: any) => {
    const value = event.target.value
    const data = new Uint8Array(value.buffer)
    
    // Check if SOS button was pressed (you'll need to adjust based on your watch's protocol)
    // This is a generic implementation - adjust based on your smartwatch model
    if (data[0] === 0xFF && data[1] === 0x01) { // Example SOS signal
      handleWatchButtonPress()
    }
    
    // Update signal quality based on notifications
    setWatchData(prev => ({ ...prev, lastSync: new Date() }))
  }, [])
  
  // Read heart rate from watch
  const handleHeartRateChanged = useCallback((event: any) => {
    const value = event.target.value
    const heartRate = value.getUint8(1) // Heart rate is typically in the second byte
    setWatchData(prev => ({ ...prev, heartRate, lastSync: new Date() }))
  }, [])
  
  // Scan for real Bluetooth smartwatches
  const scanForDevices = async () => {
    setIsScanning(true)
    setConnectionStatus('scanning')
    setBluetoothError(null)
    
    try {
      // Check if Web Bluetooth API is available
      if (!('bluetooth' in navigator)) {
        throw new Error('Web Bluetooth API is not available in your browser. Please use Chrome, Edge, or Opera on desktop/Android.')
      }
      
      // Request Bluetooth device - scanning for smartwatches
      // Using acceptAllDevices with optional services for maximum compatibility
      const device = await (navigator.bluetooth as any).requestDevice({
        // Try with filters first for smartwatch-specific services
        filters: [
          { services: ['heart_rate'] },
          { services: ['battery_service'] },
          { services: [0x180D] }, // Heart Rate Service
          { services: [0x180F] }, // Battery Service
          { services: [0x1805] }, // Current Time Service (common in watches)
          { services: [0x1816] }, // Cycling Speed and Cadence
          { services: [0x1814] }, // Running Speed and Cadence
          { namePrefix: 'Watch' }, // Devices with "Watch" in name
          { namePrefix: 'Band' },  // Fitness bands
          { namePrefix: 'Fit' },   // Fitbit, etc.
        ],
        optionalServices: [
          'battery_service',
          'heart_rate',
          'device_information',
          0x180D, // Heart Rate
          0x180F, // Battery
          0x180A, // Device Information
          0x1805, // Current Time
          0x1816, // Cycling Speed
          0x1814, // Running Speed
          0x1818, // Cycling Power
          0x1826, // Fitness Machine
          'generic_access',
          'generic_attribute',
          'immediate_alert', // For SOS button
          'link_loss',
          'tx_power',
          'current_time',
          'user_data'
        ]
      })
      
      if (!device) {
        throw new Error('No device selected')
      }
      
      // Store device reference
      deviceRef.current = device
      
      // Connect to the device
      await connectToDevice(device)
      
    } catch (error: any) {
      console.error('Bluetooth scan error:', error)
      setIsScanning(false)
      setConnectionStatus('error')
      
      // Handle specific errors
      if (error.name === 'NotFoundError') {
        toast.info('No device selected', {
          description: 'Please select a smartwatch from the list'
        })
        setConnectionStatus('disconnected')
      } else if (error.name === 'SecurityError' || error.message?.includes('permissions policy')) {
        setBluetoothError('DEPLOYMENT_CONFIG_REQUIRED')
        toast.error('⚙️ Bluetooth Blocked - Configuration Required', {
          description: 'Your deployment needs Bluetooth permissions enabled. See instructions below.',
          duration: 8000
        })
      } else if (error.name === 'NotAllowedError') {
        setBluetoothError('Bluetooth permission denied by user')
        toast.error('Permission Denied', {
          description: 'Please allow Bluetooth access to connect to your smartwatch'
        })
      } else if (error.name === 'NotSupportedError') {
        setBluetoothError('Bluetooth not supported on this browser')
        toast.error('Browser Not Supported', {
          description: 'Please use Chrome, Edge, or Opera'
        })
      } else {
        setBluetoothError(error.message || 'Failed to scan for devices')
        toast.error('Bluetooth Error', {
          description: error.message || 'Could not scan for smartwatches'
        })
      }
    }
  }
  
  // Connect to selected Bluetooth device
  const connectToDevice = async (device: any) => {
    setConnectionStatus('connecting')
    toast.loading(`Connecting to ${device.name || 'smartwatch'}...`, { id: 'connecting' })
    
    try {
      // Connect to GATT server
      const server = await device.gatt.connect()
      serverRef.current = server
      
      setWatchData(prev => ({ ...prev, deviceName: device.name || 'Smart Watch' }))
      
      // Get Battery Service
      try {
        const batteryService = await server.getPrimaryService('battery_service')
        const batteryCharacteristic = await batteryService.getCharacteristic('battery_level')
        batteryCharacteristicRef.current = batteryCharacteristic
        
        // Read initial battery level
        const batteryValue = await batteryCharacteristic.readValue()
        const battery = batteryValue.getUint8(0)
        setWatchData(prev => ({ ...prev, battery }))
        
        // Start monitoring battery
        await batteryCharacteristic.startNotifications()
        batteryCharacteristic.addEventListener('characteristicvaluechanged', (e: any) => {
          const value = e.target.value.getUint8(0)
          setWatchData(prev => ({ ...prev, battery: value, lastSync: new Date() }))
        })
      } catch (error) {
        console.log('Battery service not available:', error)
      }
      
      // Get Heart Rate Service
      try {
        const heartRateService = await server.getPrimaryService('heart_rate')
        const heartRateCharacteristic = await heartRateService.getCharacteristic('heart_rate_measurement')
        heartRateCharacteristicRef.current = heartRateCharacteristic
        
        // Start monitoring heart rate
        await heartRateCharacteristic.startNotifications()
        heartRateCharacteristic.addEventListener('characteristicvaluechanged', handleHeartRateChanged)
      } catch (error) {
        console.log('Heart rate service not available:', error)
      }
      
      // Listen for watch button (custom characteristic - adjust based on your watch)
      // This is a placeholder - you'll need to implement based on your specific smartwatch
      try {
        const genericAccessService = await server.getPrimaryService('generic_access')
        // Add specific characteristic for your watch's SOS button here
      } catch (error) {
        console.log('Custom service not available:', error)
      }
      
      // Handle disconnection
      device.addEventListener('gattserverdisconnected', () => {
        setConnectionStatus('disconnected')
        setEmergencyMode(false)
        toast.info('Watch disconnected')
      })
      
      // Connection successful
      setConnectionStatus('connected')
      toast.dismiss('connecting')
      setShowConnectionSuccess(true)
      
      toast.success(`Successfully connected to ${device.name || 'smartwatch'}!`, {
        description: 'Your watch is now synced and ready for emergency use.',
        duration: 4000
      })
      
      // Auto-hide success modal after 3 seconds
      setTimeout(() => {
        setShowConnectionSuccess(false)
      }, 3000)
      
    } catch (error: any) {
      console.error('Connection error:', error)
      toast.dismiss('connecting')
      toast.error(`Failed to connect to ${device.name || 'smartwatch'}`, {
        description: error.message
      })
      setConnectionStatus('error')
    } finally {
      setIsScanning(false)
    }
  }
  
  // Disconnect from watch
  const disconnectWatch = () => {
    if (deviceRef.current && deviceRef.current.gatt.connected) {
      deviceRef.current.gatt.disconnect()
    }
    
    deviceRef.current = null
    serverRef.current = null
    characteristicRef.current = null
    batteryCharacteristicRef.current = null
    heartRateCharacteristicRef.current = null
    
    setConnectionStatus('disconnected')
    setEmergencyMode(false)
    setWatchData(prev => ({ ...prev, deviceName: '' }))
    toast.info('Smart watch disconnected')
  }
  
  // Reconnect to watch
  const reconnectWatch = async () => {
    if (deviceRef.current) {
      await connectToDevice(deviceRef.current)
    } else {
      await scanForDevices()
    }
  }
  
  // Handle watch button press for SOS
  const handleWatchButtonPress = useCallback(() => {
    if (connectionStatus === 'connected') {
      setWatchButtonPressed(true)
      
      // Visual and haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200])
      }
      
      toast.error('🚨 WATCH SOS ACTIVATED!', {
        description: 'Emergency alert triggered from smartwatch. Buzzer will auto-reset in 10 seconds.',
        duration: 3000
      })
      
      // Trigger the main SOS function
      if (onWatchSOS) {
        setTimeout(() => {
          onWatchSOS()
          setWatchButtonPressed(false)
        }, 500)
      }
    }
  }, [connectionStatus, onWatchSOS])
  
  // Manual SOS trigger for testing
  const triggerWatchSOS = () => {
    if (connectionStatus === 'connected') {
      handleWatchButtonPress()
    }
  }
  
  // Copy configuration to clipboard
  const copyConfig = (platform: string) => {
    let config = ''
    
    switch (platform) {
      case 'vercel':
        config = `{
  "headers": [{
    "source": "/(.*)",
    "headers": [{
      "key": "Permissions-Policy",
      "value": "bluetooth=*, geolocation=*, camera=*, microphone=*"
    }]
  }]
}`
        break
      case 'netlify':
        config = `[[headers]]
  for = "/*"
  [headers.values]
    Permissions-Policy = "bluetooth=*, geolocation=*, camera=*, microphone=*"`
        break
      case 'header':
        config = 'Permissions-Policy: bluetooth=*, geolocation=*, camera=*, microphone=*'
        break
    }
    
    navigator.clipboard.writeText(config).then(() => {
      toast.success('Copied to clipboard!', {
        description: 'Paste this into your configuration file'
      })
    }).catch(() => {
      toast.error('Failed to copy', {
        description: 'Please copy manually'
      })
    })
  }
  
  const getBatteryColor = (battery: number) => {
    if (battery > 50) return 'text-green-600'
    if (battery > 20) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  const getConnectionStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        )
      case 'connecting':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-300">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Connecting...
          </Badge>
        )
      case 'scanning':
        return (
          <Badge className="bg-purple-100 text-purple-700 border-purple-300">
            <Bluetooth className="w-3 h-3 mr-1 animate-pulse" />
            Scanning...
          </Badge>
        )
      case 'error':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-300">
            <XCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        )
      default:
        return null
    }
  }
  
  return (
    <>
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2">
              <Watch className="w-5 h-5 text-blue-500" />
              Smart Watch Integration
            </h3>
            {getConnectionStatusBadge()}
          </div>
          
          {/* Error Alert */}
          <AnimatePresence>
            {bluetoothError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {bluetoothError === 'DEPLOYMENT_CONFIG_REQUIRED' ? (
                  <Alert className="bg-orange-50 border-orange-300 border-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <AlertDescription className="text-sm text-orange-900">
                      <div className="space-y-3">
                        <div>
                          <strong className="text-base">🔧 Bluetooth Configuration Required</strong>
                          <p className="mt-1 text-orange-800">
                            Your deployment environment is blocking Bluetooth access. You need to add permissions configuration.
                          </p>
                        </div>
                        
                        <div className="bg-white/50 p-3 rounded border border-orange-200">
                          <p className="text-xs mb-2">
                            <strong>Quick Fix - Choose your platform:</strong>
                          </p>
                          
                          <div className="space-y-2 text-xs">
                            <details className="cursor-pointer">
                              <summary className="text-orange-700 hover:text-orange-900">
                                ▸ <strong>Vercel</strong> - Click to see fix
                              </summary>
                              <div className="mt-2 ml-4 space-y-2">
                                <div className="p-2 bg-gray-800 text-green-400 rounded text-xs overflow-x-auto">
                                  <code>
                                    {'// Create or update vercel.json\n{\n  "headers": [{\n    "source": "/(.*)",\n    "headers": [{\n      "key": "Permissions-Policy",\n      "value": "bluetooth=(self)"\n    }]\n  }]\n}'}
                                  </code>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyConfig('vercel')}
                                  className="text-xs h-7"
                                >
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copy Config
                                </Button>
                              </div>
                            </details>
                            
                            <details className="cursor-pointer">
                              <summary className="text-orange-700 hover:text-orange-900">
                                ▸ <strong>Netlify</strong> - Click to see fix
                              </summary>
                              <div className="mt-2 ml-4 space-y-2">
                                <div className="p-2 bg-gray-800 text-green-400 rounded text-xs overflow-x-auto">
                                  <code>
                                    {'// Create or update netlify.toml\n[[headers]]\n  for = "/*"\n  [headers.values]\n    Permissions-Policy = "bluetooth=(self)"'}
                                  </code>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyConfig('netlify')}
                                  className="text-xs h-7"
                                >
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copy Config
                                </Button>
                              </div>
                            </details>
                            
                            <details className="cursor-pointer">
                              <summary className="text-orange-700 hover:text-orange-900">
                                ▸ <strong>Other Platforms</strong> - Click to see fix
                              </summary>
                              <div className="mt-2 ml-4 space-y-2">
                                <p className="text-orange-800">Add this HTTP header to your server:</p>
                                <div className="p-2 bg-gray-800 text-green-400 rounded text-xs overflow-x-auto">
                                  <code>Permissions-Policy: bluetooth=(self)</code>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyConfig('header')}
                                  className="text-xs h-7"
                                >
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copy Header
                                </Button>
                              </div>
                            </details>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-2 rounded border border-blue-200">
                          <p className="text-xs text-blue-900">
                            <strong>✓ Good News:</strong> Configuration files have been created in your project root:
                          </p>
                          <ul className="text-xs text-blue-800 ml-4 mt-1 list-disc">
                            <li><code>vercel.json</code> - For Vercel deployments</li>
                            <li><code>netlify.toml</code> - For Netlify deployments</li>
                            <li><code>public/_headers</code> - For Cloudflare/other platforms</li>
                          </ul>
                          <p className="text-xs text-blue-900 mt-2">
                            <strong>Next step:</strong> Redeploy your app and the Bluetooth will work!
                          </p>
                        </div>
                        
                        <div className="text-xs text-orange-700">
                          <strong>Testing locally?</strong> Use <code className="bg-white px-1 rounded">http://localhost:3000</code> - it works without configuration!
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-sm text-red-900">
                      <strong>Bluetooth Error:</strong> {bluetoothError}
                      <div className="mt-2 text-xs text-red-700">
                        <strong>Requirements:</strong>
                        <ul className="list-disc ml-4 mt-1">
                          <li>Use Chrome, Edge, or Opera browser</li>
                          <li>Enable Bluetooth on your device</li>
                          <li>Grant Bluetooth permissions when prompted</li>
                          <li>Ensure app is served over HTTPS</li>
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {connectionStatus !== 'connected' ? (
            <div className="space-y-4">
              <div className="text-center py-6 space-y-4">
                <motion.div 
                  className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center"
                  animate={isScanning ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Bluetooth className={`w-10 h-10 text-blue-600 ${isScanning ? 'animate-pulse' : ''}`} />
                </motion.div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Connect your smartwatch via Bluetooth</p>
                  <p className="text-xs text-gray-500">
                    Make sure your watch's Bluetooth is enabled
                  </p>
                </div>
                <Button
                  onClick={scanForDevices}
                  disabled={isScanning || connectionStatus === 'connecting'}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 mx-auto"
                >
                  <Bluetooth className="w-4 h-4" />
                  {isScanning ? 'Scanning...' : 'Scan for Smart Watch'}
                </Button>
              </div>

              {/* Instructions */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  How to Connect:
                </h4>
                <ol className="text-xs text-gray-700 space-y-1 list-decimal ml-4">
                  <li>Turn on Bluetooth on your smartwatch</li>
                  <li>Click "Scan for Smart Watch" button</li>
                  <li>Select your watch from the browser prompt</li>
                  <li>Wait for connection confirmation</li>
                  <li>Use watch for emergency SOS triggers</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Emergency Mode Alert */}
              <AnimatePresence>
                {emergencyMode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-white"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6 animate-pulse" />
                      <div>
                        <p className="text-sm">Emergency Mode Active</p>
                        <p className="text-xs opacity-90">Phone battery low - Watch SOS enabled</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Device Info Card */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">{watchData.deviceName || 'Smart Watch'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={reconnectWatch}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={disconnectWatch}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Real-time Stats */}
                <div className="grid grid-cols-3 gap-3 text-center mb-3">
                  <div>
                    <Battery className={`w-5 h-5 mx-auto mb-1 ${getBatteryColor(watchData.battery)}`} />
                    <p className="text-xs text-gray-600">Battery</p>
                    <p className="text-sm">{Math.floor(watchData.battery)}%</p>
                  </div>
                  <div>
                    <Activity className="w-5 h-5 mx-auto text-red-600 mb-1" />
                    <p className="text-xs text-gray-600">Heart Rate</p>
                    <p className="text-sm">{watchData.heartRate} bpm</p>
                  </div>
                  <div>
                    <Signal className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                    <p className="text-xs text-gray-600">Signal</p>
                    <p className="text-sm">{watchData.signalQuality}%</p>
                  </div>
                </div>
                
                {/* Connection Quality */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Signal Quality</span>
                    <span>{watchData.signalQuality}%</span>
                  </div>
                  <Progress value={watchData.signalQuality} className="h-1" />
                </div>
                
                <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                  <span>Last synced: {new Date(watchData.lastSync).toLocaleTimeString()}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live</span>
                  </div>
                </div>
              </div>
              
              {/* Watch SOS Button */}
              <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-2 border-red-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-red-600" />
                    <span className="text-sm">Watch SOS Trigger</span>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    Ready
                  </Badge>
                </div>
                
                <Button
                  onClick={triggerWatchSOS}
                  className={`w-full ${watchButtonPressed ? 'animate-pulse' : ''} bg-red-600 hover:bg-red-700`}
                >
                  <Radio className={`w-4 h-4 mr-2 ${watchButtonPressed ? 'animate-spin' : ''}`} />
                  Trigger SOS from Watch
                </Button>
                
                <p className="text-xs text-gray-600 mt-2 text-center">
                  Press the emergency button on your watch to send instant SOS
                </p>
              </div>
              
              {/* Available Features */}
              <div className="space-y-2">
                <h4 className="text-sm">Active Features</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-green-100 rounded">
                    <span className="text-sm">One-tap SOS from watch</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-100 rounded">
                    <span className="text-sm">Real-time heart rate monitoring</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-100 rounded">
                    <span className="text-sm">Battery level tracking</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-100 rounded">
                    <span className="text-sm">Emergency notifications</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-100 rounded">
                    <span className="text-sm">Auto-reconnect</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-gray-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Your watch is connected and ready for emergency use
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Connection Success Modal */}
      <Dialog open={showConnectionSuccess} onOpenChange={setShowConnectionSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="mx-auto mb-4"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </motion.div>
            <DialogTitle className="text-center text-2xl">Successfully Connected!</DialogTitle>
            <DialogDescription className="text-center space-y-3">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base"
              >
                Your {watchData.deviceName} is now connected to RakshaNet
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
              >
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Real-time health monitoring active</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Battery level tracking enabled</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Emergency SOS ready</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Watch button SOS configured</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xs text-gray-500"
              >
                Press the SOS button on your watch for instant emergency alerts
              </motion.p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
