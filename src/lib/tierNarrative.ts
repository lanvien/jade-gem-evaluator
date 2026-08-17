// ============================================================
// TIER NARRATIVE — chọn Ngự phê + Hashtag (narrative only)
// Nguồn nội dung DUY NHẤT: src/content/jadeContent.ts
// KHÔNG được chế thêm copy, KHÔNG fallback marketing text.
// Thiếu mapping → báo lỗi (throw ở dev).
// ============================================================
import {
  CHUNG_TO_TIER,
  NGU_PHE,
  HASHTAG_COLOR,
  HASHTAG_SHAPE,
  HASHTAG_HOA_BAY,
  TIER_LABEL,
  type ChungName,
  type ColorFamily,
  type ShapeType,
  type TierKey,
} from "@/content/jadeContent";
import type { ColorName, Shape } from "@/lib/pricingEngine";

const IS_DEV = typeof import.meta !== "undefined" && !!(import.meta as any).env?.DEV;

function fail(message: string): never | null {
  if (IS_DEV) throw new Error(message);
  console.error(message);
  return null;
}

/* ─────────────────────────────────────────────
   COLOR → COLOR FAMILY (chỉ những mapping ĐÃ ĐƯỢC CUNG CẤP)
   Các màu chưa có dữ liệu KHÔNG được đoán.
   ───────────────────────────────────────────── */
export const COLOR_TO_FAMILY: Partial<Record<ColorName, ColorFamily>> = {
  "Đế Vương Lục": "luc",
  "Chính Dương Lục": "luc",
  "Xanh Cay": "luc",
  "Xanh Ngọt": "luc",
  "Lục Táo": "luc",
  "Đậu Lục": "luc",
  "Thanh Thủy Lục": "luc",
  "Xanh Dầu": "luc",
  "Hồi Lục": "luc",
  "Tử La Lan": "tim",
  "Tím Cà": "tim",
};

/** Màu chưa có mapping content (báo cáo, không tự chế) */
export const MISSING_COLOR_MAPPINGS: ColorName[] = [
  "Tím Lam",
  "Lam Thiên Không",
  "Lam Thanh",
  "Lão Lam Thủy",
  "Hồng Phỉ",
  "Hoàng Tông Phỉ",
  "Mặc Thúy",
  "Bạch Nguyệt Quang",
  "Trắng Cháo",
  "Gà Đen",
  "Xám",
];

/* ─────────────────────────────────────────────
   SHAPE → HASHTAG_SHAPE key (nhãn khảo sát giữ nguyên)
   ───────────────────────────────────────────── */
export const SHAPE_LABEL_TO_TYPE: Record<string, ShapeType> = {
  "Bản đũa": "ban_dua",
  "Bản hẹ": "ban_he",
  "Bản vuông": "ban_vuong",
  "Khắc hoa": "cham_khac",
  // nhãn nội bộ của pricing engine (Shape)
  "Bản Đũa": "ban_dua",
  "Bản Dẹt": "ban_he",
  "Bản Vuông": "ban_vuong",
  "Khắc Hoa": "cham_khac",
};

/* ── deterministic pick trong pool (không phụ thuộc render) ── */
function pickFrom<T>(pool: T[]): T {
  return pool[Math.floor(Math.random() * pool.length)];
}

export interface NguPheResult {
  tier: TierKey;
  tierLabel: string;
  quote: string;
}

export function pickNguPhe(chung: ChungName): NguPheResult {
  const tier = CHUNG_TO_TIER[chung];
  if (!tier) {
    fail(`[Jade Content] Missing mapping for chung → tier: ${chung}`);
    return { tier: "thuong-tai", tierLabel: "", quote: "" };
  }
  const pool = NGU_PHE[tier];
  if (!pool || pool.length === 0) {
    fail(`[Jade Content] Missing NGU_PHE pool for tier: ${tier}`);
    return { tier, tierLabel: TIER_LABEL[tier], quote: "" };
  }
  return { tier, tierLabel: TIER_LABEL[tier], quote: pickFrom(pool) };
}

export interface HashtagArgs {
  dominantColor: ColorName;
  /** feature codes hoặc flaw labels đang áp dụng cho vòng */
  flaws: string[];
  /** nhãn dáng vòng (khảo sát hoặc pricing engine) */
  shape: Shape | string;
}

/** Trả về [colorTag, shapeTag]; phần tử null = thiếu mapping (không bịa copy) */
export function pickHashtags(args: HashtagArgs): [string | null, string | null] {
  const { dominantColor, flaws, shape } = args;

  // 1. Color tag — hoa bay được ưu tiên theo spec content
  let colorTag: string | null = null;
  if (flaws?.includes("hoa_bay")) {
    colorTag = HASHTAG_HOA_BAY;
  } else {
    const family = COLOR_TO_FAMILY[dominantColor];
    if (!family) {
      fail(`[Jade Content] Missing mapping for color: ${dominantColor}`);
    } else {
      const pool = HASHTAG_COLOR[family];
      if (!pool || pool.length === 0) {
        fail(`[Jade Content] Missing HASHTAG_COLOR pool for family: ${family}`);
      } else {
        colorTag = pickFrom(pool);
      }
    }
  }

  // 2. Shape tag
  let shapeTag: string | null = null;
  const shapeType = SHAPE_LABEL_TO_TYPE[shape as string];
  if (!shapeType) {
    fail(`[Jade Content] Missing mapping for shape: ${shape}`);
  } else {
    const pool = HASHTAG_SHAPE[shapeType];
    if (!pool || pool.length === 0) {
      fail(`[Jade Content] Missing HASHTAG_SHAPE pool for shape type: ${shapeType}`);
    } else {
      shapeTag = pickFrom(pool);
    }
  }

  return [colorTag, shapeTag];
}

/* ─────────────────────────────────────────────
   DEV-TIME VALIDATION — thiếu mapping thì kêu to
   ───────────────────────────────────────────── */
export function validateNarrativeContent(): string[] {
  const missing: string[] = [];
  MISSING_COLOR_MAPPINGS.forEach((c) =>
    missing.push(`[Jade Content] Missing mapping for color: ${c}`),
  );
  (Object.keys(HASHTAG_SHAPE) as ShapeType[]).forEach((k) => {
    if (!HASHTAG_SHAPE[k]?.length)
      missing.push(`[Jade Content] Missing HASHTAG_SHAPE pool for shape type: ${k}`);
  });
  (Object.keys(NGU_PHE) as TierKey[]).forEach((k) => {
    if (!NGU_PHE[k]?.length) missing.push(`[Jade Content] Missing NGU_PHE pool for tier: ${k}`);
  });
  return missing;
}

if (IS_DEV) {
  const missing = validateNarrativeContent();
  if (missing.length) console.warn("[Jade Content] Missing mappings:\n" + missing.join("\n"));
}
