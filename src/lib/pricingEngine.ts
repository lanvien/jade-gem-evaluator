// ============================================================
// PRICING ENGINE — VÒNG NGỌC PHỈ THÚY
// Pure TypeScript utils, không phụ thuộc framework
// ============================================================

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
import {
  classifyChung,
  FEATURES,
  type ChungName,
  type GrainCode,
  type TranslucencyCode,
} from "@/content/jadeContent";

/** Chủng = 9 chủng v2 (nguồn duy nhất: jadeContent.CLASSIFICATION_MATRIX) */
export type Chung = ChungName;

export type ToneLevel = 1 | 2 | 3 | 4 | 5;

export type Shape =
  | "Bản Đũa"
  | "Bản Dẹt"
  | "Bản Vuông"
  | "Khắc Hoa";

export type FlawType =
  | "Không lỗi"
  | "Vân ngọc"
  | "Sớ bông / Gân già"
  | "Chỉ màu / Gân non / Sớ âm / Sớ dọc"
  | "Sớ âm dài / Sớ cấn / Mắt cát / Sần lõm"
  | "Sớ dọc dài / Sớ lưỡi gà"
  | "Sớ chéo / Sớ ngang"
  | "Vết nứt (Crack)";

export type ColorName =
  | "Đế Vương Lục" | "Chính Dương Lục" | "Xanh Cay" | "Xanh Ngọt"
  | "Lục Táo" | "Đậu Lục" | "Thanh Thủy Lục" | "Xanh Dầu" | "Hồi Lục"
  | "Tử La Lan" | "Tím Cà" | "Tím Lam"
  | "Lam Thiên Không" | "Lam Thanh" | "Lão Lam Thủy"
  | "Hồng Phỉ" | "Hoàng Tông Phỉ"
  | "Mặc Thúy"
  | "Bạch Nguyệt Quang" | "Trắng Cháo" | "Gà Đen" | "Xám";

export interface JadeInput {
  chungPeak: Chung;
  chungBase: Chung;
  coverageLevel: 1 | 2 | 3 | 4;
  baseColor: ColorName;
  accentColors: ColorName[];
  toneLevel: ToneLevel;
  valuableSegments: number;
  ni: number;
  shape: Shape;
  chot: number;
  flaws: FlawType[];
  hasCertificate: boolean;
  sellerRedFlags?: number;
  sellerProofLevel?: "video" | "photo_only" | "hidden";
}

export interface PricingResult {
  scoreChung: number;
  scoreSac: number;
  qJade: number;
  vFloor: number;
  vFinal: number;
  minPrice: number;
  maxPrice: number;
  hardCapApplied: boolean;
  isImperialCandidate: boolean;
  hasLightEffect: boolean;
  hasYellowSpots: boolean;
  xuanDaiTaiBonus: boolean;
  confidence: number;
  fomoDiscount: number;
  warnings: string[];
  colorLabel: string;
  chungLabel: string;
  aestheticGroup: AestheticGroup;
  aestheticLabel: string;
  aestheticDescription: string;
  radarData: RadarData;
}

export type AestheticGroup =
  | "classic_harmony"
  | "bold_statement"
  | "everyday_companion"
  | "natures_canvas";

export interface RadarData {
  doTrong: number;
  sacDien: number;
  doLanhLan: number;
  damTay: number;
  thamMy: number;
}

// ─────────────────────────────────────────────
// DICTIONARIES
// ─────────────────────────────────────────────
export const CHUNG_SCORE: Record<Chung, number> = {
  "Đậu": 12,
  "Đậu Mịn": 28,
  "Nếp": 45,
  "Nếp Mịn": 58,
  "Nếp Hóa": 68,
  "Nếp Băng": 82,
  "Băng": 90,
  "Cao Băng": 95,
  "Thuỷ Tinh": 100,
};

export const CHUNG_LABEL: Record<Chung, string> = {
  "Đậu": "Chủng Đậu",
  "Đậu Mịn": "Chủng Đậu Mịn",
  "Nếp": "Chủng Nếp",
  "Nếp Mịn": "Chủng Nếp Mịn",
  "Nếp Hóa": "Chủng Nếp Hóa",
  "Nếp Băng": "Chủng Nếp Băng",
  "Băng": "Chủng Băng",
  "Cao Băng": "Chủng Cao Băng",
  "Thuỷ Tinh": "Chủng Thuỷ Tinh",
};

