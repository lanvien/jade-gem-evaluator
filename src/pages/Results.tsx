import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toPng } from "html-to-image";
import { questions } from "@/data/questions";
import {
  buildJadeInputFromSurvey,
  calculateJadePrice,
  formatVND,
  type PricingResult,
} from "@/lib/pricingEngine";
import { useSaveToCop, useCopNgoc } from "@/lib/copNgoc";
import { toast } from "@/hooks/use-toast";

import rankThuongTai from "@/assets/jade/rank_thuongtai.png";
import rankThuongTaiLocked from "@/assets/jade/rank_thuongtai_locked.png";
import rankQuyNhan from "@/assets/jade/rank_quynhan.png";
import rankQuyNhanLocked from "@/assets/jade/rank_quynhan_locked.png";
import rankPhiTan from "@/assets/jade/rank_phitan.png";
import rankPhiTanLocked from "@/assets/jade/rank_phitan_locked.png";
import rankQuyPhi from "@/assets/jade/rank_quyphi.png";
import rankQuyPhiLocked from "@/assets/jade/rank_quyphi_locked.png";
import rankHoangHau from "@/assets/jade/rank_hoanghau.png";
import rankHoangHauLocked from "@/assets/jade/rank_hoanghau_locked.png";

import iconEdit from "@/assets/jade/icon_edit.png";
import iconShare from "@/assets/jade/icon_share.png";
import iconDownload from "@/assets/jade/icon_download.png";
import iconUpload from "@/assets/jade/icon_upload.png";

/* ── Grading / Pricing Engine ── */

const TIERS = [
  { key: "thuong-tai", label: "Thường tại", sub: "Chủng đậu", minScore: 0, basePrice: [1_000_000, 3_000_000], icon: rankThuongTai, iconLocked: rankThuongTaiLocked },
  { key: "quy-nhan", label: "Quý nhân", sub: "Nếp mịn", minScore: 0.55, basePrice: [3_000_000, 8_000_000], icon: rankQuyNhan, iconLocked: rankQuyNhanLocked },
  { key: "phi-tan", label: "Phi tần", sub: "Nếp băng", minScore: 0.7, basePrice: [5_000_000, 15_000_000], icon: rankPhiTan, iconLocked: rankPhiTanLocked },
  { key: "quy-phi", label: "Quý phi", sub: "Băng", minScore: 0.82, basePrice: [12_000_000, 35_000_000], icon: rankQuyPhi, iconLocked: rankQuyPhiLocked },
  { key: "hoang-hau", label: "Hoàng hậu", sub: "Thủy tinh", minScore: 0.92, basePrice: [30_000_000, 100_000_000], icon: rankHoangHau, iconLocked: rankHoangHauLocked },
];

