-- Storage policies for case-images (public read, admin write) and
-- payment-screenshots (owner read, owner upload, admin read all).
-- Uses the public.is_admin() SECURITY DEFINER helper to avoid RLS recursion.

-- ===== case-images bucket =====
DROP POLICY IF EXISTS "case_images_read_all" ON storage.objects;
CREATE POLICY "case_images_read_all" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'case-images');

DROP POLICY IF EXISTS "case_images_write_admin" ON storage.objects;
CREATE POLICY "case_images_write_admin" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'case-images' AND public.is_admin());

DROP POLICY IF EXISTS "case_images_update_admin" ON storage.objects;
CREATE POLICY "case_images_update_admin" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'case-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'case-images' AND public.is_admin());

DROP POLICY IF EXISTS "case_images_delete_admin" ON storage.objects;
CREATE POLICY "case_images_delete_admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'case-images' AND public.is_admin());

-- ===== payment-screenshots bucket =====
-- Owners can read their own screenshots (path prefix = their user id).
DROP POLICY IF EXISTS "pay_shots_read_own" ON storage.objects;
CREATE POLICY "pay_shots_read_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'payment-screenshots' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin()));

-- Owners can upload into a folder named after their uid.
DROP POLICY IF EXISTS "pay_shots_write_own" ON storage.objects;
CREATE POLICY "pay_shots_write_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'payment-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Owners can update their own.
DROP POLICY IF EXISTS "pay_shots_update_own" ON storage.objects;
CREATE POLICY "pay_shots_update_own" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'payment-screenshots' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'payment-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admins can read all screenshots.
DROP POLICY IF EXISTS "pay_shots_read_admin" ON storage.objects;
CREATE POLICY "pay_shots_read_admin" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'payment-screenshots' AND public.is_admin());
