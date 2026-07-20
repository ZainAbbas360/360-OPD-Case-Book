-- Add publish/free toggle columns and screenshot support to the cases and payment_requests tables.
-- These let the admin CMS control visibility and access tier per case without code changes,
-- and let users attach a payment screenshot to their payment request.

-- cases: is_published controls whether a case appears in the public catalog (default true
-- so existing seeded cases remain visible). is_free controls whether a case is readable
-- by non-premium users (default false — existing cases are premium content).
ALTER TABLE public.cases
  ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_free boolean NOT NULL DEFAULT false;

-- payment_requests: optional screenshot path in Supabase Storage.
ALTER TABLE public.payment_requests
  ADD COLUMN IF NOT EXISTS screenshot_path text;

-- Helpful indexes for catalog browsing and admin filtering.
CREATE INDEX IF NOT EXISTS idx_cases_specialty ON public.cases (specialty);
CREATE INDEX IF NOT EXISTS idx_cases_is_published ON public.cases (is_published);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payment_requests (status);
