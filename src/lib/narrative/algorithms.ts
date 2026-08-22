// ============================================================
// NARRATIVE ALGORITHMS — presentation layer thuần.
// KHÔNG bao giờ đụng vào price/classification (đến từ pricingEngine.ts).
// ============================================================

import { COLOR_FAMILY_MAP, COLOR_DICTIONARY, type ColorName, type ColorFamily } from "@/content/jadeContent";

/* ─────────────────────────────────────────────
   1. CLEANLINESS ENGINE (deterministic)
   ───────────────────────────────────────────── */
export type CleanlinessLevel = "Rất sạch" | "Sạch" | "Khá" | "Nhiều" | "Rất nhiều";

// so_luoi_ga = 4: confirmed — ngang so_ngang, dưới vet_nut (5), trên so_can/so_doc_dai (3).
// vet_san_lom_*: spec gốc chỉ cho 1 mức "san_lom: 2" chung, chưa phân biệt nhẹ/vừa/rõ
// — áp weight 2 đồng loạt theo đúng nghĩa đen của spec.
const CLUTTER_WEIGHT: Record<string, number> = {
  hoa_bay: 0,
  so_bong: 1,
  chi_mau: 1,
  gan_non: 2,
  gan_gia: 1,
  so_ngan: 1,
  so_am: 2,
  so_am_dai: 3,
  so_can: 3,
  so_luoi_ga: 4,
  so_doc: 2,
  so_doc_dai: 3,
  so_cheo: 3,
  so_ngang: 4,
  mat_cat: 3,
  vet_san_lom_nhe: 2,
  vet_san_lom_vua: 2,
  vet_san_lom_ro: 2,
  vet_nut: 5,
};

export function cleanlinessEngine(featureCodes: string[]): {
  score: number;
  level: CleanlinessLevel;
} {
  const score = featureCodes.reduce((sum, code) => sum + (CLUTTER_WEIGHT[code] ?? 0), 0);
  let level: CleanlinessLevel;
  if (score === 0) level = "Rất sạch";
  else if (score <= 2) level = "Sạch";
  else if (score <= 5) level = "Khá";
  else if (score <= 8) level = "Nhiều";
  else level = "Rất nhiều";
  return { score, level };
}

/* ─────────────────────────────────────────────
   8. VALUATION BAND ENGINE
   Dùng thẳng pricing.qJade — xem giải thích trong bản trước.
   ───────────────────────────────────────────── */
export type ValuationBand = "Strong" | "Balanced" | "Weakness-dominant";

export function valuationBandEngine(qJade: number): ValuationBand {
  if (qJade >= 80) return "Strong";
  if (qJade >= 60) return "Balanced";
  return "Weakness-dominant";
}

/* ─────────────────────────────────────────────
   9. CONFIDENCE ENGINE (label layer only)
   Dùng thẳng pricing.confidence — xem giải thích trong bản trước.
   pricingEngine.confidence hiện KHÔNG có yếu tố AI nào cả (chỉ dựa
   certificate/risk/coverage/seller), nên lo ngại "AI penalty khi user
   không dùng AI" không áp dụng ở đây.
   ───────────────────────────────────────────── */
export type ConfidenceLabel = "Rất cao" | "Cao" | "Khá" | "Tham khảo";

export function confidenceLabel(confidence: number): ConfidenceLabel {
  if (confidence >= 0.85) return "Rất cao";
  if (confidence >= 0.75) return "Cao";
  if (confidence >= 0.65) return "Khá";
  return "Tham khảo";
}

/* ─────────────────────────────────────────────
   HEX → ColorName cho từng slice (12 múi vòng)
   Tách từ heuristic RGB sẵn có trong pricingEngine.mapBaseColor,
   áp dụng cho TỪNG hex riêng lẻ thay vì chỉ màu tổng hợp top-1.
   Đây là hàm MỚI — chưa tồn tại trước đây, cần test kỹ vì mapBaseColor
   gốc chỉ được thiết kế để chạy trên 1 hex đại diện (đã chọn bằng tần
   suất), giờ áp cho cả 12 hex riêng lẻ có thể ra kết quả khác biệt
   nhiều hơn kỳ vọng nếu màu user vẽ không "sạch" (pha trộn, gradient).
   ───────────────────────────────────────────── */
