/*
# Medical Casebook — Subscription App Schema

## Overview
Creates the data model for a subscription-based medical case book web app:
- Authenticated users can sign up / log in.
- Users browse a catalog of medical cases (title + specialty + excerpt are public).
- Full case content is gated behind a one-time lifetime premium access purchase (Rs 7000).
- Users submit a payment request (bank transfer reference) which an admin verifies.
- Once approved, the user's `profiles.is_premium` flag is set true and they unlock all cases.
- An admin role is determined by `profiles.is_admin`.

## Tables

### profiles
- `id` (uuid, PK, references auth.users) — one row per user, created on signup via trigger.
- `email` (text) — denormalized for convenience.
- `full_name` (text) — display name.
- `is_premium` (bool, default false) — unlocks full case content when true.
- `is_admin` (bool, default false) — admin approval panel access.
- `premium_since` (timestamptz, nullable) — when premium access was granted.
- `created_at` (timestamptz).

### cases
- `id` (uuid, PK).
- `title` (text) — case title.
- `specialty` (text) — e.g. Cardiology, Neurology.
- `patient_age` (int) — patient age.
- `patient_gender` (text) — male/female/other.
- `chief_complaint` (text) — presenting complaint.
- `excerpt` (text) — short public preview (visible to non-premium users).
- `history` (text) — full history (premium).
- `examination` (text) — examination findings (premium).
- `investigations` (text) — lab/imaging (premium).
- `diagnosis` (text) — final diagnosis (premium).
- `management` (text) — treatment plan (premium).
- `discussion` (text) — teaching points (premium).
- `image_url` (text, nullable) — optional clinical image.
- `created_at` (timestamptz).

### payment_requests
- `id` (uuid, PK).
- `user_id` (uuid, references profiles, owner).
- `amount` (numeric) — amount paid (Rs 7000).
- `method` (text) — 'Bank Transfer' / 'JazzCash' etc.
- `reference` (text) — transaction/bank transfer reference submitted by user.
- `status` (text) — 'pending' | 'approved' | 'rejected'.
- `reviewed_by` (uuid, nullable) — admin who reviewed.
- `reviewed_at` (timestamptz, nullable).
- `created_at` (timestamptz).

## Security (RLS)
- profiles: each user reads/updates only their own row. Admins read all profiles and update is_premium/is_admin.
- cases: SELECT public to anon+authenticated (catalog is browsable). INSERT/UPDATE/DELETE admin-only.
- payment_requests: users read their own; insert their own; admin reads all + updates status.

## Notes
1. A trigger `handle_new_user` creates a profiles row on auth.users insert.
2. The first signed-up user is NOT auto-admin; an admin must be set via SQL for the demo. A helper note is included.
3. All policies use auth.uid(); no current_user.
*/

-- profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  is_premium boolean NOT NULL DEFAULT false,
  is_admin boolean NOT NULL DEFAULT false,
  premium_since timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile (to grant premium / admin). Separate policy.
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

-- cases table
CREATE TABLE IF NOT EXISTS public.cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  specialty text NOT NULL,
  patient_age int,
  patient_gender text,
  chief_complaint text,
  excerpt text NOT NULL,
  history text,
  examination text,
  investigations text,
  diagnosis text,
  management text,
  discussion text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- Catalog is publicly browsable (anon + authenticated can SELECT).
DROP POLICY IF EXISTS "cases_select_all" ON public.cases;
CREATE POLICY "cases_select_all" ON public.cases
  FOR SELECT TO anon, authenticated USING (true);

-- Only admins can modify cases.
DROP POLICY IF EXISTS "cases_insert_admin" ON public.cases;
CREATE POLICY "cases_insert_admin" ON public.cases
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

DROP POLICY IF EXISTS "cases_update_admin" ON public.cases;
CREATE POLICY "cases_update_admin" ON public.cases
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

DROP POLICY IF EXISTS "cases_delete_admin" ON public.cases;
CREATE POLICY "cases_delete_admin" ON public.cases
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

-- payment_requests table
CREATE TABLE IF NOT EXISTS public.payment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 7000,
  method text NOT NULL DEFAULT 'Bank Transfer',
  reference text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments_select_own_or_admin" ON public.payment_requests;
CREATE POLICY "payments_select_own_or_admin" ON public.payment_requests
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

DROP POLICY IF EXISTS "payments_insert_own" ON public.payment_requests;
CREATE POLICY "payments_insert_own" ON public.payment_requests
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "payments_update_admin" ON public.payment_requests;
CREATE POLICY "payments_update_admin" ON public.payment_requests
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

-- Trigger: create a profiles row whenever a new auth.users row is inserted.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
