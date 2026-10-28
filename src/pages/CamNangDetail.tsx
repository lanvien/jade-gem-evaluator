import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import ArticleContent from "@/components/ArticleContent";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { supabase } from "@/integrations/supabase/client";
import { coverPublicUrl } from "@/lib/articles";

const SITE = "https://hieungoc.lovable.app";

const CamNangDetail = () => {
  const { slug = "" } = useParams<{ slug: string }>();

  const { data: article, isLoading, isError, refetch } = useQuery({
    queryKey: ["articles", "detail", slug],
    queryFn: async () => {
      // Chỉ lấy bài đã xuất bản; bản nháp không bao giờ hiện ở trang công khai.
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const shell = (children: React.ReactNode) => (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-10 md:py-14">{children}</main>
    </div>
  );

  if (isLoading) {
    return shell(
      <>
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-64 w-full mb-6 rounded-xl" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </>,
    );
  }

  if (isError) {
    return shell(
      <div className="text-center py-12 border border-dashed border-border rounded-lg">
        <Seo noindex path={`/cam-nang/${slug}`} title="Cẩm nang | Hiểu Ngọc" description="Cẩm nang ngọc phỉ thúy Hiểu Ngọc." />
        <p className="text-muted-foreground mb-4">Không tải được bài viết.</p>
        <Button onClick={() => refetch()} className="bg-gold hover:bg-gold-dark text-primary-foreground">
          Thử lại
        </Button>
      </div>,
    );
  }

  if (!article) {
    return shell(
      <div className="text-center py-12">
        <Seo
          noindex
          path={`/cam-nang/${slug}`}
          title="Không tìm thấy bài viết | Hiểu Ngọc"
          description="Bài viết không tồn tại hoặc chưa được đăng."
        />
        <h1 className="font-serif text-3xl font-bold mb-3">Không tìm thấy bài viết</h1>
        <p className="text-muted-foreground mb-6">Bài viết không tồn tại hoặc chưa được đăng.</p>
        <Link to="/cam-nang" className="text-accent underline">
          ← Về Cẩm nang
        </Link>
      </div>,
    );
  }

  const path = `/cam-nang/${article.slug}`;
  const cover = coverPublicUrl(article.cover_image_path);
  const title = article.seo_title || article.title;
  const description = article.seo_description || article.excerpt || "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description,
    inLanguage: "vi",
    mainEntityOfPage: `${SITE}${path}`,
    ...(cover ? { image: [cover] } : {}),
    ...(article.published_at ? { datePublished: article.published_at } : {}),
    dateModified: article.updated_at,
    author: { "@type": "Organization", name: "Hiểu Ngọc" },
    publisher: { "@type": "Organization", name: "Hiểu Ngọc" },
  };

  return shell(
    <article>
      <Seo
        path={path}
        title={`${title} | Hiểu Ngọc`}
        description={description}
        image={cover ?? undefined}
        type="article"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/cam-nang">Cẩm nang</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">{article.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {article.category && (
        <p className="text-xs font-semibold uppercase tracking-wider text-gold mb-2">{article.category}</p>
      )}
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">{article.title}</h1>
      {article.published_at && (
        <p className="text-sm text-muted-foreground mb-6">
          {format(new Date(article.published_at), "d MMMM yyyy", { locale: vi })}
        </p>
      )}
      {cover && <img src={cover} alt={article.title} className="w-full rounded-xl object-cover max-h-[420px] mb-8" />}

      <ArticleContent markdown={article.content ?? ""} />
    </article>,
  );
};

export default CamNangDetail;
