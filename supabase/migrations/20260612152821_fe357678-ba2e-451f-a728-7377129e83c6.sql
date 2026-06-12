
-- Submissions
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  description TEXT,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.submissions TO anon, authenticated;
GRANT ALL ON public.submissions TO service_role;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read submissions" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert submissions" ON public.submissions FOR INSERT WITH CHECK (true);

-- Comments
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX comments_submission_id_idx ON public.comments(submission_id);
GRANT SELECT, INSERT ON public.comments TO anon, authenticated;
GRANT ALL ON public.comments TO service_role;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert comments" ON public.comments FOR INSERT WITH CHECK (true);

-- Cop Ngoc (jade vault, guest session-based)
CREATE TABLE public.cop_ngoc (
  session_id UUID PRIMARY KEY,
  cop_code TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cop_ngoc TO anon, authenticated;
GRANT ALL ON public.cop_ngoc TO service_role;
ALTER TABLE public.cop_ngoc ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read cop_ngoc" ON public.cop_ngoc FOR SELECT USING (true);
CREATE POLICY "Anyone can insert cop_ngoc" ON public.cop_ngoc FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update cop_ngoc" ON public.cop_ngoc FOR UPDATE USING (true) WITH CHECK (true);