export const HARD_CAP: Record<Chung, number> = {
  "Đậu": 3_000_000,
  "Đậu Mịn": 8_000_000,
  "Nếp": 25_000_000,
  "Nếp Mịn": 40_000_000,
  "Nếp Hóa": 80_000_000,
  "Nếp Băng": 300_000_000,
  "Băng": 800_000_000,
  "Cao Băng": 1_500_000_000,
  "Thuỷ Tinh": 3_000_000_000,
};

// V_BASE: giá sàn khi trắng trơn, lành lặn, ni54 chuẩn
const V_BASE: Record<Chung, number> = {
  "Đậu": 400_000,
  "Đậu Mịn": 1_000_000,
  "Nếp": 2_000_000,
  "Nếp Mịn": 3_000_000,
  "Nếp Hóa": 10_000_000,
  "Nếp Băng": 35_000_000,
  "Băng": 80_000_000,
  "Cao Băng": 150_000_000,
  "Thuỷ Tinh": 250_000_000,
};

const COVERAGE_RATIO: Record<1 | 2 | 3 | 4, number> = {
  1: 1.0,
  2: 0.85,
  3: 0.70,
  4: 0.55,
};

export const COLOR_HUE_SCORE: Record<ColorName, number> = {
  "Đế Vương Lục":    100,
  "Chính Dương Lục": 95,
  "Xanh Cay":        88,
  "Xanh Ngọt":       80,
  "Lục Táo":         72,
  "Đậu Lục":         50,
  "Thanh Thủy Lục":  45,
  "Xanh Dầu":        28,
  "Hồi Lục":         18,
  "Tử La Lan":       90,
  "Tím Cà":          82,
  "Tím Lam":         65,
  "Lam Thiên Không": 85,
  "Lam Thanh":       55,
  "Lão Lam Thủy":    40,
  "Hồng Phỉ":        75,
  "Hoàng Tông Phỉ":  60,
  "Mặc Thúy":        55,
  "Bạch Nguyệt Quang": 22,
  "Trắng Cháo":      15,
  "Gà Đen":          32,
  "Xám":             8,
};

// Color multiplier nhân thẳng vào V_BASE (thay vì dùng floor price)
const COLOR_K: Record<ColorName, number> = {
  "Đế Vương Lục":    0,   // tính theo tone bên dưới
  "Chính Dương Lục": 0,
  "Xanh Cay":        0,
  "Xanh Ngọt":       2.5,
  "Lục Táo":         2.0,
  "Đậu Lục":         1.3,
  "Thanh Thủy Lục":  1.2,
  "Xanh Dầu":        1.05,
  "Hồi Lục":         1.0,
  "Tử La Lan":       0,   // tính theo tone
  "Tím Cà":          0,
  "Tím Lam":         1.8,
  "Lam Thiên Không": 0,
  "Lam Thanh":       1.5,
  "Lão Lam Thủy":    1.2,
  "Hồng Phỉ":        3.5,
  "Hoàng Tông Phỉ":  2.0,
  "Mặc Thúy":        2.5,
  "Bạch Nguyệt Quang": 1.0,
  "Trắng Cháo":      1.0,
  "Gà Đen":          1.3,
  "Xám":             0.9,
};

