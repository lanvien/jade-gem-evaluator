-- FILE: supabase/migrations/20261007130100_articles_bucket.sql

-- Cẩm Nang cover images: public bucket, admin-only writes.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('articles', 'articles', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Admin can upload article covers" ON storage.objects;
CREATE POLICY "Admin can upload article covers" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'articles'
    AND name LIKE 'covers/%'
    AND public.has_role((SELECT auth.uid()), 'admin')
  );

DROP POLICY IF EXISTS "Admin can read article covers" ON storage.objects;
CREATE POLICY "Admin can read article covers" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'articles' AND public.has_role((SELECT auth.uid()), 'admin'));

DROP POLICY IF EXISTS "Admin can delete article covers" ON storage.objects;
CREATE POLICY "Admin can delete article covers" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'articles' AND public.has_role((SELECT auth.uid()), 'admin'));