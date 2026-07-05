import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from '../../../utils/supabase/info'

let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = `https://${projectId}.supabase.co`
  
  console.log('🔧 Initializing Supabase Client')
  console.log('📍 Supabase URL:', supabaseUrl)
  console.log('🔑 Has Anon Key:', !!publicAnonKey)
  
  supabaseInstance = createSupabaseClient(supabaseUrl, publicAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })

  return supabaseInstance
}