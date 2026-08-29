// ============================================================
// HÌNH ĐOAN — narrative generator
// Đọc THẲNG surveyData.numberInputs, KHÔNG qua pricingEngine/JadeInput
// (pricingEngine.chot phục vụ mục đích tính giá khác, không liên quan).
// Không dùng FORM_DICTIONARY (style Bình An/Thanh/Đầm/Tròn) — chưa có
// content pool đã duyệt cho việc này, theo freeze trước đó.
// ============================================================
import type { Shape } from "@/content/jadeContent";

// Nguyên văn spec mục 22-23.
const WIDTH_TEMPLATES = {
  "Thanh": "Bản vòng thanh gọn, tạo cảm giác nhẹ nhàng và tinh tế.",
  "Vừa": "Bản vòng cân đối, giữ được sự hiện diện vừa đủ mà không lấn át cổ tay.",
  "Rộng": "Bản vòng đầy đặn, tạo cảm giác đầm tay và có sức hiện diện rõ rệt.",
} as const;

const THICKNESS_TEMPLATES = {
  "Mỏng": "Thân vòng thanh, tạo cảm giác nhẹ và thoáng.",
  "Vừa": "Độ dày cân bằng giữa sự thanh thoát và cảm giác chắc tay.",
  "Dày": "Thân vòng đầy đặn, đem lại cảm giác chắc chắn và có trọng lượng thị giác rõ hơn.",
} as const;

// ⚠️ PROPOSED — spec chỉ cho tên nhãn (Thanh/Vừa/Rộng, Mỏng/Vừa/Dày),
// KHÔNG cho ngưỡng mm cụ thể. Ngưỡng dưới đây là đề xuất dựa trên kích
// thước vòng phỉ thúy phổ biến, CẦN M CONFIRM trước khi ship — sai
// ngưỡng ở đây không đổi giá (formNarrative không đụng pricing), nhưng
// đổi văn mô tả hiển thị cho user.
function widthLabel(mm: number): keyof typeof WIDTH_TEMPLATES {
  if (mm < 8) return "Thanh";
  if (mm <= 12) return "Vừa";
  return "Rộng";
}
function thicknessLabel(mm: number): keyof typeof THICKNESS_TEMPLATES {
  if (mm < 6) return "Mỏng";
  if (mm <= 9) return "Vừa";
  return "Dày";
}

// ⚠️ PROPOSED — symmetry không có input khảo sát riêng. Suy ra từ shape
// theo đề xuất trước đó (Bản Đũa/Bản Dẹt → hình dáng tròn đều tự nhiên
// cân đối hơn; Bản Vuông/Khắc Hoa → biến thiên nhiều hơn theo hình học).
// CẦN M CONFIRM — đây KHÔNG phải rule đã có trong content pool gốc.
function symmetryFromShape(shape: Shape): "Cao" | "Vừa" {
  return shape === "Bản Đũa" || shape === "Bản Dẹt" ? "Cao" : "Vừa";
}

const SYMMETRY_TEMPLATES = {
  "Cao": "Tỷ lệ và đường nét tương đối cân đối, tạo nên tổng thể hài hòa.",
  "Vừa": "Có một số biến thiên tự nhiên trong hình dáng nhưng tổng thể vẫn giữ được sự cân bằng.",
} as const;

export interface FormNarrativeInput {
  shape: Shape;
  ni: number; // numberInputs[9] — đường kính trong (mm)
  width: number; // numberInputs[13] — chột / chiều rộng bản (mm)
  thickness: number; // numberInputs[11] — độ dày bản vòng (mm)
}

export interface FormNarrativeResult {
  widthDescriptor: string;
  thicknessDescriptor: string;
  symmetryDescriptor: string;
  sizeSummary: string;
}

export function generateFormNarrative(input: FormNarrativeInput): FormNarrativeResult {
  const { shape, ni, width, thickness } = input;

  const widthDescriptor = WIDTH_TEMPLATES[widthLabel(width)];
  const thicknessDescriptor = THICKNESS_TEMPLATES[thicknessLabel(thickness)];
  const symmetryDescriptor = SYMMETRY_TEMPLATES[symmetryFromShape(shape)];

  // Mục 26 — không khen "vừa đẹp" theo size tuyệt đối, chỉ mô tả tương đối.
  // Không có PROPORTION_DESCRIPTOR đầy đủ câu trong spec (chỉ có nhãn:
  // thanh/cân đối/đầy đặn/bản rộng/bản mảnh) — dùng luôn nhãn ngắn thay
  // vì bịa câu văn không có trong content pool.
  const proportionLabel =
    width < 8 && thickness < 6 ? "thanh" : width > 12 && thickness > 9 ? "đầy đặn" : "cân đối";
  const sizeSummary = `Đường kính trong ${ni} mm, bản vòng ${width} mm, độ dày ${thickness} mm. Tỷ lệ này tạo nên một tổng thể ${proportionLabel}.`;

  return { widthDescriptor, thicknessDescriptor, symmetryDescriptor, sizeSummary };
}
