-- Onboarding v2 — add new columns for 3-step flow
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/bvfxmqysquthijsntbnh/sql

ALTER TABLE student_onboarding
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS pronouns TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT,
  ADD COLUMN IF NOT EXISTS swim_ability TEXT,
  ADD COLUMN IF NOT EXISTS swim_200m_no_fins TEXT,
  ADD COLUMN IF NOT EXISTS freediving_experience TEXT,
  ADD COLUMN IF NOT EXISTS breath_hold_bucket TEXT,
  ADD COLUMN IF NOT EXISTS deepest_dive_bucket TEXT,
  ADD COLUMN IF NOT EXISTS shoe_size_us NUMERIC(3,1),
  ADD COLUMN IF NOT EXISTS shirt_size TEXT,
  ADD COLUMN IF NOT EXISTS fears TEXT[],
  ADD COLUMN IF NOT EXISTS goals TEXT[],
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Add physician_clearance_file_url to aida_forms for Ticket 6
ALTER TABLE aida_forms
  ADD COLUMN IF NOT EXISTS physician_clearance_file_url TEXT;
