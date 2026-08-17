-- ═══════════════════════════════════════════════════════════════════
-- LJFC Inquiry Intel — LLM-extracted facts on course_inquiries
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/bvfxmqysquthijsntbnh/sql
--
-- Purely additive. The site works with or without these columns:
-- src/lib/extractInquiryFacts.ts catches the unknown-column error and
-- logs it until this has been run, so deploy order doesn't matter.
--
-- Dates deliberately do NOT get new columns — extraction fills the
-- existing parsed_start_date / parsed_end_date (inquiries-pipeline.sql)
-- so the grouping engine, calendar panel, digest, and reply drafter all
-- benefit without changes. It only fills them where they are NULL;
-- values set by the regex parser or by hand are never overwritten.
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE course_inquiries
  -- How many people the inquiry actually covers ("just me" → 1,
  -- "me and my partner" → 2). NULL = extraction couldn't tell.
  ADD COLUMN IF NOT EXISTS parsed_headcount INTEGER,

  -- 'fixed' | 'flexible' | 'unknown' — whether their dates are firm.
  ADD COLUMN IF NOT EXISTS date_flexibility TEXT,

  -- Full extraction result + metadata:
  -- { facts: {...model output...}, model, extracted_at, source: 'insert'|'backfill'|'digest' }
  -- NULL = this row has not been through extraction yet (the backfill
  -- endpoint and the digest sweep key on this).
  ADD COLUMN IF NOT EXISTS ai_facts JSONB;
