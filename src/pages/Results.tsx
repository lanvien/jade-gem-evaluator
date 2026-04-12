import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { questions } from "@/data/questions";
import { Download, Share2, Camera } from "lucide-react";

/* ── Grading / Pricing Engine ── */

const TIERS = [
  { key: "thuong-tai", label: "Thường tại", sub: "Chủng đậu", minScore: 0, basePrice: [1_000_000, 3_000_000] },
  { key: "quy-nhan", label: "Quý nhân", sub: "Nếp mịn", minScore: 0.55, basePrice: [3_000_000, 8_000_000] },
  { key: "phi-tan", label: "Phi tần", sub: "Nếp băng", minScore: 0.7, basePrice: [5_000_000, 15_000_000] },
  { key: "quy-phi", label: "Quý phi", sub: "Băng", minScore: 0.82, basePrice: [12_000_000, 35_000_000] },
  { key: "hoang-hau", label: "Hoàng hậu", sub: "Thủy tinh", minScore: 0.92, basePrice: [30_000_000, 100_000_000] },
];

const TIER_ICONS = ["🏠", "👑", "👸", "💎", "🏆"];

function computeResults(data: any) {
  const answers = data.answers || {};
  const numberInputs = data.numberInputs || {};

  // Calculate weighted score from multipliers
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

  // Determine tier
  let tierIndex = 0;
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (avgScore >= TIERS[i].minScore) {
      tierIndex = i;
      break;
    }
  }
  const tier = TIERS[tierIndex];

  // Volume coefficient from diameter & thickness
  const diameter = parseFloat(numberInputs[11]) || 56;
  const thickness = parseFloat(numberInputs[13]) || 8;
  const volumeCoeff = ((diameter * thickness) / (56 * 8)); // normalized to standard 56mm/8mm

  // Price range adjusted by volume
  const priceLow = Math.round(tier.basePrice[0] * volumeCoeff / 100_000) * 100_000;
  const priceHigh = Math.round(tier.basePrice[1] * volumeCoeff / 100_000) * 100_000;

  // Rarity percentage
  const rarity = tierIndex === 0 ? 60 : tierIndex === 1 ? 35 : tierIndex === 2 ? 15 : tierIndex === 3 ? 7 : 3;

  // Generate analysis texts
  const cotAnswer = answers[1];
  const cotText = cotAnswer === "1a"
    ? "Phẩm ngọc đạt chủng Nếp Băng. Cấu trúc liên kết chặt chẽ, chất ngọc mướt mát, ngậm nước như sương sớm. Lựa chọn hoàn mỹ cho những ai tìm kiếm chiều sâu của ngọc với một mức ngân sách tối ưu."
    : cotAnswer === "1b"
    ? "Phẩm ngọc đạt chủng Nếp. Hạt tinh thể mịn, ánh ngọc êm dịu. Đây là mức chất lượng phổ biến ở phân khúc trung – cao, phù hợp để đeo hàng ngày."
    : "Phẩm ngọc đạt chủng Đậu. Hạt tinh thể nhìn rõ, thích hợp cho người mới bắt đầu tìm hiểu ngọc.";

  const sacAnswer = answers[5];
  const sacText = sacAnswer === "5a"
    ? "Sở hữu dải màu Lục tươi vượng khí. Không màng đến sự rập khuôn vô hồn, chính những vệt hoa bay đã thổi hồn vào khối đá, tạo nên một tuyệt tác thiên nhiên duy nhất và không thể sao chép."
    : sacAnswer === "5b"
    ? "Màu sắc ở mức trung bình, đều đặn. Sắc diện dễ chịu, phù hợp phong cách thanh lịch kín đáo."
    : "Màu sắc nhạt, phớt. Phù hợp cho người thích phong cách tối giản, nhẹ nhàng.";

  const noiTaiText = data.subChecks?.[9]
    ? "Ngọc quý ắt trải qua phong hóa, giữ lại chút tỳ vết là lẽ thường tình. Sự xuất hiện của một vài vết sơ nhỏ chính là lời khẳng định mạnh mẽ nhất về nguồn gốc tự nhiên. Đây không chỉ là nét độc bản, mà còn là chìa khóa vàng để bạn làm chủ cuộc thương lượng (kỳ vọng giảm 15-20% giá)."
    : "Ngọc sạch, ít tạp chất. Bề mặt và nội tại đạt tiêu chuẩn tốt cho phân khúc này.";

  // Personality quote
  const quotes: Record<string, string> = {
    "thuong-tai": "Nhan sắc thanh tú, an phận thủ thường, phù hợp để đeo cày deadline mỗi ngày. 😊",
    "quy-nhan": "Ôn nhu hiền thục, sắc ngọc đoan trang – xứng danh người biết chọn ngọc.",
    "phi-tan": "Nhan sắc thanh tú, an phận thủ thường, phù hợp để đeo cày deadline mỗi ngày. 😊",
    "quy-phi": "Quý phái tựa ngọc trong sương, sắc đẹp khiến người ta phải ngoái nhìn.",
    "hoang-hau": "Mẫu nghi thiên hạ, ngọc quý hiếm có – xứng danh bảo vật truyền đời.",
  };

  return {
    tier,
    tierIndex,
    avgScore,
    priceLow,
    priceHigh,
    rarity,
    cotText,
    sacText,
    noiTaiText,
    quote: quotes[tier.key] || quotes["phi-tan"],
    diameter,
    thickness,
    answeredCount: Object.keys(answers).length + Object.keys(numberInputs).length,
  };
}

