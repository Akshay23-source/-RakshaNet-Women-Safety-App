import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'jsr:@supabase/supabase-js@2.49.8'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Error helper
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

// Middleware
app.use('*', cors())
app.use('*', logger(console.log))

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// Storage bucket setup
const bucketName = 'make-4c768538-evidence'
async function ensureBucket() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: false })
    }
  } catch (error: any) {
    console.log('Bucket setup error (will retry on first use):', error?.message || error)
  }
}
// Don't block deployment on bucket creation
ensureBucket().catch(console.error)

// ============================================
// AUTH ROUTES
// ============================================

app.post('/auth/signup', async (c) => {
  try {
    const { email, password, name, phone } = await c.req.json()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone },
      email_confirm: true // Auto-confirm since email server not configured
    })
    
    if (error) {
      console.log(`Signup error for ${email}: ${error.message}`)
      return c.json({ error: error.message }, 400)
    }
    
    // Create user profile in KV store
    const userId = data.user.id
    await kv.set(`user:${userId}`, {
      id: userId,
      email,
      name,
      phone,
      role: 'user',
      isHelper: false,
      createdAt: new Date().toISOString()
    })
    
    return c.json({ user: data.user, message: 'Signup successful' })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Signup error: ${msg}`)
    return c.json({ error: 'Signup failed: ' + msg }, 500)
  }
})

// ============================================
// EMERGENCY CONTACTS ROUTES
// ============================================

app.get('/contacts/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const contacts = await kv.get(`contacts:${userId}`) || []
    return c.json({ contacts })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error fetching contacts: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

app.post('/contacts/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const contact = await c.req.json()
    
    const contacts = await kv.get(`contacts:${userId}`) || []
    const newContact = {
      ...contact,
      id: `contact_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    }
    contacts.push(newContact)
    
    await kv.set(`contacts:${userId}`, contacts)
    return c.json({ contact: newContact, message: 'Contact added' })
  } catch (error: any) {
    console.log(`Error adding contact: ${error?.message || error}`)
    return c.json({ error: error?.message || String(error) }, 500)
  }
})

app.delete('/contacts/:userId/:contactId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const contactId = c.req.param('contactId')
    
    const contacts = await kv.get(`contacts:${userId}`) || []
    const filtered = contacts.filter((ct: any) => ct.id !== contactId)
    
    await kv.set(`contacts:${userId}`, filtered)
    return c.json({ message: 'Contact deleted' })
  } catch (error: any) {
    console.log(`Error deleting contact: ${error?.message || error}`)
    return c.json({ error: error?.message || String(error) }, 500)
  }
})

// ============================================
// SOS ROUTES
// ============================================

app.post('/sos/trigger', async (c) => {
  try {
    const { userId, location, type, depth_m } = await c.req.json()
    
    const sosId = `SOS_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    
    const sosData = {
      id: sosId,
      userId,
      type: type || 'EMERGENCY',
      timestamp: new Date().toISOString(),
      location,
      depth_m: depth_m || 0,
      confidence: 0.95,
      status: 'ACTIVE',
      networkStage: 'CONTACT',
      networkUsed: null,
      helpersAlerted: 0,
      respondedBy: null,
      evidence: [],
      escalationLog: []
    }
    
    await kv.set(`sos:${sosId}`, sosData)
    
    // Add to user's active SOS list
    const userSosList = await kv.get(`user_sos:${userId}`) || []
    userSosList.unshift(sosId)
    await kv.set(`user_sos:${userId}`, userSosList)
    
    // Store in active SOS index
    const activeSOS = await kv.get('active_sos') || []
    activeSOS.push(sosId)
    await kv.set('active_sos', activeSOS)
    
    console.log(`SOS triggered: ${sosId} by user ${userId}`)
    
    return c.json({ sosId, message: 'SOS triggered successfully', sos: sosData })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error triggering SOS: ${msg}`)
    return c.json({ error: 'Failed to trigger SOS: ' + msg }, 500)
  }
})

