import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Upload, Loader2, X, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useJadeVision, type VisionResult } from "@/hooks/useJadeVision";
import { calcJadePrice, formatVND, type PricingOutput } from "@/lib/jadePrice";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "cop_ngoc_session_id";
function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
function genCopCode(): string {
  return `NGOC-${Math.floor(1000 + Math.random() * 9000)}`;
}

interface ImgFile { file: File; url: string; }

function Radar({ axes }: { axes: PricingOutput["axes"] }) {
  const labels = ["Độ Trong", "Sắc Diện", "Lành Lặn", "Đầm Tay", "Thẩm Mỹ"];
  const values = [axes.trong, axes.sac, axes.lanh, axes.damTay, axes.thamMy];
  const cx = 150, cy = 150, R = 110;
  const pts = values.map((v, i) => {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const r = (v / 100) * R;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const polyPts = pts.map(p => p.join(",")).join(" ");
  const rings = [0.25, 0.5, 0.75, 1].map((k, idx) => {
    const ringPts = labels.map((_, i) => {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      return `${cx + R * k * Math.cos(a)},${cy + R * k * Math.sin(a)}`;
    }).join(" ");
    return <polygon key={idx} points={ringPts} fill="none" stroke="#C0954C" strokeOpacity={0.15} />;
  });
  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-xs mx-auto">
      {rings}
      {labels.map((_, i) => {
        const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + R * Math.cos(a)} y2={cy + R * Math.sin(a)} stroke="#C0954C" strokeOpacity={0.2} />;
      })}
      <polygon points={polyPts} fill="#C0954C" fillOpacity={0.35} stroke="#9a7634" strokeWidth={2} />
      {labels.map((l, i) => {
        const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const x = cx + (R + 22) * Math.cos(a);
        const y = cy + (R + 22) * Math.sin(a);
        return (
          <text key={l} x={x} y={y} fontSize={12} fill="#3d4a3a" textAnchor="middle" dominantBaseline="middle" fontWeight={600}>
            {l}
          </text>
        );
      })}
    </svg>
  );
}

