export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  multiplier?: number;
}

export type QuestionType =
  | "single-choice"
  | "color-ring"
  | "number-input"
  | "card-style"
  | "checkbox-legal";

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
  conditionalText?: { triggeredByIds: string[]; text: string };
}

export const SECTIONS = [
  { before: 1, label: "I. CỐT NGỌC (Kết cấu & Độ trong)" },
  { before: 4, label: "II. SẮC DIỆN (Màu sắc)" },
  { before: 7, label: "III. NỘI TẠI (Cấu Trúc & Tự Nhiên)" },
  { before: 11, label: "IV. KÍCH THƯỚC & KIỂU DÁNG" },
  { before: 14, label: "V. BỐI CẢNH GIAO DỊCH" },
];

export const questions: Question[] = [
  // ===== I. CỐT NGỌC =====
  {
    id: 1,
    category: "I. CỐT NGỌC (Kết cấu & Độ trong)",
    type: "single-choice",
    title: "Hạt tinh thể ngọc trông như thế nào?",
    hint: "Soi đèn pin từ cạnh cách 1-2cm vào vòng, không chiếu thẳng vào mặt.",
    options: [
      { id: "1a", label: "Hạt rất mịn (Băng)", description: "Không thấy hạt bằng mắt thường", multiplier: 1.0 },
      { id: "1b", label: "Hạt mịn (Nếp)", description: "Thấy hạt rất nhỏ li ti", multiplier: 0.85 },
      { id: "1c", label: "Hạt trung bình (Đậu)", description: "Thấy rõ các hạt nhỏ", multiplier: 0.65 },
    ],
  },
  {
    id: 2,
    category: "I. CỐT NGỌC (Kết cấu & Độ trong)",
    type: "single-choice",
    title: "Độ xuyên sáng (chất ngọc) trông thế nào?",
    hint: "Hướng vòng về phía cửa sổ (không phải chiếu ánh sáng trực diện).",
    options: [
      { id: "2a", label: "Trong suốt", description: "Ánh sáng xuyên qua hoàn toàn", multiplier: 1.0 },
      { id: "2b", label: "Bán trong", description: "Ánh sáng xuyên qua một phần", multiplier: 0.85 },
      { id: "2c", label: "Mờ đục", description: "Ánh sáng hầu như không xuyên qua", multiplier: 0.65 },
    ],
  },
  {
    id: 3,
    category: "I. CỐT NGỌC (Kết cấu & Độ trong)",
    type: "single-choice",
    title: "Ánh ngọc (luster) trông thế nào?",
    hint: "Quan sát bề mặt ngọc dưới ánh sáng tự nhiên.",
    options: [
      { id: "3a", label: "Ánh thủy tinh, bóng lóng lánh", description: "Bề mặt phản chiếu rõ ràng", multiplier: 1.0 },
      { id: "3b", label: "Ánh sáp, mượt mà", description: "Bề mặt mềm mại", multiplier: 0.85 },
      { id: "3c", label: "Ánh mờ, không bóng", description: "Bề mặt xỉn", multiplier: 0.7 },
      { id: "3d", label: "Không phân biệt được", description: "Chọn nếu bạn không chắc chắn", multiplier: 0.65 },
    ],
    rescueButton: { label: "Khó nhìn quá", autoSelectId: "3d" },
  },

  // ===== II. SẮC DIỆN =====
  {
    id: 4,
    category: "II. SẮC DIỆN (Màu sắc)",
    type: "color-ring",
    title: "Phân bố màu trên vòng ngọc",
    hint: "Chọn màu từ bảng palette rồi chạm vào múi trên vòng để tô màu.",
    options: [],
  },
  {
    id: 5,
    category: "II. SẮC DIỆN (Màu sắc)",
    type: "single-choice",
    title: "Độ bão hòa màu sắc như thế nào?",
    hint: "So sánh cường độ màu với hình mẫu.",
    options: [
      { id: "5a", label: "Rất đậm, sống động", multiplier: 1.0 },
      { id: "5b", label: "Trung bình", multiplier: 0.85 },
      { id: "5c", label: "Nhạt, phớt", multiplier: 0.65 },
    ],
  },
  {
    id: 6,
    category: "II. SẮC DIỆN (Màu sắc)",
    type: "single-choice",
    title: "Màu phân bố trên vòng như thế nào?",
    hint: "Xoay vòng 360 độ quan sát.",
    options: [
      { id: "6a", label: "Đều toàn vòng", multiplier: 1.0 },
      { id: "6b", label: "Loang từng mảng", multiplier: 0.85 },
      { id: "6c", label: "Chỉ một phần nhỏ", multiplier: 0.65 },
    ],
  },

  // ===== III. NỘI TẠI =====
  {
    id: 7,
    category: "III. NỘI TẠI (Cấu Trúc & Tự Nhiên)",
    type: "single-choice",
    title: "Bề mặt vòng có khuyết điểm gì không?",
    hint: "Dùng kính lúp hoặc soi đèn kiểm tra kỹ.",
    options: [
      { id: "7a", label: "Không có khuyết điểm", multiplier: 1.0 },
      { id: "7b", label: "Vài vết nhỏ, khó thấy", multiplier: 0.9 },
      { id: "7c", label: "Nhiều vết, thấy rõ", multiplier: 0.7 },
    ],
  },
  {
    id: 8,
    category: "III. NỘI TẠI (Cấu Trúc & Tự Nhiên)",
    type: "single-choice",
    title: "Hình dáng vòng có đều và tròn không?",
    hint: "Đặt vòng trên mặt phẳng và quan sát.",
    options: [
      { id: "8a", label: "Rất tròn đều", multiplier: 1.0 },
      { id: "8b", label: "Hơi méo nhẹ", multiplier: 0.9 },
      { id: "8c", label: "Méo rõ", multiplier: 0.7 },
    ],
  },
  {
    id: 9,
    category: "III. NỘI TẠI (Cấu Trúc & Tự Nhiên)",
    type: "single-choice",
    title: "Bên trong vòng có tạp chất không?",
    hint: "Soi đèn pin xuyên qua thân vòng.",
    options: [
      { id: "9a", label: "Không có tạp chất", multiplier: 1.0 },
      { id: "9b", label: "Có ít tạp chất nhỏ", multiplier: 0.85 },
      { id: "9c", label: "Có nhiều tạp chất rõ", multiplier: 0.65 },
    ],
    subCheckbox: { label: "Có đốm trắng / Đốm đen", triggeredByIds: ["9b", "9c"] },
  },
  {
    id: 10,
    category: "III. NỘI TẠI (Cấu Trúc & Tự Nhiên)",
    type: "single-choice",
    title: "Tiếng gõ ngọc nghe ra sao?",
    hint: "Dùng một thanh ngọc khác hoặc đồng xu gõ nhẹ.",
    options: [
      { id: "10a", label: "Trong veo, ngân dài", multiplier: 1.0 },
      { id: "10b", label: "Thanh nhẹ", multiplier: 0.85 },
      { id: "10c", label: "Đục, trầm", multiplier: 0.65 },
    ],
  },

  // ===== IV. KÍCH THƯỚC & KIỂU DÁNG =====
  {
    id: 11,
    category: "IV. KÍCH THƯỚC & KIỂU DÁNG",
    type: "number-input",
    title: "Đường kính trong (ni) của vòng?",
    hint: "Đo bằng thước kẹp từ mép trong đến mép trong.",
    inputUnit: "mm",
    inputHelpText: "Dùng thước kẹp: mở rộng ra và đặt vào lòng vòng, đọc số trên thước. Hoặc dùng thước thẳng đo khoảng cách bên trong vòng.",
    options: [],
  },
  {
    id: 12,
    category: "IV. KÍCH THƯỚC & KIỂU DÁNG",
    type: "card-style",
    title: "Kiểu dáng vòng ngọc?",
    hint: "So sánh mặt cắt ngang của vòng.",
    options: [
      { id: "12a", label: "Bản đũa", description: "Thân tròn, nhỏ gọn" },
      { id: "12b", label: "Bản hẹ", description: "Thân dẹp, bề mặt phẳng" },
      { id: "12c", label: "Bản vuông", description: "Thân vuông vức, dày dặn" },
      { id: "12d", label: "Khắc hoa", description: "Có hoa văn chạm khắc" },
    ],
  },
  {
    id: 13,
    category: "IV. KÍCH THƯỚC & KIỂU DÁNG",
    type: "number-input",
    title: "Độ dày thân vòng?",
    hint: "Đo phần mặt cắt ngang dày nhất của vòng.",
    inputUnit: "mm",
    inputHelpText: "Dùng thước kẹp kẹp vào phần dày nhất của thân vòng. Hoặc dùng thước thẳng đo từ mặt ngoài đến mặt trong.",
    options: [],
  },

  // ===== V. BỐI CẢNH GIAO DỊCH =====
  {
    id: 14,
    category: "V. BỐI CẢNH GIAO DỊCH",
    type: "checkbox-legal",
    title: "Giấy tờ đi kèm vòng ngọc?",
    hint: "Kiểm tra giấy tờ đi kèm khi mua.",
    options: [
      { id: "14a", label: "Có giấy kiểm định từ phòng lab uy tín (GIA, Lotus, DOJI...)" },
      { id: "14b", label: "Có giấy kiểm định nhưng không rõ nguồn gốc" },
      { id: "14c", label: "Chưa có giấy kiểm định" },
    ],
    conditionalText: {
      triggeredByIds: ["14c"],
      text: "⚠️ Định giá giả định đây là ngọc Type A (ngọc tự nhiên, chưa qua xử lý hóa học).",
    },
  },
];
