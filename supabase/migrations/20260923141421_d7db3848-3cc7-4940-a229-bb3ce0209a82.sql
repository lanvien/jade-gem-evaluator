DROP POLICY IF EXISTS "Anyone can read submissions" ON public.submissions;
DROP POLICY IF EXISTS "Anyone can read comments" ON public.comments;

CREATE POLICY "App visitors can read submissions"
ON public.submissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "App visitors can read comments"
ON public.comments FOR SELECT TO authenticated USING (true);

REVOKE SELECT ON public.submissions FROM anon;
REVOKE SELECT ON public.comments FROM anon;

GRANT SELECT ON public.submissions TO authenticated;
GRANT SELECT ON public.comments TO authenticated;