export const COLOR_LABEL: Record<ColorName, string> = {
  "Đế Vương Lục":    "Đế Vương Lục – Cực phẩm thiên nhiên",
  "Chính Dương Lục": "Chính Dương Lục – Tươi tràn sức sống",
  "Xanh Cay":        "Xanh Cay – Nồng đậm, mãnh liệt",
  "Xanh Ngọt":       "Xanh Ngọt – Dịu mắt, thư thái",
  "Lục Táo":         "Lục Táo – Tươi sáng, dễ chịu",
  "Đậu Lục":         "Đậu Lục – Sắc ngọc phổ thông",
  "Thanh Thủy Lục":  "Thanh Thủy Lục – Lục pha lam nhẹ",
  "Xanh Dầu":        "Xanh Dầu – Trầm, ít bắt sáng",
  "Hồi Lục":         "Hồi Lục – Xỉn, phẩm cấp thấp",
  "Tử La Lan":       "Tử La Lan – Tuyệt sắc mùa xuân",
  "Tím Cà":          "Tím Cà – Đậm đà, cực hiếm lên băng",
  "Tím Lam":         "Tím Lam – Huyền bí, trung-cao cấp",
  "Lam Thiên Không": "Lam Thiên Không – Xanh ngắt như trời",
  "Lam Thanh":       "Lam Thanh – Nhẹ nhàng, dễ chịu",
  "Lão Lam Thủy":    "Lão Lam Thủy – Trầm mặc, hoa băng",
  "Hồng Phỉ":        "Hồng Phỉ – Huyết ngọc, cực hiếm",
  "Hoàng Tông Phỉ":  "Hoàng Tông Phỉ – Cam vàng tài lộc",
  "Mặc Thúy":        "Mặc Thúy – Đen huyền, soi đèn xanh",
  "Bạch Nguyệt Quang": "Bạch Nguyệt Quang – Trắng tinh khiết",
  "Trắng Cháo":      "Trắng Cháo – Nền trắng cơ bản",
  "Gà Đen":          "Gà Đen – Trắng đốm xám, có duyên",
  "Xám":             "Xám – Tông trung tính, dìm giá trị",
};

const TONE_WEIGHT: Record<ToneLevel, number> = {
  1: 0.2,
  2: 0.5,
  3: 0.8,
  4: 1.0,
  5: 0.9,
};

const VALUABLE_COLORS = new Set<ColorName>([
  "Đế Vương Lục", "Chính Dương Lục", "Xanh Cay", "Xanh Ngọt", "Lục Táo",
  "Tử La Lan", "Tím Cà", "Tím Lam",
  "Lam Thiên Không", "Lam Thanh",
  "Hồng Phỉ", "Hoàng Tông Phỉ",
  "Mặc Thúy",
]);

const LIGHT_EFFECT_COLORS = new Set<ColorName>([
  "Tử La Lan", "Tím Cà", "Tím Lam",
  "Lam Thiên Không", "Lam Thanh", "Lão Lam Thủy",
]);

const IMPERIAL_COLORS = new Set<ColorName>([
  "Đế Vương Lục", "Chính Dương Lục", "Xanh Cay",
  "Tử La Lan", "Tím Cà",
  "Lam Thiên Không",
  "Hồng Phỉ",
]);

const YELLOW_COLORS = new Set<ColorName>([
  "Hồng Phỉ", "Hoàng Tông Phỉ",
]);

const FLAW_RISK: Record<FlawType, number> = {
  "Không lỗi":                                   1.00,
  "Vân ngọc":                                    1.02,  // điểm CỘNG
  "Sớ bông / Gân già":                           0.9888,
  "Chỉ màu / Gân non / Sớ âm / Sớ dọc":        0.9555,
  "Sớ âm dài / Sớ cấn / Mắt cát / Sần lõm":    0.88,
  "Sớ dọc dài / Sớ lưỡi gà":                    0.75,
  "Sớ chéo / Sớ ngang":                          0.55,
  "Vết nứt (Crack)":                             0.40,
};

const SHAPE_FACTOR: Record<Shape, number> = {
  "Bản Đũa":   1.003,
  "Bản Dẹt":   1.0,
  "Bản Vuông": 0.85,  // 99% Type B → penalty
  "Khắc Hoa":  0.7,
};

