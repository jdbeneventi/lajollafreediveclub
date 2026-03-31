-- LJFC Camp Registrations
-- Run this in your Supabase SQL editor: https://supabase.com/dashboard/project/bvfxmqysquthijsntbnh/sql

CREATE TABLE camp_registrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),

  -- Student
  student_first_name text NOT NULL,
  student_last_name text NOT NULL,
  student_age integer,
  student_grade text,
  swimming_ability text,

  -- Session
  session_id text,
  session_name text,
  session_dates text,
  session_price integer,

  -- Parent / Guardian
  parent_name text NOT NULL,
  parent_email text NOT NULL,
  parent_phone text,

  -- Emergency Contact
  emergency_name text,
  emergency_phone text,
  emergency_relation text,

  -- Medical
  allergies text,
  medications text,
  medical_conditions text,
  dietary_restrictions text,

  -- Charter
  is_charter_family boolean DEFAULT false,
  charter_school_name text,
  charter_teacher_name text,
  charter_teacher_email text,

  -- Meta
  hear_about text,
  waiver_completed boolean DEFAULT false,
  payment_received boolean DEFAULT false,
  notes text,
  status text DEFAULT 'registered'
);

-- Indexes
CREATE INDEX idx_camp_reg_email ON camp_registrations(parent_email);
CREATE INDEX idx_camp_reg_session ON camp_registrations(session_id);
CREATE INDEX idx_camp_reg_status ON camp_registrations(status);
CREATE INDEX idx_camp_reg_created ON camp_registrations(created_at DESC);

-- RLS
ALTER TABLE camp_registrations ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access (server-side API routes)
CREATE POLICY "Service role full access" ON camp_registrations
  FOR ALL USING (auth.role() = 'service_role');
