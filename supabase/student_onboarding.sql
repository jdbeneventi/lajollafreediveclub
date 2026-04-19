-- Create student_onboarding table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/bvfxmqysquthijsntbnh/sql

CREATE TABLE IF NOT EXISTS student_onboarding (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  sex TEXT CHECK (sex IN ('male', 'female', 'other')),
  height_ft INTEGER CHECK (height_ft BETWEEN 3 AND 7),
  height_in INTEGER CHECK (height_in BETWEEN 0 AND 11),
  weight_lbs INTEGER CHECK (weight_lbs BETWEEN 50 AND 400),
  gear_owned JSONB DEFAULT '[]'::jsonb,
  theory_preference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_student_onboarding_student_id ON student_onboarding(student_id);
CREATE INDEX IF NOT EXISTS idx_student_onboarding_email ON student_onboarding(email);