function computeResults(data: any) {
  const answers = data.answers || {};
  const numberInputs = data.numberInputs || {};

  let totalMultiplier = 0;
  let count = 0;

  questions.forEach((q) => {
    if (q.options.length === 0) return;
    const selected = answers[q.id];
    if (!selected) return;
    const opt = q.options.find((o) => o.id === selected);
    if (opt?.multiplier) {
      totalMultiplier += opt.multiplier;
      count++;
    }
  });

  const avgScore = count > 0 ? totalMultiplier / count : 0.5;

  let tierIndex = 0;
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (avgScore >= TIERS[i].minScore) {
      tierIndex = i;
      break;
    }
  }
  const tier = TIERS[tierIndex];

  const diameter = parseFloat(numberInputs[9] || numberInputs[11]) || 56;
  const thickness = parseFloat(numberInputs[11] || numberInputs[13]) || 8;
  const volumeCoeff = (diameter * thickness) / (56 * 8);

  const priceLow = Math.round((tier.basePrice[0] * volumeCoeff) / 100_000) * 100_000;
  const priceHigh = Math.round((tier.basePrice[1] * volumeCoeff) / 100_000) * 100_000;

  const rarity = tierIndex === 0 ? 60 : tierIndex === 1 ? 35 : tierIndex === 2 ? 15 : tierIndex === 3 ? 7 : 3;

  // Analysis texts based on answers
  const cotAnswer = answers[1];
  const cotText =
    cotAnswer === "1c"
      ? "Phẩm ngọc đạt chủng Nếp Băng. Cấu trúc liên kết chặt chẽ, chất ngọc mướt mát, ngậm nước như sương sớm. Lựa chọn hoàn mỹ cho những ai tìm kiếm chiều sâu của ngọc với một mức ngân sách tối ưu."
      : cotAnswer === "1b"
      ? "Phẩm ngọc đạt chủng Nếp. Hạt tinh thể mịn, ánh ngọc êm dịu. Đây là mức chất lượng phổ biến ở phân khúc trung – cao, phù hợp để đeo hàng ngày."
      : "Phẩm ngọc đạt chủng Đậu. Hạt tinh thể nhìn rõ, thích hợp cho người mới bắt đầu tìm hiểu ngọc.";

  const tones: Record<string, string> = data.colorTones || {};
  const toneValues = Object.values(tones);
  const darkCount = toneValues.filter((t) => t === "dark").length;
  const lightCount = toneValues.filter((t) => t === "light").length;
  const sacText =
    darkCount >= toneValues.length / 2 && toneValues.length > 0
      ? "Sở hữu dải màu Lục tươi vượng khí, độ đậm sống động. Không màng đến sự rập khuôn vô hồn, chính những vệt hoa bay đã thổi hồn vào khối đá, tạo nên một tuyệt tác thiên nhiên duy nhất và không thể sao chép."
      : lightCount >= toneValues.length / 2 && toneValues.length > 0
      ? "Màu sắc nhạt, phớt. Phù hợp cho người thích phong cách tối giản, nhẹ nhàng."
      : "Màu sắc ở mức trung bình, đều đặn. Sắc diện dễ chịu, phù hợp phong cách thanh lịch kín đáo.";

  const noiTaiText = data.subChecks?.[9]
    ? "Ngọc quý ắt trải qua phong hóa, giữ lại chút tỳ vết là lẽ thường tình. Sự xuất hiện của một vài vết sơ nhỏ chính là lời khẳng định mạnh mẽ nhất về nguồn gốc tự nhiên. Đây không chỉ là nét độc bản, mà còn là chìa khóa vàng để bạn làm chủ cuộc thương lượng (kỳ vọng giảm 15-20% giá)."
    : "Ngọc sạch, ít tạp chất. Bề mặt và nội tại đạt tiêu chuẩn tốt cho phân khúc này.";

  const quotes: Record<string, string> = {
    "thuong-tai": "Nhan sắc thanh tú, an phận thủ thường, phù hợp để đeo cày deadline mỗi ngày. 😊",
    "quy-nhan": "Ôn nhu hiền thục, sắc ngọc đoan trang – xứng danh người biết chọn ngọc.",
    "phi-tan": "Phi tần kiều diễm, sắc ngọc vẹn toàn – xứng đáng chiếm trọn ánh nhìn.",
    "quy-phi": "Quý phái tựa ngọc trong sương, sắc đẹp khiến người ta phải ngoái nhìn.",
    "hoang-hau": "Mẫu nghi thiên hạ, ngọc quý hiếm có – xứng danh bảo vật truyền đời.",
  };

  // Pricing engine v2
  const jadeInput = buildJadeInputFromSurvey(data);
  const pricing = calculateJadePrice(jadeInput);

  return {
    tier,
    tierIndex,
    avgScore,
    priceLow: pricing.minPrice,
    priceHigh: pricing.maxPrice,
    rarity,
    cotText,
    sacText,
    noiTaiText,
    quote: quotes[tier.key] || quotes["phi-tan"],
    diameter,
    thickness,
    pricing,
  };
}

function formatVNDFull(n: number) {
  return n.toLocaleString("vi-VN") + " VNĐ";
}

