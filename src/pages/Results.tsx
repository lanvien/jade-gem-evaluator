import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Copy, Check, RotateCcw, Pencil, Download, Share2, Camera } from "lucide-react";
import { calculateJadePrice, buildJadeInputFromSurvey, formatVND } from "@/lib/pricingEngine";
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

const TIERS = [
  { key: "thuong-tai", name: "Thường Tại", sub: "Chúng đậu", icon: rankThuongTai, locked: rankThuongTaiLocked },
  { key: "quy-nhan",   name: "Quý Nhân",   sub: "Nếp mịn",   icon: rankQuyNhan,   locked: rankQuyNhanLocked },
  { key: "phi-tan",    name: "Phi Tần",    sub: "Nếp băng",  icon: rankPhiTan,    locked: rankPhiTanLocked },
  { key: "quy-phi",    name: "Quý Phi",    sub: "Băng",      icon: rankQuyPhi,    locked: rankQuyPhiLocked },
  { key: "hoang-hau",  name: "Hoàng Hậu",  sub: "Thuỷ tinh", icon: rankHoangHau,  locked: rankHoangHauLocked },
];

const TITLES: Record<string, { royal: string; tag1: string; tag2: string }> = {
  "thuong-tai": { royal: "Thường tại hiện tại", tag1: "#Sắc dịu nhẹ",  tag2: "#Mộc mạc thanh tao" },
  "quy-nhan":   { royal: "Quý nhân hiện tại",   tag1: "#Sắc ấm áp",    tag2: "#Ôn nhu hiền thục" },
  "phi-tan":    { royal: "Ái phi hiện tại",     tag1: "#Sắc tím dịu dàng", tag2: "#Hoa bay yêu kiều" },
  "quy-phi":    { royal: "Quý phi hiện tại",    tag1: "#Sắc lục vượng khí", tag2: "#Băng tâm ngọc khiết" },
  "hoang-hau":  { royal: "Hoàng hậu hiện tại",  tag1: "#Sắc đế vương",  tag2: "#Mẫu nghi thiên hạ" },
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
  let r: ReturnType<typeof computeResults> | null = null;
  try { r = computeResults(surveyData); } catch { /* noop */ }

  const ringCode = useMemo(
    () => String(Math.floor(10000 + Math.random() * 90000)),
    [],
  );
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
    if (!r) return;
    saveToCop(
      { nickname: ringCode, input: buildJadeInputFromSurvey(surveyData), result: r.pricing },
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
        chungPeak: aiCtx?.chungPeak || r.pricing.chungLabel,
        chungBase: r.pricing.chungLabel,
        baseColor: r.pricing.colorLabel,
        toneLevel: r.pricing.scoreSac,
        flaws: r.pricing.warnings || [],
        shape: surveyData.answers?.[7] || "—",
        estimatedPrice: `${formatVND(r.priceLow)} – ${formatVND(r.priceHigh)}`,
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

  if (!r) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chưa có dữ liệu khảo sát.</p>
      </div>
    );
  }

  const title = TITLES[r.tier.key] ?? TITLES["phi-tan"];

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
            {/* Crown badge overlay */}
            <img
              src={r.tier.icon}
              alt={r.tier.name}
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
                {r.tier.name.toUpperCase()} – {r.tier.sub.toUpperCase()}
              </p>
            </div>

            <div className="mt-5 text-center">
              <p className="text-sm text-gold">Khung giá tham khảo</p>
              <p className="font-serif text-lg md:text-xl font-bold text-gold mt-1">
                {formatVND(r.priceLow)} – {formatVND(r.priceHigh)}
              </p>
            </div>

            <div className="mt-6 rounded-md border border-gold/40 bg-gold/10 p-4">
              <p className="text-sm leading-relaxed text-foreground/85 text-center">
                <span className="font-semibold">Ngự phê:</span>{" "}
                <span className="italic">"{r.quote.replace(/[😊😀😉🙂✨]/g, "").trim()}"</span>
              </p>
            </div>
          </div>

          {/* RIGHT — Narrative */}
          <div>
            <p className="font-serif text-xl md:text-2xl text-foreground/70 italic">Chiếc vòng…</p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2 mt-1">
              "{title.royal}"
              <Pencil className="h-5 w-5 text-foreground/40" />
            </h1>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 rounded-md bg-gold/15 border border-gold/40 text-xs md:text-sm text-gold-dark font-medium">{title.tag1}</span>
              <span className="px-3 py-1 rounded-md bg-gold/15 border border-gold/40 text-xs md:text-sm text-gold-dark font-medium">{title.tag2}</span>
            </div>

            <div className="mt-4 rounded-md border-2 border-gold/60 bg-gold/10 px-4 py-2.5 text-center">
              <p className="font-semibold text-foreground text-sm md:text-base">{RARITY[r.tier.key]}</p>
            </div>

            <ul className="mt-6 space-y-4 text-sm md:text-base leading-relaxed text-foreground/85">
              <li className="flex gap-2">
                <span className="text-gold mt-1.5">•</span>
                <p><strong className="text-foreground">Cốt Ngọc</strong>: {r.cotText.replace(/^Phẩm ngọc đạt /, "Phẩm ngọc đạt ")}</p>
              </li>
              <li className="flex gap-2">
                <span className="text-gold mt-1.5">•</span>
                <p><strong className="text-foreground">Sắc Diện</strong>: {r.sacText.replace(/^Sở hữu sắc diện: /, "Sở hữu ")}</p>
              </li>
              <li className="flex gap-2">
                <span className="text-gold mt-1.5">•</span>
                <p><strong className="text-foreground">Nội tại</strong>: {r.noiTaiText}</p>
              </li>
            </ul>
          </div>
        </div>

        {/* PHONG KẾT CẤU timeline */}
        <section className="mt-14">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gold mb-6">Phong kết cấu</h2>
          <div className="grid grid-cols-5 gap-3 md:gap-6">
            {TIERS.map((t, i) => {
              const active = i === r!.tierIndex;
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

function computeResults(data: any) {
  const numberInputs = data.numberInputs || {};

  const jadeInput = buildJadeInputFromSurvey({
    ...data,
    ni: parseFloat(data.numberInputs?.[9]) || 56,    // key 9 = ni vòng
    chot: parseFloat(data.numberInputs?.[11]) || 8,  // key 11 = chột
  });
  const pricing = calculateJadePrice(jadeInput);

  const chungToTier: Record<string, number> = {
    "Đậu thô": 0,
    "Đậu mịn": 0,
    "Nếp Mịn": 1,
    "Nếp Hóa": 2,
    "Nếp Băng": 3, 
    "Băng": 3,
    "Băng Thủy": 4,
    "Thủy tinh": 4,
  };

  const tierIndex = chungToTier[jadeInput.chungPeak] ?? 0;

  const tier = TIERS[tierIndex];

  const cotText = `Phẩm ngọc đạt ${pricing.chungLabel}. ${
    pricing.scoreChung >= 75
      ? "Cấu trúc liên kết chặt chẽ, chất ngọc mướt mát, ngậm nước như sương sớm. Lựa chọn hoàn mỹ cho những ai tìm kiếm chiều sâu của ngọc với một mức ngân sách tối ưu."
      : pricing.scoreChung >= 50
      ? "Hạt tinh thể mịn, ánh ngọc êm dịu. Phân khúc trung-cao, phù hợp đeo hàng ngày."
      : "Hạt tinh thể rõ nét, vẻ đẹp thuần mộc. Thích hợp cho người mới tìm hiểu ngọc."
  }`;

  const sacText = `dải màu ${pricing.colorLabel}. ${
    pricing.scoreSac >= 80
      ? "Không màng đến sự rập khuôn vô hồn, chính những vệt hoa bay đã thổi hồn vào khối đá, tạo nên một tuyệt tác thiên nhiên duy nhất và không thể sao chép."
      : pricing.scoreSac >= 50
      ? "Màu sắc dịu dàng, thanh nhã, đem lại cảm giác thư thái khi ngắm nhìn."
      : "Màu sắc nhạt, nhã nhặn — phong cách tối giản, dễ phối đồ."
  }`;

  const hasStructuralFlaw = pricing.warnings.some(
    (w: string) => w.includes("nứt") || w.includes("Crack") || w.includes("Sớ"),
  );
  const noiTaiText = hasStructuralFlaw
    ? "Ngọc quý ắt trải qua phong hóa, giữ lại chút tỳ vết là lẽ thường tình. Sự xuất hiện của một vài vết sớ nhỏ chính là lời khẳng định mạnh mẽ nhất về nguồn gốc tự nhiên. Đây không chỉ là nét độc bản, mà còn là chìa khóa vàng để bạn làm chủ cuộc thương lượng (kỳ vọng giảm 15-20% giá)."
    : "Ngọc sạch, ít tạp chất. Bề mặt và nội tại đạt tiêu chuẩn tốt cho phân khúc này — một viên ngọc thuần khiết khó tìm.";

  const quotes: Record<string, string> = {
    "thuong-tai": "Nhan sắc thanh tú, an phận thủ thường, phù hợp để đeo cày deadline mỗi ngày.",
    "quy-nhan":   "Ôn nhu hiền thục, sắc ngọc đoan trang — xứng danh người biết chọn ngọc.",
    "phi-tan":    "Sắc ngọc yêu kiều, phong thái kiêu sa — thu hút mọi ánh nhìn từ cái nhìn đầu tiên.",
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
