import type { Location } from './types'

export const requestLocationPermission = async (): Promise<boolean> => {
  if (!navigator.geolocation) {
    return false
  }

  // Check if Permissions API is available
  if ('permissions' in navigator) {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
      
      if (permissionStatus.state === 'granted') {
        return true
      } else if (permissionStatus.state === 'prompt') {
        return true // Will be requested when getCurrentLocation is called
      } else {
        return false
      }
    } catch (error) {
      // Permissions API might not support geolocation query in some environments
      // This is common in iframe/preview mode - gracefully continue
      return true
    }
  }
  
  // Fallback: Permissions API not available
  return true
}

const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
  // Check if it's a permissions policy block
  if (error.code === error.PERMISSION_DENIED && 
      error.message.toLowerCase().includes('permissions policy')) {
    return 'Geolocation blocked by browser policy. This app may be running in a restricted environment. Using fallback location.'
  }
  
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location permission denied. Please enable location access in your browser settings.'
    case error.POSITION_UNAVAILABLE:
      return 'Location information is unavailable. Please check your device GPS settings.'
    case error.TIMEOUT:
      return 'Location request timed out. Please try again.'
    default:
      return `Geolocation error: ${error.message}`
  }
}

export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve) => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      console.info('📍 Geolocation not available. Using demo location: Bangalore, India')
      resolve({
        lat: 12.9716,
        lng: 77.5946
      })
      return
    }
    
    // Use a timeout to handle stuck geolocation requests
    const timeoutId = setTimeout(() => {
      console.info('📍 Location request timeout. Using demo location: Bangalore, India')
      resolve({
        lat: 12.9716,
        lng: 77.5946
      })
    }, 3000) // 3 second timeout for faster fallback
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId)
        console.log('✓ Location obtained successfully')
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        clearTimeout(timeoutId)
        
        // Check if it's a permissions policy block (iframe/preview environment)
        const isPolicyBlock = error.message?.toLowerCase().includes('permissions policy') || 
                             error.message?.toLowerCase().includes('document') ||
                             error.code === error.PERMISSION_DENIED
        
        // Always use fallback location gracefully
        console.info('📍 Using demo location: Bangalore, India (Preview Mode)')
        resolve({
          lat: 12.9716,
          lng: 77.5946
        })
      },
      {
        enableHighAccuracy: false, // Changed to false for faster response
        timeout: 2500, // Shorter timeout
        maximumAge: 300000 // Allow cached position up to 5 minutes old
      }
    )
  })
}

export const watchLocation = (callback: (location: Location) => void): number => {
  if (!navigator.geolocation) {
    console.info('ℹ️ Location watch not available in this environment')
    return -1
  }
  
  try {
    return navigator.geolocation.watchPosition(
      (position) => {
        callback({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        // Silently handle all geolocation errors in watch mode
        // This prevents console spam in restricted environments
      },
      {
        enableHighAccuracy: false, // Faster, less battery intensive
        timeout: 5000,
        maximumAge: 300000 // 5 minutes
      }
    )
  } catch (error) {
    // Handle any exceptions from watchPosition
    console.info('ℹ️ Location watch unavailable')
    return -1
  }
}

export const clearLocationWatch = (watchId: number) => {
  if (watchId >= 0) {
    navigator.geolocation.clearWatch(watchId)
  }
}

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}
