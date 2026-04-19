-- Gear catalog & student gear tables
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/bvfxmqysquthijsntbnh/sql

-- Admin-managed gear catalog
CREATE TABLE IF NOT EXISTS gear_catalog (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'essential' CHECK (category IN ('essential', 'recommended', 'optional')),
  description TEXT,
  rental_available BOOLEAN DEFAULT false,
  rental_note TEXT,
  course_levels TEXT[] DEFAULT '{"aida1","aida2","aida3","aida4"}',
  sort_order INTEGER DEFAULT 0,
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Per-student gear entries
CREATE TABLE IF NOT EXISTS student_gear (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  gear_id UUID NOT NULL REFERENCES gear_catalog(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'need' CHECK (status IN ('own', 'need', 'renting')),
  brand TEXT,
  size TEXT,
  condition TEXT CHECK (condition IS NULL OR condition IN ('new', 'good', 'fair', 'worn')),
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, gear_id)
);

CREATE INDEX IF NOT EXISTS idx_student_gear_student ON student_gear(student_id);
CREATE INDEX IF NOT EXISTS idx_gear_catalog_active ON gear_catalog(archived, sort_order);

-- Seed default gear items
INSERT INTO gear_catalog (slug, name, category, description, rental_available, rental_note, sort_order) VALUES
  ('wetsuit', '5mm Wetsuit', 'essential', 'Full-length 5mm neoprene wetsuit. A hood attached or separate is ideal for La Jolla water temps (58-72°F).', true, 'Available from local dive shops. We can help with sizing.', 1),
  ('hood', 'Hood', 'recommended', 'Neoprene hood, 3-5mm. Keeps you warm and comfortable, especially in winter/spring.', true, 'Some wetsuits have attached hoods.', 2),
  ('mask', 'Mask', 'essential', 'Low-volume freediving or diving mask. Must seal well around your face.', true, 'Available for rent. Bring your own if you have one that fits.', 3),
  ('snorkel', 'Snorkel', 'essential', 'Simple J-snorkel preferred. No purge valve or dry-top needed.', true, NULL, 4),
  ('fins', 'Fins', 'essential', 'Long-blade freediving fins or bi-fins. Not short scuba fins.', true, 'We have loaners available for courses.', 5),
  ('booties', 'Booties', 'recommended', 'Neoprene booties, 3-5mm. Protect your feet and keep you warm.', true, NULL, 6),
  ('gloves', 'Gloves', 'optional', 'Neoprene gloves, 2-3mm. Nice to have in colder months but not required.', false, NULL, 7),
  ('weight_belt', 'Weight Belt', 'essential', 'Rubber or nylon weight belt with quick-release buckle. Rubber preferred for freediving.', true, 'We provide weights and belts for courses.', 8),
  ('weights', 'Weights', 'essential', 'Lead weights sized to your body and wetsuit. We''ll help determine the right amount.', true, 'We provide weights for courses.', 9),
  ('dive_computer', 'Dive Computer', 'optional', 'Freediving watch/computer that tracks depth, time, and surface intervals. Not required for AIDA 1.', false, NULL, 10),
  ('lanyard', 'Safety Lanyard', 'optional', 'Attaches you to the dive line during training. Required for Saturday sessions, provided during courses.', false, 'Required for Saturday line diving. We have loaners.', 11),
  ('nose_clip', 'Nose Clip', 'optional', 'Frenzel equalization training aid. Not needed for beginners.', false, NULL, 12)
ON CONFLICT (slug) DO NOTHING;