export function classifyHexToColorName(hex: string): ColorName | null {
  if (!hex || hex === "#ffffff" || hex === "#e5e7eb") return null;
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;

  if (g > r + 25 && g > b + 15) {
    if (g > 180) return "Chính Dương Lục";
    if (g > 140 && r < 60) return "Đế Vương Lục";
    if (g > 120) return "Xanh Ngọt";
    if (g > 90 && b > 60) return "Thanh Thủy Lục";
    if (g > 90) return "Lục Táo";
    return "Đậu Lục";
  }
  if (r > 100 && b > 100 && b > g + 20 && r > g + 10) return "Tử La Lan";
  if (r > 80 && b > r && b > g && Math.abs(r - b) < 80 && g < b - 10) return "Tím Lam";
  if (b > r + 40 && b > g + 20) return "Lam Thiên Không";
  if (b > g + 20 && b > r) return "Lam Thanh";
  if (r > 150 && g > 100 && b < 80) return "Hoàng Tông Phỉ";
  if (r > 150 && g < 80) return "Hồng Phỉ";
  if (r < 60 && g < 60 && b < 60) return "Mặc Thúy";
  if (r > 200 && g > 200 && b > 200) return "Bạch Nguyệt Quang";
  if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && r < 150) return "Xám";
  return "Đậu Lục";
}

export function classifySlices(ringColors: string[]): (ColorName | null)[] {
  return ringColors.map(classifyHexToColorName);
}

/**
 * extractColorSlices — kiến trúc "freeze": pricingEngine không biết gì
 * về narrative engine, chỉ nhận ringColors thô và tính giá như cũ.
 * Toàn bộ diễn giải slice (colorName + family) nằm ở đây, tách biệt.
 * Bỏ qua slice trắng/chưa tô (không throw — đó là trạng thái hợp lệ,
 * không phải lỗi mapping).
 */
export interface ColorSlice {
  index: number;
  hex: string;
  colorName: ColorName;
  family: ColorFamily;
}

export function extractColorSlices(ringColors: string[]): ColorSlice[] {
  const slices: ColorSlice[] = [];
  ringColors.forEach((hex, index) => {
    const colorName = classifyHexToColorName(hex);
    if (!colorName) return;
    slices.push({ index, hex, colorName, family: COLOR_FAMILY_MAP[colorName] });
  });
  return slices;
}

/* ─────────────────────────────────────────────
   2. PRIMARY COLOR ENGINE
   ───────────────────────────────────────────── */
export interface PrimaryColorResult {
  primary: ColorName;
  primaryProportion: number;
  secondary: ColorName | null;
  isBalanced: boolean;
  isMulti: boolean;
}

export function primaryColorEngine(colorSlices: ColorSlice[]): PrimaryColorResult | null {
  if (colorSlices.length === 0) return null;

  const counts = new Map<ColorName, number>();
  colorSlices.forEach((s) => counts.set(s.colorName, (counts.get(s.colorName) ?? 0) + 1));
  // Mẫu số dùng số slice thực sự đã tô (không phải cố định 12), vì
  // extractColorSlices đã lược bỏ slice trắng. Trong thực tế UI luôn
  // bắt tô đủ 12 múi trước khi submit nên 2 cách tính này gần như luôn
  // ra cùng kết quả — chỉ khác nếu có edge case chưa tô hết mà vẫn lọt qua.
  const total = colorSlices.length;
  const sorted = [...counts.entries()]
    .map(([name, count]) => ({ name, proportion: count / total }))
    .sort((a, b) => b.proportion - a.proportion);

  const [top, second] = sorted;
  const isMulti = sorted.length >= 3;

  if (top.proportion >= 0.55) {
    return {
      primary: top.name,
      primaryProportion: top.proportion,
      secondary: second?.name ?? null,
      isBalanced: false,
      isMulti,
    };
  }
  if (
    top.proportion >= 0.45 &&
    top.proportion <= 0.54 &&
    second &&
    Math.abs(top.proportion - second.proportion) <= 0.1
  ) {
    return {
      primary: top.name,
      primaryProportion: top.proportion,
      secondary: second.name,
      isBalanced: true,
      isMulti,
    };
  }
  return {
    primary: top.name,
    primaryProportion: top.proportion,
    secondary: second?.name ?? null,
    isBalanced: false,
    isMulti,
  };
}