app.get('/sos/:sosId', async (c) => {
  try {
    const sosId = c.req.param('sosId')
    const sosData = await kv.get(`sos:${sosId}`)
    
    if (!sosData) {
      return c.json({ error: 'SOS not found' }, 404)
    }
    
    return c.json({ sos: sosData })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error fetching SOS: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

app.post('/sos/:sosId/update', async (c) => {
  try {
    const sosId = c.req.param('sosId')
    const updates = await c.req.json()
    
    const sosData = await kv.get(`sos:${sosId}`)
    if (!sosData) {
      return c.json({ error: 'SOS not found' }, 404)
    }
    
    const updatedSOS = { ...sosData, ...updates }
    await kv.set(`sos:${sosId}`, updatedSOS)
    
    console.log(`SOS updated: ${sosId}`, updates)
    
    return c.json({ sos: updatedSOS, message: 'SOS updated' })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error updating SOS: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

app.post('/sos/:sosId/resolve', async (c) => {
  try {
    const sosId = c.req.param('sosId')
    const { resolvedBy } = await c.req.json()
    
    const sosData = await kv.get(`sos:${sosId}`)
    if (!sosData) {
      return c.json({ error: 'SOS not found' }, 404)
    }
    
    sosData.status = 'RESOLVED'
    sosData.resolvedAt = new Date().toISOString()
    sosData.resolvedBy = resolvedBy
    
    await kv.set(`sos:${sosId}`, sosData)
    
    // Remove from active SOS
    const activeSOS = await kv.get('active_sos') || []
    const filtered = activeSOS.filter((id: string) => id !== sosId)
    await kv.set('active_sos', filtered)
    
    console.log(`SOS resolved: ${sosId}`)
    
    return c.json({ sos: sosData, message: 'SOS resolved' })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error resolving SOS: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

app.get('/sos/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const sosIds = await kv.get(`user_sos:${userId}`) || []
    
    const sosList = []
    for (const sosId of sosIds) {
      const sosData = await kv.get(`sos:${sosId}`)
      if (sosData) sosList.push(sosData)
    }
    
    return c.json({ sosList })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error fetching user SOS: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

// ============================================
// NEARBY HELPERS ROUTES
// ============================================

// Helper registration
app.post('/helpers/register', async (c) => {
  try {
    const { userId, location, availability } = await c.req.json()
    
    const helperData = {
      userId,
      location,
      availability: availability ?? true,
      registeredAt: new Date().toISOString(),
      sosResponded: 0,
      rating: 5.0
    }
    
    await kv.set(`helper:${userId}`, helperData)
    
    // Update user profile
    const userData = await kv.get(`user:${userId}`)
    if (userData) {
      userData.isHelper = true
      await kv.set(`user:${userId}`, userData)
    }
    
    console.log(`Helper registered: ${userId}`)
    
    return c.json({ helper: helperData, message: 'Registered as helper' })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error registering helper: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

// Find nearby helpers
app.post('/helpers/nearby', async (c) => {
  try {
    const { location, radius } = await c.req.json() // radius in km
    
    // Get all helpers
    const allKeys = await kv.getByPrefix('helper:')
    const nearbyHelpers = []
    
    for (const { value } of allKeys) {
      if (!value.availability) continue
      
      const distance = calculateDistance(
        location.lat, location.lng,
        value.location.lat, value.location.lng
      )
      
      if (distance <= (radius || 1)) { // default 1km
        nearbyHelpers.push({
          ...value,
          distance: distance.toFixed(2)
        })
      }
    }
    
    // Sort by distance
    nearbyHelpers.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
    
    return c.json({ helpers: nearbyHelpers, count: nearbyHelpers.length })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error finding nearby helpers: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

// Respond to SOS
app.post('/helpers/respond', async (c) => {
  try {
    const { sosId, helperId, eta } = await c.req.json()
    
    const sosData = await kv.get(`sos:${sosId}`)
    if (!sosData) {
      return c.json({ error: 'SOS not found' }, 404)
    }
    
    // Update SOS with responder
    if (!sosData.respondedBy) {
      sosData.respondedBy = helperId
      sosData.responderETA = eta
      sosData.responseTime = new Date().toISOString()
    }
    
    // Add to responders list
    if (!sosData.responders) sosData.responders = []
    sosData.responders.push({
      helperId,
      eta,
      respondedAt: new Date().toISOString()
    })
    
    await kv.set(`sos:${sosId}`, sosData)
    
    // Update helper stats
    const helperData = await kv.get(`helper:${helperId}`)
    if (helperData) {
      helperData.sosResponded = (helperData.sosResponded || 0) + 1
      await kv.set(`helper:${helperId}`, helperData)
    }
    
    console.log(`Helper ${helperId} responded to SOS ${sosId}`)
    
    return c.json({ message: 'Response recorded', sos: sosData })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error recording helper response: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

// ============================================
// EVIDENCE ROUTES
// ============================================

app.post('/evidence/upload-url', async (c) => {
  try {
    const { sosId, fileName, fileType } = await c.req.json()
    
    const filePath = `${sosId}/${Date.now()}_${fileName}`
    
    // Generate signed upload URL
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(filePath)
    
    if (error) {
      console.log(`Error creating upload URL: ${error.message}`)
      return c.json({ error: error.message }, 400)
    }
    
    return c.json({ uploadUrl: data.signedUrl, filePath, message: 'Upload URL generated' })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error generating upload URL: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

app.post('/evidence/save-metadata', async (c) => {
  try {
    const { sosId, filePath, fileType, duration } = await c.req.json()
    
    const evidenceData = {
      sosId,
      filePath,
      fileType,
      duration,
      uploadedAt: new Date().toISOString()
    }
    
    // Add to SOS evidence list
    const sosData = await kv.get(`sos:${sosId}`)
    if (sosData) {
      if (!sosData.evidence) sosData.evidence = []
      sosData.evidence.push(evidenceData)
      await kv.set(`sos:${sosId}`, sosData)
    }
    
    return c.json({ evidence: evidenceData, message: 'Evidence metadata saved' })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error saving evidence metadata: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

app.get('/evidence/:sosId/:fileName', async (c) => {
  try {
    const sosId = c.req.param('sosId')
    const fileName = c.req.param('fileName')
    
    const filePath = `${sosId}/${fileName}`
    
    // Generate signed download URL (valid for 1 hour)
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 3600)
    
    if (error) {
      console.log(`Error creating download URL: ${error.message}`)
      return c.json({ error: error.message }, 400)
    }
    
    return c.json({ downloadUrl: data.signedUrl })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error generating download URL: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

// ============================================
// AI SAFETY ASSISTANT ROUTE
// ============================================

app.post('/ai/safety-assistant', async (c) => {
  try {
    const { message, context } = await c.req.json()
    
    // Note: This would integrate with OpenAI/Gemini API
    // For now, returning rule-based responses
    
    const responses: Record<string, string> = {
      'nearest police': 'The nearest police station is 800m away at Main Street. Dial 100 for emergency.',
      'safe route': 'I recommend taking the well-lit Main Road instead of the alley. It has 3 CCTV cameras.',
      'what to do': 'Stay calm. Press the SOS button to alert your contacts. Move towards a crowded area if possible.',
      'help': 'I can help you find: nearest police station, safe routes, nearby safe zones, or answer safety questions.'
    }
    
    const lowerMessage = message.toLowerCase()
    let reply = responses['help']
    
    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        reply = value
        break
      }
    }
    
    return c.json({ reply, timestamp: new Date().toISOString() })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`AI assistant error: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

// ============================================
// ADMIN DASHBOARD ROUTES
// ============================================

app.get('/admin/stats', async (c) => {
  try {
    const activeSOS = await kv.get('active_sos') || []
    
    // Get all SOS from active list
    let totalSOS = 0
    let resolvedSOS = 0
    let activeSosCount = 0
    
    const allSosKeys = await kv.getByPrefix('sos:')
    for (const { value } of allSosKeys) {
      totalSOS++
      if (value.status === 'RESOLVED') resolvedSOS++
      if (value.status === 'ACTIVE') activeSosCount++
    }
    
    // Get helper count
    const helperKeys = await kv.getByPrefix('helper:')
    const totalHelpers = helperKeys.length
    
    // Get user count
    const userKeys = await kv.getByPrefix('user:')
    const totalUsers = userKeys.length
    
    // Get active users (online in last 15 minutes)
    let activeUsers = 0
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)
    for (const { value } of userKeys) {
      if (value && value.lastSeen && new Date(value.lastSeen) > fifteenMinutesAgo) {
        activeUsers++
      }
    }
    
    // Count resolved SOS today
    const today = new Date().toISOString().split('T')[0]
    let resolvedToday = 0
    let totalResponseTime = 0
    let respondedCount = 0
    
    for (const { value } of allSosKeys) {
      // Count resolved today
      if (value && value.status === 'RESOLVED' && value.resolvedAt?.startsWith(today)) {
        resolvedToday++
      }
      
      // Calculate response time
      if (value && value.responseTime && value.timestamp) {
        const responseMs = new Date(value.responseTime).getTime() - new Date(value.timestamp).getTime()
        totalResponseTime += responseMs
        respondedCount++
      }
    }
    
    const avgResponseTimeMs = respondedCount > 0 ? totalResponseTime / respondedCount : 0
    const avgResponseMin = (avgResponseTimeMs / 60000).toFixed(1)
    
    const stats = {
      totalUsers,
      activeUsers,
      totalHelpers,
      totalSOS,
      activeSOS: activeSosCount,
      resolvedSOS,
      resolvedToday,
      averageResponseTime: `${avgResponseMin} min`,
      avgResponseTime: `${avgResponseMin} min`,
      timestamp: new Date().toISOString()
    }
    
    return c.json({ stats })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error fetching admin stats: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

app.get('/admin/recent-sos', async (c) => {
  try {
    const activeSOS = await kv.get('active_sos') || []
    
    const recentSOS = []
    for (const sosId of activeSOS.slice(0, 20)) {
      const sosData = await kv.get(`sos:${sosId}`)
      if (sosData) recentSOS.push(sosData)
    }
    
    return c.json({ sosList: recentSOS })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error fetching recent SOS: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

// Get nearby community members
app.post('/admin/nearby-community', async (c) => {
  try {
    const { location, radius } = await c.req.json()
    
    const userKeys = await kv.getByPrefix('user:')
    const nearbyMembers = []
    
    for (const { value } of userKeys) {
      if (!value || !value.location) continue
      
      const distance = calculateDistance(
        location.lat, location.lng,
        value.location.lat, value.location.lng
      )
      
      if (distance <= (radius || 5)) {
        nearbyMembers.push({
          id: value.id,
          name: value.name,
          phone: value.phone,
          location: value.location,
          distance,
          isOnline: value.isOnline || false,
          lastSeen: value.lastSeen || new Date().toISOString(),
          isHelper: value.isHelper || false
        })
      }
    }
    
    // Sort by distance
    nearbyMembers.sort((a, b) => a.distance - b.distance)
    
    return c.json({ members: nearbyMembers })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error fetching nearby community: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

// Get recent user activities
app.get('/admin/activities', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '20')
    const activities = await kv.get('user_activities') || []
    
    return c.json({ activities: activities.slice(0, limit) })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error fetching activities: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

// Get all registered users
app.get('/admin/users', async (c) => {
  try {
    const userKeys = await kv.getByPrefix('user:')
    const users = []
    
    for (const { value } of userKeys) {
      if (!value) continue
      
      // Get user SOS count
      const userSOS = await kv.get(`user_sos:${value.id}`) || []
      
      users.push({
        id: value.id,
        name: value.name,
        email: value.email,
        phone: value.phone,
        registeredAt: value.createdAt,
        isHelper: value.isHelper || false,
        isOnline: value.isOnline || false,
        sosCount: userSOS.length
      })
    }
    
    // Sort by registration date (newest first)
    users.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
    
    return c.json({ users })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error fetching users: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

// Get user SOS count
app.get('/admin/user/:userId/sos-count', async (c) => {
  try {
    const userId = c.req.param('userId')
    const userSOS = await kv.get(`user_sos:${userId}`) || []
    
    return c.json({ count: userSOS.length })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error fetching user SOS count: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

// Trigger emergency SOS with hopping
app.post('/admin/emergency-sos', async (c) => {
  try {
    const { userId, location, nearbyCommunity } = await c.req.json()
    
    // Create SOS
    const sosId = `sos_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    const sosData = {
      id: sosId,
      userId,
      type: 'EMERGENCY',
      timestamp: new Date().toISOString(),
      location,
      confidence: 100,
      status: 'ACTIVE',
      networkStage: 'CONTACT',
      networkUsed: 'PRIMARY',
      helpersAlerted: nearbyCommunity.length + 2, // community + police + trusted
      respondedBy: null,
      evidence: [],
      escalationLog: [{
        stage: 'INITIAL',
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        message: 'Emergency SOS triggered from admin panel'
      }]
    }
    
    await kv.set(`sos:${sosId}`, sosData)
    
    // Add to active SOS
    const activeSOS = await kv.get('active_sos') || []
    activeSOS.unshift(sosId)
    await kv.set('active_sos', activeSOS)
    
    // Create hops
    const hops = []
    
    // Auto-send to police
    const policeHop = {
      id: `hop_${Date.now()}_1`,
      sosId,
      recipientId: 'police-100',
      recipientName: 'Police Emergency (100)',
      recipientType: 'police',
      sentAt: new Date().toISOString(),
      status: 'delivered'
    }
    hops.push(policeHop)
    
    // Auto-send to trusted contact
    const contacts = await kv.get(`contacts:${userId}`) || []
    if (contacts.length > 0) {
      const trustedContact = contacts.sort((a, b) => a.priority - b.priority)[0]
      const trustedHop = {
        id: `hop_${Date.now()}_2`,
        sosId,
        recipientId: trustedContact.id,
        recipientName: `Trusted Contact: ${trustedContact.name}`,
        recipientType: 'trusted_contact',
        sentAt: new Date().toISOString(),
        status: 'delivered'
      }
      hops.push(trustedHop)
    }
    
    // Send to nearby community (hopping)
    nearbyCommunity.forEach((memberId, idx) => {
      hops.push({
        id: `hop_${Date.now()}_${idx + 3}`,
        sosId,
        recipientId: memberId,
        recipientName: `Community Member ${idx + 1}`,
        recipientType: 'community',
        sentAt: new Date().toISOString(),
        status: 'sent'
      })
    })
    
    await kv.set(`sos_hops:${sosId}`, hops)
    
    // Track activity
    const activity = {
      id: Date.now().toString(),
      userId,
      userName: 'Admin User',
      type: 'sos_trigger',
      message: 'Emergency SOS activated with hopping mechanism',
      timestamp: new Date().toISOString(),
      metadata: { sosId, hopsCount: hops.length }
    }
    
    const activities = await kv.get('user_activities') || []
    activities.unshift(activity)
    await kv.set('user_activities', activities.slice(0, 100)) // Keep last 100
    
    console.log(`Emergency SOS ${sosId} triggered with ${hops.length} hops`)
    
    return c.json({ sosId, hops, message: 'Emergency SOS triggered with hopping' })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error triggering emergency SOS: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

// Get SOS hops
app.get('/admin/sos/:sosId/hops', async (c) => {
  try {
    const sosId = c.req.param('sosId')
    const hops = await kv.get(`sos_hops:${sosId}`) || []
    
    return c.json({ hops })
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error fetching SOS hops: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

// Respond to SOS hop
app.post('/admin/sos-hop/:hopId/respond', async (c) => {
  try {
    const hopId = c.req.param('hopId')
    const { responderId } = await c.req.json()
    
    // Find the hop and update it
    const allHopKeys = await kv.getByPrefix('sos_hops:')
    for (const { key, value: hops } of allHopKeys) {
      if (!hops) continue
      
      const hopIndex = hops.findIndex((h: any) => h.id === hopId)
      
      if (hopIndex !== -1) {
        hops[hopIndex].status = 'responded'
        hops[hopIndex].respondedAt = new Date().toISOString()
        await kv.set(key, hops)
        
        return c.json({ message: 'Response recorded', hop: hops[hopIndex] })
      }
    }
    
    return c.json({ error: 'Hop not found' }, 404)
  } catch (error: unknown) {
    const msg = getErrorMessage(error)
    console.log(`Error responding to hop: ${msg}`)
    return c.json({ error: msg }, 500)
  }
})

// ============================================
// UTILITY FUNCTIONS
// ============================================

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

// ============================================
// START SERVER
// ============================================

Deno.serve(app.fetch)