export default function ThamDinh() {
  const [images, setImages] = useState<ImgFile[]>([]);
  const [bestIdx, setBestIdx] = useState(0);
  const [pricing, setPricing] = useState<PricingOutput | null>(null);
  const [vision, setVision] = useState<VisionResult | null>(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { analyze, isLoading } = useJadeVision();

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files).slice(0, 3 - images.length).map(f => ({
      file: f, url: URL.createObjectURL(f),
    }));
    setImages(prev => [...prev, ...next].slice(0, 3));
  }

  function removeImage(i: number) {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    if (bestIdx >= images.length - 1) setBestIdx(0);
  }

  async function runAnalysis() {
    if (!images.length) { toast.error("Hãy tải ảnh vòng ngọc trước"); return; }
    setPricing(null); setVision(null);
    const v = await analyze(images[bestIdx].file);
    if (!v) { toast.error("Phân tích thất bại, hãy thử lại"); return; }
    setVision(v);
    const p = calcJadePrice(v as any);
    setPricing(p);
    toast.success("Đã phân tích xong ✨");
  }

  async function saveToCop() {
    if (!pricing || !vision) return;
    setSaving(true);
    try {
      const sessionId = getSessionId();
      const { data: existing } = await supabase
        .from("cop_ngoc").select("*").eq("session_id", sessionId).maybeSingle();
      const item = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        geminiData: vision,
        pricingResult: pricing,
        imagePreview: images[bestIdx]?.url,
      };
      const currentItems = (existing?.items as any[]) ?? [];
      const updatedItems = [item, ...currentItems].slice(0, 30);
      if (existing) {
        await supabase.from("cop_ngoc")
          .update({ items: updatedItems as any, updated_at: new Date().toISOString() })
          .eq("session_id", sessionId);
      } else {
        await supabase.from("cop_ngoc").insert({
          session_id: sessionId, cop_code: genCopCode(), items: updatedItems as any,
        });
      }
      toast.success("Đã lưu vào Cốp Ngọc 🏺");
    } catch (e: any) {
      toast.error(e.message ?? "Lưu thất bại");
    } finally { setSaving(false); }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <Link to="/" className="font-serif text-xl md:text-2xl font-bold text-gold">← Hiểu Ngọc</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-center text-foreground mb-2">
          Thẩm Định Vòng Ngọc
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Tải ảnh — AI Gemini phân tích — Định giá tức thì
        </p>

        {/* Upload */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gold/60 rounded-2xl p-8 text-center cursor-pointer hover:bg-gold/5 transition-colors"
        >
          <Upload className="mx-auto h-10 w-10 text-gold mb-3" />
          <p className="font-semibold text-foreground">Kéo thả ảnh hoặc bấm để chọn</p>
          <p className="text-sm text-muted-foreground mt-1">Tối đa 3 ảnh — chọn ảnh rõ nhất để AI phân tích</p>
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => handleFiles(e.target.files)} />
        </div>

        {images.length > 0 && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-2">Chọn ảnh rõ nhất để phân tích:</p>
            <div className="grid grid-cols-3 gap-3">
              {images.map((im, i) => (
                <div key={i} className={`relative rounded-xl overflow-hidden border-2 cursor-pointer ${bestIdx === i ? "border-gold ring-2 ring-gold/40" : "border-border"}`}
                  onClick={() => setBestIdx(i)}>
                  <img src={im.url} alt="" className="w-full aspect-square object-cover" />
                  <button onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                    className="absolute top-1 right-1 bg-background/90 rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground">
                    <X className="h-4 w-4" />
                  </button>
                  {bestIdx === i && (
                    <span className="absolute bottom-1 left-1 bg-gold text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">
                      Ảnh chính
                    </span>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={runAnalysis}
              disabled={isLoading}
              className="mt-5 w-full rounded-full bg-gold py-3.5 font-bold text-primary-foreground hover:bg-gold-dark transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {isLoading ? (<><Loader2 className="h-5 w-5 animate-spin" /> Đang phân tích ngọc...</>)
                : (<><Sparkles className="h-5 w-5" /> Phân tích & Định giá</>)}
            </button>
          </div>
        )}

        {/* Result */}
        {pricing && vision && (
          <section className="mt-10 space-y-6 animate-fade-in-up">
            <div className="text-center">
              <p className="text-xs tracking-[0.3em] uppercase text-gold font-semibold">Phẩm cấp</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-1">
                {pricing.danhXung.toUpperCase()}
              </h2>
              <span className="inline-block mt-3 px-4 py-1 rounded-full bg-gold/10 border border-gold/40 text-gold-dark text-sm font-semibold">
                {pricing.truongPhai}
              </span>
            </div>

            <div className="text-center rounded-2xl border-2 border-gold/40 bg-gold/5 p-6">
              <p className="text-sm text-muted-foreground mb-2">Khung giá tham khảo</p>
              <p className="text-2xl md:text-4xl font-bold text-gold">
                {formatVND(pricing.priceLow)} – {formatVND(pricing.priceHigh)}
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Độ tin cậy: {Math.round(pricing.confidence * 100)}%
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-center text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">
                Bản đồ vẻ đẹp
              </p>
              <Radar axes={pricing.axes} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <Stat label="Chủng" value={vision.chungPeak} />
              <Stat label="Sắc chính" value={vision.baseColor} />
              <Stat label="Điểm Cốt" value={pricing.chungScore.toString()} />
              <Stat label="Điểm Sắc" value={pricing.sacScore.toString()} />
              <Stat label="Hệ số màu" value={`×${pricing.colorMultiplier.toFixed(2)}`} />
              <Stat label="Hệ số lỗi" value={`×${pricing.flawMultiplier.toFixed(2)}`} />
            </div>

            {pricing.bonuses.length > 0 && (
              <div className="rounded-xl border border-green-300 bg-green-50 p-4 space-y-1">
                {pricing.bonuses.map((b, i) => (
                  <p key={i} className="text-sm text-green-800">{b}</p>
                ))}
              </div>
            )}

            {pricing.warnings.length > 0 && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 space-y-1">
                {pricing.warnings.map((w, i) => (
                  <p key={i} className="text-sm text-amber-900">{w}</p>
                ))}
              </div>
            )}

            {(vision.vision_notes?.colorUncertainty || vision.vision_notes?.flawUncertainty) && (
              <p className="text-xs text-muted-foreground italic">
                {vision.vision_notes.colorUncertainty} {vision.vision_notes.flawUncertainty}
              </p>
            )}

            <button
              onClick={saveToCop}
              disabled={saving}
              className="w-full rounded-full bg-gold py-3.5 font-bold text-primary-foreground hover:bg-gold-dark transition-colors disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "🏺 Lưu vào Cốp Ngọc"}
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground truncate">{value}</p>
    </div>
  );
}
