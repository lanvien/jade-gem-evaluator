ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;

DROP POLICY IF EXISTS "App visitors can read submissions" ON public.submissions;
CREATE POLICY "Read published or own submissions"
ON public.submissions FOR SELECT TO authenticated
USING (is_published = true OR user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Read own or posted jade-images" ON storage.objects;
CREATE POLICY "Read own or published jade-images"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'jade-images'
  AND (
    owner = (select auth.uid())
    OR name LIKE ('submissions/' || (select auth.uid())::text || '/%')
    OR name LIKE ('users/' || (select auth.uid())::text || '/%')
    OR EXISTS (
      SELECT 1 FROM public.submissions s
      WHERE s.is_published = true
        AND s.user_id IS NOT NULL
        AND storage.objects.name = ANY (s.image_urls)
    )
  )
);