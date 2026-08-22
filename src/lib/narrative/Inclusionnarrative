// ============================================================
// DẤU ẤN THỜI GIAN — narrative generator
// Pipeline: features[] → cleanlinessEngine() → group → paragraphs
// ============================================================
import { FEATURES, CRACK_RED_WARNING, ATTENTION_RANK, type FeatureContent } from "@/content/jadeContent";
import { cleanlinessEngine, type CleanlinessLevel } from "./algorithms";

// Nguyên văn spec "RESULT NARRATIVE SYSTEM" mục 15.
const CLEANLINESS_TEMPLATES: Record<CleanlinessLevel, string> = {
  "Rất sạch":
    "Lòng ngọc tương đối sạch, ít chi tiết làm gián đoạn diện nhìn. Nhờ vậy, màu sắc và chất ngọc có điều kiện được phô diễn trọn vẹn.",
  "Sạch":
    "Lòng ngọc khá sạch, chỉ xuất hiện một lượng nhỏ dấu vết tự nhiên và không làm thay đổi đáng kể tổng thể.",
  "Khá":
    "Một số dấu vết tự nhiên có thể quan sát được trong lòng ngọc, tạo nên những điểm chuyển động nhưng vẫn giữ được sự hài hòa chung.",
  "Nhiều":
    "Nhiều đặc điểm bên trong có thể quan sát được, khiến độ sạch thị giác giảm xuống nhưng đồng thời làm cấu trúc tự nhiên của khối đá biểu hiện rõ hơn.",
  "Rất nhiều":
    "Các đặc điểm bên trong hiện diện khá rõ và trở thành một phần đáng kể của diện ngọc. Đây là yếu tố cần được cân nhắc riêng trong đánh giá tổng thể và định giá.",
};

export interface InclusionNarrativeResult {
  cleanliness: CleanlinessLevel;
  summary: string;
  positiveFeatures: FeatureContent[];
  attentionFeatures: FeatureContent[];
  crackWarning?: string;
  hasCrack: boolean;
}

function groupPositiveFeatures(features: FeatureContent[]): FeatureContent[] {
  return features.filter((f) => f.aesthetic_effect === "positive");
}

function groupAttentionFeatures(features: FeatureContent[]): FeatureContent[] {
  return features
    .filter((f) => f.aesthetic_effect !== "positive")
    .sort((a, b) => ATTENTION_RANK[b.durability_attention] - ATTENTION_RANK[a.durability_attention]);
}

/**
 * generateCleanlinessParagraph — theo mục 19 "DẤU ẤN THỜI GIAN — COMBINED
 * TEMPLATE" của spec gốc: chọn 1 trong 4 case tuỳ tổ hợp cleanliness ×
 * hasCrack, thay vì chỉ dùng CLEANLINESS_TEMPLATES đơn lẻ.
 */
function generateCleanlinessParagraph(
  cleanliness: CleanlinessLevel,
  hasCrack: boolean,
  attentionCount: number,
): string {
  if (hasCrack) {
    return "Một số dấu hiệu cấu trúc có thể quan sát được trong lòng ngọc. Bên cạnh việc tạo nên dấu ấn riêng, đây cũng là yếu tố cần được lưu ý khi sử dụng, bảo quản và định giá.";
  }
  if (cleanliness === "Rất sạch") {
    return "Lòng ngọc khá sạch, ít dấu vết làm gián đoạn diện nhìn. Nhờ vậy, màu sắc và chất ngọc được phô diễn rõ ràng, tạo nên tổng thể thanh sạch và tập trung.";
  }
  if ((cleanliness === "Sạch" || cleanliness === "Khá") && attentionCount > 0) {
    return "Lòng ngọc tương đối sạch, chỉ lưu lại một vài dấu sớ và tạp chất nhỏ. Những dấu vết ấy không làm lu mờ tổng thể mà trở thành những chi tiết riêng biệt, khiến khối đá giữ được cảm giác tự nhiên và không hoàn toàn giống bất kỳ khối nào khác.";
  }
  if (cleanliness === "Nhiều" || cleanliness === "Rất nhiều") {
    return "Các đặc điểm tự nhiên bên trong hiện diện khá rõ, tạo nên một diện ngọc giàu chi tiết. Tuy nhiên, độ sạch thị giác vì thế giảm xuống và đây là yếu tố đã được đưa vào đánh giá tổng thể.";
  }
  // fallback: dùng đúng template cleanliness gốc (mục 15) nếu không khớp case nào ở trên
  return CLEANLINESS_TEMPLATES[cleanliness];
}

/**
 * generateWarningParagraph — priority rule mục 12 spec v1.1: crack luôn
 * đứng đầu, không bao giờ bị chìm dưới đoạn văn "nịnh". Ở đây thể hiện
 * bằng cách trả crackWarning riêng, để Results.tsx BẮT BUỘC render nó
 * trước các feature card khác (không gộp chung vào summary).
 */
function generateWarningParagraph(hasCrack: boolean): string | undefined {
  return hasCrack ? CRACK_RED_WARNING : undefined;
}

export function generateInclusionNarrative(featureCodes: string[]): InclusionNarrativeResult {
  const features = featureCodes.filter((c) => FEATURES[c]).map((c) => FEATURES[c]);
  const { level: cleanliness } = cleanlinessEngine(featureCodes);
  const hasCrack = featureCodes.includes("vet_nut");

  const positiveFeatures = groupPositiveFeatures(features);
  const attentionFeatures = groupAttentionFeatures(features);

  const summary = generateCleanlinessParagraph(cleanliness, hasCrack, attentionFeatures.length);
  const crackWarning = generateWarningParagraph(hasCrack);

  return {
    cleanliness,
    summary,
    positiveFeatures,
    attentionFeatures,
    crackWarning,
    hasCrack,
  };
}
