-- Root cause: profiles_select_own policy subqueries profiles inside its own RLS policy,
-- causing infinite recursion (PostgreSQL error: "infinite recursion detected in policy
-- for relation profiles"). loadProfile() silently fails -> profile stays null -> every
-- user is treated as free, and admin checks never pass.
--
-- Fix: a SECURITY DEFINER helper that reads is_admin while bypassing RLS (owned by the
-- postgres role, which bypasses RLS). All policies reference is_admin() instead of
-- EXISTS (SELECT 1 FROM profiles ...), eliminating the self-reference.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT p.is_admin FROM public.profiles p WHERE p.id = auth.uid()),
    false
  );
$$;

-- profiles: users read their own row; admins read all rows.
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.is_admin());

-- profiles: users update their own row.
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- profiles: admins can update any row (grant premium / admin).
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- cases: public read; admin-only write.
DROP POLICY IF EXISTS "cases_select_all" ON public.cases;
CREATE POLICY "cases_select_all" ON public.cases
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "cases_insert_admin" ON public.cases;
CREATE POLICY "cases_insert_admin" ON public.cases
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "cases_update_admin" ON public.cases;
CREATE POLICY "cases_update_admin" ON public.cases
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "cases_delete_admin" ON public.cases;
CREATE POLICY "cases_delete_admin" ON public.cases
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- payment_requests: owner or admin read; owner insert; admin update.
DROP POLICY IF EXISTS "payments_select_own_or_admin" ON public.payment_requests;
CREATE POLICY "payments_select_own_or_admin" ON public.payment_requests
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "payments_insert_own" ON public.payment_requests;
CREATE POLICY "payments_insert_own" ON public.payment_requests
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "payments_update_admin" ON public.payment_requests;
CREATE POLICY "payments_update_admin" ON public.payment_requests
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
