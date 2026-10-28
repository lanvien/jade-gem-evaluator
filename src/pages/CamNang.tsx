import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { coverPublicUrl } from "@/lib/articles";

const CamNang = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["articles", "published-list"],
    queryFn: async () => {
      // Không lấy `content` ở danh sách.
      const { data, error } = await supabase
        .from("articles")
        .select("id, slug, title, excerpt, category, cover_image_path, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Seo
        path="/cam-nang"
        title="Cẩm nang ngọc phỉ thúy | Hiểu Ngọc"
        description="Cẩm nang cho người yêu ngọc: cách soi đèn, phân biệt Type A/B/C, đánh giá màu sắc và chọn vòng phỉ thúy phù hợp."
      />
      <Header />
      <main className="container mx-auto max-w-5xl px-4 py-10 md:py-14">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-3">
          Cẩm nang cho người yêu Ngọc
        </h1>
        <p className="text-center text-muted-foreground mb-10">
          Kiến thức nền tảng để hiểu và chọn ngọc phỉ thúy.
        </p>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground mb-4">Không tải được danh sách bài viết.</p>
            <Button onClick={() => refetch()} className="bg-gold hover:bg-gold-dark text-primary-foreground">
              Thử lại
            </Button>
          </div>
        )}

        {data && data.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Chưa có bài viết nào được đăng.</p>
        )}

        {data && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {data.map((a) => {
              const cover = coverPublicUrl(a.cover_image_path);
              return (
                <Link
                  key={a.id}
                  to={`/cam-nang/${a.slug}`}
                  className="flex items-center gap-5 rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-gold transition-all group"
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
                  <div className="min-w-0">
                    {a.category && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-gold mb-1">{a.category}</p>
                    )}
                    <h2 className="font-serif text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                      {a.title}
                    </h2>
                    {a.excerpt && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.excerpt}</p>}
                    {a.published_at && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(a.published_at), "d MMM yyyy", { locale: vi })}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default CamNang;
