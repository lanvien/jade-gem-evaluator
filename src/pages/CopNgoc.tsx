import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listCopNgoc, deleteCopNgoc, type CopNgocEntry } from "@/lib/copNgoc";
import { formatVND } from "@/lib/pricingEngine";

const CopNgoc = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<CopNgocEntry[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setEntries(listCopNgoc());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.id.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q)
    );
  }, [entries, query]);

  const handleDelete = (id: string) => {
    deleteCopNgoc(id);
    setEntries(listCopNgoc());
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

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔎 Tìm theo Mã Cốp (CN-XXXXX) hoặc tên ái phi..."
          className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-base outline-none focus:border-accent transition-colors"
        />

        <div className="mt-6 space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-border p-10 text-center">
              <p className="text-muted-foreground mb-4">
                {entries.length === 0
                  ? "Cốp ngọc còn trống. Hãy định giá vòng đầu tiên của bạn!"
                  : "Không tìm thấy Mã Cốp phù hợp."}
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
                      <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-mono font-bold text-foreground">
                        {e.id}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(e.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <h2 className="font-serif text-xl font-bold text-foreground mt-2 truncate">
                      "{e.name}"
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
