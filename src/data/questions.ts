import {
  TRANSLUCENCY_OPTIONS,
  TRANSLUCENCY_QUESTION,
  GRAIN_OPTIONS,
  GRAIN_QUESTION,
  FEATURE_GROUPS,
} from "@/content/jadeContent";
import shape_dua from "@/assets/jade/shape_dua.png";
import shape_he from "@/assets/jade/shape_he.png";
import shape_vuong from "@/assets/jade/shape_vuong.png";
import shape_khac_hoa from "@/assets/jade/shape_khac_hoa.png";

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  short?: string;
  multiplier?: number;
  image?: string;
}

export type QuestionType =
  | "single-choice"
  | "translucency"
  | "grain"
  | "multi-feature"
  | "color-ring"
  | "number-input"
  | "multi-number"
  | "card-style"
  | "checkbox-legal";

export interface NumberField {
  key: number;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  helpText?: string;
}

export interface Question {
  id: number;
  category: string;
  type: QuestionType;
  title: string;
  hint: string;
  note?: string;
  featureCodes?: string[];
  options: QuestionOption[];
  rescueButton?: { label: string; autoSelectId: string };
  subCheckbox?: { label: string; triggeredByIds: string[] };
  inputUnit?: string;
  inputHelpText?: string;
  inputMin?: number;
  inputMax?: number;
  inputStep?: number;
  inputFields?: NumberField[];
  conditionalText?: { triggeredByIds: string[]; text: string };
}

export const SECTIONS = [
  { before: 1, label: "I. CỐT NGỌC (Kết cấu & Độ trong)" },
  { before: 4, label: "II. SẮC DIỆN (Màu sắc)" },
  { before: 20, label: "III. NỘI TẠI (Cấu Trúc & Tự Nhiên)" },
  { before: 10, label: "IV. KÍCH THƯỚC & KIỂU DÁNG" },
  { before: 12, label: "V. BỐI CẢNH GIAO DỊCH" },
];