/* ─────────────────────────────────────────────
   3. COLOR RELATIONSHIP ENGINE
   ───────────────────────────────────────────── */
const NEIGHBOR_FAMILIES: Partial<Record<ColorFamily, ColorFamily[]>> = {
  "Lục": ["Lam"],
  "Lam": ["Lục", "Tím"],
  "Tím": ["Lam"],
  "Hoàng": ["Hồng"],
  "Hồng": ["Hoàng"],
  "Bạch": ["TrungTính"],
  "TrungTính": ["Bạch", "Hắc"],
  "Hắc": ["TrungTính"],
};

function isSimilarFamily(a: ColorFamily, b: ColorFamily): boolean {
  if (a === b) return true;
  return NEIGHBOR_FAMILIES[a]?.includes(b) ?? false;
}

export type ColorRelationship =
  | "balanced_soft"
  | "balanced_contrast"
  | "primary_secondary_soft"
  | "primary_secondary_contrast"
  | "multicolor_primary"
  | "multicolor_balanced"
  | "single";

export function colorRelationshipEngine(result: PrimaryColorResult): ColorRelationship {
  if (!result.secondary) return "single";

  const famA = COLOR_FAMILY_MAP[result.primary];
  const famB = COLOR_FAMILY_MAP[result.secondary];
  const similar = isSimilarFamily(famA, famB);

  if (result.isMulti) {
    return result.primaryProportion > 0.55 ? "multicolor_primary" : "multicolor_balanced";
  }
  if (result.isBalanced) return similar ? "balanced_soft" : "balanced_contrast";
  return similar ? "primary_secondary_soft" : "primary_secondary_contrast";
}

/* ─────────────────────────────────────────────
   4. DISTRIBUTION ENGINE (12 slices)
   ───────────────────────────────────────────── */
export type DistributionPattern =
  | "Đều"
  | "Thành mảng"
  | "Loang nhẹ"
  | "Thành vệt"
  | "Điểm xuyết"
  | "Chuyển màu";

export function distributionEngine(slices: (ColorName | null)[]): DistributionPattern {
  // đếm contiguous regions (vòng tròn — slice cuối nối slice đầu)
  const n = slices.length;
  if (n === 0) return "Đều";

  let regions = 0;
  let longestStreak = 0;
  let currentStreak = 1;
  for (let i = 0; i < n; i++) {
    const cur = slices[i];
    const prev = slices[(i - 1 + n) % n];
    if (cur !== prev) regions++;
    if (cur === prev) currentStreak++;
    else {
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, currentStreak);
  regions = Math.max(regions, 1);

  const counts = new Map<ColorName | null, number>();
  slices.forEach((c) => counts.set(c, (counts.get(c) ?? 0) + 1));
  const dominantCount = Math.max(...counts.values());
  const dominantRatio = dominantCount / n;

  if (regions === 1) return "Đều";
  if (regions === 2) return "Thành mảng";
  if (regions <= 4) return longestStreak <= 3 ? "Loang nhẹ" : "Thành vệt";
  return dominantRatio >= 0.6 ? "Điểm xuyết" : "Chuyển màu";
}

/* ─────────────────────────────────────────────
   5. TRANSITION ENGINE (12 slices)
   ───────────────────────────────────────────── */
export type TransitionPattern = "Hòa quyện" | "Chuyển tiếp nhẹ" | "Ranh giới tương đối rõ" | "Tương phản mạnh";

export function transitionEngine(slices: (ColorName | null)[]): TransitionPattern {
  const n = slices.length;
  if (n < 2) return "Hòa quyện";

  let familySwitches = 0;
  let contrastingTouches = 0;
  for (let i = 0; i < n; i++) {
    const a = slices[i];
    const b = slices[(i + 1) % n];
    if (!a || !b || a === b) continue;
    const famA = COLOR_FAMILY_MAP[a];
    const famB = COLOR_FAMILY_MAP[b];
    if (famA !== famB) {
      familySwitches++;
      if (!isSimilarFamily(famA, famB)) contrastingTouches++;
    }
  }

  if (contrastingTouches > 2) return "Tương phản mạnh";
  if (familySwitches <= 1) return "Hòa quyện";
  if (familySwitches <= 3) return "Chuyển tiếp nhẹ";
  if (familySwitches <= 6) return "Ranh giới tương đối rõ";
  return "Tương phản mạnh";
}
