CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Submissions
DROP POLICY IF EXISTS "Read published or own submissions" ON public.submissions;
CREATE POLICY "Read published, own, or admin" ON public.submissions
  FOR SELECT TO authenticated
  USING (is_published = true OR user_id = (SELECT auth.uid()) OR public.has_role((SELECT auth.uid()), 'admin'));

REVOKE UPDATE ON public.submissions FROM authenticated;
GRANT UPDATE (is_published) ON public.submissions TO authenticated;
GRANT DELETE ON public.submissions TO authenticated;
CREATE POLICY "Admin can hide or unhide" ON public.submissions
  FOR UPDATE TO authenticated
  USING (public.has_role((SELECT auth.uid()), 'admin'))
  WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'));
CREATE POLICY "Admin can delete submissions" ON public.submissions
  FOR DELETE TO authenticated
  USING (public.has_role((SELECT auth.uid()), 'admin'));

-- Comments follow post visibility; removed with the post
DROP POLICY IF EXISTS "App visitors can read comments" ON public.comments;
CREATE POLICY "Read comments of visible posts" ON public.comments
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = comments.submission_id));
ALTER TABLE public.comments DROP CONSTRAINT comments_submission_id_fkey;
ALTER TABLE public.comments ADD CONSTRAINT comments_submission_id_fkey
  FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON DELETE CASCADE;

-- Storage: admin can read and delete community photos
CREATE POLICY "Admin can read jade-images" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'jade-images' AND public.has_role((SELECT auth.uid()), 'admin'));
CREATE POLICY "Admin can delete jade-images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'jade-images' AND public.has_role((SELECT auth.uid()), 'admin'));