export const questions: Question[] = [
  // ===== I. CỐT NGỌC =====
  {
    id: 1,
    category: "I. CỐT NGỌC (Kết cấu & Độ trong)",
    type: "translucency",
    title: TRANSLUCENCY_QUESTION.title,
    hint: TRANSLUCENCY_QUESTION.hint,
    note: TRANSLUCENCY_QUESTION.note,
    options: TRANSLUCENCY_OPTIONS.map((o) => ({
      id: o.code,
      label: o.label,
      description: o.description,
      short: o.short,
      image: o.image,
    })),
  },
  {
    id: 2,
    category: "I. CỐT NGỌC (Kết cấu & Độ trong)",
    type: "grain",
    title: GRAIN_QUESTION.title,
    hint: GRAIN_QUESTION.hint,
    options: GRAIN_OPTIONS.map((o) => ({
      id: o.code,
      label: o.label,
      description: o.description,
      short: o.short,
      image: o.image,
    })),
  },
  {
    id: 3,
    category: "I. CỐT NGỌC (Kết cấu & Độ trong)",
    type: "single-choice",
    title: "Phần chất ngọc trong nhất/đẹp nhất bạn vừa đánh giá ở trên chiếm khoảng bao nhiêu diện tích chiếc vòng?",
    hint: "",
    options: [
      { id: "3a", label: "[A] Đều tăm tắp 100%", description: "Cả vòng đều đẹp như vậy.", multiplier: 1.0 },
      { id: "3b", label: "[B] Đa số (Hơn 70%)", description: "Phần lớn chiếc vòng đạt chất lượng đó, còn lại đục hơn một chút.", multiplier: 0.85 },
      { id: "3c", label: "[C] Một nửa (Hơn 50%)", description: "Hơn nửa chiếc vòng đạt chất lượng đó, còn lại đục hơn một chút.", multiplier: 0.7 },
      { id: "3d", label: "[D] Thiểu số (Dưới 30%)", description: "Chỉ có một đoạn nhỏ là đạt độ trong đó, phần lớn vòng là nền đục/khô.", multiplier: 0.5 },
    ],
  },

  // ===== II. SẮC DIỆN =====
  {
    id: 4,
    category: "II. SẮC DIỆN (Màu sắc)",
    type: "color-ring",
    title: "Diện mạo chiếc vòng: Tô màu & chọn độ đậm cho từng sắc",
    hint: "Chọn màu từ bảng → tô vào múi vòng → chọn [Nhạt] [Vừa] [Đậm] cho từng sắc đã dùng.",
    options: [],
  },

  // ===== III. NỘI TẠI — multi-select theo FEATURE_GROUPS (v2) =====
  ...FEATURE_GROUPS.map((g, i) => ({
    id: 20 + i,
    category: "III. NỘI TẠI (Cấu Trúc & Tự Nhiên)",
    type: "multi-feature" as const,
    title: g.title,
    hint: g.hint,
    options: [],
    featureCodes: g.codes,
  })),



  // ===== IV. KÍCH THƯỚC & KIỂU DÁNG =====
  {
    id: 10,
    category: "IV. KÍCH THƯỚC & KIỂU DÁNG",
    type: "card-style",
    title: "Kiểu dáng vòng ngọc?",
    hint: "So sánh mặt cắt ngang của vòng.",
    options: [
      { id: "10a", label: "Bản đũa", description: "Tròn đều, bo tròn toàn bộ các cạnh.", image: shape_dua },
      { id: "10b", label: "Bản hẹ", description: "Mặt ngoài vòm, mặt trong phẳng hoặc cong rất nhẹ.", image: shape_he },
      { id: "10c", label: "Bản vuông", description: "Vòng đúc vuông cạnh, dày dặn và cầm chắc tay.", image: shape_vuong },
      { id: "10d", label: "Khắc hoa", description: "Vòng được chạm trổ hoa văn, long phụng chìm nổi tỉ mỉ.", image: shape_khac_hoa },
    ],
  },
  // MERGED: Ni + Chột + Dày in one step
  {
    id: 9,
    category: "IV. KÍCH THƯỚC & KIỂU DÁNG",
    type: "multi-number",
    title: "Kích thước vòng (mm)",
    hint: "Dùng thước kẹp đo cả 3 thông số: đường kính trong, chiều rộng bản và độ dày.",
    options: [],
    inputFields: [
      { key: 9, label: "Ni vòng (đường kính trong)", unit: "mm", min: 47, max: 65, step: 0.5 },
      { key: 13, label: "Chột (chiều rộng bản)", unit: "mm", min: 6, max: 22, step: 0.5, helpText: "Bề ngang của bản vòng nhìn từ trên xuống." },
      { key: 11, label: "Độ dày bản vòng", unit: "mm", min: 6, max: 18, step: 0.5, helpText: "Đo cạnh dày nhất của thân vòng." },
    ],
  },

  // ===== V. BỐI CẢNH GIAO DỊCH =====
  {
    id: 12,
    category: "V. BỐI CẢNH GIAO DỊCH",
    type: "checkbox-legal",
    title: "Tính pháp lý của ngọc",
    hint: "Kiểm tra giấy tờ đi kèm khi mua.",
    options: [
      { id: "12a", label: "Đã có giấy kiểm định uy tín (SJC, GIV, Liulab, hoặc chứng thư quốc tế)" },
      { id: "12b", label: "Có giấy nhưng chữ nước ngoài / không rõ nguồn gốc" },
      { id: "12c", label: "Chưa có giấy" },
    ],
    conditionalText: {
      triggeredByIds: ["12c"],
      text: "⚠️ Định giá chỉ mang tính tham khảo giả định đây là ngọc Type A (ngọc tự nhiên, chưa qua xử lý hóa học).",
    },
  },
];