function formatVND(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)} triệu`;
  return n.toLocaleString("vi-VN");
}

function formatVNDFull(n: number) {
  return n.toLocaleString("vi-VN") + " VNĐ";
}

/* ── Loading Screen ── */
const ResultsLoading = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center animate-fade-in-up bg-background">
      <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-6" />
      <p className="text-lg font-bold text-foreground mb-6">Đang kiểm tra chứng thư...</p>
      <p className="font-serif italic text-base text-foreground max-w-md leading-relaxed">
        Ngọc luôn đi đôi với giấy kiểm định. Đừng mua ngọc nếu không có giấy kiểm định từ các trung tâm uy tín như SJC, Liulab hay GIV
      </p>
    </div>
  );
};

/* ── Main Results Page ── */
const Results = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("jade-survey-data");
    if (data) setSurveyData(JSON.parse(data));
  }, []);

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
    localStorage.removeItem("jade-ring-colors");
    localStorage.removeItem("jade-number-inputs");
    localStorage.removeItem("jade-sub-checks");
    localStorage.removeItem("jade-survey-data");
    navigate("/assessment");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <p className="font-serif text-lg font-bold text-accent">Hiểu ngọc <span className="text-muted-foreground">───</span></p>
        <div className="flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground">
          Mã tú nữ: <span className="font-bold text-foreground">#{String(Date.now()).slice(-5)}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 max-w-4xl animate-fade-in-up">
        {/* Main result card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {/* Left – Ring visualization */}
          <div className="flex flex-col items-center">
            {/* Decorative crown */}
            <p className="text-4xl mb-2">👑</p>
            <div className="relative w-64 h-64 rounded-xl border-2 border-dashed border-border bg-card flex items-center justify-center">
              {/* SVG Ring from survey data */}
              <svg viewBox="0 0 200 200" className="w-48 h-48">
                <circle cx="100" cy="100" r="80" fill="none" stroke="hsl(var(--border))" strokeWidth="24" />
                {(surveyData.ringColors || []).map((color: string, i: number) => {
                  const angle = (i * 360) / 12;
                  const endAngle = ((i + 1) * 360) / 12;
                  const startRad = ((angle - 90) * Math.PI) / 180;
                  const endRad = ((endAngle - 90) * Math.PI) / 180;
                  const r = 80;
                  const x1 = 100 + r * Math.cos(startRad);
                  const y1 = 100 + r * Math.sin(startRad);
                  const x2 = 100 + r * Math.cos(endRad);
                  const y2 = 100 + r * Math.sin(endRad);
                  const innerR = 56;
                  const x3 = 100 + innerR * Math.cos(endRad);
                  const y3 = 100 + innerR * Math.sin(endRad);
                  const x4 = 100 + innerR * Math.cos(startRad);
                  const y4 = 100 + innerR * Math.sin(startRad);
                  return (
                    <path
                      key={i}
                      d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`}
                      fill={color}
                      stroke="hsl(var(--foreground))"
                      strokeWidth="0.5"
                    />
                  );
                })}
              </svg>
              <button className="absolute bottom-2 right-2 text-muted-foreground hover:text-foreground">
                <Camera className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mt-4">Danh xưng hiện tại</p>
            <p className="font-serif text-xl font-bold text-foreground uppercase tracking-wide">
              {r.tier.label} – {r.tier.sub}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Khung giá tham khảo</p>
            <p className="font-serif text-2xl font-bold text-accent">
              {formatVNDFull(r.priceLow)} - {formatVNDFull(r.priceHigh)}
            </p>

            {/* Personality quote */}
            <div className="mt-4 rounded-xl bg-gold/10 border border-gold/20 p-4 max-w-xs text-center">
              <p className="text-sm text-foreground">
                <span className="font-bold">Ngự phê:</span>{" "}
                <span className="font-serif italic">{r.quote}</span>
              </p>
            </div>
          </div>

          {/* Right – Analysis */}
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm">Chiếc vòng...</p>
              <h1 className="font-serif text-3xl font-bold text-foreground">"Ái phi hiện tại" ✏️</h1>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">#Sắc tím dịu dàng</span>
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">#Hoa bay yêu kiều</span>
              </div>
            </div>

            <div className="rounded-lg bg-foreground text-primary-foreground px-4 py-2 text-sm font-semibold inline-block">
              Chỉ {r.rarity}% phỉ thúy trên thế giới đạt chủng này
            </div>

            <ul className="space-y-4 text-sm text-foreground leading-relaxed">
              <li>
                <strong>Cốt Ngọc</strong>: {r.cotText}
              </li>
              <li>
                <strong>Sắc Diện</strong>: {r.sacText}
              </li>
              <li>
                <strong>Nội tại</strong>: {r.noiTaiText}
              </li>
            </ul>
          </div>
        </div>

        {/* Phong kết cấu tier row */}
        <div className="mt-10">
          <h2 className="font-serif text-xl font-bold text-accent mb-4">Phong kết cấu</h2>
          <div className="flex items-end justify-between gap-2 overflow-x-auto pb-2">
            {TIERS.map((t, i) => (
              <div
                key={t.key}
                className={`flex flex-col items-center text-center min-w-[80px] ${
                  i === r.tierIndex ? "opacity-100" : "opacity-40"
                }`}
              >
                <span className="text-3xl mb-1">{TIER_ICONS[i]}</span>
                <p className={`text-xs font-bold ${i === r.tierIndex ? "text-foreground" : "text-muted-foreground"}`}>
                  {t.label}
                </p>
                <p className={`text-xs ${i === r.tierIndex ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                  {t.sub}
                </p>
              </div>
            ))}
          </div>
          <div className="h-px bg-border mt-4" />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="flex gap-2">
            <button className="rounded-full border border-border p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Download className="h-5 w-5" />
            </button>
            <button className="rounded-full border border-border p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <button
            onClick={handleRestart}
            className="rounded-lg bg-gold px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-gold-dark transition-colors"
          >
            Kiểm tra Vòng khác
          </button>
          <button
            className="rounded-lg border-2 border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Lưu về cốp ngọc của bạn
          </button>
        </div>

        {/* Bottom navigation */}
        <div className="flex items-center justify-between mt-8 text-sm">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
            &lt;&lt;&lt; Về trang chủ
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            Về cốp ngọc của bạn &gt;&gt;&gt;
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>*Disclaimer</strong>: Ngọc tùy duyên và giá cả phụ thuộc nhiều vào mắt nhìn của người bán/người mua. Giá trị trên chỉ đúng khi đây là ngọc tự nhiên 100% (Type A / ngọc tự nhiên không xử lý ép nhựa/nhuộm màu). Nếu người bán giục chốt đơn gấp, mập mờ trong việc hỗ trợ soi đèn viên, hoặc bạn với mức giá RẺ BẤT NGỜ so với định giá này... Hãy chậm lại!
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-3">
            Ngọc phỉ thúy luôn đi đôi với giấy kiểm định, tuyệt đối yêu cầu Giấy kiểm định (SJC, GIV, Liulab) trước khi chuyển tiền để tránh mua phải vòng type B, C. Nếu vòng của bạn bị xử lý, giá trị sẽ thấp hơn rất nhiều so với mức giá này.
          </p>
          <p className="text-right text-xs text-accent font-serif font-bold mt-4">──── Hiểu ngọc</p>
        </div>
      </div>
    </div>
  );
};

export default Results;
