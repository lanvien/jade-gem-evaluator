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
  multiplier?: number;
  image?: string;
}

export type QuestionType =
  | "single-choice"
  | "color-ring"
  | "number-input"
  | "multi-number"
  | "card-style"
  | "checkbox-legal"
  | "surface-check"
  | "pattern-structure";

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
  { before: 7, label: "III. NỘI TẠI (Cấu Trúc & Tự Nhiên)" },
  { before: 10, label: "IV. KÍCH THƯỚC & KIỂU DÁNG" },
  { before: 12, label: "V. BỐI CẢNH GIAO DỊCH" },
];

export const questions: Question[] = [
  // ===== I. CỐT NGỌC =====
  {
    id: 1,
    category: "I. CỐT NGỌC (Kết cấu & Độ trong)",
    type: "single-choice",
    title: "Hạt tinh thể ngọc trông như thế nào?",
    hint: "Soi đèn pin từ cạnh cách 1-2cm vào vòng, không chiếu thẳng vào mắt.",
    options: [
      { id: "1a", label: "Hạt thô, nhìn rõ cấu trúc lấm tấm", description: "Xếp chồng như đậu nấu chín", multiplier: 0.65, image: q1_dau },
      { id: "1b", label: "Không thấy hạt riêng lẻ, cấu trúc mịn, đặc", description: "Giống sứ hoặc cháo nhuyễn", multiplier: 0.85, image: q1_nep },
      { id: "1c", label: "Tinh thể mịn như sương vừa bị đông lại", description: "Giống bông tuyết bị làm mờ đi trong kính", multiplier: 1.0, image: q1_nbang },
    ],
  },
  {
    id: 2,
    category: "I. CỐT NGỌC (Kết cấu & Độ trong)",
    type: "single-choice",
    title: "Độ xuyên sáng (chất ngọc) trông thế nào?",
    hint: "Hướng vòng về phía cửa sổ (không phải chiếu ánh sáng trực diện).",
    options: [
      { id: "2a", label: "Đục hoàn toàn, không xuyên sáng", description: "Nhìn có cảm giác khô với hạt lấm tấm", multiplier: 0.5, image: q2_dau },
      { id: "2b", label: "Đục gần như hoàn toàn", description: "Chỉ lóe sáng nhẹ khi đưa sát nguồn sáng", multiplier: 0.65, image: q2_nep },
      { id: "2c", label: "Xuyên sáng vừa phải", description: "Nhìn như nước vo gạo; áp sát ngón tay phía sau thấy bóng mờ", multiplier: 0.85, image: q2_nbang },
      { id: "2d", label: "Xuyên sáng rõ, có chiều sâu", description: "Như viên đá lạnh; thấy đường viền ngón tay tương đối rõ", multiplier: 1.0, image: q2_bang },
    ],
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

  // ===== III. NỘI TẠI =====
  {
    id: 7,
    category: "III. NỘI TẠI (Cấu Trúc & Tự Nhiên)",
    type: "surface-check",
    title: "1. Kiểm tra Bề Mặt (Cảm giác tay)",
    hint: "Dùng móng tay cà nhẹ quanh bản vòng (mặt trong và ngoài).",
    options: [
      { id: "7a", label: "Mượt hoàn toàn", description: "Không thấy vấp hay khựng ở đâu.", multiplier: 1.0 },
      { id: "7b", label: "Vết sần/Lõm", description: "Cảm giác hơi hụt tay nhưng không sắc cạnh.", multiplier: 0.7, image: q5_san_lom },
      { id: "7c", label: "Vết nứt cấn tay", description: "Móng tay bị vướng/vấp lại rõ rệt.", multiplier: 0.5, image: q5_vet_nut },
    ],
  },
  {
    id: 8,
    category: "III. NỘI TẠI (Cấu Trúc & Tự Nhiên)",
    type: "pattern-structure",
    title: "2. Kiểm tra Họa Tiết & Cấu Trúc (Soi đèn)",
    hint: "Bấm vào (i) để xem thêm thông tin…",
    options: [],
  },

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
