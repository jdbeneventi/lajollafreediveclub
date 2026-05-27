-- ═══════════════════════════════════════════════════════════════════
-- LJFC Inquiries Pipeline — status workflow + parsed date ranges
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/bvfxmqysquthijsntbnh/sql
-- ═══════════════════════════════════════════════════════════════════

-- 1. Status enum
--    Lifecycle: new → replied → quoted → deposit_sent → paid → onboarded → completed
--    Terminal: declined, expired
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inquiry_status') THEN
    CREATE TYPE inquiry_status AS ENUM (
      'new',
      'replied',
      'quoted',
      'deposit_sent',
      'paid',
      'onboarded',
      'completed',
      'declined',
      'expired'
    );
  END IF;
END$$;

-- 2. Workflow columns on course_inquiries
ALTER TABLE course_inquiries
  ADD COLUMN IF NOT EXISTS status inquiry_status NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS parsed_start_date DATE,
  ADD COLUMN IF NOT EXISTS parsed_end_date DATE,
  ADD COLUMN IF NOT EXISTS linked_booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT FALSE;

-- 3. Indexes for the pipeline UI (status filter + date sort + email join)
CREATE INDEX IF NOT EXISTS idx_course_inquiries_status ON course_inquiries(status) WHERE archived = FALSE;
CREATE INDEX IF NOT EXISTS idx_course_inquiries_email ON course_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_course_inquiries_parsed_dates ON course_inquiries(parsed_start_date, parsed_end_date);

-- 4. Trigger: bump status_updated_at whenever status changes
CREATE OR REPLACE FUNCTION bump_inquiry_status_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.status_updated_at = NOW();
  END IF;
  IF NEW.status = 'replied' AND OLD.status != 'replied' AND NEW.replied_at IS NULL THEN
    NEW.replied_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_course_inquiries_status_update ON course_inquiries;
CREATE TRIGGER trg_course_inquiries_status_update
  BEFORE UPDATE ON course_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION bump_inquiry_status_updated_at();

-- 5. Backfill: existing rows get 'new' status (the DEFAULT handled it on ALTER, but be explicit)
UPDATE course_inquiries SET status = 'new' WHERE status IS NULL;

-- ═══════════════════════════════════════════════════════════════════
-- Notes for backfilling parsed_start_date / parsed_end_date:
-- These are best populated by the application layer (src/lib/parseDateRange.ts)
-- on read or via a one-off Node script. Leaving NULL is safe — the
-- conflict detector treats missing parsed dates as "unknown window".
-- ═══════════════════════════════════════════════════════════════════
