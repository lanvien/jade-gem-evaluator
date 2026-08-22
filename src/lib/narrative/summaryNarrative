// ============================================================
// SUMMARY — micro summary / top highlights / signature paragraph
// File DUY NHẤT được phép "ghép câu" tự do từ nhiều nguồn khác.
// ============================================================
import type { ValuationBand } from "./algorithms";

export interface SummaryNarrativeInput {
  chung: string;
  primaryColor: string | null;
  shapeLabel: string; // dùng shape thật (Bản Đũa...), KHÔNG dùng style Bình An/Thanh/Đầm/Tròn (chưa có data)
  positiveDrivers: string[];
  negativeDrivers: string[];
  band: ValuationBand;
}

export interface SummaryNarrativeResult {
  microSummary: string;
  highlights: string[];
  signature: string;
}

export function generateSummaryNarrative(input: SummaryNarrativeInput): SummaryNarrativeResult {
  const { chung, primaryColor, shapeLabel, positiveDrivers, negativeDrivers, band } = input;

  // Mục 35: {Classification} · {PrimaryColor} · {Form}
  const microSummary = [chung, primaryColor, shapeLabel].filter(Boolean).join(" · ");

  // Mục 36: top 3 bullet, ưu tiên positive trước, chỉ điền thêm negative nếu chưa đủ 3
  const highlights: string[] = positiveDrivers.slice(0, 3).map((d) => `✦ ${d}`);
  if (highlights.length < 3 && negativeDrivers.length) {
    negativeDrivers.slice(0, 3 - highlights.length).forEach((d) => highlights.push(`⚠ ${d}`));
  }

  // Mục 38 — nguyên văn 3 câu theo band, không viết thêm câu mới ngoài spec.
  let signature: string;
  if (band === "Strong") {
    signature =
      "Một tạo tác nổi bật ở nhiều phương diện, nơi chất ngọc, sắc màu và hình dáng cùng đạt được sự hài hòa hiếm có.";
  } else if (band === "Balanced") {
    signature =
      "Một vẻ đẹp thiên về sự hài hòa, nơi giá trị không nằm ở một đặc điểm duy nhất mà được tạo nên từ nhiều yếu tố cùng hiện diện.";
  } else {
    signature = `Một mẫu ngọc mang vẻ đẹp tự nhiên riêng, trong đó giá trị chủ yếu đến từ ${
      positiveDrivers[0] ?? "chất ngọc và sắc màu"
    }, đồng thời cần cân nhắc ${negativeDrivers[0] ?? "một số đặc điểm nội tại"} khi định giá.`;
  }

  return { microSummary, highlights, signature };
}
