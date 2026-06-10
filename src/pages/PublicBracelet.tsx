import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Copy, Link2, ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";
import { loadVault, type JadeItem } from "@/lib/jadeVault";
import JadeRingMini from "@/components/jadevault/JadeRingMini";

export default function PublicBracelet() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<JadeItem | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return setItem(null);
    const all = loadVault();
    const found = all.find((x) => x.id.toUpperCase() === id.toUpperCase());
    setItem(found ?? null);
  }, [id]);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/vong/${id}` : "";

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã copy ${label}`);
  };

  if (item === undefined) {
    return <div className="min-h-screen flex items-center justify-center bg-background">Đang tải…</div>;
  }

  if (item === null || (item as any).isPublic === false) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <Lock className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
          Chiếc vòng này chưa được chia sẻ công khai
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          Mã định danh không tồn tại, hoặc chủ nhân chưa mở chế độ công khai.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-gold px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-gold-dark"
        >
          Tự định giá vòng của bạn →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Hiểu Ngọc
          </Link>
          <span className="text-xs font-bold text-gold tracking-wider">CỐP NGỌC CÔNG KHAI</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-10">
        <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-sm">
          <div className="flex flex-col items-center">
            {item.userImage ? (
              <img src={item.userImage} alt={item.name} className="w-48 h-48 rounded-full object-cover border-2 border-gold" />
            ) : (
              <JadeRingMini segments={item.segments} hasPhieuHoa={item.hasPhieuHoa} isMuna={item.isMuna} size={180} />
            )}
            <h1 className="mt-5 font-serif text-2xl font-bold text-foreground">{item.name}</h1>
            <p className="text-xs text-muted-foreground mt-1">Mã định danh</p>
            <p className="font-mono text-lg font-bold text-gold tracking-widest mt-1">{item.id}</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => copy(item.id, "mã code")}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
              >
                <Copy className="h-3.5 w-3.5" /> Copy Code
              </button>
              <button
                onClick={() => copy(shareUrl, "link chia sẻ")}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
              >
                <Link2 className="h-3.5 w-3.5" /> Copy Link
              </button>
            </div>
          </div>

          {item.notes && (
            <p className="mt-6 italic text-center font-serif text-muted-foreground">"{item.notes}"</p>
          )}

          <div className="mt-8 space-y-2 text-sm border-t border-border pt-6">
            <Row k="Chủng đỉnh / nền" v={`${item.assessment.chungPeak || "—"} / ${item.assessment.chungBase || "—"}`} />
            <Row k="Màu chủ" v={item.assessment.baseColor || "—"} />
            <Row k="Hình dạng" v={item.assessment.shape || "—"} />
            <Row k="Tỳ vết" v={item.assessment.flaws?.length ? item.assessment.flaws.join(", ") : "Không có"} />
            <Row k="Giá ước tính" v={item.assessment.estimatedPrice || "—"} />
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-gold-dark"
            >
              Tự định giá vòng của bạn →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 py-1.5 border-b border-dashed border-border">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-medium text-foreground">{v}</span>
    </div>
  );
}
