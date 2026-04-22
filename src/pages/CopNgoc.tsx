import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCopNgoc, useRemoveFromCop, useRestoreCop, formatSavedDate } from "@/lib/copNgoc";
import { formatVND } from "@/lib/pricingEngine";
import { toast } from "@/hooks/use-toast";

const CopNgoc = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [restoreCode, setRestoreCode] = useState("");

  const { data: cop, isLoading } = useCopNgoc();
  const remove = useRemoveFromCop();
  const restore = useRestoreCop();

  const items = cop?.items ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (e) =>
        e.id.toLowerCase().includes(q) ||
        e.nickname.toLowerCase().includes(q)
    );
  }, [items, query]);

  const handleDelete = async (id: string) => {
    try {
      await remove.mutateAsync(id);
      toast({ title: "Đã xóa khỏi cốp" });
    } catch (e: any) {
      toast({ title: "Xóa thất bại", description: e?.message, variant: "destructive" });
    }
  };

  const handleRestore = async () => {
    const code = restoreCode.trim().toUpperCase();
    if (!code) return;
    try {
      await restore.mutateAsync(code);
      toast({ title: "✓ Đã khôi phục cốp", description: `Mã: ${code}` });
      setRestoreCode("");
    } catch (e: any) {
      toast({ title: "Không tìm thấy cốp", description: e?.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl font-bold text-[#13532e]">
            Cốp ngọc của bạn
          </h1>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            &lt;&lt; Trang chủ
          </button>
        </div>

        {cop?.copCode && (
          <div className="mb-4 rounded-xl border-2 border-gold bg-gold/10 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Mã cốp của bạn (lưu để mở trên máy khác):</p>
              <p className="font-mono text-2xl font-bold text-foreground">{cop.copCode}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(cop.copCode);
                toast({ title: "Đã copy mã cốp" });
              }}
              className="rounded-lg bg-foreground text-background px-4 py-2 text-sm font-semibold"
            >
              Copy mã
            </button>
          </div>
        )}

        <div className="mb-4 rounded-xl border border-border bg-card p-4 flex gap-2 flex-wrap">
          <input
            type="text"
            value={restoreCode}
            onChange={(e) => setRestoreCode(e.target.value)}
            placeholder="NGOC-XXXX (khôi phục từ máy khác)"
            className="flex-1 min-w-[200px] rounded-lg border border-border bg-background px-3 py-2 text-base outline-none focus:border-accent"
          />
          <button
            onClick={handleRestore}
            disabled={restore.isPending}
            className="rounded-lg bg-accent px-4 py-2 font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-60"
          >
            {restore.isPending ? "Đang tìm..." : "Khôi phục"}
          </button>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔎 Tìm theo tên ái phi..."
          className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-base outline-none focus:border-accent transition-colors"
        />

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-10">Đang tải cốp ngọc...</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-border p-10 text-center">
              <p className="text-muted-foreground mb-4">
                {items.length === 0
                  ? "Cốp ngọc còn trống. Hãy định giá vòng đầu tiên của bạn!"
                  : "Không tìm thấy vòng phù hợp."}
              </p>
              <button
                onClick={() => navigate("/assessment")}
                className="rounded-lg bg-gold px-6 py-3 font-bold text-primary-foreground hover:bg-gold-dark transition-colors"
              >
                Định giá vòng mới
              </button>
            </div>
          ) : (
            filtered.map((e) => (
              <div
                key={e.id}
                className="rounded-xl border-2 border-border bg-card p-5 hover:border-accent transition-colors"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        {formatSavedDate(e.savedAt)}
                      </span>
                    </div>
                    <h2 className="font-serif text-xl font-bold text-foreground mt-2 truncate">
                      "{e.nickname}"
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {e.result.chungLabel} · {e.result.colorLabel}
                    </p>
                    <p className="font-serif text-lg font-bold text-accent mt-2">
                      {formatVND(e.result.minPrice)} – {formatVND(e.result.maxPrice)}
                    </p>
                    <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                      <span>Q<sub>Jade</sub>: <strong className="text-foreground">{e.result.qJade}</strong></span>
                      <span>Chủng: <strong className="text-foreground">{e.result.scoreChung}</strong></span>
                      <span>Sắc: <strong className="text-foreground">{e.result.scoreSac}</strong></span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CopNgoc;
