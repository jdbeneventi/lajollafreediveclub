-- ═══════════════════════════════════════════════════════════════════
-- LJFC Student Journey System — Supabase Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════════

-- 1. Student Progress — tracks individual requirement completion
CREATE TABLE IF NOT EXISTS student_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  requirement_id text NOT NULL,         -- e.g. "a2-prep", "prep-section-physiology", "a2-static"
  cert_level text NOT NULL,             -- e.g. "aida2"
  completed_at timestamptz NOT NULL DEFAULT now(),
  completed_by text,                    -- "student" (self-reported), "instructor" (Joshua marks it), "system" (auto from forms)
  notes text,                           -- optional instructor notes
  UNIQUE (student_id, requirement_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_student ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_cert ON student_progress(cert_level);

-- 2. Student Certifications — tracks earned certs
CREATE TABLE IF NOT EXISTS student_certifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  cert_level text NOT NULL,             -- "aida1", "aida2", "aida3", "aida4"
  certified_at timestamptz NOT NULL DEFAULT now(),
  aida_card_number text,                -- AIDA certification card number if issued
  instructor text DEFAULT 'Joshua Beneventi',
  notes text,
  UNIQUE (student_id, cert_level)
);

CREATE INDEX IF NOT EXISTS idx_certs_student ON student_certifications(student_id);

-- Done! The portal will now track:
--   • Prep guide section completion (prep-section-{id})
--   • Individual requirement sign-offs (a2-static, a2-exam, etc.)
--   • Earned certifications (aida2, aida3, etc.)
