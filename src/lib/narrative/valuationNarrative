// ============================================================
// PHẨM GIÁ — narrative generator
// KHÔNG tự tính giá, KHÔNG tự tính score — chỉ đọc pricing đã có sẵn.
// ============================================================
import type { PricingResult } from "@/lib/pricingEngine";
import {
  valuationBandEngine,
  confidenceLabel,
  type ValuationBand,
  type ConfidenceLabel,
  type CleanlinessLevel,
  type ColorRelationship,
} from "./algorithms";

export interface ValuationNarrativeInput {
  pricing: PricingResult;
  chung: string; // ChungName — chỉ dùng để chọn driver text, không tính lại điểm
  cleanliness: CleanlinessLevel;
  hasCrack: boolean;
  colorRelationship: ColorRelationship | null;
}

export interface ValuationNarrativeResult {
  band: ValuationBand;
  paragraph: string;
  positiveDrivers: string[];
  negativeDrivers: string[];
  confidence: number;
  confidenceLabel: ConfidenceLabel;
}

// Priority order theo spec v1.1 mục 6-7.
const STRUCTURE_POSITIVE_CHUNG = new Set(["Nếp Băng", "Băng", "Cao Băng", "Thuỷ Tinh"]);

export function generateValuationNarrative(input: ValuationNarrativeInput): ValuationNarrativeResult {
  const { pricing, chung, cleanliness, hasCrack, colorRelationship } = input;
  const band = valuationBandEngine(pricing.qJade);

  const positiveDrivers: string[] = [];
  const negativeDrivers: string[] = [];

  // Positive priority: Cốt ngọc → Màu → Độ sạch → (Hình dáng/Kích thước: chờ formNarrative)
  if (STRUCTURE_POSITIVE_CHUNG.has(chung)) {
    positiveDrivers.push("cốt ngọc trong và liên kết chặt");
  }
  if (pricing.isImperialCandidate) {
    positiveDrivers.push("sắc màu thuộc nhóm giá trị cao");
  }
  if (pricing.xuanDaiTaiBonus) {
    positiveDrivers.push("kết hợp Lục và Tím hiếm gặp (Xuân Đới Tài)");
  }
  if (cleanliness === "Rất sạch" || cleanliness === "Sạch") {
    positiveDrivers.push("độ sạch nội tại tốt");
  }

  // Negative priority: Nứt → tạp chất nhiều → màu không đều → (dáng lệch: chờ formNarrative)
  if (hasCrack) {
    negativeDrivers.push("có vết nứt cần lưu ý");
  }
  if (cleanliness === "Nhiều" || cleanliness === "Rất nhiều") {
    negativeDrivers.push("tạp chất nội tại xuất hiện khá nhiều");
  }
  if (colorRelationship === "balanced_contrast" || colorRelationship === "primary_secondary_contrast") {
    negativeDrivers.push("sắc màu phân bố không hoàn toàn đồng nhất");
  }
  if (pricing.hardCapApplied) {
    negativeDrivers.push("chủng ngọc giới hạn mức giá trần bất kể sắc đẹp");
  }

  const p = positiveDrivers.slice(0, 3);
  const n = negativeDrivers.slice(0, 2);
  const paragraph = buildParagraph(band, p, n);

  return {
    band,
    paragraph,
    positiveDrivers: p,
    negativeDrivers: n,
    confidence: pricing.confidence,
    confidenceLabel: confidenceLabel(pricing.confidence),
  };
}

// Template nguyên văn mục 28 spec gốc.
function buildParagraph(band: ValuationBand, p: string[], n: string[]): string {
  if (band === "Strong") {
    return `Chiếc vòng nổi bật ở sự kết hợp giữa ${p.join(", ") || "nhiều yếu tố tích cực"}. Những yếu tố này tạo nền tảng tích cực cho giá trị tổng thể${
      n.length ? `, trong khi ${n[0]} là điểm cần cân nhắc khi đối chiếu với mặt bằng thị trường.` : "."
    }`;
  }
  if (band === "Balanced") {
    return `Giá trị của chiếc vòng đến từ sự cân bằng giữa ${p.join(", ") || "nhiều yếu tố"}. ${
      n.length
        ? `Một số đặc điểm như ${n.join(", ")} khiến mức giá cần được điều chỉnh tương ứng, tạo nên một khoảng định giá thay vì một con số tuyệt đối.`
        : "Mức giá được thể hiện dưới dạng khoảng thay vì một con số tuyệt đối."
    }`;
  }
  return `Chất ngọc vẫn sở hữu những điểm đáng chú ý như ${
    p[0] ?? "sắc màu và cấu trúc riêng"
  }, tuy nhiên ${n.join(" và ") || "một số đặc điểm"} có ảnh hưởng đáng kể đến giá trị thị trường. Vì vậy, mức giá ước tính nên được nhìn trong một khoảng thay vì xem như giá trị cố định.`;
}