const AESTHETIC_META: Record<AestheticGroup, { label: string; desc: string }> = {
  classic_harmony: {
    label: "VẺ ĐẸP CHUẨN MỰC (The Classic Harmony)",
    desc: "Sự cân bằng hoàn hảo giữa Cốt và Sắc, một nền tảng vững chãi vượt thời gian.",
  },
  bold_statement: {
    label: "DẤU ẤN ĐỘC BẢN (The Bold Statement)",
    desc: "Vượt ra ngoài những quy chuẩn thông thường, sức hút nằm ở sắc độ đột phá, rực rỡ và duy nhất.",
  },
  everyday_companion: {
    label: "BẠN ĐỒNG HÀNH (The Everyday Companion)",
    desc: "Thanh thoát, nhẹ nhàng và mang tính ứng dụng cao. Tri kỷ để mang theo mỗi ngày.",
  },
  natures_canvas: {
    label: "BỨC TRANH TỰ NHIÊN (The Nature's Canvas)",
    desc: "Phóng khoáng và không theo quy tắc. Mỗi vệt loang màu là một nét vẽ ngẫu hứng không thể sao chép.",
  },
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function getNiFactor(ni: number): number {
  if (ni < 50) return 0.95;
  if (ni <= 56) return 1.0;
  if (ni <= 60) return 1.005;
  return 1.01;
}

function getChotFactor(mm: number): number {
  if (mm < 6.5) return 0.9;
  if (mm < 10) return 0.95;
  if (mm < 12) return 1.0;
  if (mm <= 13.5) return 1.0005;
  if (mm <= 15.5) return 1.005;
  return 1.05;
}

function torusVolume(ni: number, chot: number): number {
  const R = ni / 2;
  const r = chot / 2;
  return Math.PI * r * r * 2 * Math.PI * R;
}

function getVolumeFactor(ni: number, chot: number): number {
  const v = torusVolume(ni, chot);
  if (v < 1500) return 0.5;
  if (v <= 2500) return 1.0;
  if (v <= 3000) return 1.15;
  return 1.3;
}

function getAreaFactor(segments: number, hasValuable: boolean): number {
  if (!hasValuable) return 1.0;
  if (segments <= 3) return 1.0;
  if (segments <= 7) return 1.4;
  return 2.5;
}

function roundToHundredK(n: number): number {
  return Math.round(n / 100_000) * 100_000;
}

function calcFomoDiscount(redFlags: number): number {
  const lambda = 0.15;
  return Math.exp(-lambda * Math.min(redFlags, 5));
}

function calcSellerConfidence(level?: "video" | "photo_only" | "hidden"): number {
  if (level === "video") return 0;
  if (level === "photo_only") return 0.05;
  if (level === "hidden") return 0.15;
  return 0;
}

// Tính color multiplier cho màu imperial theo tone
function getImperialColorK(color: ColorName, toneLevel: ToneLevel): number {
  const hue = COLOR_HUE_SCORE[color] ?? 50;
  const tone = TONE_WEIGHT[toneLevel];
  const effective = hue * tone;
  if (effective >= 90) return 9.0;
  if (effective >= 80) return 7.0;
  if (effective >= 70) return 5.0;
  if (effective >= 60) return 3.5;
  if (effective >= 50) return 2.5;
  return 1.5;
}

function classifyAestheticGroup(
  qJade: number,
  scoreSac: number,
  isImperial: boolean,
  chot: number,
  shape: Shape,
  accentColors: ColorName[],
  baseColor: ColorName,
): AestheticGroup {
  const allColors = [baseColor, ...accentColors];
  const hasMulticolor = allColors.length >= 3;
  const isThin = chot < 10;
  const isSmallShape = shape === "Bản Dẹt" || shape === "Bản Vuông";

  if (hasMulticolor) return "natures_canvas";
  if (isImperial && qJade < 60) return "bold_statement";
  if (scoreSac > 70 && qJade < 50) return "bold_statement";
  if ((isThin || isSmallShape) && qJade < 60 && !isImperial) return "everyday_companion";
  return "classic_harmony";
}

function buildRadarData(input: JadeInput, qJade: number, wRisk: number): RadarData {
  const doTrong = Math.min(100, Math.round((CHUNG_SCORE[input.chungPeak] / 82) * 100));
  const sacDien = Math.min(100, Math.round(qJade));
  const doLanhLan = Math.round(wRisk * 100);
  const niNorm = Math.min(100, Math.max(0, ((input.ni - 46) / 22) * 60));
  const chotNorm = Math.min(100, Math.max(0, ((input.chot - 6) / 12) * 40));
  const damTay = Math.round(niNorm + chotNorm);
  const thamMy = Math.round((doLanhLan * 0.5) + (sacDien * 0.3) + (doTrong * 0.2));
  return {
    doTrong,
    sacDien,
    doLanhLan,
    damTay: Math.min(100, damTay),
    thamMy: Math.min(100, thamMy),
  };
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
export function calculateJadePrice(input: JadeInput): PricingResult {
  const warnings: string[] = [];

  // ── Cốt ngọc ──
  const peakScore = CHUNG_SCORE[input.chungPeak];
  const baseScore = CHUNG_SCORE[input.chungBase];
  const coverageRatio = COVERAGE_RATIO[input.coverageLevel];
  const rawChungScore = peakScore * coverageRatio + baseScore * (1 - coverageRatio);
  const greyPenalty = input.baseColor === "Xám" ? 0.9 : 1.0;
  const scoreChung = rawChungScore * greyPenalty;

  // ── Sắc diện ──
  const allColors: ColorName[] = [input.baseColor, ...input.accentColors];
  const hueScores = allColors.map(c => COLOR_HUE_SCORE[c] ?? 0);
  const maxHue = Math.max(...hueScores);
  const hasValuable = allColors.some(c => VALUABLE_COLORS.has(c));
  const hTone = TONE_WEIGHT[input.toneLevel];
  const hArea = getAreaFactor(input.valuableSegments, hasValuable);
  let scoreSac = maxHue * hTone * hArea;

  const hasLuc = allColors.some(c =>
    ["Đế Vương Lục", "Chính Dương Lục", "Xanh Cay", "Xanh Ngọt", "Lục Táo",
     "Đậu Lục", "Thanh Thủy Lục"].includes(c)
  );
  const hasTim = allColors.some(c => ["Tử La Lan", "Tím Cà", "Tím Lam"].includes(c));
  const xuanDaiTai = hasLuc && hasTim;
  if (xuanDaiTai) { scoreSac += 15; }

  const maxColorName = allColors.reduce((best, c) =>
    (COLOR_HUE_SCORE[c] ?? 0) > (COLOR_HUE_SCORE[best] ?? 0) ? c : best,
    allColors[0]
  );

  const isImperialCandidate = IMPERIAL_COLORS.has(maxColorName) && input.toneLevel >= 3;

  // ── Dynamic weighting ──
  let wChung: number, wSac: number;
  if (isImperialCandidate) {
    wChung = 0.30; wSac = 0.70;
  } else if (input.toneLevel <= 2) {
    wChung = 0.70; wSac = 0.30;
  } else {
    wChung = 0.55; wSac = 0.45;
  }

  const qJade = (scoreChung * wChung) + (scoreSac * wSac);

  // ── Tính giá theo V_BASE × colorK (thay vì floor price) ──
  const vBase = V_BASE[input.chungPeak];

  // Color multiplier
  let colorK: number;
  if (IMPERIAL_COLORS.has(maxColorName)) {
    colorK = getImperialColorK(maxColorName, input.toneLevel);
  } else {
    colorK = COLOR_K[maxColorName] ?? 1.0;
    // Nhân thêm tone
    colorK = colorK * (0.5 + hTone * 0.5);
  }

  // Xuân Đới Tài bonus
  if (xuanDaiTai) colorK *= 1.3;

  // ── Physical multiplier ──
  const wNi = getNiFactor(input.ni);
  const wShape = SHAPE_FACTOR[input.shape];
  const wChot = getChotFactor(input.chot);
  const wVolume = getVolumeFactor(input.ni, input.chot);
  const wPhysic = wNi * wShape * wChot * wVolume;

  // ── Risk multiplier ──
  const riskFactors = input.flaws.length > 0
    ? input.flaws.map(f => FLAW_RISK[f] ?? 1.0)
    : [1.0];
  let wRisk = Math.min(...riskFactors);
  if (qJade < 40 && wRisk < 1.0) {
    wRisk = Math.max(wRisk - 0.1, 0.1);
  }

  // ── FOMO discount ──
  const fomoDiscount = calcFomoDiscount(input.sellerRedFlags ?? 0);

  // ── Tính giá cuối ──
  const vPre = vBase * colorK * wPhysic * wRisk * fomoDiscount;
  const hardCap = HARD_CAP[input.chungPeak];
  const vFinal = Math.min(vPre, hardCap);
  const hardCapApplied = vPre > hardCap;

  // ── Confidence / price band ──
  let confidence = 1.0;
  if (!input.hasCertificate) confidence -= 0.10;
  if (wRisk < 0.75) confidence -= 0.15;
  if (input.coverageLevel >= 3) confidence -= 0.05;
  confidence -= calcSellerConfidence(input.sellerProofLevel);
  confidence = Math.max(confidence, 0.55);

  const spread = 1 - confidence;
  const minPrice = roundToHundredK(vFinal * (1 - spread * 1.5));
  const maxPrice = roundToHundredK(vFinal * (1 + spread * 0.8));

  // ── Flags ──
  const hasLightEffect = allColors.some(c => LIGHT_EFFECT_COLORS.has(c));
  const hasYellowSpots = allColors.some(c => YELLOW_COLORS.has(c));
  const vFloor = vBase; // kept for interface compat

  // ── Warnings ──
  if (input.shape === "Bản Vuông") {
    warnings.push("🚫 Bản Vuông: Gần như 100% là Ngọc Type B (đã ép nhựa). Yêu cầu giấy kiểm định GIV/SJC/Liulab trước khi mua!");
  }
  if (input.shape === "Khắc Hoa") {
    warnings.push("🔍 Khắc Hoa thường dùng để che lỗi đá. Soi kỹ hoa văn dưới đèn mạnh trước khi quyết định!");
  }
  if (hasLightEffect) {
    warnings.push("⚠️ Ngọc ăn đèn: Sắc Tím/Lam qua livestream thường rực hơn thực tế 30–50%. Yêu cầu xem video dưới nắng tự nhiên trước khi chốt.");
  }
  if (isImperialCandidate) {
    warnings.push("👑 Ngọc đạt độ màu này có giá trị sưu tầm cực cao. Nếu được chào dưới 10 triệu, 99% là ngọc nhuộm (Type B/C) hoặc đá giả.");
  }
  if (xuanDaiTai) {
    warnings.push("✨ Xuân Đới Tài! Combo Lục + Tím cực hiếm — giá trị cộng thêm đáng kể.");
  }
  if (hardCapApplied) {
    warnings.push(`🔒 Giá đã khóa trần theo Chủng ${input.chungPeak} (Hard Cap: ${hardCap.toLocaleString("vi-VN")}đ). Dù màu đẹp đến đâu, chủng thấp thì giá không thể vượt mức này.`);
  }
  if (!input.hasCertificate) {
    warnings.push("📋 Chưa có giấy kiểm định. Định giá chỉ mang tính tham khảo. Yêu cầu giấy từ SJC / GIV / Liulab trước khi chuyển tiền.");
  }
  if ((input.sellerRedFlags ?? 0) >= 2) {
    warnings.push("🚨 Người bán có dấu hiệu thao túng tâm lý. Hệ thống đã tự động điều chỉnh giá khuyên mua xuống thấp hơn. Hãy chậm lại!");
  }
  if (wRisk <= 0.55) {
    warnings.push("⛔ Sớ ngang/nứt nghiêm trọng: Vòng có nguy cơ gãy khi va đập. Không nên dùng làm trang sức đeo thường xuyên!");
  }

  // ── Aesthetic group ──
  const aestheticGroup = classifyAestheticGroup(
    qJade, scoreSac, isImperialCandidate,
    input.chot, input.shape, input.accentColors, input.baseColor,
  );
  const { label: aestheticLabel, desc: aestheticDescription } = AESTHETIC_META[aestheticGroup];

  // ── Radar ──
  const radarData = buildRadarData(input, qJade, wRisk);

  return {
    scoreChung: Math.round(scoreChung * 10) / 10,
    scoreSac: Math.round(scoreSac * 10) / 10,
    qJade: Math.round(qJade * 10) / 10,
    vFloor,
    vFinal: roundToHundredK(vFinal),
    minPrice,
    maxPrice,
    hardCapApplied,
    isImperialCandidate,
    hasLightEffect,
    hasYellowSpots,
    xuanDaiTaiBonus: xuanDaiTai,
    confidence,
    fomoDiscount,
    warnings,
    colorLabel: COLOR_LABEL[maxColorName] ?? maxColorName,
    chungLabel: CHUNG_LABEL[input.chungPeak],
    aestheticGroup,
    aestheticLabel,
    aestheticDescription,
    radarData,
  };
}

// ─────────────────────────────────────────────
// DISPLAY HELPERS
// ─────────────────────────────────────────────
export function formatVND(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} triệu`;
  return n.toLocaleString("vi-VN") + "đ";
}

export function getPriceRangeLabel(result: PricingResult): string {
  return `${formatVND(result.minPrice)} – ${formatVND(result.maxPrice)}`;
}

// ─────────────────────────────────────────────
// SURVEY ADAPTER
// ─────────────────────────────────────────────
function mapChung(ans: string | undefined): Chung {
  if (!ans) return "Đậu mịn";
  if (ans === "1a") return "Đậu thô";
  if (ans === "1b") return "Đậu mịn";
  if (ans === "1c") return "Nếp Mịn";
  if (ans === "1d") return "Nếp Hóa";
  if (ans === "1e") return "Nếp Băng";
  if (ans === "2a") return "Đậu thô";
  if (ans === "2b") return "Đậu mịn";
  if (ans === "2c") return "Nếp Mịn";
  if (ans === "2d") return "Nếp Hóa";
  if (ans === "2e") return "Nếp Băng";
  return "Đậu mịn";
}

function mapCoverage(ans: string | undefined): 1 | 2 | 3 | 4 {
  if (ans === "3a") return 1;
  if (ans === "3b") return 2;
  if (ans === "3c") return 3;
  if (ans === "3d") return 4;
  return 2;
}

function mapShape(ans: string | undefined): Shape {
  if (ans === "10a") return "Bản Đũa";
  if (ans === "10b") return "Bản Dẹt";
  if (ans === "10c") return "Bản Vuông";
  if (ans === "10d") return "Khắc Hoa";
  return "Bản Dẹt";
}

function mapTone(tones: Record<string, string>): ToneLevel {
  const vals = Object.values(tones);
  if (vals.length === 0) return 3;
  const dark = vals.filter(t => t === "dark").length;
  const light = vals.filter(t => t === "light").length;
  if (dark > vals.length / 2) return 4;
  if (light > vals.length / 2) return 2;
  return 3;
}

function inferToneFromHex(ringColors: string[]): ToneLevel {
  if (!ringColors.length) return 3;
  const avg = ringColors.reduce((sum, hex) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return sum + Math.max(r, g, b);
  }, 0) / ringColors.length;
  if (avg > 200) return 1;
  if (avg > 150) return 2;
  if (avg > 100) return 3;
  return 4;
}

function mapBaseColor(ringColors: string[]): ColorName {
  if (!ringColors.length) return "Trắng Cháo";
  // Đếm màu, lấy màu xuất hiện nhiều nhất
  const counts: Record<string, number> = {};
  ringColors.forEach(c => { if (c && c !== "#ffffff") counts[c] = (counts[c] || 0) + 1; });
  const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  if (!top) return "Trắng Cháo";

  const r = parseInt(top.slice(1, 3), 16) || 0;
  const g = parseInt(top.slice(3, 5), 16) || 0;
  const b = parseInt(top.slice(5, 7), 16) || 0;

  // Lục family
  if (g > r + 25 && g > b + 15) {
    if (g > 180) return "Chính Dương Lục";
    if (g > 140 && r < 60) return "Đế Vương Lục";
    if (g > 120) return "Xanh Ngọt";
    if (g > 90 && b > 60) return "Thanh Thủy Lục";
    if (g > 90) return "Lục Táo";
    return "Đậu Lục";
  }
  // Tím
  if (r > 100 && b > 100 && b > g + 20 && r > g + 10) return "Tử La Lan";
  if (r > 80 && b > r && b > g && Math.abs(r - b) < 80 && g < b - 10) return "Tím Lam";
  // Lam
  if (b > r + 40 && b > g + 20) return "Lam Thiên Không";
  if (b > g + 20 && b > r) return "Lam Thanh";
  // Vàng/cam
  if (r > 150 && g > 100 && b < 80) return "Hoàng Tông Phỉ";
  // Đỏ
  if (r > 150 && g < 80) return "Hồng Phỉ";
  // Đen
  if (r < 60 && g < 60 && b < 60) return "Mặc Thúy";
  // Trắng
  if (r > 200 && g > 200 && b > 200) return "Bạch Nguyệt Quang";
  // Xám
  if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && r < 150) return "Xám";

  return "Đậu Lục";
}

function mapAccentColors(ringColors: string[], baseColor: ColorName): ColorName[] {
  // Lấy màu thứ 2 từ canvas (nếu có)
  const counts: Record<string, number> = {};
  ringColors.forEach(c => { if (c && c !== "#ffffff") counts[c] = (counts[c] || 0) + 1; });
  const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  const accents: ColorName[] = [];
  for (const hex of sorted.slice(1, 3)) {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    let color: ColorName = "Đậu Lục";
    if (g > r + 25 && g > b + 15) color = g > 120 ? "Lục Táo" : "Đậu Lục";
    else if (r > 100 && b > 100 && b > g + 20) color = "Tử La Lan";
    else if (b > r + 40 && b > g + 20) color = "Lam Thiên Không";
    else if (r > 150 && g > 100 && b < 80) color = "Hoàng Tông Phỉ";
    else if (r > 200 && g > 200 && b > 200) color = "Bạch Nguyệt Quang";
    if (color !== baseColor) accents.push(color);
  }
  return accents;
}

function mapFlaws(answers: Record<string, string>, patternData: any): FlawType[] {
  const flaws: FlawType[] = [];
  const surf = answers[7];
  if (surf === "7b") flaws.push("Sớ âm dài / Sớ cấn / Mắt cát / Sần lõm");
  if (surf === "7c") flaws.push("Vết nứt (Crack)");
  if (patternData?.types?.length) {
    if (patternData.types.includes("crack")) flaws.push("Vết nứt (Crack)");
    if (patternData.types.includes("luoiga")) flaws.push("Sớ dọc dài / Sớ lưỡi gà");
    if (patternData.types.includes("ngang")) flaws.push("Sớ chéo / Sớ ngang");
  }
  if (flaws.length === 0) flaws.push("Không lỗi");
  return flaws;
}

export function buildJadeInputFromSurvey(data: any): JadeInput {
  const answers: Record<string, string> = data.answers || {};
  const numberInputs: Record<string, string> = data.numberInputs || {};
  const tones: Record<string, string> = data.colorTones || {};
  const ringColors: string[] = data.ringColors || [];
  const patternData = data.patternData || {};
  const legal = data.legal || answers[12];

  const chungPeak = mapChung(answers[1] || answers[2]);
  const coverage = mapCoverage(answers[3]);
  const chungBase: Chung = coverage >= 3 ? "Đậu mịn" : chungPeak;

  const baseColor = mapBaseColor(ringColors);
  const accentColors = mapAccentColors(ringColors, baseColor);
  const valuableSegments = ringColors.filter(c => c && c !== "#ffffff").length;

  return {
    chungPeak,
    chungBase,
    coverageLevel: coverage,
    baseColor,
    accentColors,
    toneLevel: Object.keys(tones).length > 0
      ? mapTone(tones)
      : inferToneFromHex(ringColors),
    valuableSegments,
    ni: data.ni ?? (parseFloat(numberInputs[9]) || 56),
    shape: mapShape(answers[10]),
    chot: data.chot ?? (parseFloat(numberInputs[11]) || 8),
    flaws: mapFlaws(answers, patternData),
    hasCertificate: legal === "12a",
    sellerRedFlags: data.sellerRedFlags ?? 0,
    sellerProofLevel: data.sellerProofLevel ?? undefined,
  };
}
