// ============================================================
// index.ts — ORCHESTRATOR DUY NHẤT
// Results.tsx chỉ gọi generateResultNarrative(), không tự build string.
// ============================================================
import {
  classifyChung,
  CHUNG_TO_TIER,
  TIER_LABEL,
  TIER_ORDER,
  NGU_PHE,
  COLOR_FAMILY_MAP,
  COLOR_FAMILY_HASHTAGS,
  SHAPE_HASHTAGS,
  HASHTAG_HOA_BAY,
  hashSeed,
  seededPick,
  type ChungName,
  type GrainCode,
  type Shape,
  type TierKey,
  type TranslucencyCode,
} from "@/content/jadeContent";
import { buildJadeInputFromSurvey, calculateJadePrice, type PricingResult } from "@/lib/pricingEngine";
import { generateStructureNarrative } from "./structureNarrative";
import { generateColorNarrative } from "./colorNarrative";
import { generateInclusionNarrative } from "./inclusionNarrative";
import { generateFormNarrative } from "./formNarrative";
import { generateValuationNarrative } from "./valuationNarrative";
import { generateSummaryNarrative } from "./summaryNarrative";

export interface ResultNarrative {
  seed: string;
  resultId: string;
  chung: ChungName;
  tierKey: TierKey;
  tierIndex: number;
  tierLabel: string;
  nguPhe: string;
  hashtags: [string, string];
  structure: ReturnType<typeof generateStructureNarrative>;
  color: ReturnType<typeof generateColorNarrative>;
  inclusions: ReturnType<typeof generateInclusionNarrative>;
  form: ReturnType<typeof generateFormNarrative>;
  valuation: ReturnType<typeof generateValuationNarrative>;
  summary: ReturnType<typeof generateSummaryNarrative>;
  pricing: PricingResult;
}

function buildSeed(data: any): string {
  return JSON.stringify({
    t: data?.translucency ?? null,
    g: data?.grain ?? null,
    f: [...(data?.features ?? [])].sort(),
    a: data?.answers ?? {},
    n: data?.numberInputs ?? {},
    c: data?.ringColors ?? [],
  });
}

export function generateResultNarrative(surveyData: any): ResultNarrative | null {
  const translucency: TranslucencyCode | undefined = surveyData?.translucency;
  const grain: GrainCode | undefined = surveyData?.grain;
  const chung = classifyChung(translucency, grain);
  if (!chung) return null;

  const tierKey = CHUNG_TO_TIER[chung];
  const tierIndex = TIER_ORDER.indexOf(tierKey);
  const seed = buildSeed(surveyData);
  const resultId = String((hashSeed(seed) % 90000) + 10000);

  // ── Giá — tính 1 lần, mọi module khác chỉ đọc, không tính lại ──
  const numberInputs = surveyData?.numberInputs ?? {};
  const input = buildJadeInputFromSurvey({
    ...surveyData,
    ni: parseFloat(numberInputs[9]) || 56,
    chot: parseFloat(numberInputs[13]) || 8,
  });
  const pricing = calculateJadePrice(input);

  // ── Ngự phê + Hashtag — sampled ONCE, seeded (rule 13 spec v1.1:
  // đây là 3 nguồn random hợp lệ duy nhất, phải cache lại) ──
  const nguPhe = seededPick(NGU_PHE[tierKey], seed + "|ngu-phe") ?? NGU_PHE[tierKey][0];
  const featureCodes: string[] = surveyData?.features ?? [];
  const colorFamily = COLOR_FAMILY_MAP[pricing.dominantColor];
  const shape = input.shape;
  const colorTag = featureCodes.includes("hoa_bay")
    ? HASHTAG_HOA_BAY
    : seededPick(COLOR_FAMILY_HASHTAGS[colorFamily], seed + "|color") ??
      COLOR_FAMILY_HASHTAGS[colorFamily][0];
  const shapeTag = seededPick(SHAPE_HASHTAGS[shape], seed + "|shape") ?? SHAPE_HASHTAGS[shape][0];

  // ── 5 narrative generator ──
  const structure = generateStructureNarrative(chung, grain);
  const color = generateColorNarrative(surveyData?.ringColors ?? []);
  const inclusions = generateInclusionNarrative(featureCodes);
  const form = generateFormNarrative({
    shape,
    ni: parseFloat(numberInputs[9]) || 0,
    width: parseFloat(numberInputs[13]) || 0,
    thickness: parseFloat(numberInputs[11]) || 0,
  });
  const valuation = generateValuationNarrative({
    pricing,
    chung,
    cleanliness: inclusions.cleanliness,
    hasCrack: inclusions.hasCrack,
    colorRelationship: color.relationship,
  });
  const summary = generateSummaryNarrative({
    chung,
    primaryColor: color.primary,
    shapeLabel: shape,
    positiveDrivers: valuation.positiveDrivers,
    negativeDrivers: valuation.negativeDrivers,
    band: valuation.band,
  });

  return {
    seed,
    resultId,
    chung,
    tierKey,
    tierIndex,
    tierLabel: TIER_LABEL[tierKey],
    nguPhe,
    hashtags: [colorTag, shapeTag],
    structure,
    color,
    inclusions,
    form,
    valuation,
    summary,
    pricing,
  };
}
