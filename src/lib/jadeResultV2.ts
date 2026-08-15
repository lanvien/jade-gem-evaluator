// ============================================================
// RESULT PIPELINE v2 — nguồn duy nhất cho trang Kết quả
// translucency + grain → CLASSIFICATION_MATRIX → chủng
//                     → CHUNG_TO_TIER → tier
//                     → Ngự phê + Hashtag + Phong kết cấu
// Toàn bộ nội dung lấy từ src/content/jadeContent.ts
// ============================================================
import {
  classifyChung,
  CHUNG_TO_TIER,
  CHUNG_DESCRIPTOR,
  TIER_LABEL,
  TIER_ORDER,
  NGU_PHE,
  HASHTAG_COLOR,
  HASHTAG_SHAPE,
  HASHTAG_HOA_BAY,
  FEATURES,
  CRACK_RED_WARNING,
  ATTENTION_RANK,
  hashSeed,
  seededPick,
  type ChungName,
  type ColorFamily,
  type FeatureContent,
  type GrainCode,
  type ShapeType,
  type TierKey,
  type TranslucencyCode,
} from "@/content/jadeContent";
import {
  buildJadeInputFromSurvey,
  calculateJadePrice,
  type PricingResult,
} from "@/lib/pricingEngine";

export interface JadeResultV2 {
  seed: string;
  resultId: string;
  translucency?: TranslucencyCode;
  grain?: GrainCode;
  chung: ChungName;
  tierKey: TierKey;
  tierIndex: number;
  tierLabel: string;
  nguPhe: string;
  hashtags: [string, string];
  colorFamily: ColorFamily;
  shapeType: ShapeType;
  features: FeatureContent[];
  positiveFeatures: FeatureContent[];
  attentionFeatures: FeatureContent[];
  hasCrack: boolean;
  crackWarning?: string;
  internalScore: number; // nội bộ — KHÔNG render ra UI
  cotText: string;
  sacText: string;
  noiTaiText: string;
  pricing: PricingResult;
  priceLow: number;
  priceHigh: number;
}

/* ── hex → color_family ── */
export function hexToColorFamily(hex: string): ColorFamily | null {
  if (!hex || hex === "#e5e7eb") return null;
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < 18) return max > 225 ? "khong_mau" : "trang";
  if (g >= r && g >= b) return "luc";
  if (b > r && b > g) return r > b - 45 ? "tim" : "luc";
  if (r > g && r > b) return g > 110 ? "vang" : b > 110 ? "tim" : "do_cam";
  return "trang";
}

function dominantColorFamily(ringColors: string[]): ColorFamily {
  const counts = new Map<ColorFamily, number>();
  ringColors.forEach((hex) => {
    const fam = hexToColorFamily(hex);
    if (fam) counts.set(fam, (counts.get(fam) ?? 0) + 1);
  });
  let best: ColorFamily = "trang";
  let bestN = -1;
  counts.forEach((n, fam) => {
    // ưu tiên sắc quý khi số lượng tương đương
    const weight = fam === "trang" || fam === "khong_mau" ? n * 0.6 : n;
    if (weight > bestN) { bestN = weight; best = fam; }
  });
  return best;
}

const SHAPE_ANSWER_TO_TYPE: Record<string, ShapeType> = {
  "10a": "ban_dua",
  "10b": "ban_he",
  "10c": "ban_vuong",
  "10d": "cham_khac",
};

/* ── seed ổn định theo dữ liệu khảo sát ── */
export function buildSeed(data: any): string {
  return JSON.stringify({
    t: data?.translucency ?? null,
    g: data?.grain ?? null,
    f: [...(data?.features ?? [])].sort(),
    a: data?.answers ?? {},
    n: data?.numberInputs ?? {},
    c: data?.ringColors ?? [],
  });
}

export function buildResultV2(data: any): JadeResultV2 | null {
  const translucency: TranslucencyCode | undefined = data?.translucency;
  const grain: GrainCode | undefined = data?.grain;
  const chung = classifyChung(translucency, grain);
  if (!chung) return null;

  const tierKey = CHUNG_TO_TIER[chung];
  const tierIndex = TIER_ORDER.indexOf(tierKey);

  const seed = buildSeed(data);
  const resultId = String(hashSeed(seed) % 90000 + 10000);

  const featureCodes: string[] = (data?.features ?? []).filter((c: string) => FEATURES[c]);
  const features = featureCodes.map((c) => FEATURES[c]);
  const positiveFeatures = features.filter((f) => f.aesthetic_effect === "positive");
  const attentionFeatures = features
    .filter((f) => f.aesthetic_effect !== "positive")
    .sort((a, b) => ATTENTION_RANK[b.durability_attention] - ATTENTION_RANK[a.durability_attention]);
  const hasCrack = featureCodes.includes("vet_nut");
  const internalScore = features.reduce((s, f) => s + f.internal_score, 0);

  // ── Ngự phê: chỉ trong pool của tier ──
  const nguPhe = seededPick(NGU_PHE[tierKey], seed + "|ngu-phe") ?? NGU_PHE[tierKey][0];

  // ── Hashtag: đúng 2 — 1 màu (hoặc hoa bay) + 1 dáng ──
  const ringColors: string[] = data?.ringColors ?? [];
  const colorFamily = dominantColorFamily(ringColors);
  const shapeType = SHAPE_ANSWER_TO_TYPE[data?.answers?.[10]] ?? "ban_dua";
  const colorTag = featureCodes.includes("hoa_bay")
    ? HASHTAG_HOA_BAY
    : seededPick(HASHTAG_COLOR[colorFamily], seed + "|color") ?? HASHTAG_COLOR[colorFamily][0];
  const shapeTag =
    seededPick(HASHTAG_SHAPE[shapeType], seed + "|shape") ?? HASHTAG_SHAPE[shapeType][0];

  // ── Giá ──
  const numberInputs = data?.numberInputs ?? {};
  const pricing = calculateJadePrice(
    buildJadeInputFromSurvey({
      ...data,
      ni: parseFloat(numberInputs[9]) || 56,
      chot: parseFloat(numberInputs[13]) || 8,
    }),
  );

  // ── Copy Cốt / Sắc / Nội tại — dựng từ content config ──
  const d = CHUNG_DESCRIPTOR[chung];
  const cotText = `Phẩm ngọc đạt chủng ${chung}. Cấu trúc ${d.grain}, chất ngọc ${d.texture} — mang lại ${d.value}.`;
  const sacText = `dải màu ${pricing.colorLabel}.`;
  const noiTaiText = attentionFeatures.length
    ? `Ghi nhận ${attentionFeatures.map((f) => f.name.toLowerCase()).join(", ")}. ${
        attentionFeatures[0].description
      }`
    : positiveFeatures.length
    ? `${positiveFeatures.map((f) => f.name).join(", ")}. ${positiveFeatures[0].description}`
    : "Không ghi nhận đặc điểm nội tại nào cần lưu ý. Bề mặt và lòng ngọc liền mạch.";

  return {
    seed,
    resultId,
    translucency,
    grain,
    chung,
    tierKey,
    tierIndex,
    tierLabel: TIER_LABEL[tierKey],
    nguPhe,
    hashtags: [colorTag, shapeTag],
    colorFamily,
    shapeType,
    features,
    positiveFeatures,
    attentionFeatures,
    hasCrack,
    crackWarning: hasCrack ? CRACK_RED_WARNING : undefined,
    internalScore,
    cotText,
    sacText,
    noiTaiText,
    pricing,
    priceLow: pricing.minPrice,
    priceHigh: pricing.maxPrice,
  };
}
