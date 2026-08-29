import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Copy, Check, RotateCcw, Pencil, Download, Share2, Camera } from "lucide-react";
import { buildJadeInputFromSurvey, formatVND } from "@/lib/pricingEngine";
import { generateResultNarrative } from "@/lib/narrative";
import { useSaveToCop } from "@/lib/copNgoc";
import { resetAssessmentSession } from "@/lib/resetAssessment";
import { addToVault, buildSegments, nanoId } from "@/lib/jadeVault";
import { flyToVault } from "@/components/jadevault/flyToVault";
import JadeRingMini from "@/components/jadevault/JadeRingMini";
import { toast } from "sonner";

import rankThuongTai from "@/assets/jade/rank_thuongtai.png";
import rankQuyNhan from "@/assets/jade/rank_quynhan.png";
import rankPhiTan from "@/assets/jade/rank_phitan.png";
import rankQuyPhi from "@/assets/jade/rank_quyphi.png";
import rankHoangHau from "@/assets/jade/rank_hoanghau.png";
import rankThuongTaiLocked from "@/assets/jade/rank_thuongtai_locked.png";
import rankQuyNhanLocked from "@/assets/jade/rank_quynhan_locked.png";
import rankPhiTanLocked from "@/assets/jade/rank_phitan_locked.png";
import rankQuyPhiLocked from "@/assets/jade/rank_quyphi_locked.png";
import rankHoangHauLocked from "@/assets/jade/rank_hoanghau_locked.png";

// TODO (đã note ở freeze trước): TITLES/TIERS/RARITY nên migrate vào
// jadeContent.ts để mọi content nằm 1 chỗ. Giữ tạm ở đây vì chưa có
// content pool đã duyệt cho riêng phần "royal title" — không phải quên,
// là cố tình để lại cho đợt content sau, KHÔNG bịa thêm content mới ở đây.
const TIERS = [
  { key: "thuong-tai", name: "Thường Tại", sub: "Chúng đậu", icon: rankThuongTai, locked: rankThuongTaiLocked },
  { key: "quy-nhan",   name: "Quý Nhân",   sub: "Nếp mịn",   icon: rankQuyNhan,   locked: rankQuyNhanLocked },
  { key: "phi-tan",    name: "Phi Tần",    sub: "Nếp băng",  icon: rankPhiTan,    locked: rankPhiTanLocked },
  { key: "quy-phi",    name: "Quý Phi",    sub: "Băng",      icon: rankQuyPhi,    locked: rankQuyPhiLocked },
  { key: "hoang-hau",  name: "Hoàng Hậu",  sub: "Thuỷ tinh", icon: rankHoangHau,  locked: rankHoangHauLocked },
];

const TITLES: Record<string, { royal: string }> = {
  "thuong-tai": { royal: "Thường tại hiện tại" },
  "quy-nhan":   { royal: "Quý nhân hiện tại" },
  "phi-tan":    { royal: "Ái phi hiện tại" },
  "quy-phi":    { royal: "Quý phi hiện tại" },
  "hoang-hau":  { royal: "Hoàng hậu hiện tại" },
};

const RARITY: Record<string, string> = {
  "thuong-tai": "Chỉ 60% phỉ thuý trên thế giới đạt chủng này",
  "quy-nhan":   "Chỉ 35% phỉ thuý trên thế giới đạt chủng này",
  "phi-tan":    "Chỉ 15% phỉ thuý trên thế giới đạt chủng này",
  "quy-phi":    "Chỉ 5% phỉ thuý trên thế giới đạt chủng này",
  "hoang-hau":  "Chỉ 1% phỉ thuý trên thế giới đạt chủng này",
};

