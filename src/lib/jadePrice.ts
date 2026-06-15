// ═══════════════════════════════════════════
// JADE PRICING ENGINE v2 — từ Gemini JSON → VNĐ
// ═══════════════════════════════════════════

const HUE_SCORE: Record<string, number> = {
  "Đế Vương Lục": 100, "Chính Dương Lục": 98, "Xanh Cay": 95,
  "Lục Táo": 88, "Xanh Ngọt": 82, "Thanh Thủy Lục": 75,
  "Đậu Lục": 70, "Du Thanh": 50, "Hồi Lục": 42, "Mặc Thúy": 60,
  "Bạch Đế Thanh": 80, "Hoa Thanh": 72, "Can Thanh": 65,
  "Tử La Lan": 85, "Tím Cà": 80, "Tím Lam": 70,
  "Lam Thiên Không": 78, "Lam Thanh": 65, "Lão Lam Thủy": 60,
  "Hồng Phỉ": 75, "Hoàng Tông Phỉ": 68, "Phấn Hồng": 80,
  "Bạch Nguyệt Quang": 35, "Vô Sắc": 30, "Bạch Sắc": 32,
  "Xương Gà Đen": 45,
  "Xám": 20,
};

const CHUNG_SCORE: Record<string, number> = {
  "Đậu thô": 12,
  "Đậu mịn": 28,
  "Nếp Mịn": 52,
  "Nếp Hóa": 68,
  "Nếp Băng": 85,
};

const V_BASE: Record<string, number> = {
  "Đậu thô":   500_000,
  "Đậu mịn":   1_500_000,
  "Nếp Mịn":   3_000_000,
  "Nếp Hóa":   12_000_000,
  "Nếp Băng":  45_000_000,
};

const HARD_CAP: Record<string, number> = {
  "Đậu thô":   2_000_000,
  "Đậu mịn":   8_000_000,
  "Nếp Mịn":   35_000_000,
  "Nếp Hóa":   70_000_000,
  "Nếp Băng":  250_000_000,
};

const COVERAGE_W: Record<number, number> = { 1: 1.0, 2: 0.85, 3: 0.72, 4: 0.55 };
const TONE_W: Record<number, number> = { 1: 0.2, 2: 0.45, 3: 0.75, 4: 1.0, 5: 0.88 };

const FLAW_W: Record<string, number> = {
  "Không lỗi": 1.0,
  "Vân ngọc": 1.0,
  "Sớ bông / Gân già": 0.93,
  "Chỉ màu / Gân non / Sớ âm / Sớ dọc": 0.88,
  "Sớ âm dài / Sớ cấn / Mắt cát / Sần lõm": 0.80,
  "Sớ dọc dài / Sớ lưỡi gà": 0.72,
  "Sớ chéo / Sớ ngang": 0.55,
  "Vết nứt (Crack)": 0.40,
};

const SHAPE_W: Record<string, number> = {
  "Bản Đũa": 1.003,
  "Bản Dẹt": 1.0,
  "Bản Vuông": 1.0,
  "Khắc Hoa": 0.90,
};

export interface GeminiResult {
  chungPeak: string;
  chungBase?: string;
  coverageLevel: number;
  baseColor: string;
  accentColors: string[];
  toneLevel: number;
  valuableSegments: number;
  flaws: string[];
  shape: string;
  vision_notes: {
    hasPhieuHoa?: boolean;
    overallConfidence: number;
    colorUncertainty?: string;
    flawUncertainty?: string;
    [k: string]: any;
  };
}

export interface PricingOutput {
  priceEstimate: number;
  priceLow: number;
  priceHigh: number;
  qJade: number;
  sacScore: number;
  chungScore: number;
  colorMultiplier: number;
  flawMultiplier: number;
  bonuses: string[];
  warnings: string[];
  danhXung: string;
  truongPhai: string;
  confidence: number;
  axes: { trong: number; sac: number; lanh: number; damTay: number; thamMy: number };
}

