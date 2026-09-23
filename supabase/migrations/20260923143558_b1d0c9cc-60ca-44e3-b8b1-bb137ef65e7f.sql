DROP POLICY IF EXISTS "Read community or own jade-images" ON storage.objects;

CREATE POLICY "Read own or posted jade-images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'jade-images'
  AND (
    owner = (select auth.uid())
    OR name LIKE ('submissions/' || (select auth.uid())::text || '/%')
    OR name LIKE ('users/' || (select auth.uid())::text || '/%')
    OR EXISTS (
      SELECT 1 FROM public.submissions s
      WHERE storage.objects.name = ANY (s.image_urls)
    )
  )
);