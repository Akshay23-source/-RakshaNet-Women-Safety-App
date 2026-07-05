/**
 * Supabase Database Setup for RakshaNet
 * 
 * Run this SQL script in your Supabase SQL Editor to create all required tables.
 * 
 * Go to: https://app.supabase.com → Your Project → SQL Editor → New Query
 * Paste this entire script and click "Run"
 */

-- ============================================
-- 1. LOCATION UPDATES TABLE
-- ============================================
-- Stores real-time GPS location updates during active SOS alerts

CREATE TABLE IF NOT EXISTS public.location_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sos_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION,
  speed DOUBLE PRECISION,
  heading DOUBLE PRECISION,
  address TEXT,
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_location_updates_sos_id 
  ON public.location_updates(sos_id);

CREATE INDEX IF NOT EXISTS idx_location_updates_timestamp 
  ON public.location_updates(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_location_updates_user_id 
  ON public.location_updates(user_id);

-- Add comment to table
COMMENT ON TABLE public.location_updates IS 'Stores GPS location updates for live tracking during SOS alerts';

-- ============================================
-- 2. LIVE TRACKING SESSIONS TABLE
-- ============================================
-- Tracks active live location sharing sessions

CREATE TABLE IF NOT EXISTS public.live_tracking_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sos_id TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  last_update_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  total_updates INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tracking_sessions_sos_id 
  ON public.live_tracking_sessions(sos_id);

CREATE INDEX IF NOT EXISTS idx_tracking_sessions_active 
  ON public.live_tracking_sessions(is_active);

CREATE INDEX IF NOT EXISTS idx_tracking_sessions_user_id 
  ON public.live_tracking_sessions(user_id);

-- Add comment
COMMENT ON TABLE public.live_tracking_sessions IS 'Manages live location tracking sessions for SOS alerts';

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on both tables
ALTER TABLE public.location_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_tracking_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. RLS POLICIES FOR LOCATION_UPDATES
-- ============================================

-- Drop existing policies if they exist (to allow re-running this script)
DROP POLICY IF EXISTS "Users can insert their own location updates" ON public.location_updates;
DROP POLICY IF EXISTS "Anyone can read location updates" ON public.location_updates;
DROP POLICY IF EXISTS "Service role can do anything" ON public.location_updates;

-- Policy: Users can insert their own location updates
CREATE POLICY "Users can insert their own location updates"
  ON public.location_updates
  FOR INSERT
  WITH CHECK (
    auth.uid()::text = user_id 
    OR 
    auth.role() = 'anon'  -- Allow anonymous users for emergency situations
  );

-- Policy: Anyone can read location updates (for emergency contacts to track)
CREATE POLICY "Anyone can read location updates"
  ON public.location_updates
  FOR SELECT
  USING (true);

-- Policy: Service role can do anything
CREATE POLICY "Service role can do anything"
  ON public.location_updates
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 5. RLS POLICIES FOR LIVE_TRACKING_SESSIONS
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own tracking sessions" ON public.live_tracking_sessions;
DROP POLICY IF EXISTS "Anyone can read tracking sessions" ON public.live_tracking_sessions;
DROP POLICY IF EXISTS "Users can update their own tracking sessions" ON public.live_tracking_sessions;
DROP POLICY IF EXISTS "Service role can do anything sessions" ON public.live_tracking_sessions;

-- Policy: Users can create their own tracking sessions
CREATE POLICY "Users can create their own tracking sessions"
  ON public.live_tracking_sessions
  FOR INSERT
  WITH CHECK (
    auth.uid()::text = user_id
    OR
    auth.role() = 'anon'  -- Allow anonymous for emergency
  );

-- Policy: Anyone can read tracking sessions
CREATE POLICY "Anyone can read tracking sessions"
  ON public.live_tracking_sessions
  FOR SELECT
  USING (true);

-- Policy: Users can update their own tracking sessions
CREATE POLICY "Users can update their own tracking sessions"
  ON public.live_tracking_sessions
  FOR UPDATE
  USING (
    auth.uid()::text = user_id
    OR
    auth.role() = 'anon'
  );

-- Policy: Service role full access
CREATE POLICY "Service role can do anything sessions"
  ON public.live_tracking_sessions
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 6. REALTIME SUBSCRIPTIONS
-- ============================================

-- Enable realtime for live location updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.location_updates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_tracking_sessions;

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Function to increment total_updates counter
CREATE OR REPLACE FUNCTION public.increment_tracking_updates(p_sos_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.live_tracking_sessions
  SET total_updates = total_updates + 1,
      last_update_at = NOW()
  WHERE sos_id = p_sos_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get active tracking sessions
CREATE OR REPLACE FUNCTION public.get_active_tracking_sessions()
RETURNS TABLE (
  sos_id TEXT,
  user_name TEXT,
  started_at TIMESTAMPTZ,
  total_updates INTEGER,
  last_location JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lts.sos_id,
    lts.user_name,
    lts.started_at,
    lts.total_updates,
    jsonb_build_object(
      'latitude', lu.latitude,
      'longitude', lu.longitude,
      'timestamp', lu.timestamp
    ) as last_location
  FROM public.live_tracking_sessions lts
  LEFT JOIN LATERAL (
    SELECT latitude, longitude, timestamp
    FROM public.location_updates
    WHERE sos_id = lts.sos_id
    ORDER BY timestamp DESC
    LIMIT 1
  ) lu ON true
  WHERE lts.is_active = true
  ORDER BY lts.started_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. CLEANUP OLD DATA (OPTIONAL)
-- ============================================

-- Function to cleanup old location updates (older than 30 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_location_data()
RETURNS void AS $$
BEGIN
  DELETE FROM public.location_updates
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  DELETE FROM public.live_tracking_sessions
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND is_active = false;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables exist
SELECT 
  schemaname, 
  tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('location_updates', 'live_tracking_sessions');

-- Check RLS status
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('location_updates', 'live_tracking_sessions');

-- Check policies
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('location_updates', 'live_tracking_sessions')
ORDER BY tablename, policyname;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ RakshaNet database setup completed successfully!';
  RAISE NOTICE '✅ Tables created: location_updates, live_tracking_sessions';
  RAISE NOTICE '✅ Indexes created for optimal performance';
  RAISE NOTICE '✅ Row Level Security enabled';
  RAISE NOTICE '✅ Realtime subscriptions enabled';
  RAISE NOTICE '📋 Run verification queries above to confirm setup';
END $$;
