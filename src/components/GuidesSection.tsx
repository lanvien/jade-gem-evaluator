import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { coverPublicUrl } from "@/lib/articles";

const GuidesSection = () => {
  const { data: articles } = useQuery({
    queryKey: ["articles", "latest-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id, slug, title, excerpt, category, cover_image_path")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data ?? [];
    },
  });

  // Không có bài đã xuất bản (hoặc đang tải/lỗi) → không hiện mục này.
  if (!articles || articles.length === 0) return null;

  return (
    <section id="guides" className="bg-beige-dark py-16 md:py-24">
      <div className="container mx-auto px-8 md:px-16">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-14">
          Cẩm nang cho người yêu Ngọc
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {articles.map((a) => {
            const cover = coverPublicUrl(a.cover_image_path);
            return (
              <Link
                key={a.id}
                to={`/cam-nang/${a.slug}`}
                className="flex items-center gap-6 rounded-xl border border-border bg-card p-6 md:p-8 min-h-[140px] shadow-sm hover:shadow-md hover:border-gold transition-all cursor-pointer group"
              >
                {cover ? (
                  <img
                    src={cover}
                    alt=""
                    loading="lazy"
                    className="h-24 w-24 md:h-28 md:w-28 rounded-md object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="h-24 w-24 md:h-28 md:w-28 rounded-md bg-muted flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                    {a.title}
                  </h3>
                  {(a.category || a.excerpt) && (
                    <p className="text-base text-muted-foreground mt-1 line-clamp-2">{a.category || a.excerpt}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/cam-nang"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-semibold tracking-wide text-primary-foreground hover:bg-gold-dark transition-colors"
          >
            Xem thêm <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex items-center gap-3 mt-14 max-w-5xl mx-auto">
          <div className="h-px flex-1 bg-border" />
          <span className="font-serif text-accent font-bold text-xl">Hiểu ngọc</span>
        </div>
      </div>
    </section>
  );
};

export default GuidesSection;
