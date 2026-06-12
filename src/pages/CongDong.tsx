import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { MessageCircle, ImagePlus } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { getSignedUrls } from "@/lib/jadeImages";
import { Button } from "@/components/ui/button";

interface Submission {
  id: string;
  guest_name: string;
  description: string | null;
  image_urls: string[];
  created_at: string;
  comment_count?: number;
  signedImages?: string[];
}

export default function CongDong() {
  const [items, setItems] = useState<Submission[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data: subs, error } = await supabase
        .from("submissions")
        .select("id, guest_name, description, image_urls, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) { setItems([]); return; }

      const ids = (subs ?? []).map((s) => s.id);
      let counts: Record<string, number> = {};
      if (ids.length) {
        const { data: cs } = await supabase
          .from("comments")
          .select("submission_id")
          .in("submission_id", ids);
        (cs ?? []).forEach((c) => {
          counts[c.submission_id] = (counts[c.submission_id] ?? 0) + 1;
        });
      }

      const enriched = await Promise.all(
        (subs ?? []).map(async (s) => ({
          ...s,
          comment_count: counts[s.id] ?? 0,
          signedImages: await getSignedUrls(s.image_urls ?? []),
        }))
      );
      setItems(enriched);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold">Phòng Trà Thưởng Ngọc</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Cùng cộng đồng thưởng lãm và góp ý cho những chiếc vòng.
            </p>
          </div>
          <Link to="/cong-dong/dang">
            <Button className="bg-gold hover:bg-gold-dark text-primary-foreground">
              <ImagePlus size={16} className="mr-2" /> Gửi vòng
            </Button>
          </Link>
        </div>

        {items === null && (
          <p className="text-muted-foreground text-center py-12">Đang tải…</p>
        )}
        {items && items.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground mb-4">
              Phòng Trà còn trống. Hãy là người đầu tiên chia sẻ.
            </p>
            <Link to="/cong-dong/dang">
              <Button className="bg-gold hover:bg-gold-dark text-primary-foreground">
                Gửi vòng đầu tiên
              </Button>
            </Link>
          </div>
        )}

        <div className="space-y-5">
          {items?.map((s) => (
            <Link
              key={s.id}
              to={`/cong-dong/${s.id}`}
              className="block rounded-lg border border-border bg-card hover:border-gold/50 hover:shadow-md transition overflow-hidden"
            >
              {s.signedImages && s.signedImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto bg-muted/40 p-2 snap-x">
                  {s.signedImages.map((u, i) => (
                    <img
                      key={i}
                      src={u}
                      alt={`vòng ${i + 1}`}
                      className="h-56 w-auto object-cover rounded snap-start flex-shrink-0"
                    />
                  ))}
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">{s.guest_name}</span>
                  <span className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(s.created_at), { addSuffix: true, locale: vi })}
                  </span>
                </div>
                {s.description && (
                  <p className="mt-2 text-sm text-foreground/80 line-clamp-3">{s.description}</p>
                )}
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageCircle size={14} />
                  <span>{s.comment_count} nhận xét</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
