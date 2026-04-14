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
    title: "Phần chất ngọc trong nhất/đẹp nhất chiếm khoảng bao nhiêu diện tích chiếc vòng?",
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
    type: "single-choice",
    title: "Có đường nứt chạy xuyên trong lòng ngọc không?",
    hint: "Soi đèn pin từ đằng sau cách 2-3cm thẳng vào vòng.",
    options: [
      { id: "7a", label: "0 – Không có", multiplier: 1.0 },
      { id: "7b", label: "1 – Nứt mảnh < 3cm", multiplier: 0.85 },
      { id: "7c", label: "2 – Nứt rõ ≥ 3cm", multiplier: 0.7 },
      { id: "7d", label: "3 – Nhiều đường nứt hoặc giao cắt", multiplier: 0.5 },
    ],
  },
  {
    id: 8,
    category: "III. NỘI TẠI (Cấu Trúc & Tự Nhiên)",
    type: "single-choice",
    title: "Có các đường \"sớ\" hoặc gân chạy trong lòng ngọc không?",
    hint: "Ví dụ sớ, gân và chỉ màu.",
    options: [
      { id: "8a", label: "Không có", multiplier: 1.0 },
      { id: "8b", label: "Có nhẹ nhưng ngắn (<3cm)", multiplier: 0.85 },
      { id: "8c", label: "Có rõ, dài (≥3cm)", multiplier: 0.7 },
      { id: "8d", label: "Có đường dài và chạy xuyên vòng (ngang / chéo)", multiplier: 0.5 },
    ],
  },
  {
    id: 9,
    category: "III. NỘI TẠI (Cấu Trúc & Tự Nhiên)",
    type: "single-choice",
    title: "Có tạp chất li ti bên trong không?",
    hint: "Soi đèn pin xuyên qua thân vòng.",
    options: [
      { id: "9a", label: "[0] Không", multiplier: 1.0 },
      { id: "9b", label: "[1] Rất ít", multiplier: 0.9 },
      { id: "9c", label: "[2] Vừa phải", multiplier: 0.75 },
      { id: "9d", label: "[3] Nhiều", multiplier: 0.6 },
    ],
    subCheckbox: { label: "Có đốm trắng / Đốm đen", triggeredByIds: ["9b", "9c", "9d"] },
  },
  {
    id: 10,
    category: "III. NỘI TẠI (Cấu Trúc & Tự Nhiên)",
    type: "single-choice",
    title: "Bề mặt khi sờ có chỗ sần hoặc lõm không?",
    hint: "Dùng ngón tay lướt nhẹ trên bề mặt vòng.",
    options: [
      { id: "10a", label: "0 – Hoàn toàn mịn", multiplier: 1.0 },
      { id: "10b", label: "1 – Sần nhẹ (khó thấy bằng mắt, cảm nhận khi sờ)", multiplier: 0.85 },
      { id: "10c", label: "2 – Có lõm / sần rõ", multiplier: 0.7 },
      { id: "10d", label: "3 – Có mẻ hoặc khiếm khuyết đáng kể", multiplier: 0.5 },
    ],
  },

  // ===== IV. KÍCH THƯỚC & KIỂU DÁNG =====
  {
    id: 11,
    category: "IV. KÍCH THƯỚC & KIỂU DÁNG",
    type: "number-input",
    title: "Ni vòng (đường kính trong - mm)",
    hint: "Dùng thước kẹp (tốt nhất). Hoặc dùng thước thẳng đặt ngang lòng vòng. Hoặc đo chu vi bằng dây rồi chia cho 3.14.",
    inputUnit: "mm",
    inputHelpText: "Dùng thước kẹp: mở rộng ra và đặt vào lòng vòng, đọc số trên thước. Hoặc dùng thước thẳng đo khoảng cách bên trong vòng. Hoặc đo chu vi bằng dây rồi chia cho 3.14.",
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
    title: "Độ dày bản vòng - chột (mm)",
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
    title: "Tính pháp lý của ngọc",
    hint: "Kiểm tra giấy tờ đi kèm khi mua.",
    options: [
      { id: "14a", label: "Đã có giấy kiểm định uy tín (SJC, GIV, Liulab, hoặc chứng thư quốc tế)" },
      { id: "14b", label: "Có giấy nhưng chữ nước ngoài / không rõ nguồn gốc" },
      { id: "14c", label: "Chưa có giấy" },
    ],
    conditionalText: {
      triggeredByIds: ["14c"],
      text: "⚠️ Định giá chỉ mang tính tham khảo giả định đây là ngọc Type A (ngọc tự nhiên, chưa qua xử lý hóa học).",
    },
  },
];
