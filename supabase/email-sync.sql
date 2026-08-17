-- ═══════════════════════════════════════════════════════════════════
-- LJFC Email Sync — Gmail thread awareness on course_inquiries
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/bvfxmqysquthijsntbnh/sql
--
-- Purely additive; the site works with or without these columns
-- (src/lib/gmailSync.ts logs and skips until they exist).
--
-- Filled by the IMAP sync of Joshua's personal Gmail: the newest email
-- SEEN FROM each active inquiry's address (inbound) and the newest email
-- Joshua SENT TO it (outbound). The digest turns the pair into
-- "waiting on you" / "already answered via Gmail" chips, and the sync
-- auto-advances status new → replied when an outbound postdates the
-- inquiry. Timestamps are data, not state — nothing else keys on them.
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE course_inquiries
  ADD COLUMN IF NOT EXISTS last_email_in_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_email_out_at TIMESTAMPTZ;