export default function Results() {
  const navigate = useNavigate();
  const surveyData = useMemo(
    () => JSON.parse(localStorage.getItem("jade-survey-data") || "{}"),
    [],
  );

  // Nguồn narrative DUY NHẤT — thay thế hoàn toàn buildResultV2 +
  // tierNarrative.pickNguPhe/pickHashtags cũ. Ngự phê + hashtag đã được
  // sample 1 lần (seeded) BÊN TRONG generateResultNarrative, không cần
  // state riêng ở đây nữa.
  const narrative = useMemo(() => {
    try {
      return generateResultNarrative(surveyData);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [surveyData]);

  const ringCode = narrative?.resultId ?? "00000";
  const [copied, setCopied] = useState(false);
  const { mutate: saveToCop, isPending } = useSaveToCop();

  const segments = useMemo(
    () => buildSegments(surveyData.ringColors || [], surveyData.colorTones || {}),
    [surveyData],
  );
  const canvasSnapshot = useMemo(
    () => localStorage.getItem("jade-canvas-snapshot"),
    [],
  );
  const aiCtx = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("jade-ai-vision-ctx") || "{}"); }
    catch { return {}; }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ringCode);
      setCopied(true);
      toast.success("Đã copy mã tú nữ!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Không copy được, hãy chép tay nhé.");
    }
  };

  const handleRestart = () => {
    resetAssessmentSession();
    navigate("/assessment");
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: "Ngọc của tôi", url });
      else { await navigator.clipboard.writeText(url); toast.success("Đã copy link chia sẻ"); }
    } catch { /* user cancelled */ }
  };

  const handleSaveToVault = () => {
    if (!narrative) return;
    saveToCop(
      { nickname: ringCode, input: buildJadeInputFromSurvey(surveyData), result: narrative.pricing },
      { onError: (e: any) => toast.error(e?.message ?? "Lỗi khi lưu cloud") },
    );
    const existingCount = (() => {
      try { return (JSON.parse(localStorage.getItem("jadeVault") || "[]") || []).length; }
      catch { return 0; }
    })();
    addToVault({
      id: nanoId(8),
      createdAt: new Date().toISOString(),
      name: `Vòng #${existingCount + 1}`,
      notes: "",
      segments,
      hasPhieuHoa: !!aiCtx?.hasPhieuHoa,
      isMuna: !!aiCtx?.isMuna,
      assessment: {
        chungPeak: aiCtx?.chungPeak || narrative.chung,
        chungBase: narrative.chung,
        baseColor: narrative.pricing.colorLabel,
        toneLevel: narrative.pricing.scoreSac,
        flaws: narrative.inclusions.attentionFeatures.map((f) => f.name),
        shape: surveyData.answers?.[10] || "—",
        estimatedPrice: `${formatVND(narrative.pricing.minPrice)} – ${formatVND(narrative.pricing.maxPrice)}`,
        ringCode,
      },
    });
    flyToVault({
      segments,
      hasPhieuHoa: !!aiCtx?.hasPhieuHoa,
      isMuna: !!aiCtx?.isMuna,
      onArrive: () => toast.success("Đã cất vào Cốp Ngọc ✨"),
    });
  };

  if (!narrative) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chưa có dữ liệu khảo sát.</p>
      </div>
    );
  }

  const tier = TIERS[narrative.tierIndex] ?? TIERS[0];
  const title = TITLES[narrative.tierKey] ?? TITLES["phi-tan"];
  const hasInclusionContent =
    narrative.inclusions.positiveFeatures.length > 0 ||
    narrative.inclusions.attentionFeatures.length > 0 ||
    narrative.inclusions.hasCrack;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="container mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
        <Link to="/" className="font-serif text-base md:text-lg text-foreground/80 hover:text-gold transition-colors flex items-center gap-2">
          <span className="italic">Hiểu ngọc</span>
          <span className="inline-block w-10 h-px bg-foreground/40" />
        </Link>
        <div className="flex items-center gap-2 rounded-md border border-gold/50 bg-gold/5 px-3 py-1.5">
          <span className="text-xs md:text-sm text-foreground/70">Mã tú nữ:</span>
          <span className="font-mono text-sm md:text-base font-semibold text-gold">#{ringCode}</span>
          <button onClick={handleCopy} aria-label="Copy" className="ml-1 text-foreground/60 hover:text-gold transition-colors">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-8 pb-16 max-w-5xl">
        {/* Two-column hero */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start">
          {/* LEFT — Ring frame */}
          <div className="relative">
            <img
              src={tier.icon}
              alt={tier.name}
              className="absolute -top-6 -left-6 w-24 md:w-28 h-auto object-contain -rotate-[18deg] drop-shadow-[0_4px_12px_rgba(192,149,76,0.4)] z-10"
            />
            <div className="aspect-square w-full rounded-lg border border-gold/40 bg-gradient-to-br from-card to-background p-6 md:p-8 relative">
              <div className="w-full h-full flex items-center justify-center">
                {canvasSnapshot ? (
                  <img
                    src={canvasSnapshot}
                    alt="Vòng ngọc bạn đã vẽ"
                    className="max-w-full max-h-full object-contain rounded-full"
                    style={{ width: 300, height: 300 }}
                  />
                ) : (
                  <JadeRingMini
                    segments={segments}
                    size={300}
                    hasPhieuHoa={!!aiCtx?.hasPhieuHoa}
                    isMuna={!!aiCtx?.isMuna}
                  />
                )}
              </div>
              <Camera className="absolute bottom-3 right-3 h-5 w-5 text-foreground/30" />
            </div>

            <div className="mt-5 text-center">
              <p className="text-sm text-foreground/60">Danh xưng hiện tại</p>
              <p className="font-serif font-bold tracking-wider text-foreground mt-1">
                {tier.name.toUpperCase()} – {tier.sub.toUpperCase()}
              </p>
            </div>

            <div className="mt-5 text-center">
              <p className="text-sm text-gold">Khung giá tham khảo</p>
              <p className="font-serif text-lg md:text-xl font-bold text-gold mt-1">
                {formatVND(narrative.pricing.minPrice)} – {formatVND(narrative.pricing.maxPrice)}
              </p>
            </div>

            <div className="mt-6 rounded-md border border-gold/40 bg-gold/10 p-4">
              <p className="text-sm leading-relaxed text-foreground/85 text-center">
                <span className="font-semibold">Ngự phê:</span>{" "}
                <span className="italic">"{narrative.nguPhe}"</span>
              </p>
            </div>

            {narrative.flavorCard && (
              <div className="mt-4 rounded-md border border-gold/20 bg-card/30 p-3">
                <p className="text-[10px] uppercase tracking-wide text-gold/70 font-semibold">{narrative.flavorCard.label}</p>
                <p className="text-xs text-foreground/70 italic mt-1">{narrative.flavorCard.text}</p>
              </div>
            )}
          </div>

          {/* RIGHT — Narrative */}
          <div>
            <p className="font-serif text-xl md:text-2xl text-foreground/70 italic">Chiếc vòng…</p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2 mt-1">
              "{title.royal}"
              <Pencil className="h-5 w-5 text-foreground/40" />
            </h1>

            <div className="flex flex-wrap gap-2 mt-3">
              {narrative.hashtags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-md bg-gold/15 border border-gold/40 text-xs md:text-sm text-gold-dark font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 rounded-md border-2 border-gold/60 bg-gold/10 px-4 py-2.5 text-center">
              <p className="font-semibold text-foreground text-sm md:text-base">{RARITY[narrative.tierKey]}</p>
            </div>

            <ul className="mt-6 space-y-4 text-sm md:text-base leading-relaxed text-foreground/85">
              <li className="flex gap-2">
                <span className="text-gold mt-1.5">•</span>
                <p><strong className="text-foreground">Cốt Ngọc</strong>: {narrative.structure}</p>
              </li>
              {narrative.color.text && (
                <li className="flex gap-2">
                  <span className="text-gold mt-1.5">•</span>
                  <p><strong className="text-foreground">Sắc Diện</strong>: {narrative.color.text}</p>
                </li>
              )}
              <li className="flex gap-2">
                <span className="text-gold mt-1.5">•</span>
                <p><strong className="text-foreground">Dấu Ấn Thời Gian</strong>: {narrative.inclusions.summary}</p>
              </li>
              <li className="flex gap-2">
                <span className="text-gold mt-1.5">•</span>
                <p>
                  <strong className="text-foreground">Hình Đoan</strong>: {narrative.form.widthDescriptor}{" "}
                  {narrative.form.thicknessDescriptor} {narrative.form.symmetryDescriptor}
                </p>
              </li>
              <li className="flex gap-2">
                <span className="text-gold mt-1.5">•</span>
                <p><strong className="text-foreground">Phẩm Giá</strong>: {narrative.valuation.paragraph}</p>
              </li>
            </ul>
          </div>
        </div>

        {/* DẤU ẤN NỘI TẠI */}
        {hasInclusionContent && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gold mb-5">Dấu ấn nội tại</h2>
            {narrative.inclusions.crackWarning && (
              <div className="mb-4 rounded-md border-2 border-destructive/60 bg-destructive/10 p-4">
                <p className="text-sm font-semibold text-destructive leading-relaxed">
                  {narrative.inclusions.crackWarning}
                </p>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-3">
              {[...narrative.inclusions.positiveFeatures, ...narrative.inclusions.attentionFeatures].map((f) => (
                <div key={f.name} className="rounded-md border border-gold/40 bg-card p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-foreground text-sm">{f.name}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      f.aesthetic_effect === "positive"
                        ? "border-gold/50 text-gold"
                        : "border-foreground/25 text-foreground/60"
                    }`}>
                      {f.aesthetic_effect === "positive" ? "Nét độc bản" : "Cần lưu ý"}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/70 mt-2 leading-relaxed">{f.description}</p>
                  {f.warning && (
                    <p className="text-xs text-foreground/80 mt-2 italic leading-relaxed">
                      Cần lưu ý khi sử dụng và bảo quản.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {narrative.personalityCard && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gold mb-5">
              Nếu chiếc vòng này là một người…
            </h2>
            <div className="rounded-md border border-gold/40 bg-card p-5 space-y-2 text-sm">
              <p><strong className="text-foreground">Tính cách:</strong> {narrative.personalityCard.personality}</p>
              <p><strong className="text-foreground">Đi uống gì:</strong> {narrative.personalityCard.drink}</p>
              <p><strong className="text-foreground">Mặc gì:</strong> {narrative.personalityCard.outfit}</p>
              <p><strong className="text-foreground">Playlist:</strong> {narrative.personalityCard.playlist}</p>
              <p><strong className="text-foreground">Vibe:</strong> {narrative.personalityCard.vibe}</p>
            </div>
          </section>
        )}

        {/* PHONG KẾT CẤU timeline */}
        <section className="mt-14">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gold mb-6">Phong kết cấu</h2>
          <div className="grid grid-cols-5 gap-3 md:gap-6">
            {TIERS.map((t, i) => {
              const active = i === narrative.tierIndex;
              return (
                <div key={t.key} className="flex flex-col items-center gap-2">
                  <div className={active ? "drop-shadow-[0_0_24px_rgba(192,149,76,0.6)]" : ""}>
                    <img
                      src={active ? t.icon : t.locked}
                      alt={t.name}
                      className={`w-full max-w-[88px] md:max-w-[120px] h-auto object-contain transition-all ${
                        active ? "scale-110" : "opacity-40 grayscale"
                      }`}
                    />
                  </div>
                  <p className={`text-xs md:text-sm font-bold text-center ${active ? "text-gold" : "text-foreground/40"}`}>
                    {t.name}
                  </p>
                  <p className={`text-[10px] md:text-xs text-center -mt-1 ${active ? "text-foreground/70" : "text-foreground/30"}`}>
                    {t.sub}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Divider + action icons */}
        <div className="mt-12 pt-6 border-t border-gold/30 flex items-center justify-end gap-5">
          <button onClick={() => window.print()} aria-label="Tải xuống" className="text-foreground/60 hover:text-gold transition-colors">
            <Download className="h-6 w-6" strokeWidth={1.8} />
          </button>
          <button onClick={handleShare} aria-label="Chia sẻ" className="text-foreground/60 hover:text-gold transition-colors">
            <Share2 className="h-6 w-6" strokeWidth={1.8} />
          </button>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRestart}
            className="px-8 py-3 rounded-md bg-gold text-primary-foreground font-semibold hover:bg-gold-dark transition-colors min-w-[200px]"
          >
            Kiểm tra Vòng khác
          </button>
          <button
            onClick={handleSaveToVault}
            disabled={isPending}
            className="px-8 py-3 rounded-md border-2 border-gold/60 bg-background text-foreground font-semibold hover:bg-gold/10 transition-colors min-w-[200px] disabled:opacity-50"
          >
            Lưu về cốp ngọc của bạn
          </button>
        </div>

        {/* Bottom nav links */}
        <div className="mt-8 flex items-center justify-between text-sm font-serif italic">
          <Link to="/" className="text-foreground/70 hover:text-gold transition-colors">
            &lt;&lt;&lt; Về trang chủ
          </Link>
          <Link to="/jade-vault" className="text-foreground/70 hover:text-gold transition-colors">
            Về cốp ngọc của bạn &gt;&gt;&gt;
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-gold/30 space-y-3 text-xs md:text-sm text-foreground/65 leading-relaxed">
          <p>
            <strong>*Disclaimer</strong>: Ngọc tùy duyên và giá cả phụ thuộc nhiều vào mắt nhìn của người bán/người mua.
            Giá trị trên chỉ đúng khi đây là ngọc tự nhiên 100% (Type A / ngọc tự nhiên không xử lý ép nhựa/nhuộm màu).
            Nếu người bán giục chốt đơn gấp, mập mờ trong việc hỗ trợ soi đèn viền, hoặc bán với mức giá RẺ BẤT NGỜ so với định giá này… Hãy chậm lại!
          </p>
          <p>
            Ngọc phỉ thuý luôn đi đôi với giấy kiểm định, tuyệt đối yêu cầu Giấy kiểm định (SJC, GIV, Liulab) trước khi chuyển tiền để tránh mua phải vòng type B, C.
            Nếu vòng của bạn bị xử lý, giá trị sẽ thấp hơn rất nhiều so với mức giá này.
          </p>
        </div>

        <div className="mt-10 flex justify-end items-center gap-2 text-sm font-serif italic text-foreground/60">
          <span className="inline-block w-10 h-px bg-foreground/40" />
          <span>Hiểu ngọc</span>
        </div>

        {/* Restart subtle footer */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 text-xs text-foreground/50 hover:text-gold transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Làm lại từ đầu
          </button>
        </div>
      </main>
    </div>
  );
}
