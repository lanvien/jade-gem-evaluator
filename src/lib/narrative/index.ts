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
import { EASTER_EGGS } from "@/content/jadeEasterEggs";
import { PERSONALITY_CARDS, type PersonalityCard } from "@/content/jadePersonality";
import { ROAST_CARDS, LEARN_CARDS, FUN_FACTS } from "@/content/jadeFeatureExtras";
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
  easterEgg: string;
  personalityCard: PersonalityCard | null;
  flavorCard: { label: string; text: string };
  structure: ReturnType<typeof generateStructureNarrative>;
  color: ReturnType<typeof generateColorNarrative>;
  inclusions: ReturnType<typeof generateInclusionNarrative>;
  form: ReturnType<typeof generateFormNarrative>;
  valuation: ReturnType<typeof generateValuationNarrative>;
  summary: ReturnType<typeof generateSummaryNarrative>;
  pricing: PricingResult;
}

function buildSeed(data: Record<string, any>): string {
  return JSON.stringify({
    t: data?.translucency ?? null,
    g: data?.grain ?? null,
    // Kiểm tra an toàn xem features có phải mảng không trước khi spread [...]
    f: Array.isArray(data?.features) ? [...data.features].sort() : [],
    a: data?.answers ?? {},
    n: data?.numberInputs ?? {},
    c: data?.ringColors ?? [],
  });
}

export function generateResultNarrative(surveyData: Record<string, any>): ResultNarrative | null {
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

// ── Ngự phê + Hashtag ──
  const nguPheList = NGU_PHE[tierKey] || [];
  const nguPhe = seededPick(nguPheList, seed + "|ngu-phe") ?? nguPheList[0] ?? "";
  
  const featureCodes: string[] = Array.isArray(surveyData?.features) ? surveyData.features : [];
  
  // Ép kiểu/Fallback an toàn cho Color & Shape
  const dominantColor = pricing?.dominantColor;
  const colorFamily = dominantColor && COLOR_FAMILY_MAP[dominantColor] 
    ? COLOR_FAMILY_MAP[dominantColor] 
    : Object.keys(COLOR_FAMILY_HASHTAGS)[0];

  const shape: Shape = input?.shape ?? "tron";

  const availableColorTags = COLOR_FAMILY_HASHTAGS[colorFamily] || ["#CẩmThạch"];
  const colorTag = featureCodes.includes("hoa_bay")
    ? HASHTAG_HOA_BAY
    : seededPick(availableColorTags, seed + "|color") ?? availableColorTags[0];

  const availableShapeTags = SHAPE_HASHTAGS[shape] || ["#VòngTay"];
  const shapeTag = seededPick(availableShapeTags, seed + "|shape") ?? availableShapeTags[0];

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
    shapeLabel: String(shape), // Bọc String() ở đây    
    positiveDrivers: valuation.positiveDrivers,
    negativeDrivers: valuation.negativeDrivers,
    band: valuation.band,
  });
  const allEggs = [...EASTER_EGGS.cafe, ...EASTER_EGGS.rumor, ...EASTER_EGGS.grandma, ...EASTER_EGGS.learn];
  const easterEgg = seededPick(allEggs, seed + "|egg") ?? allEggs[0] ?? "";
  const personalityCard: PersonalityCard | null = color.primary
    ? PERSONALITY_CARDS[color.primary] ?? null
    : null;

  const flavorCandidates: { label: string; text: string }[] = [
    ...EASTER_EGGS.cafe.map((text) => ({ label: "Quầy cà phê nói nhỏ", text })),
    ...EASTER_EGGS.rumor.map((text) => ({ label: "Tiệm ngọc đồn rằng", text })),
    ...EASTER_EGGS.grandma.map((text) => ({ label: "Bà ngoại duyệt", text })),
    ...EASTER_EGGS.learn.map((text) => ({ label: "30 giây học ngọc", text })),
  ];
  featureCodes.forEach((code) => {
    const learn = LEARN_CARDS[code];
    if (learn) flavorCandidates.push({ label: "30 giây học ngọc", text: learn });
    const facts = FUN_FACTS[code];
    if (facts) facts.forEach((text) => flavorCandidates.push({ label: "Fun fact", text }));
    const roast = ROAST_CARDS[code];
    if (roast) flavorCandidates.push({ label: "Bóc phốt nhẹ chiếc vòng", text: roast.hook });
  });
  const flavorCard =
    seededPick(flavorCandidates, seed + "|flavor") ?? { label: "Quầy cà phê nói nhỏ", text: allEggs[0] };
  
  return {
    seed,
    resultId,
    chung,
    tierKey,
    tierIndex,
    tierLabel: TIER_LABEL[tierKey] ?? "",
    nguPhe,
    hashtags: [colorTag, shapeTag] as [string, string],
    easterEgg,
    personalityCard,
    flavorCard,
    structure,
    color,
    inclusions,
    form,
    valuation,
    summary,
    pricing,
  };
}
