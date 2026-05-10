import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Copy, Check, RotateCcw } from "lucide-react";
import { calculateJadePrice, buildJadeInputFromSurvey, formatVND } from "@/lib/pricingEngine";
import { useSaveToCop } from "@/lib/copNgoc";
import { resetAssessmentSession } from "@/lib/resetAssessment";
import { addToVault, buildSegments, nanoId } from "@/lib/jadeVault";
import { flyToVault } from "@/components/jadevault/flyToVault";
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

const TIERS = [
  { key: "thuong-tai", name: "Thường Tại", icon: rankThuongTai, locked: rankThuongTaiLocked },
  { key: "quy-nhan",   name: "Quý Nhân",   icon: rankQuyNhan,   locked: rankQuyNhanLocked },
  { key: "phi-tan",    name: "Phi Tần",    icon: rankPhiTan,    locked: rankPhiTanLocked },
  { key: "quy-phi",    name: "Quý Phi",    icon: rankQuyPhi,    locked: rankQuyPhiLocked },
  { key: "hoang-hau",  name: "Hoàng Hậu",  icon: rankHoangHau,  locked: rankHoangHauLocked },
];

// Crown size scales with tier — Hoàng Hậu largest
const CROWN_SIZES = [
  "w-40 md:w-52",   // Thường Tại
  "w-52 md:w-64",   // Quý Nhân
  "w-64 md:w-80",   // Phi Tần
  "w-80 md:w-96",   // Quý Phi
  "w-96 md:w-[28rem]", // Hoàng Hậu
];

