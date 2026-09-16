
-- 1. Ownership columns
ALTER TABLE public.cop_ngoc ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();
CREATE INDEX IF NOT EXISTS cop_ngoc_user_id_idx ON public.cop_ngoc(user_id);

-- 2. cop_ngoc policies: owner-only
DROP POLICY IF EXISTS "Anyone can read cop_ngoc" ON public.cop_ngoc;
DROP POLICY IF EXISTS "Anyone can insert cop_ngoc" ON public.cop_ngoc;
DROP POLICY IF EXISTS "Anyone can update cop_ngoc" ON public.cop_ngoc;

REVOKE ALL ON public.cop_ngoc FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cop_ngoc TO authenticated;
GRANT ALL ON public.cop_ngoc TO service_role;

CREATE POLICY "Owner can read own cop_ngoc" ON public.cop_ngoc
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Owner can insert own cop_ngoc" ON public.cop_ngoc
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Owner can update own cop_ngoc" ON public.cop_ngoc
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Owner can delete own cop_ngoc" ON public.cop_ngoc
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- 3. Claim helpers (SECURITY DEFINER) so existing saved data is not lost
CREATE OR REPLACE FUNCTION public.claim_cop_by_session(p_session uuid)
RETURNS SETOF public.cop_ngoc
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR p_session IS NULL THEN
    RETURN;
  END IF;
  RETURN QUERY
  UPDATE public.cop_ngoc
     SET user_id = auth.uid(), updated_at = now()
   WHERE session_id = p_session AND user_id IS NULL
  RETURNING *;
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_cop_by_code(p_code text)
RETURNS SETOF public.cop_ngoc
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR p_code IS NULL THEN
    RETURN;
  END IF;
  RETURN QUERY
  UPDATE public.cop_ngoc
     SET user_id = auth.uid(), updated_at = now()
   WHERE cop_code = upper(trim(p_code))
  RETURNING *;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_cop_by_session(uuid) FROM public, anon;
REVOKE ALL ON FUNCTION public.claim_cop_by_code(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.claim_cop_by_session(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_cop_by_code(text) TO authenticated;

-- 4. Community content: public read, authenticated & self-owned writes
DROP POLICY IF EXISTS "Anyone can insert submissions" ON public.submissions;
DROP POLICY IF EXISTS "Anyone can insert comments" ON public.comments;

REVOKE INSERT, UPDATE, DELETE ON public.submissions FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.comments FROM anon;
GRANT SELECT ON public.submissions TO anon, authenticated;
GRANT SELECT ON public.comments TO anon, authenticated;
GRANT INSERT ON public.submissions TO authenticated;
GRANT INSERT ON public.comments TO authenticated;
GRANT ALL ON public.submissions TO service_role;
GRANT ALL ON public.comments TO service_role;

CREATE POLICY "Signed identities can insert submissions" ON public.submissions
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Signed identities can insert comments" ON public.comments
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- 5. Storage: jade-images
DROP POLICY IF EXISTS "Anyone can read jade-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to jade-images" ON storage.objects;

CREATE POLICY "Read community or own jade-images" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'jade-images'
    AND (
      name LIKE 'submissions/%'
      OR name LIKE ('users/' || auth.uid()::text || '/%')
      OR owner = auth.uid()
    )
  );

CREATE POLICY "Upload into own jade-images path" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'jade-images'
    AND owner = auth.uid()
    AND (
      name LIKE ('submissions/' || auth.uid()::text || '/%')
      OR name LIKE ('users/' || auth.uid()::text || '/%')
    )
  );

CREATE POLICY "Update own jade-images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'jade-images' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'jade-images' AND owner = auth.uid());

CREATE POLICY "Delete own jade-images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'jade-images' AND owner = auth.uid());
