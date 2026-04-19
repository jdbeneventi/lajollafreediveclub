-- One-time migration: fix AIDA 1 prep progress rows
-- These were written as 'prep-section-*' (AIDA 2 prefix) instead of 'prep-aida1-section-*'
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/bvfxmqysquthijsntbnh/sql

-- Step 1: Identify affected rows — AIDA 1 students with prep-section-* rows
-- (AIDA 1 students are those whose most recent booking contains 'aida 1', 'aida1', or 'discover')
WITH aida1_students AS (
  SELECT DISTINCT b.email, s.id as student_id
  FROM bookings b
  JOIN students s ON s.email = b.email
  WHERE LOWER(b.course) LIKE '%aida 1%'
     OR LOWER(b.course) LIKE '%aida1%'
     OR LOWER(b.course) LIKE '%discover%'
),
misfiled AS (
  SELECT sp.id, sp.student_id, sp.requirement_id,
         REPLACE(sp.requirement_id, 'prep-section-', 'prep-aida1-section-') AS new_requirement_id
  FROM student_progress sp
  JOIN aida1_students a1 ON sp.student_id = a1.student_id
  WHERE sp.requirement_id LIKE 'prep-section-%'
)
-- Preview first (comment out the UPDATE and uncomment this):
-- SELECT * FROM misfiled;

-- Step 2: Update the rows
UPDATE student_progress sp
SET requirement_id = REPLACE(sp.requirement_id, 'prep-section-', 'prep-aida1-section-'),
    cert_level = 'aida1'
FROM aida1_students a1
WHERE sp.student_id = a1.student_id
  AND sp.requirement_id LIKE 'prep-section-%';

-- Step 3: Fix any spurious a2-prep completion from AIDA 1 students
DELETE FROM student_progress sp
USING aida1_students a1
WHERE sp.student_id = a1.student_id
  AND sp.requirement_id = 'a2-prep';