export default function Results() {
  const navigate = useNavigate();
  const surveyData = useMemo(
    () => JSON.parse(localStorage.getItem("jade-survey-data") || "{}"),
    [],
  );
  let r: ReturnType<typeof computeResults> | null = null;
  try { r = computeResults(surveyData); } catch (e) { /* noop */ }

  const ringCode = useMemo(
    () => `NGOC-${Math.floor(1000 + Math.random() * 9000)}`,
    [],
  );
  const [copied, setCopied] = useState(false);
  const { mutate: saveToCop, isPending } = useSaveToCop();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ringCode);
      setCopied(true);
      toast.success("Đã copy mã cốp!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Không copy được, hãy chép tay nhé.");
    }
  };

  const handleRestart = () => {
    resetAssessmentSession();
    navigate("/assessment");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <Link to="/" className="font-serif text-xl md:text-2xl font-bold text-gold hover:opacity-80 transition-opacity">
            ← Hiểu Ngọc
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 md:py-14 max-w-3xl">
        {/* Crown above title */}
        {r && (
          <div className="flex flex-col items-center text-center">
            <img
              src={r.tier.icon}
              alt={`Vương miện ${r.tier.name}`}
              className={`${CROWN_SIZES[r.tierIndex]} h-auto object-contain animate-fade-in-up drop-shadow-[0_8px_24px_rgba(192,149,76,0.35)]`}
            />
            <p className="mt-4 text-sm tracking-[0.3em] uppercase text-gold font-semibold">
              Phẩm cấp
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mt-1">
              {r.tier.name}
            </h2>
          </div>
        )}

        <h1 className="font-serif text-2xl md:text-3xl font-bold text-center mt-10 mb-6">
          Kết quả định giá
        </h1>

        {r ? (
          <div className="space-y-6">
            {/* Vault code with copy */}
            <div className="flex items-center justify-center gap-3 rounded-xl border-2 border-gold/40 bg-gold/5 px-5 py-4">
              <span className="text-sm md:text-base text-muted-foreground">Mã cốp:</span>
              <span className="font-mono text-lg md:text-2xl font-bold text-gold tracking-wider">
                {ringCode}
              </span>
              <button
                onClick={handleCopy}
                aria-label="Copy mã cốp"
                className="ml-1 inline-flex items-center justify-center rounded-lg border-2 border-gold bg-background hover:bg-gold hover:text-primary-foreground transition-colors p-2.5"
              >
                {copied
                  ? <Check className="h-5 w-5 md:h-6 md:w-6 text-gold-dark" strokeWidth={2.5} />
                  : <Copy className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.5} />}
              </button>
            </div>

            <div className="text-center rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground mb-2">Định giá tham khảo</p>
              <p className="text-2xl md:text-4xl font-bold text-gold">
                {formatVND(r.priceLow)} – {formatVND(r.priceHigh)}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 md:p-6 space-y-3 text-sm md:text-base leading-relaxed">
              <p>{r.cotText}</p>
              <p>{r.sacText}</p>
              <p>{r.noiTaiText}</p>
              <p className="font-serif italic text-gold pt-2">{r.quote}</p>
            </div>

            {/* Tier timeline */}
            <div className="rounded-xl border border-border bg-card p-5 md:p-6">
              <p className="text-center text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">
                5 phẩm cấp
              </p>
              <div className="grid grid-cols-5 gap-2">
                {TIERS.map((t, i) => {
                  const active = i === r!.tierIndex;
                  return (
                    <div key={t.key} className="flex flex-col items-center gap-1">
                      <img
                        src={active ? t.icon : t.locked}
                        alt={t.name}
                        className={`w-full h-auto object-contain transition-all ${
                          active ? "drop-shadow-[0_4px_12px_rgba(192,149,76,0.5)] scale-110" : "opacity-50"
                        }`}
                      />
                      <p className={`text-[10px] md:text-xs text-center font-semibold ${active ? "text-gold" : "text-muted-foreground"}`}>
                        {t.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                // 1) Save to Supabase Cốp Ngọc (existing behavior)
                saveToCop(
                  {
                    nickname: ringCode,
                    input: buildJadeInputFromSurvey(surveyData),
                    result: r!.pricing,
                  },
                  {
                    onError: (e: any) => toast.error(e?.message ?? "Lỗi khi lưu cloud"),
                  },
                );
                // 2) Save to local Jade Vault + fly animation
                const segments = buildSegments(
                  surveyData.ringColors || [],
                  surveyData.colorTones || {},
                );
                const aiCtx = (() => {
                  try { return JSON.parse(localStorage.getItem("jade-ai-vision-ctx") || "{}"); }
                  catch { return {}; }
                })();
                const existingCount = (() => {
                  try { return (JSON.parse(localStorage.getItem("jadeVault") || "[]") || []).length; }
                  catch { return 0; }
                })();
                const item = {
                  id: nanoId(8),
                  createdAt: new Date().toISOString(),
                  name: `Vòng #${existingCount + 1}`,
                  notes: "",
                  segments,
                  hasPhieuHoa: !!aiCtx?.hasPhieuHoa,
                  isMuna: !!aiCtx?.isMuna,
                  assessment: {
                    chungPeak: aiCtx?.chungPeak || r!.pricing.chungLabel,
                    chungBase: r!.pricing.chungLabel,
                    baseColor: r!.pricing.colorLabel,
                    toneLevel: r!.pricing.scoreSac,
                    flaws: r!.pricing.warnings || [],
                    shape: surveyData.answers?.[7] || "—",
                    estimatedPrice: `${formatVND(r!.priceLow)} – ${formatVND(r!.priceHigh)}`,
                    ringCode,
                  },
                };
                addToVault(item);
                flyToVault({
                  segments,
                  hasPhieuHoa: item.hasPhieuHoa,
                  isMuna: item.isMuna,
                  onArrive: () => toast.success("Đã cất vào Cốp Ngọc ✨"),
                });
              }}
              disabled={isPending}
              className="w-full rounded-full bg-gold py-3.5 font-bold text-primary-foreground hover:bg-gold-dark transition-colors disabled:opacity-50"
            >
              🏺 Cất vào Cốp Ngọc
            </button>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Chưa có dữ liệu khảo sát.</p>
        )}

        {/* Restart footer */}
        <div className="mt-12 pt-8 border-t border-border flex justify-center">
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Định giá vòng khác
          </button>
        </div>
      </main>
    </div>
  );
}

function computeResults(data: any) {
  const numberInputs = data.numberInputs || {};

  const jadeInput = buildJadeInputFromSurvey(data);
  const pricing = calculateJadePrice(jadeInput);

  let tierIndex = 0;
  if (pricing.qJade >= 92)      tierIndex = 4;
  else if (pricing.qJade >= 82) tierIndex = 3;
  else if (pricing.qJade >= 70) tierIndex = 2;
  else if (pricing.qJade >= 55) tierIndex = 1;

  const tier = TIERS[tierIndex];

  const cotText = `Phẩm ngọc đạt ${pricing.chungLabel}. ${
    pricing.scoreChung >= 75
      ? "Cấu trúc liên kết chặt chẽ, chất ngọc mướt mát, ngậm nước như sương sớm."
      : pricing.scoreChung >= 50
      ? "Hạt tinh thể mịn, ánh ngọc êm dịu. Phân khúc trung-cao, phù hợp đeo hàng ngày."
      : "Hạt tinh thể rõ nét, vẻ đẹp thuần mộc. Thích hợp cho người mới tìm hiểu ngọc."
  }`;

  const sacText = `Sở hữu sắc diện: ${pricing.colorLabel}. ${
    pricing.scoreSac >= 80
      ? "Màu sắc tươi tắn, vượng khí — tuyệt tác thiên nhiên không thể sao chép."
      : pricing.scoreSac >= 50
      ? "Màu sắc dịu dàng, thanh nhã, đem lại cảm giác thư thái khi ngắm nhìn."
      : "Màu sắc nhạt, nhã nhặn — phong cách tối giản, dễ phối đồ."
  }`;

  const hasStructuralFlaw = pricing.warnings.some(
    (w: string) => w.includes("nứt") || w.includes("Crack") || w.includes("Sớ"),
  );
  const noiTaiText = hasStructuralFlaw
    ? "Vết sớ tự nhiên là bằng chứng nguồn gốc — chìa khóa để thương lượng (giảm 15-20% giá kỳ vọng)."
    : "Ngọc sạch, ít tạp chất. Bề mặt và nội tại đạt tiêu chuẩn tốt cho phân khúc này.";

  const quotes: Record<string, string> = {
    "thuong-tai": "Nhan sắc thanh tú, an phận thủ thường — phù hợp đeo cày deadline mỗi ngày. 😊",
    "quy-nhan":   "Ôn nhu hiền thục, sắc ngọc đoan trang — xứng danh người biết chọn ngọc.",
    "phi-tan":    "Phi tần kiều diễm, sắc ngọc vẹn toàn — xứng đáng chiếm trọn ánh nhìn.",
    "quy-phi":    "Quý phái tựa ngọc trong sương, sắc đẹp khiến người ta phải ngoái nhìn.",
    "hoang-hau":  "Mẫu nghi thiên hạ, ngọc quý hiếm có — xứng danh bảo vật truyền đời.",
  };

  const diameter = parseFloat(numberInputs[9] || numberInputs[11]) || 56;
  const thickness = parseFloat(numberInputs[11] || numberInputs[13]) || 8;

  return {
    tier,
    tierIndex,
    priceLow:  pricing.minPrice,
    priceHigh: pricing.maxPrice,
    cotText,
    sacText,
    noiTaiText,
    quote: quotes[tier.key] ?? quotes["phi-tan"],
    diameter,
    thickness,
    pricing,
  };
}
