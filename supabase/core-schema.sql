-- ═══════════════════════════════════════════════════════════════════
-- LJFC core schema — reconstructed 2026-08-13 from the live database
-- (PostgREST OpenAPI introspection). These 5 tables were created in the
-- Supabase dashboard and previously had no definition in the repo.
--
-- Captures: columns, types, defaults, NOT NULL, primary keys, foreign keys.
-- Does NOT capture: indexes, RLS policies, triggers, CHECK constraints.
-- Verify against the dashboard before relying on this for a rebuild.
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS students (
  id uuid DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  email text NOT NULL,
  first_name text,
  last_name text,
  phone text,
  date_of_birth text,
  magic_token text,
  magic_token_expires timestamp with time zone,
  last_login timestamp with time zone,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  student_id uuid,
  email text NOT NULL,
  course text NOT NULL,
  course_dates text,
  status text DEFAULT 'confirmed',
  payment_status text DEFAULT 'unpaid',
  payment_amount integer,
  deposit_paid integer,
  stripe_session_id text,
  notes text,
  event_id uuid,
  PRIMARY KEY (id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (event_id) REFERENCES calendar_events(id)
);

CREATE TABLE IF NOT EXISTS course_inquiries (
  id uuid DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  course text NOT NULL,
  experience text,
  preferred_dates text,
  group_size text,
  message text,
  status text DEFAULT 'new',
  status_updated_at timestamp with time zone NOT NULL DEFAULT now(),
  replied_at timestamp with time zone,
  admin_notes text,
  parsed_start_date date,
  parsed_end_date date,
  linked_booking_id uuid,
  archived boolean NOT NULL DEFAULT false,
  PRIMARY KEY (id),
  FOREIGN KEY (linked_booking_id) REFERENCES bookings(id)
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'course',
  date date NOT NULL,
  end_date date,
  time text,
  description text,
  price text,
  spots text,
  href text,
  recurring text,
  guest_org text,
  seasonal boolean DEFAULT false,
  active boolean DEFAULT true,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS aida_forms (
  id uuid DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  email text NOT NULL,
  full_name text NOT NULL,
  date_of_birth text,
  phone text,
  form_type text NOT NULL,
  course text,
  medical_answers jsonb,
  medical_details text,
  physician_required boolean DEFAULT false,
  physician_cleared boolean DEFAULT false,
  is_minor boolean DEFAULT false,
  guardian_name text,
  signed_at timestamp with time zone,
  signature_data text,
  physician_clearance_file_url text,
  PRIMARY KEY (id)
);