export function calcJadePrice(g: GeminiResult): PricingOutput {
  const chung = g.chungPeak;
  const bonuses: string[] = [];
  const warnings: string[] = [];

  const chungBase = CHUNG_SCORE[chung] ?? 12;
  const coverageW = COVERAGE_W[g.coverageLevel] ?? 0.65;
  const adjChung = chungBase * coverageW;

  const allColors = [g.baseColor, ...(g.accentColors || [])].filter(Boolean);
  let maxHue = 0;
  allColors.forEach(c => {
    const s = HUE_SCORE[c] ?? 20;
    if (s > maxHue) maxHue = s;
  });

  const toneW = TONE_W[g.toneLevel] ?? 0.75;
  let layoutH = 1.0;
  if (g.vision_notes?.hasPhieuHoa) layoutH = 0.85;
  else if (g.valuableSegments <= 2) layoutH = 0.6;
  else if (g.valuableSegments <= 5) layoutH = 0.8;
  else if (g.valuableSegments <= 9) layoutH = 0.9;

  let sacScore = maxHue * toneW * layoutH;

  const LUC_GREENS = ["Đế Vương Lục","Chính Dương Lục","Xanh Cay","Lục Táo","Xanh Ngọt",
    "Thanh Thủy Lục","Đậu Lục","Bạch Đế Thanh","Hoa Thanh"];
  const hasLuc = allColors.some(c => HUE_SCORE[c] >= 70 && LUC_GREENS.includes(c));
  const hasTim = allColors.some(c => ["Tử La Lan","Tím Cà","Tím Lam"].includes(c));
  if (hasLuc && hasTim) {
    sacScore += 15;
    bonuses.push("✨ Xuân Đới Tài — Lục + Tím cực hiếm (+15 điểm)");
  }

  let qJade: number;
  if (g.toneLevel <= 2) qJade = adjChung * 0.70 + sacScore * 0.30;
  else if (g.toneLevel >= 4) qJade = adjChung * 0.30 + sacScore * 0.70;
  else qJade = adjChung * 0.50 + sacScore * 0.50;

  const vBase = V_BASE[chung] ?? 500_000;

  let colorK = 1.0;
  if (maxHue >= 95 && g.toneLevel >= 4) colorK = 8.0;
  else if (maxHue >= 88 && g.toneLevel >= 4) colorK = 5.0;
  else if (maxHue >= 82 && g.toneLevel >= 3) colorK = 3.5;
  else if (maxHue >= 75 && g.toneLevel >= 3) colorK = 2.5;
  else if (maxHue >= 70 && g.toneLevel >= 3) colorK = 2.0;
  else if (maxHue >= 85 && g.toneLevel >= 4) colorK = 6.0;
  else if (maxHue >= 60 && g.toneLevel >= 3) colorK = 1.5;
  else if (maxHue >= 40) colorK = 1.1;
  else colorK = 1.0;

  if (g.vision_notes?.hasPhieuHoa && maxHue >= 70) {
    colorK *= 1.4;
    bonuses.push("🌸 Phiêu Hoa — hoa bay quý hiếm (+40%)");
  }

  const flawMultiplier = !g.flaws || g.flaws.length === 0
    ? 1.0
    : Math.min(...g.flaws.map(f => FLAW_W[f] ?? 0.8));

  if (flawMultiplier <= 0.55) {
    warnings.push("🚨 Sớ ngang/nứt nghiêm trọng — rủi ro vỡ cao, cân nhắc không mua");
  }

  const shapeW = SHAPE_W[g.shape] ?? 1.0;

  let price = vBase * colorK * flawMultiplier * shapeW;
  const cap = HARD_CAP[chung] ?? 2_000_000;
  price = Math.min(price, cap);

  if (colorK >= 3.0 && (chung === "Đậu thô" || chung === "Đậu mịn")) {
    warnings.push("⚠️ Màu đẹp nhưng chủng thô — Hard Cap áp dụng, thực tế không vượt " +
      new Intl.NumberFormat("vi-VN").format(cap) + "đ");
  }
  const conf = g.vision_notes?.overallConfidence ?? 0.75;
  if (conf < 0.6) {
    warnings.push("📸 Ảnh chất lượng thấp — kết quả chỉ mang tính tham khảo, cần thêm ảnh soi đèn");
  }

  const priceLow = price * Math.max(0.5, conf - 0.15);
  const priceHigh = price * Math.min(1.5, conf + 0.15);

  const DANH_XUNG: Record<string, string> = {
    "Đậu thô": "Thường Tại — Chủng Đậu",
    "Đậu mịn": "Quý Nhân — Đậu Mịn",
    "Nếp Mịn": "Phi Tần — Nếp Mịn",
    "Nếp Hóa": "Quý Phi — Nếp Hóa",
    "Nếp Băng": "Hoàng Hậu — Nếp Băng",
  };

  let truongPhai = "Bạn Đồng Hành";
  if (flawMultiplier < 0.8 && colorK >= 3.0) truongPhai = "Dấu Ấn Độc Bản";
  else if (adjChung >= 45 && sacScore >= 50) truongPhai = "Vẻ Đẹp Chuẩn Mực";
  else if (hasLuc || hasTim) truongPhai = "Bức Tranh Tự Nhiên";

  // Radar axes (0-100)
  const axes = {
    trong: Math.min(100, Math.round(adjChung * 1.1)),
    sac: Math.min(100, Math.round(sacScore)),
    lanh: Math.round(flawMultiplier * 100),
    damTay: Math.round(shapeW * 70 + 25),
    thamMy: Math.min(100, Math.round((adjChung + sacScore) / 2 + (g.vision_notes?.hasPhieuHoa ? 10 : 0))),
  };

  return {
    priceEstimate: Math.round(price),
    priceLow: Math.round(priceLow),
    priceHigh: Math.round(priceHigh),
    qJade: Math.round(qJade * 10) / 10,
    sacScore: Math.round(sacScore * 10) / 10,
    chungScore: Math.round(adjChung * 10) / 10,
    colorMultiplier: colorK,
    flawMultiplier,
    bonuses,
    warnings,
    danhXung: DANH_XUNG[chung] ?? "Phi Tần",
    truongPhai,
    confidence: conf,
    axes,
  };
}

export function formatVND(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "") + " tỷ";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.?0+$/, "") + " triệu";
  return new Intl.NumberFormat("vi-VN").format(n) + "đ";
}
