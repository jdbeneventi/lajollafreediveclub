-- ═══════════════════════════════════════════════════════════════════
-- LJFC Course Management — Link bookings to calendar events
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════════

-- Add event_id to bookings (nullable — existing bookings keep working)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS event_id uuid REFERENCES calendar_events(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
