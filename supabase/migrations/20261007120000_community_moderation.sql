-- Community moderation: tighten the two INSERT policies only.
-- No schema, grant, or storage-policy changes. Safe to re-run.

-- 1. Posts: every image path must live under the poster's own uid folder.
--    Blocks "path injection" (a new post pointing at someone else's photo, which
--    would keep that photo public after the original post is hidden).
--    NOT EXISTS (instead of bool_and) so a post with zero images stays valid.
DROP POLICY IF EXISTS "Signed identities can insert submissions" ON public.submissions;
CREATE POLICY "Signed identities can insert submissions" ON public.submissions
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND NOT EXISTS (
      SELECT 1 FROM unnest(submissions.image_urls) AS u
      WHERE u NOT LIKE 'submissions/' || (SELECT auth.uid())::text || '/%'
        AND u NOT LIKE 'users/' || (SELECT auth.uid())::text || '/%'
    )
  );

-- 2. Comments: the post must be visible to the commenter under RLS
--    (published, own, or admin), so nobody can comment on a hidden post.
DROP POLICY IF EXISTS "Signed identities can insert comments" ON public.comments;
CREATE POLICY "Signed identities can insert comments" ON public.comments
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.submissions s
      WHERE s.id = comments.submission_id
    )
  );
