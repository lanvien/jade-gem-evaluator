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
  | "checkbox-legal"
  | "surface-check"
  | "pattern-structure";

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
  { before: 9, label: "IV. KÍCH THƯỚC & KIỂU DÁNG" },
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
      { id: "1a", label: "Hạt thô, nhìn rõ cấu trúc lấm tấm", description: "Xếp chồng như đậu nấu chín", multiplier: 0.65 },
      { id: "1b", label: "Không thấy hạt riêng lẻ, cấu trúc mịn, đặc", description: "Giống sứ hoặc cháo nhuyễn", multiplier: 0.85 },
      { id: "1c", label: "Tinh thể mịn như sương vừa bị đông lại", description: "Giống bông tuyết bị làm mờ đi trong kính", multiplier: 1.0 },
    ],
  },
  {
    id: 2,
    category: "I. CỐT NGỌC (Kết cấu & Độ trong)",
    type: "single-choice",
    title: "Độ xuyên sáng (chất ngọc) trông thế nào?",
    hint: "Hướng vòng về phía cửa sổ (không phải chiếu ánh sáng trực diện).",
    options: [
      { id: "2a", label: "Đục hoàn toàn, không xuyên sáng", description: "Nhìn có cảm giác khô với hạt lấm tấm", multiplier: 0.5 },
      { id: "2b", label: "Đục gần như hoàn toàn", description: "Chỉ lóe sáng nhẹ khi đưa sát nguồn sáng", multiplier: 0.65 },
      { id: "2c", label: "Xuyên sáng vừa phải", description: "Nhìn như nước vo gạo; áp sát ngón tay phía sau thấy bóng mờ", multiplier: 0.85 },
      { id: "2d", label: "Xuyên sáng rõ, có chiều sâu", description: "Như viên đá lạnh; thấy đường viền ngón tay tương đối rõ", multiplier: 1.0 },
    ],
  },
  {
    id: 3,
    category: "I. CỐT NGỌC (Kết cấu & Độ trong)",
    type: "single-choice",
    title: "Phần chất ngọc trong nhất/đẹp nhất bạn vừa đánh giá ở trên chiếm khoảng bao nhiêu diện tích chiếc vòng?",
    hint: "Xoay vòng 360° quan sát tổng thể.",
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
    title: "Diện mạo chiếc vòng: Nhìn tổng thể, màu sắc phân bổ theo kiểu nào?",
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
    type: "surface-check",
    title: "1. Kiểm tra Bề Mặt (Cảm giác tay)",
    hint: "Dùng móng tay cà nhẹ quanh bản vòng (mặt trong và ngoài).",
    options: [
      { id: "7a", label: "Mượt hoàn toàn", description: "Không thấy vấp hay khựng ở đâu.", multiplier: 1.0 },
      { id: "7b", label: "Vết sần/Lõm", description: "Cảm giác hơi hụt tay nhưng không sắc cạnh.", multiplier: 0.7 },
      { id: "7c", label: "Vết nứt cấn tay", description: "Móng tay bị vướng/vấp lại rõ rệt.", multiplier: 0.5 },
    ],
  },
  {
    id: 8,
    category: "III. NỘI TẠI (Cấu Trúc & Tự Nhiên)",
    type: "pattern-structure",
    title: "2. Kiểm tra Họa Tiết & Cấu Trúc (Soi đèn)",
    hint: "Nếu thấy nhiều đường kẻ, hãy Zoom ảnh mẫu để đối chiếu chính xác nhất.",
    options: [],
  },

  // ===== IV. KÍCH THƯỚC & KIỂU DÁNG =====
  {
    id: 9,
    category: "IV. KÍCH THƯỚC & KIỂU DÁNG",
    type: "number-input",
    title: "Ni vòng (đường kính trong - mm)",
    hint: "Dùng thước kẹp (tốt nhất). Hoặc dùng thước thẳng đặt ngang lòng vòng. Hoặc đo chu vi bằng dây rồi chia cho 3.14.",
    inputUnit: "mm",
    inputHelpText: "Dùng thước kẹp: mở rộng ra và đặt vào lòng vòng, đọc số trên thước.",
    options: [],
  },
  {
    id: 10,
    category: "IV. KÍCH THƯỚC & KIỂU DÁNG",
    type: "card-style",
    title: "Kiểu dáng vòng ngọc?",
    hint: "So sánh mặt cắt ngang của vòng.",
    options: [
      { id: "10a", label: "Bản đũa", description: "Thân tròn, nhỏ gọn" },
      { id: "10b", label: "Bản hẹ", description: "Thân dẹp, bề mặt phẳng" },
      { id: "10c", label: "Bản vuông", description: "Thân vuông vức, dày dặn" },
      { id: "10d", label: "Khắc hoa", description: "Có hoa văn chạm khắc" },
    ],
  },
  {
    id: 11,
    category: "IV. KÍCH THƯỚC & KIỂU DÁNG",
    type: "number-input",
    title: "Độ dày bản vòng - chột (mm)",
    hint: "Đo phần mặt cắt ngang dày nhất của vòng.",
    inputUnit: "mm",
    inputHelpText: "Dùng thước kẹp kẹp vào phần dày nhất của thân vòng.",
    options: [],
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