/* ── Loading Screen (green bg, random quote) ── */
const RESULTS_QUOTES = [
  {
    title: "⏳ Đang đối chiếu dữ liệu thị trường...",
    quote: "Giá ngọc tùy duyên, nhưng kiến thức sẽ giúp bạn không mua hớ.",
  },
  {
    title: "⏳ Đang kiểm tra chứng thư...",
    quote:
      "Ngọc luôn đi đôi với giấy kiểm định. Đừng mua ngọc nếu không có giấy kiểm định từ các trung tâm uy tín như SJC, Liulab hay GIV.",
  },
];

const ResultsLoading = ({ onDone }: { onDone: () => void }) => {
  const [q] = useState(() => RESULTS_QUOTES[Math.floor(Math.random() * RESULTS_QUOTES.length)]);
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center animate-fade-in-up"
      style={{ backgroundColor: "#002f14", color: "#ffffff" }}
    >
      <div className="w-12 h-12 border-4 border-white/80 border-t-transparent rounded-full animate-spin mb-6" />
      <p className="text-xl font-bold mb-6">{q.title}</p>
      <p className="font-serif italic text-base max-w-md leading-relaxed">{q.quote}</p>
    </div>
  );
};

/* ── Main Results Page ── */
const Results = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState<any>(null);
  const [ringName, setRingName] = useState<string>(() => {
    return localStorage.getItem("jade-ring-name") || "Ái phi hiện tại";
  });
  const [editingName, setEditingName] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const saveToCop = useSaveToCop();
  const { data: copData } = useCopNgoc();
  const copId = copData?.copCode ?? "Chưa có";

  useEffect(() => {
    const data = localStorage.getItem("jade-survey-data");
    if (data) setSurveyData(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("jade-ring-name", ringName);
  }, [ringName]);

  if (loading) {
    return <ResultsLoading onDone={() => setLoading(false)} />;
  }

  if (!surveyData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <p className="text-foreground mb-4">Không tìm thấy dữ liệu khảo sát.</p>
        <button
          onClick={() => navigate("/assessment")}
          className="rounded-lg bg-gold px-6 py-3 font-bold text-primary-foreground hover:bg-gold-dark transition-colors"
        >
          Bắt đầu định giá
        </button>
      </div>
    );
  }

  const r = computeResults(surveyData);

  const handleRestart = () => {
    localStorage.removeItem("jade-assessment-step");
    localStorage.removeItem("jade-assessment-answers");
    localStorage.removeItem("jade-number-inputs");
    localStorage.removeItem("jade-sub-checks");
    localStorage.removeItem("jade-ring-colors");
    localStorage.removeItem("jade-color-tones");
    localStorage.removeItem("jade-pattern-data");
    localStorage.removeItem("jade-survey-data");
    navigate("/assessment");
  };

  const handleSaveToCop = async () => {
    try {
      const jadeInput = buildJadeInputFromSurvey(surveyData);
      const saved = await saveToCop.mutateAsync({
        nickname: ringName,
        input: jadeInput,
        result: r.pricing,
      });
      setSavedCode(saved.copCode);
      toast({
        title: "✓ Đã cất vào cốp",
        description: `Mã cốp của bạn: ${saved.copCode}. Lưu lại để truy cập trên máy khác!`,
      });
    } catch (e: any) {
      toast({
        title: "Lưu thất bại",
        description: e?.message ?? "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return;
    try {
      setDownloading(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#faf6ee",
      });
      const link = document.createElement("a");
      link.download = `hieu-ngoc-${ringName.replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Download failed", e);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Hiểu ngọc - ${ringName}`,
          text: `Vòng "${ringName}" của tôi đạt phẩm cấp ${r.tier.label} – ${r.tier.sub}!`,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between border-b border-border">
        <p className="font-serif text-lg font-bold text-[#13532e]">Hiểu ngọc <span className="text-muted-foreground">───</span></p>
        <div className="flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground bg-[#ffeba3]">
          Mã Cốp: <span className="font-mono font-bold text-foreground">{copId}</span>
        </div>
      </div>

      <div ref={cardRef} className="container mx-auto px-4 pb-12 max-w-5xl animate-fade-in-up bg-background">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Left – Ring + Pricing */}
          <div className="items-center flex flex-col">
            {/* Ring visualization with diagonal crown overlay */}
            <div className={`relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center ${r.pricing.isImperialCandidate || r.pricing.xuanDaiTaiBonus ? "imperial-glow rounded-full" : ""}`}>
              {/* Active crown — overlaps top-left diagonally, larger & glowing */}
              <img
                src={r.tier.icon}
                alt={r.tier.label}
                className="absolute -top-10 -left-10 w-32 h-32 md:w-36 md:h-36 object-contain rotate-[-18deg] z-10 select-none pointer-events-none animate-crown-glow"
              />

              <svg viewBox="0 0 200 200" className="w-full h-full">
                {(surveyData.ringColors || []).map((color: string, i: number) => {
                  const angle = (i * 360) / 12;
                  const endAngle = ((i + 1) * 360) / 12;
                  const startRad = ((angle - 90) * Math.PI) / 180;
                  const endRad = ((endAngle - 90) * Math.PI) / 180;
                  const outerR = 90;
                  const innerR = 60;
                  const x1 = 100 + outerR * Math.cos(startRad);
                  const y1 = 100 + outerR * Math.sin(startRad);
                  const x2 = 100 + outerR * Math.cos(endRad);
                  const y2 = 100 + outerR * Math.sin(endRad);
                  const x3 = 100 + innerR * Math.cos(endRad);
                  const y3 = 100 + innerR * Math.sin(endRad);
                  const x4 = 100 + innerR * Math.cos(startRad);
                  const y4 = 100 + innerR * Math.sin(startRad);
                  return (
                    <path
                      key={i}
                      d={`M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`}
                      fill={color}
                      stroke="hsl(var(--foreground))"
                      strokeWidth="0.5"
                    />
                  );
                })}
              </svg>
              <button
                aria-label="Tải ảnh vòng"
                className="absolute bottom-1 right-1 hover:opacity-80 transition-opacity p-1"
              >
                <img src={iconUpload} alt="" className="h-5 w-5 object-contain" />
              </button>
            </div>

            {/* Title & Pricing */}
            <p className="text-muted-foreground mt-4 text-xl">Danh xưng hiện tại</p>
            <p className="font-serif font-bold text-foreground uppercase tracking-wide mt-1 text-xl">
              {r.tier.label}
            </p>
            <p className="text-muted-foreground text-lg">{r.tier.sub}</p>

            <div className="mt-4 rounded-xl border-2 border-accent bg-accent/5 px-6 py-3 text-center">
              <p className="text-muted-foreground mb-1 text-xl">Khung giá tham khảo</p>
              <p className="font-serif text-xl font-bold text-accent md:text-lg">
                {formatVNDFull(r.priceLow)} – {formatVNDFull(r.priceHigh)}
              </p>
            </div>

            {/* Bảng điểm chi tiết */}
            <div className="mt-3 grid grid-cols-3 gap-2 w-full max-w-xs">
              <div className="rounded-lg border border-border bg-card px-2 py-2 text-center">
                <p className="text-xs text-muted-foreground">Điểm Chủng</p>
                <p className="font-serif font-bold text-foreground text-lg">{r.pricing.scoreChung}</p>
              </div>
              <div className="rounded-lg border border-border bg-card px-2 py-2 text-center">
                <p className="text-xs text-muted-foreground">Điểm Sắc</p>
                <p className="font-serif font-bold text-foreground text-lg">{r.pricing.scoreSac}</p>
              </div>
              <div className="rounded-lg border-2 border-accent bg-accent/10 px-2 py-2 text-center">
                <p className="text-xs text-muted-foreground">Q<sub>Jade</sub></p>
                <p className="font-serif font-bold text-accent text-lg">{r.pricing.qJade}</p>
              </div>
            </div>

            {/* Danh xưng phong kiến */}
            <p className="mt-3 text-center font-serif italic text-sm text-foreground max-w-xs">
              👑 {r.pricing.chungLabel}
            </p>
            <p className="text-center text-xs text-muted-foreground max-w-xs mt-1">
              {r.pricing.colorLabel}
            </p>
            <div className="mt-4 rounded-xl bg-gold/10 border border-gold/20 p-4 max-w-xs text-center">
              <p className="text-sm text-foreground">
                <span className="font-bold text-lg">Ngự phê:</span>{" "}
                <span className="font-serif italic text-base">{r.quote}</span>
              </p>
            </div>
          </div>

          {/* Right – Analysis sections */}
          <div className="space-y-5">
            <div>
              <p className="text-muted-foreground text-base">Chiếc vòng...</p>
              <h1 className="font-serif font-bold text-foreground text-3xl flex items-center gap-2 flex-wrap">
                {editingName ? (
                  <input
                    autoFocus
                    value={ringName}
                    onChange={(e) => setRingName(e.target.value)}
                    onBlur={() => setEditingName(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setEditingName(false);
                    }}
                    className="font-serif font-bold text-foreground text-3xl bg-transparent border-b-2 border-gold outline-none px-1 max-w-full"
                  />
                ) : (
                  <span>"{ringName}"</span>
                )}
                <button
                  aria-label="Đổi tên"
                  onClick={() => setEditingName((v) => !v)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <img src={iconEdit} alt="" className="h-9 w-9 md:h-10 md:w-10 object-contain inline-block" />
                </button>
              </h1>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="rounded-full border border-border px-3 py-1 text-muted-foreground text-base">#Sắc tím dịu dàng</span>
                <span className="rounded-full border border-border px-3 py-1 text-muted-foreground text-base">#Hoa bay yêu kiều</span>
              </div>
            </div>

            <div className="rounded-lg bg-foreground text-primary-foreground px-4 py-2 font-semibold inline-block text-base">
              Chỉ {r.rarity}% phỉ thúy trên thế giới đạt chủng này
            </div>

            {/* Analysis cards with green border */}
            <div className="space-y-4">
              <div className="rounded-lg border-2 border-accent/30 p-4 text-base">
                <p className="font-bold text-accent mb-1 text-lg">🔮 Cốt Ngọc</p>
                <p className="text-sm text-foreground leading-relaxed">{r.cotText}</p>
              </div>
              <div className="rounded-lg border-2 border-accent/30 p-4 text-base">
                <p className="font-bold text-accent mb-1 text-lg">🎨 Sắc Diện</p>
                <p className="text-sm text-foreground leading-relaxed">{r.sacText}</p>
              </div>
              <div className="rounded-lg border-2 border-accent/30 p-4 text-base">
                <p className="font-bold text-accent mb-1 text-lg">💎 Nội Tại</p>
                <p className="text-sm text-foreground leading-relaxed">{r.noiTaiText}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Phong kết cấu tier row */}
        <div className="mt-10">
          <h2 className="font-serif font-bold text-accent mb-4 text-left text-2xl">Phong kết cấu</h2>
          <div className="flex items-end justify-center gap-3 md:gap-6 overflow-x-auto pb-2">
            {TIERS.map((t, i) => {
              const isActive = i === r.tierIndex;
              return (
              <div
                key={t.key}
                className={`flex flex-col items-center text-center min-w-[100px] md:min-w-[120px] transition-all ${
                  isActive ? "opacity-100 scale-110" : "opacity-50 grayscale"
                }`}
              >
                <img
                  src={isActive ? t.icon : t.iconLocked}
                  alt={t.label}
                  className={`w-20 h-20 md:w-24 md:h-24 object-contain mb-2 ${isActive ? "animate-crown-glow" : ""}`}
                />
                <p className={`text-base md:text-lg font-bold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {t.label}
                </p>
                <p className={`text-sm md:text-base ${isActive ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                  {t.sub}
                </p>
              </div>
              );
            })}
          </div>
          <div className="h-px bg-border mt-4" />
        </div>

        {/* Warnings từ Pricing Engine */}
        {r.pricing.warnings.length > 0 && (
          <div className="mt-8 space-y-3">
            <h3 className="font-serif font-bold text-foreground text-xl">⚠️ Lưu ý quan trọng</h3>
            {r.pricing.warnings.map((w, i) => {
              const isRed = w.includes("nứt") || w.includes("Crack") || w.includes("Cảnh báo tài sản") || w.includes("Chưa có giấy");
              return (
                <div
                  key={i}
                  className={`rounded-lg border-l-4 p-4 text-sm leading-relaxed ${
                    isRed
                      ? "border-red-500 bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-200"
                      : "border-orange-400 bg-orange-50 text-orange-900 dark:bg-orange-950/30 dark:text-orange-200"
                  }`}
                >
                  {w}
                </div>
              );
            })}
          </div>
        )}

        {/* Action buttons - larger */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={handleDownload}
            disabled={downloading}
            aria-label="Tải xuống"
            className="rounded-full border-2 border-border p-4 hover:bg-muted transition-colors disabled:opacity-50"
          >
            <img src={iconDownload} alt="" className="h-9 w-9 md:h-10 md:w-10 object-contain" />
          </button>
          <button
            onClick={handleShare}
            aria-label="Chia sẻ"
            className="rounded-full border-2 border-border p-4 hover:bg-muted transition-colors"
          >
            <img src={iconShare} alt="" className="h-9 w-9 md:h-10 md:w-10 object-contain" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <button
            onClick={handleSaveToCop}
            disabled={saveToCop.isPending}
            className="rounded-lg border-2 border-accent bg-accent/10 px-6 py-3 font-semibold text-accent hover:bg-accent/20 transition-colors text-base disabled:opacity-60"
          >
            {saveToCop.isPending
              ? "Đang cất..."
              : savedCode
                ? `✓ Đã lưu (${savedCode})`
                : "Cất vào cốp"}
          </button>
          <button
            onClick={handleRestart}
            className="rounded-lg bg-gold px-6 py-3 font-bold text-primary-foreground hover:bg-gold-dark transition-colors text-base"
          >
            Kiểm tra Vòng khác
          </button>
        </div>

        {/* Bottom navigation */}
        <div className="flex items-center justify-between mt-8 text-sm">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors font-medium text-base">
            &lt;&lt;&lt; Về trang chủ
          </button>
          <button onClick={() => navigate("/cop-ngoc")} className="text-muted-foreground hover:text-foreground transition-colors font-medium text-base">
            Về cốp ngọc của bạn &gt;&gt;&gt;
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>*Disclaimer</strong>: Ngọc tùy duyên và giá cả phụ thuộc nhiều vào mắt nhìn của người bán/người mua. Giá trị trên chỉ đúng khi đây là ngọc tự nhiên 100% (Type A / ngọc tự nhiên không xử lý ép nhựa/nhuộm màu). Nếu người bán giục chốt đơn gấp, mập mờ trong việc hỗ trợ soi đèn viên, hoặc bạn với mức giá RẺ BẤT NGỜ so với định giá này... Hãy chậm lại!
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-3">
            Ngọc phỉ thúy luôn đi đôi with giấy kiểm định, tuyệt đối yêu cầu Giấy kiểm định (SJC, GIV, Liulab) trước khi chuyển tiền để tránh mua phải vòng type B, C. Nếu vòng của bạn bị xử lý, giá trị sẽ thấp hơn rất nhiều so với mức giá này.
          </p>
          <p className="text-right text-accent font-serif font-bold mt-4 text-lg">──── Hiểu ngọc</p>
        </div>
      </div>
    </div>
  );
};

export default Results;
