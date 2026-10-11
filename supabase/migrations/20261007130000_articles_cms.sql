-- FILE: supabase/migrations/20261007130000_articles_cms.sql

-- Cẩm Nang CMS: public.articles is the single source of truth for guide content.
-- Does NOT touch Community tables/policies, user_roles, or has_role().
-- Safe to re-run (IF NOT EXISTS / DROP ... IF EXISTS / ON CONFLICT DO NOTHING).

CREATE TABLE IF NOT EXISTS public.articles (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text NOT NULL,
  title            text NOT NULL,
  excerpt          text NOT NULL DEFAULT '',
  category         text,
  cover_image_path text,
  content          text NOT NULL DEFAULT '',
  seo_title        text,
  seo_description  text,
  status           text NOT NULL DEFAULT 'draft',
  published_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT articles_slug_key UNIQUE (slug),
  CONSTRAINT articles_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(slug) <= 120),
  CONSTRAINT articles_status_check CHECK (status IN ('draft', 'published')),
  CONSTRAINT articles_cover_path_check CHECK (cover_image_path IS NULL OR cover_image_path LIKE 'covers/%'),
  CONSTRAINT articles_lengths_check CHECK (
    char_length(title) BETWEEN 1 AND 200
    AND char_length(excerpt) <= 500
    AND char_length(content) <= 200000
    AND (category IS NULL OR char_length(category) <= 60)
    AND (seo_title IS NULL OR char_length(seo_title) <= 120)
    AND (seo_description IS NULL OR char_length(seo_description) <= 320)
  ),
  CONSTRAINT articles_publish_ready_check CHECK (
    status <> 'published'
    OR (char_length(btrim(content)) > 0 AND char_length(btrim(excerpt)) > 0)
  )
);

CREATE INDEX IF NOT EXISTS articles_published_idx
  ON public.articles (published_at DESC) WHERE status = 'published';

CREATE OR REPLACE FUNCTION public.articles_before_write()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_at   := now();
    NEW.updated_at   := now();
    NEW.published_at := CASE WHEN NEW.status = 'published' THEN now() END;
  ELSE
    IF OLD.published_at IS NOT NULL AND NEW.slug IS DISTINCT FROM OLD.slug THEN
      RAISE EXCEPTION 'articles.slug is locked after first publication'
        USING ERRCODE = '23514';
    END IF;
    NEW.created_at   := OLD.created_at;
    NEW.updated_at   := now();
    NEW.published_at := COALESCE(
      OLD.published_at,
      CASE WHEN NEW.status = 'published' THEN now() END
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS articles_before_write ON public.articles;
CREATE TRIGGER articles_before_write
  BEFORE INSERT OR UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.articles_before_write();

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.articles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;

DROP POLICY IF EXISTS "Public can read published articles" ON public.articles;
CREATE POLICY "Public can read published articles" ON public.articles
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "Admin can read all articles" ON public.articles;
CREATE POLICY "Admin can read all articles" ON public.articles
  FOR SELECT TO authenticated
  USING (public.has_role((SELECT auth.uid()), 'admin'));

DROP POLICY IF EXISTS "Admin can insert articles" ON public.articles;
CREATE POLICY "Admin can insert articles" ON public.articles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'));

DROP POLICY IF EXISTS "Admin can update articles" ON public.articles;
CREATE POLICY "Admin can update articles" ON public.articles
  FOR UPDATE TO authenticated
  USING (public.has_role((SELECT auth.uid()), 'admin'))
  WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'));

DROP POLICY IF EXISTS "Admin can delete articles" ON public.articles;
CREATE POLICY "Admin can delete articles" ON public.articles
  FOR DELETE TO authenticated
  USING (public.has_role((SELECT auth.uid()), 'admin'));

INSERT INTO public.articles (slug, title, excerpt, status) VALUES
  ('cach-soi-den-ngoc',    'Cách soi đèn ngọc',     'Kỹ thuật cơ bản',           'draft'),
  ('phan-biet-type-a-b-c', 'Phân biệt Type A/B/C',  'Ngọc tự nhiên vs xử lý',    'draft'),
  ('danh-gia-mau-sac',     'Đánh giá màu sắc',      'Thang đo chuyên gia',       'draft'),
  ('chon-vong-phu-hop',    'Chọn vòng phù hợp',     'Theo kích cỡ & phong thủy', 'draft')
ON CONFLICT (slug) DO NOTHING;